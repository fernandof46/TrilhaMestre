import React from 'react';
import { View, Text } from 'react-native';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * CONFIGURAÇÃO DE CORES POR VARIANTE (Mercedes F1)
 */
const CONFIG_VARIANTES = {
  // Primário em Verde Petronas
  default: {
    container: { backgroundColor: cores.confirmar, borderColor: cores.confirmar },
    texto: { color: cores.botoesTexto },
  },
  // Secundário em Cinza Carbono
  secondary: {
    container: { backgroundColor: cores.bkinput, borderColor: cores.bordaInput },
    texto: { color: cores.textoComum },
  },
  // Destrutivo em Vermelho Alerta
  destructive: {
    container: { backgroundColor: cores.cancelar, borderColor: cores.cancelar },
    texto: { color: cores.botoesTexto },
  },
  // Borda sutil com fundo transparente
  outline: {
    container: { backgroundColor: 'transparent', borderColor: cores.bordaInput },
    texto: { color: cores.titulos },
  },
};

/**
 * COMPONENTE: Emblema (Substituto do Badge)
 * 
 * @param {string} variant - 'default' | 'secondary' | 'destructive' | 'outline'
 * @param {object} style - Estilo customizado do container
 * @param {object} textStyle - Estilo customizado do texto interno
 */
export function Emblema({ variant = 'default', style, textStyle, children, ...props }) {
  const configuracao = CONFIG_VARIANTES[variant] || CONFIG_VARIANTES.default;

  return (
    <View
      style={[
        estilos.emblemaBase,
        configuracao.container,
        style,
      ]}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text style={[estilos.textoEmblemaBase, configuracao.texto, textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

// Aliases em inglês para manter 100% de compatibilidade
export const Badge = Emblema;
export default Emblema;