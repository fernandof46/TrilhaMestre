// src/servicos/anuncios/BannerAnuncio.js
import React, { useState } from 'react'; // Importa o React e o estado para ocultar o contêiner caso o anúncio falhe ao carregar
import { View, StyleSheet, TurboModuleRegistry } from 'react-native'; // Importa contêiner, estilos e verificador nativo

// Verifica a presença do módulo sem importar a biblioteca de anúncios no escopo
// global; isso permite abrir telas sem AdMob em ambientes como Expo Go.
const possuiModuloNativoAdMob = TurboModuleRegistry.get('RNGoogleMobileAdsModule') != null;

/**
 * COMPONENTE: BannerAnuncio
 * Exibe um banner adaptativo discreto na base do aplicativo sem interferir na leitura.
 */
export function BannerAnuncio() {
  const [falhouAoCarregar, setFalhouAoCarregar] = useState(false); // Evita faixa vazia se não houver rede ou inventário

  // Oculta silenciosamente se estiver rodando no Expo Go ou se houve falha de carregamento
  if (!possuiModuloNativoAdMob || falhouAoCarregar) return null;

  // O require fica depois da checagem para que o pacote não acesse TurboModules ausentes.
  const { BannerAd, BannerAdSize, TestIds } = require('react-native-google-mobile-ads');

  // Em desenvolvimento (__DEV__), força TestIds do Google; no build de produção (.aab), usa o ID real do .env
  const unitId = __DEV__
    ? TestIds.BANNER
    : process.env.EXPO_PUBLIC_ADMOB_BANNER_ID || TestIds.BANNER;

  return (
    <View style={estilosBanner.containerBanner}>
      <BannerAd
        unitId={unitId} // ID protegido contra tráfego inválido em testes
        // Formato adaptativo ancorado: ajusta automaticamente à largura de qualquer celular
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true, // Conformidade com privacidade e LGPD
        }}
        onAdFailedToLoad={() => setFalhouAoCarregar(true)} // Recolhe o espaço discretamente se falhar
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
