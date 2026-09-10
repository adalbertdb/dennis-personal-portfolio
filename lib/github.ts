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
  const token = process.env.GITHUB_TOKEN?.trim()

  if (!token) {
    console.error("GITHUB_TOKEN not set — pinned repositories unavailable")
    return []
  }

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: PINNED_REPOS_QUERY }),
      next: { revalidate: 86400 },
    })

    const json = await res.json()
    if (!res.ok || json.errors?.length) {
      console.error(`GitHub API error: ${res.status}`, json.errors)
      return []
    }

    const nodes = json?.data?.user?.pinnedItems?.nodes ?? []

    return nodes.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      url: repo.url,
      stargazerCount: repo.stargazerCount,
      forkCount: repo.forkCount,
      primaryLanguage: repo.primaryLanguage ?? null,
      topics: repo.repositoryTopics?.nodes?.map((n: any) => n.topic.name) ?? [],
    }))
  } catch (error) {
    console.error("GitHub fetch failed", error)
    return []
  }
}
