import { motion } from "framer-motion";
import { TrendingUp, Percent, Shield, Zap } from "lucide-react";

const stats = [
  { label: "이번 달 절약", value: "₩47,200", icon: TrendingUp, color: "text-success" },
  { label: "최적화율", value: "94%", icon: Percent, color: "text-primary" },
  { label: "연결 카드", value: "5장", icon: Shield, color: "text-accent-foreground" },
  { label: "오늘 라우팅", value: "12건", icon: Zap, color: "text-warning" },
];

const BenefitStats = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
          className="toss-card flex flex-col gap-2"
        >
          <stat.icon className={`w-5 h-5 ${stat.color}`} />
          <p className="text-display text-card-foreground">{stat.value}</p>
          <p className="text-caption">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default BenefitStats;
