import { motion } from "framer-motion";
import { TrendingUp, Percent, Shield } from "lucide-react";

type BenefitStatsProps = {
  totalSaved: number;
  avgPickingRate: number;
  connectedCardCount: number;
  routingCount: number;
  onTileClick?: (key: "savings" | "picking" | "routing") => void;
};

const formatKRW = (n: number) => `₩${n.toLocaleString()}`;

const BenefitStats = ({
  totalSaved,
  avgPickingRate,
  connectedCardCount,
  routingCount,
  onTileClick,
}: BenefitStatsProps) => {
  const savingsStat = {
    key: "savings" as const,
    label: "절약 금액",
    value: formatKRW(totalSaved),
    icon: TrendingUp,
    color: "text-success",
  };
  const pickingStat = {
    key: "picking" as const,
    label: "AI 최적카드 피킹률",
    value: `${avgPickingRate}%`,
    icon: Percent,
    color: "text-primary",
  };
  const routingStat = {
    key: "routing" as const,
    label: "연결 카드 라우팅",
    value: `${connectedCardCount}장 · ${routingCount}건`,
    icon: Shield,
    color: "text-accent-foreground",
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {[savingsStat, pickingStat, routingStat].map((stat, i) => {
        const clickable = !!onTileClick;
        const common =
          "toss-card flex flex-col gap-2 transition-transform hover:scale-[1.01]";

        if (stat.key === "routing") {
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 + i * 0.06 }}
              className={`${common} col-span-2 ${clickable ? "cursor-pointer" : ""}`}
              onClick={() => onTileClick?.(stat.key)}
              role={clickable ? "button" : undefined}
              tabIndex={clickable ? 0 : undefined}
              onKeyDown={(e) => {
                if (!clickable) return;
                if (e.key === "Enter" || e.key === " ") onTileClick?.(stat.key);
              }}
            >
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <p className="text-display text-card-foreground">{stat.value}</p>
              <p className="text-caption">{stat.label}</p>
            </motion.div>
          );
        }

        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 + i * 0.06 }}
            className={`${common} ${clickable ? "cursor-pointer" : ""}`}
            onClick={() => onTileClick?.(stat.key)}
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={(e) => {
              if (!clickable) return;
              if (e.key === "Enter" || e.key === " ") onTileClick?.(stat.key);
            }}
          >
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
            <p className="text-display text-card-foreground">{stat.value}</p>
            <p className="text-caption">{stat.label}</p>
            {stat.key === "picking" && (
              <p className="text-[10px] text-muted-foreground">
                피킹률(%) = 선택 절약액 / 최적(1순위) 절약액 × 100
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default BenefitStats;
