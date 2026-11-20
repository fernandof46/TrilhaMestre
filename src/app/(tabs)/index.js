// src/app/(tabs)/index.js
import React, { useState } from 'react'; // Importa React e o hook useState para controlar carregamento e mensagens de erro
import { Alert, Pressable, ScrollView, Text, View,  KeyboardAvoidingView, Platform, } from 'react-native'; // Importa componentes nativos de layout, toque e alertas
import { useRouter } from 'expo-router'; // Hook de navegação imperativa do Expo Router
import { useAutenticacao } from '../../contextos/AuthContext'; // Contexto que fornece os dados do usuário autenticado
import { useTrilhas } from '../../contextos/TrilhasContext'; // Contexto global que armazena as trilhas salvas do usuário
import { gerarOrientacaoComIA } from '../../servicos/ia/iaRoteador'; // Cascata gratuita de IA (Groq -> Gemini -> OpenRouter)
import { verificarEConsumirGeracaoTrilha } from '../../servicos/armazenamento/controleUsoServico'; // Serviço de trava diária (3 trilhas/24h)
import { usarAnuncioIntersticial, usarAnuncioPremiado } from '../../servicos/anuncios/usarAnuncios'; // Hooks de Interstitial e Vídeo Premiado (AdMob)
import { estilos as e, espaco } from '../../componentes/estilos'; // Tokens e classes visuais centralizadas do Design System
import { cores } from '../../componentes/cores'; // Paleta de cores unificada do projeto
import FormularioGerador from '../../componentes/gerador/FormularioGerador'; // Formulário principal de configuração e criação de trilha

// PRODUÇÃO: mantém a trava diária de 3 trilhas gratuitas ativa (mude para true apenas em testes internos)
const MODO_TESTE_SEM_LIMITE = false;

/**
 * Monta o objeto temporário (rascunho) fora do ciclo de renderização do componente
 * para atender à regra 'react-hooks/purity' do React Compiler.
 */
function criarRascunhoTrilha({ roteiroGerado, nivel, topico, objetivoFormatado, contextoCompleto }) {
  return {
    ...roteiroGerado,
    id: 'previa-' + Date.now(), // Gera identificador temporário fora da árvore de renderização
    level: nivel, // Preserva o nível escolhido (iniciante, intermediario, avancado)
    topic: topico, // Preserva o tema principal digitado
    goal: objetivoFormatado, // Preserva o objetivo formatado
    context: contextoCompleto, // Preserva carga horária, prazo e observações
  };
}


