/**
 * ============================================================================
 * ARQUIVO: BotaoAlternancia.js (Substituto nativo do Toggle da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Fornecer um botão de estado binário (Ativado/Desativado). Ao contrário do 
 * Interruptor (Switch), este se comporta como um botão de comando que "está
 * ligado" ou "está desligCado", mudando sua cor de destaque.
 * 
 * DESIGN SYSTEM (MERCEDES-AMG F1):
 * - Estado Ativo: Fundo iluminado em Verde Petronas (#00A19C).
 * - Estado Inativo: Fundo transparente ou carbono, borda sutil.
 * - Feedback: Mudança imediata de cor ao toque.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js. Zero estilos inline.
 * ============================================================================
 */

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { estilos } from './estilos';

/**
 * COMPONENTE: BotaoAlternancia
 * 
 * Para que serve:
 * Criar botões de estado, como filtros rápidos (ex: "Ver apenas concluídos") 
 * ou botões de modo de visualização.
 * 
 * @param {boolean} ativado - Estado atual do botão (true para ativo, false para inativo).
 * @param {function} aoAlternar - Callback disparada ao tocar no botão.
 * @param {//string} variante - 'default' (transparente) ou 'outline' (com borda).
 * @param {//string} tamanho - 'default', 'sm' ou 'lg'.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function BotaoAlternancia({
  ativado = false, 
  aoAlternar,
  variante = 'default',
  tamanho = 'default',
  estiloPersonalizado,
  children,
}) {
  
  // Seleciona o estilo de fundo com base no estado ativo e variante
  // Reaproveita: grupoEscolhaBotaoAtivo para o estado ON e grupoEscolhaBotaoInativo para o OFF
  const estiloFundo = ativado
    ? estilos.botaoPrimario
    : variante === 'outline'
      ? estilos.botaoSecundario
      : { backgroundColor: 'transparent' };

  // Define o estilo do texto baseado no estado ativo
  const estiloTexto = ativado ? estilos.textoAtivoForte : estilos.textoComum;

  return (
    <TouchableOpacity
      onPress={aoAlternar}
      activeOpacity={0.7}
      style={[
        tamanho === 'lg' ? estilos.botaoPrimario : estilos.botaoCompacto,
        estiloFundo,
        estiloPersonalizado,
      ]}
    >
      {typeof children === 'string' ? (
        <Text
          style={[
            estilos.textoBotao, // Reutiliza a tipografia padrão de botões
            estiloTexto,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

// Mantém o nome usado por componentes nativos que já dependem deste controle.
export const Toggle = BotaoAlternancia;
export default BotaoAlternancia;