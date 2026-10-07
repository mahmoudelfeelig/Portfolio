import ProjectPage, { projectMetadata } from "../ProjectPage";
import { projectPages } from "../projectPages";

const project = projectPages[1];

export const metadata = projectMetadata(project);

export default function FoundRollPage() {
  return <ProjectPage project={project} />;
}
