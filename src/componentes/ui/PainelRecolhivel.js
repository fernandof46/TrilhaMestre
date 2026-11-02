/**
 * ============================================================================
 * ARQUIVO: PainelRecolhivel.js
 * 
 * PROPÓSITO:
 * Fornecer um bloco de conteúdo que pode ser expandido ou recolhido (escondido)
 * pelo usuário ao tocar em um botão/cabeçalho gatilho.
 * 
 * EXEMPLO DE USO NO PROJETO:
 * <PainelRecolhivel padraoAberto={false}>
 *    <GatilhoRecolhivel>
 *       <Text>Toque aqui para ver mais detalhes</Text>
 *    </GatilhoRecolhivel>
 *    <ConteudoRecolhivel>
 *       <Text>Texto secreto ou formulário que se expande...</Text>
 *    </ConteudoRecolhivel>
 * </PainelRecolhivel>
 * ============================================================================
 */

import React, { createContext, useContext, useState } from 'react';
import { View, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';

// Habilita as animações nativas de layout em aparelhos Android mais antigos
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Criação do canal de comunicação (Contexto) entre o Painel, o Gatilho e o Conteúdo
const ContextoPainelRecolhivel = createContext({
  estaAberto: false,
  alternarAbertura: () => {},
});

/**
 * COMPONENTE RAIZ: PainelRecolhivel
 * 
 * @param {boolean} aberto - Controla o estado externamente (opcional).
 * @param {boolean} padraoAberto - Define se o painel começa aberto ou fechado (padrão: falso).
 * @param {function} aoAlterarAberto - Função chamada quando o estado de abertura muda.
 * @param {ReactNode} children - Os elementos internos (Gatilho e Conteúdo).
 * @param {object} estiloPersonalizado - Estilos extras para o contêiner geral.
 */
export function PainelRecolhivel({
  aberto,
  padraoAberto = false,
  aoAlterarAberto,
  children,
  estiloPersonalizado,
}) {
  // Controle interno de estado caso o desenvolvedor não passe o valor de fora
  const [estadoAbertoInterno, setEstadoAbertoInterno] = useState(padraoAberto);

  // Define se usa o controle externo ou o controle interno
  const painelEstaAberto = aberto !== undefined ? aberto : estadoAbertoInterno;

  /**
   * Executa a animação e inverte o estado aberto/fechado
   */
  const alternarAbertura = () => {
    // Configura a animação suave de transição de altura
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const novoEstado = !painelEstaAberto;

    // Se o desenvolvedor forneceu uma função de escuta externa, avisa ela
    if (aoAlterarAberto) {
      aoAlterarAberto(novoEstado);
    } else {
      setEstadoAbertoInterno(novoEstado);
    }
  };

  return (
    <ContextoPainelRecolhivel.Provider
      value={{ estaAberto: painelEstaAberto, alternarAbertura }}
    >
      <View style={estiloPersonalizado}>
        {children}
      </View>
    </ContextoPainelRecolhivel.Provider>
  );
}

/**
 * COMPONENTE GATILHO: GatilhoRecolhivel
 * 
 * Função: O elemento clicável (botão, texto ou ícone) que o usuário toca
 * para abrir ou fechar o painel.
 */
export function GatilhoRecolhivel({ children, estiloPersonalizado }) {
  const { alternarAbertura } = useContext(ContextoPainelRecolhivel);

  return (
    <TouchableOpacity
      onPress={alternarAbertura}
      activeOpacity={0.7}
      style={estiloPersonalizado}
    >
      {children}
    </TouchableOpacity>
  );
}

/**
 * COMPONENTE CONTEÚDO: ConteudoRecolhivel
 * 
 * Função: O bloco que só aparece na tela quando o painel estiver aberto.
 */
export function ConteudoRecolhivel({ children, estiloPersonalizado }) {
  const { estaAberto } = useContext(ContextoPainelRecolhivel);

  // Se o painel estiver fechado, não renderiza nada na tela
  if (!estaAberto) return null;

  return (
    <View style={estiloPersonalizado}>
      {children}
    </View>
  );
}

export default PainelRecolhivel;