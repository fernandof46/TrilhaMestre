import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * ATALHOS RÁPIDOS DE FEEDBACK
 * Frases prontas para o usuário ajustar o plano com apenas um toque.
 */
const ATALHOS_FEEDBACK = [
  'Está difícil demais, preciso de etapas menores',
  'Está fácil demais, quero avançar mais rápido',
  'Tenho menos tempo por semana agora',
  'Quero focar em prática e projeto, menos teoria',
  'Preciso priorizar só o que gera resultado rápido',
];

/**
 * COMPONENTE: ModalAjusteEstrategia (Substituto do StrategyDialog)
 * 
 * Finalidade: Permite ao usuário solicitar à IA que reescreva o cronograma
 * da trilha de estudos com base em mudanças de rotina ou dificuldades,
 * preservando todo o progresso já concluído.
 * 
 * @param {boolean} visivel - Controla a exibição do modal
 * @param {function} onFechar - Callback chamado para fechar a tela
 * @param {object} trilha - Dados completos da rota de estudos
 * @param {function} onTrilhaAdaptada - Callback emitido com os dados atualizados
 * @param {function} funcaoAdaptarIA - Função que conecta com o serviço de IA
 * @param {function} funcaoSalvarTrilha - Função que persiste as alterações no banco/armazenamento
 */
