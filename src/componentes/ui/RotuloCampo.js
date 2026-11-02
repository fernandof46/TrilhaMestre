/**
 * ============================================================================
 * ARQUIVO: RotuloCampo.js (Substituto nativo do Label do Radix/shadcn)
 * 
 * PROPÓSITO:
 * Exibir o título ou rótulo textual acima de campos de formulário, seletores,
 * switches e caixas de texto com tipografia padronizada em caixa alta sutil.
 * 
 * RECURSOS EMBUTIDOS:
 * - Destaque visual em Vermelho Alerta se houver erro de validação (comErro).
 * - Asterisco vermelho automático quando o campo for indispensável (obrigatorio).
 * - Acessibilidade nativa para leitores de tela (TalkBack / VoiceOver).
 * 
 * REAPROVEITAMENTO DE ESTILOS:
 * Zero linhas adicionadas no estilos/index.js (reutiliza grupoEscolhaRotulo).
 * ============================================================================
 */

import React from 'react';
import { Text } from 'react-native';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * COMPONENTE: RotuloCampo
 * 
 * @param {ReactNode} children - O texto do rótulo (ex: "E-MAIL", "SENHA").
 * @param {boolean} obrigatorio - Se verdadeiro, exibe um asterisco vermelho (*) ao lado.
 * @param {boolean} comErro - Se verdadeiro, pinta o texto do rótulo de vermelho.
 * @param {boolean} desabilitado - Se verdadeiro, esmaece o texto.
 * @param {object} estiloPersonalizado - Estilo extra de margem ou cor.
 */
export function RotuloCampo({
  children,
  obrigatorio = false,
  comErro = false,
  desabilitado = false,
  estiloPersonalizado,
  ...outrasPropriedades
}) {
  return (
    <Text
      style={[
        estilos.grupoEscolhaRotulo,
        {
          color: comErro
            ? cores.cancelar // Vermelho Alerta se houver erro
            : desabilitado
            ? cores.limpar // Cinza neutro se bloqueado
            : cores.descricao, // Tom padrão legível
          marginBottom: 6,
        },
        estiloPersonalizado,
      ]}
      accessibilityRole="text"
      {...outrasPropriedades}
    >
      {children}
      
      {/* Asterisco indicador de campo mandatório */}
      {obrigatorio ? (
        <Text style={{ color: cores.cancelar, fontWeight: 'bold' }}> *</Text>
      ) : null}
    </Text>
  );
}

export default RotuloCampo;