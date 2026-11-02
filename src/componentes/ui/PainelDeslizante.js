/**
 * ============================================================================
 * ARQUIVO: PainelDeslizante.js (Substituto nativo do Sheet da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Fornecer um painel deslizante que surge suavemente na tela (padrão slide).
 * Muito utilizado para menus laterais de navegação, painéis de filtros avançados
 * e visualizadores de detalhes sem precisar navegar para outra tela.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js. Zero estilos inline.
 * 
 * ARQUITETURA EM BLOCOS (Composição React):
 * <PainelDeslizante>
 *    <GatilhoPainelDeslizante>
 *       {...Botão de abrir filtros ou menu...}
 *    </GatilhoPainelDeslizante>
 *    <ConteudoPainelDeslizante>
 *       <CabecalhoPainelDeslizante>
 *          <TituloPainelDeslizante>Filtros de Trilha</TituloPainelDeslizante>
 *          <DescricaoPainelDeslizante>Refine os resultados por área e nível</DescricaoPainelDeslizante>
 *       </CabecalhoPainelDeslizante>
 *       {...Opções e filtros...}
 *       <RodapePainelDeslizante>
 *          <FecharPainelDeslizante>Aplicar Filtros</FecharPainelDeslizante>
 *       </RodapePainelDeslizante>
 *    </ConteudoPainelDeslizante>
 * </PainelDeslizante>
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
  TouchableWithoutFeedback,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * CONTEXTO DE CONTROLE: ContextoPainelDeslizante
 * 
 * Para que serve:
 * Sincroniza o estado de visibilidade entre o botão de disparo (Gatilho)
 * e o painel deslizante (Conteúdo).
 */
const ContextoPainelDeslizante = createContext({
  estaAberto: false,
  abrirPainel: () => {},
  fecharPainel: () => {},
});

/**
 * COMPONENTE RAIZ: PainelDeslizante
 * 
 * Para que serve:
 * Provedor do estado que gerencia a abertura e o fechamento do painel.
 * 
 * @param {boolean} aberto - Propriedade opcional para controle externo via tela mãe.
 * @param {function} aoAlterarAberto - Notifica o componente pai sobre mudanças de estado.
 * @param {ReactNode} children - GatilhoPainelDeslizante e ConteudoPainelDeslizante.
 */
export function PainelDeslizante({ aberto, aoAlterarAberto, children }) {
  const [abertoInterno, setAbertoInterno] = useState(false);

  const estaAberto = aberto !== undefined ? aberto : abertoInterno;

  /**
   * Função: abrirPainel
   * O que faz: Torna o painel visível na tela.
   */
  const abrirPainel = () => {
    if (aoAlterarAberto) aoAlterarAberto(true);
    else setAbertoInterno(true);
  };

  /**
   * Função: fecharPainel
   * O que faz: Oculta o painel deslizante.
   */
  const fecharPainel = () => {
    if (aoAlterarAberto) aoAlterarAberto(false);
    else setAbertoInterno(false);
  };

  return (
    <ContextoPainelDeslizante.Provider value={{ estaAberto, abrirPainel, fecharPainel }}>
      {children}
    </ContextoPainelDeslizante.Provider>
  );
}

/**
 * GATILHO: GatilhoPainelDeslizante
 * 
 * Para que serve:
 * O elemento clicável que o usuário toca para fazer o painel deslizar para a tela.
 * 
 * @param {ReactNode} children - Botão ou ícone de abertura.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function GatilhoPainelDeslizante({ children, estiloPersonalizado }) {
  const { abrirPainel } = useContext(ContextoPainelDeslizante);

  return (
    <TouchableOpacity
      onPress={abrirPainel}
      activeOpacity={0.8}
      style={estiloPersonalizado}
    >
      {children}
    </TouchableOpacity>
  );
}

/**
 * CONTEÚDO PRINCIPAL: ConteudoPainelDeslizante
 * 
 * Para que serve:
 * Renderiza o painel deslizante com animação nativa, fundo semitransparente escuro
 * e botão de fechar (X) no topo.
 * 
 * @param {ReactNode} children - Elementos internos do painel.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function ConteudoPainelDeslizante({ children, estiloPersonalizado }) {
  const { estaAberto, fecharPainel } = useContext(ContextoPainelDeslizante);

  return (
    <Modal
      transparent={true}
      visible={estaAberto}
      animationType="slide"
      onRequestClose={fecharPainel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={estilos.fundoModalChatTutor}
      >
        {/* TOQUE FORA FECHA O PAINEL */}
        <TouchableWithoutFeedback onPress={fecharPainel}>
          <View style={estilos.containerPrincipal} />
        </TouchableWithoutFeedback>

        {/* CORPO DO PAINEL */}
        <View style={[estilos.painelConteudoChatTutor, estiloPersonalizado]}>
          {/* Botão de Fechar no topo direito (X) */}
          <TouchableOpacity
            style={estilos.janelaModalBotaoFechar}
            onPress={fecharPainel}
            hitSlop={10}
          >
            <Feather name="x" size={18} color={cores.descricao} />
          </TouchableOpacity>

          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/**
 * CABEÇALHO DO PAINEL: CabecalhoPainelDeslizante
 */
export function CabecalhoPainelDeslizante({ children, estiloPersonalizado }) {
  return (
    <View style={[estilos.cartaoCabecalho, estiloPersonalizado]}>
      {children}
    </View>
  );
}

/**
 * TÍTULO DO PAINEL: TituloPainelDeslizante
 */
export function TituloPainelDeslizante({ children, estiloPersonalizado }) {
  return typeof children === 'string' ? (
    <Text style={[estilos.textoTituloTrilha, estiloPersonalizado]}>
      {children}
    </Text>
  ) : (
    children
  );
}

/**
 * DESCRIÇÃO DO PAINEL: DescricaoPainelDeslizante
 */
export function DescricaoPainelDeslizante({ children, estiloPersonalizado }) {
  return typeof children === 'string' ? (
    <Text style={[estilos.cartaoDescricao, estiloPersonalizado]}>
      {children}
    </Text>
  ) : (
    children
  );
}

/**
 * RODAPÉ DO PAINEL: RodapePainelDeslizante
 */
export function RodapePainelDeslizante({ children, estiloPersonalizado }) {
  return (
    <View style={[estilos.rodapeDialogoAlerta, estiloPersonalizado]}>
      {children}
    </View>
  );
}

/**
 * BOTÃO DE FECHAMENTO: FecharPainelDeslizante
 * 
 * Para que serve:
 * Transforma qualquer botão interno em um gatilho de fechamento automático do painel.
 * 
 * @param {function} aoFechar - Callback opcional executado ao clicar.
 */
export function FecharPainelDeslizante({ children, aoFechar }) {
  const { fecharPainel } = useContext(ContextoPainelDeslizante);

  const lidarComToque = () => {
    fecharPainel();
    if (aoFechar) aoFechar();
  };

  return (
    <TouchableOpacity onPress={lidarComToque} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}

export default PainelDeslizante;