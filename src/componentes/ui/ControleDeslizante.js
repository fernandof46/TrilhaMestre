/**
 * ============================================================================
 * ARQUIVO: ControleDeslizante.js (Substituto nativo do Slider da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Fornecer uma régua deslizante contínua para escolha de valores numéricos
 * (por exemplo: definir horas de estudo por semana: de 2h a 40h, ritmo
 * de aprendizado ou volume).
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js (trilhoBarraProgresso,
 * preenchimentoBarraProgresso, caixaSelecaoBase e calendarioDiaSelecionado).
 * Zero estilos inline.
 * 
 * EXEMPLO DE USO NO PROJETO:
 * <ControleDeslizante
 *    valor={horasSemanais}
 *    aoMudarValor={setHorasSemanais}
 *    minimo={1}
 *    maximo={40}
 * />
 * ============================================================================
 */

import React, { useState } from 'react';
import { View, PanResponder } from 'react-native';
import { estilos } from './estilos';

/**
 * COMPONENTE: ControleDeslizante
 * 
 * Para que serve:
 * Permitir ao usuário escolher um número arrastando o indicador com o dedo.
 * 
 * O que faz:
 * Mede a largura real do trilho na tela do celular e mapeia as coordenadas X
 * do toque do usuário para a escala numérica entre o mínimo e o máximo.
 * 
 * @param {number} valor - Valor numérico selecionado atualmente.
 * @param {function} aoMudarValor - Notifica o novo número à tela mãe: (novoValor) => {}
 * @param {number} minimo - Menor valor possível na escala (padrão: 0).
 * @param {number} maximo - Maior valor possível na escala (padrão: 100).
 * @param {number} passo - Intervalo de incremento (padrão: 1).
 * @param {boolean} desabilitado - Se verdadeiro, bloqueia o arrasto.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function ControleDeslizante({
  valor = 0,
  aoMudarValor,
  minimo = 0,
  maximo = 100,
  passo = 1,
  desabilitado = false,
  estiloPersonalizado,
  ...outrasPropriedades
}) {
  const [larguraTrilho, setLarguraTrilho] = useState(1);

  /**
   * Função: calcularValorPelaPosicao
   * Para que serve: Converter a posição em pixels do dedo do usuário no número da escala.
   * O que faz: Normaliza a coordenada X, aplica o intervalo de passo e respeita os limites.
   */
  const calcularValorPelaPosicao = (posicaoX) => {
    if (desabilitado || larguraTrilho <= 0) return;

    // Converte a posição do toque em uma fração percentual (0 a 1)
    const porcentagemBruta = Math.max(0, Math.min(1, posicaoX / larguraTrilho));
    const alcanceTotal = maximo - minimo;
    const valorNaoArredondado = minimo + porcentagemBruta * alcanceTotal;

    // Aplica o arredondamento conforme o passo especificado (ex: de 1 em 1, ou de 5 em 5)
    const valorComPasso = Math.round(valorNaoArredondado / passo) * passo;
    const valorFinal = Math.max(minimo, Math.min(maximo, valorComPasso));

    if (aoMudarValor) {
      aoMudarValor(valorFinal);
    }
  };

  // Gerenciador de gestos nativo de toque e arrasto do celular
  const gerenciadorToque = PanResponder.create({
    onStartShouldSetPanResponder: () => !desabilitado,
    onMoveShouldSetPanResponder: () => !desabilitado,
    onPanResponderGrant: (evento) => {
      calcularValorPelaPosicao(evento.nativeEvent.locationX);
    },
    onPanResponderMove: (evento) => {
      calcularValorPelaPosicao(evento.nativeEvent.locationX);
    },
  });

  // Cálculo da porcentagem atual para desenhar a barra e posicionar o botão circular
  const divisorValido = maximo > minimo ? maximo - minimo : 1;
  const porcentagemAtual = Math.max(0, Math.min(100, ((valor - minimo) / divisorValido) * 100));

  return (
    <View
      style={[
        estilos.areaBarraTelemetria,
        desabilitado && estilos.botaoDesabilitado,
        estiloPersonalizado,
      ]}
      onLayout={(evento) => {
        // Captura a largura exata do componente renderizado na tela do celular
        const largura = evento.nativeEvent.layout.width;
        if (largura > 0) setLarguraTrilho(largura);
      }}
      accessibilityRole="adjustable"
      accessibilityValue={{ min: minimo, max: maximo, now: valor }}
      {...gerenciadorToque.panHandlers}
      {...outrasPropriedades}
    >
      {/* TRILHO DE FUNDO (Cinza carbono) */}
      <View style={estilos.trilhoBarraProgresso}>
        {/* PREENCHIMENTO ATIVO (Verde Petronas) */}
        <View
          style={[
            estilos.preenchimentoBarraProgresso,
            { width: `${porcentagemAtual}%` },
          ]}
        />
      </View>

      {/* BOTÃO CIRCULAR ARRASTÁVEL (THUMB): Combina caixaSelecaoBase com calendarioDiaSelecionado */}
      <View
        style={[
          estilos.caixaSelecaoBase,
          estilos.calendarioDiaSelecionado,
          {
            position: 'absolute',
            left: `${porcentagemAtual}%`,
            marginLeft: -11, // Centraliza perfeitamente o círculo de 22px sobre a linha
            top: -8,
          },
        ]}
      />
    </View>
  );
}

export default ControleDeslizante;