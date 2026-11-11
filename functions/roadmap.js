const NIVEL = new Set(['iniciante', 'intermediario', 'avancado']);
const TIPOS_PROVEDOR = new Set(['gemini', 'groq', 'openrouter']);

function validarEntrada(entrada) {
  if (!entrada || typeof entrada !== 'object') {
    throw new TypeError('Informe os dados da orientação.');
  }

  const tema = typeof entrada.tema === 'string' ? entrada.tema.trim() : '';
  const objetivo = typeof entrada.objetivo === 'string' ? entrada.objetivo.trim() : '';
  const nivel = entrada.nivel;
  const contexto = typeof entrada.contexto === 'string' ? entrada.contexto.trim() : '';

  if (tema.length < 3 || tema.length > 120) {
    throw new TypeError('O tema deve ter entre 3 e 120 caracteres.');
  }
  if (!NIVEL.has(nivel)) {
    throw new TypeError('Selecione um nível válido.');
  }
  if (objetivo.length > 240 || contexto.length > 800) {
    throw new TypeError('O objetivo ou contexto excede o limite permitido.');
  }

  return { tema, objetivo, nivel, contexto };
}

function criarPrompt({ tema, objetivo, nivel, contexto }) {
  return [
    'Você é um orientador de aprendizagem. Crie um plano claro, realista e inclusivo em português brasileiro.',
    'O tema pode ser de qualquer área: profissões, artes, ciências, ofícios, idiomas, negócios ou projetos pessoais; não presuma que seja tecnologia.',
    'Adapte a sequência ao nível informado e ao objetivo do estudante. Não prometa certificações nem substitua orientação profissional regulamentada.',
    'Responda somente com JSON válido, sem markdown, seguindo este formato:',
    '{"title":"string","description":"string","estimatedTime":"string","phases":[{"title":"string","description":"string","steps":[{"title":"string","description":"string"}]}]}',
    'Crie de 3 a 5 fases, com 1 a 4 etapas por fase. Use ações concretas e progressivas. Não invente URLs, títulos de cursos ou fontes.',
    `Tema: ${tema}`,
    `Objetivo: ${objetivo || 'Aprender e desenvolver autonomia no tema.'}`,
    `Nível: ${nivel}`,
    `Contexto adicional: ${contexto || 'Não informado.'}`,
  ].join('\n');
}

function extrairJson(texto) {
  const limpo = String(texto || '')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');
  const inicio = limpo.indexOf('{');
  const fim = limpo.lastIndexOf('}');
  if (inicio < 0 || fim <= inicio) throw new Error('O provedor não retornou um JSON válido.');
  return JSON.parse(limpo.slice(inicio, fim + 1));
}

function textoObrigatorio(valor, campo, limite) {
  if (typeof valor !== 'string' || !valor.trim() || valor.trim().length > limite) {
    throw new Error(`O campo ${campo} está ausente ou excede o limite.`);
  }
  return valor.trim();
}

function normalizarOrientacao(dados, tema) {
  if (!dados || !Array.isArray(dados.phases) || dados.phases.length < 3 || dados.phases.length > 5) {
    throw new Error('A orientação gerada não possui uma quantidade válida de fases.');
  }

  const fases = dados.phases.map((fase, indiceFase) => {
    if (!Array.isArray(fase.steps) || fase.steps.length < 1 || fase.steps.length > 4) {
      throw new Error('Uma fase da orientação não possui uma quantidade válida de etapas.');
    }

    return {
      id: `fase-${indiceFase + 1}`,
      title: textoObrigatorio(fase.title, 'título da fase', 100),
      description: textoObrigatorio(fase.description, 'descrição da fase', 400),
      steps: fase.steps.map((etapa, indiceEtapa) => {
        const title = textoObrigatorio(etapa.title, 'título da etapa', 120);
        const query = encodeURIComponent(`${tema} ${title} material gratuito português`);
        return {
          id: `fase-${indiceFase + 1}-etapa-${indiceEtapa + 1}`,
          title,
          description: textoObrigatorio(etapa.description, 'descrição da etapa', 600),
          resources: [{
            title: `Pesquisar materiais gratuitos: ${title}`,
            url: `https://www.google.com/search?q=${query}`,
            type: 'article',
          }],
        };
      }),
    };
  });

  return {
    title: textoObrigatorio(dados.title, 'título', 120),
    description: textoObrigatorio(dados.description, 'descrição', 600),
    estimatedTime: textoObrigatorio(dados.estimatedTime, 'tempo estimado', 80),
    phases: fases,
  };
}

