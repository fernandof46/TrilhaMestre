// src/app/trilha/[id].js
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { STATUS_TRILHA, useTrilhas } from '../../contextos/TrilhasContext';
import { estilos as e, espaco, fonte, raio } from '../../componentes/estilos';
import { cores } from '../../componentes/cores';
import ChatTutorEtapa from '../../componentes/roadmap/ChatTutorEtapa';
import ModalQuestionarioModulo from '../../componentes/roadmap/ModalQuestionarioModulo';
import { usarAnuncioPremiado } from '../../servicos/anuncios/usarAnuncios';
import {
  consultarTutorEtapaComIA,
  gerarQuestionarioModuloComIA,
} from '../../servicos/ia/iaRoteador';

export default function TelaVisualizarRoteiro() {
  const { id, rascunhoJson } = useLocalSearchParams();
  const roteador = useRouter();
  const { trilhas, isLoading, addTrilha: adicionarTrilha, toggleStep, atualizarStatus } = useTrilhas();
  const { exibirAnuncioPremiado, premiadoCarregado } = usarAnuncioPremiado();

  const [erro, setErro] = useState('');
  const [exportando, setExportando] = useState(false);
  const [salvandoTrilha, setSalvandoTrilha] = useState(false);

  const [tutorAtivo, setTutorAtivo] = useState({ visivel: false, modulo: null, etapa: null });
  const [quizAtivo, setQuizAtivo] = useState({ visivel: false, modulo: null, indice: 0 });

  const trilhaSalva = trilhas.find((item) => item.id === id);

  const rascunho = useMemo(() => {
    if (!rascunhoJson) return null;
    try {
      const dados = JSON.parse(String(rascunhoJson));
      if (
        !dados ||
        typeof dados !== 'object' ||
        !Array.isArray(dados.phases) ||
        !dados.phases.every((fase) => fase && Array.isArray(fase.steps))
      ) {
        return null;
      }
      // Garante IDs seguros caso o JSON vindo do gerador IA não tenha gerado IDs
      return {
        ...dados,
        phases: dados.phases.map((fase, idxFase) => ({
          ...fase,
          id: fase.id || `fase-${idxFase}`,
          steps: fase.steps.map((etapa, idxEtapa) => ({
            ...etapa,
            id: etapa.id || `etapa-${idxFase}-${idxEtapa}`,
          })),
        })),
      };
    } catch {
      return null;
    }
  }, [rascunhoJson]);

  const ehRascunho = !trilhaSalva && Boolean(rascunho);
  const roteiro = trilhaSalva || rascunho;

    const executarSalvamentoDefinitivo = async () => {
    setSalvandoTrilha(true);
    setErro('');
    try {
      const { id: _idTemporario, ...dadosParaSalvar } = rascunho;
      const trilhaCriada = await adicionarTrilha(dadosParaSalvar);
      Alert.alert('Trilha Salva! 🎉', 'Sua trilha já está disponível em Minhas Trilhas.');
      roteador.replace('/trilha/' + trilhaCriada.id);
    } catch (erroSalvar) {
      console.error('Falha ao salvar trilha:', erroSalvar);
      setErro('Não foi possível salvar a trilha agora.');
    } finally {
      setSalvandoTrilha(false);
    }
  };

  const salvarTrilhaComVideo = () => {
    if (!rascunho || salvandoTrilha) return;

    // Se o anúncio premiado estiver pronto, exibe antes de salvar;
    // caso contrário (ex.: emulador ou sem rede de anúncios), salva direto para não travar o usuário.
    if (premiadoCarregado) {
      exibirAnuncioPremiado(
        () => {
          void executarSalvamentoDefinitivo();
        },
        () => {
          void executarSalvamentoDefinitivo();
        }
      );
    } else {
      void executarSalvamentoDefinitivo();
    }
  };


  const abrirLinkExterno = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (erroAbertura) {
      console.error('Falha ao abrir recurso:', erroAbertura);
      setErro('Não foi possível abrir este material no dispositivo.');
    }
  };

  const escaparHtml = (valor) =>
    String(valor ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const exportarPdf = async () => {
    setErro('');
    setExportando(true);
    try {
      const fasesHtml = roteiro.phases
        .map(
          (fase) =>
            '<section><h2>' +
            escaparHtml(fase.title) +
            '</h2><p>' +
            escaparHtml(fase.description) +
            '</p><ul>' +
            fase.steps
              .map(
                (etapa) =>
                  '<li><strong>' +
                  escaparHtml(etapa.title) +
                  '</strong><p>' +
                  escaparHtml(etapa.description) +
                  '</p>' +
                  (etapa.resources || [])
                    .map(
                      (recurso) =>
                        '<p>' + escaparHtml(recurso.title) + ' (' + escaparHtml(recurso.type) + ')</p>'
                    )
                    .join('') +
                  '</li>'
              )
              .join('') +
            '</ul></section>'
        )
        .join('');

      const html =
        '<html lang="pt-BR"><head><meta charset="utf-8"><style>' +
        'body { font-family: Arial, sans-serif; color: #202b2a; padding: 24px; }' +
        'h1 { color: #007f7b; } h2 { margin-top: 24px; }' +
        'p, li { line-height: 1.5; } section { page-break-inside: avoid; }' +
        '</style></head><body>' +
        '<h1>' +
        escaparHtml(roteiro.title) +
        '</h1><p>' +
        escaparHtml(roteiro.description) +
        '</p><p>Nível: ' +
        escaparHtml(roteiro.level) +
        ' · Duração: ' +
        escaparHtml(roteiro.estimatedTime) +
        '</p>' +
        fasesHtml +
        '</body></html>';

      const arquivo = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(arquivo.uri, {
          dialogTitle: 'Compartilhar trilha em PDF',
          mimeType: 'application/pdf',
        });
      } else {
        await Print.printAsync({ html });
      }
    } catch (erroExportacao) {
      console.error('Falha ao exportar trilha:', erroExportacao);
      setErro('Não foi possível gerar ou compartilhar o PDF desta trilha.');
    } finally {
      setExportando(false);
    }
  };

  const alterarStatus = async (status) => {
    try {
      await atualizarStatus(roteiro.id, status);
      setErro('');
    } catch (erroStatus) {
      console.error('Falha ao atualizar status da trilha:', erroStatus);
      setErro('Não foi possível atualizar o status da trilha.');
    }
  };

  if (isLoading && !roteiro) {
    return (
      <View style={[e.containerPrincipal, e.centro]}>
        <ActivityIndicator color={cores.confirmar} size="large" />
      </View>
    );
  }

  if (!roteiro) {
    return (
      <View style={[e.containerPrincipal, e.centro]}>
        <Text style={e.textoTitulo}>Trilha não encontrada</Text>
        <Pressable onPress={() => roteador.back()} style={[e.botaoPrimario, { paddingHorizontal: espaco.xl, marginTop: espaco.lg }]}>
          <Text style={e.textoTituloItem}>Voltar</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View style={e.containerPrincipal}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: espaco.giga }}
      >
        <Pressable
          accessibilityRole="button"
          onPress={() => roteador.back()}
          style={{ alignSelf: 'flex-start', marginBottom: espaco.xxl }}
        >
          <Text style={e.textoDestaqueCompacto}>‹  Minhas trilhas</Text>
        </Pressable>

        <Text style={e.rotuloDestaqueEspacado}>
          {roteiro.level} · {roteiro.estimatedTime}
        </Text>
        <Text style={e.textoTituloDestaque}>{roteiro.title}</Text>
        <Text style={[e.textoDescricao, { textAlign: 'left', marginTop: espaco.md }]}>
          {roteiro.description}
        </Text>

        {/* Controles de status (exibidos apenas quando a trilha já está salva) */}
        {!ehRascunho ? (
          <>
            <Text style={[e.textoEnunciado, { marginTop: espaco.lg }]}>Status da trilha</Text>
            <View style={[e.linhaQuebra, { gap: espaco.sm, marginTop: espaco.sm }]}>
              {[
                { valor: STATUS_TRILHA.EM_ANDAMENTO, rotulo: 'Em andamento' },
                { valor: STATUS_TRILHA.PAUSADA, rotulo: 'Pausada' },
                { valor: STATUS_TRILHA.CONCLUIDA, rotulo: 'Concluída' },
              ].map((opcao) => {
                const selecionada = (roteiro.status || STATUS_TRILHA.EM_ANDAMENTO) === opcao.valor;
                return (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selecionada }}
                    key={opcao.valor}
                    onPress={() => alterarStatus(opcao.valor)}
                    style={[e.pilulaStatusItem, selecionada && e.estadoAtivo]}
                  >
                    <Text style={selecionada ? e.textoAtivoForte : e.textoSecundario}>
                      {opcao.rotulo}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : null}

        {/* Botão Exportar PDF */}
        <Pressable
          accessibilityRole="button"
          disabled={exportando}
          onPress={exportarPdf}
          style={({ pressed }) => [
            e.botaoSecundario,
            { marginTop: espaco.lg },
            exportando && e.botaoDesabilitado,
            pressed && { opacity: 0.82 },
          ]}
        >
          <Feather name="file-text" size={16} color={cores.titulos} />
          <Text style={e.textoEnunciado}>
            {exportando ? 'Preparando PDF...' : 'Exportar trilha em PDF'}
          </Text>
        </Pressable>

                {/* Botão Salvar Trilha (exibido apenas quando a trilha ainda é uma prévia/rascunho) */}
        {ehRascunho ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Salvar trilha"
            disabled={salvandoTrilha} // Bloqueia cliques duplicados enquanto grava no AsyncStorage
            onPress={salvarTrilhaComVideo} // Executa o salvamento definitivo da trilha
            style={({ pressed }) => [
              e.botaoPrimario, // Aplica o fundo Verde Petronas de ação principal
              e.centro, // Garante centralização vertical e horizontal do texto
              {
                height: 48,
                borderRadius: raio.md,
                marginTop: espaco.md,
              },
              salvandoTrilha && e.botaoDesabilitado, // Reduz opacidade durante o salvamento
              pressed && { opacity: 0.82 }, // Feedback visual ao pressionar
            ]}
          >
            {salvandoTrilha ? (
              // Spinner em alto contraste branco enquanto salva
              <ActivityIndicator color={cores.botoesTexto || '#FFFFFF'} size="small" />
            ) : (
              // Texto com cor explícita de alto contraste sobre o fundo verde do botão
              <Text
                style={[
                  e.textoTituloItem,
                  { color: cores.botoesTexto || '#FFFFFF' },
                ]}
              >
                Salvar trilha
              </Text>
            )}
          </Pressable>
        ) : null}


        {/* Renderização em cascata de todas as fases e etapas da trilha */}
        {roteiro.phases.map((fase, indiceFase) => {
          const faseId = fase.id || `fase-${indiceFase}`;

          return (
            <View key={faseId} style={[e.cartaoGenerico, { marginTop: espaco.xl }]}>
              {/* Cabeçalho da fase */}
              <View style={e.cartaoCabecalho}>
                <Text style={e.rotuloNeutro}>FASE {indiceFase + 1}</Text>
                <Text style={e.textoTituloItem}>{fase.title}</Text>
                <Text style={e.textoApoioEspacado}>{fase.description}</Text>
              </View>

              {/* Lista de etapas práticas pertencentes à fase */}
              <View style={[e.cartaoConteudo, { gap: espaco.lg }]}>
                {fase.steps.map((etapa, indiceEtapa) => {
                  const etapaId = etapa.id || `${faseId}-etapa-${indiceEtapa}`;
                  const concluida = roteiro.completedStepIds?.includes(etapaId) ?? false;

                  return (
                    <View
                      key={etapaId}
                      style={[
                        e.cartaoInterno,
                        e.rebaixada,
                        concluida && e.estadoAtivo,
                      ]}
                    >
                      {/* Caixa de seleção (checkbox) e título da etapa */}
                      <Pressable
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: concluida }}
                        disabled={ehRascunho}
                        onPress={() =>
                          toggleStep(roteiro.id, etapaId).catch((erroToggle) => {
                            console.error('Falha ao atualizar etapa:', erroToggle);
                            setErro('Não foi possível salvar seu progresso.');
                          })
                        }
                        style={[e.linhaTopo, { alignItems: 'center' }]}
                      >
                        <View
                          style={[
                            e.botaoIcone,
                            { width: 22, height: 22, borderWidth: 1, borderColor: cores.bordaInput },
                            concluida && e.estadoAtivo,
                          ]}
                        >
                          {concluida ? (
                            <Text style={[e.textoAtivoForte, { fontSize: fonte.xs }]}>✓</Text>
                          ) : null}
                        </View>

                        <Text
                          style={[
                            e.textoEnunciado,
                            { flex: 1 },
                            concluida && { textDecorationLine: 'line-through', opacity: 0.7 },
                          ]}
                        >
                          {etapa.title}
                        </Text>
                      </Pressable>

                      {/* Descrição detalhada da etapa */}
                      <Text style={[e.textoCorpo, { marginLeft: 30, marginTop: espaco.sm }]}>
                        {etapa.description}
                      </Text>

                      {/* Links externos de apoio recomendados para a etapa */}
                      {etapa.resources?.map((recurso, idxRec) => (
                        <Pressable
                          accessibilityRole="link"
                          key={`${etapaId}-rec-${idxRec}`}
                          onPress={() => abrirLinkExterno(recurso.url)}
                          style={[
                            e.linhaEntre,
                            e.superficie,
                            {
                              marginLeft: 30,
                              marginTop: espaco.sm,
                              paddingHorizontal: espaco.md,
                              paddingVertical: espaco.sm,
                              borderRadius: raio.sm,
                            },
                          ]}
                        >
                          <Text
                            numberOfLines={1}
                            style={[e.textoAtivoDestaque, { flex: 1, fontSize: fonte.sm, fontWeight: '600' }]}
                          >
                            {recurso.title}
                          </Text>
                          <Text style={e.textoApoio}>{recurso.type}</Text>
                        </Pressable>
                      ))}

                      {/* Botão para abrir o Chat Tutor IA focado exclusivamente nesta etapa */}
                      <Pressable
                        accessibilityRole="button"
                        onPress={() =>
                          setTutorAtivo({
                            visivel: true,
                            modulo: { ...fase, id: faseId },
                            etapa: { ...etapa, id: etapaId, key: etapaId },
                          })
                        }
                        style={({ pressed }) => [
                          e.linhaCompacta,
                          e.blocoVerde,
                          {
                            marginLeft: 30,
                            marginTop: espaco.md,
                            paddingHorizontal: espaco.md,
                            paddingVertical: espaco.sm,
                            borderRadius: raio.sm,
                            alignSelf: 'flex-start',
                            gap: espaco.sm,
                          },
                          pressed && { opacity: 0.8 },
                        ]}
                      >
                        <Feather name="message-circle" size={14} color={cores.confirmar} />
                        <Text style={[e.textoAtivoDestaque, { fontSize: fonte.sm, fontWeight: '600' }]}>
                          Tirar dúvida com Tutor IA
                        </Text>
                      </Pressable>
                    </View>
                  );
                })}
                                {/* Botão de Checkpoint / Questionário IA para validar o aprendizado da fase */}
                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    setQuizAtivo({
                      visivel: true,
                      modulo: { ...fase, id: faseId },
                      indice: indiceFase,
                    })
                  }
                  style={({ pressed }) => [
                    e.botaoPrimario,
                    {
                      marginTop: espaco.sm,
                      borderRadius: raio.md,
                    },
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <Feather name="shield" size={16} color={cores.botoesTexto || '#FFFFFF'} />
                  <Text
                    style={[
                      e.textoEnunciado,
                      { color: cores.botoesTexto || '#FFFFFF' },
                    ]}
                  >
                    Checkpoint da Fase {indiceFase + 1} (Quiz IA)
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Modal interativo do Tutor IA por etapa */}
      <ChatTutorEtapa
        visivel={tutorAtivo.visivel}
        onFechar={() => setTutorAtivo({ visivel: false, modulo: null, etapa: null })}
        trilha={roteiro}
        modulo={tutorAtivo.modulo}
        etapa={tutorAtivo.etapa}
        funcaoConsultarIA={consultarTutorEtapaComIA}
      />

      {/* Modal interativo do Questionário IA por fase */}
      <ModalQuestionarioModulo
        visivel={quizAtivo.visivel}
        onFechar={() => setQuizAtivo({ visivel: false, modulo: null, indice: 0 })}
        trilha={roteiro}
        modulo={quizAtivo.modulo}
        indiceModulo={quizAtivo.indice}
        funcaoGerarPerguntas={gerarQuestionarioModuloComIA}
      />
    </View>
  );
}
