/**
 * ============================================================================
 * ARQUIVO: BarraDeMenus.js
 * 
 * PROPÓSITO:
 * Barra horizontal de ferramentas e opções ("Estratégia", "Exportar", "Ajuda").
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes vêm de estilos/index.js. Zero estilos inline.
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

const ContextoBarraDeMenus = createContext({
  menuAtivo: null,
  setMenuAtivo: () => {},
});

/**
 * COMPONENTE RAIZ: BarraDeMenus
 */
export function BarraDeMenus({ children, estiloPersonalizado }) {
  const [menuAtivo, setMenuAtivo] = useState(null);

  return (
    <ContextoBarraDeMenus.Provider value={{ menuAtivo, setMenuAtivo }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={estilos.barraMenusContainer}
        style={[estilos.barraMenusRolagem, estiloPersonalizado]}
      >
        {children}
      </ScrollView>
    </ContextoBarraDeMenus.Provider>
  );
}

/**
 * MENU INDIVIDUAL: MenuDaBarra
 */
export function MenuDaBarra({ rotulo, children }) {
  const { menuAtivo, setMenuAtivo } = useContext(ContextoBarraDeMenus);
  const esteMenuEstaAberto = menuAtivo === rotulo;

  const alternarMenu = () => {
    setMenuAtivo(esteMenuEstaAberto ? null : rotulo);
  };

  const fecharMenu = () => setMenuAtivo(null);

  return (
    <View>
      <TouchableOpacity
        onPress={alternarMenu}
        activeOpacity={0.7}
        style={esteMenuEstaAberto ? estilos.barraMenusBotaoAtivo : estilos.barraMenusBotaoInativo}
      >
        <Text style={esteMenuEstaAberto ? estilos.barraMenusTextoAtivo : estilos.barraMenusTextoInativo}>
          {rotulo}
        </Text>
      </TouchableOpacity>

      {esteMenuEstaAberto ? (
        <Modal
          transparent={true}
          visible={esteMenuEstaAberto}
          animationType="fade"
          onRequestClose={fecharMenu}
        >
          <TouchableWithoutFeedback onPress={fecharMenu}>
            <View style={estilos.fundoSobreposicao}>
              <TouchableWithoutFeedback>
                <View style={estilos.menuContextualCartao}>
                  <Text style={estilos.menuContextualRotulo}>{rotulo}</Text>
                  {children}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      ) : null}
    </View>
  );
}

/**
 * ITEM DE AÇÃO: ItemMenuDaBarra
 */
export function ItemMenuDaBarra({
  children,
  aoPressionar,
  destrutivo = false,
  desabilitado = false,
  icone,
}) {
  const { setMenuAtivo } = useContext(ContextoBarraDeMenus);

  const lidarComToque = () => {
    if (desabilitado) return;
    setMenuAtivo(null);
    if (aoPressionar) aoPressionar();
  };

  return (
    <TouchableOpacity
      onPress={lidarComToque}
      disabled={desabilitado}
      activeOpacity={0.7}
      style={[
        estilos.menuContextualItem,
        desabilitado && estilos.botaoDesabilitado,
      ]}
    >
      {icone ? (
        <Feather
          name={icone}
          size={14}
          color={destrutivo ? cores.cancelar : cores.confirmar}
        />
      ) : null}

      <Text
        style={[
          estilos.textoDescricao,
          destrutivo && estilos.textoResultadoFalha,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * ITEM SELEÇÃO: ItemSelecaoMenuDaBarra
 */
export function ItemSelecaoMenuDaBarra({
  children,
  marcado = false,
  aoAlternar,
}) {
  const { setMenuAtivo } = useContext(ContextoBarraDeMenus);

  const lidarComToque = () => {
    setMenuAtivo(null);
    if (aoAlternar) aoAlternar(!marcado);
  };

  return (
    <TouchableOpacity
      onPress={lidarComToque}
      activeOpacity={0.7}
      style={estilos.menuContextualItem}
    >
      <View style={estilos.barraMenusEspacoIcone}>
        {marcado ? (
          <Feather name="check" size={14} color={cores.confirmar} />
        ) : null}
      </View>
      <Text style={estilos.textoDescricao}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * SEPARADOR: SeparadorMenuDaBarra
 */
export function SeparadorMenuDaBarra() {
  return <View style={estilos.menuComandosSeparador} />;
}

export default BarraDeMenus;