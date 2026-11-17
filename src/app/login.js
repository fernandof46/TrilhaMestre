// Importa o React e os hooks necessários: useEffect (ciclo de vida), useRef (referências sem re-renderizar) e useState (estado local).
import React, { useEffect, useRef, useState } from 'react';
// Importa os componentes visuais e utilitários nativos do React Native usados na interface da tela de login.
import {
  KeyboardAvoidingView, // Ajusta o layout automaticamente para o teclado não cobrir os campos de entrada.
  Platform, // Permite identificar o sistema operacional atual (android, ios ou web).
  Pressable, // Componente de botão moderno com suporte a estado pressionado e acessibilidade.
  ScrollView, // Área rolável para garantir acesso a todos os campos em telas menores.
  Text, // Componente para exibição de textos.
  TextInput, // Campo de entrada de texto digitável pelo usuário.
  View, // Contêiner genérico de layout.
  Image, // Componente para exibir imagens.
} from 'react-native';
// Importa as funções oficiais de autenticação do Firebase Web/JS SDK.
import {
  createUserWithEmailAndPassword, // Cria uma nova conta usando e-mail e senha.
  GoogleAuthProvider, // Gera a credencial do Firebase a partir do token retornado pelo Google.
  sendPasswordResetEmail, // Dispara o e-mail de redefinição de senha pelo Firebase.
  signInWithCredential, // Autentica no Firebase utilizando uma credencial externa (neste caso, Google).
  signInWithEmailAndPassword, // Realiza login convencional com e-mail e senha.
} from 'firebase/auth';
// Importa os estilos globais e a escala de espaçamentos padronizados do aplicativo.
import { estilos as e, espaco } from '../componentes/estilos';
// Importa a paleta de cores padronizada do aplicativo.
import { cores } from '../componentes/cores';
// Importa a instância de autenticação (auth) e a flag que indica se as chaves do Firebase existem no módulo.
import { auth, firebaseConfigurado as firebaseModuloPronto } from '../servicos/firebase/firebase';
// Importa o hook customizado que expõe o estado global de autenticação do usuário.
import { useAutenticacao } from '../contextos/AuthContext';

// Lê o Client ID Web do Google a partir das variáveis públicas do Expo (.env) — obrigatório para gerar o idToken no Android/iOS.
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim() || '';
// Lê o Client ID específico para iOS, caso esteja configurado no arquivo .env.
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim() || '';

// Expressão regular simples e segura para validar formato básico de e-mail antes de acionar a rede.
const REGEX_EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Dicionário que traduz códigos técnicos de erro do Firebase Auth para mensagens amigáveis em português.
const MENSAGENS_ERRO = {
  'auth/email-already-in-use': 'Este e-mail já possui uma conta.', // Conta duplicada no cadastro.
  'auth/invalid-email': 'Informe um endereço de e-mail válido.', // Formato de e-mail rejeitado pelo Firebase.
  'auth/invalid-credential': 'E-mail ou senha incorretos.', // Erro padrão unificado do Firebase para login inválido.
  'auth/user-not-found': 'Nenhuma conta encontrada com este e-mail.', // Fallback para versões/projetos sem proteção de enumeração.
  'auth/wrong-password': 'Senha incorreta. Tente novamente.', // Fallback para senha incorreta.
  'auth/user-disabled': 'Esta conta foi desativada.', // Conta bloqueada manualmente no console do Firebase.
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.', // Regra mínima de segurança de senha.
  'auth/network-request-failed': 'Sem conexão com a internet. Verifique a rede e tente novamente.', // Falha de conectividade.
  'auth/operation-not-allowed': 'Este método de acesso ainda não foi ativado no Firebase.', // Provedor desabilitado no Firebase Console.
  'auth/too-many-requests': 'Muitas tentativas seguidas. Aguarde alguns instantes e tente novamente.', // Bloqueio temporário por excesso de tentativas.
  'auth/account-exists-with-different-credential': 'Este e-mail já está vinculado a outro método de entrada.', // Conflito entre provedores (ex.: e-mail vs Google).
};

