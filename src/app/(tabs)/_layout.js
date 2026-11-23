// src/app/(tabs)/_layout.js
// Layout das abas principais do app; a autenticação e a pilha raiz ficam em src/app/_layout.js.
import React, { useState } from 'react'; // Importa React e estado para bloquear cliques duplos na exclusão
import { Alert, Pressable, Text, View } from 'react-native'; // Componentes nativos de interface e alertas
import { Tabs } from 'expo-router'; // Navegador de abas inferiores do Expo Router
import { deleteUser, signOut } from 'firebase/auth'; // Funções oficiais do Firebase para encerrar sessão e excluir conta
import AsyncStorage from '@react-native-async-storage/async-storage'; // Armazenamento local para limpar os dados do usuário excluído
import { Feather } from '@expo/vector-icons'; // Ícones vetoriais padrão do Expo
import { estilos as e, espaco, tintas } from '../../componentes/estilos'; // Design System oficial do projeto
import { cores } from '../../componentes/cores'; // Paleta de cores oficial
import { auth } from '../../servicos/firebase/firebase'; // Instância de autenticação do Firebase
import { useAutenticacao } from '../../contextos/AuthContext'; // Hook que expõe o usuário autenticado
import { BannerAnuncio } from '../../servicos/anuncios/BannerAnuncio'; // Banner AdMob fixo no rodapé

