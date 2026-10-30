import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { estilos } from './estilos';
import { cores } from './cores';

/**
 * FORMATAÇÃO DE DATA RESILIENTE (Nativa em PT-BR)
 * Formata datas ISO (ex: '2024-05-10') para formato legível brasileiro
 * sem precisar obrigatoriamente de dependências externas.
 */
function formatarDataBrasil(dataIso) {
  if (!dataIso) return '';
  try {
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch (erro) {
    return '';
  }
}

/**
 * COMPONENTE: CartaoTrilha (Substituto do RoadmapCard do Web)
 * 
 * Finalidade: Renderizar cada trilha/plano de aprendizado na lista principal.
 * 
 * @param {object} trilha - Objeto com os dados do roadmap (título, progresso, etc.)
 * @param {function} onAbrirCockpit - Função chamada ao tocar em "Abrir Cockpit"
 * @param {function} onExportarPdf - Função chamada ao tocar em "PDF"
 * @param {function} onExcluir - Função chamada quando a exclusão for confirmada
 */
export default function CartaoTrilha({
  trilha,
  onAbrirCockpit,
  onExportarPdf,
  onExcluir,
}) {
  // Cálculos de progresso defensivos (evitam divisão por zero caso a trilha venha vazia)
  const etapasConcluidas = trilha?.etapasConcluidas || trilha?.progress?.done || 0;
  const totalEtapas = trilha?.totalEtapas || trilha?.progress?.total || 1;
  const porcentagemProgresso = Math.min(
    Math.round((etapasConcluidas / totalEtapas) * 100),
    100
  );

  // Extração da data mais recente (atualização ou criação)
  const dataExibicao = formatarDataBrasil(trilha?.updated_date || trilha?.created_date);

  /**
   * Dispara o alerta nativo de confirmação de exclusão
   * Substitui a janela modal complexa (AlertDialog) da Web
   */
  const confirmarExclusao = () => {
    Alert.alert(
      'Remover da garagem?',
      `O roadmap "${trilha?.title || 'Sem título'}" e todo o seu progresso serão apagados definitivamente.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            if (onExcluir) onExcluir(trilha);
          },
        },
      ]
    );
  };

  return (
    <View style={estilos.cartaoTrilha}>
      
      {/* 1. CABEÇALHO: Tópico, Título, Detalhes e Status */}
      <View style={estilos.cabecalhoCartaoTrilha}>
        <View style={estilos.areaTextosCabecalho}>
          <Text style={estilos.textoTopicoTrilha}>
            {trilha?.topic || 'TRILHA'}
          </Text>

          <Text style={estilos.textoTituloTrilha} numberOfLines={2}>
            {trilha?.title || 'Trilha de Aprendizado'}
          </Text>

          <Text style={estilos.textoDetalhesTrilha}>
            {trilha?.level || 'Iniciante'} · {trilha?.goal_type || 'Geral'}
            {dataExibicao ? ` · atualizado em ${dataExibicao}` : ''}
          </Text>
        </View>

        {/* Emblema com o Status atual (ex: Em andamento, Concluído) */}
        <View style={estilos.emblemaStatus}>
          <Text style={estilos.textoEmblemaStatus}>
            {trilha?.status || 'ATIVO'}
          </Text>
        </View>
      </View>

      {/* 2. BARRA DE TELEMETRIA: Exibe a taxa de conclusão */}
      <View style={estilos.areaBarraTelemetria}>
        <View style={estilos.linhaInfoProgresso}>
          <Text style={estilos.textoRotuloProgresso}>
            {etapasConcluidas}/{totalEtapas} etapas concluídas
          </Text>
          <Text style={estilos.textoPorcentagemProgresso}>
            {porcentagemProgresso}%
          </Text>
        </View>

        {/* Trilho e Preenchimento da barra */}
        <View style={estilos.trilhoBarraProgresso}>
          <View
            style={[
              estilos.preenchimentoBarraProgresso,
              { width: `${porcentagemProgresso}%` }, // Largura dinâmica proporcional ao progresso
            ]}
          />
        </View>
      </View>

      {/* 3. AÇÕES DO CARTÃO: Abrir, PDF e Excluir */}
      <View style={estilos.areaAcoesCartao}>
        
        {/* Botão Principal: Abrir Cockpit */}
        <TouchableOpacity
          style={estilos.botaoAbrirCockpit}
          onPress={() => onAbrirCockpit && onAbrirCockpit(trilha?.id)}
          activeOpacity={0.8}
        >
          <Text style={estilos.textoBotaoCockpit}>Abrir cockpit</Text>
          <Feather name="external-link" size={13} color={cores.botoesTexto} />
        </TouchableOpacity>

        {/* Botão Secundário: PDF */}
        <TouchableOpacity
          style={estilos.botaoAcaoPdf}
          onPress={() => onExportarPdf && onExportarPdf(trilha?.id)}
          activeOpacity={0.8}
        >
          <Feather name="printer" size={13} color={cores.textoComum} />
          <Text style={estilos.textoBotaoPdf}>PDF</Text>
        </TouchableOpacity>

        {/* Botão de Excluir (Lixeira) */}
        <TouchableOpacity
          style={estilos.botaoExcluirCard}
          onPress={confirmarExclusao}
          hitSlop={10}
          activeOpacity={0.7}
        >
          <Feather name="trash-2" size={16} color={cores.cancelar} />
        </TouchableOpacity>

      </View>

    </View>
  );
}