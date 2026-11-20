// src/app/(tabs)/_layout.js
// Layout das abas principais do app; a autenticação e a pilha raiz ficam em src/app/_layout.js.
import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Feather } from '@expo/vector-icons';
import { estilos as e } from '../../componentes/estilos';
import { cores } from '../../componentes/cores';
import { auth } from '../../servicos/firebase/firebase';
import { useAutenticacao } from '../../contextos/AuthContext';
import { BannerAnuncio } from '../../servicos/anuncios/BannerAnuncio';

export default function LayoutAbasNavegacao() {
  const { usuario } = useAutenticacao();

  // Mantém o encerramento da sessão sob controle do Firebase e informa falhas
  // em vez de deixar o usuário acreditar que saiu sem a confirmação do serviço.
  const sairDaConta = async () => {
    try {
      await signOut(auth);
    } catch (erro) {
      console.error('Falha ao sair da conta:', erro);
      Alert.alert('Não foi possível sair', 'Verifique sua conexão e tente novamente.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: cores.bkprincipal }}>
      {/* Este navegador interno deve expor apenas as abas, não repetir as rotas do layout raiz. */}
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
            height: 62,
            paddingTop: 7,
            paddingBottom: 8,
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

      {/* O componente verifica a disponibilidade do módulo nativo antes de carregar o SDK. */}
      <BannerAnuncio />
    </View>
  );
}
