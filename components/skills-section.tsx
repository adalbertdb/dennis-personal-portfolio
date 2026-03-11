"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

const skillCategories = {
  es: [
    { category: "Frontend",  items: ["React", "TypeScript", "JavaScript", "Tailwind CSS", "HTML/CSS"] },
    { category: "Backend",   items: ["Java", "Spring Boot", "Node.js", "REST APIs", "MySQL"] },
    { category: "Móvil",     items: ["Flutter", "Dart", "Android", "Multiplataforma", "UI Móvil"] },
    { category: "Herramientas", items: ["Git", "GitHub", "VS Code", "IntelliJ", "Figma"] },
  ],
  en: [
    { category: "Frontend",  items: ["React", "TypeScript", "JavaScript", "Tailwind CSS", "HTML/CSS"] },
    { category: "Backend",   items: ["Java", "Spring Boot", "Node.js", "REST APIs", "MySQL"] },
    { category: "Mobile",    items: ["Flutter", "Dart", "Android", "Cross-Platform", "Mobile UI"] },
    { category: "Tools",     items: ["Git", "GitHub", "VS Code", "IntelliJ", "Figma"] },
  ],
};

export function SkillsSection() {
  const { lang } = useLanguage();
  const t = translations[lang].skills;
  const skills = skillCategories[lang];

  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-2">{t.subtitle}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-balance">{t.title}</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill) => (
            <Card
              key={skill.category}
              className="bg-card/50 border-border hover:border-primary/50 transition-colors"
            >
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 text-primary">{skill.category}</h3>
                <ul className="space-y-2">
                  {skill.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
