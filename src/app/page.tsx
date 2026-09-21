import HeroSection from "@/components/hero/HeroSection";
import MetricsStrip from "@/components/home/MetricsStrip";
import ProblemSection from "@/components/home/ProblemSection";
import WorkflowStepper from "@/components/home/WorkflowStepper";
import InteractiveDemoStrip from "@/components/home/InteractiveDemoStrip";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <MetricsStrip />
      <ProblemSection />
      <WorkflowStepper />
      <InteractiveDemoStrip />
    </div>
  );
}
