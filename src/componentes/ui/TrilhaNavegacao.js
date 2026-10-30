import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * COMPONENTE RAIZ: TrilhaNavegacao (Breadcrumb)
 */
export function TrilhaNavegacao({ children, style, ...props }) {
  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
}

/**
 * LISTA DA TRILHA: ListaTrilhaNavegacao (BreadcrumbList)
 */
export function ListaTrilhaNavegacao({ children, style, ...props }) {
  return (
    <View style={[estilos.trilhaNavegacaoLista, style]} {...props}>
      {children}
    </View>
  );
}

/**
 * ITEM INDIVIDUAL: ItemTrilhaNavegacao (BreadcrumbItem)
 */
export function ItemTrilhaNavegacao({ children, style, ...props }) {
  return (
    <View style={[estilos.trilhaNavegacaoItem, style]} {...props}>
      {children}
    </View>
  );
}

/**
 * LINK CLICÁVEL: LinkTrilhaNavegacao (BreadcrumbLink)
 */
export function LinkTrilhaNavegacao({ children, onPress, style, textStyle, ...props }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={style} {...props}>
      {typeof children === 'string' ? (
        <Text style={[estilos.trilhaNavegacaoTexto, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

/**
 * PÁGINA ATUAL / FINAL: PaginaTrilhaNavegacao (BreadcrumbPage)
 */
export function PaginaTrilhaNavegacao({ children, style, ...props }) {
  return (
    <Text style={[estilos.trilhaNavegacaoTextoAtivo, style]} {...props}>
      {children}
    </Text>
  );
}

/**
 * SEPARADOR: SeparadorTrilhaNavegacao (BreadcrumbSeparator)
 */
export function SeparadorTrilhaNavegacao({ children, style, ...props }) {
  return (
    <View style={style} {...props}>
      {children || <Feather name="chevron-right" size={12} color={cores.descricao} />}
    </View>
  );
}

/**
 * RETICÊNCIAS: ReticenciasTrilhaNavegacao (BreadcrumbEllipsis)
 */
export function ReticenciasTrilhaNavegacao({ style, ...props }) {
  return (
    <View style={[{ paddingHorizontal: 4 }, style]} {...props}>
      <Feather name="more-horizontal" size={14} color={cores.descricao} />
    </View>
  );
}

// Aliases em inglês para manter 100% de compatibilidade
export const Breadcrumb = TrilhaNavegacao;
export const BreadcrumbList = ListaTrilhaNavegacao;
export const BreadcrumbItem = ItemTrilhaNavegacao;
export const BreadcrumbLink = LinkTrilhaNavegacao;
export const BreadcrumbPage = PaginaTrilhaNavegacao;
export const BreadcrumbSeparator = SeparadorTrilhaNavegacao;
export const BreadcrumbEllipsis = ReticenciasTrilhaNavegacao;