import { projects } from './projects';

export type GraphNode = {
  id: string;
  label: string;
  kind: 'project' | 'technology' | 'domain';
};

export type GraphEdge = {
  from: string;
  to: string;
  label: string;
};

const projectNodes: GraphNode[] = projects.map((project) => ({
  id: project.id,
  label: project.title,
  kind: 'project',
}));

const technologyNodes = Array.from(new Set(projects.flatMap((project) => project.stack.slice(0, 4)))).map<GraphNode>((technology) => ({
  id: `tech:${technology.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  label: technology,
  kind: 'technology',
}));

const domainNodes = Array.from(new Set(projects.map((project) => project.domain ?? project.course ?? project.category))).map<GraphNode>((domain) => ({
  id: `domain:${domain.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  label: domain,
  kind: 'domain',
}));

export const projectGraph = {
  generatedAt: '2026-06-28',
  nodes: [...projectNodes, ...technologyNodes, ...domainNodes],
  edges: projects.flatMap<GraphEdge>((project) => [
    {
      from: project.id,
      to: `domain:${(project.domain ?? project.course ?? project.category).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      label: 'domain',
    },
    ...project.stack.slice(0, 4).map((technology) => ({
      from: project.id,
      to: `tech:${technology.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      label: 'uses',
    })),
  ]),
};
