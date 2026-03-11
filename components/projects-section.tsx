"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Folder } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

const projectMeta = [
  { tags: ["React", "Spring Boot", "MySQL", "TypeScript"], github: "#", demo: "#", featured: true },
  { tags: ["Flutter", "Dart", "Firebase", "REST API"],     github: "#", demo: "#", featured: true },
  { tags: ["React", "Node.js", "MySQL", "Stripe"],         github: "#", demo: "#", featured: true },
  { tags: ["React", "TypeScript", "API Integration"],      github: "#",             featured: false },
  { tags: ["Flutter", "Dart", "REST API"],                 github: "#",             featured: false },
  { tags: ["Next.js", "TypeScript", "Tailwind CSS"],       github: "#",             featured: false },
];

export function ProjectsSection() {
  const { lang } = useLanguage();
  const t = translations[lang].projects;

  const projects = t.projects.map((p, i) => ({ ...p, ...projectMeta[i] }));
  const featured = projects.filter((p) => p.featured);
  const others   = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-24 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-2">{t.subtitle}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-balance">{t.title}</h2>
        </div>

        {/* Featured Projects */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {featured.map((project) => (
            <Card
              key={project.title}
              className="bg-card border-border hover:border-primary/50 transition-all group"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Folder className="h-10 w-10 text-primary" />
                  <div className="flex gap-2">
                    {project.github && (
                      <a
                        href={project.github}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label={`Ver ${project.title} en GitHub`}
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label={`Demo de ${project.title}`}
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Other Projects */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-muted-foreground">{t.other_title}</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {others.map((project) => (
            <Card
              key={project.title}
              className="bg-card/50 border-border hover:border-primary/30 transition-all group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  {project.github && (
                    <a
                      href={project.github}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`Ver ${project.title} en GitHub`}
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <Github className="h-4 w-4" />
              {t.github_cta}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
