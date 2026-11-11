import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { STATUS_TRILHA, useTrilhas } from '../../lib/TrilhasContext';
import { estilos as e, espaco } from '../../componentes/estilos'; // Importa seu arquivo unificado de estilos globais (Design System) apelidado de 'e'
import { cores } from '../../componentes/cores';

export default function TelaHistoricoTrilhas() {
  const roteador = useRouter();
  const { trilhas, deleteTrilha, isLoading, storageError } = useTrilhas();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todas');

  const trilhasFiltradas = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase('pt-BR');
    return trilhas.filter((trilha) => {
      const correspondeBusca = !termo
        || `${trilha.title} ${trilha.topic || ''} ${trilha.description || ''}`
          .toLocaleLowerCase('pt-BR')
          .includes(termo);
      const correspondeStatus = filtroStatus === 'todas' || (trilha.status || STATUS_TRILHA.EM_ANDAMENTO) === filtroStatus;
      return correspondeBusca && correspondeStatus;
    });
  }, [trilhas, busca, filtroStatus]);

  const filtros = [
    { valor: 'todas', rotulo: 'Todas' },
    { valor: STATUS_TRILHA.EM_ANDAMENTO, rotulo: 'Em andamento' },
    { valor: STATUS_TRILHA.PAUSADA, rotulo: 'Pausadas' },
    { valor: STATUS_TRILHA.CONCLUIDA, rotulo: 'Concluídas' },
  ];

  const rotuloStatus = (status) => {
    switch (status) {
      case STATUS_TRILHA.PAUSADA:
        return 'Pausada';
      case STATUS_TRILHA.CONCLUIDA:
        return 'Concluída';
      default:
        return 'Em andamento';
    }
  };

  // Exibe a caixa de diálogo nativa do sistema operacional (Android/iOS) para confirmação de exclusão
  const confirmarExclusao = (roteiroObjeto) => {
    Alert.alert('Excluir trilha?', `A trilha "${roteiroObjeto.title}" será removida deste dispositivo.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        // Executa a remoção física no banco de dados local ou AsyncStorage
        onPress: () => deleteTrilha(roteiroObjeto.id).catch((erroChamada) => {
          console.error('Falha ao excluir trilha:', erroChamada);
          Alert.alert('Não foi possível excluir', 'Tente novamente.');
        }),
      },
    ]);
  };

  // Função interna encarregada de renderizar cada cartão da listagem de maneira otimizada (Substitui o .map da Web)
  const renderizarCartaoTrilha = ({ item }) => {
    // Calcula o somatório total de etapas varrendo todas as fases estruturadas do objeto da trilha
    const totalEtapas = item.phases.reduce((contador, fase) => contador + fase.steps.length, 0);
    const concluidas = item.completedStepIds?.length ?? 0;
    
    return (
      // O cartão consome diretamente o seletor 'cartaoGenerico' do seu arquivo global de superfícies
      <View style={e.cartaoGenerico}>
        
        {/* Bloco de conteúdo do cartão. Consome o padding interno horizontal e vertical do 'cartaoConteudo' */}
        <View style={e.cartaoConteudo}>
          
          {/* Pressable substitui o antigo link clicável da Web, fornecendo feedback tátil nativo */}
          <Pressable 
            onPress={() => roteador.push(`/trilha/${item.id}`)} 
            style={e.areaTextos}
          >
            {/* Rótulo superior contendo o nível de dificuldade da trilha */}
            <Text style={e.rotuloDestaqueEspacado}>{item.level} · {rotuloStatus(item.status)}</Text>
            
            {/* Título principal do roteiro. Limita a exibição a no máximo 2 linhas para evitar quebras em telas menores */}
            <Text numberOfLines={2} style={e.textoTituloItem}>{item.title}</Text>
            
            {/* Metadados de progresso da trilha utilizando a tipografia de apoio secundária */}
            <Text style={e.textoSecundarioEspacado}>{concluidas} de {totalEtapas} etapas concluídas</Text>
          </Pressable>

        </View>

        {/* Rodapé do cartão contendo o botão de ação. Consome o alinhamento horizontal do 'cartaoRodape' */}
        <View style={e.cartaoRodape}>
          <Pressable
            accessibilityLabel={`Excluir trilha ${item.title}`} // Propriedade de acessibilidade para leitores de tela
            accessibilityRole="button" // Identifica o elemento estruturalmente como um botão de comando
            onPress={() => confirmarExclusao(item)}
            style={e.botaoExcluirCard} // Reutiliza o botão de exclusão de cartão mapeado no seu arquivo global
          >
            {/* Texto do botão de exclusão que consome o estilo textual de erro compacto (cor vermelha de alerta) */}
            <Text style={e.textoErroCompacto}>Excluir</Text>
          </Pressable>
        </View>

      </View>
    );
  };

  return (
    // Raiz estrutural da tela consumindo o container global principal (fundo escuro e paddings configurados)
    <View style={e.containerPrincipal}>
      
      {/* Rótulo superior de chamada institucional da página */}
      <Text style={e.rotuloNeutroEspacado}>SUA JORNADA</Text>
      
      {/* Título principal da tela em destaque */}
      <Text style={e.textoTituloDestaque}>Minhas trilhas</Text>

      <TextInput
        accessibilityLabel="Buscar trilhas"
        onChangeText={setBusca}
        placeholder="Buscar por tema ou título"
        placeholderTextColor={cores.descricao}
        returnKeyType="search"
        style={[e.campoTextoMensagem, { marginBottom: espaco.md }]}
        value={busca}
      />

      <View style={[e.linhaQuebra, { gap: espaco.sm, marginBottom: espaco.lg }]}>
        {filtros.map((filtro) => {
          const selecionado = filtroStatus === filtro.valor;
          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: selecionado }}
              key={filtro.valor}
              onPress={() => setFiltroStatus(filtro.valor)}
              style={[e.pilulaStatusItem, selecionado && e.estadoAtivo]}
            >
              <Text style={selecionado ? e.textoAtivoForte : e.textoSecundario}>{filtro.rotulo}</Text>
            </Pressable>
          );
        })}
      </View>
      
      {/* Renderização condicional do banner de erro de armazenamento utilizando os estilos de alerta do seu sistema */}
      {storageError ? (
        <View style={e.bannerAlertaDestrutivo}>
          <Text accessibilityRole="alert" style={e.textoErro}>
            Não foi possível acessar as trilhas salvas neste dispositivo.
          </Text>
        </View>
      ) : null}

      {/* Componente nativo de alta performance para renderização de listagens roláveis no ambiente mobile */}
      <FlatList
        contentContainerStyle={{ paddingBottom: espaco.xl }} // Mantém espaço para a rolagem não grudar na barra de abas
        data={trilhasFiltradas} // Fonte de dados filtrada no dispositivo
        keyExtractor={(item) => item.id} // Chave primária de identificação única para cada item
        renderItem={renderizarCartaoTrilha} // Função de renderização de interface dos blocos
        showsVerticalScrollIndicator={false} // Oculta a barra lateral direita de rolagem por questões estéticas
        
        // Componente exibido automaticamente caso a lista de dados esteja inteiramente vazia ou carregando
        ListEmptyComponent={
          <Text style={e.textoDescricao}>
            {isLoading
              ? 'Carregando trilhas...'
              : trilhas.length === 0
                ? 'Suas trilhas criadas aparecerão aqui.'
                : 'Nenhuma trilha corresponde à busca e ao filtro selecionados.'}
          </Text>
        }
      />
    </View>
  );
}
