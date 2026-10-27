// components/GrupoDeEscolha.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { estilos } from './estilos'; // Importa os estilos centralizados traduzidos

/**
 * Componente Grupo de Escolha (GrupoDeEscolha)
 * Permite ao usuário selecionar opções em formato de cards ou pílulas (pills).
 * 
 * @param {string} rotulo - Título exibido acima do grupo de opções.
 * @param {Array} opcoes - Lista de opções ({ valor, rotulo, dica }).
 * @param {any} valorSelecionado - O valor atualmente escolhido.
 * @param {Function} aoMudarValor - Função disparada ao selecionar uma opção.
 * @param {string} variante - Estilo de exibição ('cards' ou 'pills').
 */
export default function GrupoDeEscolha({ 
  rotulo, 
  opcoes, 
  valorSelecionado, 
  aoMudarValor, 
  variante = 'cards' 
}) {
  return (
    <View style={{ width: '100%', marginBottom: 12 }}>
      {/* Exibe o rótulo superior do grupo */}
      <Text style={styles.grupoEscolhaRotulo}>{rotulo}</Text>

      {/* Container que envolve todas as opções disponíveis */}
      <View style={styles.grupoEscolhaContainerOpcoes}>
        {opcoes.map((opcao) => {
          // Verifica se esta opção específica é a que está selecionada no momento
          const estaAtiva = opcao.valor === valorSelecionado;

          return (
            <TouchableOpacity
              key={opcao.valor}
              activeOpacity={0.7}
              onPress={() => aoMudarValor(opcao.valor)}
              style={[
                // Aplica a variante de layout (card ou pílula)
                variante === 'cards' 
                  ? styles.grupoEscolhaVarianteCard 
                  : styles.grupoEscolhaVariantePill,
                
                // Aplica o estilo visual dependendo se está ativo ou inativo
                estaAtiva 
                  ? styles.grupoEscolhaBotaoAtivo 
                  : styles.grupoEscolhaBotaoInativo,
              ]}
            >
              {/* Rótulo/Texto principal da opção */}
              <Text style={[
                styles.grupoEscolhaRotuloOpcao, 
                estaAtiva && styles.grupoEscolhaTextoAtivo
              ]}>
                {opcao.rotulo}
              </Text>

              {/* Dica secundária (exibida apenas no modo 'cards' se a opção possuir) */}
              {variante === 'cards' && opcao.dica ? (
                <Text style={[
                  styles.grupoEscolhaDicaOpcao, 
                  estaAtiva && styles.grupoEscolhaTextoDicaAtivo
                ]}>
                  {opcao.dica}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}