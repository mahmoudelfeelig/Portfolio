import { projects } from '../data/projects';

export const assistantProfile = {
  name: 'Mahmoud Elfeel',
  location: 'Berlin, Germany',
  role: 'Junior Software Engineer',
  education: 'B.Sc. Networking Engineering, graduating July 2026',
  email: 'mahmoudelfeelig@gmail.com',
  github: 'https://github.com/mahmoudelfeelig',
  linkedin: 'https://www.linkedin.com/in/elephanto',
  cv: '/Mahmoud_Elfil_CV.pdf',
};

export const assistantProjects = projects.map((project) => ({
  id: project.id,
  title: project.title,
  description: project.description,
  category: project.category,
  status: project.status,
  stack: project.stack,
  highlights: project.highlights,
  course: project.course,
  domain: project.domain,
  repoUrl: project.repoUrl,
  liveUrl: project.liveUrl,
}));

export type AssistantCategory =
  | 'backend'
  | 'mobile'
  | 'security'
  | 'ev-charging'
  | 'thesis'
  | 'games'
  | 'contact'
  | 'cv'
  | 'general';

export type AssistantSource = {
  id: string;
  title: string;
  url: string;
  kind: 'Live project' | 'GitHub repository';
  tags: string[];
};

export type AssistantHistoryItem = {
  role: 'user' | 'assistant';
  content: string;
};

export type AssistantReply = {
  answer: string;
  projectIds: string[];
  category: AssistantCategory;
};

const categoryTerms: Record<Exclude<AssistantCategory, 'general' | 'contact' | 'cv'>, string[]> = {
  backend: ['backend', 'api', 'server', 'fastapi', 'express', 'postgresql', 'mongodb', 'database', 'python'],
  mobile: ['mobile', 'android', 'ios', 'kotlin', 'swift', 'phone'],
  security: ['security', 'secure', 'threat', 'network', 'privacy', 'wireguard', 'wazuh', 'vulnerability'],
  'ev-charging': ['ev', 'charging', 'charger', 'ocpp', 'tariff'],
  thesis: ['thesis', 'manta', 'bachelor', 'research', 'metadata'],
  games: ['game', 'games', 'gaming', 'minecraft', 'puzzle', 'arg'],
};

export function classifyQuestion(question: string): AssistantCategory {
  const normalized = question.toLowerCase();
  if (/contact|email|linkedin|reach mahmoud/.test(normalized)) return 'contact';
  if (/\bcv\b|résumé|resume/.test(normalized)) return 'cv';

  let best: AssistantCategory = 'general';
  let bestScore = 0;
  for (const [category, terms] of Object.entries(categoryTerms)) {
    const score = terms.reduce((total, term) => total + (normalized.includes(term) ? 1 : 0), 0);
    if (score > bestScore) {
      best = category as AssistantCategory;
      bestScore = score;
    }
  }
  return best;
}

export function findRelevantProjects(question: string, limit = 5) {
  const category = classifyQuestion(question);
  const categoryKeywords = category in categoryTerms
    ? categoryTerms[category as keyof typeof categoryTerms]
    : [];
  const terms = Array.from(new Set([
    ...question
      .toLowerCase()
      .split(/[^a-z0-9+#.]+/)
      .filter((term) => term.length > 2),
    ...categoryKeywords,
  ]));

  return assistantProjects
    .map((project, index) => {
      const haystack = [
        project.title,
        project.description,
        project.category,
        project.status,
        project.course,
        project.domain,
        ...project.stack,
        ...project.highlights,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0)
        + (project.status === 'featured' ? 0.2 : 0)
        + (project.liveUrl ? 0.1 : 0);
      return { project, score, index };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ project }) => project);
}

export function projectSources(projectIds: string[]): AssistantSource[] {
  return Array.from(new Set(projectIds))
    .map((id) => assistantProjects.find((project) => project.id === id))
    .filter((project): project is (typeof assistantProjects)[number] => Boolean(project))
    .map((project) => ({
      id: project.id,
      title: project.title,
      url: project.liveUrl ?? project.repoUrl,
      kind: project.liveUrl ? 'Live project' : 'GitHub repository',
      tags: project.stack.slice(0, 3),
    }));
}

function projectSummary(question: string, limit = 3): AssistantReply {
  const category = classifyQuestion(question);
  const matches = findRelevantProjects(question, limit);
  if (!matches.length) {
    return {
      answer: `I do not have that detail in Mahmoud's public portfolio yet. You can contact him directly at ${assistantProfile.email}.`,
      projectIds: [],
      category,
    };
  }
  return {
    answer: matches.map((project) => `${project.title}: ${project.description}`).join('\n\n'),
    projectIds: matches.map((project) => project.id),
    category,
  };
}

export function runDeterministicCommand(question: string): AssistantReply | null {
  const command = question.trim().toLowerCase();
  if (!command.startsWith('/')) return null;

  if (command === '/contact') {
    return {
      answer: `The fastest way to reach Mahmoud is ${assistantProfile.email}. You can also use LinkedIn or GitHub from the contact links below.`,
      projectIds: [],
      category: 'contact',
    };
  }
  if (command === '/cv' || command === '/resume') {
    return {
      answer: 'Mahmoud’s CV covers his software engineering experience across backend, desktop, mobile, network security, and computer vision work.',
      projectIds: [],
      category: 'cv',
    };
  }
  if (command.startsWith('/explain manta')) {
    return projectSummary('MANTA bachelor thesis metadata mobile network security', 1);
  }
  if (command.startsWith('/projects ')) {
    return projectSummary(command.replace('/projects ', ''), 4);
  }
  return {
    answer: 'I know /projects backend, /projects mobile, /projects security, /projects games, /explain manta, /cv, and /contact.',
    projectIds: [],
    category: 'general',
  };
}

export function fallbackReply(question: string): AssistantReply {
  const category = classifyQuestion(question);
  if (category === 'contact') return runDeterministicCommand('/contact') as AssistantReply;
  if (category === 'cv') return runDeterministicCommand('/cv') as AssistantReply;
  return projectSummary(question);
}
