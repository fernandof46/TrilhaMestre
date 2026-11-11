const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { logger } = require('firebase-functions');
const { defineSecret } = require('firebase-functions/params');
const { HttpsError, onCall } = require('firebase-functions/v2/https');
const {
  gerarOrientacao,
  lerConfiguracaoProvedores,
  validarEntrada,
} = require('./roadmap');

initializeApp();

const firestore = getFirestore();
const configuracaoIA = defineSecret('AI_PROVIDER_CONFIG');
const LIMITE_DIARIO = 10;

async function consumirCota(uid) {
  const referencia = firestore.collection('aiUsage').doc(uid);
  const hoje = new Date().toISOString().slice(0, 10);

  return firestore.runTransaction(async (transacao) => {
    const documento = await transacao.get(referencia);
    const dados = documento.data();
    const chamadasHoje = dados?.date === hoje ? Number(dados.count) || 0 : 0;
    if (chamadasHoje >= LIMITE_DIARIO) return false;

    transacao.set(referencia, { date: hoje, count: chamadasHoje + 1 });
    return true;
  });
}

exports.gerarOrientacao = onCall({
  region: 'us-central1',
  timeoutSeconds: 90,
  memory: '256MiB',
  maxInstances: 5,
  secrets: [configuracaoIA],
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Entre na sua conta para solicitar uma orientação.');
  }

  try {
    validarEntrada(request.data);
    lerConfiguracaoProvedores(configuracaoIA.value());
  } catch (error) {
    if (error instanceof TypeError) {
      throw new HttpsError('invalid-argument', error.message);
    }
    logger.error('A configuração dos provedores de IA está inválida.', error);
    throw new HttpsError('failed-precondition', 'Configure ao menos um provedor de IA no servidor.');
  }

  let permitida;
  try {
    permitida = await consumirCota(request.auth.uid);
  } catch (error) {
    logger.error('Falha ao verificar a cota diária de orientação.', error);
    throw new HttpsError('unavailable', 'Não foi possível verificar o limite diário. Tente novamente.');
  }

  if (!permitida) {
    throw new HttpsError('resource-exhausted', `O limite de ${LIMITE_DIARIO} orientações por dia foi atingido.`);
  }

  try {
    return await gerarOrientacao(request.data, configuracaoIA.value());
  } catch (error) {
    if (error instanceof TypeError) {
      throw new HttpsError('invalid-argument', error.message);
    }
    logger.error('Não foi possível gerar uma orientação com os provedores configurados.', {
      uid: request.auth.uid,
      falhas: error.falhas,
      mensagem: error.message,
    });
    throw new HttpsError('unavailable', 'Os provedores de IA estão indisponíveis. Tente novamente mais tarde.');
  }
});
