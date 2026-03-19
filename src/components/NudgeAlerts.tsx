import { motion } from "framer-motion";
import { AlertCircle, ArrowRight } from "lucide-react";

const nudges = [
  {
    type: "실적 알림" as const,
    message: "삼성카드 전월 실적까지 ₩12,000 남았어요",
    action: "실적 채우기",
    urgent: true,
  },
  {
    type: "혜택 제안" as const,
    message: "이번 주 편의점 결제는 KB국민카드가 10% 할인",
    action: "자세히 보기",
    urgent: false,
  },
];

type NudgeVariant = "full" | "compact";

const NudgeAlerts = ({ variant = "full" }: { variant?: NudgeVariant }) => {
  const isCompact = variant === "compact";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: isCompact ? 0.1 : 0.7 }}
      className={isCompact ? "space-y-2" : "space-y-3"}
    >
      {!isCompact && <h3 className="text-title text-foreground">AI 넛지</h3>}
      {nudges.map((nudge, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: isCompact ? 0.15 + i * 0.05 : 0.8 + i * 0.1 }}
          className={`toss-card flex items-start gap-3 cursor-pointer hover:scale-[1.01] transition-transform ${
            nudge.urgent ? "ring-1 ring-warning/30" : ""
          } ${isCompact ? "p-3 gap-2" : ""}`}
        >
          <div className={`${
              isCompact ? "w-7 h-7" : "w-8 h-8"
            } rounded-full flex items-center justify-center flex-shrink-0 ${
            nudge.urgent ? "bg-warning/10" : "bg-accent"
          }`}>
            <AlertCircle
              className={`${
                isCompact ? "w-3.5 h-3.5" : "w-4 h-4"
              } ${nudge.urgent ? "text-warning" : "text-accent-foreground"}`}
            />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-medium text-muted-foreground mb-0.5">{nudge.type}</p>
            <p className="text-sm text-card-foreground leading-snug">{nudge.message}</p>
            <button className={`text-xs font-medium text-primary flex items-center gap-0.5 transition-all ${isCompact ? "mt-1" : "mt-1.5"}`}>
              {nudge.action} {!isCompact && <ArrowRight className="w-3 h-3" />}
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default NudgeAlerts;
