/**
 * ============================================================================
 * ARQUIVO: DicaFlutuante.js (Substituto nativo do Tooltip da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Exibir pequenas mensagens de auxílio ou descrições rápidas (tooltips) que
 * surgem sobre um ícone ou botão para explicar sua função ao usuário sem
 * poluir a interface principal.
 * 
 * ADAPTAÇÃO MOBILE:
 * No mobile, a dica é disparada por um toque longo (onLongPress) ou toque simples,
 * aparecendo como um pequeno balão flutuante centralizado ou próximo ao elemento.
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
import { estilos } from './estilos';
import { cores } from './cores';

// Contexto para controlar a visibilidade da dica entre o gatilho e o conteúdo
const ContextoDicaFlutuante = createContext({
  visivel: false,
  abrirDica: () => {},
  fecharDica: () => {},
});

/**
 * COMPONENTE RAIZ: DicaFlutuante
 * 
 * Para que serve:
 * Provedor de estado que gerencia se a dica deve estar visível ou oculta.
 * 
 * @param {ReactNode} children - GatilhoDicaFlutuante e ConteudoDicaFlutuante.
 */
export function DicaFlutuante({ children }) {
  const [visivel, setVisivel] = useState(false);

  const abrirDica = () => setVisivel(true);
  const fecharDica = () => setVisivel(false);

  return (
    <ContextoDicaFlutuante.Provider value={{ visivel, abrirDica, fecharDica }}>
      {children}
    </ContextoH laSFlutuante.Provider>
  );
}

/**
 * GATILHO: GatilhoDicaFlutuante
 * 
 * Para que serve:
 * O elemento (geralmente um ícone de interrogação ou info) que, ao ser tocado,
 * revela a dica informativa.
 * 
 * @param {ReactNode} children - Elemento visual que dispara a dica.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function GatilhoDicaFlutuante({ children, estiloPersonalizado }) {
  const { abrirDica } = useContext(ContextoDicaFlutuante);

  return (
    <TouchableOpacity
      onPress={abrirDica}
      activeOpacity={0.7}
      style={estiloPersonalizado}
    >
      {children}
    </TouchableOpacity>
  );
}

/**
 * CONTEÚDO DA DICA: ConteudoDicaFlutuante
 * 
 * Para que serve:
 * Renderiza o pequeno balão informativo em Verde Petronas com texto branco.
 * Fecha automaticamente ao tocar em qualquer lugar fora do balão.
 * 
 * @param {//string} texto - A mensagem de ajuda a ser exibida.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function ConteudoDicaFlutuante({ texto, estiloPersonalizado }) {
  const { visivel, fecharDica } = useContext(ContextoDicaFlutuante);

  return (
    <Modal
      transparent={true}
      visible={visivel}
      animationType="fade"
      onRequestClose={fecharDica}
    >
      <TouchableWithoutFeedback onPress={fecharDica}>
        <View style={estilos.fundoSobreposicao}>
          <TouchableWithoutFeedback>
            <View
              style={[
                estilos.menuContextualCartao,
                {
                  width: 180,
                  padding: 8,
                  backgroundColor: cores.confirmar, // Destaque Petronas para a dica
                  borderColor: cores.confirmar,
                },
                estiloPersonalizado,
              ]}
            >
              <Text
                style={[
                  estilos.textoDescricao,
                  { color: cores.botoesTexto, textAlign: 'center', fontSize: 11 },
                ]}
              >
                {texto}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

// Aliases em inglês para manter 100% de compatibilidade com imports legados
export const Tooltip = DicaFlutuante;
export const TooltipTrigger = GatilhoDicaFlutuante;
export const TooltipContent = ConteudoDicaFlutuante;
export const TooltipProvider = DicaFlutuante;

export default DicaFlutuante;