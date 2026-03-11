"use client";

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, MapPin, Code2, Rocket } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

export function AboutSection() {
  const { lang } = useLanguage();
  const t = translations[lang].about;

  const highlights = [
    {
      icon: GraduationCap,
      title: t.highlights.graduate_title,
      description: t.highlights.graduate_desc,
    },
    {
      icon: MapPin,
      title: t.highlights.location_title,
      description: t.highlights.location_desc,
    },
    {
      icon: Code2,
      title: t.highlights.stack_title,
      description: t.highlights.stack_desc,
    },
    {
      icon: Rocket,
      title: t.highlights.learning_title,
      description: t.highlights.learning_desc,
    },
  ];

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-2">{t.subtitle}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-balance">{t.title}</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">{t.p1}</p>
            <p className="text-lg text-muted-foreground leading-relaxed">{t.p2}</p>
            <p className="text-lg text-muted-foreground leading-relaxed">{t.p3}</p>
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
