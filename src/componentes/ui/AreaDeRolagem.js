/**
 * ============================================================================
 * ARQUIVO: AreaDeRolagem.js (Substituto nativo do ScrollArea da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Fornecer um contêiner com rolagem suave (momentum scrolling) vertical ou
 * horizontal para listas de itens, textos longos ou formulários que excedem
 * a altura da tela do celular.
 * 
 * ADAPTAÇÃO MOBILE:
 * Elimina as barras de rolagem virtuais da Web em favor do motor de gestos
 * nativo do sistema operacional (Android e iOS) a 60 quadros por segundo.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js. Zero estilos inline.
 * 
 * EXEMPLO DE USO NO PROJETO:
 * <AreaDeRolagem>
 *    {...Conteúdos longos que ultrapassam a tela...}
 * </AreaDeRolagem>
 * ============================================================================
 */

import React from 'react';
import { ScrollView } from 'react-native';
import { estilos } from './estilos';

/**
 * COMPONENTE RAIZ: AreaDeRolagem (ScrollArea)
 * 
 * Para que serve:
 * Envolve qualquer lista ou conteúdo extenso permitindo deslizar a tela com os dedos.
 * 
 * O que faz:
 * Aciona o ScrollView nativo do React Native com suporte a rolagem vertical ou horizontal
 * e controle inteligente de exibição de indicadores.
 * 
 * @param {string} orientacao - 'vertical' (padrão) ou 'horizontal'.
 * @param {boolean} exibirIndicador - Se verdadeiro, exibe a barra sutil lateral. Padrão: false.
 * @param {ReactNode} children - Os elementos que serão rolados na tela.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function AreaDeRolagem({
  orientacao = 'vertical',
  exibirIndicador = false,
  children,
  estiloPersonalizado,
  ...outrasPropriedades
}) {
  const ehHorizontal = orientacao === 'horizontal';

  return (
    <ScrollView
      horizontal={ehHorizontal}
      showsVerticalScrollIndicator={!ehHorizontal && exibirIndicador}
      showsHorizontalScrollIndicator={ehHorizontal && exibirIndicador}
      keyboardShouldPersistTaps="handled" // Garante que toques em botões funcionem mesmo com teclado aberto
      style={[estilos.containerPrincipal, estiloPersonalizado]}
      {...outrasPropriedades}
    >
      {children}
    </ScrollView>
  );
}

/**
 * COMPONENTE DE COMPATIBILIDADE: BarraDeRolagem (ScrollBar)
 * 
 * Para que serve:
 * Mantido como componente nulo de compatibilidade semântica com telas importadas da Web,
 * pois no celular o sistema operacional já desenha a barra de rolagem nativamente.
 */
export function BarraDeRolagem() {
  return null;
}

// Aliases em inglês para manter 100% de paridade com imports legados
export const ScrollArea = AreaDeRolagem;
export const ScrollBar = BarraDeRolagem;

export default AreaDeRolagem;