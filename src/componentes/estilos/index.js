// components/estilos/index.js
import { StyleSheet } from 'react-native';
import { cores } from '../cores'; // Importa do arquivo de cores traduzido

export const estilos = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    backgroundColor: cores.bkprincipal,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  areaTitulo: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: cores.titulos,
    textAlign: 'center',
  },
  textoDescricao: {
    fontSize: 14,
    color: cores.descricao,
    textAlign: 'center',
  },
  textoBotao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.botoesTexto,
    textAlign: 'center',
  },
  botaoConfirmar: {
    height: 48,
    width: '100%',
    backgroundColor: cores.confirmar,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: cores.bordaBotao,
    borderWidth: 1,
    marginVertical: 8,
  },
  
  // Estilos específicos para o Grupo de Escolha (GrupoDeEscolha)
  grupoEscolhaRotulo: {
    marginBottom: 8,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: cores.descricao,
    fontWeight: '600',
  },
  grupoEscolhaContainerOpcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  grupoEscolhaVarianteCard: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1,
    minWidth: '30%',
  },
  grupoEscolhaVariantePill: {
    borderRadius: 50,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  grupoEscolhaBotaoInativo: {
    borderColor: cores.bordaInput,
    backgroundColor: cores.bksecundario,
  },
  grupoEscolhaBotaoAtivo: {
    borderColor: cores.bordaEspecial,
    backgroundColor: 'rgba(0, 161, 156, 0.15)',
    borderWidth: 1.5,
  },
  grupoEscolhaRotuloOpcao: {
    fontSize: 14,
    fontWeight: '500',
    color: cores.textoComum,
  },
  grupoEscolhaTextoAtivo: {
    color: cores.titulos,
  },
  grupoEscolhaDicaOpcao: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 15,
    color: cores.descricao,
  },
  grupoEscolhaTextoDicaAtivo: {
    color: cores.textoComum,
  },
    // Caixa principal do cartão de trilha
  cartaoTrilha: {
    backgroundColor: cores.bksecundario,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    padding: 16,
    marginBottom: 16,
    width: '100%',
  },

  // Cabeçalho com o título à esquerda e o status à direita
  cabecalhoCartaoTrilha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 12,
  },

  // Área dos textos do cabeçalho (ocupa o espaço disponível)
  areaTextosCabecalho: {
    flex: 1,
  },

  // Tópico em caixa alta na cor Verde Petronas
  textoTopicoTrilha: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: cores.confirmar, // Verde Petronas
    marginBottom: 4,
  },

  // Nome principal da trilha/estudo
  textoTituloTrilha: {
    fontSize: 17,
    fontWeight: 'bold',
    color: cores.titulos,
    marginBottom: 4,
  },

  // Detalhes extras: nível, objetivo e data de atualização
  textoDetalhesTrilha: {
    fontSize: 11,
    color: cores.descricao,
    lineHeight: 16,
  },

  // Emblema/badge de status no canto superior direito
  emblemaStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    backgroundColor: cores.bkprincipal,
  },

  // Texto do emblema de status
  textoEmblemaStatus: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: cores.descricao,
  },

  // Seção da barra de telemetria / progresso
  areaBarraTelemetria: {
    marginVertical: 12,
  },

  // Linha com os textos acima da barra (ex: "3/10 etapas" e "30%")
  linhaInfoProgresso: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  textoRotuloProgresso: {
    fontSize: 11,
    fontWeight: '600',
    color: cores.textoComum,
  },

  textoPorcentagemProgresso: {
    fontSize: 11,
    fontWeight: 'bold',
    color: cores.confirmar,
  },

  // Trilho cinza escuro de fundo da barra
  trilhoBarraProgresso: {
    height: 6,
    width: '100%',
    backgroundColor: cores.bkinput,
    borderRadius: 3,
    overflow: 'hidden',
  },

  // Preenchimento em Verde Petronas indicando o progresso
  preenchimentoBarraProgresso: {
    height: '100%',
    backgroundColor: cores.confirmar,
    borderRadius: 3,
  },

  // Rodapé do cartão com os botões de ação
  areaAcoesCartao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },

  // Botão primário "Abrir Cockpit"
  botaoAbrirCockpit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.confirmar,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
  },

  textoBotaoCockpit: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: cores.botoesTexto,
    marginRight: 6,
  },

  // Botão secundário "PDF"
  botaoAcaoPdf: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: cores.bordaInput,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
  },

  textoBotaoPdf: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: cores.textoComum,
    marginLeft: 6,
  },

  // Botão da lixeira (excluir) posicionado à direita
  botaoExcluirCard: {
    marginLeft: 'auto',
    width: 38,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
   // Interface de chat de suporte etapa por etapa estilo Mercedes-AMG F1
  // =========================================================================

  // Fundo escuro semitransparente que cobre a tela
  fundoModalRadio: {
    flex: 1,
    backgroundColor: cores.bkmodais,
    justifyContent: 'flex-end', // Faz o chat subir da parte inferior da tela
  },

  // Conteúdo principal do chat (painel deslizante)
  painelChatRadio: {
    backgroundColor: cores.bksecundario,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    maxHeight: '85%', // Ocupa no máximo 85% da tela para manter respiro
  },

  // Cabeçalho com o título do rádio e botão de fechar
  cabecalhoRadio: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: cores.bordaInput,
    marginBottom: 12,
  },

  linhaTituloRadio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  textoTituloRadio: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: cores.titulos,
  },

  textoSubtituloEtapa: {
    fontSize: 12,
    color: cores.descricao,
    marginTop: 2,
  },

  // Lista de mensagens rolável
  areaListaMensagens: {
    maxHeight: 320,
    marginBottom: 12,
  },

  // Balão da mensagem enviada pelo usuário (à direita)
  linhaMensagemUsuario: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },

  balaoUsuario: {
    backgroundColor: cores.bkinput,
    borderRadius: 14,
    borderBottomRightRadius: 2,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '85%',
  },

  // Balão da resposta do Engenheiro (à esquerda, com borda Verde Petronas)
  linhaMensagemEngenheiro: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  balaoEngenheiro: {
    backgroundColor: 'rgba(0, 161, 156, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 161, 156, 0.3)',
    borderRadius: 14,
    borderBottomLeftRadius: 2,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '85%',
  },

  textoMensagemChat: {
    fontSize: 13,
    lineHeight: 19,
    color: cores.textoComum,
  },

  // Indicador de "Engenheiro falando..."
  areaIndicadorEngenheiro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 6,
  },

  textoIndicadorEngenheiro: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: cores.confirmar,
  },

  // Carrossel/lista de sugestões rápidas
  areaSugestoesRapidas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },

  botaoSugestaoRapida: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: cores.bkprincipal,
  },

  textoBotaoSugestao: {
    fontSize: 11,
    color: cores.descricao,
  },

  // Texto de erro em caso de falha de conexão
  textoErroRadio: {
    fontSize: 12,
    color: cores.cancelar,
    marginBottom: 8,
    textAlign: 'center',
  },

  // Área inferior de digitação (input + botão enviar)
  areaEntradaMensagem: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },

  campoTextoMensagem: {
    flex: 1,
    backgroundColor: cores.bkprincipal,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: cores.titulos,
    maxHeight: 90,
  },

  botaoEnviarMensagem: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: cores.confirmar,
    justifyContent: 'center',
    alignItems: 'center',
  },

  botaoEnviarDesabilitado: {
    opacity: 0.4,
  },
    // Caixa principal do módulo (seção colapsável)
  cartaoModulo: {
    backgroundColor: cores.bksecundario,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    marginBottom: 12,
    overflow: 'hidden',
  },

  // Cabeçalho tocável que expande/recolhe o módulo
  cabecalhoModulo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },

  // Rótulo numérico estilo F1 (ex: "MÓDULO 01")
  emblemaNumeroModulo: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: cores.confirmar,
  },

  // Área central com título e resumo de horas/etapas
  areaTextosModulo: {
    flex: 1,
  },

  textoTituloModulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: cores.titulos,
  },

  textoSubtituloModulo: {
    fontSize: 11,
    color: cores.descricao,
    marginTop: 2,
  },

  // Mini barra de progresso no cabeçalho
  areaProgressoCabecalhoModulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: 70,
  },

  trilhoMiniProgressoModulo: {
    flex: 1,
    height: 4,
    backgroundColor: cores.bkinput,
    borderRadius: 2,
    overflow: 'hidden',
  },

  preenchimentoMiniProgressoModulo: {
    height: '100%',
    backgroundColor: cores.confirmar,
  },

  textoPorcentagemModulo: {
    fontSize: 10,
    fontWeight: 'bold',
    color: cores.descricao,
  },

  // Conteúdo visível apenas quando o módulo está aberto
  corpoModuloExpandido: {
    paddingHorizontal: 14,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: cores.bkinput,
  },

  // Destaque visual para o objetivo pedagógico do módulo
  blocoObjetivoModulo: {
    borderLeftWidth: 2,
    borderLeftColor: cores.confirmar, // Linha vertical Verde Petronas
    paddingLeft: 10,
    marginVertical: 10,
  },

  textoObjetivoModulo: {
    fontSize: 12,
    lineHeight: 18,
    color: cores.textoComum,
  },

  // Área de ações: Checkpoint de setor (Quiz) e resultado anterior
  areaAcoesModulo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginVertical: 8,
  },

  // Botão de testar conhecimentos (Checkpoint / Quiz)
  botaoCheckpointModulo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 161, 156, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 161, 156, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },

  textoBotaoCheckpoint: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: cores.confirmar,
    marginLeft: 6,
  },

  // Indicador de última pontuação do quiz
  linhaResultadoTentativa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  textoResultadoSucesso: {
    fontSize: 10,
    fontWeight: 'bold',
    color: cores.confirmar,
    letterSpacing: 0.8,
  },

  textoResultadoFalha: {
    fontSize: 10,
    fontWeight: 'bold',
    color: cores.cancelar,
    letterSpacing: 0.8,
  },

  // Lista onde as etapas (StepRow) são renderizadas
  listaEtapasModulo: {
    marginTop: 6,
  },
 // Caixa principal do resultado
  containerResultadoQuestionario: {
    width: '100%',
  },

  // Painel superior com a nota em destaque e mensagem de feedback
  painelPontuacaoGeral: {
    backgroundColor: cores.bksecundario,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 14,
  },

  // Porcentagem final de acertos (ex: 80%)
  textoPorcentagemResultado: {
    fontSize: 38,
    fontWeight: 'bold',
    color: cores.titulos,
    marginVertical: 4,
  },

  // Resumo de acertos numéricos (ex: "4 de 5 corretas")
  textoPontosResultado: {
    fontSize: 13,
    color: cores.descricao,
    marginBottom: 6,
  },

  // Mensagem positiva se o usuário passou no teste
  textoFeedbackAprovado: {
    fontSize: 12,
    fontWeight: '600',
    color: cores.confirmar, // Verde Petronas
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
  },

  // Mensagem de incentivo se o usuário reprovou
  textoFeedbackReprovado: {
    fontSize: 12,
    fontWeight: '600',
    color: cores.cancelar, // Vermelho Alerta
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
  },

  // Área rolável contendo a revisão de cada pergunta
  areaListaRevisaoRespostas: {
    maxHeight: 280,
    marginBottom: 14,
  },

  // Cartão individual de cada questão revisada
  cartaoPerguntaRevisao: {
    backgroundColor: cores.bkprincipal,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    padding: 12,
    marginBottom: 10,
  },

  // Linha com o ícone (certo/errado) e o texto da pergunta
  linhaEnunciadoRevisao: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },

  textoEnunciadoRevisao: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: cores.titulos,
    lineHeight: 18,
  },

  // Destaque exibido quando o usuário errou, mostrando qual era a opção certa
  blocoGabaritoCorreto: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: cores.bksecundario,
  },

  textoRotuloCorreta: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: cores.confirmar,
  },

  textoOpcaoCorreta: {
    fontSize: 12,
    color: cores.textoComum,
    marginTop: 2,
  },

  // Texto explicativo que ensina o porquê da resposta
  textoExplicacaoResposta: {
    fontSize: 11,
    lineHeight: 16,
    color: cores.descricao,
    marginTop: 6,
  },

  // Botão "Nova bateria de perguntas"
  botaoTentarNovamente: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    borderRadius: 12,
    backgroundColor: cores.bksecundario,
    gap: 8,
  },

  textoBotaoTentarNovamente: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: cores.titulos,
  },
