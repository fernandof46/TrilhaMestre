/**
 * ============================================================================
 * MÓDULO: Cartao.js (Substituto nativo do Card do ecossistema shadcn/ui)
 * 
 * FINALIDADE:
 * Fornecer uma estrutura modular e elegante de "Cartão" (Card) para agrupar
 * informações na tela (como módulos de estudos, formulários ou estatísticas).
 * 
 * ARQUITETURA EM BLOCOS (Composição React):
 * <Cartao>                     -> Caixa externa que envolve todo o conteúdo
 *    <CartaoCabecalho>         -> Bloco superior (título + subtítulo)
 *       <CartaoTitulo />       -> Texto principal com ênfase visual
 *       <CartaoDescricao />    -> Texto explicativo auxiliar
 *    </CartaoCabecalho>
 *    <CartaoConteudo>          -> Área livre para o conteúdo central
 *    </CartaoConteudo>
 *    <CartaoRodape>            -> Área inferior alinhada para botões de ação
 *    </CartaoRodape>
 * </Cartao>
 * ============================================================================
 */

import React from 'react';
import { View, Text } from 'react-native';
import { estilos } from './estilos';

/**
 * COMPONENTE RAIZ: Cartao (Card)
 * 
 * @param {ReactNode} children - Todos os elementos internos do cartão
 * @param {object} style - Estilizações opcionais adicionais passadas pelo componente pai
 */
export function Cartao({ children, style, ...props }) {
  return (
    <View style={[estilos.cartaoGenerico, style]} {...props}>
      {children}
    </View>
  );
}

/**
 * CABEÇALHO DO CARTÃO: CartaoCabecalho (CardHeader)
 * 
 * Função: Empilhar verticalmente o Título e a Descrição com espaçamentos adequados.
 */
export function CartaoCabecalho({ children, style, ...props }) {
  return (
    <View style={[estilos.cartaoCabecalho, style]} {...props}>
      {children}
    </View>
  );
}

/**
 * TÍTULO DO CARTÃO: CartaoTitulo (CardTitle)
 * 
 * Função: Exibir o cabeçalho em negrito. Se receber texto puro, envolve
 * automaticamente em uma tag <Text> nativa para evitar falhas de compilação.
 */
export function CartaoTitulo({ children, style, ...props }) {
  return typeof children === 'string' ? (
    <Text style={[estilos.cartaoTitulo, style]} {...props}>
      {children}
    </Text>
  ) : (
    <View style={style} {...props}>{children}</View>
  );
}

/**
 * DESCRIÇÃO DO CARTÃO: CartaoDescricao (CardDescription)
 * 
 * Função: Subtítulo em tom atenuado que contextualiza o propósito do cartão.
 */
export function CartaoDescricao({ children, style, ...props }) {
  return typeof children === 'string' ? (
    <Text style={[estilos.cartaoDescricao, style]} {...props}>
      {children}
    </Text>
  ) : (
    <View style={style} {...props}>{children}</View>
  );
}

/**
 * CORPO DO CARTÃO: CartaoConteudo (CardContent)
 * 
 * Função: Espaço intermediário livre para renderizar listas, campos de entrada ou textos.
 */
export function CartaoConteudo({ children, style, ...props }) {
  return (
    <View style={[estilos.cartaoConteudo, style]} {...props}>
      {children}
    </View>
  );
}

/**
 * RODAPÉ DO CARTÃO: CartaoRodape (CardFooter)
 * 
 * Função: Área horizontal flexível projetada especificamente para abrigar botões de ação.
 */
export function CartaoRodape({ children, style, ...props }) {
  return (
    <View style={[estilos.cartaoRodape, style]} {...props}>
      {children}
    </View>
  );
}

// ============================================================================
// ALIASES EM INGLÊS (Mapeamento de retrocompatibilidade)
// Garante que qualquer código original da Web que faça import de { Card, CardHeader... }
// continue funcionando 100% sem necessidade de reescrever telas inteiras.
// ============================================================================
export const Card = Cartao;
export const CardHeader = CartaoCabecalho;
export const CardTitle = CartaoTitulo;
export const CardDescription = CartaoDescricao;
export const CardContent = CartaoConteudo;
export const CardFooter = CartaoRodape;

export default Cartao;