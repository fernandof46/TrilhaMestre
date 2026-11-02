/**
 * ============================================================================
 * ARQUIVO: GavetaInferior.js (Substituto nativo do Drawer / Vaul da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Fornecer um painel deslizante que sobe da base da tela (padrão Bottom Sheet).
 * Ideal para menus de ações rápidas, formulários rápidos e filtros sem precisar
 * navegar para outra tela ou recarregar a página.
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
  TouchableWithoutFeedback,
} from 'react-native';
import { estilos } from './estilos';

/**
 * CONTEXTO DE SINCRONIZAÇÃO: ContextoGavetaInferior
 * 
 * Para que serve:
 * Permite que subcomponentes em qualquer nível da árvore (como o Gatilho e o Botão Fechar)
 * compartilhem o mesmo estado de visibilidade sem necessidade de repassar propriedades
 * manualmente de pai para filho (evitando "prop drilling").
 */
const ContextoGavetaInferior = createContext({
  estaAberto: false,
  abrirGaveta: () => {},
  fecharGaveta: () => {},
});

/**
 * COMPONENTE RAIZ: GavetaInferior
 * 
 * Para que serve:
 * Gerencia a máquina de estados (aberto/fechado) do painel deslizante e provê
 * as funções de abertura e fechamento para todos os elementos filhos via Context API.
 * 
 * @param {boolean} aberto - Propriedade opcional para controlar a gaveta externamente por uma tela mãe.
 * @param {function} aoAlterarAberto - Notifica o componente pai sobre mudanças no estado da gaveta.
 * @param {ReactNode} children - Os blocos filhos (Gatilho, Conteudo, etc.).
 */
export function GavetaInferior({ aberto, aoAlterarAberto, children }) {
  // Estado interno autônomo (usado quando o desenvolvedor não gerencia o estado na tela mãe)
  const [abertoInterno, setAbertoInterno] = useState(false);

  // Define se a prioridade de controle é externa (via prop) ou interna (via state local)
  const estaAberto = aberto !== undefined ? aberto : abertoInterno;

  /**
   * Função: abrirGaveta
   * O que faz: Altera o estado para verdadeiro (true), disparando a renderização do Modal.
   */
  const abrirGaveta = () => {
    if (aoAlterarAberto) aoAlterarAberto(true);
    else setAbertoInterno(true);
  };

  /**
   * Função: fecharGaveta
   * O que faz: Altera o estado para falso (false), recolhendo a gaveta de volta para a base.
   */
  const fecharGaveta = () => {
    if (aoAlterarAberto) aoAlterarAberto(false);
    else setAbertoInterno(false);
  };

  return (
    <ContextoGavetaInferior.Provider value={{ estaAberto, abrirGaveta, fecharGaveta }}>
      {children}
    </ContextoGavetaInferior.Provider>
  );
}

/**
 * COMPONENTE GATILHO: GatilhoGaveta
 * 
 * Para que serve:
 * Encapsula o elemento gráfico (botão, texto, ícone) que o usuário toca para
 * fazer a gaveta deslizar para cima.
 * 
 * @param {ReactNode} children - O elemento visual que servirá de botão de abertura.
 * @param {object} estiloPersonalizado - Estilo visual extra vindo de estilos/index.js.
 */
export function GatilhoGaveta({ children, estiloPersonalizado }) {
  // Consome a função de abertura fornecida pelo ContextoGavetaInferior
  const { abrirGaveta } = useContext(ContextoGavetaInferior);

  return (
    <TouchableOpacity
      onPress={abrirGaveta}
      activeOpacity={0.8}
      style={estiloPersonalizado}
    >
      {children}
    </TouchableOpacity>
  );
}

