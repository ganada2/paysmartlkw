import { motion } from "framer-motion";
import { CreditCard, Sparkles } from "lucide-react";

const ProxyCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative overflow-hidden rounded-2xl p-6"
      style={{
        background: "linear-gradient(135deg, hsl(214, 93%, 58%), hsl(230, 80%, 55%))",
        boxShadow: "var(--shadow-glow)",
      }}
    >
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, hsl(0,0%,100%) 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary-foreground" />
            <span className="text-sm font-semibold text-primary-foreground opacity-90">Master Proxy Card</span>
          </div>
          <Sparkles className="w-5 h-5 text-primary-foreground opacity-80" />
        </div>
        <div className="mb-6">
          <p className="text-xs text-primary-foreground opacity-60 mb-1">카드 번호</p>
          <p className="text-lg font-mono text-primary-foreground tracking-widest">•••• •••• •••• 7842</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-primary-foreground opacity-60 mb-0.5">이름</p>
            <p className="text-sm font-medium text-primary-foreground">김민준</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-primary-foreground opacity-60 mb-0.5">유효기간</p>
            <p className="text-sm font-medium text-primary-foreground">03/28</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProxyCard;
