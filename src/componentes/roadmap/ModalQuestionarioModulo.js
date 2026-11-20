// componentes/roadmap/ModalQuestionarioModulo.js
import React, { useCallback, useEffect, useState } from 'react'; // Importa hooks essenciais do React para estado, efeito e memorização
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'; // Importa componentes nativos de interface e indicadores visuais
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Hook para respeitar as áreas seguras (StatusBar e barra inferior)
import { Feather } from '@expo/vector-icons'; // Biblioteca de ícones vetoriais padrão do Expo
import { estilos, espaco, fonte, raio } from '../estilos'; // Importa tokens e classes visuais centralizadas do Design System
import { cores } from '../cores'; // Importa a paleta de cores unificada do projeto
import ResultadoQuestionario from './ResultadoQuestionario'; // Componente que exibe o boletim final após a correção

/**
 * COMPONENTE: ModalQuestionarioModulo (Substituto do SectorQuiz)
 *
 * Finalidade: Janela modal em tela cheia onde o usuário responde perguntas de múltipla escolha
 * sobre o módulo estudado para validar o aprendizado antes de avançar.
 *
 * @param {boolean} visivel - Controla a exibição do modal
 * @param {function} onFechar - Callback chamado para fechar a tela
 * @param {object} trilha - Objeto com os dados da trilha completa
 * @param {object} modulo - Módulo atual selecionado
 * @param {number} indiceModulo - Posição do módulo na lista
 * @param {function} onSalvarResultado - Callback chamado quando o quiz é concluído
 * @param {function} funcaoGerarPerguntas - Função que conecta com IA para criar as questões
 * @param {function} funcaoPersistirTentativa - Função opcional para salvar o resultado no banco
 */
