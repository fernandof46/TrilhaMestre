import { base44 } from '@/api/base44Client';
import { completedTitles, levelLabel, withStepKeys } from './roadmapUtils';

const MODULE_ITEM = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    objective: { type: 'string' },
    est_hours: { type: 'number' },
    steps: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          est_minutes: { type: 'number' },
          practice: { type: 'string' },
          success_criteria: { type: 'string' },
          resources: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                url: { type: 'string' },
                type: {
                  type: 'string',
                  enum: ['video', 'curso', 'doc', 'pratica', 'livro', 'ferramenta', 'comunidade'],
                },
                provider: { type: 'string' },
              },
              required: ['title', 'url'],
            },
          },
        },
        required: ['title', 'description'],
      },
    },
  },
  required: ['title', 'steps'],
};

const ROADMAP_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    summary: { type: 'string' },
    strategy: { type: 'string' },
    total_weeks: { type: 'number' },
    total_hours: { type: 'number' },
    modules: { type: 'array', items: MODULE_ITEM },
  },
  required: ['title', 'summary', 'modules'],
};

const REVISION_SCHEMA = {
  type: 'object',
  properties: {
    adaptation_note: { type: 'string' },
    summary: { type: 'string' },
    total_weeks: { type: 'number' },
    total_hours: { type: 'number' },
    modules: { type: 'array', items: MODULE_ITEM },
  },
  required: ['adaptation_note', 'modules'],
};

const QUIZ_SCHEMA = {
  type: 'object',
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          options: { type: 'array', items: { type: 'string' } },
          correct_index: { type: 'number' },
          explanation: { type: 'string' },
        },
        required: ['question', 'options', 'correct_index', 'explanation'],
      },
    },
  },
  required: ['questions'],
};

const LEVEL_BRIEF = {
  iniciante:
    'iniciante (começa do zero: precisa de fundamentos, linguagem simples, muitos exemplos e nenhuma etapa implícita)',
  intermediario:
    'intermediário (já domina o básico: pode pular introduções longas e focar em prática, lacunas e consolidação)',
  avancado:
    'avançado (domina básico e intermediário: foco em profundidade, performance, arquitetura, projetos reais e temas de fronteira)',
};

const GOAL_BRIEF = {
  aprender: 'dominar o tema de verdade ao final do plano, aprendendo fazendo',
  criar_projeto: 'entregar um projeto concreto, utilizável e apresentável ao final do plano',
};

const FREE_RESOURCES_RULE = `RECURSOS (regra obrigatória): cada etapa precisa de 2 a 4 recursos GRATUITOS com URL REAL e verificável.
Fontes aceitas: YouTube (aulas completas), freeCodeCamp, MDN, Khan Academy, CS50, Coursera em modo gratuito/auditável, documentação oficial, GitHub, Kaggle, blogs técnicos reconhecidos, bibliotecas públicas.
NUNCA invente URL, nunca use conteúdo pago, nunca use links de busca, agregadores duvidosos ou páginas iniciais genéricas: aponte para a página específica do conteúdo.
Priorize material em português do Brasil quando existir opção boa; complemente com inglês quando for claramente melhor.`;

function compactRoadmap(roadmap) {
  return JSON.stringify({
    title: roadmap.title,
    tema: roadmap.topic,
    meta: roadmap.goal_type,
    nivel: roadmap.level,
    horas_por_semana: roadmap.hours_per_week,
    semanas_planejadas: roadmap.total_weeks,
    etapas_concluidas: completedTitles(roadmap),
    modulos: (roadmap.modules || []).map((m) => ({
      titulo: m.title,
      objetivo: m.objective,
      horas: m.est_hours,
      etapas: (m.steps || []).map((s) => ({
        titulo: s.title,
        descricao: s.description,
        minutos: s.est_minutes,
        concluida: (roadmap.completed_steps || []).includes(s.key),
        recursos: (s.resources || []).map((r) => r.title),
      })),
    })),
  });
}

