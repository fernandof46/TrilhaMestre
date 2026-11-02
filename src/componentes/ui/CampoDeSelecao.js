/**
 * ============================================================================
 * ARQUIVO: CampoDeSelecao.js (Substituto nativo do Select do Radix/shadcn)
 * 
 * FINALIDADE DO ARQUIVO:
 * Fornecer uma caixa de seleção suspensa elegante para formulários (por exemplo:
 * selecionar o nível de estudo, categoria da trilha, idioma ou prazo).
 * 
 * ADAPTAÇÃO MOBILE:
 * Substitui o elemento <select> da Web por um botão estilizado no padrão F1
 * que abre um modal com as opções e marca a alternativa ativa com visto verde.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js. Zero estilos inline.
 * 
 * ARQUITETURA EM BLOCOS (Composição React):
 * <CampoDeSelecao valor={nivel} aoMudarValor={setNivel}>
 *    <GatilhoCampoDeSelecao>
 *       <ValorCampoDeSelecao marcadorTexto="Selecione o nível..." />
 *    </GatilhoCampoDeSelecao>
 *    <ConteudoCampoDeSelecao>
 *       <RotuloCampoDeSelecao texto="Dificuldade" />
 *       <ItemCampoDeSelecao valor="iniciante">Iniciante</ItemCampoDeSelecao>
 *       <ItemCampoDeSelecao valor="avancado">Avançado</ItemCampoDeSelecao>
 *    </ConteudoCampoDeSelecao>
 * </CampoDeSelecao>
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
 * CONTEXTO DE SELEÇÃO: ContextoCampoDeSelecao
 * 
 * Para que serve:
 * Sincroniza o valor selecionado, o rótulo de exibição e o estado de visibilidade
 * do modal entre o botão gatilho e as opções da lista.
 */
const ContextoCampoDeSelecao = createContext({
  valorSelecionado: '',
  rotuloExibicao: '',
  modalVisivel: false,
  abrirModal: () => {},
  fecharModal: () => {},
  selecionarOpcao: () => {},
});

/**
 * COMPONENTE RAIZ: CampoDeSelecao
 * 
 * Para que serve:
 * Provedor do estado do seletor que gerencia o valor atual e o fechamento do modal.
 * 
 * @param {string} valor - Valor da opção atualmente escolhida.
 * @param {function} aoMudarValor - Notifica o componente pai sobre a nova seleção.
 * @param {ReactNode} children - GatilhoCampoDeSelecao e ConteudoCampoDeSelecao.
 */
export function CampoDeSelecao({ valor, aoMudarValor, children }) {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [rotuloExibicao, setRotuloExibicao] = useState('');

  const abrirModal = () => setModalVisivel(true);
  const fecharModal = () => setModalVisivel(false);

  /**
   * Função: selecionarOpcao
   * O que faz: Atualiza o valor, define o rótulo visual, fecha o modal e avisa a tela mãe.
   */
  const selecionarOpcao = (novoValor, novoRotulo) => {
    setRotuloExibicao(novoRotulo);
    fecharModal();
    if (aoMudarValor) {
      aoMudarValor(novoValor);
    }
  };

  return (
    <ContextoCampoDeSelecao.Provider
      value={{
        valorSelecionado: valor,
        rotuloExibicao,
        modalVisivel,
        abrirModal,
        fecharModal,
        selecionarOpcao,
      }}
    >
      {children}
    </ContextoCampoDeSelecao.Provider>
  );
}

