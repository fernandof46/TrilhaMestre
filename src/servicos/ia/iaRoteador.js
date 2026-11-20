// src/servicos/ia/iaRoteador.js
import { generateRoadmap } from '../ia/roadmap-generator';

const REQUEST_TIMEOUT = 20000;
const NIVEL = new Set(['iniciante', 'intermediario', 'avancado']);

function getRandomApiKey(envValue) {
  if (!envValue) return null;
  const keys = envValue
    .split(',')
    .map((k) => k.replace(/['"\s\r\n]+/g, '').trim())
    .filter((k) => k.length > 10);
  if (keys.length === 0) return null;
  return keys.at(Math.floor(Math.random() * keys.length));
}

function extrairJson(texto) {
  const limpo = String(texto || '')
    .trim()
    .replace(/^```(?:json)?\s*/gi, '')
    .replace(/\s*```$/g, '');
  const inicio = limpo.indexOf('{');
  const fim = limpo.lastIndexOf('}');
  if (inicio < 0 || fim <= inicio) {
    throw new Error('O provedor não retornou um JSON válido.');
  }
  return JSON.parse(limpo.slice(inicio, fim + 1));
}

async function fetchComTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const serverDate = response.headers.get('date');
    const rawText = await response.text();
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${rawText.slice(0, 120)}`);
    }

    const data = JSON.parse(rawText);
    return { data, serverDate };
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// ============================================================================
// MOTOR DE CASCATA GRATUITA (Groq -> Gemini 2.5 Flash -> OpenRouter Free)
// ============================================================================
async function executarCascataIA(mensagens, systemPrompt, exigirJson = true) {
  const provedores = [
    {
      nome: 'Groq',
      fn: async () => {
        const apiKey = getRandomApiKey(process.env.EXPO_PUBLIC_GROQ_API_KEY);
        if (!apiKey) throw new Error('Chave Groq ausente');

        // A API compatível com OpenAI da Groq fica no subdomínio api.groq.com.
        const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
        const { data, serverDate } = await fetchComTimeout(endpoint, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'openai/gpt-oss-120b',
            messages: [
              ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
              ...mensagens,
            ],
            temperature: 0.7,
          }),
        });

        const texto = data?.choices?.at(0)?.message?.content;
        if (!texto) throw new Error('Groq retornou vazio');
        return { texto, serverDate };
      },
    },
    {
      nome: 'Gemini',
      fn: async () => {
        const apiKey = getRandomApiKey(process.env.EXPO_PUBLIC_GEMINI_API_KEY);
        if (!apiKey) throw new Error('Chave Gemini ausente');

        // O endpoint Gemini usa generativelanguage.googleapis.com; o domínio genérico
        // googleapis.com não encaminha chamadas para generateContent.
        const endpoint =
          'https://generativelanguage.googleapis.com' +
          '/v1beta/models/gemini-2.5-flash:generateContent?key=' +
          apiKey;

        const contents = mensagens.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        const { data, serverDate } = await fetchComTimeout(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...(systemPrompt && {
              systemInstruction: { parts: [{ text: systemPrompt }] },
            }),
            contents,
            generationConfig: {
              ...(exigirJson && { responseMimeType: 'application/json' }),
              temperature: 0.7,
            },
          }),
        });

        const texto = data?.candidates?.at(0)?.content?.parts?.at(0)?.text;
        if (!texto) throw new Error('Gemini retornou vazio');
        return { texto, serverDate };
      },
    },
    {
      nome: 'OpenRouter',
      fn: async () => {
        const apiKey = getRandomApiKey(process.env.EXPO_PUBLIC_OPENROUTER_API_KEY);
        if (!apiKey) throw new Error('Chave OpenRouter ausente');

        const endpoint = 'https://openrouter.ai' + '/api/v1/chat/completions';
        const { data, serverDate } = await fetchComTimeout(endpoint, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + apiKey,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://trilhamestre.app',
            'X-Title': 'Trilha Mestre',
          },
          body: JSON.stringify({
            model: 'openrouter/free',
            messages: [
              ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
              ...mensagens,
            ],
            temperature: 0.7,
          }),
        });

        const texto = data?.choices?.at(0)?.message?.content;
        if (!texto) throw new Error('OpenRouter retornou vazio');
        return { texto, serverDate };
      },
    },
  ];

  for (const provedor of provedores) {
    try {
      if (__DEV__) console.log(`[TRILHA_IA] Tentando ${provedor.nome}...`);
      const { texto, serverDate } = await provedor.fn();
      return { texto, serverDate };
    } catch (error) {
      if (__DEV__) console.warn(`[TRILHA_IA] ${provedor.nome} falhou:`, error.message);
    }
  }

  throw new Error('Todos os provedores de IA estão indisponíveis no momento.');
}

// ============================================================================
// 1. GERAR ROADMAP COMPLETO
// ============================================================================
export function validarEntrada(entrada) {
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

function textoObrigatorio(valor, campo, limite) {
  if (typeof valor !== 'string' || !valor.trim() || valor.trim().length > limite) {
    throw new Error(`O campo ${campo} está ausente ou excede o limite.`);
  }
  return valor.trim();
}

function normalizarOrientacao(dados, tema, serverDate = null) {
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
          resources: [
            {
              title: `Pesquisar materiais gratuitos: ${title}`,
              // Constrói uma URL de pesquisa funcional com o tema e o título já codificados.
              url: `https://www.google.com/search?q=${query}`,
              type: 'article',
            },
          ],
        };
      }),
    };
  });

  return {
    title: textoObrigatorio(dados.title, 'título', 120),
    description: textoObrigatorio(dados.description, 'descrição', 600),
    estimatedTime: textoObrigatorio(dados.estimatedTime, 'tempo estimado', 80),
    phases: fases,
    serverTimestamp: serverDate,
  };
}

