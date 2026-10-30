import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * OPÇÕES DE STATUS DA TRILHA DE ESTUDOS
 * Permite ao usuário mover a trilha de estágio com apenas um toque.
 */
const OPCOES_DE_STATUS = [
  { chave: 'planejado', rotulo: 'Planejado' },
  { chave: 'em_andamento', rotulo: 'Em corrida' },
  { chave: 'concluido', rotulo: 'Concluído' },
];

/**
 * COMPONENTE: PainelDestaqueTrilha (Substituto do RoadmapHero)
 * 
 * Finalidade: Cabeçalho visual completo que resume o roadmap, exibe
 * as 4 métricas principais (Etapas, Horas, Módulos, Ritmo) e controles de ação.
 * 
 * @param {object} trilha - Objeto contendo os dados completos da rota de estudos
 * @param {function} onAbrirAjusteEstrategia - Dispara o modal de refinamento da trilha com IA
 * @param {function} onExportarPdf - Dispara a exportação ou impressão do plano
 * @param {function} onAlterarStatus - Atualiza o status (planejado / em andamento / concluído)
 */
export default function PainelDestaqueTrilha({
  trilha,
  onAbrirAjusteEstrategia,
  onExportarPdf,
  onAlterarStatus,
}) {
  // Extração defensiva das etapas e progresso
  const etapasConcluidas = trilha?.etapasConcluidas || trilha?.progress?.done || 0;
  const totalEtapas = trilha?.totalEtapas || trilha?.progress?.total || 1;
  const porcentagemGeral = Math.min(
    Math.round((etapasConcluidas / totalEtapas) * 100),
    100
  );

  // Estimativa de horas totais e quantidade de módulos
  const horasTotais = Math.round(trilha?.total_hours || trilha?.horasTotais || 24);
  const totalModulos = (trilha?.modules || trilha?.modulos || []).length;
  const ritmoSemanal = trilha?.hours_per_week || trilha?.horasPorSemana || 8;

  // Lista das 4 métricas de telemetria
  const metricas = [
    { icone: 'activity', rotulo: 'Etapas', valor: `${etapasConcluidas}/${totalEtapas}` },
    { icone: 'clock', rotulo: 'Carga total', valor: `${horasTotais} h` },
    { icone: 'layers', rotulo: 'Módulos', valor: `${totalModulos}` },
    { icone: 'zap', rotulo: 'Ritmo', valor: `${ritmoSemanal} h/sem` },
  ];

  return (
    <View style={estilos.painelDestaqueTrilha}>
      
      {/* 1. TÓPICO E TÍTULO PRINCIPAL */}
      <Text style={estilos.textoTopicoDestaque}>
        {trilha?.topic || 'ESTRATÉGIA DE APRENDIZADO'}
      </Text>

      <Text style={estilos.textoTituloDestaque}>
        {trilha?.title || 'Trilha Sem Título'}
      </Text>

      {/* 2. PÍLULAS DE METADADOS (Nível, Tipo de Meta e Semanas) */}
      <View style={estilos.linhaEmblemasDestaque}>
        <View style={estilos.emblemaDestaque}>
          <Text style={estilos.textoEmblemaDestaque}>
            {trilha?.level || 'Iniciante'}
          </Text>
        </View>

        <View style={estilos.emblemaDestaque}>
          <Text style={estilos.textoEmblemaDestaque}>
            {trilha?.goal_type || 'Geral'}
          </Text>
        </View>

        <View style={estilos.emblemaDestaque}>
          <Text style={estilos.textoEmblemaDestaque}>
            {trilha?.total_weeks || trilha?.horizon_weeks || '—'} semanas
          </Text>
        </View>
      </View>

      {/* 3. RESUMO DESCRITIVO (Se existir) */}
      {trilha?.summary ? (
        <Text style={estilos.textoResumoDestaque}>
          {trilha.summary}
        </Text>
      ) : null}

      {/* 4. BARRA DE TELEMETRIA EMBUTIDA (PROGRESSO) */}
      <View style={estilos.areaBarraTelemetria}>
        <View style={estilos.linhaInfoProgresso}>
          <Text style={estilos.textoRotuloProgresso}>Progresso da estratégia</Text>
          <Text style={estilos.textoPorcentagemProgresso}>{porcentagemGeral}%</Text>
        </View>
        <View style={estilos.trilhoBarraProgresso}>
          <View
            style={[
              estilos.preenchimentoBarraProgresso,
              { width: `${porcentagemGeral}%` },
            ]}
          />
        </View>
      </View>

      {/* 5. GRADE 2X2 DE MÉTRICAS */}
      <View style={estilos.gradeMetricasDestaque}>
        {metricas.map((item, indice) => (
          <View key={`metrica-${indice}`} style={estilos.cartaoMetricaItem}>
            <Feather name={item.icone} size={15} color={cores.confirmar} />
            <Text style={estilos.textoValorMetrica}>{item.valor}</Text>
            <Text style={estilos.textoRotuloMetrica}>{item.rotulo}</Text>
          </View>
        ))}
      </View>

      {/* 6. PLANO DE CORRIDA / ESTRATÉGIA PEDAGÓGICA (Se existir) */}
      {trilha?.strategy ? (
        <View style={estilos.blocoEstrategiaPlano}>
          <Text style={estilos.textoTituloEstrategia}>Plano de corrida</Text>
          <Text style={estilos.textoDescricaoEstrategia}>{trilha.strategy}</Text>
        </View>
      ) : null}

      {/* 7. AÇÕES E SELETOR DE STATUS */}
      <View style={estilos.colunaAcoesDestaque}>
        
        {/* Botão de Ajustar com IA */}
        <TouchableOpacity
          style={estilos.botaoAjustarEstrategia}
          onPress={onAbrirAjusteEstrategia}
          activeOpacity={0.8}
        >
          <Feather name="sliders" size={14} color={cores.botoesTexto} />
          <Text style={estilos.textoBotaoAjustarEstrategia}>
            Ajustar estratégia com IA
          </Text>
        </TouchableOpacity>

        {/* Botão de PDF */}
        <TouchableOpacity
          style={estilos.botaoExportarPdfDestaque}
          onPress={onExportarPdf}
          activeOpacity={0.8}
        >
          <Feather name="printer" size={14} color={cores.textoComum} />
          <Text style={estilos.textoBotaoExportarPdf}>
            Exportar / Imprimir PDF
          </Text>
        </TouchableOpacity>

        {/* Seletor de Status (Segmented Control nativo) */}
        <View style={estilos.areaSeletorStatus}>
          {OPCOES_DE_STATUS.map((opcao) => {
            const estaAtivo = (trilha?.status || 'planejado') === opcao.chave;
            return (
              <TouchableOpacity
                key={opcao.chave}
                style={[
                  estilos.pilulaStatusItem,
                  estaAtivo && estilos.pilulaStatusItemAtiva,
                ]}
                onPress={() => onAlterarStatus && onAlterarStatus(opcao.chave)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    estilos.textoPilulaStatus,
                    estaAtivo && estilos.textoPilulaStatusAtiva,
                  ]}
                >
                  {opcao.rotulo}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

      </View>

    </View>
  );
}