/**
 * ============================================================================
 * ARQUIVO: PaineisRedimensionaveis.js (Substituto nativo do Resizable da Web)
 * 
 * FINALIDADE DO ARQUIVO:
 * Fornecer um sistema modular de divisão de tela em múltiplos painéis (lado a lado
 * ou empilhados), permitindo exibir conteúdos complementares (como o conteúdo da
 * aula na parte superior e os exercícios práticos na parte inferior).
 * 
 * ADAPTAÇÃO MOBILE:
 * Substitui o arraste de mouse do desktop por divisão proporcional flexível nativa,
 * evitando conflitos de toque com a rolagem vertical do aparelho.
 * 
 * PADRÃO DE ESTILOS:
 * 100% das classes reaproveitadas de estilos/index.js. Zero estilos inline.
 * 
 * ARQUITETURA EM BLOCOS (Composição React):
 * <GrupoDePaineis direcao="vertical">
 *    <PainelIndividual proporcao={1}>
 *       {...Conteúdo superior (ex: resumo do módulo)...}
 *    </PainelIndividual>
 *    <DivisorDePaineis comAlca={true} />
 *    <PainelIndividual proporcao={2}>
 *       {...Conteúdo inferior (ex: lista de etapas detalhadas)...}
 *    </PainelIndividual>
 * </GrupoDePaineis>
 * ============================================================================
 */

import React from 'react';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * COMPONENTE RAIZ: GrupoDePaineis
 * 
 * Para que serve:
 * Contêiner principal que organiza os painéis filhos na direção horizontal ou vertical.
 * 
 * @param {string} direcao - 'vertical' (empilhados) ou 'horizontal' (lado a lado). Padrão: 'vertical'.
 * @param {ReactNode} children - Os blocos PainelIndividual e DivisorDePaineis.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function GrupoDePaineis({
  direcao = 'vertical',
  children,
  estiloPersonalizado,
}) {
  return (
    <View
      style={[
        estilos.containerPrincipal,
        direcao === 'horizontal' ? estilos.caixaSelecaoLinhaComTexto : null,
        estiloPersonalizado,
      ]}
    >
      {children}
    </View>
  );
}

/**
 * PAINEL INDIVIDUAL: PainelIndividual
 * 
 * Para que serve:
 * Representa cada seção dividida na tela, ocupando o espaço proporcional determinado.
 * 
 * @param {number} proporcao - Peso flexível do painel (1 para metade, 2 para o dobro, etc.). Padrão: 1.
 * @param {ReactNode} children - Conteúdo interno renderizado dentro do painel.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function PainelIndividual({
  proporcao = 1,
  children,
  estiloPersonalizado,
}) {
  return (
    <View
      style={[
        estilos.containerPrincipal,
        estiloPersonalizado,
      ]}
    >
      {children}
    </View>
  );
}

/**
 * DIVISOR / ALÇA: DivisorDePaineis
 * 
 * Para que serve:
 * Linha divisória visual com ícone de alça de ajuste opcional no padrão Mercedes F1.
 * 
 * @param {boolean} comAlca - Se verdadeiro, exibe um ícone centralizado de divisor.
 * @param {object} estiloPersonalizado - Estilo extra vindo de estilos/index.js.
 */
export function DivisorDePaineis({ comAlca = false, estiloPersonalizado }) {
  return (
    <View
      style={[
        estilos.menuComandosSeparador,
        estiloPersonalizado,
      ]}
    >
      {/* Ícone central discreto caso a alça esteja ativada */}
      {comAlca ? (
        <View style={estilos.areaTitulo}>
          <Feather name="more-horizontal" size={12} color={cores.descricao} />
        </View>
      ) : null}
    </View>
  );
}

export default GrupoDePaineis;