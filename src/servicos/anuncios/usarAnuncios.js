// src/servicos/anuncios/usarAnuncios.js
import { useState, useEffect, useRef } from 'react'; // Importa os hooks essenciais do React para ciclo de vida, estado e referências persistentes
import { TurboModuleRegistry } from 'react-native'; // Importa o registro de módulos nativos para verificar se o SDK do AdMob está compilado

// Esta checagem precisa ocorrer antes do require do pacote, pois Expo Go não inclui
// os módulos nativos do AdMob e a importação antecipada pode interromper a inicialização.
const possuiModuloNativoAdMob = TurboModuleRegistry.get('RNGoogleMobileAdsModule') != null;

// Carrega a biblioteca de anúncios apenas quando o código nativo estiver disponível no aparelho
let BibliotecaAnuncios = null;
if (possuiModuloNativoAdMob) {
  BibliotecaAnuncios = require('react-native-google-mobile-ads');
}

/**
 * HOOK: usarAnuncioIntersticial
 * Gerencia o carregamento antecipado e a exibição segura de anúncios de tela cheia (Interstitial).
 */
function useAnuncioIntersticial() {
  const [carregado, setCarregado] = useState(false); // Indica se o anúncio está pronto na memória para exibição imediata
  const referenciaAnuncio = useRef(null); // Guarda a instância do anúncio entre renderizações sem recriá-la

  useEffect(() => {
    // Se estiver rodando no Expo Go sem módulo nativo, encerra sem erros
    if (!possuiModuloNativoAdMob || !BibliotecaAnuncios) return;

    const { InterstitialAd, AdEventType, TestIds } = BibliotecaAnuncios;
    // Lê o ID de produção do arquivo .env ou usa o ID oficial de testes do Google
    // Em desenvolvimento (__DEV__), força TestIds do Google; no build de produção (.aab), usa o ID real do .env
    const idBloco = __DEV__
      ? TestIds.INTERSTITIAL
      : process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID || TestIds.INTERSTITIAL;


    try {
      // Cria a instância do anúncio solicitando anúncios não personalizados (conformidade LGPD/Play Store)
      const intersticial = InterstitialAd.createForAdRequest(idBloco, {
        requestNonPersonalizedAdsOnly: true,
      });
      referenciaAnuncio.current = intersticial;

      // Escuta quando o anúncio termina de baixar e fica pronto para exibir
      const cancelarCarregado = intersticial.addAdEventListener(AdEventType.LOADED, () => {
        setCarregado(true);
      });

      // Escuta quando o usuário fecha o anúncio e já inicia o pré-carregamento do próximo
      const cancelarFechado = intersticial.addAdEventListener(AdEventType.CLOSED, () => {
        setCarregado(false);
        intersticial.load();
      });

      // Escuta falhas de rede ou falta de inventário para não travar o fluxo do usuário
      const cancelarErro = intersticial.addAdEventListener(AdEventType.ERROR, () => {
        setCarregado(false);
      });

      // Inicia o primeiro carregamento em segundo plano
      intersticial.load();

      // Limpa os ouvintes de eventos ao desmontar a tela
      return () => {
        cancelarCarregado();
        cancelarFechado();
        cancelarErro();
      };
    } catch (erro) {
      if (__DEV__) console.warn('Falha ao inicializar anúncio intersticial:', erro);
    }
  }, []);

  /**
   * Exibe o anúncio se estiver pronto; caso contrário, libera a ação imediatamente para não bloquear o usuário.
   */
  const exibirIntersticial = (aoFecharAnuncio) => {
    if (!possuiModuloNativoAdMob || !BibliotecaAnuncios) {
      aoFecharAnuncio();
      return;
    }

    const { AdEventType } = BibliotecaAnuncios;
    const intersticial = referenciaAnuncio.current;

    if (carregado && intersticial) {
      // Registra um ouvinte único para executar a ação logo após o fechamento do anúncio
      const cancelarAoFechar = intersticial.addAdEventListener(AdEventType.CLOSED, () => {
        cancelarAoFechar();
        aoFecharAnuncio();
      });
      intersticial.show();
    } else {
      // Se o anúncio ainda não baixou, executa a ação sem fazer o usuário esperar
      aoFecharAnuncio();
    }
  };

  return { exibirIntersticial, intersticialCarregado: carregado };
}

/**
 * HOOK: usarAnuncioPremiado
 * Gerencia o vídeo longo de recompensa (Rewarded Ad) usado para liberar o salvamento de trilhas.
 */
