'use client';

import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { RepoView } from '../../lib/githubPortfolioData';
import { projects, type PortfolioProject } from '../../data/projects';
import styles from './workspaceOS.module.css';

type ProjectGroup = 'fullstack' | 'security' | 'mobile' | 'academic';
type PanState = {
  dragging: boolean;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

type PositionedProject = {
  project: PortfolioProject;
  group: ProjectGroup;
  x: number;
  y: number;
  primaryLanguage: string;
  radius: number;
};

type RepoNetworkProps = {
  githubRepos: RepoView[];
  selectedId: string;
  onSelect: (project: PortfolioProject) => void;
};

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572a5',
  Kotlin: '#a97bff',
  Swift: '#f05138',
  CSS: '#663399',
  HTML: '#e34c26',
  Java: '#b07219',
  C: '#555555',
  'C++': '#f34b7d',
  MATLAB: '#e16737',
  Assembly: '#6e4c13',
  'Jupyter Notebook': '#da5b0b',
  MDX: '#fcb32c',
};

const fallbackLanguages: Record<string, string[]> = {
  portfolio: ['TypeScript', 'CSS', 'JavaScript'],
  scheduler: ['Python', 'TypeScript', 'CSS'],
  typeshift: ['TypeScript', 'JavaScript', 'CSS'],
  doompedia: ['Kotlin', 'Swift', 'Python'],
  'ocpp-demo': ['Python', 'TypeScript', 'CSS'],
  anubis: ['TypeScript', 'MDX', 'CSS'],
  commit: ['Python', 'JavaScript', 'CSS'],
  rps: ['JavaScript', 'CSS', 'HTML'],
  pharmacy: ['Kotlin', 'Java'],
  'processor-simulation': ['C', 'C++'],
};

const groupCenters: Record<ProjectGroup, { x: number; y: number }> = {
  fullstack: { x: 260, y: 210 },
  security: { x: 730, y: 180 },
  mobile: { x: 750, y: 465 },
  academic: { x: 275, y: 475 },
};

function groupFor(project: PortfolioProject): ProjectGroup {
  if (['doompedia', 'pharmacy'].includes(project.id)) return 'mobile';
  if (['ocpp-demo', 'aes', 'chatting-application'].includes(project.id)) return 'security';
  if (['portfolio', 'scheduler', 'typeshift', 'anubis', 'rps', 'commit'].includes(project.id)) return 'fullstack';
  return 'academic';
}

const positionedProjects = (Object.keys(groupCenters) as ProjectGroup[]).flatMap((group) => {
  const grouped = projects.filter((project) => groupFor(project) === group);
  const center = groupCenters[group];
  const radiusX = group === 'academic' ? 195 : 165;
  const radiusY = group === 'academic' ? 110 : 100;

  return grouped.map<PositionedProject>((project, index) => {
    const angle = (Math.PI * 2 * index) / grouped.length - Math.PI / 2;
    const radius = Math.min(20, 12 + project.stack.length * 1.1);
    return {
      project,
      group,
      x: center.x + Math.cos(angle) * radiusX,
      y: center.y + Math.sin(angle) * radiusY,
      primaryLanguage: project.language,
      radius,
    };
  });
});

const sharedEdges = positionedProjects
  .flatMap((left, leftIndex) =>
    positionedProjects.slice(leftIndex + 1).flatMap((right) => {
      const shared = left.project.stack.find((technology) =>
        right.project.stack.some((candidate) => candidate.toLowerCase() === technology.toLowerCase()),
      );
      return shared && left.group !== right.group ? [{ left, right, shared }] : [];
    }),
  )
  .slice(0, 20);

function fallbackRepo(project: PortfolioProject): RepoView {
  const names = fallbackLanguages[project.id] ?? [project.language];
  return {
    name: project.repoName,
    slug: project.id,
    url: project.repoUrl,
    description: project.description,
    language: project.language,
    createdAt: project.updatedAt,
    updatedAt: project.updatedAt,
    pushedAt: project.updatedAt,
    topics: [],
    domain: project.domain ?? project.course ?? project.category,
    techStack: project.stack,
    features: project.highlights,
    about: project.description,
    languages: names.map((name, index) => ({
      name,
      bytes: names.length - index,
      percent: index === 0 ? 58 : index === 1 ? 27 : 15,
    })),
  };
}

