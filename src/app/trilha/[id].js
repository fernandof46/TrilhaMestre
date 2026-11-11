import React, { useState } from 'react'; // Importa a biblioteca React e o hook de estado para mensagens dinâmicas
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'; // Importa os primitivos de interface e de tratamento de links externos do ecossistema móvel
import { useLocalSearchParams, useRouter } from 'expo-router'; // Importa os ganchos do Expo Router para captura de parâmetros dinâmicos e navegação
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { STATUS_TRILHA, useTrilhas } from '../../lib/TrilhasContext'; // Importa o contexto reativo de persistência e mutação de progresso das trilhas
import { estilos as e, espaco, fonte } from '../../componentes/estilos'; // Importa os seus estilos globais unificados (Design System) apelidados de 'e'
import { cores } from '../../componentes/cores'; // Importa a sua paleta de cores centralizada corporativa

export default function TelaVisualizarRoteiro() {
  const { id } = useLocalSearchParams(); // Captura o ID dinâmico passado através do segmento da URL nativa
  const roteador = useRouter(); // Inicializa o motor de navegação reversa ou avançada do aplicativo
  const { trilhas, isLoading, toggleStep, atualizarStatus } = useTrilhas(); // Desestrutura os dados e o interceptador de alternância de progresso
  const [erro, setErro] = useState(''); // Estado reativo para capturar falhas de sistema ou de hardware (como ausência de navegador)
  const [exportando, setExportando] = useState(false);
  
  // Realiza a varredura na base local em busca da trilha correspondente ao parâmetro de rota ativo
  const roteiro = trilhas.find((item) => item.id === id);

  // Função assíncrona responsável por invocar o navegador padrão do sistema operacional do celular
  const abrirLinkExterno = async (url) => {
    try {
      await Linking.openURL(url); // Dispara a intent nativa (Android/iOS) para carregar o endereço web solicitado
    } catch (erroAbertura) {
      console.error('Falha ao abrir recurso:', erroAbertura);
      setErro('Não foi possível abrir este material no dispositivo.');
    }
  };

  const escaparHtml = (valor) => String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const exportarPdf = async () => {
    setErro('');
    setExportando(true);
    try {
      const fasesHtml = roteiro.phases.map((fase) => `
        <section>
          <h2>${escaparHtml(fase.title)}</h2>
          <p>${escaparHtml(fase.description)}</p>
          <ul>
            ${fase.steps.map((etapa) => `
              <li>
                <strong>${escaparHtml(etapa.title)}</strong>
                <p>${escaparHtml(etapa.description)}</p>
                ${(etapa.resources || []).map((recurso) => `
                  <p>${escaparHtml(recurso.title)} (${escaparHtml(recurso.type)})</p>
                `).join('')}
              </li>
            `).join('')}
          </ul>
        </section>
      `).join('');
      const html = `
        <html lang="pt-BR">
          <head><meta charset="utf-8"><style>
            body { font-family: Arial, sans-serif; color: #202b2a; padding: 24px; }
            h1 { color: #007f7b; } h2 { margin-top: 24px; }
            p, li { line-height: 1.5; } section { page-break-inside: avoid; }
          </style></head>
          <body>
            <h1>${escaparHtml(roteiro.title)}</h1>
            <p>${escaparHtml(roteiro.description)}</p>
            <p>Nível: ${escaparHtml(roteiro.level)} · Duração: ${escaparHtml(roteiro.estimatedTime)}</p>
            ${fasesHtml}
          </body>
        </html>
      `;
      const arquivo = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(arquivo.uri, {
          dialogTitle: 'Compartilhar trilha em PDF',
          mimeType: 'application/pdf',
        });
      } else {
        await Print.printAsync({ html });
      }
    } catch (erroExportacao) {
      console.error('Falha ao exportar trilha:', erroExportacao);
      setErro('Não foi possível gerar ou compartilhar o PDF desta trilha.');
    } finally {
      setExportando(false);
    }
  };

  const alterarStatus = async (status) => {
    try {
      await atualizarStatus(roteiro.id, status);
      setErro('');
    } catch (erroStatus) {
      console.error('Falha ao atualizar status da trilha:', erroStatus);
      setErro('Não foi possível atualizar o status da trilha.');
    }
  };

  // Tratamento visual de carregamento inicial caso a trilha ainda esteja sendo consultada no banco local
  if (isLoading && !roteiro) {
    return (
      <View style={[e.containerPrincipal, e.centro]}>
        <ActivityIndicator color={cores.confirmar} size="large" />
      </View>
    );
  }

  // Fallback de Segurança: Tela amigável em português caso o roteiro de estudos seja inválido ou deletado
  if (!roteiro) {
    return (
      <View style={[e.containerPrincipal, e.centro]}>
        <Text style={e.textoTitulo}>Trilha não encontrada</Text>
        <Pressable onPress={() => roteador.back()} style={e.botaoConfirmar}>
          <Text style={e.textoBotao}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    // Área de rolagem nativa que substitui as divs de transbordo e garante usabilidade em qualquer tela móvel
    <ScrollView contentContainerStyle={e.containerPrincipal}>
      
      {/* Link ergonômico superior para retornar à tela de histórico de abas anteriores */}
      <Pressable accessibilityRole="button" onPress={() => roteador.back()} style={{ alignSelf: 'flex-start', marginBottom: espaco.xxl }}>
        <Text style={e.textoDestaqueCompacto}>‹  Minhas trilhas</Text>
      </Pressable>
      
      {/* Seção de Metadados: Exibe a dificuldade da trilha e a estimativa calculada combinando sua tipografia */}
      <Text style={e.rotuloDestaqueEspacado}>{roteiro.level} · {roteiro.estimatedTime}</Text>
      <Text style={e.textoTituloDestaque}>{roteiro.title}</Text>
      <Text style={[e.textoDescricao, { textAlign: 'left', marginTop: espaco.md }]}>{roteiro.description}</Text>

      <Text style={[e.textoEnunciado, { marginTop: espaco.lg }]}>Status da trilha</Text>
      <View style={[e.linhaQuebra, { gap: espaco.sm, marginTop: espaco.sm }]}>
        {[
          { valor: STATUS_TRILHA.EM_ANDAMENTO, rotulo: 'Em andamento' },
          { valor: STATUS_TRILHA.PAUSADA, rotulo: 'Pausada' },
          { valor: STATUS_TRILHA.CONCLUIDA, rotulo: 'Concluída' },
        ].map((opcao) => {
          const selecionada = (roteiro.status || STATUS_TRILHA.EM_ANDAMENTO) === opcao.valor;
          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: selecionada }}
              key={opcao.valor}
              onPress={() => alterarStatus(opcao.valor)}
              style={[e.pilulaStatusItem, selecionada && e.estadoAtivo]}
            >
              <Text style={selecionada ? e.textoAtivoForte : e.textoSecundario}>{opcao.rotulo}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={exportando}
        onPress={exportarPdf}
        style={({ pressed }) => [
          e.botaoSecundario,
          { marginTop: espaco.lg },
          exportando && e.botaoDesabilitado,
          pressed && { opacity: 0.82 },
        ]}
      >
        <Text style={e.textoBotao}>{exportando ? 'Preparando PDF...' : 'Exportar trilha em PDF'}</Text>
      </Pressable>
      
      {/* Renderização condicional do banner de alerta de erros usando os seletores nativos */}
      {erro ? <Text accessibilityRole="alert" style={[e.textoErro, { marginTop: espaco.md }]}>{erro}</Text> : null}

      {/* Varredura em cascata para renderização das fases macro estruturadas dentro do objeto */}
      {roteiro.phases.map((fase, indiceFase) => (
        // Cada fase assume a estética visual e estrutural do 'cartaoGenerico' com margens em bloco do seu sistema
        <View key={fase.id} style={[e.cartaoGenerico, { marginTop: espaco.xl }]}>
          
          {/* Cabeçalho da Fase: Isola o título e a descrição superior através dos seletores do bloco */}
          <View style={e.cartaoCabecalho}>
            <Text style={e.rotuloNeutro}>FASE {indiceFase + 1}</Text>
            <Text style={e.textoTituloItem}>{fase.title}</Text>
            <Text style={e.textoApoio}>{fase.description}</Text>
          </View>

          {/* Área de Conteúdo Interno do Cartão: Agrupa os passos operacionais de estudo */}
          <View style={e.cartaoConteudo}>
            {fase.steps.map((etapa) => {
              // Verifica de forma reativa se o identificador da etapa atual consta na lista de itens concluídos
              const concluida = roteiro.completedStepIds?.includes(etapa.id) ?? false;
              
              return (
                // Aplica o divisor de linha estruturado de etapas ('containerLinhaEtapa') associado à opacidade se concluído
                <View key={etapa.id} style={[e.containerLinhaEtapa, concluida && e.containerEtapaConcluida]}>
                  
                  {/* Mecanismo de Toque (Checkbox): Modifica o progresso do usuário no banco local ao ser pressionado */}
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: concluida }}
                    onPress={() => toggleStep(roteiro.id, etapa.id).catch((erroToggle) => {
                      console.error('Falha ao atualizar etapa:', erroToggle);
                      setErro('Não foi possível salvar seu progresso.');
                    })}
                    style={e.linhaCompacta}
                  >
                    {/* 
                      Quadrado de Seleção (Checkbox): Reaproveita as bordas redondas médias do seletor 'botaoIcone',
                      mesclando-se com o seletor 'estadoAtivo' caso a etapa passe para o estado de concluída.
                    */}
                    <View style={[e.botaoIcone, { width: 22, height: 22, borderWidth: 1, borderColor: cores.bordaInput }, concluida && e.estadoAtivo]}>
                      {concluida ? <Text style={[e.textoAtivoForte, { fontSize: fonte.xs }]}>✓</Text> : null}
                    </View>
                    
                    {/* Título da tarefa atual: Aplica renderização de tachado (line-through) dinamicamente se concluída */}
                    <Text style={[e.textoEnunciadoRevisao, concluida && e.textoTituloEtapaConcluido]}>
                      {etapa.title}
                    </Text>
                  </Pressable>

                  {/* Descrição detalhada da etapa com margem esquerda para respeitar o recuo visual do checkbox */}
                  <Text style={[e.textoCorpo, { marginLeft: 32, marginTop: espaco.sm }]}>
                    {etapa.description}
                  </Text>

                  {/* Mapeia os materiais de apoio e links anexados à etapa vigente */}
                  {etapa.resources?.map((recurso) => (
                    <Pressable
                      accessibilityRole="link"
                      key={`${etapa.id}-${recurso.url}`}
                      onPress={() => abrirLinkExterno(recurso.url)}
                      // Reaproveita o botão de recursos externos do seu arquivo de design system para manter paridade visual
                      style={[e.botaoRecursoExterno, { marginLeft: 32, marginTop: espaco.sm, justifyContent: 'space-between' }]}
                    >
                      {/* Título do material técnico com tratamento de cor de destaque de link */}
                      <Text numberOfLines={1} style={[e.textoTituloRecurso, e.textoAtivoDestaque]}>
                        {recurso.title}
                      </Text>
                      
                      {/* Tipo do arquivo ou mídia associada usando a tipografia de apoio neutra */}
                      <Text style={e.textoApoio}>
                        {recurso.type}
                      </Text>
                    </Pressable>
                  ))}
                  
                </View>
              );
            })}
          </View>
          
        </View>
      ))}
    </ScrollView>
  );
}
