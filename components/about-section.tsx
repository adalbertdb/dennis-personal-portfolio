"use client";

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, MapPin, Code2, Rocket } from "lucide-react";
import { useLanguage } from "@/lib/use-language";

const cardIcons = [GraduationCap, MapPin, Code2, Rocket];

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-2">{t.about.label}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-balance">{t.about.title}</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">{t.about.p1}</p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t.about.p2.split(/(Vue\.js|Spring Boot|Flutter)/).map((part, i) =>
                ["Vue.js", "Spring Boot", "Flutter"].includes(part) ? (
                  <span key={i} className="text-primary font-medium">{part}</span>
                ) : (
                  part
                )
              )}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">{t.about.p3}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {t.about.cards.map((card, i) => {
              const Icon = cardIcons[i];
              return (
                <Card key={card.title} className="bg-card/50 border-border">
                  <CardContent className="pt-6">
                    <Icon className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
