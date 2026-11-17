// src/app/_layout.js
import React, { useEffect } from 'react'; // Importa o React e o hook de efeito para monitorar mudanças de sessão
import { ActivityIndicator, View } from 'react-native'; // Importa indicador de carregamento e contêiner nativo
import { Stack, useRouter, useSegments } from 'expo-router'; // Importa o navegador em pilha e hooks de roteamento do Expo Router
import { StatusBar } from 'expo-status-bar'; // Controla a aparência da barra de status do sistema operacional
import { cores } from '../componentes/cores'; // Importa a paleta de cores centralizada do projeto
import { TrilhasProvider } from '../contextos/TrilhasContext'; // Provedor global de persistência das trilhas do usuário
import { ProvedorAutenticacao, useAutenticacao } from '../contextos/AuthContext'; // Provedor e hook de autenticação Firebase
// O pacote nativo de anúncios não é carregado no layout raiz; cada ponto de uso
// verifica primeiro a disponibilidade do módulo para evitar falhas antes da navegação.
/**
 * COMPONENTE: NavegacaoAutenticada
 * Atua como porteiro de segurança do aplicativo:
 * - Enquanto verifica o estado de login no Firebase, exibe a tela de carregamento.
 * - Se não houver usuário autenticado, redireciona obrigatoriamente para a tela 'login'.
 * - Se houver usuário autenticado, libera o acesso às abas '(tabs)' e aos detalhes da trilha.
 */
function NavegacaoAutenticada() {
  const { usuario, carregando } = useAutenticacao(); // Obtém o usuário atual e o status inicial de verificação
  console.log('DIAGNÓSTICO AUTH:', { carregando, temUsuario: Boolean(usuario), uid: usuario?.uid });
  const segmentos = useSegments(); // Captura o caminho atual da navegação (ex: ['login'] ou ['(tabs)'])
  const roteador = useRouter(); // Inicializa o controlador imperativo de rotas

  // Define uma chave única de armazenamento local vinculada ao UID do usuário logado
  const chaveArmazenamento = usuario ? '@trilhamestre/trilhas-v1:' + usuario.uid : null;

  // Garante o redirecionamento imediato sempre que o estado de autenticação mudar
  useEffect(() => {
    if (carregando) return; // Aguarda o Firebase terminar de checar se existe sessão salva

    const estaNaTelaLogin = segmentos.at(0) === 'login'; // Verifica se o usuário já está na rota de login

    if (!usuario && !estaNaTelaLogin) {
      // Se não está logado e não está na tela de login, força a ida imediata para /login
      roteador.replace('/login');
    } else if (usuario && estaNaTelaLogin) {
      // Se já está logado e ainda está na tela de login, envia direto para a tela principal
      roteador.replace('/(tabs)');
    }
  }, [usuario, carregando, segmentos, roteador]);

  // Exibe indicador de carregamento centralizado enquanto o Firebase inicializa
  if (carregando) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: cores.bkprincipal,
        }}
      >
        <ActivityIndicator color={cores.confirmar} size="large" />
      </View>
    );
  }
  // Define a rota inicial válida enquanto o estado autenticado determina o acesso.
  // Define a pilha de telas protegidas conforme o estado de autenticação
  const navegacao = (
    <Stack
      initialRouteName={usuario ? '(tabs)' : 'login'}
      screenOptions={{
        headerShown: false, // Oculta o cabeçalho padrão da pilha (as abas possuem cabeçalho próprio)
        contentStyle: { backgroundColor: cores.bkprincipal }, // Define o fundo escuro padrão em todas as transições
      }}
    >
      {/* Rota pública acessível apenas quando NÃO há usuário logado */}
      <Stack.Protected guard={!usuario}>
        <Stack.Screen name="login" />
      </Stack.Protected>

      {/* Rotas privadas acessíveis somente quando HÁ um usuário autenticado */}
      <Stack.Protected guard={Boolean(usuario)}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="trilha/[id]" />
      </Stack.Protected>
    </Stack>
  );

  // Se não houver usuário logado, renderiza apenas a navegação pública (login)
  if (!usuario) return navegacao;

  // Envolve as telas privadas com o contexto de trilhas isolado por usuário
  return (
    <TrilhasProvider key={usuario.uid} storageKey={chaveArmazenamento}>
      {navegacao}
    </TrilhasProvider>
  );
}

/**
 * COMPONENTE RAIZ: LayoutRaizAplicacao
 * Envolve toda a árvore do aplicativo com o provedor de autenticação e barra de status clara.
 */
export default function LayoutRaizAplicacao() {
  return (
    <ProvedorAutenticacao>
      <StatusBar style="light" />
      <NavegacaoAutenticada />
    </ProvedorAutenticacao>
  );
}
