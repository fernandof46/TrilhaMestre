/**
 * ============================================================================
 * ARQUIVO: MenuDeComandos.js (Substituto nativo do Command / cmdk da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Fornecer uma paleta de comandos inteligentes e barra de busca rápida.
 * Permite ao usuário pesquisar trilhas, módulos, atalhos de configuração
 * e ações imediatas com filtragem reativa em tempo real enquanto digita.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js. Zero estilos inline.
 * ============================================================================
 */

import React, { createContext, useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * CONTEXTO DE BUSCA: ContextoMenuComandos
 * 
 * Para que serve:
 * Distribui o termo digitado na barra de pesquisa para que todos os itens filhos
 * (ItemDeComando e ComandoVazio) filtrem a si mesmos em tempo real.
 */
const ContextoMenuComandos = createContext({
  termoPesquisa: '',
  setTermoPesquisa: () => {},
});

/**
 * COMPONENTE RAIZ: MenuDeComandos
 * 
 * Para que serve:
 * Provedor do estado de busca e contêiner visual com bordas arredondadas e fundo carbono.
 * 
 * @param {ReactNode} children - EntradaDePesquisaComando e ListaDeComandos.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function MenuDeComandos({ children, estiloPersonalizado }) {
  const [termoPesquisa, setTermoPesquisa] = useState('');

  return (
    <ContextoMenuComandos.Provider value={{ termoPesquisa, setTermoPesquisa }}>
      <View style={[estilos.menuComandosContainer, estiloPersonalizado]}>
        {children}
      </View>
    </ContextoMenuComandos.Provider>
  );
}

/**
 * DIÁLOGO MODAL: DialogoDeComandos
 * 
 * Para que serve:
 * Exibe o menu de comandos como um popup flutuante sobre a tela atual,
 * com fundo escuro semitransparente e suporte a teclado nativo.
 * 
 * @param {boolean} visivel - Controla a exibição do modal.
 * @param {function} aoFechar - Notifica quando a janela deve ser fechada.
 */
export function DialogoDeComandos({ visivel, aoFechar, children }) {
  return (
    <Modal
      transparent={true}
      visible={visivel}
      animationType="fade"
      onRequestClose={aoFechar}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={estilos.fundoSobreposicao}
      >
        <View style={estilos.janelaModalCartao}>
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/**
 * CAMPO DE ENTRADA: EntradaDePesquisaComando
 * 
 * Para que serve:
 * Campo de texto com ícone de lupa em Verde Petronas e botão de limpar (X).
 * 
 * @param {string} marcadorTexto - Dica exibida quando o campo está vazio.
 */
export function EntradaDePesquisaComando({
  marcadorTexto = 'Digite um comando ou pesquise...',
  estiloPersonalizado,
}) {
  const { termoPesquisa, setTermoPesquisa } = useContext(ContextoMenuComandos);

  return (
    <View style={[estilos.menuComandosLinhaEntrada, estiloPersonalizado]}>
      {/* Ícone de lupa em destaque Petronas */}
      <Feather name="search" size={16} color={cores.confirmar} />

      <TextInput
        style={estilos.menuComandosCampoTexto}
        value={termoPesquisa}
        onChangeText={setTermoPesquisa}
        placeholder={marcadorTexto}
        placeholderTextColor={cores.descricao}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Botão de limpar texto (X) exibido apenas se houver algo digitado */}
      {termoPesquisa.length > 0 ? (
        <TouchableOpacity onPress={() => setTermoPesquisa('')} hitSlop={10}>
          <Feather name="x" size={14} color={cores.descricao} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

/**
 * LISTA DE ITENS: ListaDeComandos
 * 
 * Para que serve:
 * Área rolável vertical suave para exibir os resultados encontrados.
 */
export function ListaDeComandos({ children, estiloPersonalizado }) {
  return (
    <ScrollView
      style={[estilos.menuComandosLista, estiloPersonalizado]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled" // Permite tocar em itens mesmo com o teclado aberto
    >
      {children}
    </ScrollView>
  );
}

/**
 * AVISO DE LISTA VAZIA: ComandoVazio
 * 
 * Para que serve:
 * Exibe uma mensagem amigável quando o termo pesquisado não coincide com nenhum item.
 * 
 * @param {string} mensagem - Texto exibido quando nada é encontrado.
 */
export function ComandoVazio({ mensagem = 'Nenhum resultado encontrado.' }) {
  const { termoPesquisa } = useContext(ContextoMenuComandos);

  // Não exibe nada se o usuário ainda não digitou nada
  if (!termoPesquisa) return null;

  return (
    <View style={estilos.areaTitulo}>
      <Text style={estilos.textoDescricao}>{mensagem}</Text>
    </View>
  );
}

/**
 * GRUPO DE ITENS: GrupoDeComandos
 * 
 * Para que serve:
 * Agrupa itens por categorias (ex: "Trilhas Recentes", "Navegação").
 * 
 * @param {string} titulo - Nome da categoria.
 */
export function GrupoDeComandos({ titulo, children }) {
  return (
    <View style={estilos.linhaInfoProgresso}>
      {titulo ? (
        <Text style={estilos.menuComandosTituloGrupo}>{titulo}</Text>
      ) : null}
      {children}
    </View>
  );
}

/**
 * ITEM DE AÇÃO: ItemDeComando
 * 
 * Para que serve:
 * Cada linha clicável. Contém inteligência de auto-ocultação: se o usuário digitou
 * um termo que não bate com o texto do item, ele se esconde automaticamente.
 * 
 * @param {function} aoSelecionar - Callback chamado ao tocar na opção.
 * @param {string} textoFiltro - Palavra-chave opcional para guiar o filtro de busca.
 * @param {boolean} desabilitado - Se verdadeiro, impede o clique.
 */
export function ItemDeComando({
  children,
  aoSelecionar,
  textoFiltro = '',
  desabilitado = false,
  estiloPersonalizado,
}) {
  const { termoPesquisa } = useContext(ContextoMenuComandos);

  // Lógica de filtragem em tempo real (insensível a maiúsculas/minúsculas)
  const termoMinusculo = termoPesquisa.toLowerCase().trim();
  const filtroMinusculo = (
    typeof children === 'string' ? children : textoFiltro
  ).toLowerCase();

  // Se o usuário digitou algo e este item não contém o termo, não renderiza
  if (termoMinusculo && !filtroMinusculo.includes(termoMinusculo)) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[
        estilos.menuComandosItem,
        desabilitado && estilos.botaoDesabilitado,
        estiloPersonalizado,
      ]}
      onPress={() => {
        if (!desabilitado && aoSelecionar) aoSelecionar();
      }}
      disabled={desabilitado}
      activeOpacity={0.7}
    >
      {typeof children === 'string' ? (
        <Text style={estilos.textoDescricao}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

/**
 * ATALHO OU RÓTULO LATERAL: AtalhoDeComando
 * 
 * Para que serve:
 * Exibe um atalho alinhado à extrema direita da linha do item.
 */
export function AtalhoDeComando({ children }) {
  return (
    <Text
      style={[
        estilos.textoRotuloMetrica,
        estilos.botaoExcluirCard, // Aplica marginLeft: 'auto' nativamente
      ]}
    >
      {children}
    </Text>
  );
}

/**
 * LINHA SEPARADORA: SeparadorDeComandos
 * 
 * Para que serve:
 * Traço horizontal fino para divisão de blocos.
 */
export function SeparadorDeComandos() {
  return <View style={estilos.menuComandosSeparador} />;
}

export default MenuDeComandos;