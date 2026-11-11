// components/estilos/index.js
import { StyleSheet, Platform } from 'react-native'; // Importa o núcleo e a API de detecção de sistema operacional móvel
import { cores } from '../cores'; // Importa a fonte unificada de verdade para a paleta de cores escuras

/* ============================================================================
 * TOKENS GLOBAIS (Exportados para uso em ajustes pontuais inline nos componentes)
 * ========================================================================== */
export const espaco = { xxs: 2, xs: 4, sm: 6, md: 8, lg: 12, xl: 16, xxl: 20, xxxl: 24, giga: 40 };
export const fonte = { xxs: 10, xs: 11, sm: 12, md: 13, lg: 14, xl: 16, xxl: 22, display: 38 };
export const raio = { xs: 2, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, pill: 999 };

// Tons base derivados do Verde Petronas e Vermelho de Alerta
export const tintas = {
  verdeFundo: 'rgba(0, 161, 156, 0.1)',
  verdeAtivo: 'rgba(0, 161, 156, 0.15)',
  verdeBorda: 'rgba(0, 161, 156, 0.4)',
  vermelhoFundo: 'rgba(217, 83, 79, 0.1)',
  vermelhoBorda: 'rgba(217, 83, 79, 0.5)',
};

const ALTURA_LISTA = 320;
const PROPORCAO_SEMANA = 100 / 7; // Subtrai a string fracionada por cálculo matemático exato interpretável pelo Yoga Layout

