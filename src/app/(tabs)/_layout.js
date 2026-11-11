import React from 'react'; // Importa a biblioteca base do React para construção da estrutura de abas
import { Tabs } from 'expo-router'; // Importa o motor nativo de navegação por abas do Expo Router
import { estilos as e } from '../../componentes/estilos'; // Importa os seus estilos globais unificados apelidados de 'e'
import { cores } from '../../componentes/cores.js'; // Importa a sua paleta de cores centralizada do design system
import { Alert, Pressable, Text } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAutenticacao } from '../../lib/AuthContext';

export default function LayoutAbasNavegacao() {
  const { usuario } = useAutenticacao();

  const sairDaConta = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Falha ao sair da conta:', error);
      Alert.alert('Não foi possível sair', 'Verifique sua conexão e tente novamente.');
    }
  };

  return (
    // O componente <Tabs> gerencia e renderiza a folha de abas na parte inferior das telas mobile
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
              {usuario?.displayName ? `${usuario.displayName.split(' ')[0]} · Sair` : 'Sair'}
            </Text>
          </Pressable>
        ),
        tabBarActiveTintColor: cores.confirmar, // Consome o seu tom primário oficial Verde Petronas para a aba ativa
        tabBarInactiveTintColor: cores.descricao, // Consome a cor de descrição neutra para sinalizar abas inativas
        
        // Configuração estrutural da barra de abas inferior
        tabBarStyle: {
          backgroundColor: cores.bksecundario, // Substitui a propriedade 'surface' local pela cor oficial do seu design system
          borderTopColor: cores.bordaInput, // Substitui a borda local pelo token de bordas de entrada unificado
          // As propriedades abaixo de espaçamento físico são injetadas de forma direta para conformidade com a API nativa do Expo Router
          height: 62,
          paddingTop: 7,
          paddingBottom: 8,
        },
        
        // Estilização dos rótulos de texto das abas
        tabBarLabelStyle: e.textoDestaqueCompacto, // Substitui o estilo inline local pelo seletor de tipografia compacta do seu arquivo global
        
        // Estilização do fundo do contêiner da cena ativa
        sceneStyle: { 
          backgroundColor: cores.bkprincipal // Substitui a propriedade 'background' local pelo fundo escuro oficial do app
        },
      }}
    >
      {/* 
        Aba Inicial: Mapeia o arquivo físico index.js do seu diretório.
        O título foi localizado para o português do Brasil respeitando o sentido original.
      */}
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Criar Trilha' 
        }} 
      />
      
      {/* 
        Aba de Histórico: Mapeia a listagem das rotas passadas e salvas.
        O título foi localizado mantendo a clareza para o usuário final brasileiro.
      */}
      <Tabs.Screen 
        name="historico" 
        options={{ 
          title: 'Minhas Trilhas' 
        }} 
      />
    </Tabs>
  );
}
