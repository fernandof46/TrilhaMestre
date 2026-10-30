import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * ATALHOS DE PERGUNTAS RÁPIDAS
 * Dúvidas frequentes que o usuário pode acionar com 1 toque.
 */
const SUGESTOES_INICIAIS = [
  'Explique de forma simples',
  'Me dê um exemplo prático',
  'Estou travado nisso',
  'Como sei que estou pronto?',
];

// Mensagem que o assistente dispara sozinho ao abrir pela primeira vez
const MENSAGEM_BOAS_VINDAS_TUTOR = 'Olá! Me explique esta etapa de forma simples e diga por onde eu começo.';

/**
 * COMPONENTE: ChatTutorEtapa
 * 
 * Função real: Assistente de IA focado exclusivamente em responder dúvidas
 * e destravar o usuário sobre o conteúdo de uma etapa específica.
 * 
 * @param {boolean} visivel - Controla se a janela do chat está aberta
 * @param {function} onFechar - Callback chamado para fechar o modal
 * @param {object} trilha - Objeto com os dados do roadmap
 * @param {object} modulo - Módulo atual do estudo
 * @param {object} etapa - Etapa específica em estudo
 * @param {function} funcaoConsultarIA - Função que conecta com o backend/IA
 */
export default function ChatTutorEtapa({
  visivel,
  onFechar,
  trilha,
  modulo,
  etapa,
  funcaoConsultarIA,
}) {
  const [mensagens, setMensagens] = useState([]);
  const [textoEntrada, setTextoEntrada] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  // Referência do ScrollView para sempre manter a última mensagem visível
  const rolarConversaRef = useRef(null);

  const rolarParaOFinal = useCallback(() => {
    setTimeout(() => {
      rolarConversaRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  /**
   * Envia uma pergunta para o Tutor de IA e anexa a resposta na lista
   */
  const enviarPerguntaParaTutor = async (pergunta, historicoAtual) => {
    const mensagemUsuario = {
      papel: 'usuario',
      conteudo: pergunta,
      horario: Date.now(),
    };

    const novoHistorico = [...historicoAtual, mensagemUsuario];
    setMensagens(novoHistorico);
    setCarregando(true);
    setMensagemErro('');
    rolarParaOFinal();

    try {
      let respostaTutor = '';

      if (funcaoConsultarIA) {
        respostaTutor = await funcaoConsultarIA({
          trilha,
          modulo,
          etapa,
          historico: novoHistorico,
          pergunta,
        });
      } else {
        respostaTutor = 'Compreendido! Comece revisando o primeiro conceito desta etapa e faça os testes práticos.';
      }

      const mensagemAssistente = {
        papel: 'assistente',
        conteudo: respostaTutor,
        horario: Date.now(),
      };

      setMensagens((atual) => [...atual, mensagemAssistente]);
    } catch (erro) {
      setMensagemErro('Não foi possível conectar com o tutor agora. Tente reenviar.');
    } finally {
      setCarregando(false);
      rolarParaOFinal();
    }
  };

  /**
   * Inicia o chat automaticamente com a primeira explicação ao abrir a etapa
   */
  useEffect(() => {
    if (!visivel || !etapa?.key) return;

    setMensagens([]);
    setMensagemErro('');
    enviarPerguntaParaTutor(MENSAGEM_BOAS_VINDAS_TUTOR, []);
  }, [visivel, etapa?.key]);

  /**
   * Acionador de envio via botão ou via toque em sugestão
   */
  const processarEnvio = (textoSugestao) => {
    const textoFinal = (textoSugestao ?? textoEntrada).trim();
    if (!textoFinal || carregando) return;

    setTextoEntrada('');
    enviarPerguntaParaTutor(textoFinal, mensagens);
  };

  return (
    <Modal
      transparent={true}
      visible={visivel}
      animationType="slide"
      onRequestClose={onFechar}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={estilos.fundoModalChatTutor}
      >
        <View style={estilos.painelConteudoChatTutor}>
          
          {/* CABEÇALHO */}
          <View style={estilos.cabecalhoChatTutor}>
            <View>
              <View style={estilos.linhaTituloChatTutor}>
                <Feather name="help-circle" size={16} color={cores.confirmar} />
                <Text style={estilos.textoTituloChatTutor}>Tutor da Etapa</Text>
              </View>
              <Text style={estilos.textoSubtituloEtapaTutor} numberOfLines={1}>
                {etapa?.title || 'Dúvidas e orientações'}
              </Text>
            </View>

            {/* Botão de Fechar */}
            <TouchableOpacity onPress={onFechar} hitSlop={10}>
              <Feather name="x" size={20} color={cores.descricao} />
            </TouchableOpacity>
          </View>

          {/* HISTÓRICO DE MENSAGENS */}
          <ScrollView
            ref={rolarConversaRef}
            style={estilos.areaListaMensagensTutor}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={rolarParaOFinal}
          >
            {mensagens.map((msg, index) => {
              const ehUsuario = msg.papel === 'usuario';
              return (
                <View
                  key={`msg-${index}`}
                  style={ehUsuario ? estilos.linhaMensagemUsuario : estilos.linhaMensagemTutor}
                >
                  <View style={ehUsuario ? estilos.balaoUsuario : estilos.balaoTutor}>
                    <Text style={estilos.textoMensagemChat}>{msg.conteudo}</Text>
                  </View>
                </View>
              );
            })}

            {carregando && (
              <View style={estilos.areaIndicadorDigitandoTutor}>
                <ActivityIndicator size="small" color={cores.confirmar} />
                <Text style={estilos.textoIndicadorDigitandoTutor}>
                  Tutor digitando orientação...
                </Text>
              </View>
            )}
          </ScrollView>

          {/* SUGESTÕES RÁPIDAS */}
          {mensagens.length <= 2 && (
            <View style={estilos.areaSugestoesRapidasTutor}>
              {SUGESTOES_INICIAIS.map((sugestao) => (
                <TouchableOpacity
                  key={sugestao}
                  style={estilos.botaoSugestaoRapidaTutor}
                  onPress={() => processarEnvio(sugestao)}
                  disabled={carregando}
                >
                  <Text style={estilos.textoBotaoSugestaoTutor}>{sugestao}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {mensagemErro ? (
            <Text style={estilos.textoErroChatTutor}>{mensagemErro}</Text>
          ) : null}

          {/* BARRA DE ENTRADA */}
          <View style={estilos.areaEntradaMensagemTutor}>
            <TextInput
              style={estilos.campoTextoMensagemTutor}
              value={textoEntrada}
              onChangeText={setTextoEntrada}
              placeholder="Tire uma dúvida sobre esta etapa..."
              placeholderTextColor={cores.descricao}
              multiline={true}
              editable={!carregando}
            />

            <TouchableOpacity
              style={[
                estilos.botaoEnviarMensagemTutor,
                (!textoEntrada.trim() || carregando) && estilos.botaoEnviarDesabilitadoTutor,
              ]}
              onPress={() => processarEnvio()}
              disabled={!textoEntrada.trim() || carregando}
            >
              <Feather name="send" size={16} color={cores.botoesTexto} />
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}