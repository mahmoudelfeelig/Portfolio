import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { previewArtifacts } from "../../../data/projectPreviewArtifacts";
import { projects } from "../../../data/projects";
import styles from "./projectPage.module.css";

const siteUrl = "https://elfeel.me";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((candidate) => candidate.id === slug);

  if (!project) return {};

  const artifact = previewArtifacts[project.id];
  const image = artifact?.screenshot?.path ?? "/opengraph-image";
  const canonical = `/projects/${project.id}`;

  return {
    title: `${project.title} Project`,
    description: project.description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: `${project.title} | Mahmoud Elfeel`,
      description: project.description,
      images: [
        {
          url: image,
          alt: artifact?.screenshot?.alt ?? `${project.title} project preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Mahmoud Elfeel`,
      description: project.description,
      images: [image],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((candidate) => candidate.id === slug);

  if (!project) notFound();

  const artifact = previewArtifacts[project.id];
  const canonicalUrl = `${siteUrl}/projects/${project.id}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.description,
    url: canonicalUrl,
    codeRepository: project.repoUrl,
    programmingLanguage: project.language,
    runtimePlatform: project.stack,
    author: {
      "@type": "Person",
      "@id": `${siteUrl}/#mahmoud-elfeel`,
      name: "Mahmoud Elfeel",
      url: siteUrl,
    },
  };

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <nav className={styles.nav} aria-label="Project page navigation">
        <Link href="/">Mahmoud Elfeel</Link>
        <Link href={`/?project=${project.id}#featured`}>Open in Workspace</Link>
      </nav>

      <article className={styles.project}>
        <header className={styles.hero}>
          <div>
            <span className={styles.eyebrow}>
              {project.course ?? project.category} / {project.language}
            </span>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            <div className={styles.actions}>
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noreferrer">
                  Open live project
                </a>
              ) : null}
              <a href={project.repoUrl} target="_blank" rel="noreferrer">
                View repository
              </a>
            </div>
          </div>

          <dl className={styles.facts}>
            <div>
              <dt>Status</dt>
              <dd>{project.status}</dd>
            </div>
            <div>
              <dt>Primary language</dt>
              <dd>{project.language}</dd>
            </div>
            {project.domain ? (
              <div>
                <dt>Domain</dt>
                <dd>{project.domain}</dd>
              </div>
            ) : null}
            {project.semester ? (
              <div>
                <dt>Semester</dt>
                <dd>{project.semester}</dd>
              </div>
            ) : null}
          </dl>
        </header>

        {artifact?.video ? (
          <section
            className={styles.media}
            aria-label={`${project.title} demonstration`}
          >
            <video
              controls
              playsInline
              preload="metadata"
              poster={artifact.video.poster}
            >
              {artifact.video.sources.map((source) => (
                <source key={source.src} src={source.src} type={source.type} />
              ))}
            </video>
          </section>
        ) : artifact?.screenshot?.path ? (
          <section className={styles.media}>
            <img src={artifact.screenshot.path} alt={artifact.screenshot.alt} />
          </section>
        ) : null}

        <div className={styles.details}>
          <section>
            <span className={styles.eyebrow}>Technology</span>
            <h2>Stack</h2>
            <ul className={styles.tags}>
              {project.stack.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </section>

          <section>
            <span className={styles.eyebrow}>Implementation</span>
            <h2>Highlights</h2>
            <ul>
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </section>

          <section>
            <span className={styles.eyebrow}>Reflection</span>
            <h2>Lessons learned</h2>
            <ul>
              {project.lessonsLearned.map((lesson) => (
                <li key={lesson}>{lesson}</li>
              ))}
            </ul>
          </section>
        </div>
      </article>
    </main>
  );
}
