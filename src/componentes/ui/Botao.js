import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * CONFIGURAÇÃO DE CORES POR VARIANTE (Mercedes F1)
 */
const VARIANTES_BOTAO = {
  // Primário em Verde Petronas
  default: {
    container: { backgroundColor: cores.confirmar, borderWidth: 1, borderColor: cores.bordaBotao },
    texto: { color: cores.botoesTexto },
  },
  // Destrutivo em Vermelho Alerta
  destructive: {
    container: { backgroundColor: cores.cancelar, borderWidth: 1, borderColor: cores.cancelar },
    texto: { color: cores.botoesTexto },
  },
  // Contorno com fundo transparente
  outline: {
    container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: cores.bordaInput },
    texto: { color: cores.textoComum },
  },
  // Secundário em Cinza Escuro
  secondary: {
    container: { backgroundColor: cores.bkinput, borderWidth: 1, borderColor: cores.bordaInput },
    texto: { color: cores.titulos },
  },
  // Botão sem fundo nem borda
  ghost: {
    container: { backgroundColor: 'transparent' },
    texto: { color: cores.descricao },
  },
  // Texto em Verde Petronas sublinhado estilo link
  link: {
    container: { backgroundColor: 'transparent' },
    texto: { color: cores.confirmar, textDecorationLine: 'underline' },
  },
};

/**
 * CONFIGURAÇÃO DE DIMENSÕES POR TAMANHO
 */
const TAMANHOS_BOTAO = {
  default: { height: 42, paddingHorizontal: 16, fontSize: 13 },
  sm: { height: 34, paddingHorizontal: 12, fontSize: 11 },
  lg: { height: 50, paddingHorizontal: 24, fontSize: 15 },
  icon: { width: 40, height: 40, paddingHorizontal: 0, fontSize: 13 },
};

/**
 * COMPONENTE: Botao (Substituto do Button do shadcn)
 * 
 * @param {string} variant - 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
 * @param {string} size - 'default' | 'sm' | 'lg' | 'icon'
 * @param {boolean} loading - Se verdadeiro, exibe um spinner circular nativo
 * @param {boolean} disabled - Desabilita o toque e aplica opacidade
 * @param {function} onPress / onClick - Função disparada ao clicar
 */
export function Botao({
  variant = 'default',
  size = 'default',
  loading = false,
  disabled = false,
  onPress,
  onClick,
  style,
  textStyle,
  children,
  ...props
}) {
  const estiloVariante = VARIANTES_BOTAO[variant] || VARIANTES_BOTAO.default;
  const configTamanho = TAMANHOS_BOTAO[size] || TAMANHOS_BOTAO.default;

  const lidarToque = () => {
    if (loading || disabled) return;
    const funcaoDisparo = onPress || onClick;
    if (funcaoDisparo) funcaoDisparo();
  };

  return (
    <TouchableOpacity
      style={[
        estilos.botaoGenericoBase,
        {
          height: configTamanho.height,
          paddingHorizontal: configTamanho.paddingHorizontal,
          width: size === 'icon' ? configTamanho.width : undefined,
        },
        estiloVariante.container,
        (disabled || loading) && estilos.botaoDesabilitado,
        style,
      ]}
      onPress={lidarToque}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={estiloVariante.texto.color || cores.botoesTexto}
        />
      ) : typeof children === 'string' ? (
        <Text
          style={[
            {
              fontSize: configTamanho.fontSize,
              fontWeight: 'bold',
              letterSpacing: 1,
              textTransform: 'uppercase',
            },
            estiloVariante.texto,
            textStyle,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

// Aliases em inglês para manter 100% de compatibilidade
export const Button = Botao;
export default Botao;