export const estilos = StyleSheet.create({
  /* ============================================================================
   * CLASSES ATÔMICAS E UTILIÁRIAS DE BASE (Substituem os antigos spreads internos)
   * ========================================================================== */
  larguraTotal: { width: '100%' },
  areaTextos: { flex: 1 },
  centro: { justifyContent: 'center', alignItems: 'center' },
  
  // Primitivos de Alinhamento Flexbox
  linha: { flexDirection: 'row', alignItems: 'center' },
  linhaEntre: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  linhaQuebra: { flexDirection: 'row', flexWrap: 'wrap' },
  linhaTopo: { flexDirection: 'row', alignItems: 'flex-start', gap: espaco.md },
  linhaCompacta: { flexDirection: 'row', alignItems: 'center', gap: espaco.xs },
  linhaChips: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.md, marginBottom: espaco.lg },

  // Primitivos de Superfície e Casca
  superficie: {
    backgroundColor: cores.bksecundario,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    borderRadius: raio.lg,
  },
  rebaixada: {
    backgroundColor: cores.bkprincipal,
    borderWidth: 1,
    borderColor: cores.bordaInput,
  },
  blocoVerde: {
    backgroundColor: tintas.verdeFundo,
    borderWidth: 1,
    borderColor: tintas.verdeBorda,
  },
  divisorTopo: { borderTopWidth: 1, borderTopColor: cores.bordaInput },
  divisorBase: { borderBottomWidth: 1, borderBottomColor: cores.bordaInput },

  // Envelopes de Estruturas de Cartão Reaproveitáveis
  cartaoPrincipal: { padding: espaco.xl, marginBottom: espaco.xl },
  cartaoCompacto: { padding: espaco.lg },
  cartaoInterno: { borderRadius: raio.md, padding: espaco.lg },
  circulo: { width: 40, height: 40, borderRadius: raio.pill, overflow: 'hidden' },

  // Bases Tipográficas Internas
  tituloBase: { fontWeight: '700', color: cores.titulos },
  rotulo: { fontSize: fonte.xxs, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },

  // Bases de Controle Internas
  botaoBase: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: espaco.md, borderRadius: raio.sm },
  botaoCompacto: { height: 38, paddingHorizontal: espaco.lg, gap: espaco.sm },
  botaoIcone: { justifyContent: 'center', alignItems: 'center', width: 44, height: 44, borderRadius: raio.sm },
  trilho: { backgroundColor: cores.bkinput, borderRadius: raio.pill, overflow: 'hidden' },
  balaoBase: { borderRadius: raio.md, paddingHorizontal: espaco.lg, paddingVertical: espaco.lg, maxWidth: '85%' },
  overlay: { flex: 1, backgroundColor: cores.bkmodais },

  /* ============================================================================
   * COMPONENTES CONSOLIDADOS PARA USO (Composição Limpa de Performance)
   * ========================================================================== */

  // ------------------------------------------------------------------ Base Global
  containerPrincipal: {
    flex: 1,
    backgroundColor: cores.bkprincipal,
    paddingHorizontal: espaco.xl,
    paddingVertical: espaco.lg,
  },
  areaRolavel: { maxHeight: ALTURA_LISTA, marginBottom: espaco.lg },
  separador: { height: 1, backgroundColor: cores.bordaInput, marginVertical: espaco.xs },
  areaTitulo: { width: '100%', justifyContent: 'center', alignItems: 'center', padding: espaco.lg, marginVertical: espaco.lg },

  // ------------------------------------------------------------------ Tipografia Compartilhada
  textoTitulo: { fontWeight: '700', color: cores.titulos, fontSize: fonte.xxl, textAlign: 'center' },
  textoTituloDestaque: { fontWeight: '700', color: cores.titulos, fontSize: fonte.xxl, lineHeight: 28, marginVertical: espaco.md },
  textoTituloItem: { fontWeight: '700', color: cores.titulos, fontSize: fonte.xl },
  textoTituloTrilha: { fontWeight: '700', color: cores.titulos, fontSize: fonte.xl, marginBottom: espaco.xs },
  textoDescricao: { fontSize: fonte.lg, color: cores.descricao, textAlign: 'center' },

  rotuloDestaque: { fontSize: fonte.xxs, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: cores.confirmar },
  rotuloDestaqueEspacado: { fontSize: fonte.xxs, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: cores.confirmar, marginBottom: espaco.xs },
  rotuloNeutro: { fontSize: fonte.xxs, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: cores.descricao },
  rotuloNeutroEspacado: { fontSize: fonte.xxs, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: cores.descricao, marginBottom: espaco.md },

  textoApoio: { fontSize: fonte.xs, lineHeight: 16, color: cores.descricao },
  textoApoioEspacado: { fontSize: fonte.xs, lineHeight: 16, color: cores.descricao, marginTop: espaco.xs },
  textoSecundario: { fontSize: fonte.sm, lineHeight: 18, color: cores.descricao },
  textoSecundarioEspacado: { fontSize: fonte.sm, lineHeight: 18, color: cores.descricao, marginTop: espaco.xs },
  textoCorpo: { fontSize: fonte.sm, lineHeight: 18, color: cores.textoComum },
  textoCorpoEspacado: { fontSize: fonte.sm, lineHeight: 18, color: cores.textoComum, marginTop: espaco.xs },
  textoErro: { fontSize: fonte.sm, lineHeight: 18, color: cores.cancelar },
  textoEnunciado: { fontSize: fonte.md, fontWeight: '600', lineHeight: 18, color: cores.titulos },
  textoFeedback: { fontSize: fonte.sm, fontWeight: '600', lineHeight: 18, textAlign: 'center', marginTop: espaco.xs },

  textoDestaqueCompacto: { fontSize: fonte.xs, fontWeight: '700', color: cores.confirmar },
  textoErroCompacto: { fontSize: fonte.xs, fontWeight: '700', color: cores.cancelar },

  // Estados Visuais Dinâmicos de Seleção
  estadoAtivo: { borderColor: cores.confirmar, backgroundColor: tintas.verdeAtivo },
  textoAtivoDestaque: { color: cores.confirmar },
  textoAtivoForte: { color: cores.titulos, fontWeight: '600' },
  // ------------------------------------------------------------------ Botões e Interações
  botaoDesabilitado: { opacity: 0.5 },
  botaoConfirmar: {
    height: 48,
    backgroundColor: cores.confirmar,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.bordaBotao,
    marginVertical: espaco.md,
    // Correção: Injeção de sombras nativas cross-platform (Android exige elevation)
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  botaoPrimario: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: espaco.md, borderRadius: raio.sm, height: 44, backgroundColor: cores.confirmar },
  botaoSecundario: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: espaco.md, borderRadius: raio.sm, height: 44, borderWidth: 1, borderColor: cores.bordaInput },
  botaoIconePrimario: { justifyContent: 'center', alignItems: 'center', width: 44, height: 44, borderRadius: raio.sm, backgroundColor: cores.confirmar },
  botaoExcluirCard: { justifyContent: 'center', alignItems: 'center', borderRadius: raio.sm, width: 38, height: 38, marginLeft: 'auto' },
  botaoDialogoCancelar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: espaco.md, borderRadius: raio.sm, height: 44, borderWidth: 1, borderColor: cores.bordaInput, flex: 1 },
  botaoDialogoAcao: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: espaco.md, borderRadius: raio.sm, height: 44, backgroundColor: cores.cancelar, flex: 1 },
  botaoCheckpointModulo: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: raio.sm,
    backgroundColor: tintas.verdeFundo, borderWidth: 1, borderColor: tintas.verdeBorda,
    gap: espaco.sm, paddingHorizontal: espaco.lg, paddingVertical: espaco.sm,
  },

  textoBotao: { fontSize: fonte.xl, fontWeight: '700', color: cores.botoesTexto, textAlign: 'center' },
  textoBotaoCompacto: { fontSize: fonte.xs, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: cores.botoesTexto },
  textoBotaoCompactoSecundario: { fontSize: fonte.xs, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: cores.textoComum },

  // ------------------------------------------------------------------ Superfícies e Containers
  painelPontuacaoGeral: { padding: espaco.xl, marginBottom: espaco.xl, alignItems: 'center' },
  cartaoGenerico: { backgroundColor: cores.bksecundario, borderWidth: 1, borderColor: cores.bordaInput, borderRadius: raio.lg, marginBottom: espaco.lg, overflow: 'hidden' },
  cartaoCabecalho: { paddingHorizontal: espaco.xl, paddingTop: espaco.xl, paddingBottom: espaco.md },
  cartaoDescricao: { fontSize: fonte.md, lineHeight: 19, color: cores.descricao, marginTop: espaco.xs },
  cartaoConteudo: { paddingHorizontal: espaco.xl, paddingVertical: espaco.lg },
  cartaoRodape: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: espaco.xl, paddingBottom: espaco.xl, paddingTop: espaco.xs, gap: espaco.md,
  },
  cartaoPergunta: { backgroundColor: cores.bkprincipal, borderWidth: 1, borderColor: cores.bordaInput, borderRadius: raio.md, padding: espaco.lg, marginBottom: espaco.lg },
  cartaoMetricaItem: { backgroundColor: cores.bkprincipal, borderWidth: 1, borderColor: cores.bordaInput, borderRadius: raio.md, padding: espaco.lg, width: '48%' },
  blocoNotaNovaEstrategia: { backgroundColor: tintas.verdeFundo, borderWidth: 1, borderColor: tintas.verdeBorda, borderRadius: raio.sm, padding: espaco.lg, marginVertical: espaco.lg },

  emblemaBase: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    paddingHorizontal: espaco.md, paddingVertical: espaco.xs, borderRadius: raio.sm, borderWidth: 1,
  },
  bannerAlertaPadrao: { padding: espaco.lg, marginVertical: espaco.sm, backgroundColor: cores.bksecundario, borderWidth: 1, borderColor: cores.bordaInput, borderRadius: raio.md },
  bannerAlertaDestrutivo: { padding: espaco.lg, marginVertical: espaco.sm, borderRadius: raio.md, borderWidth: 1, borderColor: tintas.vermelhoBorda, backgroundColor: tintas.vermelhoFundo },

  // ------------------------------------------------------------------ Modais e Janelas Suspensas
  fundoModalInferior: { flex: 1, backgroundColor: cores.bkmodais, justifyContent: 'flex-end' },
  fundoModalCentralizado: { flex: 1, backgroundColor: cores.bkmodais, justifyContent: 'center', padding: espaco.xl },
  painelInferior: {
    backgroundColor: cores.bksecundario, borderWidth: 1, borderColor: cores.bordaInput,
    borderRadius: 0, borderTopLeftRadius: raio.xxl, borderTopRightRadius: raio.xxl,
    paddingHorizontal: espaco.xl, paddingTop: espaco.xl, paddingBottom: Platform.OS === 'ios' ? espaco.giga : espaco.xxxl,
    maxHeight: '85%',
  },
  modalCartao: {
    backgroundColor: cores.bksecundario, borderWidth: 1, borderColor: cores.bordaInput,
    maxWidth: 380, maxHeight: '90%', borderRadius: raio.xl, padding: espaco.xxl,
  },
  janelaModalBotaoFechar: { position: 'absolute', top: espaco.lg, right: espaco.lg, zIndex: 10, padding: espaco.xs },
  cabecalhoModal: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    borderBottomWidth: 1, borderBottomColor: cores.bordaInput, paddingBottom: espaco.lg, marginBottom: espaco.lg,
  },
  linhaTituloModal: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  textoTituloModal: { fontWeight: '700', color: cores.titulos, fontSize: fonte.lg, letterSpacing: 1.2, textTransform: 'uppercase' },
  rodapeDialogoAlerta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: espaco.lg, marginTop: espaco.xl },

  // ------------------------------------------------------------------ Grupos de Escolha e Seletores
  grupoEscolhaVarianteCard: {
    backgroundColor: cores.bksecundario, borderWidth: 1, borderColor: cores.bordaInput,
    borderRadius: raio.md, paddingHorizontal: espaco.xl, paddingVertical: espaco.lg, flexGrow: 1, minWidth: '30%',
  },
  grupoEscolhaVariantePill: {
    backgroundColor: cores.bksecundario, borderWidth: 1, borderColor: cores.bordaInput,
    paddingHorizontal: espaco.xl, borderRadius: raio.pill, paddingVertical: espaco.sm
  },
  grupoEscolhaRotuloOpcao: { fontSize: fonte.lg, fontWeight: '500', color: cores.textoComum },
  grupoEscolhaTextoDicaAtivo: { color: cores.textoComum },

  // ------------------------------------------------------------------ Telemetria e Progresso de Trilhas
  cabecalhoCartaoTrilha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: espaco.lg, gap: espaco.lg },
  areaBarraTelemetria: { marginVertical: espaco.lg },
  linhaInfoProgresso: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: espaco.sm },
  textoRotuloProgresso: { fontSize: fonte.xs, fontWeight: '600', color: cores.textoComum },
  trilhoProgresso: { backgroundColor: cores.bkinput, borderRadius: raio.pill, overflow: 'hidden', height: 6 },
  trilhoProgressoMini: { backgroundColor: cores.bkinput, borderRadius: raio.pill, overflow: 'hidden', flex: 1, height: 4 },
  preenchimentoProgresso: { height: '100%', backgroundColor: cores.confirmar, borderRadius: raio.pill },
  areaAcoesCartao: { flexDirection: 'row', alignItems: 'center', marginTop: espaco.sm, gap: espaco.md },
  textoResumoDestaque: { fontSize: fonte.md, lineHeight: 19, color: cores.descricao, marginBottom: espaco.lg },
  gradeMetricasDestaque: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: espaco.md, marginVertical: espaco.lg },
  textoValorMetrica: { fontWeight: '700', color: cores.titulos, fontSize: fonte.xl, marginTop: espaco.xs },
  blocoEstrategiaPlano: {
    backgroundColor: cores.bkprincipal, borderWidth: 1, borderColor: cores.bordaInput, borderRadius: raio.md, padding: espaco.lg,
    borderLeftWidth: 3, borderLeftColor: cores.confirmar, marginVertical: espaco.lg,
  },
  colunaAcoesDestaque: { gap: espaco.lg, marginTop: espaco.lg },
  areaSeletorStatus: {
    backgroundColor: cores.bkprincipal, borderWidth: 1, borderColor: cores.bordaInput,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderRadius: raio.pill, padding: espaco.xs, marginTop: espaco.xs,
  },
  pilulaStatusItem: { paddingHorizontal: espaco.lg, paddingVertical: espaco.sm, borderRadius: raio.pill, borderWidth: 1, borderColor: 'transparent' },
  areaRolagemEstrategia: { maxHeight: 460 },
  // ------------------------------------------------------------------ Chat (Mensagens em Tempo Real)
  linhaMensagemUsuario: { alignItems: 'flex-end', marginBottom: espaco.lg, width: '100%' },
  linhaMensagemEngenheiro: { alignItems: 'flex-start', marginBottom: espaco.lg, width: '100%' },
  balaoUsuario: { borderRadius: raio.md, paddingHorizontal: espaco.lg, paddingVertical: espaco.lg, maxWidth: '85%', backgroundColor: cores.bkinput, borderBottomRightRadius: raio.xs },
  balaoEngenheiro: { borderRadius: raio.md, paddingHorizontal: espaco.lg, paddingVertical: espaco.lg, maxWidth: '85%', backgroundColor: tintas.verdeFundo, borderWidth: 1, borderColor: tintas.verdeBorda, borderBottomLeftRadius: raio.xs },
  textoMensagemChat: { fontSize: fonte.md, lineHeight: 19, color: cores.textoComum },
  areaIndicadorEngenheiro: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm, marginVertical: espaco.sm },
  areaEntradaMensagem: { flexDirection: 'row', alignItems: 'flex-end', gap: md => espaco.md, width: '100%' },
  campoTextoMensagem: {
    backgroundColor: cores.bkprincipal, borderWidth: 1, borderColor: cores.bordaInput,
    flex: 1, borderRadius: raio.md, paddingHorizontal: espaco.lg, paddingVertical: espaco.lg, fontSize: fonte.md, color: cores.titulos, maxHeight: 90,
  },

  // ------------------------------------------------------------------ Módulos e Etapas (Sanfonas)
  cabecalhoModulo: { flexDirection: 'row', alignItems: 'center', padding: espaco.lg, gap: espaco.lg },
  areaProgressoCabecalhoModulo: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm, width: 70 },
  corpoModuloExpandido: { borderTopWidth: 1, borderTopColor: cores.bordaInput, paddingHorizontal: espaco.lg, paddingBottom: espaco.xl },
  blocoObjetivoModulo: { borderLeftWidth: 2, borderLeftColor: cores.confirmar, paddingLeft: espaco.lg, marginVertical: espaco.lg },
  areaAcoesModulo: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: espaco.md, marginVertical: espaco.md },
  listaEtapasModulo: { marginTop: espaco.sm },

  // ------------------------------------------------------------------ Questionários e Gabaritos (Quiz)
  textoPorcentagemResultado: { fontSize: fonte.display, fontWeight: '700', color: cores.titulos, marginVertical: espaco.xs },
  textoPontosResultado: { fontSize: fonte.md, lineHeight: 19, color: cores.descricao, marginBottom: espaco.sm },
  textoFeedbackAprovado: { fontSize: fonte.sm, fontWeight: '600', lineHeight: 18, textAlign: 'center', marginTop: espaco.xs, color: cores.confirmar },
  textoFeedbackReprovado: { fontSize: fonte.sm, fontWeight: '600', lineHeight: 18, textAlign: 'center', marginTop: espaco.xs, color: cores.cancelar },
  textoEnunciadoRevisao: { fontSize: fonte.md, fontWeight: '600', lineHeight: 18, color: cores.titulos, flex: 1 },
  blocoGabaritoCorreto: { borderTopWidth: 1, borderTopColor: cores.bordaInput, marginTop: espaco.md, paddingTop: espaco.md },
  textoDescricaoQuestionario: { fontSize: fonte.xs, lineHeight: 16, color: cores.descricao, marginTop: espaco.xs, maxWidth: 260 },
  areaCarregandoQuestionario: { justifyContent: 'center', alignItems: 'center', paddingVertical: espaco.giga, gap: espaco.lg },
  textoCarregandoQuestionario: { fontSize: fonte.md, lineHeight: 19, color: cores.descricao, textAlign: 'center' },
  areaErroQuestionario: { padding: espaco.lg, marginVertical: espaco.sm, borderRadius: raio.md, borderWidth: 1, borderColor: tintas.vermelhoBorda, backgroundColor: tintas.vermelhoFundo, flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  textoErroQuestionario: { fontSize: fonte.sm, lineHeight: 18, color: cores.cancelar, flex: 1 },
  textoEnunciadoQuiz: { fontSize: fonte.md, fontWeight: '600', lineHeight: 18, color: cores.titulos, marginBottom: espaco.lg },
  listaOpcoesQuiz: { gap: espaco.md },
  botaoOpcaoRespostaQuiz: { backgroundColor: cores.bksecundario, borderWidth: 1, borderColor: cores.bordaInput, borderRadius: raio.lg, flexDirection: 'row', alignItems: 'center', gap: espaco.lg, paddingHorizontal: espaco.lg, paddingVertical: espaco.lg },
  letraOpcaoQuiz: { fontSize: fonte.xs, fontWeight: '700', color: cores.confirmar, width: 18 },
  textoOpcaoQuiz: { fontSize: fonte.sm, lineHeight: 18, color: cores.descricao, flex: 1 },

  // ------------------------------------------------------------------ Linha de Etapa Ativa (StepRow)
  containerLinhaEtapa: { borderTopWidth: 1, borderTopColor: cores.bordaInput, paddingVertical: espaco.lg },
  containerEtapaConcluida: { opacity: 0.7 },
  linhaConteudoEtapa: { flexDirection: 'row', alignItems: 'flex-start', gap: espaco.lg },
  botaoAlternarConclusaoEtapa: { paddingTop: espaco.xxs },
  linhaTituloEEstimativa: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: espaco.md, marginBottom: espaco.xs },
  textoTituloEtapa: { fontSize: fonte.lg, fontWeight: '600', color: cores.titulos, lineHeight: 20, flexShrink: 1 },
  textoTituloEtapaConcluido: { color: cores.descricao, textDecorationLine: 'line-through' },
  blocoDestaqueEtapa: { flexDirection: 'row', alignItems: 'flex-start', gap: espaco.sm, marginTop: espaco.md },
  textoConteudoEtapa: { fontSize: fonte.sm, lineHeight: 18, color: cores.textoComum, flex: 1 },
  areaRecursosLinks: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.md, marginTop: espaco.lg },
  botaoRecursoExterno: {
    backgroundColor: cores.bkprincipal, borderWidth: 1, borderColor: cores.bordaInput,
    flexDirection: 'row', alignItems: 'center', gap: espaco.sm, borderRadius: raio.sm,
    paddingHorizontal: espaco.lg, paddingVertical: espaco.sm, maxWidth: '100%',
  },
  textoTituloRecurso: { fontSize: fonte.xs, fontWeight: '500', color: cores.titulos, maxWidth: 160, flexShrink: 1 }, // Proteção contra truncamentos
  botaoChamarTutorEtapa: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm, alignSelf: 'flex-start', paddingVertical: espaco.sm, paddingHorizontal: espaco.md, borderRadius: raio.sm, marginTop: espaco.md },

  // ------------------------------------------------------------------ Sanfona Genérica (Accordion)
  itemSanfona: { borderBottomWidth: 1, borderBottomColor: cores.bordaInput, overflow: 'hidden' },
  gatilhoSanfona: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: espaco.lg },
  conteudoSanfona: { paddingBottom: espaco.lg, paddingTop: espaco.xxs },

  // ------------------------------------------------------------------ Navegação em Trilha (Breadcrumbs)
  trilhaNavegacaoLista: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: espaco.xs, marginVertical: espaco.md },
  trilhaNavegacaoTexto: { fontSize: fonte.sm, color: cores.descricao },
  trilhaNavegacaoTextoAtivo: { fontSize: fonte.sm, fontWeight: '600', color: cores.titulos },

  // ------------------------------------------------------------------ Calendário de Estudos
  calendarioCabecalho: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: espaco.lg },
  calendarioLinhaDiasSemana: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: espaco.md },
  calendarioTextoDiaSemana: { fontSize: fonte.xxs, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', width: `${PROPORCAO_SEMANA}%`, textAlign: 'center', color: cores.descricao },
  calendarioGradeDias: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarioCelulaDia: { width: `${PROPORCAO_SEMANA}%`, aspectRatio: 1, justifyContent: 'center', alignItems: 'center', marginVertical: espaco.xxs },
  calendarioDiaSelecionado: { backgroundColor: cores.confirmar, borderRadius: raio.pill },
  calendarioDiaHoje: { borderWidth: 1, borderColor: cores.confirmar, borderRadius: raio.pill },

  // ------------------------------------------------------------------ Carrossel de Mídias
  carrosselContainer: { width: '100%', marginVertical: espaco.lg, position: 'relative' },
  carrosselBotaoNavegacao: {
    backgroundColor: cores.bksecundario, borderWidth: 1, borderColor: cores.bordaInput,
    width: 40, height: 40, borderRadius: raio.pill, justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
    position: 'absolute', zIndex: 10, alignSelf: 'center', // Alinhamento cross-platform robusto por flexbox nativo
  },
  carrosselLinhaIndicadores: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: espaco.sm, marginTop: espaco.lg },

  // ------------------------------------------------------------------ Gráficos e Legendas de Desempenho
  graficoContainer: { backgroundColor: cores.bksecundario, borderWidth: 1, borderColor: cores.bordaInput, borderRadius: raio.lg, padding: espaco.lg, aspectRatio: 16 / 9, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  graficoLegendaLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: espaco.lg, marginTop: espaco.md },
  graficoLegendaItem: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
  graficoLegendaPonto: { width: espaco.md, height: espaco.md, borderRadius: raio.xs },

  // ------------------------------------------------------------------ Menus Contextuais e Barras de Comandos
  menuComandosLinhaEntrada: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: cores.bordaInput, paddingHorizontal: espaco.lg, height: 50 },
  menuComandosCampoTexto: { flex: 1, fontSize: fonte.lg, color: cores.titulos, marginLeft: espaco.lg },
  menuComandosLista: { maxHeight: ALTURA_LISTA, paddingHorizontal: espaco.sm, paddingVertical: espaco.md },
  menuTituloGrupo: { fontSize: fonte.xxs, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: cores.descricao, paddingHorizontal: espaco.lg, paddingVertical: espaco.sm },
menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: espaco.lg, paddingHorizontal: espaco.lg, borderRadius: raio.sm, gap: espaco.lg },
menuContextualCartao: { backgroundColor: cores.bksecundario, borderWidth: 1, borderColor: cores.bordaInput, borderRadius: raio.md, padding: espaco.sm, minWidth: 220, maxWidth: 280 },
barraMenusContainer: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm, paddingVertical: espaco.sm },
barraMenusBotao: { backgroundColor: cores.bksecundario, borderWidth: 1, borderColor: cores.bordaInput, borderRadius: raio.sm, paddingHorizontal: espaco.lg, paddingVertical: espaco.sm },
barraMenusTexto: { fontSize: fonte.sm, fontWeight: '600', color: cores.textoComum },
barraMenusEspacoIcone: { width: espaco.xl },
});