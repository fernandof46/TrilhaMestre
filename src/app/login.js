// src/app/login.js
// Importa o React e os hooks necessários: useEffect (ciclo de vida), useRef (referências sem re-renderizar) e useState (estado local).
import React, { useEffect, useRef, useState } from 'react';
// Importa os componentes visuais e utilitários nativos do React Native usados na interface da tela de login.
import {
  Image, // Componente para exibir o logotipo do aplicativo.
  Keyboard, // API nativa para fechar o teclado virtual ao tocar fora dos campos.
  KeyboardAvoidingView, // Ajusta a área útil da tela automaticamente para o teclado não cobrir os campos de entrada.
  Platform, // Permite identificar o sistema operacional atual (android, ios ou web).
  Pressable, // Componente de botão moderno com suporte a estado pressionado e acessibilidade.
  ScrollView, // Área rolável para garantir acesso a todos os campos quando o teclado virtual abrir.
  Text, // Componente para exibição de textos.
  TextInput, // Campo de entrada de texto digitável pelo usuário.
  View, // Contêiner genérico de layout.
} from 'react-native';
// Importa as funções oficiais de autenticação por e-mail/senha do Firebase Web/JS SDK.
import {
  createUserWithEmailAndPassword, // Cria uma nova conta usando e-mail e senha.
  sendPasswordResetEmail, // Dispara o e-mail de redefinição de senha pelo Firebase.
  signInWithEmailAndPassword, // Realiza login convencional com e-mail e senha.
} from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons'; // Biblioteca de ícones vetoriais padrão do Expo (usada no botão de mostrar/ocultar senha).
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Garante recuo seguro nas bordas superior (StatusBar) e inferior.
// Importa os estilos globais e a escala de espaçamentos padronizados do aplicativo.
import { estilos as e, espaco, fonte, raio } from '../componentes/estilos';
// Importa a paleta de cores padronizada do aplicativo.
import { cores } from '../componentes/cores';
// Importa a instância de autenticação (auth) e a flag que indica se as chaves do Firebase existem no módulo.
import { auth, firebaseConfigurado as firebaseModuloPronto } from '../servicos/firebase/firebase';
// Importa o hook customizado que expõe o estado global de autenticação do usuário.
import { useAutenticacao } from '../contextos/AuthContext';

// Expressão regular simples e segura para validar formato básico de e-mail antes de acionar a rede.
const REGEX_EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Dicionário que traduz códigos técnicos de erro do Firebase Auth para mensagens amigáveis em português.
const MENSAGENS_ERRO = {
  'auth/email-already-in-use': 'Este e-mail já possui uma conta.', // Conta duplicada no cadastro.
  'auth/invalid-email': 'Informe um endereço de e-mail válido.', // Formato de e-mail rejeitado pelo Firebase.
  'auth/invalid-credential': 'E-mail ou senha incorretos.', // Erro padrão unificado do Firebase para login inválido.
  'auth/user-not-found': 'Nenhuma conta encontrada com este e-mail.', // Fallback para projetos sem proteção de enumeração.
  'auth/wrong-password': 'Senha incorreta. Tente novamente.', // Fallback para senha incorreta.
  'auth/user-disabled': 'Esta conta foi desativada.', // Conta bloqueada manualmente no console do Firebase.
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.', // Regra mínima de segurança de senha.
  'auth/network-request-failed': 'Sem conexão com a internet. Verifique a rede e tente novamente.', // Falha de conectividade.
  'auth/operation-not-allowed': 'Este método de acesso ainda não foi ativado no Firebase.', // Provedor desabilitado no Firebase.
  'auth/too-many-requests': 'Muitas tentativas seguidas. Aguarde alguns instantes e tente novamente.', // Bloqueio temporário.
};

/**
 * Converte qualquer objeto de erro do Firebase ou erro genérico em uma string legível para o usuário.
 * @param {unknown} erro - Erro capturado em blocos try/catch.
 * @returns {string} Mensagem tratada em Português-BR.
 */
