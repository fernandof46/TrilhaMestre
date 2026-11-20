// src/app/(tabs)/desempenho.js
import React, { useMemo, useState } from 'react'; // Importa React e hooks de memorização e estado
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'; // Importa componentes nativos de interface
import { useRouter } from 'expo-router'; // Hook de navegação para abrir trilhas a partir do gráfico
import { Feather } from '@expo/vector-icons'; // Ícones vetoriais padrão do Expo
import { STATUS_TRILHA, useTrilhas } from '../../contextos/TrilhasContext'; // Contexto global com as trilhas e etapas concluídas
import { estilos as e, espaco, raio } from '../../componentes/estilos'; // Tokens e classes visuais do Design System
import { cores } from '../../componentes/cores'; // Paleta de cores unificada do projeto

// Nomes curtos dos dias da semana e meses em português para o calendário
const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export default function TelaDesempenho() {
  const roteador = useRouter(); // Controlador de navegação entre rotas
  const { trilhas, isLoading } = useTrilhas(); // Obtém todas as trilhas salvas e o estado de carregamento

  // Estado que controla o mês e o dia selecionado no Calendário de Estudos
  const hoje = useMemo(() => new Date(), []);
  const [mesAtual, setMesAtual] = useState(
    () => new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  );
  const [diaSelecionado, setDiaSelecionado] = useState(hoje.getDate());

  /**
   * Calcula todos os indicadores de telemetria a partir das trilhas salvas
   */
    /**
   * Calcula todos os indicadores de telemetria a partir das trilhas salvas do usuário.
   * Normaliza status e contagens de etapas para evitar falhas caso algum campo venha indefinido.
   */
    /**
   * Calcula todos os indicadores de telemetria a partir das trilhas salvas do usuário.
   * Utiliza laço 'for...of' em vez de mutação dentro de '.map()' para cumprir as regras do React Compiler.
   */
  const metricas = useMemo(() => {
    let totalEtapas = 0; // Acumulador geral de todas as etapas criadas em todas as trilhas
    let etapasConcluidas = 0; // Acumulador geral de etapas já marcadas como concluídas
    let trilhasConcluidas = 0; // Contador de trilhas finalizadas (por status ou 100% das etapas)
    let trilhasEmAndamento = 0; // Contador de trilhas ativas em estudo
    const dadosPorTrilha = []; // Lista imutável que alimentará o gráfico de barras por trilha

    // Percorre cada trilha de forma sequencial sem efeitos colaterais em callbacks
    for (const trilha of trilhas) {
      // Soma todas as etapas (steps) pertencentes a todas as fases (phases) desta trilha
      const todasEtapas = Array.isArray(trilha.phases)
        ? trilha.phases.reduce(
            (acc, fase) => acc + (Array.isArray(fase.steps) ? fase.steps.length : 0),
            0
          )
        : 0;

      // Conta quantos IDs de etapas concluídas existem no array da trilha
      const concluidasNaTrilha = Array.isArray(trilha.completedStepIds)
        ? trilha.completedStepIds.length
        : 0;

      // Lê o status atual com fallback seguro caso a trilha seja antiga e não possua o campo
      const statusAtual = trilha.status || STATUS_TRILHA.EM_ANDAMENTO;

      // Considera a trilha finalizada se o status for 'concluida' ou se todas as etapas foram feitas
      const trilhaFinalizada =
        statusAtual === STATUS_TRILHA.CONCLUIDA ||
        (todasEtapas > 0 && concluidasNaTrilha >= todasEtapas);

      // Calcula a porcentagem de evolução desta trilha (limitada entre 0% e 100%)
      let percentual = 0;
      if (trilhaFinalizada) {
        percentual = 100;
      } else if (todasEtapas > 0) {
        percentual = Math.min(100, Math.round((concluidasNaTrilha / todasEtapas) * 100));
      }

      // Atualiza os acumuladores globais da tela de telemetria
      totalEtapas += todasEtapas;
      etapasConcluidas += trilhaFinalizada ? todasEtapas : concluidasNaTrilha;

      // Classifica a trilha nos contadores superiores (Concluídas vs Em andamento)
      if (trilhaFinalizada) {
        trilhasConcluidas += 1;
      } else if (statusAtual !== STATUS_TRILHA.PAUSADA) {
        trilhasEmAndamento += 1;
      }

      // Adiciona o item formatado para renderizar a barra desta trilha no gráfico
      dadosPorTrilha.push({
        id: trilha.id,
        titulo: trilha.title || 'Trilha sem título',
        nivel: trilha.level || 'iniciante',
        concluidas: trilhaFinalizada ? todasEtapas : concluidasNaTrilha,
        total: todasEtapas,
        percentual,
      });
    }

    // Calcula a taxa geral de aproveitamento somando todas as trilhas do usuário
    const taxaGeral =
      totalEtapas > 0 ? Math.round((etapasConcluidas / totalEtapas) * 100) : 0;

    return {
      totalTrilhas: trilhas.length, // Total de trilhas na biblioteca do usuário
      trilhasConcluidas, // Total de trilhas finalizadas
      trilhasEmAndamento, // Total de trilhas ativas
      totalEtapas, // Total de etapas somadas
      etapasConcluidas, // Total de etapas concluídas
      taxaGeral, // Percentual médio global
      dadosPorTrilha, // Lista detalhada usada no gráfico de barras
    };
  }, [trilhas]);



  /**
   * Gera a matriz de dias do mês exibido no calendário e destaca dias em que trilhas foram criadas
   */
  const gradeCalendario = useMemo(() => {
    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();
    const primeiroDiaSemana = new Date(ano, mes, 1).getDay(); // 0 (Dom) a 6 (Sáb)
    const ultimoDiaMes = new Date(ano, mes + 1, 0).getDate(); // 28 a 31

    // Mapeia os dias do mês atual que possuem atividade registrada (criação de trilha)
    const diasComAtividade = new Set();
    trilhas.forEach((t) => {
      if (!t.createdAt) return;
      const dataCriacao = new Date(t.createdAt);
      if (dataCriacao.getFullYear() === ano && dataCriacao.getMonth() === mes) {
        diasComAtividade.add(dataCriacao.getDate());
      }
    });

    const celulas = [];
    // Preenche espaços vazios antes do dia 1 para alinhar com o dia da semana correto
    for (let i = 0; i < primeiroDiaSemana; i += 1) {
      celulas.push({ chave: `vazio-${i}`, dia: null });
    }
    // Preenche os dias reais do mês
    for (let dia = 1; dia <= ultimoDiaMes; dia += 1) {
      const ehHoje =
        dia === hoje.getDate() &&
        mes === hoje.getMonth() &&
        ano === hoje.getFullYear();

      celulas.push({
        chave: `dia-${dia}`,
        dia,
        ehHoje,
        temAtividade: diasComAtividade.has(dia),
      });
    }

    return celulas;
  }, [mesAtual, hoje, trilhas]);

  // Navega para o mês anterior ou próximo no calendário
  const mudarMes = (deslocamento) => {
    setMesAtual((atual) => new Date(atual.getFullYear(), atual.getMonth() + deslocamento, 1));
    setDiaSelecionado(1);
  };

  if (isLoading) {
    return (
      <View style={[e.containerPrincipal, e.centro]}>
        <ActivityIndicator size="large" color={cores.confirmar} />
      </View>
    );
  }
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: cores.bkprincipal }}
      contentContainerStyle={[
        e.containerPrincipal,
        { flex: undefined, flexGrow: 1, paddingBottom: espaco.giga },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* CABEÇALHO DA PÁGINA DE TELEMETRIA */}
      <View>
        <Text style={e.rotuloDestaqueEspacado}>TELEMETRIA E EVOLUÇÃO</Text>
        <Text style={e.textoTituloDestaque}>Seu Desempenho</Text>
        <Text style={[e.textoDescricao, { textAlign: 'left', marginTop: espaco.xs }]}>
          Acompanhe seu ritmo de estudos, etapas concluídas e progresso por trilha.
        </Text>
      </View>

      {/* 1. GRADE DE MÉTRICAS PRINCIPAIS (4 CARTÕES) */}
      <View style={e.gradeMetricasDestaque}>
        {/* Cartão 1: Taxa Geral de Conclusão */}
        <View style={e.cartaoMetricaItem}>
          <View style={e.linhaEntre}>
            <Text style={e.rotuloNeutro}>APROVEITAMENTO</Text>
            <Feather name="trending-up" size={14} color={cores.confirmar} />
          </View>
          <Text style={[e.textoValorMetrica, { color: cores.confirmar }]}>
            {metricas.taxaGeral}%
          </Text>
          <Text style={e.textoApoioEspacado}>
            {metricas.etapasConcluidas} de {metricas.totalEtapas} etapas
          </Text>
        </View>

        {/* Cartão 2: Trilhas Criadas */}
        <View style={e.cartaoMetricaItem}>
          <View style={e.linhaEntre}>
            <Text style={e.rotuloNeutro}>TRILHAS SALVAS</Text>
            <Feather name="layers" size={14} color={cores.titulos} />
          </View>
          <Text style={e.textoValorMetrica}>{metricas.totalTrilhas}</Text>
          <Text style={e.textoApoioEspacado}>
            {metricas.trilhasEmAndamento} em andamento
          </Text>
        </View>

        {/* Cartão 3: Trilhas Concluídas */}
        <View style={e.cartaoMetricaItem}>
          <View style={e.linhaEntre}>
            <Text style={e.rotuloNeutro}>CONCLUÍDAS</Text>
            <Feather name="award" size={14} color={cores.confirmar} />
          </View>
          <Text style={e.textoValorMetrica}>{metricas.trilhasConcluidas}</Text>
          <Text style={e.textoApoioEspacado}>Roteiros finalizados</Text>
        </View>

        {/* Cartão 4: Etapas Feitas */}
        <View style={e.cartaoMetricaItem}>
          <View style={e.linhaEntre}>
            <Text style={e.rotuloNeutro}>ETAPAS FEITAS</Text>
            <Feather name="check-circle" size={14} color={cores.confirmar} />
          </View>
          <Text style={e.textoValorMetrica}>{metricas.etapasConcluidas}</Text>
          <Text style={e.textoApoioEspacado}>Checkpoints marcados</Text>
        </View>
      </View>

      {/* 2. GRÁFICO DE BARRAS DE PROGRESSO POR TRILHA */}
      <View style={[e.cartaoGenerico, { marginTop: espaco.md }]}>
        <View style={e.cartaoCabecalho}>
          <Text style={e.rotuloDestaqueEspacado}>GRÁFICO DE PROGRESSO</Text>
          <Text style={e.textoTituloItem}>Evolução por Trilha</Text>
        </View>

        <View style={e.cartaoConteudo}>
          {metricas.dadosPorTrilha.length === 0 ? (
            <Text style={e.textoApoio}>
              Salve sua primeira trilha para visualizar o gráfico de evolução.
            </Text>
          ) : (
            <View style={{ gap: espaco.lg }}>
              {metricas.dadosPorTrilha.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => roteador.push('/trilha/' + item.id)}
                  style={({ pressed }) => [
                    { gap: espaco.xs },
                    pressed && { opacity: 0.75 },
                  ]}
                >
                  {/* Linha superior com título da trilha e porcentagem */}
                  <View style={e.linhaInfoProgresso}>
                    <Text
                      numberOfLines={1}
                      style={[e.textoRotuloProgresso, { flex: 1, marginRight: espaco.sm }]}
                    >
                      {item.titulo}
                    </Text>
                    <Text style={e.textoDestaqueCompacto}>
                      {item.percentual}% ({item.concluidas}/{item.total})
                    </Text>
                  </View>

                  {/* Barra de progresso visual (Trilho + Preenchimento Verde Petronas) */}
                  <View style={e.trilhoProgresso}>
                    <View
                      style={[
                        e.preenchimentoProgresso,
                        { width: `${item.percentual}%` },
                      ]}
                    />
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {/* Legenda do Gráfico */}
          <View style={e.graficoLegendaLine}>
            <View style={e.graficoLegendaItem}>
              <View
                style={[
                  e.graficoLegendaPonto,
                  { backgroundColor: cores.confirmar },
                ]}
              />
              <Text style={e.textoApoio}>Etapas concluídas</Text>
            </View>
            <View style={e.graficoLegendaItem}>
              <View
                style={[
                  e.graficoLegendaPonto,
                  { backgroundColor: cores.bkinput },
                ]}
              />
              <Text style={e.textoApoio}>Etapas pendentes</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 3. CALENDÁRIO DE ESTUDOS */}
      <View style={[e.cartaoGenerico, { marginTop: espaco.md }]}>
        <View style={e.cartaoCabecalho}>
          <Text style={e.rotuloNeutroEspacado}>FREQUÊNCIA MENSAL</Text>

          {/* Navegação entre meses */}
          <View style={e.calendarioCabecalho}>
            <Pressable
              onPress={() => mudarMes(-1)}
              hitSlop={10}
              style={[e.superficie, { padding: espaco.xs, borderRadius: raio.sm }]}
            >
              <Feather name="chevron-left" size={18} color={cores.titulos} />
            </Pressable>

            <Text style={e.textoTituloItem}>
              {MESES[mesAtual.getMonth()]} {mesAtual.getFullYear()}
            </Text>

            <Pressable
              onPress={() => mudarMes(1)}
              hitSlop={10}
              style={[e.superficie, { padding: espaco.xs, borderRadius: raio.sm }]}
            >
              <Feather name="chevron-right" size={18} color={cores.titulos} />
            </Pressable>
          </View>
        </View>

        <View style={e.cartaoConteudo}>
          {/* Cabeçalho dos dias da semana (DOM -> SÁB) */}
          <View style={e.calendarioLinhaDiasSemana}>
            {DIAS_SEMANA.map((diaSemana) => (
              <Text key={diaSemana} style={e.calendarioTextoDiaSemana}>
                {diaSemana}
              </Text>
            ))}
          </View>

          {/* Grade numérica dos dias do mês */}
          <View style={e.calendarioGradeDias}>
            {gradeCalendario.map((celula) => {
              if (!celula.dia) {
                return <View key={celula.chave} style={e.calendarioCelulaDia} />;
              }

              const selecionado = celula.dia === diaSelecionado;

              return (
                <Pressable
                  key={celula.chave}
                  onPress={() => setDiaSelecionado(celula.dia)}
                  style={[
                    e.calendarioCelulaDia,
                    celula.ehHoje && e.calendarioDiaHoje,
                    selecionado && e.calendarioDiaSelecionado,
                  ]}
                >
                  <Text
                    style={[
                      e.textoCorpo,
                      {
                        fontWeight: selecionado || celula.ehHoje ? '700' : '400',
                        color: selecionado
                          ? cores.botoesTexto || '#FFFFFF'
                          : cores.titulos,
                      },
                    ]}
                  >
                    {celula.dia}
                  </Text>

                  {/* Ponto indicador nos dias em que houve criação de trilha */}
                  {celula.temAtividade ? (
                    <View
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: raio.pill,
                        backgroundColor: selecionado
                          ? cores.botoesTexto || '#FFFFFF'
                          : cores.confirmar,
                        marginTop: 2,
                      }}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
