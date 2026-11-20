// componentes/roadmap/ChatTutorEtapa.js
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { estilos, espaco } from '../estilos';
import { cores } from '../cores';

const SUGESTOES_INICIAIS = [
  'Explique de forma simples',
  'Me dê um exemplo prático',
  'Estou travado nisso',
  'Como sei que estou pronto?',
];

const MENSAGEM_BOAS_VINDAS_TUTOR =
  'Olá! Me explique esta etapa de forma simples e diga por onde eu começo.';

export default function ChatTutorEtapa({
  visivel,
  onFechar,
  trilha,
  modulo,
  etapa,
  funcaoConsultarIA,
}) {
  const insets = useSafeAreaInsets();

  const [mensagens, setMensagens] = useState([]);
  const [textoEntrada, setTextoEntrada] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  const rolarConversaRef = useRef(null);

  const rolarParaOFinal = useCallback(() => {
    setTimeout(() => {
      rolarConversaRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const enviarPerguntaParaTutor = useCallback(
    async (pergunta, historicoAtual) => {
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
        if (!funcaoConsultarIA) {
          throw new Error('O serviço do tutor não está configurado neste projeto.');
        }

        const respostaTutor = await funcaoConsultarIA({
          trilha,
          modulo,
          etapa,
          historico: novoHistorico,
          pergunta,
        });

        const mensagemAssistente = {
          papel: 'assistente',
          conteudo: respostaTutor,
          horario: Date.now(),
        };

        setMensagens((atual) => [...atual, mensagemAssistente]);
      } catch (erro) {
        console.error('Falha ao consultar o tutor:', erro);
        setMensagemErro(
          erro instanceof Error ? erro.message : 'Não foi possível consultar o tutor agora.'
        );
      } finally {
        setCarregando(false);
        rolarParaOFinal();
      }
    },
    [etapa, funcaoConsultarIA, modulo, rolarParaOFinal, trilha]
  );

  // Reinicia a conversa e dispara a explicação inicial sempre que abrir uma etapa
  useEffect(() => {
    if (!visivel) {
      setMensagens([]);
      setTextoEntrada('');
      setMensagemErro('');
      return;
    }

    if (!etapa?.key && !etapa?.id) return;

    const temporizador = setTimeout(() => {
      void enviarPerguntaParaTutor(MENSAGEM_BOAS_VINDAS_TUTOR, []);
    }, 50);

    return () => clearTimeout(temporizador);
  }, [visivel, etapa?.key, etapa?.id, enviarPerguntaParaTutor]);

  const processarEnvio = (textoSugestao) => {
    const textoFinal = (textoSugestao ?? textoEntrada).trim();
    if (!textoFinal || carregando) return;

    setTextoEntrada('');
    enviarPerguntaParaTutor(textoFinal, mensagens);
  };
  return (
    <Modal
      transparent={false}
      visible={visivel}
      animationType="slide"
      statusBarTranslucent={false}
      onRequestClose={onFechar}
    >
      <View
        style={[
          estilos.containerPrincipal,
          {
            paddingTop: Math.max(insets.top, espaco.xl) + espaco.sm,
            paddingBottom: Math.max(insets.bottom, espaco.lg),
          },
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
                    {/* CABEÇALHO */}
          <View style={[estilos.cabecalhoModal, { alignItems: 'center', gap: espaco.md }]}>
            <View style={estilos.areaTextos}>
              <View style={estilos.linhaTituloModal}>
                <Feather name="help-circle" size={16} color={cores.confirmar} />
                <Text style={estilos.textoTituloModal}>Tutor da Etapa</Text>
              </View>
              <Text style={estilos.textoSecundarioEspacado} numberOfLines={2}>
                {etapa?.title || 'Dúvidas e orientações'}
              </Text>
            </View>

            {/* Botão explícito de Fechar usando a prop original onFechar */}
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Fechar tutor"
              onPress={onFechar}
              activeOpacity={0.75}
              hitSlop={10}
              style={[
                estilos.superficie,
                estilos.linhaCompacta,
                {
                  paddingHorizontal: espaco.md,
                  paddingVertical: espaco.sm,
                  borderRadius: 8,
                },
              ]}
            >
              <Feather name="x" size={16} color={cores.titulos} />
              <Text style={estilos.textoEnunciado}>Fechar</Text>
            </TouchableOpacity>
          </View>


          {/* HISTÓRICO DE MENSAGENS */}
          <ScrollView
            ref={rolarConversaRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingVertical: espaco.md }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
            onContentSizeChange={rolarParaOFinal}
          >
            {mensagens.map((msg, index) => {
              const ehUsuario = msg.papel === 'usuario';
              return (
                <View
                  key={`msg-${index}`}
                  style={
                    ehUsuario
                      ? estilos.linhaMensagemUsuario
                      : estilos.linhaMensagemEngenheiro
                  }
                >
                  <View style={ehUsuario ? estilos.balaoUsuario : estilos.balaoEngenheiro}>
                    <Text style={estilos.textoMensagemChat}>{msg.conteudo}</Text>
                  </View>
                </View>
              );
            })}

            {carregando && (
              <View style={estilos.areaIndicadorEngenheiro}>
                <ActivityIndicator size="small" color={cores.confirmar} />
                <Text style={estilos.textoApoio}>Tutor digitando orientação...</Text>
              </View>
            )}
          </ScrollView>

          {/* SUGESTÕES RÁPIDAS */}
          {mensagens.length <= 2 && (
            <View style={[estilos.linhaChips, { marginTop: espaco.sm }]}>
              {SUGESTOES_INICIAIS.map((sugestao) => (
                <TouchableOpacity
                  key={sugestao}
                  style={estilos.grupoEscolhaVariantePill}
                  onPress={() => processarEnvio(sugestao)}
                  disabled={carregando}
                >
                  <Text style={estilos.textoApoio}>{sugestao}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ALERTA DE ERRO */}
          {mensagemErro ? (
            <View style={[estilos.bannerAlertaDestrutivo, { marginBottom: espaco.sm }]}>
              <Text style={estilos.textoErro}>{mensagemErro}</Text>
            </View>
          ) : null}

          {/* BARRA DE ENTRADA */}
          <View style={[estilos.areaEntradaMensagem, { paddingTop: espaco.sm }]}>
            <TextInput
              style={estilos.campoTextoMensagem}
              value={textoEntrada}
              onChangeText={setTextoEntrada}
              placeholder="Tire uma dúvida sobre esta etapa..."
              placeholderTextColor={cores.descricao}
              multiline={true}
              editable={!carregando}
            />

            <TouchableOpacity
              accessibilityLabel="Enviar pergunta"
              style={[
                estilos.botaoIconePrimario,
                (!textoEntrada.trim() || carregando) && estilos.botaoDesabilitado,
              ]}
              onPress={() => processarEnvio()}
              disabled={!textoEntrada.trim() || carregando}
            >
              <Feather name="send" size={16} color={cores.titulos} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
