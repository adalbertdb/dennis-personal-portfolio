import { getPinnedRepos } from "@/lib/github"
import { ProjectsClient } from "./projects-client"

export async function ProjectsSection() {
  const repos = await getPinnedRepos()
  return <ProjectsClient repos={repos} />
}