function useAnuncioPremiado() {
  // No Expo Go simula como carregado para permitir testar o fluxo completo durante o desenvolvimento
  const [carregado, setCarregado] = useState(!possuiModuloNativoAdMob);
  const referenciaAnuncio = useRef(null);

  useEffect(() => {
    if (!possuiModuloNativoAdMob || !BibliotecaAnuncios) return;

    // O carregamento usa os eventos específicos do vídeo; fechamento e falha são
    // eventos gerais de anúncios de tela cheia, por isso vêm de AdEventType.
        const { RewardedAd, RewardedAdEventType, AdEventType, TestIds } = BibliotecaAnuncios;
    // Em desenvolvimento (__DEV__), força TestIds.REWARDED; no build de produção (.aab), usa o ID real do .env
    const idBloco = __DEV__
      ? TestIds.REWARDED
      : process.env.EXPO_PUBLIC_ADMOB_REWARDED_ID || TestIds.REWARDED;



    try {
      const premiado = RewardedAd.createForAdRequest(idBloco, {
        requestNonPersonalizedAdsOnly: true,
      });
      referenciaAnuncio.current = premiado;

      // Marca como pronto assim que o vídeo é baixado
      const cancelarCarregado = premiado.addAdEventListener(RewardedAdEventType.LOADED, () => {
        setCarregado(true);
      });

      // Ao fechar o vídeo, recarrega outro em segundo plano
      const cancelarFechado = premiado.addAdEventListener(AdEventType.CLOSED, () => {
        setCarregado(false);
        premiado.load();
      });

      // Em caso de erro de rede, marca como indisponível sem quebrar o app
      const cancelarErro = premiado.addAdEventListener(AdEventType.ERROR, () => {
        setCarregado(false);
      });

      premiado.load();

      return () => {
        cancelarCarregado();
        cancelarFechado();
        cancelarErro();
      };
    } catch (erro) {
      if (__DEV__) console.warn('Falha ao inicializar anúncio premiado:', erro);
    }
  }, []);

  /**
   * Exibe o vídeo premiado e só dispara 'aoConquistarRecompensa' se o usuário assistir até o final.
   */
    /**
   * Exibe o vídeo premiado e dispara 'aoConquistarRecompensa' assim que o usuário concluir o vídeo e fechá-lo.
   */
  const exibirAnuncioPremiado = (aoConquistarRecompensa, aoEstarIndisponivel) => {
    // No Expo Go (sem módulo nativo), libera imediatamente para permitir testar o fluxo
    if (!possuiModuloNativoAdMob || !BibliotecaAnuncios) {
      if (aoConquistarRecompensa) aoConquistarRecompensa();
      return;
    }

    const { RewardedAdEventType, AdEventType } = BibliotecaAnuncios;
    const premiado = referenciaAnuncio.current;

    // Se o vídeo ainda não baixou, tenta recarregar e avisa o chamador
    if (!carregado || !premiado) {
      if (premiado) premiado.load();
      if (aoEstarIndisponivel) aoEstarIndisponivel();
      return;
    }

    let recompensaConquistada = false; // Indica se o Google confirmou a visualização completa do vídeo
    let callbackExecutado = false; // Evita executar a geração da trilha duas vezes

    const concluirRecompensa = () => {
      if (recompensaConquistada && !callbackExecutado) {
        callbackExecutado = true;
        if (aoConquistarRecompensa) aoConquistarRecompensa();
      }
    };

    // Escuta o evento oficial do Google que confirma a conclusão dos 30 segundos
    const cancelarRecompensa = premiado.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      recompensaConquistada = true;
    });

    // Quando o usuário fecha o player do vídeo, libera a recompensa se ela foi conquistada
    const cancelarFechamento = premiado.addAdEventListener(AdEventType.CLOSED, () => {
      cancelarRecompensa();
      cancelarFechamento();
      // Pequeno atraso de 150ms garante que EARNED_REWARD seja processado mesmo se chegar junto com CLOSED
      setTimeout(concluirRecompensa, 150);
    });

    premiado.show();
  };


  return { exibirAnuncioPremiado, premiadoCarregado: carregado };
}

// Mantém os nomes públicos já utilizados pelas telas; as implementações use*
// também permitem que a regra do ESLint reconheça e valide a ordem dos Hooks.
export {
  useAnuncioIntersticial as usarAnuncioIntersticial,
  useAnuncioPremiado as usarAnuncioPremiado,
};
