/**
 * ============================================================================
 * ARQUIVO: ImagemResponsiva.js (Substituto nativo do ResponsiveImage da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Exibir imagens com proporção adaptável e efeito suave de carregamento no celular.
 * Utiliza somente o componente Image nativo e valida links antes de carregá-los.
 * 
 * DESIGN SYSTEM (MERCEDES-AMG F1):
 * - Contêiner carbono (#1E1E1E) com cantos arredondados (cartaoGenerico).
 * - Indicador de carregamento suave em Verde Petronas (#00A19C).
 * - Transição suave assim que a foto é recebida da internet.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js. Zero estilos inline.
 * ============================================================================
 */

import React, { useState } from 'react';
import { View, Image as ImagemNativa, ActivityIndicator, StyleSheet } from 'react-native';
import { validarLinkImagem } from './otimizadorDeImagens';
import { estilos } from './estilos';
import { cores } from './cores';

// Imagem neutra padrão exibida caso o link fornecido seja inválido
const URL_IMAGEM_PADRAO =
  'https://static.wixstatic.com/media/12d367_4f26ccd17f8f4e3a8958306ea08c2332~mv2.png';

/**
 * COMPONENTE: ImagemResponsiva
 * 
 * Para que serve:
 * Renderizar capas de cursos, ilustrações e fotos de perfil de forma fluida.
 * 
 * O que faz:
 * Valida a segurança do link, gerencia o estado de carregamento e adapta o modo
 * de corte (cobrir ou conter) usando o componente nativo de imagens do celular.
 * 
 * @param {string} fonte - URL da imagem que deve ser exibida.
 * @param {string} src - Suporte retroativo para código legado da Web.
 * @param {string} tipoAjuste - 'cobrir' (cover) ou 'conter' (contain). Padrão: 'cobrir'.
 * @param {function} aoCarregar - Callback executado quando o download da imagem termina com sucesso.
 * @param {function} aoOcorrerErro - Callback executado caso o link esteja quebrado.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function ImagemResponsiva({
  fonte,
  src,
  tipoAjuste = 'cobrir',
  aoCarregar,
  aoOcorrerErro,
  estiloPersonalizado,
  ...outrasPropriedades
}) {
  const urlOriginal = fonte || src;
  const linkEhValido = validarLinkImagem(urlOriginal);
  const urlFinal = linkEhValido ? urlOriginal : URL_IMAGEM_PADRAO;

  const [carregando, setCarregando] = useState(true);

  /**
   * Função: lidarComFimDoCarregamento
   * O que faz: Desliga o indicador de progresso e notifica o componente pai.
   */
  const lidarComFimDoCarregamento = (evento) => {
    setCarregando(false);
    if (aoCarregar) aoCarregar(evento);
  };

  /**
   * Função: lidarComFalhaDownload
   * O que faz: Desliga o spinner e notifica erro caso a imagem não possa ser baixada.
   */
  const lidarComFalhaDownload = (erro) => {
    setCarregando(false);
    if (aoOcorrerErro) aoOcorrerErro(erro);
  };

  // Converte a nomenclatura em português para o padrão nativo do React Native
  const modoAjusteNativo = tipoAjuste === 'conter' ? 'contain' : 'cover';

  return (
    <View
      style={[
        estilos.cartaoGenerico,
        estiloPersonalizado,
      ]}
    >
      {/* IMAGEM NATIVA: Preenche toda a área disponível via preenchimento absoluto padrão */}
      <ImagemNativa
        source={{ uri: urlFinal }}
        resizeMode={modoAjusteNativo}
        style={StyleSheet.absoluteFillObject}
        onLoad={lidarComFimDoCarregamento}
        onError={lidarComFalhaDownload}
        {...outrasPropriedades}
      />

      {/* INDICADOR DE CARREGAMENTO: Exibido enquanto os bytes da foto são baixados */}
      {carregando ? (
        <View style={[StyleSheet.absoluteFillObject, estilos.areaTitulo]}>
          <ActivityIndicator size="small" color={cores.confirmar} />
        </View>
      ) : null}
    </View>
  );
}

export default ImagemResponsiva;