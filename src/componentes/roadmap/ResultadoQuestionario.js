import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * COMPONENTE: ResultadoQuestionario (Substituto do QuizResult)
 * 
 * Finalidade: Exibir o placar final do teste de conhecimentos do módulo,
 * detalhando as questões que o usuário acertou e errou com explicações.
 * 
 * @param {object} resultado - Placar { passed: boolean, percent: number, score: number, total: number }
 * @param {Array} questoes - Lista de perguntas com opções, gabarito e explicação
 * @param {Array} respostasUsuario - Índices das alternativas que o usuário marcou
 * @param {function} onTentarNovamente - Reinicia o teste com novas perguntas
 */
export default function ResultadoQuestionario({
  resultado,
  questoes = [],
  respostasUsuario = [],
  onTentarNovamente,
}) {
  // Flag que indica se o usuário atingiu a pontuação mínima necessária
  const foiAprovado = resultado?.passed || false;

  return (
    <View style={estilos.containerResultadoQuestionario}>
      
      {/* 1. PAINEL DE PONTUAÇÃO GERAL */}
      <View style={estilos.painelPontuacaoGeral}>
        <Feather
          name="award"
          size={24}
          color={foiAprovado ? cores.confirmar : cores.cancelar}
        />

        {/* Porcentagem final (ex: 80%) */}
        <Text style={estilos.textoPorcentagemResultado}>
          {resultado?.percent || 0}%
        </Text>

        {/* Acertos absolutos (ex: 4 de 5 corretas) */}
        <Text style={estilos.textoPontosResultado}>
          {resultado?.score || 0} de {resultado?.total || 0} corretas
        </Text>

        {/* Mensagem educativa de feedback */}
        <Text
          style={
            foiAprovado
              ? estilos.textoFeedbackAprovado
              : estilos.textoFeedbackReprovado
          }
        >
          {foiAprovado
            ? 'Checkpoint aprovado! Você está pronto para avançar para o próximo módulo.'
            : 'Ainda não foi dessa vez. Revise as explicações abaixo e tire dúvidas com o Tutor da Etapa.'}
        </Text>
      </View>

      {/* 2. REVISÃO PERGUNTA POR PERGUNTA (ROLÁVEL) */}
      <ScrollView
        style={estilos.areaListaRevisaoRespostas}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {questoes.map((itemQuestao, indice) => {
          // Checa se a alternativa marcada pelo usuário é igual ao índice correto
          const acertou = respostasUsuario[indice] === itemQuestao.correct_index;

          return (
            <View key={`questao-revisao-${indice}`} style={estilos.cartaoPerguntaRevisao}>
              
              {/* Enunciado acompanhado do ícone de acerto/erro */}
              <View style={estilos.linhaEnunciadoRevisao}>
                <Feather
                  name={acertou ? 'check-circle' : 'x-circle'}
                  size={16}
                  color={acertou ? cores.confirmar : cores.cancelar}
                />
                <Text style={estilos.textoEnunciadoRevisao}>
                  {itemQuestao.question}
                </Text>
              </View>

              {/* Se o usuário errou, mostra qual era a alternativa correta */}
              {!acertou && itemQuestao.options ? (
                <View style={estilos.blocoGabaritoCorreto}>
                  <Text style={estilos.textoRotuloCorreta}>Resposta correta:</Text>
                  <Text style={estilos.textoOpcaoCorreta}>
                    {itemQuestao.options[itemQuestao.correct_index]}
                  </Text>
                </View>
              ) : null}

              {/* Explicação didática do porquê da resposta */}
              {itemQuestao.explanation ? (
                <Text style={estilos.textoExplicacaoResposta}>
                  {itemQuestao.explanation}
                </Text>
              ) : null}

            </View>
          );
        })}
      </ScrollView>

      {/* 3. BOTÃO DE TENTAR NOVAMENTE */}
      <TouchableOpacity
        style={estilos.botaoTentarNovamente}
        onPress={onTentarNovamente}
        activeOpacity={0.8}
      >
        <Feather name="rotate-ccw" size={14} color={cores.confirmar} />
        <Text style={estilos.textoBotaoTentarNovamente}>
          Nova bateria de perguntas
        </Text>
      </TouchableOpacity>

    </View>
  );
}