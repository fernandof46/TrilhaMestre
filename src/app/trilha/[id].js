// src/app/trilha/[id].js
import React, { useMemo, useState } from 'react'; // Importa hooks essenciais do React para estado e memorização
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'; // Importa componentes nativos de interface, alertas e abertura de links
import { useLocalSearchParams, useRouter } from 'expo-router'; // Hooks do Expo Router para ler parâmetros e navegar entre rotas
import { Feather } from '@expo/vector-icons'; // Biblioteca de ícones vetoriais padrão do Expo
import * as Print from 'expo-print'; // Módulo Expo responsável por converter HTML em arquivo PDF
import * as Sharing from 'expo-sharing'; // Módulo Expo responsável por abrir o compartilhamento nativo do celular
import { STATUS_TRILHA, useTrilhas } from '../../contextos/TrilhasContext'; // Contexto global de persistência e progresso das trilhas
import { estilos as e, espaco, fonte } from '../../componentes/estilos'; // Tokens e classes visuais do Design System do projeto
import { cores } from '../../componentes/cores'; // Paleta de cores centralizada (Verde Petronas #00A19C)
import ChatTutorEtapa from '../../componentes/roadmap/ChatTutorEtapa'; // Componente modal do chat tutor focado por etapa
import ModalQuestionarioModulo from '../../componentes/roadmap/ModalQuestionarioModulo'; // Componente modal do questionário por fase
import { usarAnuncioPremiado } from '../../servicos/anuncios/usarAnuncios'; // Hook que gerencia o vídeo premiado de 30 segundos
import {
  consultarTutorEtapaComIA,
  gerarQuestionarioModuloComIA,
} from '../../servicos/ia/iaRoteador'; // Funções gratuitas de IA para tutoria e geração de perguntas

