import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, MapPin, Code2, Rocket } from "lucide-react";

const highlights = [
  {
    icon: GraduationCap,
    title: "DAM Graduate",
    description: "Recently completed Desarrollo de Aplicaciones Multiplataforma studies",
  },
  {
    icon: MapPin,
    title: "Based in Spain",
    description: "Open to remote opportunities and relocation within Europe",
  },
  {
    icon: Code2,
    title: "Full Stack Focus",
    description: "Building end-to-end solutions from frontend to backend",
  },
  {
    icon: Rocket,
    title: "Always Learning",
    description: "Continuously exploring new technologies and best practices",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-2">Get To Know Me</p>
          <h2 className="text-3xl md:text-4xl font-bold text-balance">About Me</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              I&apos;m a passionate developer who recently graduated from DAM (Desarrollo de Aplicaciones Multiplataforma) 
              in Spain. My journey into programming started with curiosity about how apps work, and it quickly 
              turned into a deep passion for creating elegant solutions.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I specialize in building full-stack web applications using <span className="text-primary font-medium">React</span> and 
              <span className="text-primary font-medium"> Spring Boot</span>, as well as cross-platform mobile apps with 
              <span className="text-primary font-medium"> Flutter</span>. I love the entire process of turning ideas into 
              functional, beautiful products.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              When I&apos;m not coding, you can find me exploring new technologies, contributing to open-source projects, 
              or improving my skills through online courses and side projects. I&apos;m actively seeking opportunities 
              where I can grow as a developer and contribute to meaningful projects.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {highlights.map((item) => (
              <Card key={item.title} className="bg-card/50 border-border">
                <CardContent className="pt-6">
                  <item.icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
