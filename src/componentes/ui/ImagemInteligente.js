/**
 * ============================================================================
 * ARQUIVO: ImagemInteligente.js (Substituto nativo do Image da Web/Wix)
 * 
 * FINALIDADE DO ARQUIVO:
 * Exibir imagens estáticas ou remotas de forma segura contra falhas de conexão.
 * Gerencia o download em 3 camadas de resiliência e previne o estouro de
 * memória RAM no aparelho ao solicitar imagens redimensionadas pela CDN.
 * 
 * CICLO DE RECUPERAÇÃO EM 3 NÍVEIS (FALLBACK INTELIGENTE):
 * 1. NÍVEL 1 (Otimizado): Tenta carregar a imagem comprimida pela CDN.
 * 2. NÍVEL 2 (Original): Se a CDN falhar, tenta o link bruto original.
 * 3. NÍVEL 3 (Reserva): Se o link der 404, exibe uma imagem padrão segura.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js. Zero estilos inline.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { Image as ImagemNativa, View, ActivityIndicator, StyleSheet } from 'react-native';
import {
  analisarUrlMidia,
  construirUrlOtimizada,
  obterUrlOriginal,
  MODOS_CARREGAMENTO,
  proximoModoCarregamento,
} from '../lib/otimizadorDeImagens';
import { estilos } from './estilos';
import { cores } from './cores';

// URL de segurança utilizada caso a imagem do usuário esteja quebrada ou indisponível
const URL_IMAGEM_RESERVA =
  'https://static.wixstatic.com/media/12d367_4f26ccd17f8f4e3a8958306ea08c2332~mv2.png';

/**
 * COMPONENTE: ImagemInteligente
 * 
 * Para que serve:
 * Renderizar imagens de capas de cursos, fotos de perfil ou miniaturas de trilhas
 * com feedback visual de carregamento e proteção contra quedas de rede.
 * 
 * @param {string} fonte - Link web (URL) da imagem que deve ser exibida.
 * @param {string} src - Suporte retroativo para código legado da Web.
 * @param {string} tipoAjuste - 'cobrir' (preenche cortando bordas) ou 'conter' (exibe inteira).
 * @param {number} larguraOriginal - Largura esperada da imagem para cálculo de proporção.
 * @param {number} alturaOriginal - Altura esperada da imagem para cálculo de proporção.
 * @param {number} qualidade - Nível de compressão na CDN de 1 a 100 (padrão: 85).
 * @param {function} aoOcorrerErro - Notifica a tela mãe caso todas as tentativas falhem.
 * @param {object} estiloPersonalizado - Estilo visual extra vindo de estilos/index.js.
 */
export function ImagemInteligente({
  fonte,
  src,
  tipoAjuste = 'cobrir',
  larguraOriginal,
  alturaOriginal,
  qualidade = 85,
  aoOcorrerErro,
  estiloPersonalizado,
  ...outrasPropriedades
}) {
  // Unifica a propriedade de entrada aceitando tanto 'fonte' quanto 'src'
  const urlFinal = fonte || src;

  // Analisa se o endereço pertence aos servidores autorizados da CDN
  const dadosCdn = urlFinal && urlFinal !== URL_IMAGEM_RESERVA
    ? analisarUrlMidia(urlFinal)
    : null;

  // Se o link for da CDN, inicia no modo otimizado; caso contrário, vai para o modo original
  const modoInicial = dadosCdn
    ? MODOS_CARREGAMENTO.OTIMIZADO
    : MODOS_CARREGAMENTO.ORIGINAL;

  const [modoAtual, setModoAtual] = useState(modoInicial);
  const [carregando, setCarregando] = useState(true);

  // Reinicia o ciclo de tentativas caso a URL mude dinamicamente
  useEffect(() => {
    setModoAtual(modoInicial);
    setCarregando(true);
  }, [urlFinal, modoInicial]);

  /**
   * Função: lidarComErroCarregamento
   * Para que serve: Acionada automaticamente pelo evento onError da Imagem Nativa.
   * O que faz: Faz a transição para a próxima alternativa de recuperação (Otimizado -> Original -> Reserva).
   */
  const lidarComErroCarregamento = (eventoErro) => {
    if (modoAtual === MODOS_CARREGAMENTO.RESERVA) {
      setCarregando(false);
      return;
    }

    const proximoModo = proximoModoCarregamento(modoAtual);
    setModoAtual(proximoModo);

    // Se atingiu o último estágio de reserva, avisa a tela consumidora
    if (proximoModo === MODOS_CARREGAMENTO.RESERVA && aoOcorrerErro) {
      aoOcorrerErro(eventoErro);
    }
  };

  /**
   * Função: resolverUrlParaExibicao
   * Para que serve: Decide qual URL exata deve ser solicitada à internet no momento.
   * O que faz: Aplica corte e compressão se estiver no modo Otimizado, ou devolve o link bruto/reserva.
   * Retorna: {string} URL pronta para o componente nativo Image.
   */
  const resolverUrlParaExibicao = () => {
    if (!urlFinal) return URL_IMAGEM_RESERVA;

    if (modoAtual === MODOS_CARREGAMENTO.RESERVA) {
      return URL_IMAGEM_RESERVA;
    }

    if (modoAtual === MODOS_CARREGAMENTO.ORIGINAL || !dadosCdn) {
      return obterUrlOriginal(urlFinal, dadosCdn);
    }

    return construirUrlOtimizada(dadosCdn, {
      largura: larguraOriginal || 800,
      altura: alturaOriginal,
      cortar: tipoAjuste === 'cobrir',
      qualidade,
    });
  };

  // Converte a nomenclatura em português para os modos nativos do React Native
  const modoRedimensionamentoNativo = tipoAjuste === 'conter' ? 'contain' : 'cover';

  return (
    <View
      style={[
        estilos.cartaoGenerico,
        estiloPersonalizado,
      ]}
    >
      {/* IMAGEM NATIVA: Preenche 100% da área via preenchimento absoluto padrão */}
      <ImagemNativa
        source={{ uri: resolverUrlParaExibicao() }}
        resizeMode={modoRedimensionamentoNativo}
        style={StyleSheet.absoluteFillObject}
        onLoadEnd={() => setCarregando(false)}
        onError={lidarComErroCarregamento}
        {...outrasPropriedades}
      />

      {/* FEEDBACK DE CARREGAMENTO: Centralizado via área de título reutilizada */}
      {carregando ? (
        <View style={[StyleSheet.absoluteFillObject, estilos.areaTitulo]}>
          <ActivityIndicator size="small" color={cores.confirmar} />
        </View>
      ) : null}
    </View>
  );
}

export default ImagemInteligente;