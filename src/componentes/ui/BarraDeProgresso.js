/**
 * ============================================================================
 * ARQUIVO: BarraDeProgresso.js (Substituto nativo do Progress da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Exibir uma barra de progresso horizontal para indicar a porcentagem de
 * conclusão de uma trilha de estudos, módulo, meta semanal ou carregamento.
 * 
 * DESIGN SYSTEM (MERCEDES-AMG F1):
 * - Trilho de fundo: Cinza carbono discreto (bkinput).
 * - Preenchimento: Verde Petronas (#00A19C) com cantos arredondados.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js (trilhoBarraProgresso e 
 * preenchimentoBarraProgresso).
 * 
 * EXEMPLO DE USO NO PROJETO:
 * <BarraDeProgresso valor={75} maximo={100} />
 * ============================================================================
 */

import React from 'react';
import { View } from 'react-native';
import { estilos } from './estilos';

/**
 * COMPONENTE: BarraDeProgresso
 * 
 * Para que serve:
 * Renderizar uma régua visual preenchida proporcionalmente ao progresso do usuário.
 * 
 * O que faz:
 * Calcula a porcentagem entre o valor atual e o máximo estipulado, travando
 * o resultado defensivamente entre 0% e 100% para não quebrar a tela.
 * 
 * @param {number} valor - Valor atual concluído (ex: 3 etapas concluídas). Padrão: 0.
 * @param {number} maximo - Valor total da meta (ex: 10 etapas no total). Padrão: 100.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function BarraDeProgresso({
  valor = 0,
  maximo = 100,
  estiloPersonalizado,
  ...outrasPropriedades
}) {
  /**
   * Cálculo defensivo da porcentagem:
   * 1. Evita divisão por zero caso 'maximo' venha zerado ou inválido.
   * 2. Trava o valor entre 0 e 100 via Math.max e Math.min para não vazar das bordas.
   */
  const divisorValido = maximo > 0 ? maximo : 100;
  const porcentagemCalculada = Math.round((valor / divisorValido) * 100);
  const valorSeguro = Math.max(0, Math.min(100, porcentagemCalculada));

  return (
    <View
      style={[
        estilos.trilhoBarraProgresso,
        estiloPersonalizado,
      ]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: valorSeguro }}
      {...outrasPropriedades}
    >
      {/* Preenchimento dinâmico proporcional em Verde Petronas */}
      <View
        style={[
          estilos.preenchimentoBarraProgresso,
          { width: `${valorSeguro}%` },
        ]}
      />
    </View>
  );
}

export default BarraDeProgresso;