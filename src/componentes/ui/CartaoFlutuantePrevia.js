/**
 * ============================================================================
 * ARQUIVO: CartaoFlutuantePrevia.js
 * 
 * PROPÓSITO:
 * Janela flutuante com informações extras ou prévias sobre um termo ou item.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes vêm de estilos/index.js. Zero estilos inline.
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

// Contexto para sincronizar o gatilho com a janela flutuante
const ContextoCartaoFlutuante = createContext({
  visivel: false,
  abrirPrevia: () => {},
  fecharPrevia: () => {},
});

/**
 * COMPONENTE RAIZ: CartaoFlutuantePrevia
 */
export function CartaoFlutuantePrevia({ children }) {
  const [visivel, setVisivel] = useState(false);

  const abrirPrevia = () => setVisivel(true);
  const fecharPrevia = () => setVisivel(false);

  return (
    <ContextoCartaoFlutuante.Provider value={{ visivel, abrirPrevia, fecharPrevia }}>
      {children}
    </ContextoCartaoFlutuante.Provider>
  );
}

/**
 * GATILHO: GatilhoCartaoFlutuante
 * 
 * Função: O texto ou botão que, ao ser tocado, exibe a prévia.
 */
export function GatilhoCartaoFlutuante({ children, estiloPersonalizado }) {
  const { abrirPrevia } = useContext(ContextoCartaoFlutuante);

  return (
    <TouchableOpacity
      onPress={abrirPrevia}
      activeOpacity={0.7}
      style={estiloPersonalizado}
    >
      {children}
    </TouchableOpacity>
  );
}

/**
 * CONTEÚDO DA PRÉVIA: ConteudoCartaoFlutuante
 * 
 * Função: Cartão flutuante que se fecha ao tocar fora.
 */
export function ConteudoCartaoFlutuante({ children, estiloPersonalizado }) {
  const { visivel, fecharPrevia } = useContext(ContextoCartaoFlutuante);

  return (
    <Modal
      transparent={true}
      visible={visivel}
      animationType="fade"
      onRequestClose={fecharPrevia}
    >
      <TouchableWithoutFeedback onPress={fecharPrevia}>
        <View style={estilos.fundoSobreposicao}>
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

export default CartaoFlutuantePrevia;