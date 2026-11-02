/**
 * ============================================================================
 * ARQUIVO: DivisorLinha.js (Substituto nativo do Separator do Radix/shadcn)
 * 
 * FINALIDADE DO ARQUIVO:
 * Renderizar uma linha divisória sutil para segmentar seções de formulários,
 * blocos de texto, menus ou listas de materiais, aumentando a clareza e a
 * hierarquia visual da tela.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js (menuComandosSeparador).
 * Zero estilos inline.
 * 
 * EXEMPLO DE USO NO PROJETO:
 * <DivisorLinha />
 * ============================================================================
 */

import React from 'react';
import { View } from 'react-native';
import { estilos } from './estilos';

/**
 * COMPONENTE: DivisorLinha
 * 
 * Para que serve:
 * Traçar uma linha divisória horizontal fina com a cor padrão de borda da Mercedes F1.
 * 
 * O que faz:
 * Renderiza um elemento estrutural neutro (`View`) configurado para não interferir
 * em leitores de tela caso seja puramente estético.
 * 
 * @param {string} orientacao - 'horizontal' (padrão).
 * @param {boolean} decorativo - Se verdadeiro, oculta a linha da árvore de acessibilidade. Padrão: true.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function DivisorLinha({
  orientacao = 'horizontal',
  decorativo = true,
  estiloPersonalizado,
  ...outrasPropriedades
}) {
  return (
    <View
      style={[
        estilos.menuComandosSeparador,
        estiloPersonalizado,
      ]}
      accessible={!decorativo}
      accessibilityRole="none"
      {...outrasPropriedades}
    />
  );
}

export default DivisorLinha;