// componentes/roadmap/ResultadoQuestionario.js
import React from 'react'; // Importa o núcleo do React
import { View, Text, TouchableOpacity } from 'react-native'; // Importa componentes nativos de layout, texto e toque
import { Feather } from '@expo/vector-icons'; // Biblioteca de ícones vetoriais padrão do Expo
import { estilos, espaco, fonte, raio } from '../estilos'; // Importa tokens e classes visuais centralizadas do Design System
import { cores } from '../cores'; // Importa a paleta de cores unificada do projeto

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
  // Flag que indica se o usuário atingiu a pontuação mínima necessária (70%)
  const foiAprovado = resultado?.passed || false;

  return (
    <View style={{ width: '100%', gap: espaco.lg }}>
      
      {/* 1. PAINEL DE PONTUAÇÃO GERAL */}
      <View
        style={[
          estilos.superficie,
          estilos.painelPontuacaoGeral,
          {
            marginBottom: 0,
            borderColor: foiAprovado ? cores.confirmar : cores.cancelar,
          },
        ]}
      >
        {/* Ícone de troféu/medalha com cor de aprovação ou reprovação */}
        <Feather
          name="award"
          size={32}
          color={foiAprovado ? cores.confirmar : cores.cancelar}
        />

        {/* Porcentagem final em destaque (ex: 80%) */}
        <Text
          style={{
            fontSize: fonte.display,
            fontWeight: '700',
            color: foiAprovado ? cores.confirmar : cores.cancelar,
            marginTop: espaco.sm,
          }}
        >
          {resultado?.percent || 0}%
        </Text>

        {/* Acertos absolutos (ex: 3 de 4 corretas) */}
        <Text style={[estilos.textoTituloItem, { marginTop: espaco.xs }]}>
          {resultado?.score || 0} de {resultado?.total || 0} corretas
        </Text>

        {/* Mensagem educativa de feedback */}
        <Text
          style={[
            estilos.textoFeedback,
            {
              marginTop: espaco.md,
              color: foiAprovado ? cores.confirmar : cores.cancelar,
            },
          ]}
        >
          {foiAprovado
            ? 'Checkpoint aprovado! Você está pronto para avançar para o próximo módulo.'
            : 'Ainda não foi dessa vez. Revise as explicações abaixo e tire dúvidas com o Tutor da Etapa.'}
        </Text>
      </View>

      {/* Título da seção de revisão */}
      <Text style={estilos.rotuloNeutro}>REVISÃO DAS QUESTÕES</Text>

      {/* 2. REVISÃO PERGUNTA POR PERGUNTA */}
      <View style={{ width: '100%', gap: espaco.md }}>
        {questoes.map((itemQuestao, indice) => {
          // Checa se a alternativa marcada pelo usuário é igual ao índice correto
          const acertou = respostasUsuario[indice] === itemQuestao.correct_index;

          return (
            <View
              key={`questao-revisao-${indice}`}
              style={[
                estilos.cartaoPergunta,
                {
                  marginBottom: 0,
                  borderColor: acertou ? cores.confirmar : cores.cancelar,
                },
              ]}
            >
              {/* Enunciado acompanhado do ícone de acerto/erro */}
              <View style={[estilos.linhaTopo, { marginBottom: espaco.sm }]}>
                <Feather
                  name={acertou ? 'check-circle' : 'x-circle'}
                  size={18}
                  color={acertou ? cores.confirmar : cores.cancelar}
                />
                <Text style={[estilos.textoEnunciado, { flex: 1 }]}>
                  {itemQuestao.question}
                </Text>
              </View>

              {/* Mostra a resposta que o usuário marcou */}
              {Array.isArray(itemQuestao.options) && respostasUsuario[indice] !== undefined ? (
                <Text
                  style={[
                    estilos.textoApoio,
                    {
                      marginBottom: espaco.sm,
                      color: acertou ? cores.confirmar : cores.cancelar,
                    },
                  ]}
                >
                  Sua resposta: {itemQuestao.options[respostasUsuario[indice]]}
                </Text>
              ) : null}

              {/* Se o usuário errou, destaca qual era a alternativa correta */}
              {!acertou && Array.isArray(itemQuestao.options) ? (
                <View
                  style={[
                    estilos.blocoVerde,
                    {
                      padding: espaco.md,
                      borderRadius: raio.sm,
                      marginBottom: espaco.sm,
                    },
                  ]}
                >
                  <Text style={estilos.rotuloDestaqueEspacado}>
                    RESPOSTA CORRETA
                  </Text>
                  <Text style={[estilos.textoCorpo, { color: cores.titulos }]}>
                    {itemQuestao.options[itemQuestao.correct_index]}
                  </Text>
                </View>
              ) : null}

              {/* Explicação didática do porquê da resposta */}
              {itemQuestao.explanation ? (
                <Text
                  style={[
                    estilos.textoSecundario,
                    { color: cores.textoComum || cores.descricao },
                  ]}
                >
                  {itemQuestao.explanation}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>

      {/* 3. BOTÃO DE TENTAR NOVAMENTE */}
      <TouchableOpacity
        style={[
          estilos.botaoSecundario,
          {
            height: 48,
            borderRadius: raio.md,
            borderColor: cores.confirmar,
            marginTop: espaco.sm,
          },
        ]}
        onPress={onTentarNovamente}
        activeOpacity={0.8}
      >
        <Feather name="rotate-ccw" size={16} color={cores.confirmar} />
        <Text style={[estilos.textoEnunciado, { color: cores.confirmar }]}>
          Nova bateria de perguntas
        </Text>
      </TouchableOpacity>
    </View>
  );
}
