import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';
import ResultadoQuestionario from './ResultadoQuestionario';

/**
 * COMPONENTE: ModalQuestionarioModulo (Substituto do SectorQuiz)
 * 
 * Finalidade: Janela modal onde o usuário responde perguntas de múltipla escolha
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
  const [questoes, setQuestoes] = useState([]);
  const [respostas, setRespostas] = useState({});
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  /**
   * Dispara a geração de novas questões via IA
   */
  const iniciarNovoQuestionario = async () => {
    setCarregando(true);
    setMensagemErro('');
    setRespostas({});
    setResultado(null);

    try {
      let questoesGeradas = [];

      if (funcaoGerarPerguntas) {
        questoesGeradas = await funcaoGerarPerguntas({ trilha, modulo });
      } else {
        // Mock defensivo caso a função da IA não seja fornecida
        questoesGeradas = [
          {
            question: 'Qual o principal conceito ensinado neste módulo?',
            options: ['Conceito A', 'Conceito B', 'Conceito C', 'Conceito D'],
            correct_index: 0,
            explanation: 'O Conceito A fundamenta a base de toda a arquitetura desta etapa.',
          },
        ];
      }

      setQuestoes(questoesGeradas);
    } catch (erro) {
      setMensagemErro('Não conseguimos gerar o checkpoint agora. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  /**
   * Recarrega o quiz sempre que o modal for aberto para um novo módulo
   */
  useEffect(() => {
    if (visivel && modulo) {
      setQuestoes([]);
      iniciarNovoQuestionario();
    }
  }, [visivel, indiceModulo]);

  // Contagem de quantas perguntas já foram respondidas pelo usuário
  const totalRespondidas = Object.keys(respostas).length;

  /**
   * Corrige as respostas do usuário e calcula a nota
   */
  const corrigirQuestionario = async () => {
    // Validação: obriga responder todas as perguntas
    if (totalRespondidas < questoes.length) {
      setMensagemErro('Responda todas as perguntas antes de corrigir.');
      return;
    }

    setMensagemErro('');
    setSalvando(true);

    const total = questoes.length;
    // Conta quantos acertos o usuário obteve
    const score = questoes.reduce((acumulador, questao, index) => {
      return acumulador + (respostas[index] === questao.correct_index ? 1 : 0);
    }, 0);

    const percent = Math.round((score / total) * 100);
    const passed = percent >= 70; // <-- REGRA DE NOTA: 70% ou mais para aprovação

    const dadosResultado = { score, total, percent, passed };

    try {
      if (funcaoPersistirTentativa) {
        await funcaoPersistirTentativa({
          roadmap_id: trilha?.id,
          module_index: indiceModulo,
          dadosResultado,
        });
      }

      setResultado(dadosResultado);

      if (onSalvarResultado) {
        onSalvarResultado({
          module_index: indiceModulo,
          ...dadosResultado,
        });
      }
    } catch (erro) {
      setMensagemErro('Não conseguimos salvar seu resultado. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visivel}
      animationType="slide"
      onRequestClose={onFechar}
    >
      <View style={estilos.fundoModalQuestionario}>
        <View style={estilos.cartaoModalQuestionario}>
          
          {/* CABEÇALHO */}
          <View style={estilos.cabecalhoModalQuestionario}>
            <View>
              <View style={estilos.linhaTituloQuestionario}>
                <Feather name="shield" size={16} color={cores.confirmar} />
                <Text style={estilos.textoTituloQuestionario}>
                  Checkpoint de setor
                </Text>
              </View>
              <Text style={estilos.textoDescricaoQuestionario} numberOfLines={2}>
                {modulo?.title || 'Avaliação do módulo'} · teste seus conhecimentos antes de avançar.
              </Text>
            </View>

            {/* Botão de Fechar */}
            <TouchableOpacity onPress={onFechar} hitSlop={10}>
              <Feather name="x" size={20} color={cores.descricao} />
            </TouchableOpacity>
          </View>

          {/* INDICADOR DE CARREGAMENTO */}
          {carregando && (
            <View style={estilos.areaCarregandoQuestionario}>
              <ActivityIndicator size="large" color={cores.confirmar} />
              <Text style={estilos.textoCarregandoQuestionario}>
                Preparando as perguntas do seu nível...
              </Text>
            </View>
          )}

          {/* MENSAGEM DE ERRO (SE HOUVER) */}
          {mensagemErro ? (
            <View style={estilos.areaErroQuestionario}>
              <Feather name="alert-triangle" size={16} color={cores.cancelar} />
              <Text style={estilos.textoErroQuestionario}>{mensagemErro}</Text>
            </View>
          ) : null}

          {/* TELA DE RESULTADO (EXIBIDA APÓS A CORREÇÃO) */}
          {resultadadoEstaVisivel(resultado) ? (
            <ResultadoQuestionario
              resultado={resultado}
              questoes={questoes}
              respostasUsuario={questoes.map((_, i) => respostas[i])}
              onTentarNovamente={iniciarNovoQuestionario}
            />
          ) : null}

          {/* FORMULÁRIO DE PERGUNTAS (ENQUANTO NÃO HOUVER RESULTADO) */}
          {!resultado && !carregando && questoes.length > 0 ? (
            <>
              <ScrollView
                style={estilos.areaListaPerguntasQuiz}
                showsVerticalScrollIndicator={false}
              >
                {questoes.map((questao, indiceQuestao) => (
                  <View
                    key={`pergunta-${indiceQuestao}`}
                    style={estilos.cartaoPerguntaItemQuiz}
                  >
                    <Text style={estilos.textoNumeroPerguntaQuiz}>
                      Pergunta {indiceQuestao + 1}
                    </Text>

                    <Text style={estilos.textoEnunciadoQuiz}>
                      {questao.question}
                    </Text>

                    {/* Alternativas A, B, C, D */}
                    <View style={estilos.listaOpcoesQuiz}>
                      {questao.options.map((opcaoTexto, indiceOpcao) => {
                        const estaSelecionada = respostas[indiceQuestao] === indiceOpcao;
                        // Converte 0 -> A, 1 -> B, 2 -> C...
                        const letra = String.fromCharCode(65 + indiceOpcao);

                        return (
                          <TouchableOpacity
                            key={`opcao-${indiceOpcao}`}
                            style={[
                              estilos.botaoOpcaoRespostaQuiz,
                              estaSelecionada && estilos.botaoOpcaoRespostaSelecionada,
                            ]}
                            onPress={() => {
                              setRespostas((atual) => ({
                                ...atual,
                                [indiceQuestao]: indiceOpcao,
                              }));
                            }}
                            activeOpacity={0.7}
                          >
                            <Text style={estilos.letraOpcaoQuiz}>{letra}</Text>
                            <Text
                              style={[
                                estilos.textoOpcaoQuiz,
                                estaSelecionada && estilos.textoOpcaoQuizSelecionada,
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

              {/* BOTÃO DE CORRIGIR */}
              <TouchableOpacity
                style={[
                  estilos.botaoCorrigirQuiz,
                  salvando && estilos.botaoCorrigirDesabilitado,
                ]}
                onPress={corrigirQuestionario}
                disabled={salvando}
                activeOpacity={0.8}
              >
                {salvando ? (
                  <ActivityIndicator size="small" color={cores.botoesTexto} />
                ) : (
                  <Text style={estilos.textoBotaoCorrigirQuiz}>
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

// Função auxiliar defensiva para checagem de resultado
function resultadadoEstaVisivel(res) {
  return res !== null && typeof res === 'object';
}