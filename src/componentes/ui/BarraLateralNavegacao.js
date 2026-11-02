/**
 * ============================================================================
 * ARQUIVO: BarraLateralNavegacao.js (Substituto nativo do Sidebar da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Fornecer o menu de navegação lateral principal do aplicativo (Drawer).
 * Permite ao usuário alternar entre seções centrais (Cockpit, Minhas Trilhas,
 * Garagem, Histórico de Quizzes, Suporte e Perfil).
 * 
 * ADAPTAÇÃO MOBILE:
 * Substitui os cookies e atalhos de desktop por um menu gaveta lateral nativo,
 * acionado pelo ícone de menu (hambúrguer) e fechável com toque fora.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js. Zero estilos inline.
 * 
 * ARQUITETURA EM BLOCOS (Composição React):
 * <ProvedorBarraLateral>
 *    <GatilhoBarraLateral />
 *    <BarraLateral>
 *       <CabecalhoBarraLateral>Logo / Perfil</CabecalhoBarraLateral>
 *       <ConteudoBarraLateral>
 *          <GrupoBarraLateral>
 *             <RotuloGrupoBarraLateral texto="Plataforma" />
 *             <MenuBarraLateral>
 *                <BotaoMenuBarraLateral icone="compass" estaAtivo={true}>Trilhas</BotaoMenuBarraLateral>
 *             </MenuBarraLateral>
 *          </GrupoBarraLateral>
 *       </ConteudoBarraLateral>
 *       <RodapeBarraLateral>Sair</RodapeBarraLateral>
 *    </BarraLateral>
 * </ProvedorBarraLateral>
 * ============================================================================
 */

import React, { createContext, useContext, useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * CONTEXTO: ContextoBarraLateral
 * 
 * Para que serve:
 * Compartilha o estado aberto/fechado da barra lateral entre o botão de menu (hambúrguer)
 * e o painel gaveta.
 */
const ContextoBarraLateral = createContext({
  aberto: false,
  alternarBarraLateral: () => {},
  fecharBarraLateral: () => {},
});

/**
 * HOOK AUXILIAR: useBarraLateral
 */
export function useBarraLateral() {
  const contexto = useContext(ContextoBarraLateral);
  if (!contexto) {
    throw new Error('useBarraLateral deve ser utilizado dentro de um <ProvedorBarraLateral />');
  }
  return contexto;
}

/**
 * PROVEDOR RAIZ: ProvedorBarraLateral
 * 
 * Para que serve:
 * Provedor do estado do menu gaveta.
 * 
 * @param {boolean} padraoAberto - Define se inicia aberto (padrão: false).
 */
export function ProvedorBarraLateral({ children, padraoAberto = false }) {
  const [aberto, setAberto] = useState(padraoAberto);

  const alternarBarraLateral = () => setAberto((atual) => !atual);
  const fecharBarraLateral = () => setAberto(false);

  return (
    <ContextoBarraLateral.Provider value={{ aberto, alternarBarraLateral, fecharBarraLateral }}>
      <View style={estilos.containerPrincipal}>
        {children}
      </View>
    </ContextoBarraLateral.Provider>
  );
}

/**
 * GATILHO (BOTÃO DE MENU): GatilhoBarraLateral
 * 
 * Para que serve:
 * Botão com ícone de menu (hambúrguer) que o usuário toca para abrir a gaveta.
 */
export function GatilhoBarraLateral({ estiloPersonalizado }) {
  const { alternarBarraLateral } = useBarraLateral();

  return (
    <TouchableOpacity
      onPress={alternarBarraLateral}
      activeOpacity={0.7}
      style={estiloPersonalizado}
    >
      <Feather name="menu" size={20} color={cores.confirmar} />
    </TouchableOpacity>
  );
}

/**
 * PAINEL LATERAL: BarraLateral
 * 
 * Para que serve:
 * Renderiza o painel lateral em formato de gaveta com fundo semitransparente escuro.
 */
export function BarraLateral({ children, estiloPersonalizado }) {
  const { aberto, fecharBarraLateral } = useBarraLateral();

  return (
    <Modal
      transparent={true}
      visible={aberto}
      animationType="fade"
      onRequestClose={fecharBarraLateral}
    >
      {/* TOQUE FORA FECHA O MENU */}
      <TouchableWithoutFeedback onPress={fecharBarraLateral}>
        <View style={estilos.fundoSobreposicao}>
          <TouchableWithoutFeedback>
            <View
              style={[
                estilos.menuContextualCartao,
                estiloPersonalizado,
              ]}
            >
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

/**
 * CABEÇALHO DA BARRA LATERAL: CabecalhoBarraLateral
 */
export function CabecalhoBarraLateral({ children, estiloPersonalizado }) {
  return (
    <View style={[estilos.cartaoCabecalho, estiloPersonalizado]}>
      {children}
    </View>
  );
}

/**
 * CONTEÚDO ROLÁVEL: ConteudoBarraLateral
 */
export function ConteudoBarraLateral({ children, estiloPersonalizado }) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={estiloPersonalizado}
    >
      {children}
    </ScrollView>
  );
}

/**
 * RODAPÉ DA BARRA LATERAL: RodapeBarraLateral
 */
export function RodapeBarraLateral({ children, estiloPersonalizado }) {
  return (
    <View style={[estilos.colunaAcoesDestaque, estiloPersonalizado]}>
      {children}
    </View>
  );
}

/**
 * GRUPO DE OPÇÕES: GrupoBarraLateral
 */
export function GrupoBarraLateral({ children, estiloPersonalizado }) {
  return (
    <View style={[estilos.cartaoConteudo, estiloPersonalizado]}>
      {children}
    </View>
  );
}

/**
 * RÓTULO DO GRUPO: RotuloGrupoBarraLateral
 */
export function RotuloGrupoBarraLateral({ texto }) {
  return <Text style={estilos.menuContextualRotulo}>{texto}</Text>;
}

/**
 * MENU DE ITENS: MenuBarraLateral
 */
export function MenuBarraLateral({ children }) {
  return <View>{children}</View>;
}

/**
 * BOTÃO DE NAVEGAÇÃO: BotaoMenuBarraLateral
 * 
 * Para que serve:
 * Cada linha clicável do menu lateral com ícone, texto e destaque se estiver ativo.
 * 
 * @param {string} icone - Nome do ícone Feather posicionado à esquerda.
 * @param {boolean} estaAtivo - Define se é a tela atual exibida.
 * @param {function} aoPressionar - Ação disparada ao clicar.
 */
export function BotaoMenuBarraLateral({
  children,
  icone,
  estaAtivo = false,
  aoPressionar,
}) {
  const { fecharBarraLateral } = useBarraLateral();

  const lidarComToque = () => {
    fecharBarraLateral();
    if (aoPressionar) aoPressionar();
  };

  return (
    <TouchableOpacity
      onPress={lidarComToque}
      activeOpacity={0.7}
      style={[
        estilos.menuContextualItem,
        estaAtivo ? estilos.barraMenusBotaoAtivo : null,
      ]}
    >
      {icone ? (
        <Feather
          name={icone}
          size={16}
          color={estaAtivo ? cores.confirmar : cores.descricao}
        />
      ) : null}

      <Text
        style={[
          estilos.textoDescricao,
          estaAtivo ? estilos.grupoEscolhaTextoAtivo : null,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * LINHA SEPARADORA: SeparadorBarraLateral
 */
export function SeparadorBarraLateral() {
  return <View style={estilos.menuComandosSeparador} />;
}

export default BarraLateral;