"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Linkedin, Github, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

export function ContactSection() {
  const { lang } = useLanguage();
  const t = translations[lang].contact;

  const contactLinks = [
    {
      icon: Mail,
      label: "Email",
      value: "hello@dennisadalbert.dev",
      href: "mailto:hello@dennisadalbert.dev",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "linkedin.com/in/dennisadalbert",
      href: "https://linkedin.com",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "github.com/dennisadalbert",
      href: "https://github.com",
    },
  ];

  return (
    <section id="contact" className="py-24 px-6 bg-secondary/30">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-primary font-medium mb-2">{t.subtitle}</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">{t.title}</h2>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          {t.description}
        </p>

        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-12">
          <MapPin className="h-4 w-4" />
          <span>{t.location}</span>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {contactLinks.map((link) => (
            <Card
              key={link.label}
              className="bg-card/50 border-border hover:border-primary/50 transition-colors group"
            >
              <CardContent className="pt-6">
                <a
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="block"
                >
                  <link.icon className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <p className="font-medium mb-1">{link.label}</p>
                  <p className="text-sm text-muted-foreground truncate">{link.value}</p>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button size="lg" asChild>
          <a href="mailto:hello@dennisadalbert.dev">{t.cta}</a>
        </Button>
      </div>
    </section>
  );
}
