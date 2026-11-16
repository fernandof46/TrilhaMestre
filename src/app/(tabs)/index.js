// src/app/(tabs)/index.js
import React, { useState } from 'react'; // Importa React e estado para controle de carregamento e erros
import { Alert, Pressable, ScrollView, Text, View } from 'react-native'; // Importa componentes nativos de layout e alertas
import { useRouter } from 'expo-router'; // Hook de navegação do Expo Router
import { useAutenticacao } from '../../contextos/AuthContext'; // Contexto do usuário autenticado
import { useTrilhas } from '../../contextos/TrilhasContext'; // Contexto das trilhas salvas do usuário
import { gerarOrientacaoComIA } from '../../servicos/ia/iaRoteador'; // Cascata gratuita de IA (Groq -> Gemini -> OpenRouter)
import { verificarEConsumirGeracaoTrilha } from '../../servicos/armazenamento/controleUsoServico'; // Trava de 3 trilhas/24h
import { usarAnuncioIntersticial } from '../../servicos/anuncios/usarAnuncios'; // Hook de anúncio intersticial
import { estilos as e, espaco } from '../../componentes/estilos'; // Design System oficial do projeto
import { cores } from '../../componentes/cores'; // Paleta de cores oficial
import FormularioGerador from '../../componentes/gerador/FormularioGerador'; // Formulário principal de criação de roadmap

export default function TelaInicial() {
  const roteador = useRouter(); // Inicializa o controlador de rotas
  const { usuario } = useAutenticacao(); // Dados do usuário logado
  const { trilhas, isLoading } = useTrilhas(); // Lista de trilhas já salvas pelo usuário
  const { exibirIntersticial } = usarAnuncioIntersticial(); // Controlador do anúncio de tela cheia

  const [estaGerando, setEstaGerando] = useState(false); // Controla o spinner do botão "Gerar meu roadmap"
  const [erroGeracao, setErroGeracao] = useState(''); // Exibe mensagens de erro amigáveis caso a geração falhe

  /**
   * Acionado ao clicar no botão "Gerar meu roadmap" do FormularioGerador.
   * Valida o limite de 3 trilhas/dia, exibe o Interstitial e abre a prévia gerada pela IA.
   */
  const lidarComGeracao = async ({
    topico,
    tipoMeta,
    nivel,
    horasPorSemana,
    semanasHorizonte,
    contexto,
  }) => {
    setErroGeracao('');

    // 1. Verifica se o usuário ainda possui cota dentro da janela de 24 horas (máximo 3)
    const limite = await verificarEConsumirGeracaoTrilha();

    if (!limite.permitido) {
      Alert.alert(
        'Limite Diário Atingido 🔒',
        'Você já gerou suas 3 trilhas gratuitas de hoje.\n\nSeu limite será renovado automaticamente em ~' +
          limite.horasRestantes +
          'h.'
      );
      return;
    }

    // Monta o objetivo e o contexto enriquecido com carga horária e prazo escolhidos pelo aluno
    const objetivoFormatado =
      tipoMeta === 'construir'
        ? 'Construir um projeto prático em ' + topico
        : 'Aprender e dominar ' + topico + ' do zero';

    const contextoCompleto = [
      'Disponibilidade: ' + horasPorSemana + ' horas por semana.',
      'Prazo desejado: ' + semanasHorizonte + ' semanas.',
      contexto ? 'Observações do aluno: ' + contexto : '',
    ]
      .filter(Boolean)
      .join(' ');

    setEstaGerando(true);

    // 2. Exibe o anúncio Interstitial e, logo após fechar, gera o roteiro com IA gratuita
    exibirIntersticial(async () => {
      try {
        const roteiroGerado = await gerarOrientacaoComIA({
          tema: topico,
          objetivo: objetivoFormatado,
          nivel,
          contexto: contextoCompleto,
        });

        // Monta o objeto temporário (rascunho/prévia) para o usuário explorar antes de salvar
        const rascunho = {
          ...roteiroGerado,
          id: 'previa-' + Date.now(),
          level: nivel,
          topic: topico,
          goal: objetivoFormatado,
          context: contextoCompleto,
        };

        // Abre a tela de visualização passando o rascunho via parâmetro
        roteador.push({
          pathname: '/trilha/' + rascunho.id,
          params: { rascunhoJson: JSON.stringify(rascunho) },
        });
      } catch (erro) {
        console.error('Falha ao gerar trilha:', erro);
        setErroGeracao(
          erro instanceof Error ? erro.message : 'Não foi possível gerar sua trilha agora.'
        );
      } finally {
        setEstaGerando(false);
      }
    });
  };

    return (
    <ScrollView
      style={{ flex: 1, backgroundColor: cores.bkprincipal }}
      contentContainerStyle={[
        e.containerPrincipal,
        { flex: undefined, flexGrow: 1 },
      ]}
      keyboardShouldPersistTaps="handled"
    >

      {/* Cabeçalho da seção de planejamento */}
      <View>
        <Text style={e.rotuloDestaqueEspacado}>PLANEJADOR INTELIGENTE</Text>
        <Text style={e.textoTituloDestaque}>Planeje seus estudos</Text>
        {usuario?.email ? (
          <Text style={[e.textoApoio, { marginTop: espaco.xs }]}>{usuario.email}</Text>
        ) : null}
      </View>

      <Text style={[e.textoDescricao, { textAlign: 'left', marginTop: espaco.md }]}>
        Informe o que deseja aprender para gerar um roteiro com etapas, tutor IA e materiais de apoio.
      </Text>

      {/* Formulário principal de criação de trilha */}
      <View style={{ marginTop: espaco.xl }}>
        <FormularioGerador
          aoGerar={lidarComGeracao}
          estaGerando={estaGerando}
          erro={erroGeracao}
        />
      </View>

      {/* Lista rápida das últimas 3 trilhas salvas */}
      <View style={{ marginTop: espaco.xl }}>
        <Text style={[e.textoTituloItem, { marginBottom: espaco.md }]}>Trilhas recentes</Text>
        {isLoading ? (
          <Text style={e.textoApoio}>Carregando...</Text>
        ) : trilhas.length === 0 ? (
          <View style={e.cartaoGenerico}>
            <View style={e.cartaoConteudo}>
              <Text style={e.textoApoio}>Nenhuma trilha salva ainda.</Text>
            </View>
          </View>
        ) : (
          trilhas.slice(0, 3).map((trilha) => (
            <Pressable
              key={trilha.id}
              onPress={() => roteador.push('/trilha/' + trilha.id)}
              style={({ pressed }) => [
                e.cartaoGenerico,
                pressed && { opacity: 0.85 },
              ]}
            >
              <View style={e.cartaoConteudo}>
                <Text style={e.rotuloDestaqueEspacado}>
                  {trilha.level} · {trilha.estimatedTime}
                </Text>
                <Text style={e.textoTituloTrilha}>{trilha.title}</Text>
                <Text numberOfLines={2} style={e.textoApoio}>
                  {trilha.description}
                </Text>
              </View>
            </Pressable>
          ))
        )}
      </View>

      <View style={{ height: espaco.xxl, backgroundColor: cores.bkprincipal }} />
    </ScrollView>
  );
}