function obterMensagemDoErro(erro) {
  // Garante que valores nulos ou indefinidos não quebrem a leitura de propriedades.
  if (!erro) {
    return 'Não foi possível concluir o acesso. Tente novamente.';
  }
  // Caso o erro seja uma string pura lançada manualmente, retorna a própria string.
  if (typeof erro === 'string') {
    return erro;
  }
  // Extrai o código do erro, se existir.
  const codigo = erro.code;
  // Retorna a tradução mapeada no dicionário, ou a mensagem original do erro, ou um texto padrão seguro.
  return MENSAGENS_ERRO[codigo] || erro.message || 'Não foi possível concluir o acesso. Tente novamente.';
}
// Exporta o componente principal da tela de autenticação do aplicativo.
export default function TelaLogin() {
  const insets = useSafeAreaInsets(); // Captura as margens seguras da StatusBar e da barra inferior do aparelho.

  // Consome o contexto de autenticação com fallback ({}) caso a tela seja renderizada fora do Provider por engano.
  const contextoAuth = useAutenticacao() || {};
  // Extrai a flag de configuração vinda do AuthContext (pode ser undefined se o contexto não expor a propriedade).
  const firebaseContextoPronto = contextoAuth.firebaseConfigurado;
  // Unifica a verificação em uma única fonte de verdade: só está pronto se 'auth' existir e o Firebase estiver configurado.
  const firebasePronto = Boolean(auth && (firebaseContextoPronto ?? firebaseModuloPronto));

  // Controla qual fluxo está ativo na tela: 'entrar' (login), 'cadastro' (nova conta) ou 'redefinir' (esqueci a senha).
  const [modo, setModo] = useState('entrar');
  // Armazena o texto digitado no campo de e-mail.
  const [email, setEmail] = useState('');
  // Armazena o texto digitado no campo de senha.
  const [senha, setSenha] = useState('');
  // Controla se os caracteres da senha estão visíveis (olho aberto) ou ocultos (olho fechado).
  const [mostrarSenha, setMostrarSenha] = useState(false);
  // Armazena mensagens de erro de validação ou falha de autenticação para exibição ao usuário.
  const [erro, setErro] = useState('');
  // Armazena mensagens informativas de sucesso (ex.: envio do e-mail de recuperação).
  const [mensagem, setMensagem] = useState('');
  // Indica se há uma requisição assíncrona em andamento, bloqueando cliques duplicados.
  const [processando, setProcessando] = useState(false);

  // Referência que rastreia se o componente ainda está montado na árvore para evitar atualizar estado após desmontar.
  const montadoRef = useRef(true);
  // Referência para o campo de senha, permitindo mover o foco do teclado ao apertar "Avançar" no campo de e-mail.
  const senhaInputRef = useRef(null);

  /**
   * Atualiza os estados locais apenas se o componente ainda estiver montado na tela.
   * Previne warnings de memory leak quando o AuthContext troca a rota imediatamente após autenticar.
   */
  const atualizarSeMontado = (callback) => {
    if (montadoRef.current) {
      callback();
    }
  };

  // Efeito executado uma única vez na montagem para controlar o ciclo de vida do componente.
  useEffect(() => {
    montadoRef.current = true; // Marca que a tela está montada e ativa.
    return () => {
      montadoRef.current = false; // Marca que a tela foi desmontada ao sair do login.
    };
  }, []);

  /**
   * Alterna entre os modos da tela ('entrar', 'cadastro', 'redefinir') limpando mensagens antigas.
   * @param {'entrar' | 'cadastro' | 'redefinir'} novoModo - Modo de destino.
   */
  const trocarModo = (novoModo) => {
    setModo(novoModo); // Atualiza o modo atual da interface.
    setErro(''); // Limpa erros anteriores para não confundir o usuário na nova etapa.
    setMensagem(''); // Limpa avisos anteriores.
  };

  /**
   * Executa o fluxo de login, criação de conta ou recuperação de senha via e-mail no Firebase.
   */
  const enviarEmail = async () => {
    // Impede disparos múltiplos caso uma requisição já esteja acontecendo.
    if (processando) return;

    // Fecha o teclado virtual automaticamente ao submeter o formulário.
    Keyboard.dismiss();

    // Limpa feedbacks anteriores antes de iniciar nova tentativa.
    setErro('');
    setMensagem('');

    // Verifica se o Firebase foi devidamente inicializado antes de chamar qualquer método de autenticação.
    if (!firebasePronto) {
      setErro('Configure o Firebase no arquivo .env e reinicie o Expo.');
      return;
    }

    // Remove espaços acidentais nas extremidades do e-mail digitado.
    const emailLimpo = email.trim();

    // Valida se o usuário preencheu o campo de e-mail.
    if (!emailLimpo) {
      setErro('Informe seu e-mail.');
      return;
    }

    // Valida o formato básico do e-mail antes de consumir rede/cota do Firebase.
    if (!REGEX_EMAIL_VALIDO.test(emailLimpo)) {
      setErro('Informe um endereço de e-mail válido.');
      return;
    }

    // Exige senha de pelo menos 6 caracteres nos fluxos de login e cadastro (não exigida na recuperação de senha).
    if (modo !== 'redefinir' && senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    // Ativa o estado de carregamento para travar os botões e exibir "Aguarde...".
    setProcessando(true);
    try {
      if (modo === 'cadastro') {
        // Cria o usuário no Firebase Auth; o AuthContext detectará o login automático via onAuthStateChanged.
        await createUserWithEmailAndPassword(auth, emailLimpo, senha);
      } else if (modo === 'redefinir') {
        // Envia o link de redefinição de senha para o e-mail informado.
        await sendPasswordResetEmail(auth, emailLimpo);
        // Informa o usuário de forma segura (sem revelar se o e-mail existe ou não na base).
        atualizarSeMontado(() => {
          setMensagem('Se houver uma conta com este e-mail, enviaremos as instruções de recuperação.');
        });
      } else {
        // Autentica o usuário existente com e-mail e senha.
        await signInWithEmailAndPassword(auth, emailLimpo, senha);
      }
    } catch (error) {
      // Traduz e exibe o erro apenas se a tela ainda estiver montada.
      atualizarSeMontado(() => {
        setErro(obterMensagemDoErro(error));
      });
    } finally {
      // Libera os botões ao término da operação, caso a tela não tenha sido desmontada pela navegação.
      atualizarSeMontado(() => {
        setProcessando(false);
      });
    }
  };
  // Define dinamicamente o título principal exibido no topo da tela conforme o modo selecionado.
  const titulo =
    modo === 'cadastro'
      ? 'Crie sua conta'
      : modo === 'redefinir'
        ? 'Recuperar senha'
        : 'Entre na sua conta';

  // Renderiza a interface da tela de autenticação encapsulada para o teclado virtual.
  return (
    // KeyboardAvoidingView redimensiona a janela quando o teclado sobe para não cobrir os campos de entrada.
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: cores.bkprincipal }}
    >
      {/* ScrollView permite rolar livremente até os botões mesmo com o teclado aberto */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1, // Permite centralizar o conteúdo quando sobra espaço vertical.
          justifyContent: 'center', // Centraliza o formulário na tela quando o teclado está fechado.
          paddingHorizontal: espaco.xl, // Espaçamento lateral padronizado.
          paddingTop: Math.max(insets.top, espaco.xl), // Protege o topo contra a StatusBar.
          paddingBottom: Math.max(insets.bottom, espaco.xxl) + espaco.lg, // Garante folga extra acima do teclado.
        }}
        keyboardShouldPersistTaps="handled" // Permite tocar nos botões diretamente sem precisar fechar o teclado antes.
        showsVerticalScrollIndicator={false} // Oculta a barra lateral de rolagem para manter o visual limpo.
      >
        {/* Fecha o teclado ao tocar em qualquer área livre fora dos inputs, sem bloquear acessibilidade interna */}
        <Pressable onPress={Keyboard.dismiss} accessible={false}>
          {/* Logotipo centralizado do aplicativo */}
          <View style={e.areaImagem}>
            <Image
              source={require('../../assets/icon.png')}
              style={e.imagem}
              resizeMode="contain"
            />
          </View>

          {/* Nome da marca em destaque */}
          <Text style={e.textoTitulo}>TRILHAMESTRE</Text>

          {/* Título principal dinâmico conforme o modo (Entrar / Cadastrar / Recuperar) */}
          <Text style={e.textoTituloDestaque}>{titulo}</Text>

          {/* Subtítulo explicativo alinhado à esquerda */}
          <Text style={[e.textoDescricao, { textAlign: 'left', marginBottom: espaco.lg }]}>
            Entre para salvar suas trilhas neste aparelho e solicitar orientações para seus objetivos.
          </Text>

          {/* Bloco de aviso exibido apenas quando as variáveis ou a instância do Firebase não estão configuradas */}
          {!firebasePronto ? (
            <View style={e.blocoNotaNovaEstrategia}>
              <Text style={e.textoApoio}>
                O Firebase ainda não está configurado. Copie .env.example para .env, preencha os dados do projeto e
                reinicie o Expo. Nenhuma conta fictícia será criada.
              </Text>
            </View>
          ) : null}

          {/* Rótulo do campo de e-mail */}
          <Text style={e.textoEnunciado}>E-mail</Text>

          {/* Campo de entrada para o endereço de e-mail com altura e bordas padronizadas */}
          <TextInput
            accessibilityLabel="E-mail" // Rótulo de acessibilidade para leitores de tela.
            autoCapitalize="none" // Evita que a primeira letra do e-mail seja colocada em maiúscula automaticamente.
            autoComplete="email" // Habilita preenchimento automático de e-mail pelo sistema operacional.
            editable={!processando} // Bloqueia edição enquanto o formulário está sendo enviado.
            keyboardType="email-address" // Abre o teclado otimizado com '@' e '.com'.
            onChangeText={setEmail} // Atualiza o estado local de e-mail a cada caractere digitado.
            onSubmitEditing={() => {
              // Se estiver no modo de redefinição (sem senha), envia direto; caso contrário, pula para o campo de senha.
              if (modo === 'redefinir') {
                enviarEmail();
              } else {
                senhaInputRef.current?.focus();
              }
            }}
            placeholder="voce@exemplo.com" // Texto guia exibido quando o campo está vazio.
            placeholderTextColor={cores.descricao} // Cor discreta para o texto guia.
            returnKeyType={modo === 'redefinir' ? 'send' : 'next'} // Define o ícone da tecla de ação do teclado.
            style={[
              e.rebaixada,
              {
                borderRadius: raio.md,
                paddingHorizontal: espaco.lg,
                paddingVertical: espaco.lg,
                fontSize: fonte.md,
                color: cores.titulos,
                marginTop: espaco.sm,
                marginBottom: espaco.lg,
              },
            ]}
            value={email} // Valor controlado pelo estado React.
          />
          {/* O campo de senha só é exibido nos modos 'entrar' e 'cadastro' */}
          {modo !== 'redefinir' ? (
            <>
              {/* Rótulo do campo de senha */}
              <Text style={e.textoEnunciado}>Senha</Text>

              {/* Contêiner com borda e fundo idênticos ao campo de e-mail para abrigar o input e o botão do olho */}
              <View
                style={[
                  e.rebaixada,
                  e.linha,
                  {
                    borderRadius: raio.md,
                    marginTop: espaco.sm,
                    marginBottom: espaco.lg,
                    paddingRight: espaco.md,
                  },
                ]}
              >
                {/* Campo de entrada da senha */}
                <TextInput
                  ref={senhaInputRef} // Conecta a referência para receber foco automático vindo do campo de e-mail.
                  accessibilityLabel="Senha" // Rótulo de acessibilidade.
                  autoCapitalize="none" // Impede capitalização automática da primeira letra da senha.
                  autoComplete={modo === 'cadastro' ? 'new-password' : 'password'} // Sugere gerenciador adequado ao modo.
                  editable={!processando} // Impede alteração durante o envio.
                  onChangeText={setSenha} // Atualiza o estado local da senha.
                  onSubmitEditing={enviarEmail} // Dispara o envio do formulário ao pressionar "Concluir/Entrar" no teclado.
                  placeholder="Mínimo de 6 caracteres" // Orientação sobre o tamanho mínimo exigido pelo Firebase.
                  placeholderTextColor={cores.descricao} // Cor discreta do texto guia.
                  returnKeyType="done" // Exibe o botão de confirmação no teclado virtual.
                  secureTextEntry={!mostrarSenha} // Alterna entre ocultar (bolinhas) e exibir a senha digitada.
                  style={{
                    flex: 1, // Ocupa todo o espaço restante à esquerda do ícone do olho.
                    paddingHorizontal: espaco.lg,
                    paddingVertical: espaco.lg,
                    fontSize: fonte.md,
                    color: cores.titulos,
                  }}
                  value={senha} // Valor controlado pelo estado React.
                />

                {/* Botão com ícone de olho para alternar a visibilidade da senha */}
                <Pressable
                  accessibilityLabel={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'} // Descrição para leitores de tela.
                  accessibilityRole="button" // Identifica como botão acessível.
                  disabled={processando} // Desativa enquanto o formulário está enviando.
                  hitSlop={8} // Aumenta a área de toque do dedo sem alterar o layout visual.
                  onPress={() => setMostrarSenha((prev) => !prev)} // Inverte o estado atual entre visível e oculto.
                  style={{ padding: espaco.xs }}
                >
                  <Ionicons
                    name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={cores.descricao}
                  />
                </Pressable>
              </View>
            </>
          ) : null}

          {/* Exibe mensagem de erro caso exista alguma falha de validação ou autenticação */}
          {erro ? (
            <Text accessibilityRole="alert" style={[e.textoErro, { marginBottom: espaco.md }]}>
              {erro}
            </Text>
          ) : null}

          {/* Exibe mensagem informativa positiva (ex.: confirmação do envio de recuperação de senha) */}
          {mensagem ? (
            <Text accessibilityRole="alert" style={[e.textoApoio, { marginBottom: espaco.md }]}>
              {mensagem}
            </Text>
          ) : null}

          {/* Botão principal de ação do formulário (Entrar, Criar conta ou Enviar instruções) */}
          <Pressable
            accessibilityRole="button"
            disabled={processando} // Evita múltiplos envios simultâneos.
            onPress={enviarEmail} // Executa a função de envio por e-mail.
            style={({ pressed }) => [
              e.botaoConfirmar,
              e.centro, // Centraliza o texto vertical e horizontalmente dentro do botão.
              processando && e.botaoDesabilitado,
              pressed && { opacity: 0.82 },
            ]}
          >
            <Text style={[e.textoTituloItem, { color: cores.botoesTexto || '#FFFFFF' }]}>
              {processando
                ? 'Aguarde...'
                : modo === 'cadastro'
                  ? 'Criar conta'
                  : modo === 'redefinir'
                    ? 'Enviar instruções'
                    : 'Entrar'}
            </Text>
          </Pressable>

          {/* Link para abrir a recuperação de senha (visível apenas na tela de login) */}
          {modo === 'entrar' ? (
            <Pressable
              disabled={processando}
              onPress={() => trocarModo('redefinir')}
              style={{ paddingVertical: espaco.md }}
            >
              <Text style={[e.textoDestaqueCompacto, { textAlign: 'center' }]}>
                Esqueci minha senha
              </Text>
            </Pressable>
          ) : null}

          {/* Alternador entre Login e Cadastro, ou botão de retorno quando estiver na tela de recuperação de senha */}
          {modo !== 'redefinir' ? (
            <Pressable
              disabled={processando}
              onPress={() => trocarModo(modo === 'cadastro' ? 'entrar' : 'cadastro')}
              style={{ paddingVertical: espaco.md }}
            >
              <Text style={[e.textoDestaqueCompacto, { textAlign: 'center' }]}>
                {modo === 'cadastro'
                  ? 'Já tenho uma conta · Entrar'
                  : 'Ainda não tenho conta · Cadastrar'}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              disabled={processando}
              onPress={() => trocarModo('entrar')}
              style={{ paddingVertical: espaco.md }}
            >
              <Text style={[e.textoDestaqueCompacto, { textAlign: 'center' }]}>
                Voltar para entrar
              </Text>
            </Pressable>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
