/**
 * ============================================================================
 * ARQUIVO: MenuContextual.js (Substituto nativo do ContextMenu da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Fornecer um menu flutuante de ações contextuais acionado quando o usuário
 * pressiona e segura com o dedo (toque longo / onLongPress) sobre qualquer
 * elemento da tela (como um cartão de módulo, etapa ou anexo).
 * 
 * ADAPTAÇÃO MOBILE:
 * Substitui o clique do botão direito do mouse da Web pelo gesto de pressionar
 * e segurar (400 milissegundos), com fechamento automático ao tocar no fundo.
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
 * CONTEXTO: ContextoMenuContextual
 * 
 * Para que serve:
 * Controla e sincroniza a visibilidade do menu flutuante entre o gatilho de toque
 * longo e a janela de opções.
 */
const ContextoMenuContextual = createContext({
  menuAberto: false,
  abrirMenu: () => {},
  fecharMenu: () => {},
});

/**
 * COMPONENTE RAIZ: MenuContextual
 * 
 * Para que serve:
 * Provedor de estado que encapsula o gatilho e as opções do menu contextual.
 * 
 * @param {ReactNode} children - GatilhoMenuContextual e ConteudoMenuContextual.
 */
export function MenuContextual({ children }) {
  const [menuAberto, setMenuAberto] = useState(false);

  /**
   * Função: abrirMenu
   * O que faz: Torna o menu visível na tela.
   */
  const abrirMenu = () => setMenuAberto(true);

  /**
   * Função: fecharMenu
   * O que faz: Oculta o menu flutuante.
   */
  const fecharMenu = () => setMenuAberto(false);

  return (
    <ContextoMenuContextual.Provider value={{ menuAberto, abrirMenu, fecharMenu }}>
      {children}
    </ContextoMenuContextual.Provider>
  );
}

/**
 * COMPONENTE GATILHO: GatilhoMenuContextual
 * 
 * Para que serve:
 * Envolve o elemento (cartão, linha, imagem) que, ao ser pressionado e segurado,
 * abre o menu de ações.
 * 
 * @param {ReactNode} children - Elemento que receberá o toque longo.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function GatilhoMenuContextual({ children, estiloPersonalizado }) {
  const { abrirMenu } = useContext(ContextoMenuContextual);

  return (
    <TouchableOpacity
      onLongPress={abrirMenu} // Toque longo nativo
      delayLongPress={400}   // Dispara após segurar por 400ms
      activeOpacity={0.8}
      style={estiloPersonalizado}
    >
      {children}
    </TouchableOpacity>
  );
}

/**
 * COMPONENTE DE CONTEÚDO FLUTUANTE: ConteudoMenuContextual
 * 
 * Para que serve:
 * Renderiza o cartão visual flutuante sobre a tela com fundo semitransparente escuro.
 * Um toque em qualquer área fora do cartão fecha o menu instantaneamente.
 * 
 * @param {ReactNode} children - Itens de ação, separadores e rótulos do menu.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function ConteudoMenuContextual({ children, estiloPersonalizado }) {
  const { menuAberto, fecharMenu } = useContext(ContextoMenuContextual);

  return (
    <Modal
      transparent={true}
      visible={menuAberto}
      animationType="fade"
      onRequestClose={fecharMenu}
    >
      {/* FECHAMENTO AO TOCAR FORA: Detecta toque na área externa escura */}
      <TouchableWithoutFeedback onPress={fecharMenu}>
        <View style={estilos.fundoSobreposicao}>
          {/* Evita que toques dentro do menu o fechem sem querer */}
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
 * ITEM DE AÇÃO: ItemMenuContextual
 * 
 * Para que serve:
 * Representa uma linha clicável de ação no menu (ex: "Copiar", "Editar", "Remover").
 * Fecha o menu automaticamente após disparar a ação do usuário.
 * 
 * @param {function} aoPressionar - Função executada ao tocar no item.
 * @param {boolean} destrutivo - Se verdadeiro, estiliza o texto em Vermelho Alerta.
 * @param {boolean} desabilitado - Impede o clique e esmaece o item.
 * @param {string} icone - Nome do ícone Feather opcional posicionado à esquerda.
 */
export function ItemMenuContextual({
  children,
  aoPressionar,
  destrutivo = false,
  desabilitado = false,
  icone,
}) {
  const { fecharMenu } = useContext(ContextoMenuContextual);

  /**
   * Função: lidarComToque
   * O que faz: Fecha o modal flutuante e executa o callback fornecido pela tela mãe.
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
 * ITEM DE MARCAÇÃO: ItemMenuSelecao
 * 
 * Para que serve:
 * Exibe uma opção que pode ser ativada ou desativada, mostrando um visto (check) em Verde Petronas.
 * 
 * @param {boolean} selecionado - Define se o visto deve ser exibido.
 * @param {function} aoPressionar - Notifica o novo estado invertido.
 */
export function ItemMenuSelecao({
  children,
  selecionado = false,
  aoPressionar,
}) {
  const { fecharMenu } = useContext(ContextoMenuContextual);

  const lidarComToque = () => {
    fecharMenu();
    if (aoPressionar) aoPressionar(!selecionado);
  };

  return (
    <TouchableOpacity
      style={estilos.menuContextualItem}
      onPress={lidarComToque}
      activeOpacity={0.7}
    >
      {/* Espaço fixo reservado para o visto sem estilo inline */}
      <View style={estilos.barraMenusEspacoIcone}>
        {selecionado ? (
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
 * RÓTULO DO GRUPO: RotuloMenuContextual
 * 
 * Para que serve:
 * Título de seção em caixa alta discreta para separar blocos de ações.
 */
export function RotuloMenuContextual({ texto }) {
  return <Text style={estilos.menuContextualRotulo}>{texto}</Text>;
}

/**
 * SEPARADOR: SeparadorMenuContextual
 * 
 * Para que serve:
 * Linha horizontal divisória sutil entre categorias de ações.
 */
export function SeparadorMenuContextual() {
  return <View style={estilos.menuComandosSeparador} />;
}

export default MenuContextual;