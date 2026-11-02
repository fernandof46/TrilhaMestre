/**
 * ============================================================================
 * ARQUIVO: Paginacao.js (Substituto nativo do Pagination da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Fornecer controles visuais de paginação (Anterior, Próximo, números de página
 * e reticências) para dividir listas longas de trilhas, materiais e históricos
 * em páginas menores, mantendo o consumo de memória baixo e a rolagem leve.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js. Zero estilos inline.
 * 
 * ARQUITETURA EM BLOCOS (Composição React):
 * <Paginacao>
 *    <ConteudoPaginacao>
 *       <PaginacaoAnterior aoPressionar={...} desabilitado={paginaAtual === 1} />
 *       <LinkPaginacao estaAtivo={true}>1</LinkPaginacao>
 *       <LinkPaginacao>2</LinkPaginacao>
 *       <ReticenciasPaginacao />
 *       <PaginacaoProximo aoPressionar={...} />
 *    </ConteudoPaginacao>
 * </Paginacao>
 * ============================================================================
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * COMPONENTE RAIZ: Paginacao
 * 
 * Para que serve:
 * Envolve a estrutura de paginação garantindo alinhamento centralizado na tela.
 * 
 * @param {ReactNode} children - ConteudoPaginacao e seus botões.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function Paginacao({ children, estiloPersonalizado }) {
  return (
    <View style={[estilos.areaTitulo, estiloPersonalizado]}>
      {children}
    </View>
  );
}

/**
 * CONTEÚDO DA PAGINAÇÃO: ConteudoPaginacao
 * 
 * Para que serve:
 * Linha horizontal flexível com espaçamento padronizado entre os botões.
 */
export function ConteudoPaginacao({ children }) {
  return (
    <View style={estilos.barraMenusContainer}>
      {children}
    </View>
  );
}

/**
 * ITEM DE PAGINAÇÃO: ItemPaginacao
 * 
 * Para que serve:
 * Envoltório semântico para cada botão individual da lista de páginas.
 */
export function ItemPaginacao({ children }) {
  return <View>{children}</View>;
}

/**
 * NÚMERO DA PÁGINA: LinkPaginacao
 * 
 * Para que serve:
 * Botão com o número da página (ex: "1", "2", "3").
 * Quando a página está ativa, destaca o fundo e a borda em Verde Petronas.
 * 
 * @param {boolean} estaAtivo - Define se esta é a página exibida no momento.
 * @param {function} aoPressionar - Notifica a troca de página ao ser clicado.
 * @param {boolean} desabilitado - Impede o clique no botão.
 */
export function LinkPaginacao({
  children,
  estaAtivo = false,
  aoPressionar,
  desabilitado = false,
}) {
  return (
    <TouchableOpacity
      onPress={aoPressionar}
      disabled={desabilitado}
      activeOpacity={0.7}
      style={[
        estaAtivo
          ? estilos.barraMenusBotaoAtivo
          : estilos.barraMenusBotaoInativo,
        desabilitado && estilos.botaoDesabilitado,
      ]}
    >
      <Text
        style={
          estaAtivo
            ? estilos.barraMenusTextoAtivo
            : estilos.barraMenusTextoInativo
        }
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * BOTÃO ANTERIOR: PaginacaoAnterior
 * 
 * Para que serve:
 * Botão com ícone de seta para a esquerda e texto "Anterior".
 * 
 * @param {function} aoPressionar - Função que recua uma página.
 * @param {boolean} desabilitado - Desativa o botão caso já esteja na 1ª página.
 */
export function PaginacaoAnterior({ aoPressionar, desabilitado = false }) {
  return (
    <TouchableOpacity
      onPress={aoPressionar}
      disabled={desabilitado}
      activeOpacity={0.7}
      style={[
        estilos.barraMenusBotaoInativo,
        desabilitado && estilos.botaoDesabilitado,
      ]}
    >
      <View style={estilos.trilhaNavegacaoItem}>
        <Feather name="chevron-left" size={14} color={cores.descricao} />
        <Text style={estilos.barraMenusTextoInativo}>Anterior</Text>
      </View>
    </TouchableOpacity>
  );
}

/**
 * BOTÃO PRÓXIMO: PaginacaoProximo
 * 
 * Para que serve:
 * Botão com texto "Próximo" e ícone de seta para a direita.
 * 
 * @param {function} aoPressionar - Função que avança uma página.
 * @param {boolean} desabilitado - Desativa o botão caso esteja na última página.
 */
export function PaginacaoProximo({ aoPressionar, desabilitado = false }) {
  return (
    <TouchableOpacity
      onPress={aoPressionar}
      disabled={desabilitado}
      activeOpacity={0.7}
      style={[
        estilos.barraMenusBotaoInativo,
        desabilitado && estilos.botaoDesabilitado,
      ]}
    >
      <View style={estilos.trilhaNavegacaoItem}>
        <Text style={estilos.barraMenusTextoInativo}>Próximo</Text>
        <Feather name="chevron-right" size={14} color={cores.descricao} />
      </View>
    </TouchableOpacity>
  );
}

/**
 * RETICÊNCIAS: ReticenciasPaginacao
 * 
 * Para que serve:
 * Exibe três pontinhos (...) indicando salto de páginas intermediárias.
 */
export function ReticenciasPaginacao() {
  return (
    <View style={estilos.trilhaNavegacaoItem}>
      <Feather name="more-horizontal" size={16} color={cores.descricao} />
    </View>
  );
}

export default Paginacao;