export async function gerarOrientacaoComIA(entrada) {
  const dados = validarEntrada(entrada);

  const systemPrompt =
    'Você é um orientador de aprendizagem em português brasileiro. Responda exclusivamente com um objeto JSON válido, sem markdown.';

  const userPrompt = [
    'Crie um plano de estudos claro, realista e inclusivo.',
    'O tema pode ser de qualquer área (profissões, artes, ciências, ofícios, idiomas, negócios ou tecnologia).',
    'Formato obrigatório:',
    '{"title":"string","description":"string","estimatedTime":"string","phases":[{"title":"string","description":"string","steps":[{"title":"string","description":"string"}]}]}',
    'Crie de 3 a 5 fases, com 1 a 4 etapas por fase. Não invente URLs ou nomes de cursos.',
    `Tema: ${dados.tema}`,
    `Objetivo: ${dados.objetivo || 'Aprender e desenvolver autonomia no tema.'}`,
    `Nível: ${dados.nivel}`,
    `Contexto adicional: ${dados.contexto || 'Não informado.'}`,
  ].join('\n');

  try {
    const { texto, serverDate } = await executarCascataIA(
      [{ role: 'user', content: userPrompt }],
      systemPrompt,
      true
    );
    const json = extrairJson(texto);
    return normalizarOrientacao(json, dados.tema, serverDate);
  } catch (error) {
    if (__DEV__) console.warn('[TRILHA_IA] Fallback offline acionado:', error.message);
    return generateRoadmap(dados.tema, dados.objetivo, dados.nivel);
  }
}
// ============================================================================
// 2. TUTOR DA ETAPA (ChatTutorEtapa.js)
// ============================================================================
export async function consultarTutorEtapaComIA({ trilha, modulo, etapa, historico = [], pergunta }) {
  const tituloTrilha = trilha?.title || 'Estudo Geral';
  const tituloModulo = modulo?.title || '';
  const tituloEtapa = etapa?.title || '';
  const descEtapa = etapa?.description || '';

  const systemPrompt = [
    'Você é um tutor didático, paciente e prático do aplicativo Trilha Mestre.',
    'Responda em português do Brasil de forma clara, objetiva e encorajadora (use tópicos curtos quando ajudar).',
    'Contexto da trilha: ' + tituloTrilha,
    'Módulo atual: ' + tituloModulo,
    'Etapa em estudo: ' + tituloEtapa + ' - ' + descEtapa,
  ].join('\n');

  const mensagensFormatadas = historico.slice(-6).map((m) => ({
    role: m.papel === 'assistente' ? 'assistant' : 'user',
    content: m.conteudo,
  }));

  if (mensagensFormatadas.length === 0 && pergunta) {
    mensagensFormatadas.push({ role: 'user', content: pergunta });
  }

  const { texto } = await executarCascataIA(mensagensFormatadas, systemPrompt, false);
  return texto.trim();
}

// ============================================================================
// 3. QUESTIONÁRIO DO MÓDULO (ModalQuestionarioModulo.js)
// ============================================================================
export async function gerarQuestionarioModuloComIA({ trilha, modulo }) {
  const etapasTexto = Array.isArray(modulo?.steps)
    ? modulo.steps.map((s) => '- ' + s.title + ': ' + s.description).join('\n')
    : '';

  const systemPrompt =
    'Você é um avaliador educacional. Responda exclusivamente com um objeto JSON válido, sem markdown.';

  const userPrompt = [
    'Crie exatamente 4 perguntas de múltipla escolha em português brasileiro para testar o aprendizado deste módulo.',
    'Cada pergunta deve ter 4 alternativas plausíveis e apenas 1 correta.',
    'Formato JSON obrigatório:',
    '{"questions":[{"question":"string","options":["string","string","string","string"],"correct_index":0,"explanation":"string"}]}',
    'Trilha: ' + (trilha?.title || ''),
    'Módulo: ' + (modulo?.title || '') + ' (' + (modulo?.description || '') + ')',
    'Etapas do módulo:\n' + etapasTexto,
  ].join('\n');

  const { texto } = await executarCascataIA(
    [{ role: 'user', content: userPrompt }],
    systemPrompt,
    true
  );

  const json = extrairJson(texto);
  if (!json || !Array.isArray(json.questions) || json.questions.length === 0) {
    throw new Error('Não foi possível formatar as questões geradas.');
  }

    return json.questions.map((q) => {
    const opcoesBrutas = Array.isArray(q.options) ? q.options : (q.alternativas || []);
    const opcoesLimpas = opcoesBrutas.slice(0, 4).map((opt) => {
      if (typeof opt === 'string') return opt.trim();
      if (opt && typeof opt === 'object') {
        return String(opt.text || opt.texto || opt.label || opt.opcao || '').trim();
      }
      return String(opt || '').trim();
    });

    return {
      question: String(q.question || q.pergunta || '').trim(),
      options: opcoesLimpas,
      correct_index: Number.isInteger(q.correct_index) ? q.correct_index : 0,
      explanation: String(q.explanation || q.explicacao || '').trim(),
    };
  });

}
