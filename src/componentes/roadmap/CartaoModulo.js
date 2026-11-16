import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';
import LinhaEtapa from './LinhaEtapa'; // Componente que renderiza cada linha de aula/passo

/**
 * COMPONENTE: CartaoModulo (Substituto do ModuleCard)
 * 
 * Finalidade: Representa um módulo completo da rota de estudos. Pode ser
 * aberto/fechado para listar suas etapas, objetivos e checkpoint de avaliação.
 * 
 * @param {object} modulo - Objeto contendo { title, objective, est_hours, steps }
 * @param {number} indice - Posição do módulo na lista (0, 1, 2...)
 * @param {Array} etapasConcluidas - Lista de chaves (IDs) das etapas já concluídas
 * @param {function} onAlternarEtapa - Alterna o status da etapa (concluída / pendente)
 * @param {function} onAbrirTutor - Abre o chat de IA de dúvidas sobre a etapa selecionada
 * @param {function} onAbrirCheckpoint - Inicia o teste/quiz do setor
 * @param {object} ultimaTentativa - Dados da última nota obtida no quiz { passed, score, total, percent }
 */
export default function CartaoModulo({
  modulo,
  indice = 0,
  etapasConcluidas = [],
  onAlternarEtapa,
  onAbrirTutor,
  onAbrirCheckpoint,
  ultimaTentativa,
}) {
  // O primeiro módulo (índice 0) já inicia aberto por padrão
  const [expandido, setExpandido] = useState(indice === 0);

  // Lista defensiva de etapas do módulo
  const etapas = modulo?.steps || [];
  
  // Cálculo de progresso do módulo
  const totalEtapas = etapas.length;
  const etapasFeitas = etapas.filter((etapa) => etapasConcluidas.includes(etapa.key)).length;
  const porcentagem = totalEtapas > 0 ? Math.round((etapasFeitas / totalEtapas) * 100) : 0;

  // Formatação do número do módulo em 2 dígitos (ex: 01, 02, 03)
  const numeroFormatado = String(indice + 1).padStart(2, '0');

  return (
    <View style={estilos.cartaoModulo}>
      
      {/* 1. CABEÇALHO TOCÁVEL (ABRE / FECHA O MÓDULO) */}
      <TouchableOpacity
        style={estilos.cabecalhoModulo}
        onPress={() => setExpandido((atual) => !atual)}
        activeOpacity={0.7}
      >
        <Text style={estilos.emblemaNumeroModulo}>
          Módulo {numeroFormatado}
        </Text>

        <View style={estilos.areaTextosModulo}>
          <Text style={estilos.textoTituloModulo} numberOfLines={1}>
            {modulo?.title || 'Módulo de Aprendizado'}
          </Text>
          <Text style={estilos.textoSubtituloModulo}>
            {etapasFeitas}/{totalEtapas} etapas · {modulo?.est_hours ? `${modulo.est_hours}h estimadas` : 'carga flexível'}
          </Text>
        </View>

        {/* Mini barra de progresso visual */}
        <View style={estilos.areaProgressoCabecalhoModulo}>
          <View style={estilos.trilhoMiniProgressoModulo}>
            <View
              style={[
                estilos.preenchimentoMiniProgressoModulo,
                { width: `${porcentagem}%` },
              ]}
            />
          </View>
          <Text style={estilos.textoPorcentagemModulo}>{porcentagem}%</Text>
        </View>

        {/* Seta indicadora de expandido / recolhido */}
        <Feather
          name={expandido ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={cores.descricao}
        />
      </TouchableOpacity>

      {/* 2. CONTEÚDO EXPANDIDO */}
      {expandido && (
        <View style={estilos.corpoModuloExpandido}>
          
          {/* Objetivo do módulo (se existir) */}
          {modulo?.objective ? (
            <View style={estilos.blocoObjetivoModulo}>
              <Text style={estilos.textoObjetivoModulo}>
                {modulo.objective}
              </Text>
            </View>
          ) : null}

          {/* Barra de Ações do Módulo (Quiz / Checkpoint) */}
          <View style={estilos.areaAcoesModulo}>
            <TouchableOpacity
              style={estilos.botaoCheckpointModulo}
              onPress={() => onAbrirCheckpoint && onAbrirCheckpoint(modulo)}
              activeOpacity={0.8}
            >
              <Feather name="shield" size={13} color={cores.confirmar} />
              <Text style={estilos.textoBotaoCheckpoint}>
                Checkpoint de setor
              </Text>
            </TouchableOpacity>

            {/* Resultado da última tentativa no quiz (se houver) */}
            {ultimaTentativa ? (
              <View style={estilos.linhaResultadoTentativa}>
                <Feather
                  name="award"
                  size={13}
                  color={ultimaTentativa.passed ? cores.confirmar : cores.cancelar}
                />
                <Text
                  style={
                    ultimaTentativa.passed
                      ? estilos.textoResultadoSucesso
                      : estilos.textoResultadoFalha
                  }
                >
                  Último: {ultimaTentativa.score}/{ultimaTentativa.total} ({ultimaTentativa.percent}%)
                </Text>
              </View>
            ) : null}
          </View>

          {/* Lista de Etapas (Aulas / Passos) */}
          <View style={estilos.listaEtapasModulo}>
            {etapas.map((etapa) => (
              <LinhaEtapa
                key={etapa.key}
                etapa={etapa}
                concluida={etapasConcluidas.includes(etapa.key)}
                onAlternarConclusao={() => onAlternarEtapa && onAlternarEtapa(etapa.key)}
                onAbrirTutor={() => onAbrirTutor && onAbrirTutor(modulo, etapa)}
              />
            ))}
          </View>

        </View>
      )}

    </View>
  );
}