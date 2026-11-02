/**
 * ============================================================================
 * ARQUIVO: PainelDeAbas.js (Substituto nativo do Tabs do Radix/shadcn)
 * 
 * FINALIDADE DO ARQUIVO:
 * Fornecer um seletor horizontal de abas para alternar a visualização de telas
 * ou categorias sem recarregar a página (por exemplo: alternar entre "Resumo",
 * "Módulos de Aula" e "Exercícios do Quiz").
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js (areaSeletorStatus,
 * pilulaStatusItem, pilulaStatusItemAtiva, textoPilulaStatus e cartaoConteudo).
 * Zero estilos inline.
 * 
 * ARQUITETURA EM BLOCOS (Composição React):
 * <PainelDeAbas padraoValor="resumo">
 *    <ListaDeAbas>
 *       <GatilhoAba valor="resumo">Resumo</GatilhoAba>
 *       <GatilhoAba valor="aulas">Aulas</GatilhoAba>
 *    </ListaDeAbas>
 *    <ConteudoAba valor="resumo">
 *       {...Conteúdo do resumo...}
 *    </ConteudoAba>
 *    <ConteudoAba valor="aulas">
 *       {...Conteúdo das aulas...}
 *    </ConteudoAba>
 * </PainelDeAbas>
 * ============================================================================
 */

import React, { createContext, useContext, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { estilos } from './estilos';

/**
 * CONTEXTO DE ABAS: ContextoPainelDeAbas
 * 
 * Para que serve:
 * Compartilha qual aba está ativa no momento entre os botões da lista e as seções de conteúdo.
 */
const ContextoPainelDeAbas = createContext({
  abaAtiva: '',
  selecionarAba: () => {},
});

/**
 * COMPONENTE RAIZ: PainelDeAbas
 * 
 * Para que serve:
 * Provedor do estado que gerencia qual aba está selecionada.
 * 
 * @param {string} valor - Valor da aba ativa controlado externamente (opcional).
 * @param {string} padraoValor - Aba inicial padrão caso não haja controle externo.
 * @param {function} aoMudarValor - Notifica o componente pai sobre a troca de aba: (novaAba) => {}
 * @param {ReactNode} children - ListaDeAbas e ConteudoAba.
 */
export function PainelDeAbas({
  valor,
  padraoValor = '',
  aoMudarValor,
  children,
  estiloPersonalizado,
}) {
  const [abaInterna, setAbaInterna] = useState(padraoValor);

  const abaAtiva = valor !== undefined ? valor : abaInterna;

  /**
   * Função: selecionarAba
   * O que faz: Atualiza o estado da aba ativa e notifica a tela mãe.
   */
  const selecionarAba = (novaAba) => {
    if (aoMudarValor) {
      aoMudarValor(novaAba);
    } else {
      setAbaInterna(novaAba);
    }
  };

  return (
    <ContextoPainelDeAbas.Provider value={{ abaAtiva, selecionarAba }}>
      <View style={estiloPersonalizado}>
        {children}
      </View>
    </ContextoPainelDeAbas.Provider>
  );
}

/**
 * LISTA DE ABAS: ListaDeAbas
 * 
 * Para que serve:
 * Barra horizontal que envolve os botões de seleção no padrão de cápsula F1.
 */
export function ListaDeAbas({ children, estiloPersonalizado }) {
  return (
    <View style={[estilos.areaSeletorStatus, estiloPersonalizado]}>
      {children}
    </View>
  );
}

/**
 * BOTÃO DE CADA ABA: GatilhoAba
 * 
 * Para que serve:
 * Cada botão em formato de pílula que o usuário toca para trocar de aba.
 * 
 * @param {string} valor - Identificador único associado a esta aba (ex: "resumo").
 */
export function GatilhoAba({ valor, children, estiloPersonalizado }) {
  const { abaAtiva, selecionarAba } = useContext(ContextoPainelDeAbas);
  const estaAtiva = abaAtiva === valor;

  return (
    <TouchableOpacity
      onPress={() => selecionarAba(valor)}
      activeOpacity={0.7}
      style={[
        estilos.pilulaStatusItem,
        estaAtiva && estilos.pilulaStatusItemAtiva,
        estiloPersonalizado,
      ]}
    >
      {typeof children === 'string' ? (
        <Text
          style={[
            estilos.textoPilulaStatus,
            estaAtiva && estilos.textoPilulaStatusAtiva,
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

/**
 * CONTEÚDO DA ABA: ConteudoAba
 * 
 * Para que serve:
 * Bloco de conteúdo que só é renderizado quando sua respectiva aba for selecionada.
 * 
 * @param {string} valor - Identificador da aba à qual este conteúdo pertence.
 */
export function ConteudoAba({ valor, children, estiloPersonalizado }) {
  const { abaAtiva } = useContext(ContextoPainelDeAbas);

  // Oculta completamente o conteúdo caso esta aba não seja a ativa
  if (abaAtiva !== valor) return null;

  return (
    <View style={[estilos.cartaoConteudo, estiloPersonalizado]}>
      {children}
    </View>
  );
}

// Aliases em inglês para manter 100% de compatibilidade com imports legados
export const Tabs = PainelDeAbas;
export const TabsList = ListaDeAbas;
export const TabsTrigger = GatilhoAba;
export const TabsContent = ConteudoAba;

export default PainelDeAbas;