function lerConfiguracaoProvedores(valor) {
  let configuracao;
  try {
    configuracao = JSON.parse(valor);
  } catch {
    throw new Error('A configuração secreta AI_PROVIDER_CONFIG não contém JSON válido.');
  }

  const provedores = configuracao?.providers;
  const ordem = Array.isArray(configuracao?.order)
    ? configuracao.order
    : ['gemini', 'groq', 'openrouter'];

  if (!provedores || typeof provedores !== 'object') {
    throw new Error('Configure ao menos um provedor em AI_PROVIDER_CONFIG.');
  }

  return ordem.filter((nome, indice) => (
    TIPOS_PROVEDOR.has(nome)
    && ordem.indexOf(nome) === indice
    && typeof provedores[nome]?.apiKey === 'string'
    && provedores[nome].apiKey.trim()
  )).map((nome) => ({ nome, ...provedores[nome] }));
}

async function respostaJson(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(`Provedor respondeu HTTP ${response.status}.`);
    error.status = response.status;
    throw error;
  }
  return body;
}

async function gerarComGemini(provedor, prompt) {
  const modelo = provedor.model || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelo)}:generateContent?key=${encodeURIComponent(provedor.apiKey)}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 4096 },
    }),
    signal: AbortSignal.timeout(18000),
  });
  const body = await respostaJson(response);
  return extrairJson(body.candidates?.[0]?.content?.parts?.map((parte) => parte.text || '').join(''));
}

async function gerarComOpenAICompativel(provedor, prompt) {
  const endpoints = {
    groq: 'https://api.groq.com/openai/v1/chat/completions',
    openrouter: 'https://openrouter.ai/api/v1/chat/completions',
  };
  const response = await fetch(endpoints[provedor.nome], {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${provedor.apiKey}`,
      'Content-Type': 'application/json',
      ...(provedor.nome === 'openrouter' ? { 'X-Title': 'TrilhaMestre' } : {}),
    },
    body: JSON.stringify({
      model: provedor.model || (provedor.nome === 'openrouter' ? 'openrouter/free' : 'llama-3.3-70b-versatile'),
      messages: [
        { role: 'system', content: 'Responda exclusivamente com um objeto JSON válido.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 4096,
    }),
    signal: AbortSignal.timeout(18000),
  });
  const body = await respostaJson(response);
  return extrairJson(body.choices?.[0]?.message?.content);
}

async function gerarComProvedor(provedor, prompt) {
  if (provedor.nome === 'gemini') return gerarComGemini(provedor, prompt);
  return gerarComOpenAICompativel(provedor, prompt);
}

async function gerarOrientacao(entrada, configuracaoSecreta) {
  const dados = validarEntrada(entrada);
  const provedores = lerConfiguracaoProvedores(configuracaoSecreta);
  if (provedores.length === 0) {
    throw new Error('Nenhuma chave de provedor de IA está configurada.');
  }

  const prompt = criarPrompt(dados);
  const falhas = [];
  for (const provedor of provedores) {
    try {
      const resultado = await gerarComProvedor(provedor, prompt);
      return normalizarOrientacao(resultado, dados.tema);
    } catch (error) {
      falhas.push({ provedor: provedor.nome, mensagem: error.message });
      console.error(`Falha no provedor de IA ${provedor.nome}:`, error.message);
    }
  }

  const erro = new Error('Todos os provedores de IA configurados falharam.');
  erro.falhas = falhas;
  throw erro;
}

module.exports = {
  criarPrompt,
  gerarOrientacao,
  lerConfiguracaoProvedores,
  normalizarOrientacao,
  validarEntrada,
};
