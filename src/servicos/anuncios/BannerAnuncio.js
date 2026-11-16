// src/servicos/anuncios/BannerAnuncio.js
import React from 'react'; // Importa o React para renderização do componente visual
import { View, StyleSheet, TurboModuleRegistry } from 'react-native'; // Importa contêiner, estilos e verificador nativo

// Verifica a presença do módulo sem importar a biblioteca de anúncios no escopo
// global; isso permite abrir telas sem AdMob em ambientes como Expo Go.
const possuiModuloNativoAdMob = TurboModuleRegistry.get('RNGoogleMobileAdsModule') != null;

/**
 * COMPONENTE: BannerAnuncio
 * Exibe um banner adaptativo discreto na base do aplicativo sem interferir na leitura.
 */
export function BannerAnuncio() {
  // Oculta silenciosamente apenas se estiver rodando no Expo Go sem suporte nativo
  if (!possuiModuloNativoAdMob) return null;

  // O require fica depois da checagem para que o pacote não acesse TurboModules ausentes.
  const { BannerAd, BannerAdSize, TestIds } = require('react-native-google-mobile-ads');

  return (
    <View style={estilosBanner.containerBanner}>
      <BannerAd
        // Usa o ID de produção configurado no .env ou o ID oficial de teste do Google
        unitId={process.env.EXPO_PUBLIC_ADMOB_BANNER_ID || TestIds.BANNER}
        // Formato adaptativo ancorado: ajusta automaticamente à largura de qualquer celular
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true, // Conformidade com privacidade e LGPD
        }}
      />
    </View>
  );
}

const estilosBanner = StyleSheet.create({
  containerBanner: {
    alignItems: 'center', // Centraliza o anúncio horizontalmente
    justifyContent: 'center', // Centraliza verticalmente
    width: '100%', // Ocupa toda a largura disponível da tela
    paddingVertical: 2, // Espaçamento discreto para não poluir a interface
  },
});
