const test = require('node:test');
const assert = require('node:assert/strict');
const {
  criarPrompt,
  gerarOrientacao,
  lerConfiguracaoProvedores,
  normalizarOrientacao,
  validarEntrada,
} = require('../roadmap');

const entrada = {
  tema: 'marcenaria',
  objetivo: 'Construir uma pequena estante',
  nivel: 'iniciante',
  contexto: 'Tenho ferramentas básicas.',
};

function roteiroValido() {
  return {
    title: 'Aprenda marcenaria',
    description: 'Plano progressivo de estudo e prática.',
    estimatedTime: '8 semanas',
    phases: [1, 2, 3].map((numero) => ({
      title: `Fase ${numero}`,
      description: 'Estude e pratique os fundamentos desta etapa.',
      steps: [{
        title: `Etapa ${numero}`,
        description: 'Pratique uma habilidade de forma segura e revise o resultado.',
      }],
    })),
  };
}

test('valida temas livres e orienta o modelo para qualquer área', () => {
  assert.equal(validarEntrada(entrada).tema, 'marcenaria');
  assert.match(criarPrompt(entrada), /não presuma que seja tecnologia/);
  assert.throws(() => validarEntrada({ ...entrada, nivel: 'especialista' }), /nível válido/);
  assert.throws(() => validarEntrada({ ...entrada, tema: 'ab' }), /3 e 120/);
});

test('normaliza fases e cria links de pesquisa HTTPS sem aceitar URLs do modelo', () => {
  const normalizado = normalizarOrientacao(roteiroValido(), entrada.tema);
  assert.equal(normalizado.phases.length, 3);
  assert.equal(normalizado.phases[0].steps[0].resources[0].url.startsWith('https://www.google.com/search?q='), true);
  assert.throws(
    () => normalizarOrientacao({ ...roteiroValido(), phases: [] }, entrada.tema),
    /quantidade válida de fases/,
  );
});

test('lê somente provedores suportados que têm chave configurada', () => {
  const provedores = lerConfiguracaoProvedores(JSON.stringify({
    order: ['groq', 'indesejado', 'gemini'],
    providers: { groq: { apiKey: 'key-1' }, gemini: { apiKey: 'key-2' } },
  }));
  assert.deepEqual(provedores.map((provedor) => provedor.nome), ['groq', 'gemini']);
  assert.throws(() => lerConfiguracaoProvedores('inválido'), /JSON válido/);
});

test('tenta outro provedor após falha e valida o formato retornado', async (t) => {
  const fetchOriginal = global.fetch;
  const chamadas = [];
  global.fetch = async (url) => {
    chamadas.push(String(url));
    if (String(url).includes('generativelanguage')) {
      return { ok: false, status: 503, json: async () => ({}) };
    }
    return {
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: { content: JSON.stringify(roteiroValido()) } }] }),
    };
  };
  t.after(() => { global.fetch = fetchOriginal; });

  const gerado = await gerarOrientacao(entrada, JSON.stringify({
    order: ['gemini', 'groq'],
    providers: {
      gemini: { apiKey: 'gemini-key' },
      groq: { apiKey: 'groq-key' },
    },
  }));

  assert.equal(gerado.phases.length, 3);
  assert.equal(chamadas.length, 2);
  assert.match(chamadas[1], /api\.groq\.com/);
});

