import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { createUserWithEmailAndPassword, GoogleAuthProvider, sendPasswordResetEmail, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import { estilos as e, espaco } from '../componentes/estilos';
import { cores } from '../componentes/cores';
import { auth, firebaseConfigurado } from '../lib/firebase';
import { useAutenticacao } from '../lib/AuthContext';

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

const mensagensErro = {
  'auth/email-already-in-use': 'Este e-mail já possui uma conta.',
  'auth/invalid-email': 'Informe um endereço de e-mail válido.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/user-disabled': 'Esta conta foi desativada.',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
  'auth/network-request-failed': 'Sem conexão com a internet. Verifique a rede e tente novamente.',
  'auth/operation-not-allowed': 'Este método de acesso ainda não foi ativado no Firebase.',
};

function mensagemDoErro(error) {
  return mensagensErro[error.code] || error.message || 'Não foi possível concluir o acesso. Tente novamente.';
}

export default function TelaLogin() {
  const { firebaseConfigurado: firebasePronto } = useAutenticacao();
  const [modo, setModo] = useState('entrar');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [processando, setProcessando] = useState(false);

  const enviarEmail = async () => {
    setErro('');
    setMensagem('');

    if (!auth || !firebasePronto) {
      setErro('Configure o Firebase no arquivo .env e reinicie o Expo.');
      return;
    }

    if (!email.trim()) {
      setErro('Informe seu e-mail.');
      return;
    }
    if (modo !== 'redefinir' && senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    setProcessando(true);
    try {
      if (modo === 'cadastro') {
        await createUserWithEmailAndPassword(auth, email.trim(), senha);
      } else if (modo === 'redefinir') {
        await sendPasswordResetEmail(auth, email.trim());
        setMensagem('Se houver uma conta com este e-mail, enviaremos as instruções de recuperação.');
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), senha);
      }
    } catch (error) {
      setErro(mensagemDoErro(error));
    } finally {
      setProcessando(false);
    }
  };

  const entrarComGoogle = async () => {
    setErro('');
    setMensagem('');
    if (!auth || !firebasePronto) {
      setErro('Configure o Firebase no arquivo .env e reinicie o Expo.');
      return;
    }
    if (!GOOGLE_WEB_CLIENT_ID) {
      setErro('Configure EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID para habilitar o login Google.');
      return;
    }

    setProcessando(true);
    try {
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        ...(GOOGLE_IOS_CLIENT_ID ? { iosClientId: GOOGLE_IOS_CLIENT_ID } : {}),
      });
      await GoogleSignin.hasPlayServices();
      const resposta = await GoogleSignin.signIn();
      if (!isSuccessResponse(resposta)) return;

      const idToken = resposta.data.idToken;
      if (!idToken) {
        throw new Error('O Google não retornou o token de autenticação. Confira os IDs OAuth configurados.');
      }
      await signInWithCredential(auth, GoogleAuthProvider.credential(idToken));
    } catch (error) {
      if (error.code !== 'SIGN_IN_CANCELLED') setErro(mensagemDoErro(error));
    } finally {
      setProcessando(false);
    }
  };

  const titulo = modo === 'cadastro'
    ? 'Crie sua conta'
    : modo === 'redefinir'
      ? 'Recuperar senha'
      : 'Entre na sua conta';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={e.containerPrincipal}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: espaco.xxl }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={e.rotuloDestaqueEspacado}>TRILHAMESTRE</Text>
        <Text style={e.textoTituloDestaque}>{titulo}</Text>
        <Text style={[e.textoDescricao, { textAlign: 'left' }]}>
          Entre para salvar suas trilhas neste aparelho e solicitar orientações para seus objetivos.
        </Text>

        {!firebaseConfigurado ? (
          <View style={e.blocoNotaNovaEstrategia}>
            <Text style={e.textoApoio}>
              O Firebase ainda não está configurado. Copie .env.example para .env, preencha os dados do projeto e
              reinicie o Expo. Nenhuma conta fictícia será criada.
            </Text>
          </View>
        ) : null}

        {modo !== 'redefinir' ? (
          <>
            <Pressable
              accessibilityRole="button"
              disabled={processando}
              onPress={entrarComGoogle}
              style={({ pressed }) => [
                e.botaoSecundario,
                { marginTop: espaco.xxl },
                processando && e.botaoDesabilitado,
                pressed && { opacity: 0.82 },
              ]}
            >
              <Text style={e.textoBotao}>Continuar com Google</Text>
            </Pressable>
            <Text style={[e.textoApoio, { textAlign: 'center', marginVertical: espaco.lg }]}>
              ou use seu e-mail
            </Text>
          </>
        ) : null}

        <Text style={e.textoEnunciado}>E-mail</Text>
        <TextInput
          accessibilityLabel="E-mail"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="voce@exemplo.com"
          placeholderTextColor={cores.descricao}
          style={[e.campoTextoMensagem, { marginTop: espaco.sm, marginBottom: espaco.lg }]}
          value={email}
        />

        {modo !== 'redefinir' ? (
          <>
            <Text style={e.textoEnunciado}>Senha</Text>
            <TextInput
              accessibilityLabel="Senha"
              autoCapitalize="none"
              autoComplete={modo === 'cadastro' ? 'new-password' : 'password'}
              onChangeText={setSenha}
              onSubmitEditing={enviarEmail}
              placeholder="Mínimo de 6 caracteres"
              placeholderTextColor={cores.descricao}
              secureTextEntry
              style={[e.campoTextoMensagem, { marginTop: espaco.sm, marginBottom: espaco.lg }]}
              value={senha}
            />
          </>
        ) : null}

        {erro ? (
          <Text accessibilityRole="alert" style={[e.textoErro, { marginBottom: espaco.md }]}>{erro}</Text>
        ) : null}
        {mensagem ? (
          <Text accessibilityRole="alert" style={[e.textoApoio, { marginBottom: espaco.md }]}>{mensagem}</Text>
        ) : null}

        <Pressable
          accessibilityRole="button"
          disabled={processando}
          onPress={enviarEmail}
          style={({ pressed }) => [
            e.botaoConfirmar,
            processando && e.botaoDesabilitado,
            pressed && { opacity: 0.82 },
          ]}
        >
          <Text style={e.textoBotao}>
            {processando ? 'Aguarde...' : modo === 'cadastro' ? 'Criar conta' : modo === 'redefinir' ? 'Enviar instruções' : 'Entrar'}
          </Text>
        </Pressable>

        {modo === 'entrar' ? (
          <Pressable onPress={() => { setModo('redefinir'); setErro(''); setMensagem(''); }} style={{ paddingVertical: espaco.md }}>
            <Text style={[e.textoDestaqueCompacto, { textAlign: 'center' }]}>Esqueci minha senha</Text>
          </Pressable>
        ) : null}
        {modo !== 'redefinir' ? (
          <Pressable
            onPress={() => { setModo(modo === 'cadastro' ? 'entrar' : 'cadastro'); setErro(''); setMensagem(''); }}
            style={{ paddingVertical: espaco.md }}
          >
            <Text style={[e.textoDestaqueCompacto, { textAlign: 'center' }]}>
              {modo === 'cadastro' ? 'Já tenho uma conta · Entrar' : 'Ainda não tenho conta · Cadastrar'}
            </Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => { setModo('entrar'); setErro(''); setMensagem(''); }} style={{ paddingVertical: espaco.md }}>
            <Text style={[e.textoDestaqueCompacto, { textAlign: 'center' }]}>Voltar para entrar</Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