export default function ModalQuestionarioModulo({
  visivel,
  onFechar,
  trilha,
  modulo,
  indiceModulo = 0,
  onSalvarResultado,
  funcaoGerarPerguntas,
  funcaoPersistirTentativa,
}) {
  const insets = useSafeAreaInsets(); // Captura os recuos exatos da StatusBar e dos gestos do sistema

  const [questoes, setQuestoes] = useState([]); // Armazena a lista de perguntas geradas pela IA
  const [respostas, setRespostas] = useState({}); // Mapa { indiceQuestao: indiceOpcaoEscolhida }
  const [resultado, setResultado] = useState(null); // Guarda o objeto final de nota após a correção
  const [carregando, setCarregando] = useState(false); // Indica quando a IA está gerando as perguntas
  const [salvando, setSalvando] = useState(false); // Indica quando a tentativa está sendo corrigida/salva
  const [mensagemErro, setMensagemErro] = useState(''); // Armazena mensagens de erro amigáveis para o usuário

  /**
   * Dispara a geração de novas questões via IA e limpa tentativas anteriores
   */
  const iniciarNovoQuestionario = useCallback(async () => {
    setCarregando(true); // Ativa o spinner de carregamento
    setMensagemErro(''); // Limpa erros anteriores
    setRespostas({}); // Reseta as alternativas marcadas
    setResultado(null); // Limpa o boletim anterior

    try {
      let questoesGeradas = [];

      if (funcaoGerarPerguntas) {
        // Chama o serviço de IA passando o contexto da trilha e do módulo atual
        questoesGeradas = await funcaoGerarPerguntas({ trilha, modulo });
      } else {
        throw new Error('O serviço de geração de questionários não está configurado.');
      }

      setQuestoes(questoesGeradas); // Salva as perguntas recebidas no estado
    } catch (erro) {
      console.error('Falha ao gerar questionário:', erro);
      setMensagemErro(
        erro instanceof Error ? erro.message : 'Não conseguimos gerar o checkpoint agora.'
      );
    } finally {
      setCarregando(false); // Encerra o indicador de carregamento
    }
  }, [funcaoGerarPerguntas, modulo, trilha]);

  /**
   * Recarrega o quiz sempre que o modal for aberto para um módulo
   */
  useEffect(() => {
    if (!visivel || !modulo) return undefined;
    // Executa de forma assíncrona para evitar chamadas síncronas de setState no efeito
    const temporizador = setTimeout(() => {
      void iniciarNovoQuestionario();
    }, 0);
    return () => clearTimeout(temporizador);
  }, [visivel, indiceModulo, iniciarNovoQuestionario, modulo]);

  // Contagem de quantas perguntas já foram respondidas pelo usuário
  const totalRespondidas = Object.keys(respostas).length;

  /**
   * Corrige as respostas do usuário e calcula a nota final
   */
  const corrigirQuestionario = async () => {
    // Validação: obriga responder todas as perguntas antes de corrigir
    if (totalRespondidas < questoes.length) {
      setMensagemErro('Responda todas as perguntas antes de corrigir.');
      return;
    }

    setMensagemErro(''); // Limpa alertas anteriores
    setSalvando(true); // Bloqueia o botão enquanto processa

    const total = questoes.length; // Quantidade total de questões do checkpoint
    // Conta quantos acertos o usuário obteve comparando com 'correct_index'
    const score = questoes.reduce((acumulador, questao, index) => {
      return acumulador + (respostas[index] === questao.correct_index ? 1 : 0);
    }, 0);

    const percent = Math.round((score / total) * 100); // Calcula a porcentagem de acerto
    const passed = percent >= 70; // REGRA DE NOTA: 70% ou mais para aprovação no módulo

    const dadosResultado = { score, total, percent, passed }; // Estrutura consolidada do boletim

    try {
      // Se houver função de persistência externa configurada, salva no banco
      if (funcaoPersistirTentativa) {
        await funcaoPersistirTentativa({
          roadmap_id: trilha?.id,
          module_index: indiceModulo,
          dadosResultado,
        });
      }

      setResultado(dadosResultado); // Exibe a tela de resultado ao usuário

      // Notifica o componente pai sobre a conclusão do quiz
      if (onSalvarResultado) {
        onSalvarResultado({
          module_index: indiceModulo,
          ...dadosResultado,
        });
      }
    } catch (erro) {
      console.error('Falha ao salvar resultado do questionário:', erro);
      setMensagemErro('Não conseguimos salvar seu resultado. Tente novamente.');
    } finally {
      setSalvando(false); // Libera o estado de processamento
    }
  };
  return (
    <Modal
      transparent={false} // Fundo totalmente opaco para impedir leitura sobreposta da tela de trás
      visible={visivel} // Controla visibilidade do modal
      animationType="slide" // Transição suave de baixo para cima
      statusBarTranslucent={false} // Respeita o limite nativo da barra de status
      onRequestClose={onFechar} // Suporte ao botão Voltar físico/gesto do Android
    >
      {/* Container principal com fundo opaco e recuo seguro no topo e na base */}
      <View
        style={[
          estilos.containerPrincipal,
          {
            paddingTop: Math.max(insets.top, espaco.xl) + espaco.sm,
            paddingBottom: Math.max(insets.bottom, espaco.lg),
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          {/* CABEÇALHO DO CHECKPOINT */}
          <View style={[estilos.cabecalhoModal, { alignItems: 'center', gap: espaco.md }]}>
            <View style={estilos.areaTextos}>
              <View style={estilos.linhaTituloModal}>
                <Feather name="shield" size={16} color={cores.confirmar} />
                <Text style={estilos.textoTituloModal}>Checkpoint de Setor</Text>
              </View>
              <Text style={estilos.textoSecundarioEspacado} numberOfLines={2}>
                {modulo?.title || 'Avaliação do módulo'} · teste seus conhecimentos antes de avançar.
              </Text>
            </View>

            {/* Botão explícito de Fechar para o usuário sair a qualquer momento */}
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Fechar checkpoint"
              onPress={onFechar}
              activeOpacity={0.75}
              hitSlop={10}
              style={[
                estilos.superficie,
                estilos.linhaCompacta,
                {
                  paddingHorizontal: espaco.md,
                  paddingVertical: espaco.sm,
                  borderRadius: raio.sm,
                },
              ]}
            >
              <Feather name="x" size={16} color={cores.titulos} />
              <Text style={estilos.textoEnunciado}>Fechar</Text>
            </TouchableOpacity>
          </View>

          {/* INDICADOR DE CARREGAMENTO ENQUANTO A IA CRIA AS PERGUNTAS */}
          {carregando && (
            <View style={[estilos.centro, { flex: 1, gap: espaco.md }]}>
              <ActivityIndicator size="large" color={cores.confirmar} />
              <Text style={estilos.textoSecundario}>
                Preparando as perguntas do seu nível...
              </Text>
            </View>
          )}

          {/* BANNER DE MENSAGEM DE ERRO (SE HOUVER) */}
          {mensagemErro ? (
            <View
              style={[
                estilos.bannerAlertaDestrutivo,
                estilos.linha,
                { gap: espaco.sm, marginBottom: espaco.md },
              ]}
            >
              <Feather name="alert-triangle" size={16} color={cores.cancelar} />
              <Text style={[estilos.textoErro, { flex: 1 }]}>{mensagemErro}</Text>
            </View>
          ) : null}

          {/* TELA DE RESULTADO (EXIBIDA APÓS A CORREÇÃO) */}
          {resultadoEstaVisivel(resultado) ? (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: espaco.xl }}
              showsVerticalScrollIndicator={false}
            >
              <ResultadoQuestionario
                resultado={resultado}
                questoes={questoes}
                respostasUsuario={questoes.map((_, i) => respostas[i])}
                onTentarNovamente={iniciarNovoQuestionario}
              />
            </ScrollView>
          ) : null}

          {/* FORMULÁRIO DE PERGUNTAS (ENQUANTO NÃO HOUVER RESULTADO) */}
          {!resultado && !carregando && questoes.length > 0 ? (
            <>
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: espaco.lg }}
                showsVerticalScrollIndicator={true}
              >
                {questoes.map((questao, indiceQuestao) => (
                  <View
                    key={`pergunta-${indiceQuestao}`}
                    style={estilos.cartaoPergunta}
                  >
                    {/* Número da questão */}
                    <Text style={estilos.rotuloDestaqueEspacado}>
                      Pergunta {indiceQuestao + 1} de {questoes.length}
                    </Text>

                    {/* Enunciado da pergunta */}
                    <Text style={[estilos.textoEnunciado, { marginBottom: espaco.md }]}>
                      {questao.question}
                    </Text>

                                        {/* Lista de alternativas A, B, C, D */}
                                        {/* Lista de alternativas A, B, C, D */}
                    <View style={{ width: '100%', alignItems: 'stretch', gap: espaco.sm }}>
                      {questao.options.map((opcaoTexto, indiceOpcao) => {
                        const estaSelecionada = respostas[indiceQuestao] === indiceOpcao; // Verifica se é a opção marcada
                        const letra = String.fromCharCode(65 + indiceOpcao); // Converte 0 -> A, 1 -> B, 2 -> C...

                        return (
                          <TouchableOpacity
                            key={`opcao-${indiceOpcao}`}
                            style={[
                              estilos.superficie,
                              {
                                flexDirection: 'row', // Alinha letra à esquerda e texto à direita
                                alignItems: 'center', // Centraliza verticalmente na linha
                                justifyContent: 'flex-start', // Começa sempre da esquerda
                                width: '100%', // Ocupa 100% da largura do cartão da pergunta
                                gap: espaco.md, // Espaço entre o círculo da letra e o texto
                                padding: espaco.md,
                                borderRadius: raio.sm,
                              },
                              estaSelecionada && estilos.estadoAtivo,
                            ]}
                            onPress={() => {
                              // Registra a alternativa escolhida para esta questão
                              setRespostas((atual) => ({
                                ...atual,
                                [indiceQuestao]: indiceOpcao,
                              }));
                            }}
                            activeOpacity={0.7}
                          >
                            {/* Distintivo da letra (A, B, C, D) */}
                            <View
                              style={[
                                estilos.centro,
                                {
                                  width: 28,
                                  height: 28,
                                  flexShrink: 0, // Impede que o círculo da letra seja esmagado por textos longos
                                  borderRadius: raio.pill,
                                  backgroundColor: estaSelecionada
                                    ? cores.confirmar
                                    : cores.bkprincipal,
                                  borderWidth: 1,
                                  borderColor: estaSelecionada
                                    ? cores.confirmar
                                    : cores.bordaInput,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  estilos.textoDestaqueCompacto,
                                  estaSelecionada && {
                                    color: cores.botoesTexto || '#FFFFFF',
                                  },
                                ]}
                              >
                                {letra}
                              </Text>
                            </View>

                            {/* Texto da alternativa ocupando todo o espaço restante à direita */}
                            <Text
                              style={[
                                estilos.textoCorpo,
                                {
                                  flex: 1,
                                  color: cores.titulos, // Garante alto contraste branco/claro sobre o fundo escuro
                                },
                                estaSelecionada && estilos.textoAtivoForte,
                              ]}
                            >
                              {opcaoTexto}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                  </View>
                ))}
              </ScrollView>

              {/* BOTÃO DE CORRIGIR RESPOSTAS */}
              <TouchableOpacity
                style={[
                  estilos.botaoPrimario,
                  {
                    height: 48,
                    borderRadius: raio.md,
                    marginTop: espaco.sm,
                  },
                  salvando && estilos.botaoDesabilitado,
                ]}
                onPress={corrigirQuestionario}
                disabled={salvando}
                activeOpacity={0.8}
              >
                {salvando ? (
                  <ActivityIndicator size="small" color={cores.botoesTexto || '#FFFFFF'} />
                ) : (
                  <Text
                    style={[
                      estilos.textoEnunciado,
                      { color: cores.botoesTexto || '#FFFFFF' },
                    ]}
                  >
                    Corrigir ({totalRespondidas}/{questoes.length} respondidas)
                  </Text>
                )}
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

// Função auxiliar defensiva para checagem de resultado válido
function resultadoEstaVisivel(res) {
  return res !== null && typeof res === 'object';
}
