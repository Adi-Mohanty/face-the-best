import HeroSection from "../components/welcome/HeroSection";
import LeaderboardPreview from "../components/welcome/LeaderboardPreview";
import FeaturesSection from "../components/welcome/FeaturesSection";
import LeaguePreview from "../components/welcome/LeaguePreview";
import StatsPreview from "../components/welcome/StatsPreview";
import FinalCTA from "../components/welcome/FinalCTA";
import { motion } from "framer-motion";

export default function Welcome() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
        <main className="bg-background-light min-h-screen flex flex-col">

          <HeroSection />

          <LeaderboardPreview />

          <FeaturesSection />

          <LeaguePreview />

          <StatsPreview />

          <FinalCTA />

        </main>
    </motion.div>
  );
}
