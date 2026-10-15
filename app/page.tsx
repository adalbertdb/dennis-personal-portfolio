import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { SkillsSection } from "@/components/skills-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { getPinnedRepos } from "@/lib/github";
import { PrototypeSwitcher } from "@/components/prototype/switcher";
import { Despiece } from "@/components/prototype/despiece";
import { Linea } from "@/components/prototype/linea";
import { Oblea } from "@/components/prototype/oblea";
import { Grua } from "@/components/prototype/grua";

export const dynamic = "force-dynamic";

// PROTOTYPE: en desarrollo, ?variant= cambia el diseño de toda la página. Borrar junto a components/prototype/.
const PROTOTYPES: Record<string, (props: { repos: Awaited<ReturnType<typeof getPinnedRepos>> }) => React.ReactNode> = {
  despiece: Despiece,
  linea: Linea,
  oblea: Oblea,
};

export default async function Home({ searchParams }: { searchParams: Promise<{ variant?: string }> }) {
  const dev = process.env.NODE_ENV !== "production";
  const variant = dev ? ((await searchParams).variant ?? "actual") : "actual";
  const Prototype = PROTOTYPES[variant];

  if (Prototype) {
    return (
      <>
        <Prototype repos={await getPinnedRepos()} />
        <PrototypeSwitcher current={variant} />
      </>
    );
  }

  // D solo cambia el héroe: el resto es la página actual.
  return (
    <>
      <Navbar />
      <main>
        {variant === "grua" ? <Grua /> : <HeroSection />}
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>
      <Footer />
      {dev && <PrototypeSwitcher current={variant === "grua" ? "grua" : "actual"} />}
    </>
  );
}
