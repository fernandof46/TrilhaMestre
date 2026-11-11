/**
 * ============================================================================
 * ARQUIVO: NotificadorFlutuante.js (Substituto nativo do Toaster / Sonner da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Exibir avisos e notificações temporárias de feedback no topo da tela
 * (por exemplo: "Etapa concluída!", "Trilha salva com sucesso!" ou
 * "Falha ao conectar com o servidor").
 * 
 * COMO FUNCIONA:
 * O componente fica posicionado no topo da raiz do app. Ao acionar a função
 * notificar(), um banner elegante desliza na tela, permanece visível por 3
 * segundos e se recolhe automaticamente com animação suave a 60 FPS.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js. Zero estilos inline.
 * 
 * EXEMPLO DE USO NO PROJETO:
 * const { notificarSucesso, notificarErro } = useNotificacao();
 * notificarSucesso('Sucesso!', 'Seu progresso foi salvo.');
 * ============================================================================
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

// Contexto global para disparar avisos a partir de qualquer tela ou botão
const ContextoNotificacao = createContext({
  notificar: () => {},
  notificarSucesso: () => {},
  notificarErro: () => {},
});

/**
 * HOOK AUXILIAR: useNotificacao
 * 
 * Para que serve:
 * Permite que qualquer botão ou formulário dispare um aviso na tela facilmente.
 */
export function useNotificacao() {
  return useContext(ContextoNotificacao);
}

/**
 * PROVEDOR RAIZ: ProvedorNotificacao (Substituto do Toaster da Web)
 * 
 * Para que serve:
 * Envolve o aplicativo e renderiza o banner flutuante no topo de todas as telas.
 */
export function ProvedorNotificacao({ children }) {
  const [dadosAviso, setDadosAviso] = useState(null);
  const [posicaoYAnimada] = useState(() => new Animated.Value(-100));

  /**
   * Função: fecharAviso
   * O que faz: Recolhe o banner de volta para cima da tela com animação nativa.
   */
  const fecharAviso = useCallback(() => {
    Animated.timing(posicaoYAnimada, {
      toValue: -120,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setDadosAviso(null));
  }, [posicaoYAnimada]);

  /**
   * Função: exibirAviso
   * O que faz: Configura o texto, tipo de aviso e dispara a descida do banner.
   */
  const exibirAviso = useCallback((titulo, mensagem, tipo = 'sucesso') => {
    setDadosAviso({ titulo, mensagem, tipo });

    // Animação de descida do topo da tela
    Animated.spring(posicaoYAnimada, {
      toValue: 40, // Posiciona logo abaixo da barra de status
      useNativeDriver: true,
      bounciness: 4,
    }).start();

  }, [posicaoYAnimada]);

  useEffect(() => {
    if (!dadosAviso) return undefined;
    const temporizador = setTimeout(fecharAviso, 3500);
    return () => clearTimeout(temporizador);
  }, [dadosAviso, fecharAviso]);

  const notificarSucesso = (titulo, mensagem) => exibirAviso(titulo, mensagem, 'sucesso');
  const notificarErro = (titulo, mensagem) => exibirAviso(titulo, mensagem, 'erro');

  return (
    <ContextoNotificacao.Provider
      value={{
        notificar: exibirAviso,
        notificarSucesso,
        notificarErro,
      }}
    >
      {children}

      {/* BANNER FLUTUANTE DE NOTIFICAÇÃO */}
      {dadosAviso ? (
        <Animated.View
          style={[
            estilos.areaTitulo,
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 9999,
              transform: [{ translateY: posicaoYAnimada }],
            },
          ]}
        >
          <TouchableOpacity
            onPress={fecharAviso}
            activeOpacity={0.9}
            style={estilos.menuContextualCartao}
          >
            <View style={estilos.linhaConteudoEtapa}>
              {/* Ícone contextual de sucesso ou erro */}
              <Feather
                name={dadosAviso.tipo === 'erro' ? 'alert-circle' : 'check-circle'}
                size={18}
                color={dadosAviso.tipo === 'erro' ? cores.cancelar : cores.confirmar}
              />

              <View style={estilos.areaInformacoesEtapa}>
                <Text style={estilos.textoTituloTrilha}>
                  {dadosAviso.titulo}
                </Text>

                {dadosAviso.mensagem ? (
                  <Text style={estilos.cartaoDescricao}>
                    {dadosAviso.mensagem}
                  </Text>
                ) : null}
              </View>

              {/* Botão sutil de fechar (X) */}
              <Feather name="x" size={14} color={cores.descricao} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      ) : null}
    </ContextoNotificacao.Provider>
  );
}

// Aliases em inglês para manter 100% de paridade com imports legados
export const Toaster = ProvedorNotificacao;
export default ProvedorNotificacao;