export default function TelaVisualizarRoteiro() {
  const { id, rascunhoJson } = useLocalSearchParams(); // Captura o ID da trilha e o JSON temporário (quando vier da criação)
  const roteador = useRouter(); // Inicializa o controlador imperativo de navegação
  // O contexto exporta o método como addTrilha; o alias mantém o nome local usado no fluxo desta tela.
  const { trilhas, isLoading, addTrilha: adicionarTrilha, toggleStep, atualizarStatus } = useTrilhas(); // Métodos do contexto local de trilhas
  const { exibirAnuncioPremiado, premiadoCarregado } = usarAnuncioPremiado(); // Controlador do vídeo de recompensa de 30s

  const [erro, setErro] = useState(''); // Armazena mensagens de erro amigáveis para exibição na tela
  const [exportando, setExportando] = useState(false); // Indica se a exportação para PDF está em andamento
  const [salvandoTrilha, setSalvandoTrilha] = useState(false); // Indica se o salvamento da trilha está em andamento

  // Estados de controle dos modais interativos de Tutor IA e Questionário IA
  const [tutorAtivo, setTutorAtivo] = useState({ visivel: false, modulo: null, etapa: null });
  const [quizAtivo, setQuizAtivo] = useState({ visivel: false, modulo: null, indice: 0 });

  // Procura a trilha na lista de trilhas já salvas definitivamente pelo usuário
  const trilhaSalva = trilhas.find((item) => item.id === id);

  // Converte o parâmetro textual 'rascunhoJson' de volta para objeto quando a trilha ainda é uma prévia
  const rascunho = useMemo(() => {
    if (!rascunhoJson) return null;
    try {
      const dados = JSON.parse(String(rascunhoJson));
      // O parâmetro vem da rota e pode estar ausente, malformado ou não conter etapas;
      // rejeitá-lo aqui evita que os mapas da tela falhem durante a renderização.
      if (
        !dados
        || typeof dados !== 'object'
        || !Array.isArray(dados.phases)
        || !dados.phases.every((fase) => fase && Array.isArray(fase.steps))
      ) {
        return null;
      }
      return dados;
    } catch {
      return null;
    }
  }, [rascunhoJson]);

  const ehRascunho = !trilhaSalva && Boolean(rascunho); // Verdadeiro enquanto a trilha ainda não foi salva definitivamente
  const roteiro = trilhaSalva || rascunho; // Define qual fonte de dados será renderizada na tela

  /**
   * Aciona o vídeo premiado de 30 segundos e, após a conclusão pelo usuário,
   * salva a trilha definitivamente na biblioteca pessoal (Minhas Trilhas).
   */
  const salvarTrilhaComVideo = () => {
    if (!rascunho || salvandoTrilha) return;

    exibirAnuncioPremiado(
      async () => {
        setSalvandoTrilha(true);
        try {
          const { id: _idTemporario, ...dadosParaSalvar } = rascunho; // Remove o ID temporário antes de persistir
          const trilhaCriada = await adicionarTrilha(dadosParaSalvar); // Grava a trilha no armazenamento do usuário
          Alert.alert('Trilha Salva! 🎉', 'Sua trilha já está disponível em Minhas Trilhas.');
          roteador.replace('/trilha/' + trilhaCriada.id); // Substitui a tela de prévia pela rota oficial salva
        } catch (erroSalvar) {
          console.error('Falha ao salvar trilha:', erroSalvar);
          setErro('Não foi possível salvar a trilha agora.');
        } finally {
          setSalvandoTrilha(false);
        }
      },
      () => {
        Alert.alert(
          'Vídeo Indisponível',
          'O anúncio de 30s ainda está carregando. Aguarde alguns segundos e toque em Salvar novamente.'
        );
      }
    );
  };
  // Abre links externos de apoio no navegador padrão do dispositivo
  const abrirLinkExterno = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (erroAbertura) {
      console.error('Falha ao abrir recurso:', erroAbertura);
      setErro('Não foi possível abrir este material no dispositivo.');
    }
  };

  // Escapa caracteres especiais sem risco de quebra de aspas na montagem do PDF
  const escaparHtml = (valor) =>
    String(valor ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      // A entidade mantém apóstrofos como texto válido no HTML exportado.
      .replace(/'/g, '&#39;');

  // Converte a trilha completa em documento PDF estilizado e abre o compartilhamento nativo
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

  // Atualiza o status atual da trilha (Em andamento, Pausada ou Concluída)
  const alterarStatus = async (status) => {
    try {
      await atualizarStatus(roteiro.id, status);
      setErro('');
    } catch (erroStatus) {
      console.error('Falha ao atualizar status da trilha:', erroStatus);
      setErro('Não foi possível atualizar o status da trilha.');
    }
  };

  // Exibe indicador de carregamento enquanto consulta o banco local
  if (isLoading && !roteiro) {
    return (
      <View style={[e.containerPrincipal, e.centro]}>
        <ActivityIndicator color={cores.confirmar} size="large" />
      </View>
    );
  }

  // Tela de segurança caso o identificador da trilha seja inválido ou excluído
  if (!roteiro) {
    return (
      <View style={[e.containerPrincipal, e.centro]}>
        <Text style={e.textoTitulo}>Trilha não encontrada</Text>
        <Pressable onPress={() => roteador.back()} style={e.botaoConfirmar}>
          <Text style={e.textoBotao}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  // O contêiner mantém os modais no mesmo nível da tela, enquanto o conteúdo longo rola independentemente.
  return (
    <View style={e.containerPrincipal}>
      <ScrollView contentContainerStyle={e.containerPrincipal}>
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

        {/* Rascunhos ainda não existem no armazenamento, então não oferecem controles de status. */}
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
          <Text style={e.textoBotao}>
            {exportando ? 'Preparando PDF...' : 'Exportar trilha em PDF'}
          </Text>
        </Pressable>

        {/* O rascunho só é persistido após a confirmação da recompensa pelo fluxo do anúncio. */}
        {ehRascunho ? (
          <Pressable
            accessibilityRole="button"
            disabled={salvandoTrilha}
            onPress={salvarTrilhaComVideo}
            style={({ pressed }) => [
              e.botaoConfirmar,
              { marginTop: espaco.md },
              salvandoTrilha && e.botaoDesabilitado,
              pressed && { opacity: 0.82 },
            ]}
          >
            {salvandoTrilha ? (
              <ActivityIndicator color={cores.botoesTexto} size="small" />
            ) : (
              <Text style={e.textoBotao}>
                {premiadoCarregado ? 'Salvar trilha' : 'Aguardando vídeo para salvar...'}
              </Text>
            )}
          </Pressable>
        ) : null}

        {erro ? (
          <Text accessibilityRole="alert" style={[e.textoErro, { marginTop: espaco.md }]}>
            {erro}
          </Text>
        ) : null}

         {/* Renderização em cascata de todas as fases e etapas da trilha */}
        {roteiro.phases.map((fase, indiceFase) => (
          <View key={fase.id} style={[e.cartaoGenerico, { marginTop: espaco.xl }]}>
            {/* Cabeçalho da fase */}
            <View style={e.cartaoCabecalho}>
              <Text style={e.rotuloNeutro}>FASE {indiceFase + 1}</Text>
              <Text style={e.textoTituloItem}>{fase.title}</Text>
              <Text style={e.textoApoio}>{fase.description}</Text>
            </View>

            {/* Lista de etapas práticas pertencentes à fase */}
            <View style={e.cartaoConteudo}>
              {fase.steps.map((etapa) => {
                const concluida = roteiro.completedStepIds?.includes(etapa.id) ?? false;

                return (
                  <View
                    key={etapa.id}
                    style={[e.containerLinhaEtapa, concluida && e.containerEtapaConcluida]}
                  >
                    {/* Caixa de seleção (checkbox) e título da etapa */}
                    <Pressable
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: concluida }}
                      disabled={ehRascunho}
                      onPress={() =>
                        toggleStep(roteiro.id, etapa.id).catch((erroToggle) => {
                          console.error('Falha ao atualizar etapa:', erroToggle);
                          setErro('Não foi possível salvar seu progresso.');
                        })
                      }
                      style={e.linhaCompacta}
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
                          e.textoEnunciadoRevisao,
                          concluida && e.textoTituloEtapaConcluido,
                        ]}
                      >
                        {etapa.title}
                      </Text>
                    </Pressable>

                    {/* Descrição detalhada da etapa */}
                    <Text style={[e.textoCorpo, { marginLeft: 32, marginTop: espaco.sm }]}>
                      {etapa.description}
                    </Text>

                    {/* Links externos de apoio recomendados para a etapa */}
                    {etapa.resources?.map((recurso) => (
                      <Pressable
                        accessibilityRole="link"
                        key={etapa.id + '-' + recurso.url}
                        onPress={() => abrirLinkExterno(recurso.url)}
                        style={[
                          e.botaoRecursoExterno,
                          { marginLeft: 32, marginTop: espaco.sm, justifyContent: 'space-between' },
                        ]}
                      >
                        <Text
                          numberOfLines={1}
                          style={[e.textoTituloRecurso, e.textoAtivoDestaque]}
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
                          modulo: fase,
                          etapa: { ...etapa, key: etapa.id },
                        })
                      }
                      style={[
                        e.botaoRecursoExterno,
                        {
                          marginLeft: 32,
                          marginTop: espaco.sm,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                        },
                      ]}
                    >
                      <Feather name="message-circle" size={14} color={cores.confirmar} />
                      <Text style={[e.textoAtivoDestaque, { fontSize: fonte.sm }]}>
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
                    modulo: fase,
                    indice: indiceFase,
                  })
                }
                style={({ pressed }) => [
                  e.botaoSecundario,
                  {
                    marginTop: espaco.lg,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  },
                  pressed && { opacity: 0.82 },
                ]}
              >
                <Feather name="shield" size={16} color={cores.confirmar} />
                <Text style={e.textoBotao}>Checkpoint da Fase {indiceFase + 1} (Quiz IA)</Text>
              </Pressable>
            </View>
          </View>
        ))}
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
