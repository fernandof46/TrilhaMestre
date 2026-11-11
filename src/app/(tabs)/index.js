import React, { useState } from 'react'; // Importa a biblioteca React e o Hook useState para controle de estados dos inputs
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'; // Importa os primitivos de interface e acessibilidade nativos do ecossistema móvel
import { useRouter } from 'expo-router'; // Importa o roteador do Expo Router para efetuar a navegação após a criação
import { generateRoadmap } from '../../lib/roadmap-generator'; // Importa o motor gerador local de estruturas de trilhas
import { gerarOrientacaoComIA } from '../../lib/ai-orientation';
import { useTrilhas } from '../../lib/TrilhasContext'; // Importa o hook de persistência de dados no banco local do dispositivo
import { estilos as e, espaco } from '../../componentes/estilos'; // Importa seus estilos globais unificados apelidados de 'e'
import { cores } from '../../componentes/cores'; // Importa a paleta de cores centralizada do seu design system

// Definição estática dos níveis de proficiência em português para o seletor de rádio móvel
const niveis = [
  { valor: 'iniciante', rotulo: 'Iniciante' },
  { valor: 'intermediario', rotulo: 'Intermediário' },
  { valor: 'avancado', rotulo: 'Avançado' },
];

export default function TelaCriarRoteiro() {
  const roteador = useRouter(); // Inicializa o manipulador de rotas nativo
  const { addTrilha, isLoading, storageError } = useTrilhas(); // Desestrutura as funções e estados do banco local
  
  // Estados reativos locais para gerenciar os dados inseridos pelos campos de formulário
  const [tema, setTema] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [contexto, setContexto] = useState('');
  const [nivel, setNivel] = useState('iniciante');
  const [erro, setErro] = useState('');
  const [criando, setCriando] = useState(false);

  const validarFormulario = () => {
    const temaLimpo = tema.trim();
    if (temaLimpo.length < 3) {
      setErro('Informe um tema com pelo menos 3 caracteres.');
      return null;
    }

    return { tema: temaLimpo, objetivo: objetivo.trim(), contexto: contexto.trim(), nivel };
  };

  const salvarTrilha = async (gerado, dados) => {
    const roteiroSalvo = await addTrilha({
      ...gerado,
      topic: dados.tema,
      level: dados.nivel,
      completedStepIds: [],
    });
    roteador.push(`/trilha/${roteiroSalvo.id}`);
  };

  const criarRoteiroComIA = async () => {
    const dados = validarFormulario();
    if (!dados) return;
    setErro('');
    setCriando(true);
    try {
      const gerado = await gerarOrientacaoComIA({
        tema: dados.tema,
        objetivo: dados.objetivo,
        contexto: dados.contexto,
        nivel: dados.nivel,
      });
      await salvarTrilha(gerado, dados);
    } catch (erroCriacao) {
      setErro(erroCriacao.message || 'Não foi possível gerar a orientação. Tente novamente.');
      console.error('Falha ao criar trilha:', erroCriacao);
    } finally {
      setCriando(false);
    }
  };

  const criarRoteiroLocal = async () => {
    const dados = validarFormulario();
    if (!dados) return;
    setErro('');
    setCriando(true);
    try {
      const gerado = generateRoadmap(
        dados.tema,
        dados.contexto || dados.objetivo || dados.tema,
        dados.nivel,
      );
      await salvarTrilha(gerado, dados);
    } catch (erroCriacao) {
      setErro('Não foi possível salvar a trilha neste dispositivo. Tente novamente.');
      console.error('Falha ao criar trilha local:', erroCriacao);
    } finally {
      setCriando(false);
    }
  };

  return (
    // KeyboardAvoidingView impede que o teclado virtual do celular cubra o botão ou o campo de entrada multiline
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={e.containerPrincipal} // Consome a raiz predefinida do seu aplicativo móvel
    >
      <ScrollView
        keyboardShouldPersistTaps="handled" // Permite fechar o teclado clicando nas áreas vazias da tela de forma fluida
        showsVerticalScrollIndicator={false} // Mantém o visual do painel limpo removendo a barra de rolagem lateral
      >
        {/* Chamada institucional da marca do seu aplicativo */}
        <Text style={e.rotuloDestaqueEspacado}>TRILHAMESTRE</Text>
        
        {/* Título de impacto e descrição utilizando a tipografia compartilhada do seu sistema */}
        <Text style={e.textoTituloDestaque}>Seu próximo objetivo começa aqui.</Text>
        <Text style={e.textoDescricao}>
          Conte o que quer aprender ou realizar em qualquer área. A IA organiza um plano de estudo e próximos passos.
        </Text>

        {/* Banner Informativo: Substitui a div de aviso utilizando o seletor 'blocoVerde' global do design system */}
        <View style={e.blocoNotaNovaEstrategia}>
          <Text style={e.textoApoio}>
            A orientação com IA atende temas de qualquer área. Ela precisa de conexão, login e provedores configurados
            no servidor. Seu tema, objetivo e contexto serão enviados ao provedor configurado; não inclua dados pessoais
            sensíveis. As pesquisas sugeridas são pontos de partida, não recomendações verificadas.
          </Text>
        </View>

        {/* Cartão de Formulário Principal: Renderizado através do seletor 'cartaoPrincipal' global */}
        <View style={e.cartaoPrincipal}>
          
          {/* Label de entrada do Tema */}
          <Text style={e.textoEnunciado}>O que você quer aprender ou construir?</Text>
          
          {/* Caixa de Entrada de Texto de Linha Única */}
          <TextInput
            accessibilityLabel="Tema da trilha"
            autoCapitalize="sentences"
            maxLength={120}
            onChangeText={setTema}
            placeholder="Ex.: psicologia, culinária, fotografia ou uma carreira"
            placeholderTextColor={cores.descricao}
            returnKeyType="next"
            style={[e.campoTextoMensagem, { marginTop: espaco.md, maxHeight: 48, paddingVertical: espaco.md }]} // Reutiliza a base de inputs rebaixados do sistema
            value={tema}
          />

          <Text style={[e.textoEnunciado, { marginTop: espaco.xl }]}>O que você quer alcançar?</Text>
          <TextInput
            accessibilityLabel="Objetivo da trilha"
            autoCapitalize="sentences"
            maxLength={240}
            onChangeText={setObjetivo}
            placeholder="Ex.: mudar de carreira, preparar uma prova ou criar um projeto"
            placeholderTextColor={cores.descricao}
            returnKeyType="next"
            style={[e.campoTextoMensagem, { marginTop: espaco.md, minHeight: 48 }]}
            value={objetivo}
          />

          {/* Label de seleção de Níveis */}
          <Text style={[e.textoEnunciado, { marginTop: espaco.xl }]}>Seu nível atual</Text>
          
          {/* Container de Botões de Rádio horizontais alinhados através do seletor 'areaSeletorStatus' */}
          <View style={e.areaSeletorStatus}>
            {niveis.map((item) => {
              const selecionado = nivel === item.valor;
              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selecionado }}
                  key={item.valor}
                  onPress={() => setNivel(item.valor)}
                  // Aplica a combinação por array: Se ativo, mescla o estilo com a classe global 'estadoAtivo'
                  style={[e.pilulaStatusItem, selecionado && e.estadoAtivo, { flex: 1, alignItems: 'center' }]}
                >
                  {/* Modifica a cor do texto de forma dinâmica baseada no estado de seleção */}
                  <Text style={selecionado ? e.textoAtivoForte : e.textoSecundario}>
                    {item.rotulo}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Label do Contexto Opcional */}
          <Text style={[e.textoEnunciado, { marginTop: espaco.xl }]}>Contexto extra (opcional)</Text>
          
          {/* Caixa de Entrada de Texto Multiline (Área de Texto Longa) */}
          <TextInput
            accessibilityLabel="Contexto adicional"
            maxLength={500}
            multiline
            onChangeText={setContexto}
            placeholder="Conte suas preferências, recursos disponíveis ou quanto tempo tem."
            placeholderTextColor={cores.descricao}
            // Combina o campo de texto de mensagens padrão expandindo a altura máxima conforme a regra original
            style={[e.campoTextoMensagem, e.areaRolagemEstrategia, { marginTop: espaco.md, maxHeight: 96 }]}
            textAlignVertical="top" // Força o placeholder a iniciar no topo esquerdo do input no Android
            value={contexto}
          />

          {/* Renderização condicional de erros de validação local ou do banco de dados */}
          {erro ? <Text accessibilityRole="alert" style={[e.textoErro, { marginTop: espaco.md }]}>{erro}</Text> : null}
          {storageError ? (
            <Text accessibilityRole="alert" style={[e.textoErro, { marginTop: espaco.md }]}>
              O armazenamento local não pôde ser lido. As trilhas podem não persistir após fechar o app.
            </Text>
          ) : null}

          {/* Gera uma orientação autenticada por meio da função Firebase. */}
          <Pressable
            accessibilityRole="button"
            disabled={isLoading || criando || storageError}
            onPress={criarRoteiroComIA}
            // Controla a opacidade nativa nas ações de toque e desabilitação combinando seletores globais de botões primários
            style={({ pressed }) => [
              e.botaoConfirmar,
              (isLoading || criando || storageError) && e.botaoDesabilitado,
              pressed && { opacity: 0.82 }
            ]}
          >
            {/* Texto interno do botão centralizado consumindo a tipografia master de botões */}
            <Text style={e.textoBotao}>
              {criando ? 'Preparando orientação...' : 'Gerar orientação com IA'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={isLoading || criando || storageError}
            onPress={criarRoteiroLocal}
            style={({ pressed }) => [
              e.botaoSecundario,
              (isLoading || criando || storageError) && e.botaoDesabilitado,
              pressed && { opacity: 0.82 },
            ]}
          >
            <Text style={e.textoBotao}>Criar trilha sem IA</Text>
          </Pressable>
          
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
