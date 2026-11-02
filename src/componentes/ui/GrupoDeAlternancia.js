/**
 * ============================================================================
 * ARQUIVO: GrupoDeAlternancia.js (Substituto nativo do ToggleGroup da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Fornecer um conjunto de botões mutually exclusive (onde apenas um pode estar
 * ativo) ou independentes. Ideal para seletores de filtros rápidos, alternância
 * de visualização (Lista/Grade) ou escolha de modo de operação.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js (grupoEscolhaContainerOpcoes,
 * grupoEscolhaBotaoAtivo, grupoEscolhaBotaoInativo e textoTitulo).
 * Zero estilos inline.
 * 
 * ARQUITETURA EM BLOCOS (Composição React):
 * <GrupoDeAlternancia valor={opcaoAtiva} aoMudarValor={setOpcao}>
 *    <ItemAlternancia valor="modo1">Opção 1</ItemAlternancia>
 *    <ItemAlternancia valor="modo2">Opção 2</ItemAlternancia>
 * </GrupoDeAlternancia>
 * ============================================================================
 */

import React, { createContext, useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { estilos } from './estilos';

/**
 * CONTEXTO DE ALTERNÂNCIA: ContextoAlternancia
 * 
 * Para que serve:
 * Distribui a informação de qual item está selecionado no momento e a função
 * para trocar esse valor, eliminando a necessidade de passar props repetitivas.
 */
const ContextoAlternancia = createContext({
  valorAtivo: null,
  mudarValor: () => {},
});

/**
 * COMPONENTE RAIZ: GrupoDeAlternancia
 * 
 * Para que serve:
 * Provedor do estado de seleção. Coordena a alternância entre os botões filhos.
 * 
 * @param {string} valor - Valor do item selecionado no momento.
 * @param {function} aoMudarValor - Notifica a tela mãe sobre a nova seleção: (novoValor) => {}
 * @param {ReactNode} children - Itens de alternância (ItemAlternancia).
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function GrupoDeAlternancia({
  valor,
  aoMudarValor,
  children,
  estiloPersonalizado,
}) {
  /**
   * Função: lidarComTroca
   * O que faz: Executa a mudança de estado disparada pelo botão filho.
   */
  const lidarComTroca = (novoValor) => {
    if (aoMudarValor) {
      aoMudarValor(novoValor);
    }
  };

  return (
    <ContextoAlternancia.Provider value={{ valorAtivo: valor, mudarValor: lidarComTroca }}>
      <View style={[estilos.grupoEscolhaContainerOpcoes, estiloPersonalizado]}>
        {children}
      </View>
    </ContextoAlternancia.Provider>
  );
}

/**
 * ITEM INDIVIDUAL: ItemAlternancia
 * 
 * Para que serve:
 * Cada botão individual do grupo. Altera a cor de fundo para Verde Petronas
 * quando o valor do item coincide com o valor ativo do grupo.
 * 
 * @param {string} valor - Valor identificador único deste botão (ex: 'filtro_abc').
 * @param {ReactNode} children - Texto ou ícone a ser exibido no botão.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function ItemAlternancia({ children, valor, estiloPersonalizado }) {
  const { valorAtivo, mudarValor } = useContext(ContextoAlternancia);
  
  // Verifica se este item é o que está selecionado no momento
  const estaAtivo = valorAtivo === valor;

  return (
    <TouchableOpacity
      onPress={() => mudarValor(valor)}
      activeOpacity={0.7}
      style={[
        // Reutilização de classes: Botão Ativo (Verde) ou Inativo (Carbono)
        estaAtivo ? estilos.grupoEscolhaBotaoAtivo : estilos.grupoEscolhaBotaoInativo,
        estiloPersonalizado,
      ]}
    >
      {typeof children === 'string' ? (
        <Text
          style={[
            estilos.textoTitulo,
            // Ajuste de cor conforme o estado
            estaAtivo ? estilos.grupoEscolhaTextoAtivo : estilos.textoComum,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

// Aliases em inglês para manter 100% de compatibilidade com imports legados
export const ToggleGroup = GrupoDeAlternancia;
export const ToggleGroupItem = ItemAlternancia;

export default GrupoDeAlternancia;