function nodeShape(node: PositionedProject, selected: boolean) {
  const className = `${styles.networkNodeShape} ${selected ? styles.networkNodeSelected : ''}`;
  const nodeColor = languageColors[node.primaryLanguage] ?? '#8b949e';
  if (node.group === 'security') {
    return <polygon className={className} style={{ '--node-color': nodeColor } as CSSProperties} points="-17,0 0,-17 17,0 0,17" />;
  }
  if (node.group === 'mobile') {
    return <circle className={className} style={{ '--node-color': nodeColor } as CSSProperties} r={node.radius} />;
  }
  if (node.group === 'academic') {
    return <polygon className={className} style={{ '--node-color': nodeColor } as CSSProperties} points="-16,-9 0,-18 16,-9 16,9 0,18 -16,9" />;
  }
  return <rect className={className} style={{ '--node-color': nodeColor } as CSSProperties} x="-17" y="-17" width="34" height="34" rx="6" />;
}

export function RepoNetwork({ githubRepos, selectedId, onSelect }: RepoNetworkProps) {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panState, setPanState] = useState<PanState | null>(null);
  const selectedProject = projects.find((project) => project.id === selectedId) ?? projects[0];
  const githubRepo =
    githubRepos.find((repo) => repo.name.toLowerCase() === selectedProject.repoName.toLowerCase()) ??
    fallbackRepo(selectedProject);
  const languages = githubRepo.languages.slice(0, 6);

  return (
    <div className={styles.networkApp}>
      <section
        className={styles.networkStage}
        onPointerDown={(event) => {
          if ((event.target as SVGElement).closest?.('[role="button"]')) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          setPanState({
            dragging: true,
            startX: event.clientX,
            startY: event.clientY,
            originX: pan.x,
            originY: pan.y,
          });
        }}
        onPointerMove={(event) => {
          if (!panState?.dragging) return;
          setPan({
            x: panState.originX + event.clientX - panState.startX,
            y: panState.originY + event.clientY - panState.startY,
          });
        }}
        onPointerUp={() => setPanState(null)}
        onPointerCancel={() => setPanState(null)}
      >
        <svg viewBox="0 0 1000 640" role="img" aria-label="Interactive repository network grouped by project type">
          <rect width="1000" height="640" />
          <g
            className={styles.networkMesh}
            style={{ '--mesh-x': `${pan.x}px`, '--mesh-y': `${pan.y}px` } as CSSProperties}
          >
            <g className={styles.networkEdges}>
              {positionedProjects.map((node) => {
                const center = groupCenters[node.group];
                return <line key={`hub-${node.project.id}`} x1={center.x} y1={center.y} x2={node.x} y2={node.y} />;
              })}
              {sharedEdges.map((edge) => (
                <line
                  key={`${edge.left.project.id}-${edge.right.project.id}`}
                  className={styles.networkSharedEdge}
                  x1={edge.left.x}
                  y1={edge.left.y}
                  x2={edge.right.x}
                  y2={edge.right.y}
                />
              ))}
            </g>

            {positionedProjects.map((node, index) => (
              <g
                key={node.project.id}
                className={styles.networkNode}
                style={{ '--float-delay': `${index * -0.37}s` } as CSSProperties}
                transform={`translate(${node.x} ${node.y})`}
                role="button"
                tabIndex={0}
                aria-label={`Open ${node.project.title} repository details`}
                onClick={() => onSelect(node.project)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelect(node.project);
                  }
                }}
              >
                {nodeShape(node, node.project.id === selectedProject.id)}
                <text y="32">{node.project.title}</text>
              </g>
            ))}
          </g>
        </svg>
      </section>

      <aside className={styles.networkInspector}>
        <span>{githubRepo.domain}</span>
        <h3>{selectedProject.title}</h3>
        <p>{githubRepo.about}</p>

        {languages.length > 0 ? (
          <section className={styles.githubLanguages} aria-label={`${selectedProject.title} languages`}>
            <h4>Languages</h4>
            <div className={styles.githubLanguageBar}>
              {languages.map((language) => (
                <i
                  key={language.name}
                  style={{
                    width: `${language.percent}%`,
                    background: languageColors[language.name] ?? '#8b949e',
                  }}
                />
              ))}
            </div>
            <div className={styles.githubLanguageList}>
              {languages.map((language) => (
                <span key={language.name}>
                  <i style={{ background: languageColors[language.name] ?? '#8b949e' }} />
                  <strong>{language.name}</strong>
                  {language.percent.toFixed(1)}%
                </span>
              ))}
            </div>
          </section>
        ) : null}

        <a href={githubRepo.url} target="_blank" rel="noreferrer">
          Open repository <ExternalLink size={14} />
        </a>
      </aside>
    </div>
  );
}
