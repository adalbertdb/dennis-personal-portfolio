import { Navbar, ProgressGlyphs } from "@/components/navbar";
import { StepScroll } from "@/components/step-scroll";
import { Wafer } from "@/components/wafer";
import { WorkSection } from "@/components/work-section";
import { ContactSection } from "@/components/contact-section";
import { getPinnedRepos } from "@/lib/github";

export const dynamic = "force-dynamic";

export default async function Home() {
  const repos = await getPinnedRepos();

  return (
    <div className="bg-black text-white overflow-x-clip">
      <StepScroll />
      <Navbar />
      <ProgressGlyphs />
      <main>
        <Wafer />
        <WorkSection repos={repos} />
        <ContactSection />
      </main>
    </div>
  );
}