/**
 * Converte qualquer objeto de erro (Firebase, Google ou erro genérico) em uma string legível para o usuário.
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

/**
 * Carrega o módulo nativo '@react-native-google-signin/google-signin' de forma segura (sob demanda).
 * Evita que o app quebre na inicialização caso seja aberto no Expo Go ou no navegador (Web).
 * @returns {object | null} O módulo importado ou null caso o binário nativo não esteja disponível.
 */
function carregarModuloGoogleSeguro() {
  // O pacote nativo de login Google mobile não é suportado no ambiente Web.
  if (Platform.OS === 'web') {
    return null;
  }
  try {
    // Usa require dentro de try/catch para capturar falhas quando o módulo nativo RNGoogleSignin não existe no binário (ex.: Expo Go).
    return require('@react-native-google-signin/google-signin');
  } catch (erroModulo) {
    // Exibe um aviso discreto no terminal para ajudar o desenvolvedor a identificar que precisa de um Development Build.
    console.warn(
      'Login com Google indisponível neste ambiente (requer Development Build ou APK/AAB nativo):',
      erroModulo?.message || erroModulo
    );
    // Retorna null para permitir que o restante da tela (e o login por e-mail) funcione normalmente sem crash.
    return null;
  }
}

// Exporta o componente principal da tela de autenticação do aplicativo.
export default function TelaLogin() {
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
  // Armazena mensagens de erro de validação ou falha de autenticação para exibição ao usuário.
  const [erro, setErro] = useState('');
  // Armazena mensagens informativas de sucesso (ex.: envio do e-mail de recuperação).
  const [mensagem, setMensagem] = useState('');
  // Indica se há uma requisição assíncrona em andamento, bloqueando cliques duplicados.
  const [processando, setProcessando] = useState(false);

  // Referência que rastreia se o componente ainda está montado na árvore para evitar atualizar estado após o login desmontar a tela.
  const montadoRef = useRef(true);
  // Referência que guarda o módulo nativo do Google Sign-In carregado com segurança após a montagem.
  const googleModuloRef = useRef(null);
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

  // Efeito executado uma única vez na montagem do componente para controlar o ciclo de vida e configurar o Google Sign-In.
  useEffect(() => {
    // Marca que a tela está ativa e montada.
    montadoRef.current = true;

    // Tenta carregar o módulo nativo do Google sem risco de crash no Expo Go.
    const moduloGoogle = carregarModuloGoogleSeguro();
    // Armazena o módulo carregado (ou null) na referência persistente.
    googleModuloRef.current = moduloGoogle;

    // Se o módulo nativo existir e o Client ID Web estiver preenchido no .env, inicializa a configuração do Google uma única vez.
    if (moduloGoogle?.GoogleSignin && GOOGLE_WEB_CLIENT_ID) {
      try {
        moduloGoogle.GoogleSignin.configure({
          // Web Client ID do Firebase Console (obrigatório para obter o idToken validável pelo Firebase Auth).
          webClientId: GOOGLE_WEB_CLIENT_ID,
          // Inclui o Client ID do iOS apenas se estiver definido no ambiente.
          ...(GOOGLE_IOS_CLIENT_ID ? { iosClientId: GOOGLE_IOS_CLIENT_ID } : {}),
        });
      } catch (erroConfigGoogle) {
        // Registra o problema sem travar a renderização da tela.
        console.warn('Falha ao inicializar GoogleSignin.configure:', erroConfigGoogle);
      }
    }

    // Função de limpeza executada quando o componente é desmontado (ex.: navegação após login bem-sucedido).
    return () => {
      montadoRef.current = false;
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

  /**
   * Executa o fluxo de autenticação nativa com Google e vincula a sessão ao Firebase Auth.
   */
  const entrarComGoogle = async () => {
    // Evita múltiplos cliques simultâneos enquanto o modal do Google está abrindo.
    if (processando) return;

    // Reseta feedbacks visuais anteriores.
    setErro('');
    setMensagem('');

    // Garante que o Firebase está pronto para receber a credencial do Google.
    if (!firebasePronto) {
      setErro('Configure o Firebase no arquivo .env e reinicie o Expo.');
      return;
    }

    // Garante que a variável de ambiente do Client ID Web do Google está preenchida.
    if (!GOOGLE_WEB_CLIENT_ID) {
      setErro('Configure EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID para habilitar o login Google.');
      return;
    }

    // Recupera o módulo nativo carregado na inicialização da tela.
    const moduloGoogle = googleModuloRef.current;
    // Se o módulo não estiver disponível (ex.: usuário rodando no Expo Go), orienta sem quebrar o app.
    if (!moduloGoogle?.GoogleSignin) {
      setErro('O login com Google exige um Development Build ou app instalado (não funciona no Expo Go).');
      return;
    }

    // Extrai os utilitários da biblioteca nativa de login Google.
    const { GoogleSignin, isSuccessResponse, statusCodes } = moduloGoogle;

    // Ativa o indicador de processamento na interface.
    setProcessando(true);
    try {
      // Verifica se o dispositivo Android possui o Google Play Services atualizado e funcional.
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Abre o seletor nativo de contas Google do aparelho.
      const resposta = await GoogleSignin.signIn();

      // Verifica se o usuário concluiu o fluxo (ou cancelou sem gerar erro na API v13+).
      const loginBemSucedido =
        typeof isSuccessResponse === 'function'
          ? isSuccessResponse(resposta)
          : Boolean(resposta?.data?.idToken || resposta?.idToken);

      // Se o usuário cancelou a seleção de conta, encerra silenciosamente sem exibir mensagem de erro.
      if (!loginBemSucedido) {
        return;
      }

      // Extrai o idToken compatível tanto com versões novas (resposta.data.idToken) quanto antigas (resposta.idToken).
      const idToken = resposta?.data?.idToken ?? resposta?.idToken ?? null;
      // Caso o Google não retorne o idToken, o webClientId provavelmente está ausente ou incorreto.
      if (!idToken) {
        throw new Error('O Google não retornou o token de autenticação. Confira os IDs OAuth configurados.');
      }

      // Converte o idToken do Google em uma credencial do Firebase e conclui o login no app.
      await signInWithCredential(auth, GoogleAuthProvider.credential(idToken));
    } catch (error) {
      // Extrai o código do erro para tratar casos específicos do Google Sign-In.
      const codigoErro = error?.code;

      // Se o usuário apenas fechou a janela de seleção de conta, não exibe erro na tela.
      if (codigoErro === statusCodes?.SIGN_IN_CANCELLED || codigoErro === 'SIGN_IN_CANCELLED') {
        return;
      }

      // Trata cada código técnico conhecido do Google Sign-In com orientação clara em português.
      atualizarSeMontado(() => {
        if (codigoErro === statusCodes?.IN_PROGRESS) {
          setErro('Já existe um login com o Google em andamento.');
        } else if (codigoErro === statusCodes?.PLAY_SERVICES_NOT_AVAILABLE) {
          setErro('Google Play Services indisponível ou desatualizado neste aparelho.');
        } else if (String(codigoErro) === '10' || codigoErro === 'DEVELOPER_ERROR') {
          setErro('Erro de configuração OAuth (verifique o SHA-1 e o Web Client ID no Firebase).');
        } else {
          setErro(obterMensagemDoErro(error));
        }
      });
    } finally {
      // Restaura o estado dos botões caso o componente permaneça na tela.
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

  // Renderiza a interface da tela de autenticação.
  return (
    // Contêiner raiz que evita sobreposição do teclado no iOS (no Android, utiliza o ajuste nativo da janela).
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={e.containerPrincipal}
    >
      {/* Permite rolagem vertical caso o teclado ou o tamanho da tela reduza a área visível */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: espaco.xxl }}
        keyboardShouldPersistTaps="handled" // Garante que tocar em botões com o teclado aberto execute a ação imediatamente.
        showsVerticalScrollIndicator={false} // Oculta a barra lateral de rolagem para manter o visual limpo.
      >
        {/* Marca / rótulo superior da tela */}
        <View style={e.areaImagem}>
          <Image
            source={require('../../assets/icon.png')} 
            style={e.imagem}
            resizeMode="contain"
          />
          
        </View>
        <Text style={e.textoTitulo}>TRILHAMESTRE</Text>
        {/* Título principal dinâmico */}
        <Text style={e.textoTituloDestaque}>{titulo}</Text>
        {/* Subtítulo explicativo alinhado à esquerda */}
        <Text style={[e.textoDescricao, { textAlign: 'left' }]}>
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

        {/* Exibe o botão de login com Google apenas nos modos 'entrar' e 'cadastro' */}
        {modo !== 'redefinir' ? (
          <>
            <Pressable
              accessibilityRole="button" // Informa leitores de tela que o elemento é um botão.
              disabled={processando} // Desabilita o toque enquanto outra requisição está em andamento.
              onPress={entrarComGoogle} // Aciona o fluxo de login com Google.
              style={({ pressed }) => [
                e.botaoSecundario,
                { marginTop: espaco.xxl },
                processando && e.botaoDesabilitado, // Aplica estilo visual de botão desabilitado durante carregamento.
                pressed && { opacity: 0.82 }, // Feedback visual tátil ao pressionar.
              ]}
            >
              <Text style={e.textoDescricao}>Continuar com Google</Text>
            </Pressable>
            {/* Divisor textual entre o login social e o formulário tradicional */}
            
            <Text style={[e.textoApoio, { textAlign: 'center', marginVertical: espaco.lg }]}>
              ou use seu e-mail
            </Text>
          </>
        ) : null}

        {/* Rótulo do campo de e-mail */}
        <Text style={e.textoEnunciado}>E-mail</Text>
        {/* Campo de entrada para o endereço de e-mail */}
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
          style={[e.campoTextoMensagem, { marginTop: espaco.sm, marginBottom: espaco.lg }]}
          value={email} // Valor controlado pelo estado React.
        />

        {/* O campo de senha só é exibido nos modos 'entrar' e 'cadastro' */}
        {modo !== 'redefinir' ? (
          <>
            {/* Rótulo do campo de senha */}
            <Text style={e.textoEnunciado}>Senha</Text>
            {/* Campo de entrada mascarado para a senha */}
            <TextInput
              ref={senhaInputRef} // Conecta a referência para receber foco automático vindo do campo de e-mail.
              accessibilityLabel="Senha" // Rótulo de acessibilidade.
              autoCapitalize="none" // Impede capitalização automática da primeira letra da senha.
              autoComplete={modo === 'cadastro' ? 'new-password' : 'password'} // Sugere gerenciador de senhas adequado ao modo.
              editable={!processando} // Impede alteração durante o envio.
              onChangeText={setSenha} // Atualiza o estado local da senha.
              onSubmitEditing={enviarEmail} // Dispara o envio do formulário ao pressionar "Concluir/Entrar" no teclado.
              placeholder="Mínimo de 6 caracteres" // Orientação sobre o tamanho mínimo exigido pelo Firebase.
              placeholderTextColor={cores.descricao} // Cor do texto guia.
              returnKeyType="done" // Exibe o botão de confirmação no teclado virtual.
              secureTextEntry // Oculta os caracteres digitados com bolinhas/asteriscos.
              style={[e.campoTextoMensagem, { marginTop: espaco.sm, marginBottom: espaco.lg }]}
              value={senha} // Valor controlado pelo estado React.
            />
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
            processando && e.botaoDesabilitado,
            pressed && { opacity: 0.82 },
          ]}
        >
          <Text style={e.textoBotao}>
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
            <Text style={[e.textoDestaqueCompacto, { textAlign: 'center' }]}>Esqueci minha senha</Text>
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
              {modo === 'cadastro' ? 'Já tenho uma conta · Entrar' : 'Ainda não tenho conta · Cadastrar'}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            disabled={processando}
            onPress={() => trocarModo('entrar')}
            style={{ paddingVertical: espaco.md }}
          >
            <Text style={[e.textoDestaqueCompacto, { textAlign: 'center' }]}>Voltar para entrar</Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}