/**
 * ============================================================================
 * ARQUIVO: MenuSuspenso.js (Substituto nativo do DropdownMenu da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Fornecer um menu flutuante de ações acionado por um toque simples comum (onPress)
 * em botões de opções (como o ícone de três pontinhos "..." ou "Mais Opções").
 * 
 * DIFERENÇA ENTRE OS MENUS DO APP:
 * - MenuContextual: Acionado ao "pressionar e segurar" (toque longo / 400ms).
 * - MenuSuspenso: Acionado com um "toque simples" rápido.
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
  TouchableWithoutFeedback,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * CONTEXTO DE CONTROLE: ContextoMenuSuspenso
 * 
 * Para que serve:
 * Gerencia a comunicação entre o botão que o usuário toca (gatilho) e o cartão
 * flutuante que renderiza as opções disponíveis.
 */
const ContextoMenuSuspenso = createContext({
  menuAberto: false,
  abrirMenu: () => {},
  fecharMenu: () => {},
});

/**
 * COMPONENTE RAIZ: MenuSuspenso
 * 
 * Para que serve:
 * Provedor do estado de visibilidade da lista suspensa.
 * 
 * @param {ReactNode} children - GatilhoMenuSuspenso e ConteudoMenuSuspenso.
 */
export function MenuSuspenso({ children }) {
  const [menuAberto, setMenuAberto] = useState(false);

  /**
   * Função: abrirMenu
   * O que faz: Altera o estado para verdadeiro (true), tornando as opções visíveis.
   */
  const abrirMenu = () => setMenuAberto(true);

  /**
   * Função: fecharMenu
   * O que faz: Altera o estado para falso (false), ocultando o menu.
   */
  const fecharMenu = () => setMenuAberto(false);

  return (
    <ContextoMenuSuspenso.Provider value={{ menuAberto, abrirMenu, fecharMenu }}>
      {children}
    </ContextoMenuSuspenso.Provider>
  );
}

/**
 * COMPONENTE GATILHO: GatilhoMenuSuspenso
 * 
 * Para que serve:
 * Envolve o botão que, ao receber um toque simples comum, abre a lista flutuante.
 * 
 * @param {ReactNode} children - Botão de 3 pontinhos, ícone ou texto.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function GatilhoMenuSuspenso({ children, estiloPersonalizado }) {
  const { abrirMenu } = useContext(ContextoMenuSuspenso);

  return (
    <TouchableOpacity
      onPress={abrirMenu} // Toque simples nativo
      activeOpacity={0.7}
      style={estiloPersonalizado}
    >
      {children}
    </TouchableOpacity>
  );
}

/**
 * COMPONENTE DE CONTEÚDO FLUTUANTE: ConteudoMenuSuspenso
 * 
 * Para que serve:
 * Renderiza o painel flutuante sobre a tela com fundo semitransparente escuro.
 * Um toque fora da área do menu fecha o painel automaticamente.
 * 
 * @param {ReactNode} children - Itens de ação, separadores e rótulos.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function ConteudoMenuSuspenso({ children, estiloPersonalizado }) {
  const { menuAberto, fecharMenu } = useContext(ContextoMenuSuspenso);

  return (
    <Modal
      transparent={true}
      visible={menuAberto}
      animationType="fade"
      onRequestClose={fecharMenu}
    >
      {/* FECHAMENTO AO TOCAR FORA: Detecta toque na área escura */}
      <TouchableWithoutFeedback onPress={fecharMenu}>
        <View style={estilos.fundoSobreposicao}>
          {/* Evita que toques dentro do cartão fechem o menu sem querer */}
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
 * ITEM DE AÇÃO: ItemMenuSuspenso
 * 
 * Para que serve:
 * Linha de opção clicável (ex: "Editar", "Compartilhar", "Excluir").
 * Fecha o menu automaticamente após disparar a ação do usuário.
 * 
 * @param {function} aoPressionar - Callback executado ao tocar na opção.
 * @param {boolean} destrutivo - Se verdadeiro, estiliza em Vermelho Alerta.
 * @param {boolean} desabilitado - Impede o clique e esmaece a linha.
 * @param {string} icone - Nome do ícone Feather opcional posicionado à esquerda.
 */
export function ItemMenuSuspenso({
  children,
  aoPressionar,
  destrutivo = false,
  desabilitado = false,
  icone,
}) {
  const { fecharMenu } = useContext(ContextoMenuSuspenso);

  /**
   * Função: lidarComToque
   * O que faz: Fecha a janela flutuante e executa a ação solicitada pelo usuário.
   */
  const lidarComToque = () => {
    if (desabilitado) return;
    fecharMenu();
    if (aoPressionar) aoPressionar();
  };

  return (
    <TouchableOpacity
      style={[
        estilos.menuContextualItem,
        desabilitado && estilos.botaoDesabilitado,
      ]}
      onPress={lidarComToque}
      disabled={desabilitado}
      activeOpacity={0.7}
    >
      {/* Ícone posicionado à esquerda */}
      {icone ? (
        <Feather
          name={icone}
          size={14}
          color={destrutivo ? cores.cancelar : cores.confirmar}
        />
      ) : null}

      {/* Texto do item com adaptação de cor sem estilo inline */}
      <Text
        style={[
          estilos.textoDescricao,
          destrutivo ? estilos.textoResultadoFalha : estilos.grupoEscolhaTextoAtivo,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * ITEM COM VISTO (CHECKBOX): ItemSelecaoMenuSuspenso
 * 
 * Para que serve:
 * Exibe uma opção que pode ser ligada/desligada com um visto em Verde Petronas.
 * 
 * @param {boolean} marcado - Define se o visto está visível.
 * @param {function} aoAlterar - Notifica o novo estado invertido.
 */
export function ItemSelecaoMenuSuspenso({
  children,
  marcado = false,
  aoAlterar,
}) {
  const { fecharMenu } = useContext(ContextoMenuSuspenso);

  const lidarComToque = () => {
    fecharMenu();
    if (aoAlterar) aoAlterar(!marcado);
  };

  return (
    <TouchableOpacity
      style={estilos.menuContextualItem}
      onPress={lidarComToque}
      activeOpacity={0.7}
    >
      {/* Espaço fixo reservado para o visto sem estilo inline */}
      <View style={estilos.barraMenusEspacoIcone}>
        {marcado ? (
          <Feather name="check" size={14} color={cores.confirmar} />
        ) : null}
      </View>

      <Text style={[estilos.textoDescricao, estilos.grupoEscolhaTextoAtivo]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * RÓTULO DE SEÇÃO: RotuloMenuSuspenso
 * 
 * Para que serve:
 * Título de cabeçalho interno discreto para categorizar as opções.
 */
export function RotuloMenuSuspenso({ texto }) {
  return <Text style={estilos.menuContextualRotulo}>{texto}</Text>;
}

/**
 * LINHA SEPARADORA: SeparadorMenuSuspenso
 * 
 * Para que serve:
 * Divisor horizontal sutil entre grupos de ações.
 */
export function SeparadorMenuSuspenso() {
  return <View style={estilos.menuComandosSeparador} />;
}

/**
 * GRUPO DE ITENS: GrupoMenuSuspenso
 * 
 * Para que serve:
 * Agrupador semântico para listas de opções relacionadas.
 */
export function GrupoMenuSuspenso({ children }) {
  return <View>{children}</View>;
}

export default MenuSuspenso;