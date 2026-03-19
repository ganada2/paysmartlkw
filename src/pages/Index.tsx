import { motion } from "framer-motion";
import { Bell, Settings } from "lucide-react";
import ProxyCard from "@/components/ProxyCard";
import BenefitStats from "@/components/BenefitStats";
import CardPerformanceSection from "@/components/CardPerformanceSection";
import RoutingHistory from "@/components/RoutingHistory";
import NudgeAlerts from "@/components/NudgeAlerts";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-5 pb-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between py-4 sticky top-0 bg-background z-10"
        >
          <div>
            <p className="text-caption">안녕하세요, 민준님 👋</p>
            <h1 className="text-title text-foreground">Smart Pay</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-secondary transition-colors" style={{ boxShadow: "var(--shadow-card)" }}>
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-secondary transition-colors" style={{ boxShadow: "var(--shadow-card)" }}>
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </motion.header>

        {/* Content */}
        <div className="space-y-6">
          <ProxyCard />
          <BenefitStats />
          <CardPerformanceSection />
          <RoutingHistory />
          <NudgeAlerts />
        </div>
      </div>
    </div>
  );
};

export default Index;
