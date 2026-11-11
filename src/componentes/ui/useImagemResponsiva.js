/**
 * ============================================================================
 * ARQUIVO: useImagemResponsiva.js (Substituto nativo do useResponsiveImage)
 * 
 * FINALIDADE DO HOOK:
 * Gerenciar a medição dinâmica da área de exibição da imagem no celular. 
 * Ele calcula a largura e altura real do container na tela para solicitar
 * à CDN a imagem no tamanho exato, evitando consumo excessivo de RAM e dados.
 * 
 * COMPORTAMENTO TÉCNICO:
 * 1. Utiliza o evento onLayout do React Native para capturar dimensões.
 * 2. Calcula a proporção (aspect ratio) para evitar saltos de layout.
 * 3. Fornece as opções de corte (crop) e ponto focal para a função de construção de URL.
 * 
 * DOCUMENTAÇÃO PARA MANUTENÇÃO:
 * Se as imagens parecerem borradas, aumente o multiplicador de densidade 
 * de pixels (PixelRatio) no cálculo de largura.
 * ============================================================================
 */

import { useRef, useState } from 'react';
import { PixelRatio } from 'react-native';

/**
 * HOOK: useImagemResponsiva
 * 
 * @param {object} opcoes - { parsed, fittingType, focalPoint, qualidade, onLoad }
 * @param {React.Ref} referênciaPai - Ref para expor o elemento da imagem ao componente pai.
 * 
 * @returns {object} Objeto contendo as referências, estado de carga e opções de corte.
 */
export function useImagemResponsiva({
  parsed,
  fittingType,
  focalPoint,
  qualidade,
  onLoad,
}) {
  // Referência para o container externo (para medição de tamanho)
  const referênciaContainer = useRef(null);
  // Referência para a imagem nativa
  const referênciaImagem = useRef(null);
  
  // Estado de controle de visibilidade (True quando a foto termina de baixar)
  const [urlCarregada, setUrlCarregada] = useState(null);

  // Armazena as dimensões reais do container detectadas no aparelho
  const [dimensoes, setDimensoes] = useState({
    largura: 0,
    altura: 0,
  });

  /**
   * Função: lidarComMudançaDeTamanho
   * Para que serve: Atualiza as dimensões da imagem assim que ela é renderizada na tela.
 *  
   * @param {object} evento - Evento nativo onLayout do React Native.
   */
  const lidarComMudançaDeTamanho = (evento) => {
    const { width, height } = evento.nativeEvent.layout;
    setDimensoes({ largura: width, altura: height });
  };

  /**
   * Função: lidarComCarga
   * Para que serve: Sincroniza o estado de carregamento com o componente pai.
   */
  const lidarComCarga = (evento) => {
    setUrlCarregada(parsed?.urlBase || null);
    if (onLoad) onLoad(evento);
  };

  // Define se a imagem deve sofrer corte (crop) baseado no tipo de ajuste
  const deveCortar = fittingType !== 'conter';

  // Monta as opções de transformação para a CDN Baseada na largura real da tela
  const opcoesTransformacao = dimensoes.largura > 0 ? {
    // Multiplicamos a largura pelo PixelRatio (2x ou 3x) para evitar que a imagem 
    // fique serrilhada em telas Retina/AMOLED de alta densidade.
    largura: dimensoes.largura * PixelRatio.get(),
    altura: dimensoes.altura ? dimensoes.altura * PixelRatio.get() : undefined,
    cortar: deveCortar,
    pontoFocal: deveCortar ? focalPoint : undefined,
    qualidade,
  } : null;

  return {
    referenciaContainer: referênciaContainer,
    referenciaImagem: referênciaImagem,
    carregado: Boolean(parsed?.urlBase && urlCarregada === parsed.urlBase),
    opcoes: opcoesTransformacao,
    handleLoad: lidarComCarga,
    // Função auxiliar para disparar a medição de tamanho manualmente se necessário
    medirTamanho: lidarComMudançaDeTamanho,
  };
}