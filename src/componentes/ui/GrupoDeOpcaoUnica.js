/**
 * ============================================================================
 * ARQUIVO: GrupoDeOpcaoUnica.js (Substituto nativo do RadioGroup da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Fornecer um seletor de opção exclusiva (Radio Button) onde o usuário só pode
 * escolher uma única alternativa dentre uma lista (como nível de dificuldade:
 * Iniciante, Intermediário ou Avançado).
 * 
 * DIFERENÇA PARA A CAIXA DE SELEÇÃO (CHECKBOX):
 * - CaixaDeSelecao: Permite marcar e desmarcar múltiplas opções independentes.
 * - GrupoDeOpcaoUnica: Apenas UMA opção pode estar ativa por vez. Ao marcar uma,
 *   a anterior é desmarcada automaticamente.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js. Zero estilos inline.
 * 
 * ARQUITETURA EM BLOCOS (Composição React):
 * <GrupoDeOpcaoUnica valor={nivel} aoMudarValor={setNivel}>
 *    <ItemDeOpcaoUnica valor="iniciante" rotulo="Iniciante" />
 *    <ItemDeOpcaoUnica valor="intermediario" rotulo="Intermediário" />
 *    <ItemDeOpcaoUnica valor="avancado" rotulo="Avançado" />
 * </GrupoDeOpcaoUnica>
 * ============================================================================
 */

import React, { createContext, useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { estilos } from './estilos';

/**
 * CONTEXTO: ContextoOpcaoUnica
 * 
 * Para que serve:
 * Compartilha qual valor está selecionado no momento e a função de atualização
 * com todos os itens filhos do grupo.
 */
const ContextoOpcaoUnica = createContext({
  valorSelecionado: '',
  selecionarOpcao: () => {},
  desabilitadoGeral: false,
});

/**
 * COMPONENTE RAIZ: GrupoDeOpcaoUnica
 * 
 * Para que serve:
 * Provedor do estado do grupo que gerencia qual opção está marcada.
 * 
 * @param {string} valor - Valor da opção atualmente selecionada.
 * @param {function} aoMudarValor - Notifica o componente pai sobre a nova seleção: (novoValor) => {}
 * @param {boolean} desabilitado - Se verdadeiro, bloqueia a seleção de todos os itens do grupo.
 * @param {ReactNode} children - Os itens filhos (ItemDeOpcaoUnica).
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function GrupoDeOpcaoUnica({
  valor,
  aoMudarValor,
  desabilitado = false,
  children,
  estiloPersonalizado,
}) {
  /**
   * Função: selecionarOpcao
   * O que faz: Notifica a tela mãe sobre o novo valor escolhido pelo usuário.
   */
  const selecionarOpcao = (novoValor) => {
    if (!desabilitado && aoMudarValor) {
      aoMudarValor(novoValor);
    }
  };

  return (
    <ContextoOpcaoUnica.Provider
      value={{
        valorSelecionado: valor,
        selecionarOpcao,
        desabilitadoGeral: desabilitado,
      }}
    >
      <View
        style={[
          estilos.grupoEscolhaContainerOpcoes,
          estiloPersonalizado,
        ]}
        accessibilityRole="radiogroup"
      >
        {children}
      </View>
    </ContextoOpcaoUnica.Provider>
  );
}

/**
 * ITEM INDIVIDUAL: ItemDeOpcaoUnica
 * 
 * Para que serve:
 * Cada linha com o círculo de seleção e o texto explicativo da opção.
 * 
 * @param {string} valor - Valor único associado a esta alternativa (ex: "iniciante").
 * @param {string} rotulo - Texto descritivo exibido ao lado do círculo.
 * @param {boolean} desabilitado - Bloqueia o clique neste item específico.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function ItemDeOpcaoUnica({
  valor,
  rotulo,
  desabilitado = false,
  estiloPersonalizado,
}) {
  const { valorSelecionado, selecionarOpcao, desabilitadoGeral } = useContext(ContextoOpcaoUnica);

  const estaSelecionado = valorSelecionado === valor;
  const itemDesabilitado = desabilitado || desabilitadoGeral;

  return (
    <TouchableOpacity
      onPress={() => selecionarOpcao(valor)}
      disabled={itemDesabilitado}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={[
        estilos.caixaSelecaoLinhaComTexto,
        itemDesabilitado && estilos.botaoDesabilitado,
        estiloPersonalizado,
      ]}
      accessibilityRole="radio"
      accessibilityState={{ selected: estaSelecionado, disabled: itemDesabilitado }}
    >
      {/* CÍRCULO EXTERNO: Combina caixaSelecaoBase com calendarioDiaSelecionado para virar um círculo */}
      <View
        style={[
          estilos.caixaSelecaoBase,
          estilos.calendarioDiaSelecionado,
          estaSelecionado
            ? estilos.caixaSelecaoMarcada
            : estilos.caixaSelecaoDesmarcada,
        ]}
      >
        {/* PONTO CENTRAL ATIVO: Exibido em branco apenas quando esta opção estiver marcada */}
        {estaSelecionado ? (
          <View
            style={[
              estilos.graficoLegendaPonto,
              estilos.calendarioDiaSelecionado,
            ]}
          />
        ) : null}
      </View>

      {/* RÓTULO DE TEXTO DA OPÇÃO */}
      {rotulo ? (
        <Text
          style={[
            estilos.grupoEscolhaRotuloOpcao,
            estaSelecionado && estilos.grupoEscolhaTextoAtivo,
          ]}
        >
          {rotulo}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

export default GrupoDeOpcaoUnica;