// Caixa principal do painel de destaque
  painelDestaqueTrilha: {
    backgroundColor: cores.bksecundario,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    padding: 16,
    marginBottom: 16,
    width: '100%',
  },

  // Tópico em destaque no topo em Verde Petronas
  textoTopicoDestaque: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: cores.confirmar,
  },

  // Título principal em caixa alta e tamanho imponente
  textoTituloDestaque: {
    fontSize: 22,
    fontWeight: 'bold',
    color: cores.titulos,
    lineHeight: 28,
    marginVertical: 8,
  },

  // Linha com pílulas de metadados (Nível, Objetivo, Semanas)
  linhaEmblemasDestaque: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },

  emblemaDestaque: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    backgroundColor: cores.bkprincipal,
  },

  textoEmblemaDestaque: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: cores.descricao,
  },

  // Texto descritivo/resumo da trilha
  textoResumoDestaque: {
    fontSize: 13,
    lineHeight: 19,
    color: cores.descricao,
    marginBottom: 14,
  },

  // Grade 2x2 com os 4 cartões de estatísticas vitais
  gradeMetricasDestaque: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginVertical: 12,
  },

  // Cada caixinha individual da grade
  cartaoMetricaItem: {
    width: '48%', // Garante 2 colunas perfeitas com espaçamento
    backgroundColor: cores.bkprincipal,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    borderRadius: 12,
    padding: 12,
  },

  textoValorMetrica: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.titulos,
    marginTop: 4,
  },

  textoRotuloMetrica: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: cores.descricao,
    marginTop: 2,
  },

  // Caixa de estratégia / plano de corrida
  blocoEstrategiaPlano: {
    backgroundColor: cores.bkprincipal,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    borderLeftWidth: 3,
    borderLeftColor: cores.confirmar, // Linha de destaque Verde Petronas
    borderRadius: 12,
    padding: 14,
    marginVertical: 10,
  },

  textoTituloEstrategia: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: cores.confirmar,
    marginBottom: 4,
  },

  textoDescricaoEstrategia: {
    fontSize: 12,
    lineHeight: 18,
    color: cores.textoComum,
  },

  // Área com os botões de ação e seletor de status
  colunaAcoesDestaque: {
    gap: 10,
    marginTop: 10,
  },

  // Botão primário para abrir o assistente de adaptação com IA
  botaoAjustarEstrategia: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.confirmar,
    height: 44,
    borderRadius: 10,
    gap: 8,
  },

  textoBotaoAjustarEstrategia: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: cores.botoesTexto,
  },

  // Botão secundário de exportar para PDF
  botaoExportarPdfDestaque: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: cores.bordaInput,
    height: 44,
    borderRadius: 10,
    gap: 8,
  },

  textoBotaoExportarPdf: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: cores.textoComum,
  },

  // Barra de abas para alternar o status (Planejado / Em curso / Concluído)
  areaSeletorStatus: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: cores.bkprincipal,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    borderRadius: 30,
    padding: 4,
    marginTop: 4,
  },

  pilulaStatusItem: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },

  pilulaStatusItemAtiva: {
    backgroundColor: 'rgba(0, 161, 156, 0.15)',
    borderWidth: 1,
    borderColor: cores.confirmar,
  },

  textoPilulaStatus: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: cores.descricao,
  },

  textoPilulaStatusAtiva: {
    color: cores.confirmar,
  },
   // Fundo escuro cobrindo a tela
  fundoModalQuestionario: {
    flex: 1,
    backgroundColor: cores.bkmodais,
    justifyContent: 'center',
    padding: 16,
  },

  // Cartão central do modal
  cartaoModalQuestionario: {
    backgroundColor: cores.bksecundario,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    maxHeight: '90%',
    padding: 18,
  },

  // Cabeçalho do modal com título, descrição e botão fechar
  cabecalhoModalQuestionario: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: cores.bordaInput,
    paddingBottom: 12,
    marginBottom: 12,
  },

  linhaTituloQuestionario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  textoTituloQuestionario: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: cores.titulos,
  },

  textoDescricaoQuestionario: {
    fontSize: 11,
    color: cores.descricao,
    marginTop: 4,
    lineHeight: 16,
    maxWidth: 260,
  },

  // Indicador de carregamento enquanto as perguntas são geradas
  areaCarregandoQuestionario: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },

  textoCarregandoQuestionario: {
    fontSize: 13,
    color: cores.descricao,
    textAlign: 'center',
  },

  // Mensagem de alerta/erro
  areaErroQuestionario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'rgba(217, 83, 79, 0.1)',
    borderRadius: 8,
  },

  textoErroQuestionario: {
    flex: 1,
    fontSize: 12,
    color: cores.cancelar,
    lineHeight: 17,
  },

  // Lista rolável de perguntas
  areaListaPerguntasQuiz: {
    maxHeight: 380,
    marginVertical: 8,
  },

  // Cartão de cada pergunta individual
  cartaoPerguntaItemQuiz: {
    backgroundColor: cores.bkprincipal,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    padding: 14,
    marginBottom: 14,
  },

  textoNumeroPerguntaQuiz: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: cores.confirmar,
    marginBottom: 4,
  },

  textoEnunciadoQuiz: {
    fontSize: 13,
    fontWeight: '600',
    color: cores.titulos,
    lineHeight: 18,
    marginBottom: 12,
  },

  // Lista de botões de alternativas (A, B, C, D)
  listaOpcoesQuiz: {
    gap: 8,
  },

  botaoOpcaoRespostaQuiz: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    backgroundColor: cores.bksecundario,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  botaoOpcaoRespostaSelecionada: {
    borderColor: cores.confirmar,
    backgroundColor: 'rgba(0, 161, 156, 0.12)',
  },

  letraOpcaoQuiz: {
    fontSize: 11,
    fontWeight: 'bold',
    color: cores.confirmar,
    width: 18,
  },

  textoOpcaoQuiz: {
    flex: 1,
    fontSize: 12,
    color: cores.descricao,
  },

  textoOpcaoQuizSelecionada: {
    color: cores.titulos,
    fontWeight: '600',
  },

  // Botão inferior de "Corrigir"
  botaoCorrigirQuiz: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.confirmar,
    height: 46,
    borderRadius: 10,
    marginTop: 10,
    gap: 8,
  },

  textoBotaoCorrigirQuiz: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: cores.botoesTexto,
  },

  botaoCorrigirDesabilitado: {
    opacity: 0.6,
  },
  // Contêiner principal da etapa (com separador superior)
  containerLinhaEtapa: {
    borderTopWidth: 1,
    borderTopColor: cores.bkinput,
    paddingVertical: 14,
  },

  // Efeito visual quando a etapa já foi marcada como concluída
  containerEtapaConcluida: {
    opacity: 0.7,
  },

  // Linha geral alinhando o botão de checkbox à esquerda do conteúdo
  linhaConteudoEtapa: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  // Botão de alternar conclusão (Checkbox)
  botaoAlternarConclusaoEtapa: {
    paddingTop: 2,
  },

  // Área direita contendo todas as informações e recursos
  areaInformacoesEtapa: {
    flex: 1,
  },

  // Linha com título da etapa e pílula de minutos estimados
  linhaTituloEEstimativa: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },

  textoTituloEtapa: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.titulos,
    lineHeight: 20,
    flexShrink: 1,
  },

  // Título riscado quando a etapa está concluída
  textoTituloEtapaConcluido: {
    color: cores.descricao,
    textDecorationLine: 'line-through',
  },

  // Pílula com o tempo estimado (ex: 20 min)
  emblemaMinutosEtapa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    backgroundColor: cores.bkprincipal,
  },

  textoMinutosEtapa: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: cores.descricao,
  },

  // Descrição do conteúdo que será aprendido
  textoDescricaoEtapa: {
    fontSize: 12,
    lineHeight: 18,
    color: cores.descricao,
    marginTop: 4,
  },

  // Bloco de exercício prático sugerido
  blocoDestaquePratica: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 8,
  },

  textoRotuloPratica: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: cores.descricao,
  },

  textoConteudoPratica: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: cores.textoComum,
  },

  // Bloco de critério de sucesso ("Pronto quando:")
  blocoDestaqueCriterio: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 6,
  },

  textoRotuloCriterio: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: cores.confirmar,
  },

  textoConteudoCriterio: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: cores.textoComum,
  },

  // Grade/lista de botões de links externos gratuitos
  areaRecursosLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },

  // Botão individual de link (Vídeo, Curso, Artigo, etc.)
  botaoRecursoExterno: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: cores.bkprincipal,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    maxWidth: '100%',
  },

  textoTituloRecurso: {
    fontSize: 11,
    fontWeight: '500',
    color: cores.titulos,
    maxWidth: 160,
  },

  textoProvedorRecurso: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: cores.descricao,
  },

  // Botão para acionar o Tutor com IA sobre esta etapa específica
  botaoChamarTutorEtapa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginTop: 8,
  },

  textoBotaoChamarTutor: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: cores.descricao,
  },
    // Caixa de nota de sucesso emitida pela IA após recalcular o plano
  blocoNotaNovaEstrategia: {
    backgroundColor: 'rgba(0, 161, 156, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 161, 156, 0.4)',
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
  },

  // Área rolável do formulário de estratégia
  areaRolagemEstrategia: {
    maxHeight: 460,
  },

  // Linha de item do histórico de adaptações passadas
  itemHistoricoAdaptacao: {
    fontSize: 11,
    lineHeight: 16,
    color: cores.descricao,
    marginTop: 4,
  },
   itemSanfona: {
    borderBottomWidth: 1,
    borderBottomColor: cores.bordaInput,
    overflow: 'hidden',
  },

  gatilhoSanfona: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },

  conteudoSanfona: {
    paddingBottom: 14,
    paddingTop: 2,
  },
  rodapeDialogoAlerta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
  },

  botaoDialogoCancelar: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

  botaoDialogoAcao: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: cores.cancelar, // Vermelho de alerta para ações destrutivas por padrão
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerAlertaPadrao: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    backgroundColor: cores.bksecundario,
    padding: 14,
    marginVertical: 6,
  },

  bannerAlertaDestrutivo: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(217, 83, 79, 0.5)',
    backgroundColor: 'rgba(217, 83, 79, 0.1)',
    padding: 14,
    marginVertical: 6,
  },
   avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: cores.bksecundario,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  avatarTextoFallback: {
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: cores.confirmar, // Iniciais em Verde Petronas
  },
  emblemaBase: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },

  textoEmblemaBase: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  trilhaNavegacaoLista: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginVertical: 8,
  },

  trilhaNavegacaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  trilhaNavegacaoTexto: {
    fontSize: 12,
    color: cores.descricao,
  },

  trilhaNavegacaoTextoAtivo: {
    fontSize: 12,
    fontWeight: '600',
    color: cores.titulos,
  },
  botaoGenericoBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    gap: 8,
  },

  botaoDesabilitado: {
    opacity: 0.5,
  },
  calendarioContainer: {
    backgroundColor: cores.bksecundario,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    padding: 14,
    width: '100%',
  },

  calendarioCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  calendarioLinhaDiasSemana: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },

  calendarioTextoDiaSemana: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: cores.descricao,
    textTransform: 'uppercase',
  },

  calendarioGradeDias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  calendarioCelulaDia: {
    width: '14.28%', // 100% dividido por 7 dias
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },

  calendarioDiaSelecionado: {
    backgroundColor: cores.confirmar,
    borderRadius: 20,
  },

  calendarioDiaHoje: {
    borderWidth: 1,
    borderColor: cores.confirmar,
    borderRadius: 20,
  },
  // Caixa externa do cartão com fundo carbono e borda sutil
  cartaoGenerico: {
    backgroundColor: cores.bksecundario,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    width: '100%',
    marginBottom: 12,
    overflow: 'hidden', // Evita que elementos internos vazem das bordas arredondadas
  },

  // Área superior onde ficam o título e o subtítulo explicativo
  cartaoCabecalho: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },

  // Título em destaque do cartão
  cartaoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.titulos,
    letterSpacing: 0.5,
  },

  // Descrição/subtítulo em cinza claro com entrelinha confortável
  cartaoDescricao: {
    fontSize: 13,
    color: cores.descricao,
    marginTop: 4,
    lineHeight: 18,
  },

  // Corpo principal do cartão onde vão inputs, textos, listas ou imagens
  cartaoConteudo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  // Rodapé reservado para botões de ação (Salvar, Cancelar, Avançar)
  cartaoRodape: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
    gap: 8,
  },
  carrosselContainer: {
    width: '100%',
    position: 'relative',
    marginVertical: 10,
  },

  // Botões circulares flutuantes de Anterior e Próximo
  carrosselBotaoNavegacao: {
    position: 'absolute',
    top: '50%',
    marginTop: -18, // Centraliza perfeitamente no eixo vertical
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: cores.bksecundario,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Garante que o botão fique acima dos slides
  },

  // Indicador de pontinhos no rodapé (Dots de paginação)
  carrosselLinhaIndicadores: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },

   // Caixa principal com proporção 16:9 que abriga o gráfico
  graficoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: cores.bksecundario,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: cores.bordaInput,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  // Linha horizontal centralizada com os itens da legenda
  graficoLegendaLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },

  graficoLegendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  // Marcador quadrado/pílula de cor da legenda
  graficoLegendaPonto: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
});