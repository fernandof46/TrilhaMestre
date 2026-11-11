import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { cores } from '../componentes/cores';
import { TrilhasProvider } from '../lib/TrilhasContext';
import { ProvedorAutenticacao, useAutenticacao } from '../lib/AuthContext';

function NavegacaoAutenticada() {
  const { usuario, carregando } = useAutenticacao();
  const storageKey = usuario ? `@trilhamestre/trilhas-v1:${usuario.uid}` : null;

  if (carregando) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.bkprincipal }}>
        <ActivityIndicator color={cores.confirmar} size="large" />
      </View>
    );
  }

  const navegacao = (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: cores.bkprincipal },
      }}
    >
      <Stack.Protected guard={!usuario}>
        <Stack.Screen name="login" />
      </Stack.Protected>
      <Stack.Protected guard={Boolean(usuario)}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="trilha/[id]" />
      </Stack.Protected>
    </Stack>
  );

  if (!usuario) return navegacao;
  return (
    <TrilhasProvider key={usuario.uid} storageKey={storageKey}>
      {navegacao}
    </TrilhasProvider>
  );
}

export default function LayoutRaizAplicacao() {
  return (
    <ProvedorAutenticacao>
      <StatusBar style="light" />
      <NavegacaoAutenticada />
    </ProvedorAutenticacao>
  );
}