export async function generateRoadmap({ topic, goalType, level, hoursPerWeek, horizonWeeks, context }) {
  const prompt = `Você é um estrategista de aprendizagem de elite — pense como um engenheiro de corrida da Mercedes-AMG F1: direto, orientado a dados, focado em execução e resultado.

TAREFA: montar o caminho EXATO para esta pessoa atingir o objetivo dela, em etapas que ela consegue executar na semana.

TEMA / OBJETIVO PEDIDO: "${topic}"
META: ${GOAL_BRIEF[goalType] || GOAL_BRIEF.aprender}
NÍVEL ATUAL: ${LEVEL_BRIEF[level] || LEVEL_BRIEF.iniciante}
TEMPO DISPONÍVEL: ${hoursPerWeek} horas por semana
HORIZONTE DESEJADO: ${horizonWeeks} semanas
CONTEXTO EXTRA DO ALUNO: ${context || 'não informado'}

ESTRUTURA OBRIGATÓRIA:
1. De 4 a 6 módulos sequenciais; cada módulo com 3 a 5 etapas acionáveis (nada de tarefa vaga).
2. Cada etapa: título curto e específico; descrição de 1 a 2 frases dizendo o que fazer e por quê; tempo estimado em minutos realista para as horas/semana informadas; uma tarefa prática concreta; e um critério de sucesso verificável ("pronto quando...").
3. A profundidade deve respeitar o nível ${level}: não repita fundamentos que o perfil já domina.
${FREE_RESOURCES_RULE}
4. O plano precisa caber em ${horizonWeeks} semanas com ${hoursPerWeek} h/semana — mantenha "total_hours" e "total_weeks" coerentes com os módulos. Se o alvo for ambicioso demais para o prazo, entregue o melhor caminho possível e explique na estratégia o que fica para depois.
5. "strategy": de 3 a 5 frases explicando a lógica da sequência e como validar progresso (o plano de corrida).
6. "summary": 2 a 3 frases vendendo o plano de forma realista.
7. Escreva tudo em português do Brasil, tom direto e motivador, sem promessas irreais.

Antes de responder, revise mentalmente cada URL: se não tiver certeza absoluta de que existe e é gratuita, troque por outra fonte que você conhece bem. Use a busca na internet para confirmar cursos e vídeos gratuitos atuais.`;

  const data = await base44.integrations.Core.InvokeLLM({
    prompt,
    add_context_from_internet: true,
    model: 'gemini_3_flash',
    response_json_schema: ROADMAP_SCHEMA,
  });

  return { ...data, modules: withStepKeys(data?.modules || []) };
}

export async function adaptRoadmap({ roadmap, feedback }) {
  const prompt = `Você é o estrategista de aprendizagem do aluno (nível engenheiro de corrida): ajusta o plano de estudo em tempo real como um engenheiro ajusta a estratégia durante a corrida.

ROADMAP ATUAL E PROGRESSO (JSON):
${compactRoadmap(roadmap)}

PEDIDO DE AJUSTE DO ALUNO: "${feedback || 'aumentar a eficiência do plano mantendo o objetivo'}"
RITMO DISPONÍVEL: ${roadmap.hours_per_week || 8} horas por semana.

REGRAS OBRIGATÓRIAS:
1. Devolva a versão REVISADA e COMPLETA dos módulos (não um diff), com 4 a 6 módulos e 3 a 5 etapas por módulo.
2. NUNCA rebaixe o objetivo final: ajuste ritmo, ordem, profundidade e foco para chegar lá.
3. Mantenha EXATAMENTE o mesmo título das etapas marcadas como "concluida": true — o progresso do aluno depende disso. Se uma etapa concluída ficar obsoleta, mantenha o título dela no novo plano.
4. Reaja ao pedido do aluno de forma concreta: se está difícil, quebre em etapas menores e adicione pré-requisitos; se está fácil, comprima e avance; se falta tempo, priorize o que gera resultado e corte o que é secundário; se pede prática, adicione entregas.
5. Cada etapa mantém tarefa prática, critério de sucesso e 2 a 4 recursos gratuitos verificados.
${FREE_RESOURCES_RULE}
6. "adaptation_note": 2 a 3 frases em português do Brasil explicando o que mudou, por quê e qual é a próxima ação.
7. "summary": resumo atualizado do plano. Ajuste "total_weeks" e "total_hours" à nova carga.

Escreva tudo em português do Brasil.`;

  const data = await base44.integrations.Core.InvokeLLM({
    prompt,
    add_context_from_internet: true,
    model: 'gemini_3_flash',
    response_json_schema: REVISION_SCHEMA,
  });

  return { ...data, modules: withStepKeys(data?.modules || []) };
}

