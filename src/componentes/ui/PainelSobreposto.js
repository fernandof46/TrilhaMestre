/**
 * ============================================================================
 * ARQUIVO: PainelSobreposto.js (Substituto nativo do Popover da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Exibir um painel flutuante rico de conteúdo (como seletores de data, filtros
 * avançados, paleta de cores ou mini formulários) posicionado acima da tela,
 * fechando suavemente quando o usuário toca em qualquer área externa.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js. Zero estilos inline.
 * 
 * ARQUITETURA EM BLOCOS (Composição React):
 * <PainelSobreposto>
 *    <GatilhoPainelSobreposto>
 *       {...Botão ou ícone que dispara a abertura...}
 *    </GatilhoPainelSobreposto>
 *    <ConteudoPainelSobreposto>
 *       {...Qualquer formulário, seletor de data ou texto interno...}
 *    </ConteudoPainelSobreposto>
 * </PainelSobreposto>
 * ============================================================================
 */

import React, { createContext, useContext, useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { estilos } from './estilos';

/**
 * CONTEXTO DE CONTROLE: ContextoPainelSobreposto
 * 
 * Para que serve:
 * Sincroniza o estado de abertura e fechamento entre o botão que o usuário toca (Gatilho)
 * e o painel flutuante que renderiza os dados (Conteúdo).
 */
const ContextoPainelSobreposto = createContext({
  estaAberto: false,
  abrirPainel: () => {},
  fecharPainel: () => {},
});

/**
 * COMPONENTE RAIZ: PainelSobreposto
 * 
 * Para que serve:
 * Provedor do estado de visibilidade da janela flutuante.
 * 
 * @param {boolean} aberto - Propriedade opcional para controle externo via tela mãe.
 * @param {function} aoAlterarAberto - Notifica o componente pai sobre mudanças de estado.
 * @param {ReactNode} children - GatilhoPainelSobreposto e ConteudoPainelSobreposto.
 */
export function PainelSobreposto({ aberto, aoAlterarAberto, children }) {
  const [abertoInterno, setAbertoInterno] = useState(false);

  // Define se usa o controle externo (passado por prop) ou o controle interno autônomo
  const estaAberto = aberto !== undefined ? aberto : abertoInterno;

  /**
   * Função: abrirPainel
   * O que faz: Altera o estado para verdadeiro (true).
   */
  const abrirPainel = () => {
    if (aoAlterarAberto) aoAlterarAberto(true);
    else setAbertoInterno(true);
  };

  /**
   * Função: fecharPainel
   * O que faz: Altera o estado para falso (false), recolhendo o painel.
   */
  const fecharPainel = () => {
    if (aoAlterarAberto) aoAlterarAberto(false);
    else setAbertoInterno(false);
  };

  return (
    <ContextoPainelSobreposto.Provider value={{ estaAberto, abrirPainel, fecharPainel }}>
      {children}
    </ContextoPainelSobreposto.Provider>
  );
}

/**
 * COMPONENTE GATILHO: GatilhoPainelSobreposto
 * 
 * Para que serve:
 * Envolve o botão ou elemento tocável que aciona a exibição do painel flutuante.
 * 
 * @param {ReactNode} children - Botão ou ícone gatilho.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function GatilhoPainelSobreposto({ children, estiloPersonalizado }) {
  const { abrirPainel } = useContext(ContextoPainelSobreposto);

  return (
    <TouchableOpacity
      onPress={abrirPainel}
      activeOpacity={0.7}
      style={estiloPersonalizado}
    >
      {children}
    </TouchableOpacity>
  );
}

/**
 * COMPONENTE DE CONTEÚDO: ConteudoPainelSobreposto
 * 
 * Para que serve:
 * Renderiza o cartão visual flutuante sobre a tela com fundo semitransparente escuro.
 * Um toque na área escura fora do cartão fecha o painel instantaneamente.
 * 
 * @param {ReactNode} children - Conteúdo, formulário ou lista dentro do painel.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function ConteudoPainelSobreposto({ children, estiloPersonalizado }) {
  const { estaAberto, fecharPainel } = useContext(ContextoPainelSobreposto);

  return (
    <Modal
      transparent={true}
      visible={estaAberto}
      animationType="fade"
      onRequestClose={fecharPainel}
    >
      {/* FECHAMENTO AO TOCAR FORA: Detecta toque na área escura do fundo */}
      <TouchableWithoutFeedback onPress={fecharPainel}>
        <View style={estilos.fundoSobreposicao}>
          {/* Evita que toques dentro do conteúdo fechem o painel sem querer */}
          <TouchableWithoutFeedback>
            <View
              style={[
                estilos.menuContextualCartao,
                estiloPersonalizado,
              ]}
            >
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

/**
 * ÂNCORA VISUAL: AncoraPainelSobreposto
 * 
 * Para que serve:
 * Envoltório de posicionamento semântico mantido para paridade com código de telas Web.
 */
export function AncoraPainelSobreposto({ children }) {
  return <View>{children}</View>;
}

export default PainelSobreposto;