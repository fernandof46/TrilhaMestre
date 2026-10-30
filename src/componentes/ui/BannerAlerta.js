import React from 'react';
import { View, Text } from 'react-native';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * COMPONENTE RAIZ: BannerAlerta (Substituto do Alert visual)
 * 
 * @param {string} variant - 'default' (padrão) ou 'destructive' (vermelho de erro)
 * @param {object} style - Estilos customizados adicionais
 */
export function BannerAlerta({ variant = 'default', style, children, ...props }) {
  const estiloVariante =
    variant === 'destructive'
      ? estilos.bannerAlertaDestrutivo
      : estilos.bannerAlertaPadrao;

  return (
    <View style={[estiloVariante, style]} {...props}>
      {children}
    </View>
  );
}

/**
 * TÍTULO DO BANNER (AlertTitle)
 */
export function BannerAlertaTitulo({ children, style, ...props }) {
  return (
    <Text
      style={[
        estilos.textoTitulo,
        {
          fontSize: 14,
          textAlign: 'left',
          marginBottom: 4,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

/**
 * DESCRIÇÃO DO BANNER (AlertDescription)
 */
export function BannerAlertaDescricao({ children, style, ...props }) {
  return (
    <Text
      style={[
        estilos.textoDescricao,
        {
          fontSize: 12,
          textAlign: 'left',
          lineHeight: 17,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

// Aliases em inglês para manter compatibilidade com códigos legados
export const Alert = BannerAlerta;
export const AlertTitle = BannerAlertaTitulo;
export const AlertDescription = BannerAlertaDescricao;