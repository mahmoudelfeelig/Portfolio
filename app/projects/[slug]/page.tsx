import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectPage, projectPages } from "../projectPages";
import styles from "../projectPages.module.css";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projectPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectPage(slug);
  if (!project) return {};

  const url = `https://elfeel.me/projects/${project.slug}`;
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${project.title} | Mahmoud Elfeel`,
      description: project.description,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectPage(slug);
  if (!project) notFound();

  return (
    <main className={styles.page}>
      <a className={styles.back} href="/">Mahmoud Elfeel / Projects</a>
      <article className={styles.article}>
        <p className={styles.category}>{project.category}</p>
        <h1>{project.title}</h1>
        <p className={styles.lead}>{project.description}</p>
        <div className={styles.links}>
          <a href={project.liveUrl}>Open project</a>
          <a href={project.repositoryUrl}>View source code</a>
        </div>
        <section aria-labelledby="project-story">
          <h2 id="project-story">The project</h2>
          <p>{project.introduction}</p>
        </section>
        <section aria-labelledby="project-details">
          <h2 id="project-details">What the public version shows</h2>
          {project.details.map((detail) => <p key={detail}>{detail}</p>)}
        </section>
      </article>
    </main>
  );
}
