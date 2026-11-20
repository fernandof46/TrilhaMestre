// components/GrupoDeEscolha.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { estilos, espaco } from './estilos';

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
    <View style={{ width: '100%', gap: espaco.sm }}>
      {/* Exibe o rótulo superior do grupo */}
      <Text style={estilos.rotuloDestaque}>{rotulo}</Text>

      {/* Container que distribui todas as opções na largura total */}
      <View style={[estilos.linhaQuebra, { width: '100%', gap: espaco.md }]}>
        {opcoes.map((opcao) => {
          const estaAtiva = opcao.valor === valorSelecionado;
          const ehCard = variante === 'cards';

          return (
            <TouchableOpacity
              key={opcao.valor}
              activeOpacity={0.7}
              onPress={() => aoMudarValor(opcao.valor)}
              style={[
                // Usa as variantes dedicadas do Design System
                ehCard 
                  ? estilos.grupoEscolhaVarianteCard
                  : [
                      estilos.grupoEscolhaVariantePill,
                      { flexGrow: 1, alignSelf: 'center', justifyContent: 'center' }
                    ],
                // Destaca a borda e o fundo quando selecionado
                estaAtiva && estilos.estadoAtivo,
              ]}
            >
              {/* Rótulo/Texto principal da opção */}
              <Text
                style={[
                  estilos.grupoEscolhaRotuloOpcao,
                  !ehCard && { textAlign: 'center' },
                  estaAtiva && estilos.textoAtivoDestaque,
                ]}
              >
                {opcao.rotulo}
              </Text>

              {/* Dica secundária (exibida apenas no modo 'cards' se a opção possuir) */}
              {ehCard && opcao.dica ? (
                <Text
                  style={[
                    estilos.textoApoioEspacado,
                    estaAtiva && estilos.textoAtivoDestaque,
                  ]}
                >
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