export async function generateQuiz({ roadmap, module }) {
  const steps = (module?.steps || [])
    .map(
      (s) =>
        `- ${s.title}: ${s.description} | prática: ${s.practice || 'não informada'} | pronto quando: ${s.success_criteria || 'não informado'}`
    )
    .join('\n');

  const prompt = `Você é um examinador técnico rigoroso e justo, aplicando um checkpoint de validação de um plano de estudos.

TEMA GERAL: ${roadmap.topic} (nível ${levelLabel(roadmap.level)})
MÓDULO AVALIADO: ${module.title}
OBJETIVO DO MÓDULO: ${module.objective || 'não informado'}
ETAPAS DO MÓDULO:
${steps}

Crie 6 perguntas de múltipla escolha que provem se o aluno realmente domina este módulo.

REGRAS:
- 6 perguntas; cada uma com exatamente 4 alternativas plausíveis e apenas 1 correta.
- Misture: 2 de conceito, 2 de aplicação prática (situações reais) e 2 de diagnóstico de erro (o que está errado e por quê).
- Dificuldade coerente com o nível ${levelLabel(roadmap.level)}; sem pegadinhas triviais nem perguntas decorativas.
- Alternativas erradas devem ser erros típicos de quem ainda não domina, não absurdos.
- "explanation": 1 a 2 frases explicando por que a correta está correta e qual erro a alternativa mais tentadora representa.
- Tudo em português do Brasil.`;

  const data = await base44.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: QUIZ_SCHEMA,
  });

  return data?.questions || [];
}

export async function askEngineer({ roadmap, module, step, history, question }) {
  const transcript = (history || [])
    .slice(-8)
    .map((m) => `${m.role === 'user' ? 'ALUNO' : 'ENGENHEIRO'}: ${m.content}`)
    .join('\n');

  const prompt = `Você é o engenheiro de pista do aluno: um mentor que fala no rádio, explica rápido, ensina de verdade e mantém o aluno em movimento.

CONTEXTO DO PLANO: tema "${roadmap.topic}", nível ${levelLabel(roadmap.level)}, objetivo: ${roadmap.goal_type === 'criar_projeto' ? 'criar um projeto concreto' : 'dominar o tema'}.
MÓDULO: ${module?.title || '-'} — ${module?.objective || ''}
ETAPA ATUAL: ${step?.title || '-'}
O que fazer: ${step?.description || '-'}
Prática: ${step?.practice || '-'}
Pronto quando: ${step?.success_criteria || '-'}
Recursos já indicados: ${(step?.resources || []).map((r) => r.title).join(' | ') || 'nenhum'}

CONVERSA ATÉ AGORA:
${transcript || '(início da conversa)'}

MENSAGEM DO ALUNO: ${question}

Responda em português do Brasil, no máximo 200 palavras, como um engenheiro de rádio: direto, prático, sem enrolação.
- Explique com um exemplo concreto ligado ao tema dele.
- Termine com a próxima ação imediata ("faça agora: ...").
- Se estiver travado, ofereça um caminho mais simples e um teste rápido para destravar.
- Não invente links e não repita o plano inteiro.`;

  const answer = await base44.integrations.Core.InvokeLLM({ prompt });
  return typeof answer === 'string' ? answer : JSON.stringify(answer);
}