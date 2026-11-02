/**
 * ============================================================================
 * ARQUIVO: EsqueletoCarregamento.js (Substituto nativo do Skeleton da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Exibir blocos cinzas pulsantes que simulam o formato de textos, botões ou
 * imagens enquanto os dados reais da trilha ou do usuário estão sendo baixados.
 * Melhora a percepção de velocidade do app (evita telas brancas vazias).
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js (trilhoBarraProgresso).
 * Zero estilos inline.
 * 
 * EXEMPLO DE USO NO PROJETO:
 * <EsqueletoCarregamento />
 * ============================================================================
 */

import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { estilos } from './estilos';

/**
 * COMPONENTE: EsqueletoCarregamento
 * 
 * Para que serve:
 * Marcador visual animado que pulsa suavemente no padrão Mercedes F1.
 * 
 * O que faz:
 * Cria um loop infinito de opacidade nativa (de 0.3 a 0.8) a 60 quadros por
 * segundo via hardware nativo (useNativeDriver: true).
 * 
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 * @param {ReactNode} children - Conteúdo interno opcional.
 */
export function EsqueletoCarregamento({ estiloPersonalizado, children, ...outrasPropriedades }) {
  // Valor animado que oscila a transparência do elemento
  const opacidadeAnimada = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Configura o ciclo contínuo de pulso (fade-in e fade-out)
    const animacaoPulso = Animated.loop(
      Animated.sequence([
        Animated.timing(opacidadeAnimada, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true, // Processado diretamente pela placa de vídeo do aparelho
        }),
        Animated.timing(opacidadeAnimada, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animacaoPulso.start();

    // Limpeza de memória: encerra o loop caso o componente seja desmontado
    return () => animacaoPulso.stop();
  }, [opacidadeAnimada]);

  return (
    <Animated.View
      style={[
        estilos.trilhoBarraProgresso,
        { opacity: opacidadeAnimada }, // Aplica a opacidade gerenciada pelo driver nativo
        estiloPersonalizado,
      ]}
      accessibilityRole="none"
      accessible={false}
      {...outrasPropriedades}
    >
      {children}
    </Animated.View>
  );
}

export default EsqueletoCarregamento;