/**
 * GATILHO: GatilhoCampoDeSelecao
 * 
 * Para que serve:
 * O campo com borda e seta para baixo que o usuário toca para abrir as opções.
 * 
 * @param {boolean} desabilitado - Impede o toque e esmaece o campo.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function GatilhoCampoDeSelecao({
  children,
  desabilitado = false,
  estiloPersonalizado,
}) {
  const { abrirModal } = useContext(ContextoCampoDeSelecao);

  return (
    <TouchableOpacity
      onPress={abrirModal}
      disabled={desabilitado}
      activeOpacity={0.7}
      style={[
        estilos.menuComandosLinhaEntrada,
        desabilitado && estilos.botaoDesabilitado,
        estiloPersonalizado,
      ]}
    >
      <View style={estilos.gatilhoSanfona}>
        {children}
        <Feather name="chevron-down" size={16} color={cores.descricao} />
      </View>
    </TouchableOpacity>
  );
}

/**
 * VALOR EXIBIDO: ValorCampoDeSelecao
 * 
 * Para que serve:
 * Exibe o texto da opção que está selecionada ou a dica (placeholder) se nada foi escolhido.
 * 
 * @param {string} marcadorTexto - Texto de dica (ex: "Selecione uma opção...").
 */
export function ValorCampoDeSelecao({ marcadorTexto = 'Selecione...' }) {
  const { rotuloExibicao, valorSelecionado } = useContext(ContextoCampoDeSelecao);

  const textoFinal = rotuloExibicao || valorSelecionado || marcadorTexto;
  const possuiValor = Boolean(rotuloExibicao || valorSelecionado);

  return (
    <Text
      style={[
        estilos.textoDescricao,
        possuiValor ? estilos.grupoEscolhaTextoAtivo : null,
      ]}
    >
      {textoFinal}
    </Text>
  );
}

/**
 * CONTEÚDO SUSPENSO: ConteudoCampoDeSelecao
 * 
 * Para que serve:
 * Janela modal com fundo escuro que abriga a lista rolável de opções.
 * Fecha automaticamente ao tocar no fundo fora do cartão.
 */
export function ConteudoCampoDeSelecao({ children, estiloPersonalizado }) {
  const { modalVisivel, fecharModal } = useContext(ContextoCampoDeSelecao);

  return (
    <Modal
      transparent={true}
      visible={modalVisivel}
      animationType="fade"
      onRequestClose={fecharModal}
    >
      {/* FECHAMENTO AO TOCAR FORA */}
      <TouchableWithoutFeedback onPress={fecharModal}>
        <View style={estilos.fundoSobreposicao}>
          <TouchableWithoutFeedback>
            <View style={[estilos.menuContextualCartao, estiloPersonalizado]}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {children}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

/**
 * ITEM DE OPÇÃO: ItemCampoDeSelecao
 * 
 * Para que serve:
 * Cada opção clicável da lista. Se estiver selecionada, exibe o visto verde.
 * 
 * @param {string} valor - Valor da opção associada.
 */
export function ItemCampoDeSelecao({ valor, children }) {
  const { valorSelecionado, selecionarOpcao } = useContext(ContextoCampoDeSelecao);
  const estaSelecionado = valorSelecionado === valor;
  const textoOpcao = typeof children === 'string' ? children : valor;

  return (
    <TouchableOpacity
      onPress={() => selecionarOpcao(valor, textoOpcao)}
      activeOpacity={0.7}
      style={estilos.menuContextualItem}
    >
      {/* Espaço reservado para o visto em Verde Petronas */}
      <View style={estilos.barraMenusEspacoIcone}>
        {estaSelecionado ? (
          <Feather name="check" size={14} color={cores.confirmar} />
        ) : null}
      </View>

      <Text
        style={[
          estilos.textoDescricao,
          estaSelecionado ? estilos.grupoEscolhaTextoAtivo : null,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * RÓTULO DO GRUPO: RotuloCampoDeSelecao
 */
export function RotuloCampoDeSelecao({ texto }) {
  return <Text style={estilos.menuContextualRotulo}>{texto}</Text>;
}

/**
 * LINHA SEPARADORA: SeparadorCampoDeSelecao
 */
export function SeparadorCampoDeSelecao() {
  return <View style={estilos.menuComandosSeparador} />;
}

/**
 * AGRUPADOR: GrupoCampoDeSelecao
 */
export function GrupoCampoDeSelecao({ children }) {
  return <View>{children}</View>;
}

export default CampoDeSelecao;