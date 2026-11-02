/**
 * ============================================================================
 * ARQUIVO: JanelaModal.js (Substituto nativo do Dialog do Radix/shadcn)
 * 
 * FINALIDADE DO ARQUIVO:
 * Exibir janelas modais flutuantes centralizadas na tela com fundo escuro.
 * Utilizado para alertas, caixas de diálogo, confirmações críticas e
 * formulários rápidos sem sair da rota atual.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js. Zero estilos inline.
 * ============================================================================
 */

import React, { createContext, useContext, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * CONTEXTO: ContextoJanelaModal
 * 
 * Para que serve:
 * Compartilha o estado de visibilidade (aberto/fechado) e as funções de controle
 * entre o gatilho de abertura e o conteúdo interno do modal.
 */
const ContextoJanelaModal = createContext({
  estaAberto: false,
  abrirModal: () => {},
  fecharModal: () => {},
});

/**
 * COMPONENTE RAIZ: JanelaModal
 * 
 * Para que serve:
 * Provedor de estado que gerencia se a janela está visível ou oculta.
 * 
 * @param {boolean} aberto - Propriedade opcional para controle externo via tela mãe.
 * @param {function} aoAlterarAberto - Notifica o componente pai sobre mudanças de estado.
 * @param {ReactNode} children - Gatilho, Conteúdo, Cabeçalho, Rodapé, etc.
 */
export function JanelaModal({ aberto, aoAlterarAberto, children }) {
  const [abertoInterno, setAbertoInterno] = useState(false);

  const estaAberto = aberto !== undefined ? aberto : abertoInterno;

  /**
   * Função: abrirModal
   * O que faz: Altera o estado para verdadeiro (true).
   */
  const abrirModal = () => {
    if (aoAlterarAberto) aoAlterarAberto(true);
    else setAbertoInterno(true);
  };

  /**
   * Função: fecharModal
   * O que faz: Altera o estado para falso (false).
   */
  const fecharModal = () => {
    if (aoAlterarAberto) aoAlterarAberto(false);
    else setAbertoInterno(false);
  };

  return (
    <ContextoJanelaModal.Provider value={{ estaAberto, abrirModal, fecharModal }}>
      {children}
    </ContextoJanelaModal.Provider>
  );
}

/**
 * COMPONENTE GATILHO: GatilhoJanelaModal
 * 
 * Para que serve:
 * Envolve qualquer botão ou elemento gráfico que o usuário toca para abrir o modal.
 * 
 * @param {ReactNode} children - Botão ou texto que aciona a abertura.
 * @param {object} estiloPersonalizado - Estilo visual extra vindo de estilos/index.js.
 */
export function GatilhoJanelaModal({ children, estiloPersonalizado }) {
  const { abrirModal } = useContext(ContextoJanelaModal);

  return (
    <TouchableOpacity
      onPress={abrirModal}
      activeOpacity={0.8}
      style={estiloPersonalizado}
    >
      {children}
    </TouchableOpacity>
  );
}

/**
 * COMPONENTE DE CONTEÚDO PRINCIPAL: ConteudoJanelaModal
 * 
 * Para que serve:
 * Renderiza o cartão visual flutuante centralizado com fundo semitransparente escuro,
 * botão de fechar (X) no canto superior direito e suporte ao botão físico de voltar do Android.
 * 
 * @param {ReactNode} children - Elementos internos do modal.
 * @param {boolean} exibirBotaoFechar - Define se o ícone de 'X' deve ser exibido (padrão: true).
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function ConteudoJanelaModal({
  children,
  estiloPersonalizado,
  exibirBotaoFechar = true,
}) {
  const { estaAberto, fecharModal } = useContext(ContextoJanelaModal);

  return (
    <Modal
      transparent={true}
      visible={estaAberto}
      animationType="fade"
      onRequestClose={fecharModal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={estilos.fundoSobreposicao}
      >
        <View style={[estilos.janelaModalCartao, estiloPersonalizado]}>
          {/* BOTÃO FECHAR (X): Posicionado no canto superior direito */}
          {exibirBotaoFechar ? (
            <TouchableOpacity
              style={estilos.janelaModalBotaoFechar}
              onPress={fecharModal}
              hitSlop={10}
            >
              <Feather name="x" size={18} color={cores.descricao} />
            </TouchableOpacity>
          ) : null}

          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/**
 * CABEÇALHO DO MODAL: CabecalhoJanelaModal
 * 
 * Para que serve:
 * Agrupa o título e a descrição com margens padronizadas.
 */
export function CabecalhoJanelaModal({ children, estiloPersonalizado }) {
  return (
    <View style={[estilos.cartaoCabecalho, estiloPersonalizado]}>
      {children}
    </View>
  );
}

/**
 * TÍTULO DO MODAL: TituloJanelaModal
 * 
 * Para que serve:
 * Exibe o título principal do modal em negrito e tamanho 17.
 */
export function TituloJanelaModal({ children, estiloPersonalizado }) {
  return typeof children === 'string' ? (
    <Text style={[estilos.textoTituloTrilha, estiloPersonalizado]}>
      {children}
    </Text>
  ) : (
    children
  );
}

/**
 * DESCRIÇÃO DO MODAL: DescricaoJanelaModal
 * 
 * Para que serve:
 * Subtítulo explicativo em tom atenuado com entrelinha de leitura confortável.
 */
export function DescricaoJanelaModal({ children, estiloPersonalizado }) {
  return typeof children === 'string' ? (
    <Text style={[estilos.cartaoDescricao, estiloPersonalizado]}>
      {children}
    </Text>
  ) : (
    children
  );
}

/**
 * RODAPÉ DO MODAL: RodapeJanelaModal
 * 
 * Para que serve:
 * Alinha os botões de ação (ex: Cancelar e Confirmar) horizontalmente no final do modal.
 */
export function RodapeJanelaModal({ children, estiloPersonalizado }) {
  return (
    <View style={[estilos.rodapeDialogoAlerta, estiloPersonalizado]}>
      {children}
    </View>
  );
}

/**
 * BOTÃO DE FECHAMENTO: FecharJanelaModal
 * 
 * Para que serve:
 * Transforma qualquer botão interno em um gatilho de fechamento automático da janela.
 * 
 * @param {function} aoFechar - Callback opcional executado no momento do clique.
 */
export function FecharJanelaModal({ children, aoFechar }) {
  const { fecharModal } = useContext(ContextoJanelaModal);

  const lidarComClique = () => {
    fecharModal();
    if (aoFechar) aoFechar();
  };

  return (
    <TouchableOpacity onPress={lidarComClique} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}

export default JanelaModal;