import { motion } from "framer-motion";

interface CardPerformance {
  name: string;
  current: number;
  target: number;
  color: string;
}

const cards: CardPerformance[] = [
  { name: "삼성카드", current: 288000, target: 300000, color: "hsl(214, 93%, 58%)" },
  { name: "현대카드", current: 450000, target: 500000, color: "hsl(152, 60%, 45%)" },
  { name: "KB국민카드", current: 180000, target: 300000, color: "hsl(38, 92%, 55%)" },
  { name: "신한카드", current: 520000, target: 500000, color: "hsl(280, 60%, 55%)" },
];

const formatKRW = (n: number) => {
  if (n >= 10000) return `${Math.floor(n / 10000)}만`;
  return `${n.toLocaleString()}`;
};

const CardPerformanceSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="toss-card"
    >
      <h3 className="text-title text-card-foreground mb-4">카드별 실적 현황</h3>
      <div className="space-y-4">
        {cards.map((card, i) => {
          const pct = Math.min((card.current / card.target) * 100, 100);
          const achieved = card.current >= card.target;
          return (
            <motion.div
              key={card.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-card-foreground">{card.name}</span>
                <span className={`text-xs font-medium ${achieved ? "text-success" : "text-muted-foreground"}`}>
                  {formatKRW(card.current)} / {formatKRW(card.target)}
                  {achieved && " ✓"}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.6 + i * 0.1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: card.color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CardPerformanceSection;
