import { Card, CardContent } from "@/components/ui/card";

const skills = [
  {
    category: "Frontend",
    items: ["Vue.js 3", "Composition API", "Pinia", "Vue Router", "TypeScript", "Tailwind CSS"],
  },
  {
    category: "Backend",
    items: ["Java", "Spring Boot", "Node.js", "REST APIs", "MySQL"],
  },
  {
    category: "Mobile",
    items: ["Flutter", "Dart", "Android", "Cross-Platform"],
  },
  {
    category: "Tools",
    items: ["Git", "GitHub", "IntelliJ", "VS Code", "Figma"],
  },
];

export function SkillsSection() {
  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-2">What I Work With</p>
          <h2 className="text-3xl md:text-4xl font-bold text-balance">Technical Skills</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill) => (
            <Card key={skill.category} className="bg-card/50 border-border hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 text-primary">{skill.category}</h3>
                <ul className="space-y-2">
                  {skill.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
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
