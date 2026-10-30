import React, { createContext, useContext, useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

// Habilita animação de layout nativa no Android para expansão suave
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Contexto para controlar quais itens da sanfona estão abertos
const ContextoSanfona = createContext({
  valorAberto: null,
  aoAlternarItem: () => {},
});

/**
 * COMPONENTE RAIZ: Sanfona (Accordion)
 * 
 * @param {string|Array} valorPadrao - Item ou lista de itens abertos por padrão
 * @param {boolean} permitirMultiplos - Se verdadeiro, permite abrir vários itens ao mesmo tempo
 */
export function Sanfona({
  children,
  valorPadrao = null,
  permitirMultiplos = false,
  estiloCustomizado,
}) {
  const [itensAbertos, setItensAbertos] = useState(
    Array.isArray(valorPadrao) ? valorPadrao : valorPadrao ? [valorPadrao] : []
  );

  const aoAlternarItem = (valor) => {
    // Animação nativa suave ao abrir/fechar
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setItensAbertos((atuais) => {
      const jaAberto = atuais.includes(valor);
      if (permitirMultiplos) {
        return jaAberto ? atuais.filter((v) => v !== valor) : [...atuais, valor];
      }
      return jaAberto ? [] : [valor];
    });
  };

  return (
    <ContextoSanfona.Provider value={{ itensAbertos, aoAlternarItem }}>
      <View style={estiloCustomizado}>{children}</View>
    </ContextoSanfona.Provider>
  );
}

// Contexto individual de cada item
const ContextoItemSanfona = createContext({ valor: '', aberto: false });

/**
 * COMPONENTE ITEM: ItemSanfona (AccordionItem)
 * Caixa que engloba o cabeçalho e o conteúdo de cada seção.
 */
export function ItemSanfona({ children, valor, estiloCustomizado }) {
  const { itensAbertos } = useContext(ContextoSanfona);
  const aberto = itensAbertos.includes(valor);

  return (
    <ContextoItemSanfona.Provider value={{ valor, aberto }}>
      <View style={[estilos.itemSanfona, estiloCustomizado]}>
        {children}
      </View>
    </ContextoItemSanfona.Provider>
  );
}

/**
 * COMPONENTE GATILHO: GatilhoSanfona (AccordionTrigger)
 * Linha clicável que dispara a abertura/fechamento com seta indicadora.
 */
export function GatilhoSanfona({ children, estiloCustomizado }) {
  const { aoAlternarItem } = useContext(ContextoSanfona);
  const { valor, aberto } = useContext(ContextoItemSanfona);

  return (
    <TouchableOpacity
      style={[estilos.gatilhoSanfona, estiloCustomizado]}
      onPress={() => aoAlternarItem(valor)}
      activeOpacity={0.7}
    >
      {/* Se o filho for apenas um texto puro, renderiza dentro de Text com estilo padrão */}
      {typeof children === 'string' ? (
        <Text style={estilos.textoTituloModulo}>{children}</Text>
      ) : (
        children
      )}

      {/* Seta indicadora com rotação */}
      <Feather
        name={aberto ? 'chevron-up' : 'chevron-down'}
        size={16}
        color={cores.descricao}
      />
    </TouchableOpacity>
  );
}

/**
 * COMPONENTE CONTEÚDO: ConteudoSanfona (AccordionContent)
 * Área recolhível que só aparece quando o item está ativo.
 */
export function ConteudoSanfona({ children, estiloCustomizado }) {
  const { aberto } = useContext(ContextoItemSanfona);

  if (!aberto) return null;

  return (
    <View style={[estilos.conteudoSanfona, estiloCustomizado]}>
      {typeof children === 'string' ? (
        <Text style={estilos.textoDescricao}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

// Aliases em inglês para manter total compatibilidade com códigos importados
export const Accordion = Sanfona;
export const AccordionItem = ItemSanfona;
export const AccordionTrigger = GatilhoSanfona;
export const AccordionContent = ConteudoSanfona;