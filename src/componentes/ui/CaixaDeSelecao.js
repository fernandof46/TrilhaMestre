/**
 * ============================================================================
 * ARQUIVO: CaixaDeSelecao.js
 * 
 * PROPÓSITO:
 * Componente visual de seleção (marcado / desmarcado) para formulários,
 * etapas concluídas de estudos ou opções de preferências do aplicativo.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes vêm de estilos/index.js. Zero estilos inline.
 * ============================================================================
 */

import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * COMPONENTE: CaixaDeSelecao
 * 
 * @param {boolean} marcado - Estado atual da caixa (verdadeiro para marcado, falso para desmarcado).
 * @param {function} aoAlterar - Função chamada ao tocar na caixa, recebe o novo valor booleano.
 * @param {string} rotulo - Texto opcional que aparece ao lado da caixa de seleção.
 * @param {boolean} desabilitado - Se verdadeiro, impede o toque do usuário e esmaece a caixa.
 * @param {object} estiloPersonalizado - Estilo visual extra opcional vindo de estilos/index.js.
 */
export function CaixaDeSelecao({
  marcado = false,
  aoAlterar,
  rotulo,
  desabilitado = false,
  estiloPersonalizado,
}) {
  /**
   * Função interna que inverte o valor atual e notifica a tela mãe
   */
  const executarClique = () => {
    if (desabilitado) return;

    if (aoAlterar) {
      aoAlterar(!marcado);
    }
  };

  return (
    <TouchableOpacity
      onPress={executarClique}
      disabled={desabilitado}
      activeOpacity={0.7}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      style={[
        rotulo ? estilos.caixaSelecaoLinhaComTexto : null,
        estiloPersonalizado,
      ]}
    >
      {/* Caixa quadrada que recebe o visto */}
      <View
        style={[
          estilos.caixaSelecaoBase,
          marcado ? estilos.caixaSelecaoMarcada : estilos.caixaSelecaoDesmarcada,
          desabilitado && estilos.botaoDesabilitado,
        ]}
      >
        {marcado ? (
          <Feather name="check" size={14} color={cores.botoesTexto} />
        ) : null}
      </View>

      {/* Rótulo adaptado 100% aos estilos já existentes de opções */}
      {rotulo ? (
        <Text
          style={[
            estilos.grupoEscolhaRotuloOpcao,
            marcado && estilos.grupoEscolhaTextoAtivo,
          ]}
        >
          {rotulo}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

export default CaixaDeSelecao;