export default function ModalAjusteEstrategia({
  visivel,
  onFechar,
  trilha,
  onTrilhaAdaptada,
  funcaoAdaptarIA,
  funcaoSalvarTrilha,
}) {
  const [textoFeedback, setTextoFeedback] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [notaSucesso, setNotaSucesso] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');

  /**
   * Dispara a adaptação inteligente do plano via IA
   */
  const aplicarAjusteEstrategia = async () => {
    if (!textoFeedback.trim() && !notaSucesso) return;

    setCarregando(true);
    setMensagemErro('');
    setNotaSucesso('');

    try {
      let resultadoRevisado = {};

      if (funcaoAdaptarIA) {
        resultadoRevisado = await funcaoAdaptarIA({
          trilha,
          feedback: textoFeedback.trim(),
        });
      } else {
        // Fallback defensivo didático
        resultadoRevisado = {
          modules: trilha?.modules || [],
          adaptation_note: 'Plano recalculado com foco no seu novo ritmo semanal.',
        };
      }

      const modulosAtualizados = resultadoRevisado?.modules || trilha?.modules || [];
      const historicoAtualizado = [
        ...(trilha?.adaptations || []),
        {
          date: new Date().toISOString(),
          note: resultadoRevisado?.adaptation_note || textoFeedback.trim() || 'Ajuste de ritmo',
        },
      ].slice(-12);

      const dadosAtualizados = {
        modules: modulosAtualizados,
        summary: resultadoRevisado?.summary || trilha?.summary,
        total_weeks: resultadoRevisado?.total_weeks || trilha?.total_weeks,
        total_hours: resultadoRevisado?.total_hours || trilha?.total_hours,
        adaptations: historicoAtualizado,
      };

      if (funcaoSalvarTrilha && trilha?.id) {
        await funcaoSalvarTrilha(trilha.id, dadosAtualizados);
      }

      if (onTrilhaAdaptada) {
        onTrilhaAdaptada({ ...trilha, ...dadosAtualizados });
      }

      setNotaSucesso(resultadoRevisado?.adaptation_note || 'Estratégia recalculada com sucesso!');
      setTextoFeedback('');
    } catch (erro) {
      setMensagemErro('Não conseguimos ajustar a trilha agora. Tente novamente em alguns instantes.');
    } finally {
      setCarregando(false);
    }
  };

  // Pega os 2 últimos ajustes para mostrar no histórico
  const historicoRecente = (trilha?.adaptations || []).slice(-2).reverse();

  return (
    <Modal
      transparent={true}
      visible={visivel}
      animationType="slide"
      onRequestClose={onFechar}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={estilos.fundoModalChatTutor} // Reaproveitado do modal anterior
      >
        <View style={estilos.painelConteudoChatTutor}>
          
          {/* 1. CABEÇALHO DO MODAL (Reaproveitado) */}
          <View style={estilos.cabecalhoChatTutor}>
            <View>
              <View style={estilos.linhaTituloChatTutor}>
                <Feather name="sliders" size={16} color={cores.confirmar} />
                <Text style={estilos.textoTituloChatTutor}>Ajuste de Estratégia</Text>
              </View>
              <Text style={estilos.textoSubtituloEtapaTutor} numberOfLines={2}>
                Conte o que mudou no seu ritmo. A IA adapta o plano sem perder o que você já fez.
              </Text>
            </View>

            <TouchableOpacity onPress={onFechar} hitSlop={10}>
              <Feather name="x" size={20} color={cores.descricao} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={estilos.areaRolagemEstrategia}
            showsVerticalScrollIndicator={false}
          >
            {/* 2. ATALHOS RÁPIDOS DE FEEDBACK (Reaproveitados de pílulas) */}
            <View style={estilos.areaSugestoesRapidasTutor}>
              {ATALHOS_FEEDBACK.map((atalho, index) => (
                <TouchableOpacity
                  key={`atalho-${index}`}
                  style={estilos.botaoSugestaoRapidaTutor}
                  onPress={() => setTextoFeedback(atalho)}
                  disabled={carregando}
                >
                  <Text style={estilos.textoBotaoSugestaoTutor}>{atalho}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 3. CAMPO DE TEXTO LIVRE */}
            <TextInput
              style={[
                estilos.campoTextoMensagemTutor,
                { minHeight: 80, marginVertical: 10, textAlignVertical: 'top' },
              ]}
              value={textoFeedback}
              onChangeText={setTextoFeedback}
              placeholder="Ex.: travei em um conteúdo, tenho só 4h por semana agora ou quero focar em projetos práticos..."
              placeholderTextColor={cores.descricao}
              multiline={true}
              numberOfLines={4}
              editable={!carregando}
            />

            {/* 4. MENSAGEM DE ERRO (Reaproveitada) */}
            {mensagemErro ? (
              <View style={estilos.areaErroQuestionario}>
                <Feather name="alert-triangle" size={16} color={cores.cancelar} />
                <Text style={estilos.textoErroQuestionario}>{mensagemErro}</Text>
              </View>
            ) : null}

            {/* 5. NOTA DE SUCESSO GERADA PELA IA */}
            {notaSucesso ? (
              <View style={estilos.blocoNotaNovaEstrategia}>
                <Text style={estilos.textoRotuloCriterio}>NOVA ESTRATÉGIA</Text>
                <Text style={estilos.textoConteudoPratica}>{notaSucesso}</Text>
              </View>
            ) : null}

            {/* 6. HISTÓRICO DE AJUSTES PASSADOS */}
            {historicoRecente.length > 0 && (
              <View style={{ marginVertical: 8 }}>
                <Text style={estilos.textoRotuloPratica}>Ajustes anteriores</Text>
                {historicoRecente.map((item, idx) => (
                  <Text key={`hist-${idx}`} style={estilos.itemHistoricoAdaptacao}>
                    · {item.note}
                  </Text>
                ))}
              </View>
            )}

            {/* 7. BOTÃO DE AÇÃO PRINCIPAL */}
            <TouchableOpacity
              style={[
                estilos.botaoConfirmar,
                carregando && { opacity: 0.6 },
              ]}
              onPress={aplicarAjusteEstrategia}
              disabled={carregando}
              activeOpacity={0.8}
            >
              {carregando ? (
                <ActivityIndicator size="small" color={cores.botoesTexto} />
              ) : (
                <Text style={estilos.textoBotao}>Reescrever Plano com IA</Text>
              )}
            </TouchableOpacity>

          </ScrollView>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}