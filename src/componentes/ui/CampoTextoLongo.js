/**
 * ============================================================================
 * ARQUIVO: CampoTextoLongo.js (Substituto nativo do Textarea da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Fornecer um campo de entrada de texto para mensagens extensas, descrições
 * detalhadas, feedbacks ou prompts de IA, permitindo múltiplas linhas de
 * digitação com rolagem automática interna.
 * 
 * DESIGN SYSTEM (MERCEDES-AMG F1):
 * - Fundo carbono (#2A2A2A) com borda cinza discreta em repouso.
 * - Borda iluminada em Verde Petronas (#00A19C) quando o campo está ativo.
 * - Texto em branco (#FFFFFF) para máxima legibilidade no fundo escuro.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js. Zero estilos inline.
 * ============================================================================
 */

import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * COMPONENTE: CampoTextoLongo
 * 
 * Para que serve:
 * Campo de entrada de texto multilinha (TextArea) para entradas volumosas.
 * 
 * @param {string} valor - Texto atualmente presente no campo.
 * @param {function} aoMudarTexto - Callback chamado a cada caractere digitado: (novoTexto) => {}
 * @param {string} marcadorTexto - Texto de dica (placeholder) exibido quando vazio.
 * @param {boolean} desabilitado - Bloqueia a digitação e reduz a opacidade do campo.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 * @param {number} linhasMinimas - Quantidade mínima de linhas visíveis (padrão: 3).
 */
export function CampoTextoLongo({
  valor,
  aoMudarTexto,
  marcadorTexto,
  desabilitado = false,
  estiloPersonalizado,
  linhasMinimas = 3,
  ...outrasPropriedades
}) {
  // Estado interno para monitorar o foco e aplicar a borda iluminada de destaque
  const [estaFocado, setEstaFocado] = useState(false);

  return (
    <TextInput
      value={valor}
      onChangeText={aoMudarTexto}
      placeholder={marcadorTexto}
      placeholderTextColor={cores.descricao}
      multiline={true} // Ativa a capacidade de múltiplas linhas (equivalente ao textarea)
      numberOfLines={linhasMinimas} // Define a altura inicial do campo
      editable={!desabilitado}
      onFocus={() => setEstaFocado(true)}
      onBlur={() => setEstaFocado(false)}
      style={[
        estilos.menuComandosLinhaEntrada, // Reaproveita a estrutura de entrada (Borda/Fundo)
        estilos.menuComandosCampoTexto,   // Reaproveita a tipografia e cor do texto
        estaFocado && estilos.grupoEscolhaBotaoAtivo, // Ilumina em Verde Petronas no foco
        desabilitado && estilos.botaoDesabilitado,   // Aplica opacidade se bloqueado
        estiloPersonalizado,
      ]}
      textAlignVertical="top" // Garante que o texto comece no topo da caixa no Android
      {...outrasPropriedades}
    />
  );
}

// Alias em inglês para manter 100% de compatibilidade com imports legados
export const Textarea = CampoTextoLongo;
export default CampoTextoLongo;