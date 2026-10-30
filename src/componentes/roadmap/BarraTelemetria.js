import React from 'react';
import { View, Text } from 'react-native';
import { estilos } from './estilos';

/**
 * COMPONENTE: BarraTelemetria (Substituto do TelemetryBar)
 * 
 * Finalidade: Componente reutilizável para exibir a régua de progresso 
 * visual em Verde Petronas com rótulo e porcentagem dinâmica.
 * 
 * @param {number} porcentagem - Valor numérico do progresso de 0 a 100
 * @param {string} rotulo - Texto descritivo exibido acima da barra (ex: "Telemetria de progresso")
 * @param {object} estiloCustomizado - Estilos opcionais de margem externa passados pelo componente pai
 */
export default function BarraTelemetria({
  porcentagem = 0,
  rotulo = 'Telemetria de progresso',
  estiloCustomizado,
}) {
  // Trava o valor defensivamente entre 0 e 100 para não estourar a tela
  const valorSeguro = Math.max(0, Math.min(100, Math.round(porcentagem)));

  return (
    <View style={[estilos.areaBarraTelemetria, estiloCustomizado]}>
      
      {/* Linha superior: Rótulo à esquerda e Porcentagem à direita */}
      <View style={estilos.linhaInfoProgresso}>
        <Text style={estilos.textoRotuloProgresso}>
          {rotulo}
        </Text>
        
        <Text style={estilos.textoPorcentagemProgresso}>
          {valorSeguro}%
        </Text>
      </View>

      {/* Trilho cinza de fundo da barra */}
      <View style={estilos.trilhoBarraProgresso}>
        {/* Preenchimento em Verde Petronas proporcional ao progresso */}
        <View
          style={[
            estilos.preenchimentoBarraProgresso,
            { width: `${valorSeguro}%` },
          ]}
        />
      </View>

    </View>
  );
}