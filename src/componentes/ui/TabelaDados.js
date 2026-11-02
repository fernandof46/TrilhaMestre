/**
 * ============================================================================
 * ARQUIVO: TabelaDeDados.js (Substituto nativo do Table da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Exibir dados tabulares organizados em colunas e linhas (por exemplo: grade de
 * horários de estudo, comparativo de ferramentas de IA ou relatórios de pontuação).
 * 
 * ADAPTAÇÃO MOBILE:
 * Substitui as tabelas HTML rígidas por linhas flexíveis com rolagem horizontal
 * automática, evitando que colunas fiquem espremidas em telas pequenas.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js (cartaoGenerico, itemSanfona,
 * grupoEscolhaRotulo, textoDescricao, cartaoDescricao). Zero estilos inline.
 * 
 * ARQUITETURA EM BLOCOS (Composição React):
 * <TabelaDeDados>
 *    <CabecalhoTabela>
 *       <LinhaTabela>
 *          <CelulaCabecalhoTabela>Módulo</CelulaCabecalhoTabela>
 *          <CelulaCabecalhoTabela>Horas</CelulaCabecalhoTabela>
 *       </LinhaTabela>
 *    </CabecalhoTabela>
 *    <CorpoTabela>
 *       <LinhaTabela>
 *          <CelulaTabela>Fundamentos</CelulaTabela>
 *          <CelulaTabela>12 h</CelulaTabela>
 *       </LinhaTabela>
 *    </CorpoTabela>
 * </TabelaDeDados>
 * ============================================================================
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { estilos } from './estilos';

/**
 * COMPONENTE RAIZ: TabelaDeDados
 * 
 * Para que serve:
 * Envolve a tabela em um cartão escuro (cartaoGenerico) com suporte à rolagem horizontal.
 * 
 * @param {ReactNode} children - Cabeçalho, Corpo e Linhas da tabela.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function TabelaDeDados({ children, estiloPersonalizado }) {
  return (
    <View style={[estilos.cartaoGenerico, estiloPersonalizado]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={estilos.containerPrincipal}>
          {children}
        </View>
      </ScrollView>
    </View>
  );
}

/**
 * CABEÇALHO DA TABELA: CabecalhoTabela
 * 
 * Para que serve:
 * Envolve a linha que contém os títulos das colunas.
 */
export function CabecalhoTabela({ children, estiloPersonalizado }) {
  return (
    <View style={[estilos.itemSanfona, estiloPersonalizado]}>
      {children}
    </View>
  );
}

/**
 * CORPO DA TABELA: CorpoTabela
 * 
 * Para que serve:
 * Contêiner que abriga todas as linhas de registros de dados.
 */
export function CorpoTabela({ children, estiloPersonalizado }) {
  return (
    <View style={estiloPersonalizado}>
      {children}
    </View>
  );
}

/**
 * RODAPÉ DA TABELA: RodapeTabela
 * 
 * Para que serve:
 * Linha final com borda superior para totais ou somatórios.
 */
export function RodapeTabela({ children, estiloPersonalizado }) {
  return (
    <View style={[estilos.itemSanfona, estiloPersonalizado]}>
      {children}
    </View>
  );
}

/**
 * LINHA DA TABELA: LinhaTabela
 * 
 * Para que serve:
 * Uma linha horizontal contendo as células de dados.
 */
export function LinhaTabela({ children, estiloPersonalizado }) {
  return (
    <View style={[estilos.gatilhoSanfona, estiloPersonalizado]}>
      {children}
    </View>
  );
}

/**
 * CÉLULA DE CABEÇALHO: CelulaCabecalhoTabela
 * 
 * Para que serve:
 * Exibe o título de uma coluna em caixa alta e tom discreto (grupoEscolhaRotulo).
 */
export function CelulaCabecalhoTabela({ children, estiloPersonalizado }) {
  return (
    <View style={[estilos.areaInformacoesEtapa, estiloPersonalizado]}>
      {typeof children === 'string' ? (
        <Text style={estilos.grupoEscolhaRotulo}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

/**
 * CÉLULA DE DADOS: CelulaTabela
 * 
 * Para que serve:
 * Exibe o valor de uma coluna em uma linha comum de dados.
 */
export function CelulaTabela({ children, estiloPersonalizado }) {
  return (
    <View style={[estilos.areaInformacoesEtapa, estiloPersonalizado]}>
      {typeof children === 'string' ? (
        <Text style={estilos.textoDescricao}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

/**
 * LEGENDA DA TABELA: LegendaTabela
 * 
 * Para que serve:
 * Texto descritivo ou nota de rodapé explicativa sobre a tabela.
 */
export function LegendaTabela({ children, estiloPersonalizado }) {
  return (
    <View style={estilos.cartaoCabecalho}>
      <Text style={[estilos.cartaoDescricao, estiloPersonalizado]}>
        {children}
      </Text>
    </View>
  );
}

// Aliases em inglês para manter 100% de paridade com imports legados
export const Table = TabelaDeDados;
export const TableHeader = CabecalhoTabela;
export const TableBody = CorpoTabela;
export const TableFooter = RodapeTabela;
export const TableRow = LinhaTabela;
export const TableHead = CelulaCabecalhoTabela;
export const TableCell = CelulaTabela;
export const TableCaption = LegendaTabela;

export default TabelaDeDados;