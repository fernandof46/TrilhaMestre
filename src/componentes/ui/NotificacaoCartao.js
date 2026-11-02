/**
 * ============================================================================
 * ARQUIVO: NotificacaoCartao.js (Substituto nativo do Toast da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Definir a estrutura visual de cada notificação individual. Este componente
 * é utilizado internamente pelo NotificadorFlutuante para renderizar o 
 * conteúdo, título e ações de cada aviso.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js. Zero estilos inline.
 * 
 * REAPROVEITAMENTO:
 * - Container: utiliza 'menuContextualCartao' (Sombra, bordas e fundo carbono).
 * - Títulos: utiliza 'textoTituloTrilha' (Negrito e cor destaque).
 * - Descrições: utiliza 'cartaoDescricao' (Cinza claro e legível).
 * - Botões de Ação: utiliza 'botaoAcaoPdf' (Estilo outline sutis).
 * ============================================================================
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * COMPONENTE: NotificacaoTitulo
 * 
 * Para que serve:
 * Exibe o título da notificação com a tipografia de destaque Mercedes F1.
 */
export function NotificacaoTitulo({ children, estiloPersonalizado }) {
  return (
    <Text style={[estilos.textoTituloTrilha, estiloPersonalizado]}>
      {children}
    </Text>
  );
}

/**
 * COMPONENTE: NotificacaoDescricao
 * 
 * Para que serve:
 * Exibe a mensagem detalhada do aviso com a cor de suporte (descricao).
 */
export function NotificacaoDescricao({ children, estiloPersonalizado }) {
  return (
    <Text style={[estilos.cartaoDescricao, estiloPersonalizado]}>
      {children}
    </Text>
  );
}

/**
 * COMPONENTE: NotificacaoAcao
 * 
 * Para que serve:
 * Botão de ação rápida dentro da notificação (ex: "Tentar Novamente").
 * 
 * @param {function} aoPressionar - Ação disparada ao tocar no botão.
 */
export function NotificacaoAcao({ children, aoPressionar, estiloPersonalizado }) {
  return (
    <TouchableOpacity
      onPress={aoPressionar}
      activeOpacity={0.7}
      style={[estilos.botaoAcaoPdf, estiloPersonalizado]}
    >
      <Text style={estilos.textoBotaoPdf}>{children}</Text>
    </TouchableOpacity>
  );
}

/**
 * COMPONENTE RAIZ: NotificacaoCartao
 * 
 * Para que serve:
 * Envolve todos os elementos da notificação em um cartão flutuante seguro.
 * 
 * @param {string} variante - 'default' (Títulos branco) ou 'destrutiva' (Vermelho Alerta).
 * @param {ReactNode} children - Título, Descrição e Ações.
 */
export function NotificacaoCartao({ children, variante = 'default', estiloPersonalizado }) {
  // Define se o cartão terá bordas vermelhas em caso de erro crítico
  const estiloVariante = variante === 'destructive' 
    ? { borderColor: cores.cancelar, backgroundColor: 'rgba(217, 83, 79, 0.1)' } 
    : {};

  return (
    <View style={[estilos.menuContextualCartao, estiloVariante, estiloPersonalizado]}>
      {children}
    </View>
  );
}

// Aliases em inglês para manter 100% de compatibilidade com a biblioteca de componentes
export const Toast = NotificacaoCartao;
export const ToastTitle = NotificacaoTitulo;
export const ToastDescription = NotificacaoDescricao;
export const ToastAction = NotificacaoAcao;

export default NotificacaoCartao;