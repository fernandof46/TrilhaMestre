/**
 * ============================================================================
 * ARQUIVO: MenuDeNavegacao.js (Substituto nativo do NavigationMenu da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Fornecer uma barra horizontal de abas de navegação principais (ex: "Minhas Trilhas",
 * "Explorar", "Comunidade", "Configurações"), permitindo ao usuário navegar entre
 * seções ou abrir subpainéis de links rápidos com um toque simples.
 * 
 * ADAPTAÇÃO MOBILE:
 * Substitui os "megamenus" de desktop por uma barra horizontal de abas com
 * painel modal flutuante, eliminando problemas de cortes nas bordas da tela.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js. Zero estilos inline.
 * ============================================================================
 */

import React, { createContext, useContext, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * CONTEXTO: ContextoMenuNavegacao
 * 
 * Para que serve:
 * Sincroniza qual aba de navegação está aberta no momento, garantindo que
 * apenas um submenu fique visível por vez na tela.
 */
const ContextoMenuNavegacao = createContext({
  abaAtiva: null,
  alternarAba: () => {},
  fecharSubmenu: () => {},
});

/**
 * COMPONENTE RAIZ: MenuDeNavegacao
 * 
 * Para que serve:
 * Provedor do estado de navegação e contêiner rolável horizontal.
 * 
 * @param {ReactNode} children - ListaMenuNavegacao e seus itens.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function MenuDeNavegacao({ children, estiloPersonalizado }) {
  const [abaAtiva, setAbaAtiva] = useState(null);

  /**
   * Função: alternarAba
   * O que faz: Abre a aba tocada ou fecha se ela já estiver aberta.
   */
  const alternarAba = (identificador) => {
    setAbaAtiva((atual) => (atual === identificador ? null : identificador));
  };

  /**
   * Função: fecharSubmenu
   * O que faz: Fecha qualquer painel aberto.
   */
  const fecharSubmenu = () => setAbaAtiva(null);

  return (
    <ContextoMenuNavegacao.Provider value={{ abaAtiva, alternarAba, fecharSubmenu }}>
      <View style={[estilos.barraMenusRolagem, estiloPersonalizado]}>
        {children}
      </View>
    </ContextoMenuNavegacao.Provider>
  );
}

/**
 * LISTA DE NAVEGAÇÃO: ListaMenuNavegacao
 * 
 * Para que serve:
 * Barra rolável horizontal onde os botões de abas ficam posicionados lado a lado.
 */
export function ListaMenuNavegacao({ children }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={estilos.barraMenusContainer}
    >
      {children}
    </ScrollView>
  );
}

/**
 * CONTEXTO DE ITEM: ContextoItemNavegacao
 */
const ContextoItemNavegacao = createContext({
  identificador: '',
  estaAtivo: false,
});

/**
 * ITEM DE NAVEGAÇÃO: ItemMenuNavegacao
 * 
 * Para que serve:
 * Envolve cada par de Gatilho e Conteúdo com um identificador único de aba.
 * 
 * @param {string} valor - Nome único da aba (ex: "trilhas", "explorar").
 */
export function ItemMenuNavegacao({ valor, children }) {
  const { abaAtiva } = useContext(ContextoMenuNavegacao);
  const estaAtivo = abaAtiva === valor;

  return (
    <ContextoItemNavegacao.Provider value={{ identificador: valor, estaAtivo }}>
      <View>{children}</View>
    </ContextoItemNavegacao.Provider>
  );
}

/**
 * GATILHO DA ABA: GatilhoMenuNavegacao
 * 
 * Para que serve:
 * Botão com texto e setinha indicadora em Verde Petronas.
 * 
 * @param {ReactNode} children - Texto do botão de navegação.
 */
export function GatilhoMenuNavegacao({ children }) {
  const { alternarAba } = useContext(ContextoMenuNavegacao);
  const { identificador, estaAtivo } = useContext(ContextoItemNavegacao);

  return (
    <TouchableOpacity
      onPress={() => alternarAba(identificador)}
      activeOpacity={0.7}
      style={estaAtivo ? estilos.barraMenusBotaoAtivo : estilos.barraMenusBotaoInativo}
    >
      <View style={estilos.trilhaNavegacaoItem}>
        <Text style={estaAtivo ? estilos.barraMenusTextoAtivo : estilos.barraMenusTextoInativo}>
          {children}
        </Text>
        <Feather
          name={estaAtivo ? 'chevron-up' : 'chevron-down'}
          size={14}
          color={estaAtivo ? cores.confirmar : cores.descricao}
        />
      </View>
    </TouchableOpacity>
  );
}

/**
 * CONTEÚDO EXPANSÍVEL: ConteudoMenuNavegacao
 * 
 * Para que serve:
 * Painel flutuante exibido sobre a tela quando a aba está ativa.
 * Fecha automaticamente ao tocar no fundo escuro.
 */
export function ConteudoMenuNavegacao({ children, estiloPersonalizado }) {
  const { fecharSubmenu } = useContext(ContextoMenuNavegacao);
  const { estaAtivo } = useContext(ContextoItemNavegacao);

  if (!estaAtivo) return null;

  return (
    <Modal
      transparent={true}
      visible={estaAtivo}
      animationType="fade"
      onRequestClose={fecharSubmenu}
    >
      <TouchableWithoutFeedback onPress={fecharSubmenu}>
        <View style={estilos.fundoSobreposicao}>
          <TouchableWithoutFeedback>
            <View style={[estilos.menuContextualCartao, estiloPersonalizado]}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

/**
 * LINK DE AÇÃO: LinkMenuNavegacao
 * 
 * Para que serve:
 * Linha de link interno que dispara uma ação ou navegação ao ser tocada.
 * 
 * @param {function} aoPressionar - Ação disparada ao clicar no link.
 */
export function LinkMenuNavegacao({ children, aoPressionar }) {
  const { fecharSubmenu } = useContext(ContextoMenuNavegacao);

  const lidarComToque = () => {
    fecharSubmenu();
    if (aoPressionar) aoPressionar();
  };

  return (
    <TouchableOpacity
      onPress={lidarComToque}
      activeOpacity={0.7}
      style={estilos.menuContextualItem}
    >
      <Text style={[estilos.textoDescricao, estilos.grupoEscolhaTextoAtivo]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

export default MenuDeNavegacao;