export default function TelaInicial() {
  const roteador = useRouter(); // Inicializa o controlador de rotas para navegar entre telas
  const { usuario } = useAutenticacao(); // Extrai o objeto do usuário logado (ex.: e-mail exibido no cabeçalho)
  const { trilhas, isLoading } = useTrilhas(); // Obtém a lista de trilhas salvas e o estado de carregamento inicial
  const { exibirIntersticial } = usarAnuncioIntersticial(); // Controlador do anúncio de tela cheia (geração gratuita e retomada de estudos)
  const { exibirAnuncioPremiado, premiadoCarregado } = usarAnuncioPremiado(); // Controlador do vídeo de 30s para liberar cota extra após 3 trilhas

  const [estaGerando, setEstaGerando] = useState(false); // Controla o spinner e bloqueia o botão enquanto a IA monta o roteiro
  const [erroGeracao, setErroGeracao] = useState(''); // Armazena mensagens de erro amigáveis caso a geração falhe

  /**
   * Executa a chamada à cascata de IA e navega para a tela de prévia da trilha gerada.
   * @param {object} parametros - Dados estruturados do objetivo, nível e contexto do aluno.
   */
  const executarGeracaoComIA = async ({
    topico,
    objetivoFormatado,
    nivel,
    contextoCompleto,
  }) => {
    setEstaGerando(true); // Ativa o indicador visual de carregamento no botão do formulário
    try {
      // Solicita o roteiro de estudos estruturado em fases e etapas para a IA
      const roteiroGerado = await gerarOrientacaoComIA({
        tema: topico,
        objetivo: objetivoFormatado,
        nivel,
        contexto: contextoCompleto,
      });

      // Monta o objeto temporário (rascunho/prévia) para o usuário explorar antes de salvar definitivamente
            // Monta o objeto temporário (rascunho/prévia) para o usuário explorar antes de salvar definitivamente
      const rascunho = criarRascunhoTrilha({
        roteiroGerado,
        nivel,
        topico,
        objetivoFormatado,
        contextoCompleto,
      });


      // Navega para a tela de detalhes passando o rascunho serializado como parâmetro de rota
      roteador.push({
        pathname: '/trilha/' + rascunho.id,
        params: { rascunhoJson: JSON.stringify(rascunho) },
      });
    } catch (erro) {
      // Registra a falha técnica no console e exibe mensagem legível ao usuário
      console.error('Falha ao gerar trilha:', erro);
      setErroGeracao(
        erro instanceof Error ? erro.message : 'Não foi possível gerar sua trilha agora.'
      );
    } finally {
      setEstaGerando(false); // Libera o botão do formulário ao concluir ou falhar
    }
  };

  /**
   * Acionado ao submeter o FormularioGerador.
   * Gerencia a política de monetização:
   * - Até 3 trilhas em 24h: exibe um anúncio Interstitial e gera a trilha.
   * - Acima de 3 trilhas em 24h: oferece um vídeo premiado de 30s para liberar +1 trilha extra.
   */
  const lidarComGeracao = async ({
    topico,
    tipoMeta,
    nivel,
    horasPorSemana,
    semanasHorizonte,
    contexto,
  }) => {
    setErroGeracao(''); // Limpa qualquer alerta de erro anterior antes de iniciar

    // Formata o objetivo principal conforme a escolha entre 'aprender' ou 'construir'
    const objetivoFormatado =
      tipoMeta === 'construir'
        ? 'Construir um projeto prático em ' + topico
        : 'Aprender e dominar ' + topico + ' do zero';

    // Consolida disponibilidade semanal, horizonte de semanas e observações extras em um único texto para a IA
    const contextoCompleto = [
      'Disponibilidade: ' + horasPorSemana + ' horas por semana.',
      'Prazo desejado: ' + semanasHorizonte + ' semanas.',
      contexto ? 'Observações do aluno: ' + contexto : '',
    ]
      .filter(Boolean)
      .join(' ');

    // 1. Verifica se o usuário ainda possui cota gratuita dentro da janela de 24 horas (limite de 3)
    if (!MODO_TESTE_SEM_LIMITE) {
      const limite = await verificarEConsumirGeracaoTrilha();

      // Caso o limite diário tenha sido atingido, oferece o vídeo de 30s como recompensa para desbloquear uma nova geração
      if (!limite.permitido) {
        Alert.alert(
          'Limite Gratuito Atingido 🎬',
          'Você já gerou suas 3 trilhas gratuitas de hoje (renovação em ~' +
            limite.horasRestantes +
            'h).\n\nAssista a um vídeo de 30 segundos para liberar uma nova trilha agora!',
          [
            { text: 'Agora não', style: 'cancel' }, // Permite cancelar sem assistir
            {
              text: premiadoCarregado ? 'Assistir vídeo (30s)' : 'Aguardando vídeo...',
              onPress: () => {
                // Dispara o anúncio premiado de 30s e executa a geração somente após o usuário concluir o vídeo
                exibirAnuncioPremiado(
                  () => {
                    void executarGeracaoComIA({
                      topico,
                      objetivoFormatado,
                      nivel,
                      contextoCompleto,
                    });
                  },
                  () => {
                    // Fallback caso o vídeo ainda não tenha terminado o pré-carregamento na rede
                    Alert.alert(
                      'Vídeo Indisponível',
                      'O vídeo ainda está carregando. Aguarde alguns segundos e tente novamente.'
                    );
                  }
                );
              },
            },
          ]
        );
        return; // Interrompe o fluxo padrão enquanto aguarda a escolha no alerta
      }
    }

    // 2. Dentro das 3 trilhas gratuitas: exibe o Interstitial e inicia a geração logo após fechar o anúncio
    exibirIntersticial(() => {
      void executarGeracaoComIA({
        topico,
        objetivoFormatado,
        nivel,
        contextoCompleto,
      });
    });
  };

  /**
   * Acionado quando o usuário toca em uma trilha já salva para retomar os estudos.
   * Exibe um anúncio Interstitial antes de abrir a tela da trilha.
   * @param {string} trilhaId - Identificador único da trilha selecionada.
   */
  const abrirTrilhaParaRetomar = (trilhaId) => {
    exibirIntersticial(() => {
      roteador.push('/trilha/' + trilhaId); // Navega para a trilha após o fechamento do anúncio
    });
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
      style={{ flex: 1, backgroundColor: cores.bkprincipal }}
    >
      {/* Contêiner rolável principal da aba Criar Trilha */}
    <ScrollView
      style={{ flex: 1, backgroundColor: cores.bkprincipal }}
      contentContainerStyle={[
        e.containerPrincipal,
        { flex: undefined, flexGrow: 1 }, // Garante que o conteúdo role livremente sem travar a altura
      ]}
      keyboardShouldPersistTaps="handled" // Permite tocar nos botões diretamente mesmo com o teclado aberto
    >
      {/* Cabeçalho da seção de planejamento inteligente */}
      <View>
        <Text style={e.rotuloDestaqueEspacado}>PLANEJADOR INTELIGENTE</Text>
        <Text style={e.textoTituloDestaque}>Planeje seus estudos</Text>
        {/* Exibe o e-mail do usuário autenticado como identificação discreta */}
        {usuario?.email ? (
          <Text style={[e.textoApoio, { marginTop: espaco.xs }]}>{usuario.email}</Text>
        ) : null}
      </View>

      {/* Subtítulo explicativo alinhado à esquerda */}
      <Text style={[e.textoDescricao, { textAlign: 'left', marginTop: espaco.md }]}>
        Informe o que deseja aprender para gerar um roteiro com etapas, tutor IA e materiais de apoio.
      </Text>

      {/* Formulário principal de criação de trilha */}
      <View style={{ marginTop: espaco.xl }}>
        <FormularioGerador
          aoGerar={lidarComGeracao} // Dispara o fluxo de cota + anúncio + IA ao submeter
          estaGerando={estaGerando} // Controla o estado de carregamento do botão
          erro={erroGeracao} // Exibe mensagens de erro caso a geração falhe
        />
      </View>

      {/* Seção de acesso rápido às 3 últimas trilhas salvas pelo usuário */}
      <View style={{ marginTop: espaco.xl }}>
        <Text style={[e.textoTituloItem, { marginBottom: espaco.md }]}>Trilhas recentes</Text>

        {/* Exibe feedback enquanto lê o armazenamento local (AsyncStorage) */}
        {isLoading ? (
          <Text style={e.textoApoio}>Carregando...</Text>
        ) : trilhas.length === 0 ? (
          /* Cartão informativo quando o usuário ainda não salvou nenhuma trilha */
          <View style={e.cartaoGenerico}>
            <View style={e.cartaoConteudo}>
              <Text style={e.textoApoio}>Nenhuma trilha salva ainda.</Text>
            </View>
          </View>
        ) : (
          /* Renderiza até 3 trilhas recentes; ao tocar, exibe Interstitial de retomada aos estudos */
          trilhas.slice(0, 3).map((trilha) => (
            <Pressable
              key={trilha.id}
              onPress={() => abrirTrilhaParaRetomar(trilha.id)} // Roda o Interstitial antes de abrir a trilha
              style={({ pressed }) => [
                e.cartaoGenerico,
                pressed && { opacity: 0.85 }, // Feedback visual sutil ao tocar no cartão
              ]}
            >
              <View style={e.cartaoConteudo}>
                {/* Nível de dificuldade e tempo estimado da trilha */}
                <Text style={e.rotuloDestaqueEspacado}>
                  {trilha.level} · {trilha.estimatedTime}
                </Text>
                {/* Título principal da trilha */}
                <Text style={e.textoTituloTrilha}>{trilha.title}</Text>
                {/* Resumo limitado a 2 linhas para manter os cartões uniformes */}
                <Text numberOfLines={2} style={e.textoApoio}>
                  {trilha.description}
                </Text>
              </View>
            </Pressable>
          ))
        )}
      </View>

      {/* Espaçamento inferior extra para afastar o último item da barra de abas e do Banner AdMob */}
      <View style={{ height: espaco.xxl, backgroundColor: cores.bkprincipal }} />
    </ScrollView>
    </KeyboardAvoidingView>
  );
}
