/**
 * ============================================================================
 * ARQUIVO: otimizadorDeImagens.js
 * 
 * FINALIDADE DO ARQUIVO:
 * Processador universal de links de imagens. Valida se os links da web são
 * seguros (HTTPS), trata formatos de arquivo válidos e gerencia o ciclo
 * de recuperação (fallback) caso um link esteja fora do ar ou quebrado.
 * 
 * POR QUE ISSO É IMPORTANTE NO CELULAR?
 * Evita que imagens quebradas ou links inseguros congelem o aplicativo ou
 * causem telas brancas, garantindo que o usuário sempre veja o conteúdo.
 * ============================================================================
 */

// Largura padrão sugerida para renderização em celulares modernos
export const LARGURA_PADRAO_OTIMIZACAO = 1024;

// Modos do ciclo de vida de carregamento da imagem
export const MODOS_CARREGAMENTO = {
  PADRAO: 'padrao',   // Tenta carregar o link principal fornecido
  RESERVA: 'reserva', // Se falhar, aciona a imagem padrão de segurança do app
};

// Formatos de arquivo de imagem aceitos pelo aplicativo
const EXTENSOES_VALIDAS = /\.(jpg|jpeg|png|webp|gif)$/i;

/**
 * Função: validarLinkImagem
 * 
 * Para que serve:
 * Avalia se uma URL de imagem é estruturalmente segura e válida antes de
 * tentar fazer o download no aparelho do usuário.
 * 
 * O que faz:
 * 1. Confirma se o protocolo é estritamente seguro (HTTPS).
 * 2. Bloqueia tentativas com credenciais embutidas na URL.
 * 3. Valida se o arquivo possui uma extensão de imagem suportada.
 * 
 * @param {string} urlOrigem - Link completo da imagem.
 * @returns {boolean} Retorna verdadeiro (true) se a URL for segura e válida.
 */
export function validarLinkImagem(urlOrigem) {
  if (!urlOrigem || typeof urlOrigem !== 'string') return false;

  try {
    const urlFormatada = new URL(urlOrigem);

    // Exige estritamente conexão criptografada (HTTPS)
    if (urlFormatada.protocol !== 'https:') {
      return false;
    }

    // Bloqueia URLs maliciosas com dados de autenticação embutidos
    if (urlFormatada.username || urlFormatada.password) {
      return false;
    }

    // Bloqueia portas incomuns que não sejam 443 padrão
    if (urlFormatada.port && urlFormatada.port !== '443') {
      return false;
    }

    // Valida se o link aponta para uma extensão de imagem reconhecida
    return EXTENSOES_VALIDAS.test(urlFormatada.pathname);
  } catch {
    // Se a string não for uma URL válida, rejeita de forma defensiva
    return false;
  }
}

/**
 * Função: obterUrlSegura
 * 
 * Para que serve:
 * Devolve uma URL pronta para uso, garantindo que links inválidos não quebrem o app.
 * 
 * O que faz:
 * Testa o link recebido; se for válido, o retorna. Caso contrário, retorna nulo.
 * 
 * @param {string} urlOrigem - Link original fornecido.
 * @returns {string|null} URL validada ou nulo.
 */
export function obterUrlSegura(urlOrigem) {
  return validarLinkImagem(urlOrigem) ? urlOrigem : null;
}

/**
 * Função: proximoModoCarregamento
 * 
 * Para que serve:
 * Controla a máquina de estados de fallback da imagem quando ocorre falha de rede.
 * 
 * O que faz:
 * Alterna do modo padrão para o modo de reserva segura.
 * 
 * @param {string} modoAtual - O estágio de carregamento atual.
 * @returns {string} O próximo estágio (MODOS_CARREGAMENTO.RESERVA).
 */
export function proximoModoCarregamento(modoAtual) {
  return MODOS_CARREGAMENTO.RESERVA;
}

export default {
  validarLinkImagem,
  obterUrlSegura,
  proximoModoCarregamento,
  MODOS_CARREGAMENTO,
  LARGURA_PADRAO_OTIMIZACAO,
};