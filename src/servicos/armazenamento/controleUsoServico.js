// src/servicos/armazenamento/controleUsoServico.js
import AsyncStorage from '@react-native-async-storage/async-storage'; // Armazenamento local persistente no aparelho

const CHAVE_USO_DIARIO = '@trilhamestre_limite_diario_v1'; // Chave de armazenamento do contador de trilhas
const CHAVE_HORA_SERVIDOR = '@trilhamestre_ultima_hora_servidor'; // Guarda a última hora oficial recebida da API
const LIMITE_TRILHAS_DIA = 3; // Quantidade máxima de trilhas permitidas em um ciclo de 24 horas
const VINTE_QUATRO_HORAS_MS = 24 * 60 * 60 * 1000; // Duração exata de 24 horas em milissegundos

/**
 * Obtém o horário atual confiável, impedindo que atrasar o relógio do celular burle o limite.
 */
async function obterHorarioConfiavel(dataServidorTexto = null) {
  if (dataServidorTexto) {
    const timestampServidor = Date.parse(dataServidorTexto);
    if (!isNaN(timestampServidor)) {
      await AsyncStorage.setItem(CHAVE_HORA_SERVIDOR, String(timestampServidor));
      return timestampServidor;
    }
  }

  const ultimoHorarioSalvo = await AsyncStorage.getItem(CHAVE_HORA_SERVIDOR);
  const horarioLocal = Date.now();

  // Se o relógio do celular estiver atrasado em relação ao servidor, mantém o maior horário conhecido
  if (ultimoHorarioSalvo && horarioLocal < Number(ultimoHorarioSalvo)) {
    return Number(ultimoHorarioSalvo);
  }

  return horarioLocal;
}

/**
 * Verifica se o usuário ainda pode gerar uma nova trilha dentro das 24h e consome 1 cota.
 */
export async function verificarEConsumirGeracaoTrilha(dataServidorTexto = null) {
  try {
    const agora = await obterHorarioConfiavel(dataServidorTexto);
    const dadosSalvosTexto = await AsyncStorage.getItem(CHAVE_USO_DIARIO);

    let registro = dadosSalvosTexto
      ? JSON.parse(dadosSalvosTexto)
      : { inicioJanela: agora, quantidadeGerada: 0 };

    // Se já passaram 24 horas desde a primeira geração, reinicia a contagem gratuitamente
    if (agora - registro.inicioJanela >= VINTE_QUATRO_HORAS_MS) {
      registro = { inicioJanela: agora, quantidadeGerada: 0 };
    }

    // Se ainda está dentro do limite diário de 3 trilhas, permite e incrementa o contador
    if (registro.quantidadeGerada < LIMITE_TRILHAS_DIA) {
      registro.quantidadeGerada += 1;
      if (registro.quantidadeGerada === 1) {
        registro.inicioJanela = agora; // Marca o início da janela de 24 horas na primeira geração
      }
      await AsyncStorage.setItem(CHAVE_USO_DIARIO, JSON.stringify(registro));

      return {
        permitido: true,
        restantes: LIMITE_TRILHAS_DIA - registro.quantidadeGerada,
      };
    }

    // Caso tenha atingido as 3 trilhas, calcula quantas horas faltam para liberar novamente
    const milissegundosRestantes = Math.max(0, VINTE_QUATRO_HORAS_MS - (agora - registro.inicioJanela));
    const horasRestantes = Math.ceil(milissegundosRestantes / (1000 * 60 * 60));

    return {
      permitido: false,
      restantes: 0,
      horasRestantes,
    };
  } catch (erro) {
    if (__DEV__) console.error('Erro ao verificar limite diário de trilhas:', erro);
    // Em caso de falha de leitura no disco, libera para não prejudicar a experiência do usuário
    return { permitido: true, restantes: 1 };
  }
}
