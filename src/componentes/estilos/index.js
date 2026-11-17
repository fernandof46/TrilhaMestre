// components/estilos/index.js
import { StyleSheet, Platform } from 'react-native';
import { cores } from '../cores';

/* ============================================================================
 * TOKENS GLOBAIS
 * ========================================================================== */
export const espaco = { xxs: 2, xs: 4, sm: 6, md: 8, lg: 12, xl: 16, xxl: 20, xxxl: 24, giga: 40 };
export const fonte = { xxs: 10, xs: 11, sm: 12, md: 13, lg: 14, xl: 16, xxl: 24, display: 38 };
export const raio = { xs: 2, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, pill: 999 };

export const tintas = {
  verdeFundo: 'rgba(0, 161, 156, 0.1)',
  verdeAtivo: 'rgba(0, 161, 156, 0.15)',
  verdeBorda: 'rgba(0, 161, 156, 0.4)',
  vermelhoFundo: 'rgba(217, 83, 79, 0.1)',
  vermelhoBorda: 'rgba(217, 83, 79, 0.5)',
};

const ALTURA_LISTA = 320;
const PROPORCAO_SEMANA = 100 / 7;

export const estilos = StyleSheet.create({
  /* ==========================================================================
   * 1. PRIMITIVOS ATÔMICOS, SUPERFÍCIES E CONTAINERS BASE
   * ========================================================================== */
  containerPrincipal: {
    flex: 1,
    backgroundColor: cores.bkprincipal,
    paddingHorizontal: espaco.xl,
    paddingVertical: espaco.lg,
  },
  larguraTotal: { width: '100%' },
  centro: { justifyContent: 'center', alignItems: 'center' },
  circulo: { width: 40, height: 40, borderRadius: raio.pill, overflow: 'hidden' },
  overlay: { flex: 1, backgroundColor: cores.bkmodais },
  separador: { height: 1, backgroundColor: cores.bordaInput, marginVertical: espaco.xs },
  divisorTopo: { borderTopWidth: 1, borderTopColor: cores.bordaInput },
  divisorBase: { borderBottomWidth: 1, borderBottomColor: cores.bordaInput },
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

  /* ==========================================================================
   * 2. LINHAS E COLUNAS (FLEXBOX)
   * ========================================================================== */
  linha: { flexDirection: 'row', alignItems: 'center' },
  linhaEntre: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  linhaQuebra: { flexDirection: 'row', flexWrap: 'wrap' },
  linhaTopo: { flexDirection: 'row', alignItems: 'flex-start', gap: espaco.md },
  linhaCompacta: { flexDirection: 'row', alignItems: 'center', gap: espaco.xs },
  linhaChips: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.md, marginBottom: espaco.lg },
  linhaTituloModal: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  linhaInfoProgresso: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: espaco.sm },
  linhaMensagemUsuario: { alignItems: 'flex-end', marginBottom: espaco.lg, width: '100%' },
  linhaMensagemEngenheiro: { alignItems: 'flex-start', marginBottom: espaco.lg, width: '100%' },
  colunaAcoesDestaque: { gap: espaco.lg, marginTop: espaco.lg },

  /* ==========================================================================
   * 3. ÁREAS (WRAPPERS E REGIÕES DE LAYOUT)
   * ========================================================================== */
  areaTextos: { flex: 1 },
  areaRolavel: { maxHeight: ALTURA_LISTA, marginBottom: espaco.lg },
  areaRolagemEstrategia: { maxHeight: 460 },
  areaTitulo: { width: '100%', justifyContent: 'center', alignItems: 'center', padding: espaco.lg, marginVertical: espaco.lg },
  areaBarraTelemetria: { marginVertical: espaco.lg },
  areaAcoesCartao: { flexDirection: 'row', alignItems: 'center', marginTop: espaco.sm, gap: espaco.md },
  areaAcoesModulo: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.md, marginTop: espaco.md },
  areaSeletorStatus: {
    backgroundColor: cores.bkprincipal,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: raio.pill,
    padding: espaco.xs,
    marginTop: espaco.xs,
  },
  areaIndicadorEngenheiro: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm, marginVertical: espaco.sm },
  areaEntradaMensagem: { flexDirection: 'row', alignItems: 'flex-end', gap: espaco.md, width: '100%' },
  areaProgressoCabecalhoModulo: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm, width: 70 },
  areaImagem: {
    alignSelf: 'center',
    padding: 5,
    height: 150,
    width: 150,
    justifyContent: 'center',
  },

  /* ==========================================================================
   * 4. TEXTOS, TÍTULOS E RÓTULOS (TIPOGRAFIA)
   * ========================================================================== */
  // Títulos
  tituloBase: { fontWeight: '700', color: cores.titulos },
  textoTitulo: { fontWeight: '700', color: cores.titulos, fontSize: fonte.xxl, textAlign: 'center' },
  textoTituloDestaque: { fontWeight: '700', color: cores.titulos, fontSize: fonte.xxl, lineHeight: 28, marginVertical: espaco.md },
  textoTituloItem: { fontWeight: '700', color: cores.titulos, fontSize: fonte.xl },
  textoTituloTrilha: { fontWeight: '700', color: cores.titulos, fontSize: fonte.xl, marginBottom: espaco.xs },
  textoTituloModal: { fontWeight: '700', color: cores.titulos, fontSize: fonte.lg, letterSpacing: 1.2, textTransform: 'uppercase' },

  // Rótulos (Labels)
  rotulo: { fontSize: fonte.xxs, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  rotuloDestaque: { fontSize: fonte.xxs, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: cores.confirmar },
  rotuloDestaqueEspacado: { fontSize: fonte.xxs, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: cores.confirmar, marginBottom: espaco.xs },
  rotuloNeutro: { fontSize: fonte.xxs, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: cores.descricao },
  rotuloNeutroEspacado: { fontSize: fonte.xxs, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: cores.descricao, marginBottom: espaco.md },
  textoRotuloProgresso: { fontSize: fonte.xs, fontWeight: '600', color: cores.textoComum },

  // Textos de Corpo, Apoio e Feedback
  textoDescricao: 
  { fontSize: fonte.xl, 
    color: cores.descricao, 
    textAlign: 'stretch'
   },
   textoBotao:{
    fontSize: fonte.xxl, 
    color: cores.bksecundario, 
    textAlign: 'center',
    justifyContent: 'center',
   

   },
  textoApoio: { fontSize: fonte.xl, lineHeight: 16, color: cores.descricao },
  textoApoioEspacado: { fontSize: fonte.xs, lineHeight: 16, color: cores.descricao, marginTop: espaco.xs },
  textoSecundario: { fontSize: fonte.sm, lineHeight: 18, color: cores.descricao },
  textoSecundarioEspacado: { fontSize: fonte.sm, lineHeight: 18, color: cores.descricao, marginTop: espaco.xs },
  textoCorpo: { fontSize: fonte.sm, lineHeight: 18, color: cores.textoComum },
  textoCorpoEspacado: { fontSize: fonte.sm, lineHeight: 18, color: cores.textoComum, marginTop: espaco.xs },
  textoErro: { fontSize: fonte.sm, lineHeight: 18, color: cores.cancelar },
  textoEnunciado: { fontSize: fonte.xl, fontWeight: '600', lineHeight: 18, color: cores.titulos },
  textoFeedback: { fontSize: fonte.sm, fontWeight: '600', lineHeight: 18, textAlign: 'center', marginTop: espaco.xs },
  textoDestaqueCompacto: { fontSize: fonte.xs, fontWeight: '700', color: cores.confirmar },
  textoErroCompacto: { fontSize: fonte.xs, fontWeight: '700', color: cores.cancelar },
  textoResumoDestaque: { fontSize: fonte.md, lineHeight: 19, color: cores.descricao, marginBottom: espaco.lg },
  textoValorMetrica: { fontWeight: '700', color: cores.titulos, fontSize: fonte.xl, marginTop: espaco.xs },
  textoMensagemChat: { fontSize: fonte.md, lineHeight: 19, color: cores.textoComum },

  // Estados de Texto
  textoAtivoDestaque: { color: cores.confirmar },
  textoAtivoForte: { color: cores.titulos, fontWeight: '600' },
  /* ==========================================================================
   * 5. BOTÕES E INTERAÇÕES
   * ========================================================================== */
  botaoBase: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: espaco.md, borderRadius: raio.sm },
  botaoCompacto: { height: 38, paddingHorizontal: espaco.lg, gap: espaco.sm },
  botaoIcone: { justifyContent: 'center', alignItems: 'center', width: 44, height: 44, borderRadius: raio.sm },
  botaoIconePrimario: { justifyContent: 'center', alignItems: 'center', width: 44, height: 44, borderRadius: raio.sm, backgroundColor: cores.confirmar },
  botaoPrimario: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: espaco.md, borderRadius: raio.sm, height: 44, backgroundColor: cores.confirmar },
  botaoSecundario: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: espaco.md, borderRadius: raio.sm, height: 44, borderWidth: 1, borderColor: cores.bordaInput },
  botaoDesabilitado: { opacity: 0.5 },
  botaoConfirmar: {
    height: 48,
    backgroundColor: cores.confirmar,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.bordaBotao,
    marginVertical: espaco.md,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  botaoExcluirCard: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
    borderRadius: raio.sm,
    borderWidth: 1,
    borderColor: tintas.vermelhoBorda,
    backgroundColor: tintas.vermelhoFundo,
  },
  estadoAtivo: { borderColor: cores.confirmar, backgroundColor: tintas.verdeAtivo },

  /* ==========================================================================
   * 6. CARTÕES (CARDS) E PAINÉIS
   * ========================================================================== */
  cartaoPrincipal: { padding: espaco.xl, marginBottom: espaco.xl },
  cartaoCompacto: { padding: espaco.lg },
  cartaoInterno: { borderRadius: raio.md, padding: espaco.lg },
  cartaoGenerico: { backgroundColor: cores.bksecundario, borderWidth: 1, borderColor: cores.bordaInput, borderRadius: raio.lg, marginBottom: espaco.lg, overflow: 'hidden' },
  cartaoCabecalho: { paddingHorizontal: espaco.xl, paddingTop: espaco.xl, paddingBottom: espaco.md },
  cartaoDescricao: { fontSize: fonte.md, lineHeight: 19, color: cores.descricao, marginTop: espaco.xs },
  cartaoConteudo: { paddingHorizontal: espaco.xl, paddingVertical: espaco.lg },
  cartaoRodape: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: espaco.xl,
    paddingBottom: espaco.xl,
    paddingTop: espaco.xs,
    gap: espaco.md,
  },
  cartaoPergunta: { backgroundColor: cores.bkprincipal, borderWidth: 1, borderColor: cores.bordaInput, borderRadius: raio.md, padding: espaco.lg, marginBottom: espaco.lg },
  cartaoMetricaItem: { backgroundColor: cores.bkprincipal, borderWidth: 1, borderColor: cores.bordaInput, borderRadius: raio.md, padding: espaco.lg, width: '48%' },
  cabecalhoCartaoTrilha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: espaco.lg, gap: espaco.lg },
  painelPontuacaoGeral: { padding: espaco.xl, marginBottom: espaco.xl, alignItems: 'center' },
  gradeMetricasDestaque: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: espaco.md, marginVertical: espaco.lg },

  /* ==========================================================================
   * 7. BLOCOS, BANNERS, EMBLEMAS E BALÕES
   * ========================================================================== */
  blocoVerde: {
    backgroundColor: tintas.verdeFundo,
    borderWidth: 1,
    borderColor: tintas.verdeBorda,
  },
  blocoNotaNovaEstrategia: {
    backgroundColor: tintas.verdeFundo,
    borderWidth: 1,
    borderColor: tintas.verdeBorda,
    borderRadius: raio.sm,
    padding: espaco.lg,
    marginVertical: espaco.lg,
  },
  blocoEstrategiaPlano: {
    backgroundColor: cores.bkprincipal,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    borderRadius: raio.md,
    padding: espaco.lg,
    borderLeftWidth: 3,
    borderLeftColor: cores.confirmar,
    marginVertical: espaco.lg,
  },
  blocoObjetivoModulo: { borderLeftWidth: 2, borderLeftColor: cores.confirmar, paddingLeft: espaco.lg, marginVertical: espaco.lg },
  bannerAlertaPadrao: { padding: espaco.lg, marginVertical: espaco.sm, backgroundColor: cores.bksecundario, borderWidth: 1, borderColor: cores.bordaInput, borderRadius: raio.md },
  bannerAlertaDestrutivo: { padding: espaco.lg, marginVertical: espaco.sm, borderRadius: raio.md, borderWidth: 1, borderColor: tintas.vermelhoBorda, backgroundColor: tintas.vermelhoFundo },
  emblemaBase: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: espaco.md,
    paddingVertical: espaco.xs,
    borderRadius: raio.sm,
    borderWidth: 1,
  },
  balaoBase: { borderRadius: raio.md, paddingHorizontal: espaco.lg, paddingVertical: espaco.lg, maxWidth: '85%' },
  balaoUsuario: { borderRadius: raio.md, paddingHorizontal: espaco.lg, paddingVertical: espaco.lg, maxWidth: '85%', backgroundColor: cores.bkinput, borderBottomRightRadius: raio.xs },
  balaoEngenheiro: { borderRadius: raio.md, paddingHorizontal: espaco.lg, paddingVertical: espaco.lg, maxWidth: '85%', backgroundColor: tintas.verdeFundo, borderWidth: 1, borderColor: tintas.verdeBorda, borderBottomLeftRadius: raio.xs },

  /* ==========================================================================
   * 8. MODAIS E JANELAS SUSPENSAS
   * ========================================================================== */
  fundoModalInferior: { flex: 1, backgroundColor: cores.bkmodais, justifyContent: 'flex-end' },
  fundoModalCentralizado: { flex: 1, backgroundColor: cores.bkmodais, justifyContent: 'center', padding: espaco.xl },
  painelInferior: {
    backgroundColor: cores.bksecundario,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    borderRadius: 0,
    borderTopLeftRadius: raio.xxl,
    borderTopRightRadius: raio.xxl,
    paddingHorizontal: espaco.xl,
    paddingTop: espaco.xl,
    paddingBottom: Platform.OS === 'ios' ? espaco.giga : espaco.xxxl,
    maxHeight: '85%',
  },
  modalCartao: {
    backgroundColor: cores.bksecundario,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    maxWidth: 380,
    maxHeight: '90%',
    borderRadius: raio.xl,
    padding: espaco.xxl,
  },
  janelaModalBotaoFechar: { position: 'absolute', top: espaco.lg, right: espaco.lg, zIndex: 10, padding: espaco.xs },
  cabecalhoModal: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: cores.bordaInput,
    paddingBottom: espaco.lg,
    marginBottom: espaco.lg,
  },
  rodapeDialogoAlerta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: espaco.lg, marginTop: espaco.xl },
  /* ==========================================================================
   * 9. CAMPOS DE ENTRADA, SELETORES E BARRAS DE PROGRESSO
   * ========================================================================== */
  campoTextoMensagem: {
    backgroundColor: cores.bkprincipal,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    flex: 1,
    borderRadius: raio.md,
    paddingHorizontal: espaco.lg,
    paddingVertical: espaco.lg,
    fontSize: fonte.md,
    color: cores.titulos,
    maxHeight: 90,
  },
  grupoEscolhaVarianteCard: {
    backgroundColor: cores.bksecundario,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    borderRadius: raio.md,
    paddingHorizontal: espaco.xl,
    paddingVertical: espaco.lg,
    flexGrow: 1,
    minWidth: '30%',
  },
  grupoEscolhaVariantePill: {
    backgroundColor: cores.bksecundario,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    paddingHorizontal: espaco.xl,
    borderRadius: raio.pill,
    paddingVertical: espaco.sm,
  },
  grupoEscolhaRotuloOpcao: { fontSize: fonte.lg, fontWeight: '500', color: cores.textoComum },
  grupoEscolhaTextoDicaAtivo: { color: cores.textoComum },
  pilulaStatusItem: { paddingHorizontal: espaco.lg, paddingVertical: espaco.sm, borderRadius: raio.pill, borderWidth: 1, borderColor: 'transparent' },
  trilho: { backgroundColor: cores.bkinput, borderRadius: raio.pill, overflow: 'hidden' },
  trilhoProgresso: { backgroundColor: cores.bkinput, borderRadius: raio.pill, overflow: 'hidden', height: 6 },
  trilhoProgressoMini: { backgroundColor: cores.bkinput, borderRadius: raio.pill, overflow: 'hidden', flex: 1, height: 4 },
  preenchimentoProgresso: { height: '100%', backgroundColor: cores.confirmar, borderRadius: raio.pill },

  /* ==========================================================================
   * 10. MÓDULOS (SANFONAS) E MÍDIA / IMAGENS
   * ========================================================================== */
  cabecalhoModulo: { flexDirection: 'row', alignItems: 'center', padding: espaco.lg, gap: espaco.lg },
  corpoModuloExpandido: { borderTopWidth: 1, borderTopColor: cores.bordaInput, paddingHorizontal: espaco.lg, paddingBottom: espaco.xl },
  imagem: { height: '100%', width: '100%', borderRadius: raio.xl },

  /* ==========================================================================
   * 11. CALENDÁRIO DE ESTUDOS
   * ========================================================================== */
  calendarioCabecalho: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: espaco.lg },
  calendarioLinhaDiasSemana: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: espaco.md },
  calendarioTextoDiaSemana: { fontSize: fonte.xxs, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', width: `${PROPORCAO_SEMANA}%`, textAlign: 'center', color: cores.descricao },
  calendarioGradeDias: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarioCelulaDia: { width: `${PROPORCAO_SEMANA}%`, aspectRatio: 1, justifyContent: 'center', alignItems: 'center', marginVertical: espaco.xxs },
  calendarioDiaSelecionado: { backgroundColor: cores.confirmar, borderRadius: raio.pill },
  calendarioDiaHoje: { borderWidth: 1, borderColor: cores.confirmar, borderRadius: raio.pill },

  /* ==========================================================================
   * 12. CARROSSEL DE MÍDIAS
   * ========================================================================== */
  carrosselContainer: { width: '100%', marginVertical: espaco.lg, position: 'relative' },
  carrosselBotaoNavegacao: {
    backgroundColor: cores.bksecundario,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    width: 40,
    height: 40,
    borderRadius: raio.pill,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'absolute',
    zIndex: 10,
    alignSelf: 'center',
  },
  carrosselLinhaIndicadores: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: espaco.sm, marginTop: espaco.lg },

  /* ==========================================================================
   * 13. GRÁFICOS E LEGENDAS DE DESEMPENHO
   * ========================================================================== */
  graficoContainer: { backgroundColor: cores.bksecundario, borderWidth: 1, borderColor: cores.bordaInput, borderRadius: raio.lg, padding: espaco.lg, aspectRatio: 16 / 9, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  graficoLegendaLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: espaco.lg, marginTop: espaco.md },
  graficoLegendaItem: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
  graficoLegendaPonto: { width: espaco.md, height: espaco.md, borderRadius: raio.xs },

  /* ==========================================================================
   * 14. MENUS CONTEXTUAIS E BARRAS DE COMANDOS
   * ========================================================================== */
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
