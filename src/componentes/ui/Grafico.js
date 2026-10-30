/**
 * ============================================================================
 * MÓDULO: Grafico.js (Substituto nativo do Chart / Recharts do shadcn)
 * 
 * FINALIDADE:
 * Fornecer um ecossistema seguro de visualização de métricas e gráficos de
 * telemetria para o app sem quebrar o motor JavaScript nativo com injeções
 * de CSS/DOM típicas da Web.
 * 
 * ARQUITETURA EM BLOCOS (Composição React):
 * <ChartContainer config={configuracaoCores}>
 *    {...Componentes do gráfico ou curvas de progresso...}
 *    <ChartLegend content={<ChartLegendContent />} />
 * </ChartContainer>
 * ============================================================================
 */

import React, { createContext, useContext, useId } from 'react';
import { View, Text } from 'react-native';
import { estilos } from './estilos';
import { cores } from './cores';

// Contexto global que compartilha a paleta de cores e rótulos das séries com os filhos
const ContextoGrafico = createContext(null);

/**
 * HOOK DE ACESSO AO GRÁFICO: useChart / useGrafico
 */
export function useChart() {
  const contexto = useContext(ContextoGrafico);
  if (!contexto) {
    throw new Error('useChart precisa ser utilizado dentro de um <ChartContainer />');
  }
  return contexto;
}

/**
 * CONTÊINER RAIZ: ContêinerGrafico (ChartContainer)
 * 
 * Função: Delimita a área do gráfico na proporção 16:9, distribui a configuração
 * das métricas e renderiza os filhos com segurança no mobile.
 * 
 * @param {object} config - Mapa de cores e títulos (ex: { horas: { label: 'Horas', color: '#00A19C' } })
 */
export function ChartContainer({
  id,
  config = {},
  style,
  children,
  ...props
}) {
  const idUnico = useId();
  const idGrafico = `grafico-${id || idUnico.replace(/:/g, '')}`;

  return (
    <ContextoGrafico.Provider value={{ config, idGrafico }}>
      <View style={[estilos.graficoContainer, style]} {...props}>
        {children}
      </View>
    </ContextoGrafico.Provider>
  );
}

/**
 * ESTILO DO GRÁFICO: ChartStyle
 * 
 * Na Web, este componente injetava CSS puro em uma tag <style>.
 * No React Native isso não existe nem é necessário: retornamos nulo com segurança.
 */
export function ChartStyle() {
  return null;
}

/**
 * TOOLTIP DO GRÁFICO: ChartTooltip
 * 
 * Componente pass-through para manter a sintaxe declarativa sem quebrar no mobile.
 */
export function ChartTooltip({ children }) {
  return <>{children}</>;
}

/**
 * CONTEÚDO DO TOOLTIP: ChartTooltipContent
 * 
 * Exibe o cartão flutuante com os dados da série no ponto tocado.
 */
export function ChartTooltipContent({
  active,
  payload,
  label,
  style,
}) {
  if (!active || !payload?.length) return null;

  return (
    <View
      style={[
        {
          backgroundColor: cores.bkprincipal,
          borderWidth: 1,
          borderColor: cores.bordaInput,
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 6,
        },
        style,
      ]}
    >
      {label ? (
        <Text style={[estilos.textoDescricao, { fontWeight: 'bold', fontSize: 11 }]}>
          {label}
        </Text>
      ) : null}

      {payload.map((item, index) => (
        <View key={`tooltip-item-${index}`} style={estilos.graficoLegendaItem}>
          <View
            style={[
              estilos.graficoLegendaPonto,
              { backgroundColor: item.color || cores.confirmar },
            ]}
          />
          <Text style={[estilos.textoDescricao, { fontSize: 11 }]}>
            {item.name}: {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

/**
 * LEGENDA DO GRÁFICO: ChartLegend
 */
export function ChartLegend({ content, children }) {
  if (content) return content;
  return <>{children}</>;
}

/**
 * CONTEÚDO DA LEGENDA: ChartLegendContent
 * 
 * Renderiza a lista de séries (ex: "■ Etapas Concluídas   ■ Carga Estimada")
 * respeitando as cores declaradas no `config`.
 */
export function ChartLegendContent({ payload, style }) {
  const { config } = useChart();

  // Se houver payload direto utiliza ele, senão extrai das chaves do objeto de configuração
  const itensLegenda =
    payload && payload.length > 0
      ? payload
      : Object.entries(config).map(([chave, conf]) => ({
          value: conf.label || chave,
          color: conf.color || cores.confirmar,
        }));

  if (!itensLegenda.length) return null;

  return (
    <View style={[estilos.graficoLegendaLinha, style]}>
      {itensLegenda.map((item, index) => (
        <View key={`legenda-${index}`} style={estilos.graficoLegendaItem}>
          <View
            style={[
              estilos.graficoLegendaPonto,
              { backgroundColor: item.color },
            ]}
          />
          <Text style={[estilos.textoDescricao, { fontSize: 11 }]}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

// ============================================================================
// ALIASES EM PORTUGUÊS E COMPATIBILIDADE GLOBAL
// ============================================================================
export const ContêinerGrafico = ChartContainer;
export const LegendaGrafico = ChartLegendContent;
export const useGrafico = useChart;

export default ChartContainer;