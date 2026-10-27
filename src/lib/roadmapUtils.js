export const LEVELS = [
  { value: 'iniciante', label: 'Iniciante', hint: 'Rookie · começando do zero' },
  { value: 'intermediario', label: 'Intermediário', hint: 'Piloto · já domino o básico' },
  { value: 'avancado', label: 'Avançado', hint: 'Campeão · quero performance' },
];

export const GOAL_TYPES = [
  { value: 'aprender', label: 'Aprender um tema', hint: 'Dominar teoria e prática guiada' },
  { value: 'criar_projeto', label: 'Criar um projeto', hint: 'Roadmap orientado a entregas' },
];

export const STATUSES = [
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'pausado', label: 'Pausado' },
  { value: 'concluido', label: 'Concluído' },
];

const normalize = (value = '') => value.trim().toLowerCase().replace(/\s+/g, ' ');

export function levelLabel(value) {
  return LEVELS.find((l) => l.value === value)?.label || 'Iniciante';
}

export function levelHint(value) {
  return LEVELS.find((l) => l.value === value)?.hint || 'Rookie · começando do zero';
}

export function goalLabel(value) {
  return GOAL_TYPES.find((g) => g.value === value)?.label || 'Aprender um tema';
}

export function statusLabel(value) {
  return STATUSES.find((s) => s.value === value)?.label || 'Em andamento';
}

export function withStepKeys(modules = []) {
  return (modules || []).map((module, mi) => ({
    ...module,
    steps: (module.steps || []).map((step, si) => ({
      ...step,
      key: step.key || `m${mi}s${si}`,
    })),
  }));
}

export function stepKeysOf(modules = []) {
  return withStepKeys(modules).flatMap((m) => (m.steps || []).map((s) => s.key));
}

export function progressOf(roadmap) {
  const keys = stepKeysOf(roadmap?.modules || []);
  const completed = (roadmap?.completed_steps || []).filter((k) => keys.includes(k));
  const total = keys.length;
  const done = new Set(completed).size;
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}

export function moduleProgress(module, completedSteps = []) {
  const steps = module?.steps || [];
  const done = steps.filter((s) => completedSteps.includes(s.key)).length;
  return {
    done,
    total: steps.length,
    percent: steps.length ? Math.round((done / steps.length) * 100) : 0,
  };
}

export function modulesHours(modules = []) {
  return (modules || []).reduce((sum, m) => sum + (Number(m.est_hours) || 0), 0);
}

export function completedTitles(roadmap) {
  const completed = roadmap?.completed_steps || [];
  return withStepKeys(roadmap?.modules || [])
    .flatMap((m) => m.steps.map((s) => ({ key: s.key, title: s.title })))
    .filter((s) => completed.includes(s.key))
    .map((s) => s.title);
}

export function remapCompleted(oldModules, oldCompleted, newModules) {
  const titleByOldKey = Object.fromEntries(
    withStepKeys(oldModules || []).flatMap((m) => m.steps.map((s) => [s.key, normalize(s.title)]))
  );
  const newKeyByTitle = Object.fromEntries(
    withStepKeys(newModules || []).flatMap((m) => m.steps.map((s) => [normalize(s.title), s.key]))
  );
  const preserved = (oldCompleted || [])
    .map((key) => titleByOldKey[key])
    .filter(Boolean)
    .map((title) => newKeyByTitle[title])
    .filter(Boolean);
  return Array.from(new Set(preserved));
}

const STORAGE_KEY = 'amg_roadmaps';

export function localRoadmapIds() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function rememberRoadmap(id) {
  const ids = localRoadmapIds();
  if (!ids.includes(id)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([id, ...ids].slice(0, 200)));
  }
}

export function forgetRoadmap(id) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(localRoadmapIds().filter((i) => i !== id)));
}