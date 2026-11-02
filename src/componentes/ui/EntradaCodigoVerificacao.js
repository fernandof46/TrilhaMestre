/**
 * ============================================================================
 * ARQUIVO: EntradaCodigoVerificacao.js
 * 
 * PROPÓSITO:
 * Campo de digitação de código de segurança (PIN de 4 a 6 dígitos).
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js. Zero estilos inline.
 * ============================================================================
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * COMPONENTE RAIZ: EntradaCodigoVerificacao
 * 
 * @param {string} valor - O código numérico digitado atualmente.
 * @param {function} aoMudarValor - Função chamada a cada dígito inserido: (novoCodigo) => {}
 * @param {number} quantidadeDigitos - Total de caixinhas (padrão: 6 dígitos).
 * @param {boolean} desabilitado - Impede a digitação e esmaece as caixas.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function EntradaCodigoVerificacao({
  valor = '',
  aoMudarValor,
  quantidadeDigitos = 6,
  desabilitado = false,
  estiloPersonalizado,
}) {
  const referenciaEntradaOculta = useRef(null);
  const indicesDigitos = Array.from({ length: quantidadeDigitos }, (_, i) => i);

  const focarNoCampo = () => {
    if (!desabilitado) {
      referenciaEntradaOculta.current?.focus();
    }
  };

  const lidarComMudancaTexto = (textoDigitado) => {
    const apenasNumeros = textoDigitado.replace(/[^0-9]/g, '');
    if (aoMudarValor) {
      aoMudarValor(apenasNumeros.slice(0, quantidadeDigitos));
    }
  };

  return (
    <TouchableOpacity
      onPress={focarNoCampo}
      activeOpacity={1}
      style={[
        estilos.areaTitulo,
        estiloPersonalizado,
      ]}
    >
      {/* 1. CAMPO INVISÍVEL USANDO ABSOLUTE FILL NATIVO */}
      <TextInput
        ref={referenciaEntradaOculta}
        value={valor}
        onChangeText={lidarComMudancaTexto}
        maxLength={quantidadeDigitos}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
        editable={!desabilitado}
        style={[
          StyleSheet.absoluteFillObject,
          estilos.botaoDesabilitado,
        ]}
      />

      {/* 2. CAIXAS VISUAIS ADAPTADAS DOS ESTILOS DE GRUPO DE ESCOLHA */}
      <View style={estilos.grupoEscolhaContainerOpcoes}>
        {indicesDigitos.map((indice) => {
          const caractere = valor[indice] || '';
          const ehDigitoAtivo = valor.length === indice && !desabilitado;

          return (
            <View
              key={`slot-${indice}`}
              style={[
                estilos.grupoEscolhaVarianteCard,
                ehDigitoAtivo
                  ? estilos.grupoEscolhaBotaoAtivo
                  : estilos.grupoEscolhaBotaoInativo,
                desabilitado && estilos.botaoDesabilitado,
              ]}
            >
              <Text style={estilos.textoTitulo}>
                {caractere || ' '}
              </Text>
            </View>
          );
        })}
      </View>
    </TouchableOpacity>
  );
}

/**
 * SEPARADOR OPCIONAL: SeparadorCodigo
 */
export function SeparadorCodigo() {
  return (
    <View style={estilos.trilhaNavegacaoItem}>
      <Feather name="minus" size={16} color={cores.descricao} />
    </View>
  );
}

export default EntradaCodigoVerificacao;