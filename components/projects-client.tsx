"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Folder, Star, GitFork } from "lucide-react";
import { useLanguage } from "@/lib/use-language";
import type { PinnedRepo } from "@/lib/github";

interface ProjectsClientProps {
  repos: PinnedRepo[];
}

export function ProjectsClient({ repos }: ProjectsClientProps) {
  const { t } = useLanguage();

  return (
    <section id="projects" className="py-24 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-2">{t.projects.label}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-balance">{t.projects.title}</h2>
        </div>

        {repos.length === 0 ? (
          <p className="text-center text-muted-foreground">{t.projects.empty}</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo) => (
              <Card
                key={repo.name}
                className="bg-card border-border hover:border-primary/50 transition-all group flex flex-col"
              >
                <CardHeader className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <Folder className="h-10 w-10 text-primary" />
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`View ${repo.name} on GitHub`}
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {repo.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {repo.description ?? "No description provided."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  {repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {repo.topics.map((topic) => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {repo.primaryLanguage && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: repo.primaryLanguage.color ?? "#ccc" }}
                        />
                        {repo.primaryLanguage.name}
                      </span>
                    )}
                    {repo.stargazerCount > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5" />
                        {repo.stargazerCount}
                      </span>
                    )}
                    {repo.forkCount > 0 && (
                      <span className="flex items-center gap-1">
                        <GitFork className="h-3.5 w-3.5" />
                        {repo.forkCount}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <a
              href="https://github.com/adalbertdb"
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <Github className="h-4 w-4" />
              {t.projects.github}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
