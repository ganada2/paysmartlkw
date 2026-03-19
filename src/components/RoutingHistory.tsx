import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { RecentPaymentItem } from "@/lib/recentPayments";
import { generateRecentPaymentItem } from "@/lib/recentPayments";

const formatKRW = (n: number) => `₩${n.toLocaleString()}`;

const maxRecentItems = 5;

type RoutingHistoryProps = {
  onItemsChange?: (items: RecentPaymentItem[]) => void;
};

const RoutingHistory = ({ onItemsChange }: RoutingHistoryProps) => {
  const [routingHistory, setRoutingHistory] = useState<RecentPaymentItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const isRefreshingRef = useRef(true);
  const routingHistoryRef = useRef<RecentPaymentItem[]>([]);

  const refresh = () => {
    setIsRefreshing(true);
    isRefreshingRef.current = true;
    setTimeout(() => {
      setRoutingHistory(
        new Array(maxRecentItems).fill(0).map(() => generateRecentPaymentItem({ aiOptimizationRate: 0.94 }))
      );
      setIsRefreshing(false);
      isRefreshingRef.current = false;
    }, 650);
  };

  useEffect(() => {
    // 초기 seed
    refresh();

    // 1~3초에 1건씩만 계속 생성 (너무 정신 사납지 않게)
    let timer: number | undefined;
    const scheduleNext = () => {
      const delayMs = 1000 + Math.floor(Math.random() * 2000); // 1~3초
      timer = window.setTimeout(() => {
        if (!isRefreshingRef.current) {
          const avoidPlace = routingHistoryRef.current[0]?.place ?? null;
          const newItem = generateRecentPaymentItem({
            aiOptimizationRate: 0.94,
            avoidPlace,
          });
          setRoutingHistory((prev) => [newItem, ...prev].slice(0, maxRecentItems));
        }
        scheduleNext();
      }, delayMs);
    };

    scheduleNext();

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    onItemsChange?.(routingHistory);
  }, [routingHistory, onItemsChange]);

  useEffect(() => {
    routingHistoryRef.current = routingHistory;
  }, [routingHistory]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="toss-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-title text-card-foreground">최근 결제내역</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            disabled={isRefreshing}
            className="text-caption flex items-center gap-1 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="결제 내역 초기화"
          >
            <RotateCcw className="w-3 h-3" />
            초기화
          </button>
          <button className="text-caption flex items-center gap-1 hover:text-foreground transition-colors">
            전체보기 <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="space-y-0">
        {isRefreshing ? (
          <div className="space-y-0">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-3.5 border-b border-border last:border-b-0"
              >
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <Skeleton className="w-4 h-4 rounded-full bg-accent-foreground/20" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <Skeleton className="w-[60%] h-4" />
                    <Skeleton className="w-[25%] h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="w-[55%] h-3" />
                    <Skeleton className="w-[20%] h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {routingHistory.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25, delay: i * 0.01 }}
                className="flex items-center gap-3 py-3.5 border-b border-border last:border-b-0"
              >
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-medium text-card-foreground truncate">{item.place}</p>
                    <div className="flex items-baseline gap-2 flex-shrink-0">
                      <p className="text-sm font-semibold text-card-foreground">{formatKRW(item.amount)}</p>
                      <p className="text-[10px] text-muted-foreground">{item.timeLabel}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-caption truncate">{item.description}</p>
                      <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-2 min-w-0">
                        <span className="px-2 py-0.5 bg-accent text-accent-foreground text-[10px] font-semibold rounded-md flex-shrink-0">
                          AI 라우팅
                        </span>
                        <span className="truncate">
                          {item.virtualCardName.split(" ")[0]} · {item.virtualCardLast4} →
                          {" "}
                          {item.connectedCardName.split(" ")[0]} · {item.connectedCardLast4}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-success flex-shrink-0">
                      -₩{item.savedAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default RoutingHistory;
