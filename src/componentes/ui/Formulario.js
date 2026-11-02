/**
 * ============================================================================
 * ARQUIVO: Formulario.js
 * 
 * PROPÓSITO:
 * Ecossistema de formulários com validação integrada ao react-hook-form.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js. Zero estilos inline.
 * ============================================================================
 */

import React, { createContext, useContext, useId } from 'react';
import { View, Text } from 'react-native';
import { Controller, FormProvider, useFormContext } from 'react-hook-form';
import { estilos } from './estilos';

export const Formulario = FormProvider;

const ContextoCampoFormulario = createContext({});

/**
 * CAMPO CONTROLADO: CampoDoFormulario
 */
export function CampoDoFormulario(props) {
  return (
    <ContextoCampoFormulario.Provider value={{ nome: props.name }}>
      <Controller {...props} />
    </ContextoCampoFormulario.Provider>
  );
}

/**
 * HOOK AUXILIAR: useCampoDoFormulario
 */
export function useCampoDoFormulario() {
  const contextoCampo = useContext(ContextoCampoFormulario);
  const contextoItem = useContext(ContextoItemFormulario);
  const { getFieldState, formState } = useFormContext();

  if (!contextoCampo?.nome) {
    throw new Error('useCampoDoFormulario deve ser utilizado dentro de um <CampoDoFormulario />');
  }

  const estadoDoCampo = getFieldState(contextoCampo.nome, formState);

  return {
    id: contextoItem?.id,
    nome: contextoCampo.nome,
    ...estadoDoCampo,
  };
}

const ContextoItemFormulario = createContext({});

/**
 * CONTÊINER DO ITEM: ItemDoFormulario
 */
export function ItemDoFormulario({ children, estiloPersonalizado }) {
  const idUnico = useId();

  return (
    <ContextoItemFormulario.Provider value={{ id: idUnico }}>
      <View style={[estilos.grupoEscolhaContainerOpcoes, estiloPersonalizado]}>
        {children}
      </View>
    </ContextoItemFormulario.Provider>
  );
}

/**
 * RÓTULO DO CAMPO: RotuloDoFormulario
 */
export function RotuloDoFormulario({ children, estiloPersonalizado }) {
  const { error } = useCampoDoFormulario();

  return (
    <Text
      style={[
        estilos.grupoEscolhaRotulo,
        error && estilos.textoResultadoFalha,
        estiloPersonalizado,
      ]}
    >
      {children}
    </Text>
  );
}

/**
 * CONTROLE VISUAL: ControleDoFormulario
 */
export function ControleDoFormulario({ children, estiloPersonalizado }) {
  return (
    <View style={estiloPersonalizado}>
      {children}
    </View>
  );
}

/**
 * TEXTO DESCRITIVO / DICA: DescricaoDoFormulario
 */
export function DescricaoDoFormulario({ children, estiloPersonalizado }) {
  if (!children) return null;

  return (
    <Text style={[estilos.grupoEscolhaDicaOpcao, estiloPersonalizado]}>
      {children}
    </Text>
  );
}

/**
 * MENSAGEM DE ERRO: MensagemDeErroFormulario
 */
export function MensagemDeErroFormulario({ children, estiloPersonalizado }) {
  const { error } = useCampoDoFormulario();
  const textoErro = error ? String(error?.message || 'Valor inválido') : children;

  if (!textoErro) return null;

  return (
    <Text
      style={[
        estilos.grupoEscolhaDicaOpcao,
        estilos.textoResultadoFalha,
        estiloPersonalizado,
      ]}
    >
      {textoErro}
    </Text>
  );
}

export default Formulario;