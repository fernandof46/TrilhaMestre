import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

// Nomes dos meses em Português
const NOMES_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Dias da semana abreviados
const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

/**
 * COMPONENTE: Calendario (Substituto do Calendar / react-day-picker)
 * 
 * @param {Date} selected - Data atualmente selecionada
 * @param {function} onSelect - Callback chamado ao escolher um dia: (novaData) => {}
 */
export function Calendario({ selected, onSelect, style, ...props }) {
  // Estado que controla o mês e ano visualizados na tela
  const [dataVisualizacao, setDataVisualizacao] = useState(
    selected instanceof Date ? new Date(selected) : new Date()
  );

  const anoAtual = dataVisualizacao.getFullYear();
  const mesAtual = dataVisualizacao.getMonth();

  // Avança ou recua um mês
  const navegarMes = (incremento) => {
    setDataVisualizacao(new Date(anoAtual, mesAtual + incremento, 1));
  };

  // Cálculo da quantidade de dias no mês e do dia da semana do 1º dia
  const primeiroDiaSemana = new Date(anoAtual, mesAtual, 1).getDay();
  const totalDiasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();

  // Array com espaços vazios para alinhar o primeiro dia no calendário
  const espacosVaziosIniciais = Array.from({ length: primeiroDiaSemana }, (_, i) => null);
  // Array com os dias numéricos do mês (1, 2, 3...)
  const diasDoMes = Array.from({ length: totalDiasNoMes }, (_, i) => i + 1);
  const gradeCompleta = [...espacosVaziosIniciais, ...diasDoMes];

  const hoje = new Date();

  return (
    <View style={[estilos.calendarioContainer, style]} {...props}>
      
      {/* 1. CABEÇALHO DO MÊS COM BOTÕES DE NAVEGAÇÃO */}
      <View style={estilos.calendarioCabecalho}>
        <TouchableOpacity
          onPress={() => navegarMes(-1)}
          hitSlop={12}
          activeOpacity={0.7}
        >
          <Feather name="chevron-left" size={18} color={cores.descricao} />
        </TouchableOpacity>

        <Text style={estilos.textoTituloModulo}>
          {NOMES_MESES[mesAtual]} {anoAtual}
        </Text>

        <TouchableOpacity
          onPress={() => navegarMes(1)}
          hitSlop={12}
          activeOpacity={0.7}
        >
          <Feather name="chevron-right" size={18} color={cores.descricao} />
        </TouchableOpacity>
      </View>

      {/* 2. NOMES DOS DIAS DA SEMANA */}
      <View style={estilos.calendarioLinhaDiasSemana}>
        {DIAS_SEMANA.map((dia) => (
          <Text key={dia} style={estilos.calendarioTextoDiaSemana}>
            {dia}
          </Text>
        ))}
      </View>

      {/* 3. GRADE DE DIAS DO MÊS */}
      <View style={estilos.calendarioGradeDias}>
        {gradeCompleta.map((dia, indice) => {
          if (!dia) {
            return (
              <View key={`vazio-${indice}`} style={estilos.calendarioCelulaDia} />
            );
          }

          // Checa se este dia é o selecionado
          const ehSelecionado =
            selected instanceof Date &&
            selected.getDate() === dia &&
            selected.getMonth() === mesAtual &&
            selected.getFullYear() === anoAtual;

          // Checa se este dia é o dia de hoje
          const ehHoje =
            hoje.getDate() === dia &&
            hoje.getMonth() === mesAtual &&
            hoje.getFullYear() === anoAtual;

          return (
            <TouchableOpacity
              key={`dia-${dia}`}
              style={[
                estilos.calendarioCelulaDia,
                ehSelecionado && estilos.calendarioDiaSelecionado,
                ehHoje && !ehSelecionado && estilos.calendarioDiaHoje,
              ]}
              onPress={() => {
                if (onSelect) {
                  onSelect(new Date(anoAtual, mesAtual, dia));
                }
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: ehSelecionado ? 'bold' : '500',
                  color: ehSelecionado
                    ? cores.botoesTexto
                    : ehHoje
                    ? cores.confirmar
                    : cores.titulos,
                }}
              >
                {dia}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

    </View>
  );
}

// Aliases em inglês para manter 100% de compatibilidade
export const Calendar = Calendario;
export default Calendario;