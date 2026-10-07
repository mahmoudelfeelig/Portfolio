import ProjectPage, { projectMetadata } from "../ProjectPage";
import { projectPages } from "../projectPages";

const project = projectPages[0];

export const metadata = projectMetadata(project);

export default function CuratePage() {
  return <ProjectPage project={project} />;
}
