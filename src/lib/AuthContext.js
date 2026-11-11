import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firebaseConfigurado } from './firebase';

const ContextoAutenticacao = createContext(null);

export function ProvedorAutenticacao({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(firebaseConfigurado);

  useEffect(() => {
    if (!auth) return undefined;

    return onAuthStateChanged(
      auth,
      (usuarioAtual) => {
        setUsuario(usuarioAtual);
        setCarregando(false);
      },
      (erro) => {
        console.error('Falha ao verificar a sessão Firebase:', erro);
        setCarregando(false);
      },
    );
  }, []);

  const valor = useMemo(() => ({
    usuario,
    carregando,
    firebaseConfigurado,
  }), [usuario, carregando]);

  return (
    <ContextoAutenticacao.Provider value={valor}>
      {children}
    </ContextoAutenticacao.Provider>
  );
}

export function useAutenticacao() {
  const contexto = useContext(ContextoAutenticacao);
  if (!contexto) {
    throw new Error('useAutenticacao deve ser usado dentro de ProvedorAutenticacao.');
  }
  return contexto;
}
