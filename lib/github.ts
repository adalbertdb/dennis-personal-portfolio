export interface PinnedRepo {
  name: string
  description: string | null
  url: string
  stargazerCount: number
  forkCount: number
  primaryLanguage: { name: string; color: string } | null
  topics: string[]
}

const PINNED_REPOS_QUERY = `
  query {
    user(login: "adalbertdb") {
      pinnedItems(first: 6, types: [REPOSITORY]) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
            repositoryTopics(first: 5) {
              nodes {
                topic {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`

export async function getPinnedRepos(): Promise<PinnedRepo[]> {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    console.warn("GITHUB_TOKEN not set — skipping GitHub fetch")
    return []
  }

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: PINNED_REPOS_QUERY }),
    next: { revalidate: 86400 },
  })

  if (!res.ok) {
    console.error(`GitHub API error: ${res.status}`)
    return []
  }

  const json = await res.json()
  const nodes = json?.data?.user?.pinnedItems?.nodes ?? []

  return nodes.map((repo: any) => ({
    name: repo.name,
    description: repo.description,
    url: repo.url,
    stargazerCount: repo.stargazerCount,
    forkCount: repo.forkCount,
    primaryLanguage: repo.primaryLanguage ?? null,
    topics: repo.repositoryTopics.nodes.map((n: any) => n.topic.name),
  }))
}
