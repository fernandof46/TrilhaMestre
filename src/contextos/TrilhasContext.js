import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY = '@trilhamestre/trilhas-v1';
const STORAGE_MIGRATION_KEY = '@trilhamestre/trilhas-v1-owner';
export const STATUS_TRILHA = {
  EM_ANDAMENTO: 'em_andamento',
  PAUSADA: 'pausada',
  CONCLUIDA: 'concluida',
};

const TrilhasContext = createContext(null);

function parseTrilhas(saved) {
  const parsed = saved ? JSON.parse(saved) : [];
  const estruturaValida = Array.isArray(parsed) && parsed.every((trilha) => (
    trilha
    && typeof trilha.id === 'string'
    && typeof trilha.title === 'string'
    && Array.isArray(trilha.phases)
    && trilha.phases.every((fase) => fase && Array.isArray(fase.steps))
  ));

  if (!estruturaValida) {
    throw new Error('Os dados salvos de trilhas possuem um formato inválido.');
  }

  return parsed;
}

export function TrilhasProvider({ children, storageKey }) {
  const [trilhas, setTrilhas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState(false);
  const trilhasRef = useRef([]);
  const filaPersistenciaRef = useRef(Promise.resolve());

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(storageKey)
      .then(async (saved) => {
        let dadosSalvos = saved;
        if (saved === null) {
          const trilhasLegadas = await AsyncStorage.getItem(STORAGE_KEY);
          const uid = storageKey.slice(`${STORAGE_KEY}:`.length);
          const donoMigracao = await AsyncStorage.getItem(STORAGE_MIGRATION_KEY);
          if (trilhasLegadas !== null && (!donoMigracao || donoMigracao === uid)) {
            if (!donoMigracao) {
              await AsyncStorage.setItem(STORAGE_MIGRATION_KEY, uid);
            }
            parseTrilhas(trilhasLegadas);
            await AsyncStorage.setItem(storageKey, trilhasLegadas);
            await AsyncStorage.removeItem(STORAGE_KEY);
            dadosSalvos = trilhasLegadas;
          }
        }

        const carregadas = parseTrilhas(dadosSalvos);
        if (active) {
          trilhasRef.current = carregadas;
          setTrilhas(carregadas);
          setStorageError(false);
        }
      })
      .catch((error) => {
        console.error('Falha ao carregar trilhas salvas:', error);
        if (active) setStorageError(true);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [storageKey]);

  const atualizarTrilhas = useCallback(async (calcularProximaLista) => {
    const operacao = filaPersistenciaRef.current.then(async () => {
      const proximaLista = calcularProximaLista(trilhasRef.current);
      await AsyncStorage.setItem(storageKey, JSON.stringify(proximaLista));
      trilhasRef.current = proximaLista;
      setTrilhas(proximaLista);
      setStorageError(false);
    });

    filaPersistenciaRef.current = operacao.catch(() => {});

    try {
      await operacao;
    } catch (error) {
      setStorageError(true);
      throw error;
    }
  }, [storageKey]);

  const addTrilha = useCallback(async (roteiro) => {
    const item = {
      ...roteiro,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      status: roteiro.status || STATUS_TRILHA.EM_ANDAMENTO,
      createdAt: roteiro.createdAt || new Date().toISOString(),
    };
    await atualizarTrilhas((atuais) => [item, ...atuais]);
    return item;
  }, [atualizarTrilhas]);

  const deleteTrilha = useCallback((id) => (
    atualizarTrilhas((atuais) => atuais.filter((item) => item.id !== id))
  ), [atualizarTrilhas]);

  const toggleStep = useCallback((roadmapId, stepId) => (
    atualizarTrilhas((atuais) => atuais.map((item) => {
      if (item.id !== roadmapId) return item;
      const concluidas = item.completedStepIds || [];
      return {
        ...item,
        completedStepIds: concluidas.includes(stepId)
          ? concluidas.filter((id) => id !== stepId)
          : [...concluidas, stepId],
      };
    }))
  ), [atualizarTrilhas]);

  const atualizarStatus = useCallback((id, status) => (
    atualizarTrilhas((atuais) => atuais.map((item) => (
      item.id === id ? { ...item, status } : item
    )))
  ), [atualizarTrilhas]);

  const value = useMemo(() => ({
    trilhas,
    isLoading,
    storageError,
    addTrilha,
    deleteTrilha,
    toggleStep,
    atualizarStatus,
  }), [trilhas, isLoading, storageError, addTrilha, deleteTrilha, toggleStep, atualizarStatus]);

  return <TrilhasContext.Provider value={value}>{children}</TrilhasContext.Provider>;
}

export function useTrilhas() {
  const context = useContext(TrilhasContext);
  if (!context) {
    throw new Error('useTrilhas deve ser usado dentro de TrilhasProvider.');
  }
  return context;
}
