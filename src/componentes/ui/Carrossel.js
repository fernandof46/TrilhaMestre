/**
 * ============================================================================
 * MÓDULO: Carrossel.js (Substituto nativo do Carousel do shadcn / Embla Carousel)
 * 
 * FINALIDADE:
 * Permitir a navegação entre múltiplos cartões ou etapas através de gestos de
 * arrasto horizontal (Swipe) no celular ou via botões de Avançar/Retroceder.
 * 
 * ARQUITETURA EM BLOCOS (Composição React):
 * <Carrossel>                   -> Gerencia o índice atual e o controlador de rolagem
 *    <CarrosselConteudo>        -> Trilho deslizante horizontal nativo (ScrollView)
 *       <CarrosselItem>...</CarrosselItem> -> Cada slide individual
 *       <CarrosselItem>...</CarrosselItem>
 *    </CarrosselConteudo>
 *    <CarrosselAnterior />      -> Botão que recua 1 slide
 *    <CarrosselProximo />       -> Botão que avança 1 slide
 * </Carrossel>
 * ============================================================================
 */

import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

// Contexto para sincronizar os botões com o estado da rolagem
const ContextoCarrossel = createContext(null);

/**
 * HOOK DE ACESSO AO CARROSSEL: useCarrossel
 * Permite que subcomponentes verifiquem se podem avançar ou retroceder.
 */
export function useCarrossel() {
  const contexto = useContext(ContextoCarrossel);
  if (!contexto) {
    throw new Error('useCarrossel precisa ser utilizado dentro de um <Carrossel />');
  }
  return contexto;
}

/**
 * COMPONENTE RAIZ: Carrossel (Carousel)
 * 
 * @param {string} orientation - 'horizontal' (padrão) ou 'vertical'
 * @param {function} setApi - Callback opcional para expor métodos de controle externo
 */
export function Carrossel({
  children,
  orientation = 'horizontal',
  setApi,
  style,
  ...props
}) {
  const scrollRef = useRef(null);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [totalItens, setTotalItens] = useState(0);
  const [larguraContainer, setLarguraContainer] = useState(
    Dimensions.get('window').width - 32 // Fallback inicial seguro
  );

  // Avança para o próximo slide
  const rolarProximo = useCallback(() => {
    if (indiceAtual < totalItens - 1) {
      const proximoIndice = indiceAtual + 1;
      scrollRef.current?.scrollTo({
        x: proximoIndice * larguraContainer,
        animated: true,
      });
      setIndiceAtual(proximoIndice);
    }
  }, [indiceAtual, totalItens, larguraContainer]);

  // Retorna para o slide anterior
  const rolarAnterior = useCallback(() => {
    if (indiceAtual > 0) {
      const indiceAnterior = indiceAtual - 1;
      scrollRef.current?.scrollTo({
        x: indiceAnterior * larguraContainer,
        animated: true,
      });
      setIndiceAtual(indiceAnterior);
    }
  }, [indiceAtual, larguraContainer]);

  const podeRolarAnterior = indiceAtual > 0;
  const podeRolarProximo = indiceAtual < totalItens - 1;

  // Atualiza a API externa caso tenha sido passada via prop
  React.useEffect(() => {
    if (setApi) {
      setApi({
        rolarProximo,
        rolarAnterior,
        indiceAtual,
        totalItens,
      });
    }
  }, [setApi, rolarProximo, rolarAnterior, indiceAtual, totalItens]);

  return (
    <ContextoCarrossel.Provider
      value={{
        scrollRef,
        indiceAtual,
        setIndiceAtual,
        totalItens,
        setTotalItens,
        larguraContainer,
        setLarguraContainer,
        rolarProximo,
        rolarAnterior,
        podeRolarAnterior,
        podeRolarProximo,
        orientation,
      }}
    >
      <View
        style={[estilos.carrosselContainer, style]}
        onLayout={(evento) => {
          // Medição dinâmica da largura real do aparelho
          const { width } = evento.nativeEvent.layout;
          if (width > 0) setLarguraContainer(width);
        }}
        {...props}
      >
        {children}
      </View>
    </ContextoCarrossel.Provider>
  );
}

/**
 * TRILHO DE CONTEÚDO: CarrosselConteudo (CarouselContent)
 * 
 * Função: ScrollView nativo otimizado para responder a gestos de "arrastar e soltar"
 * com parada magnética automática em cada slide (pagingEnabled).
 */
export function CarrosselConteudo({ children, style, ...props }) {
  const {
    scrollRef,
    setIndiceAtual,
    setTotalItens,
    larguraContainer,
    orientation,
  } = useCarrossel();

  // Conta quantos slides existem dentro do carrossel
  const quantidadeFilhos = React.Children.count(children);
  React.useEffect(() => {
    setTotalItens(quantidadeFilhos);
  }, [quantidadeFilhos, setTotalItens]);

  // Detecta quando o usuário terminou de arrastar o slide com o dedo
  const aoFinalizarRolagem = (evento) => {
    const deslocamentoX = evento.nativeEvent.contentOffset.x;
    const novoIndice = Math.round(deslocamentoX / larguraContainer);
    setIndiceAtual(novoIndice);
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal={orientation === 'horizontal'}
      pagingEnabled={true} // Força a tela a "travar" exatamente em um slide por vez
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      onMomentumScrollEnd={aoFinalizarRolagem}
      decelerationRate="fast"
      style={style}
      {...props}
    >
      {children}
    </ScrollView>
  );
}

/**
 * SLIDE INDIVIDUAL: CarrosselItem (CarouselItem)
 * 
 * Função: Ocupa 100% da largura visível do carrossel para garantir alinhamento perfeito.
 */
export function CarrosselItem({ children, style, ...props }) {
  const { larguraContainer } = useCarrossel();

  return (
    <View
      style={[
        {
          width: larguraContainer, // Encaixe cirúrgico na tela
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

/**
 * BOTÃO ANTERIOR: CarrosselAnterior (CarouselPrevious)
 */
export function CarrosselAnterior({ style, ...props }) {
  const { rolarAnterior, podeRolarAnterior } = useCarrossel();

  if (!podeRolarAnterior) return null; // Oculta o botão se estiver no primeiro slide

  return (
    <TouchableOpacity
      style={[
        estilos.carrosselBotaoNavegacao,
        { left: 8 },
        style,
      ]}
      onPress={rolarAnterior}
      activeOpacity={0.8}
      {...props}
    >
      <Feather name="arrow-left" size={16} color={cores.confirmar} />
    </TouchableOpacity>
  );
}

/**
 * BOTÃO PRÓXIMO: CarrosselProximo (CarouselNext)
 */
export function CarrosselProximo({ style, ...props }) {
  const { rolarProximo, podeRolarProximo } = useCarrossel();

  if (!podeRolarProximo) return null; // Oculta o botão se estiver no último slide

  return (
    <TouchableOpacity
      style={[
        estilos.carrosselBotaoNavegacao,
        { right: 8 },
        style,
      ]}
      onPress={rolarProximo}
      activeOpacity={0.8}
      {...props}
    >
      <Feather name="arrow-right" size={16} color={cores.confirmar} />
    </TouchableOpacity>
  );
}

// ============================================================================
// ALIASES EM INGLÊS (Compatibilidade retroativa com código original da Web)
// =======