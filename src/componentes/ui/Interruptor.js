/**
 * ============================================================================
 * ARQUIVO: Interruptor.js (Substituto nativo do Switch da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Fornecer um controle de alternância liga/desliga (toggle switch) com toque
 * simples. Muito utilizado em telas de configurações (ex: "Ativar notificações",
 * "Modo offline", "Áudio do tutor").
 * 
 * DESIGN SYSTEM (MERCEDES-AMG F1):
 * - Estado Ligado: Trilho iluminado em Verde Petronas (#00A19C).
 * - Estado Desligado: Trilho em cinza carbono escuro (bkinput).
 * - Botão de correr (Thumb): Branco puro (titulos).
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js. Zero estilos inline.
 * 
 * EXEMPLO DE USO NO PROJETO:
 * <Interruptor
 *    ativado={notificacoesAtivas}
 *    aoAlternar={setNotificacoesAtivas}
 * />
 * ============================================================================
 */

import React from 'react';
import { Switch as SwitchNativo, View } from 'react-native';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * COMPONENTE: Interruptor
 * 
 * Para que serve:
 * Alternar uma preferência booleana (verdadeiro/falso) de forma imediata.
 * 
 * O que faz:
 * Aciona o componente de interruptor nativo do Android e iOS com cores F1 padronizadas.
 * 
 * @param {boolean} ativado - Estado atual do interruptor (true para ligado, false para desligado).
 * @param {boolean} checked - Suporte retroativo para código legado da Web.
 * @param {function} aoAlternar - Callback chamado ao tocar no botão: (novoEstado) => {}
 * @param {function} onCheckedChange - Suporte retroativo para código legado da Web.
 * @param {boolean} desabilitado - Impede a interação e esmaece o controle.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function Interruptor({
  ativado,
  checked,
  aoAlternar,
  onCheckedChange,
  desabilitado = false,
  estiloPersonalizado,
  ...outrasPropriedades
}) {
  // Unifica a leitura das propriedades aceitando tanto português quanto legado
  const estaLigado = ativado !== undefined ? ativado : Boolean(checked);

  /**
   * Função: lidarComMudanca
   * O que faz: Dispara a notificação de inversão de estado para a tela mãe.
   */
  const lidarComMudanca = (novoValor) => {
    if (desabilitado) return;
    if (aoAlternar) aoAlternar(novoValor);
    if (onCheckedChange) onCheckedChange(novoValor);
  };

  return (
    <View
      style={[
        desabilitado ? estilos.botaoDesabilitado : null,
        estiloPersonalizado,
      ]}
    >
      <SwitchNativo
        value={estaLigado}
        onValueChange={lidarComMudanca}
        disabled={desabilitado}
        trackColor={{
          false: cores.bkinput,     // Trilho cinza escuro quando desligado
          true: cores.confirmar,    // Trilho Verde Petronas quando ligado
        }}
        thumbColor={cores.titulos}   // Botão branco de correr
        ios_backgroundColor={cores.bkinput}
        accessibilityRole="switch"
        accessibilityState={{ checked: estaLigado, disabled: desabilitado }}
        {...outrasPropriedades}
      />
    </View>
  );
}

// Aliases em inglês para manter 100% de compatibilidade com imports legados
export const Switch = Interruptor;
export default Interruptor;