/**
 * COMPONENTE DE CONTEÚDO PRINCIPAL: ConteudoGaveta
 * 
 * Para que serve:
 * Renderiza o painel visual que sobe do rodapé da tela. Inclui:
 * 1. Modal nativo com animação de deslize ('slide').
 * 2. Fechamento automático ao tocar no fundo escuro fora do painel.
 * 3. Alça visual centralizada que indica ao usuário que o painel é recolhível.
 * 4. Proteção contra o teclado virtual do celular (KeyboardAvoidingView).
 * 
 * @param {ReactNode} children - Os elementos que ficarão dentro da gaveta.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function ConteudoGaveta({ children, estiloPersonalizado }) {
  const { estaAberto, fecharGaveta } = useContext(ContextoGavetaInferior);

  return (
    <Modal
      transparent={true}
      visible={estaAberto}
      animationType="slide" // Garante animação nativa subindo do fundo
      onRequestClose={fecharGaveta} // Suporte ao botão físico de voltar do Android
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={estilos.fundoModalChatTutor}
      >
        {/* ÁREA DE FECHAMENTO: Toque fora do cartão recolhe a gaveta */}
        <TouchableWithoutFeedback onPress={fecharGaveta}>
          <View style={estilos.containerPrincipal} />
        </TouchableWithoutFeedback>

        {/* CORPO DO PAINEL: Caixa com cantos superiores arredondados */}
        <View style={[estilos.painelConteudoChatTutor, estiloPersonalizado]}>
          
          {/* ALÇA CENTRAL DE PUXAR (Padrão visual de Bottom Sheet) */}
          <View style={estilos.areaTitulo}>
            <View style={estilos.trilhoBarraProgresso} />
          </View>

          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/**
 * CABEÇALHO DA GAVETA: CabecalhoGaveta
 * 
 * Para que serve:
 * Agrupa o título e a descrição da gaveta com os espaçamentos padronizados.
 */
export function CabecalhoGaveta({ children, estiloPersonalizado }) {
  return (
    <View style={[estilos.cartaoCabecalho, estiloPersonalizado]}>
      {children}
    </View>
  );
}

/**
 * TÍTULO DA GAVETA: TituloGaveta
 * 
 * Para que serve:
 * Exibe o nome principal da gaveta em negrito com tipografia Mercedes F1.
 * Trata automaticamente se o desenvolvedor passar texto puro ou componentes filhos.
 */
export function TituloGaveta({ children, estiloPersonalizado }) {
  return typeof children === 'string' ? (
    <Text style={[estilos.textoTituloTrilha, estiloPersonalizado]}>
      {children}
    </Text>
  ) : (
    children
  );
}

/**
 * DESCRIÇÃO DA GAVETA: DescricaoGaveta
 * 
 * Para que serve:
 * Subtítulo explicativo em tom discreto que orienta o usuário sobre as opções da gaveta.
 */
export function DescricaoGaveta({ children, estiloPersonalizado }) {
  return typeof children === 'string' ? (
    <Text style={[estilos.cartaoDescricao, estiloPersonalizado]}>
      {children}
    </Text>
  ) : (
    children
  );
}

/**
 * RODAPÉ DA GAVETA: RodapeGaveta
 * 
 * Para que serve:
 * Área inferior alinhada em coluna com espaçamento padronizado para os botões de ação.
 */
export function RodapeGaveta({ children, estiloPersonalizado }) {
  return (
    <View style={[estilos.colunaAcoesDestaque, estiloPersonalizado]}>
      {children}
    </View>
  );
}

/**
 * BOTÃO DE FECHAR EMBUTIDO: FecharGaveta
 * 
 * Para que serve:
 * Transforma qualquer botão ou texto interno em um gatilho de fechamento da gaveta,
 * permitindo executar uma ação de limpeza ou conclusão simultaneamente.
 * 
 * @param {function} aoFechar - Callback opcional executado no momento do clique.
 */
export function FecharGaveta({ children, aoFechar }) {
  const { fecharGaveta } = useContext(ContextoGavetaInferior);

  const lidarComToque = () => {
    fecharGaveta();
    if (aoFechar) aoFechar();
  };

  return (
    <TouchableOpacity onPress={lidarComToque} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}

export default GavetaInferior;