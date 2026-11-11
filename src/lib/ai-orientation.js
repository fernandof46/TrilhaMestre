import { httpsCallable } from 'firebase/functions';
import { funcoes } from './firebase';

export async function gerarOrientacaoComIA(entrada) {
  if (!funcoes) {
    throw new Error('Configure o Firebase no arquivo .env antes de solicitar uma orientação com IA.');
  }

  const gerarOrientacao = httpsCallable(funcoes, 'gerarOrientacao', {
    timeout: 95000,
  });
  const resposta = await gerarOrientacao(entrada);

  if (!resposta.data || !Array.isArray(resposta.data.phases) || resposta.data.phases.length === 0) {
    throw new Error('A API retornou uma orientação inválida. Tente novamente.');
  }

  return resposta.data;
}
