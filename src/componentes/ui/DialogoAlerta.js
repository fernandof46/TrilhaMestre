import React, { createContext, useContext, useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { estilos } from './estilos';
import { cores } from './cores';

// Contexto para controlar abertura, fechamento e gatilhos do diálogo
const ContextoDialogoAlerta = createContext({
  aberto: false,
  aoAlterarAberto: () => {},
});

/**
 * COMPONENTE RAIZ: DialogoAlerta (AlertDialog)
 */
export function DialogoAlerta({ children, open, onOpenChange }) {
  const [abertoInterno, setAbertoInterno] = useState(false);

  const aberto = open !== undefined ? open : abertoInterno;
  const aoAlterarAberto = onOpenChange !== undefined ? onOpenChange : setAbertoInterno;

  return (
    <ContextoDialogoAlerta.Provider value={{ aberto, aoAlterarAberto }}>
      {children}
    </ContextoDialogoAlerta.Provider>
  );
}

/**
 * COMPONENTE GATILHO: GatilhoDialogoAlerta (AlertDialogTrigger)
 * Elemento tocável que aciona a abertura do diálogo.
 */
export function GatilhoDialogoAlerta({ children, asChild }) {
  const { aoAlterarAberto } = useContext(ContextoDialogoAlerta);

  return (
    <TouchableOpacity onPress={() => aoAlterarAberto(true)} activeOpacity={0.8}>
      {children}
    </TouchableOpacity>
  );
}

/**
 * COMPONENTE CONTEÚDO: ConteudoDialogoAlerta (AlertDialogContent)
 * A caixa modal com fundo semitransparente que centraliza as mensagens.
 */
export function ConteudoDialogoAlerta({ children, estiloCustomizado }) {
  const { aberto, aoAlterarAberto } = useContext(ContextoDialogoAlerta);

  return (
    <Modal
      transparent={true}
      visible={aberto}
      animationType="fade"
      onRequestClose={() => aoAlterarAberto(false)}
    >
      <View style={estilos.fundoSobreposicao}>
        <View style={[estilos.cartaoConteudoCarregamento, estiloCustomizado]}>
          {children}
        </View>
      </View>
    </Modal>
  );
}

/**
 * CABEÇALHO DO DIÁLOGO (AlertDialogHeader)
 */
export function CabecalhoDialogoAlerta({ children, estiloCustomizado }) {
  return (
    <View style={[{ width: '100%', marginBottom: 8 }, estiloCustomizado]}>
      {children}
    </View>
  );
}

/**
 * TÍTULO DO ALERTA (AlertDialogTitle)
 */
export function TituloDialogoAlerta({ children, estiloCustomizado }) {
  return (
    <Text style={[estilos.textoTitulo, { fontSize: 18, marginBottom: 8 }, estiloCustomizado]}>
      {children}
    </Text>
  );
}

/**
 * DESCRIÇÃO DO ALERTA (AlertDialogDescription)
 */
export function DescricaoDialogoAlerta({ children, estiloCustomizado }) {
  return (
    <Text style={[estilos.textoDescricao, { lineHeight: 20 }, estiloCustomizado]}>
      {children}
    </Text>
  );
}

/**
 * RODAPÉ DO ALERTA (AlertDialogFooter)
 */
export function RodapeDialogoAlerta({ children, estiloCustomizado }) {
  return (
    <View style={[estilos.rodapeDialogoAlerta, estiloCustomizado]}>
      {children}
    </View>
  );
}

/**
 * BOTÃO CANCELAR (AlertDialogCancel)
 */
export function CancelarDialogoAlerta({ children = 'Cancelar', onPress, estiloCustomizado }) {
  const { aoAlterarAberto } = useContext(ContextoDialogoAlerta);

  const lidarToque = () => {
    aoAlterarAberto(false);
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity
      style={[estilos.botaoDialogoCancelar, estiloCustomizado]}
      onPress={lidarToque}
      activeOpacity={0.7}
    >
      <Text style={estilos.textoBotaoPdf}>{children}</Text>
    </TouchableOpacity>
  );
}

/**
 * BOTÃO DE AÇÃO / CONFIRMAÇÃO (AlertDialogAction)
 */
export function AcaoDialogoAlerta({
  children = 'Confirmar',
  onPress,
  onClick,
  estiloCustomizado,
  variante = 'destrutiva', // 'destrutiva' (vermelho) ou 'primaria' (verde petronas)
}) {
  const { aoAlterarAberto } = useContext(ContextoDialogoAlerta);

  const lidarToque = () => {
    aoAlterarAberto(false);
    const callback = onPress || onClick;
    if (callback) callback();
  };

  const estiloBotao = variante === 'primaria' 
    ? { backgroundColor: cores.confirmar } 
    : estilos.botaoDialogoAcao;

  return (
    <TouchableOpacity
      style={[estiloBotao, estiloCustomizado]}
      onPress={lidarToque}
      activeOpacity={0.8}
    >
      <Text style={estilos.textoBotao}>{children}</Text>
    </TouchableOpacity>
  );
}

// Aliases em inglês para manter 100% de compatibilidade com os códigos legados da Web
export const AlertDialog = DialogoAlerta;
export const AlertDialogTrigger = GatilhoDialogoAlerta;
export const AlertDialogContent = ConteudoDialogoAlerta;
export const AlertDialogHeader = CabecalhoDialogoAlerta;
export const AlertDialogTitle = TituloDialogoAlerta;
export const AlertDialogDescription = DescricaoDialogoAlerta;
export const AlertDialogFooter = RodapeDialogoAlerta;
export const AlertDialogCancel = CancelarDialogoAlerta;
export const AlertDialogAction = AcaoDialogoAlerta;