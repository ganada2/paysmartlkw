import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface RoutingItem {
  id: number;
  merchant: string;
  amount: string;
  fromCard: string;
  toCard: string;
  savedAmount: string;
  time: string;
}

const routingHistory: RoutingItem[] = [
  { id: 1, merchant: "스타벅스 강남점", amount: "₩5,500", fromCard: "삼성카드", toCard: "현대카드", savedAmount: "₩550", time: "2분 전" },
  { id: 2, merchant: "쿠팡", amount: "₩32,000", fromCard: "신한카드", toCard: "KB국민", savedAmount: "₩1,600", time: "15분 전" },
  { id: 3, merchant: "GS25 역삼점", amount: "₩3,200", fromCard: "우리카드", toCard: "삼성카드", savedAmount: "₩320", time: "1시간 전" },
  { id: 4, merchant: "배달의민족", amount: "₩18,500", fromCard: "KB국민", toCard: "신한카드", savedAmount: "₩925", time: "2시간 전" },
];

const RoutingHistory = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="toss-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-title text-card-foreground">최근 라우팅</h3>
        <button className="text-caption flex items-center gap-1 hover:text-foreground transition-colors">
          전체보기 <ArrowRight className="w-3 h-3" />
        </button>
      </div>
      <div className="space-y-0">
        {routingHistory.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 + i * 0.08 }}
            className="flex items-center gap-3 py-3.5 border-b border-border last:border-b-0"
          >
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 text-accent-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-sm font-medium text-card-foreground truncate">{item.merchant}</p>
                <p className="text-sm font-semibold text-card-foreground ml-2">{item.amount}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-caption flex items-center gap-1">
                  {item.fromCard} <ArrowRight className="w-3 h-3" /> {item.toCard}
                </p>
                <p className="text-xs font-medium text-success">-{item.savedAmount}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RoutingHistory;