export default function LayoutAbasNavegacao() {
  const { usuario } = useAutenticacao(); // Dados do usuário atualmente logado
  const [excluindoConta, setExcluindoConta] = useState(false); // Controla o estado de processamento ao apagar a conta

  // Encerra apenas a sessão atual no Firebase sem apagar os dados do usuário
  const sairDaConta = async () => {
    try {
      await signOut(auth);
    } catch (erro) {
      console.error('Falha ao sair da conta:', erro);
      Alert.alert('Não foi possível sair', 'Verifique sua conexão e tente novamente.');
    }
  };

  /**
   * Remove permanentemente os dados locais e o cadastro do usuário no Firebase Auth.
   * Atende à diretriz obrigatória de exclusão de conta da Google Play Store.
   */
    /**
   * Remove permanentemente todos os dados locais (trilhas, histórico e registros de IA)
   * e o cadastro do usuário no Firebase Auth.
   * Atende à diretriz obrigatória de exclusão de conta da Google Play Store.
   */
    /**
   * Remove permanentemente todos os dados locais (trilhas, histórico e registros de IA)
   * e o cadastro do usuário no Firebase Auth.
   * Atende à diretriz obrigatória de exclusão de conta da Google Play Store.
   */
  const executarExclusaoConta = async () => {
    const usuarioAtual = auth?.currentUser; // Obtém a instância do usuário autenticado no momento
    if (!usuarioAtual || excluindoConta) return; // Evita execução sem sessão ou cliques duplicados

    setExcluindoConta(true); // Bloqueia o botão enquanto realiza a limpeza
    try {
      // 1. Lista todas as chaves gravadas no AsyncStorage do aparelho
      const todasAsChaves = await AsyncStorage.getAllKeys();

      // Filtra qualquer chave pertencente ao aplicativo (trilhas por UID, migração e registros de uso da IA)
      const chavesDoApp = todasAsChaves.filter(
        (chave) =>
          chave.startsWith('@trilhamestre/') ||
          chave.startsWith('@trilhamestre_')
      );

      // Remove em lote todas as chaves encontradas no armazenamento local
      if (chavesDoApp.length > 0) {
        await AsyncStorage.multiRemove(chavesDoApp);
      }

      // 2. Exclui definitivamente o cadastro do usuário no Firebase Authentication
      await deleteUser(usuarioAtual);

      // Confirma ao usuário que a remoção foi concluída com sucesso
      Alert.alert(
        'Conta excluída',
        'Sua conta e todos os seus dados foram removidos permanentemente.'
      );
    } catch (erro) {
      console.error('Falha ao excluir conta:', erro);

      // O Firebase exige autenticação recente para operações sensíveis de exclusão
      if (erro?.code === 'auth/requires-recent-login') {
        Alert.alert(
          'Confirme sua identidade',
          'Por segurança, saia da conta, entre novamente e toque em "Excluir conta" para confirmar.',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Sair agora',
              onPress: () => {
                void signOut(auth); // Encerra a sessão para permitir o novo login imediato
              },
            },
          ]
        );
      } else {
        // Exibe mensagem amigável para falhas de rede ou conexão
        Alert.alert(
          'Não foi possível excluir',
          'Verifique sua conexão com a internet e tente novamente.'
        );
      }
    } finally {
      setExcluindoConta(false); // Libera o estado de processamento ao término
    }
  };



  // Exibe diálogo de confirmação antes de apagar a conta irreversivelmente
  const confirmarExclusaoConta = () => {
    Alert.alert(
      'Excluir conta permanentemente?',
      'Todas as suas trilhas salvas, etapas concluídas e dados de acesso serão apagados permanentemente. Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir conta',
          style: 'destructive',
          onPress: () => {
            void executarExclusaoConta();
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: cores.bkprincipal }}>
      {/* Navegador de abas principais */}
      <Tabs
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: cores.bksecundario },
          headerTintColor: cores.titulos,
          headerTitle: 'TrilhaMestre',
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sair da conta"
              onPress={sairDaConta}
              style={{ padding: 8 }}
            >
              <Text style={e.textoDestaqueCompacto}>
                {usuario?.displayName
                  ? usuario.displayName.split(' ')[0] + ' · Sair'
                  : 'Sair'}
              </Text>
            </Pressable>
          ),
          tabBarActiveTintColor: cores.confirmar,
          tabBarInactiveTintColor: cores.descricao,
          tabBarStyle: {
            backgroundColor: cores.bksecundario,
            borderTopColor: cores.bordaInput,
            height: 60,
            paddingTop: 6,
            paddingBottom: 6,
          },
          tabBarLabelStyle: e.textoDestaqueCompacto,
          sceneStyle: { backgroundColor: cores.bkprincipal },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Criar Trilha',
            tabBarIcon: ({ color, size }) => (
              <Feather name="plus-circle" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="historico"
          options={{
            title: 'Minhas Trilhas',
            tabBarIcon: ({ color, size }) => (
              <Feather name="layers" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="desempenho"
          options={{
            title: 'Desempenho',
            tabBarIcon: ({ color, size }) => (
              <Feather name="bar-chart-2" size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* Faixa fixa abaixo das abas com o botão vermelho Excluir Conta */}
      <View
        style={{
          backgroundColor: cores.bksecundario,
          borderTopWidth: 1,
          borderTopColor: cores.bordaInput,
          paddingHorizontal: espaco.lg,
          paddingVertical: espaco.sm,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Excluir conta permanentemente"
          disabled={excluindoConta}
          onPress={confirmarExclusaoConta}
          style={({ pressed }) => [
            e.linha,
            e.centro,
            {
              backgroundColor: tintas.vermelhoFundo,
              borderWidth: 1,
              borderColor: tintas.vermelhoBorda,
              borderRadius: 8,
              paddingVertical: espaco.sm,
              gap: espaco.xs,
            },
            excluindoConta && e.botaoDesabilitado,
            pressed && { opacity: 0.78 },
          ]}
        >
          <Feather name="trash-2" size={14} color={cores.cancelar} />
          <Text style={[e.textoDestaqueCompacto, { color: cores.cancelar }]}>
            {excluindoConta ? 'Excluindo conta...' : 'Excluir conta'}
          </Text>
        </Pressable>
      </View>

      {/* Banner AdMob discreto na base da tela */}
      <BannerAnuncio />
    </View>
  );
}
