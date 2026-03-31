import { LiveStatsBar } from "@/components/layout/live-stats-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { TopNav } from "@/components/layout/top-nav";
import { LabBackground } from "@/components/visuals/lab-background";
import { AgentLabSection } from "@/features/agent-lab/agent-lab-section";
import { ExperimentsSection } from "@/features/experiments/experiments-section";
import { HeroSection } from "@/features/hero/hero-section";
import { SimulationSection } from "@/features/simulation/simulation-section";
import { TrainingLabSection } from "@/features/training-lab/training-lab-section";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <LabBackground />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_at_top,black_42%,transparent_100%)]" />

      <TopNav />
      <LiveStatsBar />

      <main className="flex-1">
        <HeroSection />
        <TrainingLabSection />
        <AgentLabSection />
        <SimulationSection />
        <ExperimentsSection />
      </main>
      <SiteFooter />
    </div>
  );
}
