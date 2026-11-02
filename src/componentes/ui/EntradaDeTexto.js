/**
 * ============================================================================
 * ARQUIVO: EntradaDeTexto.js
 * 
 * PROPÓSITO:
 * Campo de digitação de texto padrão (nome, e-mail, senhas, números, etc.).
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js. Zero estilos inline.
 * ============================================================================
 */

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * COMPONENTE: EntradaDeTexto
 * 
 * @param {string} valor - O texto preenchido no campo.
 * @param {function} aoMudarTexto - Callback chamado ao digitar: (novoTexto) => {}
 * @param {string} marcadorTexto - Texto de dica (placeholder) exibido quando o campo está vazio.
 * @param {string} tipo - 'texto' | 'email' | 'senha' | 'numero' | 'telefone'. Padrão: 'texto'.
 * @param {boolean} desabilitado - Se verdadeiro, bloqueia a digitação e esmaece o campo.
 * @param {string} iconeEsquerda - Nome opcional de um ícone do Feather para o início do campo.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function EntradaDeTexto({
  valor,
  aoMudarTexto,
  marcadorTexto,
  tipo = 'texto',
  desabilitado = false,
  iconeEsquerda,
  estiloPersonalizado,
  ...outrasPropriedades
}) {
  const [estaFocado, setEstaFocado] = useState(false);
  const [senhaOculta, setSenhaOculta] = useState(tipo === 'senha');

  // Mapeamento automático de tipos de teclado do celular conforme a intenção
  let configuracaoTeclado = 'default';
  let esconderTexto = false;
  let capitalizacao = 'sentences';

  if (tipo === 'email') {
    configuracaoTeclado = 'email-address';
    capitalizacao = 'none';
  } else if (tipo === 'numero') {
    configuracaoTeclado = 'numeric';
  } else if (tipo === 'telefone') {
    configuracaoTeclado = 'phone-pad';
  } else if (tipo === 'senha') {
    esconderTexto = senhaOculta;
    capitalizacao = 'none';
  }

  return (
    <View
      style={[
        estilos.menuComandosLinhaEntrada,
        estaFocado && estilos.grupoEscolhaBotaoAtivo,
        desabilitado && estilos.botaoDesabilitado,
        estiloPersonalizado,
      ]}
    >
      {/* Ícone opcional à esquerda */}
      {iconeEsquerda ? (
        <Feather
          name={iconeEsquerda}
          size={16}
          color={estaFocado ? cores.confirmar : cores.descricao}
        />
      ) : null}

      {/* Campo nativo de digitação adaptado ao estilo existente */}
      <TextInput
        value={valor}
        onChangeText={aoMudarTexto}
        placeholder={marcadorTexto}
        placeholderTextColor={cores.descricao}
        secureTextEntry={esconderTexto}
        keyboardType={configuracaoTeclado}
        autoCapitalize={capitalizacao}
        editable={!desabilitado}
        onFocus={() => setEstaFocado(true)}
        onBlur={() => setEstaFocado(false)}
        style={estilos.menuComandosCampoTexto}
        {...outrasPropriedades}
      />

      {/* Botão de alternar visibilidade para senhas */}
      {tipo === 'senha' ? (
        <TouchableOpacity
          onPress={() => setSenhaOculta(!senhaOculta)}
          hitSlop={10}
          activeOpacity={0.7}
        >
          <Feather
            name={senhaOculta ? 'eye-off' : 'eye'}
            size={16}
            color={cores.descricao}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default EntradaDeTexto;