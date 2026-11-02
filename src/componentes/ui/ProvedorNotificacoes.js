/**
 * ============================================================================
 * ARQUIVO: ProvedorNotificacoes.js (Substituto nativo do Toaster / sonner)
 * 
 * FINALIDADE DO ARQUIVO:
 * Atuar como a camada orquestradora de notificações do aplicativo. Ele escuta
 * as requisições de avisos vindas de qualquer lugar do app e as renderiza
 * visualmente utilizando o componente NotificadorFlutuante.
 * 
 * COMPORTAMENTO MOBILE:
 * Diferente da Web, onde vários Toasts podem se empilhar, no mobile priorizamos a
 * clareza. O orquestrador gerencia a fila de notificações, exibindo uma por vez
 * no topo da tela para não obstruir a navegação do usuário.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js. Zero estilos inline.
 * ============================================================================
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { View } from 'react-native';
import { NotificadorFlutuante } from './NotificadorFlutuante';
import { NotificacaoCartao, NotificacaoTitulo, NotificacaoDescricao, NotificacaoAcao } from './NotificacaoCartao';
import { estilos } from './estilos';

/**
 * CONTEXTO DE COMUNICAÇÃO: ContextoNotificacao
 * 
 * Para que serve:
 * Permite que qualquer componente do app (estando no topo ou no fundo da árvore)
 * dispare um aviso sem precisar passar funções via props (prop drilling).
 */
const ContextoNotificacao = createContext({
  // Função genérica para disparar qualquer tipo de aviso
  // Ex: notificar({ titulo: 'Erro', mensagem: 'Falha ao salvar', tipo: 'erro' })
  notificar: () => {},
  // Atalho para avisos de sucesso (Verde Petronas)
  notificarSucesso: () => {},
  // Atalho para avisos de erro (Vermelho Alerta)
  notificarErro: () => {},
});

/**
 * HOOK AUXILIAR: useNotificacao
 * 
 * Para que serve:
 * Atalho simplificado para que as telas acessem as funções de notificação.
 * Uso: const { notificarSucesso } = useNotificacao();
 */
export function useNotificacao() {
  const contexto = useContext(ContextoNotificacao);
  if (!contexto) {
    throw new Error('useNotificacao deve ser utilizado dentro de um <ProvedorNotificacoes />');
  }
  return contexto;
}

/**
 * COMPONENTE RAIZ: ProvedorNotificacoes (Substituto do Toaster)
 * 
 * Para que serve:
 * Provedor global que envolve a aplicação. Ele escuta a fila de notificações
 * e decide qual aviso deve ser renderizado no momento através do NotificadorFlutuante.
 */
export function ProvedorNotificacoes({ children }) {
  // Estado que armazena o aviso atual que está sendo exibido na tela
  const [avisoAtivo, setAvisoAtivo] = useState(null);

  /**
   * Função: dispararAviso
   * O que faz: Define a mensagem, título e tipo do aviso, disparando a animação de subida.
   */
  const dispararAviso = (dados) => {
    const { titulo, mensagem, tipo = 'sucesso', acao } = dados;
    
    setAvisoAtivo({
      id: Date.now(), // ID único para forçar a re-renderização do componente
      titulo,
      mensagem,
      tipo,
      acao,
    });
  };

  /**
   * Função: fecharAviso
   * O que faz: Remove o aviso da tela, disparando a animação de saída.
   */
  const fecharAviso = () => {
    setAvisoAtivo(null);
  };

  // Atalhos para facilitar a escrita nas telas
  const notificarSucesso = (titulo, mensagem, acao) => 
    dispararAviso({ titulo, mensagem, tipo: 'sucesso', acao });
    
  const notificarErro = (titulo, mensagem, acao) => 
    dispararAviso({ titulo, mensagem, tipo: 'erro', acao });

  return (
    <ContextoNotificacao.Provider 
      value={{ 
        notificar: dispararAviso, 
        notificarSucesso, 
        notificarErro 
      }}
    >
      {/* CONTEÚDO DO APP */}
      {children}

      {/* RENDERIZADOR DE NOTIFICAÇÕES: Componente visual flutuante */}
      <NotificadorFlutuante 
        visivel={!!avisoAtivo} 
        aoFechar={fecharAviso}
      >
        {avisoAtivo && (
          <NotificacaoCartao variante={avisoAtivo.tipo === 'erro' ? 'destrutiva' : 'default'}>
            <View style={estilos.colunaAcoesDestaque}>
              <NotificacaoTitulo>{avisoAtivo.titulo}</NotificacaoTitulo>
              <NotificacaoDescricao>{avisoAtivo.mensagem}</NotificacaoDescricao>
            </View>
            
            {/* Se a notificação possuir uma ação vinculada, ela é renderizada aqui */}
            {avisoAtivo.acao && (
              <NotificacaoAcao aoPressionar={avisoAtivo.acao}>
                Ação
              </NotificacaoAcao>
            )}
          </NotificacaoCartao>
        )}
      </NotificadorFlutuante>
    </ContextoNotificacao.Provider>
  );
}

// Alias em inglês para manter a compatibilidade com o sistema de imports original
export const Toaster = ProvedorNotificacoes;
export default ProvedorNotificacoes;