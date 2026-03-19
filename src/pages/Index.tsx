import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { Bell, Settings } from "lucide-react";
import ProxyCard from "@/components/ProxyCard";
import BenefitStats from "@/components/BenefitStats";
import CardPerformanceSection from "@/components/CardPerformanceSection";
import RoutingHistory from "@/components/RoutingHistory";
import NudgeAlerts from "@/components/NudgeAlerts";
import type { RecentPaymentItem } from "@/lib/recentPayments";

const Index = () => {
  const [showNudges, setShowNudges] = useState(false);
  const [recentPayments, setRecentPayments] = useState<RecentPaymentItem[]>([]);
  const [benefitModalKey, setBenefitModalKey] = useState<"savings" | "picking" | "routing" | null>(null);

  const summary = useMemo(() => {
    const totalSaved = recentPayments.reduce((sum, item) => sum + item.savedAmount, 0);
    const avgPickingRate =
      recentPayments.length === 0
        ? 0
        : Math.round(recentPayments.reduce((sum, item) => sum + item.pickingRate, 0) / recentPayments.length);
    const connectedCardCount = new Set(recentPayments.map((i) => i.connectedCardName)).size;
    const routingCount = recentPayments.length;
    return { totalSaved, avgPickingRate, connectedCardCount, routingCount };
  }, [recentPayments]);

  const groupedByCard = useMemo(() => {
    const map = new Map<
      string,
      { cardName: string; pickingRateAvg: number; items: RecentPaymentItem[] }
    >();

    for (const item of recentPayments) {
      const key = item.connectedCardName;
      const entry = map.get(key);
      if (!entry) {
        map.set(key, { cardName: key, pickingRateAvg: item.pickingRate, items: [item] });
      } else {
        entry.items.push(item);
        entry.pickingRateAvg = Math.round(
          entry.items.reduce((s, it) => s + it.pickingRate, 0) / entry.items.length
        );
      }
    }

    return Array.from(map.values()).sort((a, b) => b.items.length - a.items.length);
  }, [recentPayments]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-5 pb-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between py-4 sticky top-0 bg-background z-10"
        >
          <div className="flex items-center gap-3">
            <ProxyCard variant="header" />
            <div>
              <p className="text-caption">안녕하세요, 이경원님 👋</p>
              <h1 className="text-title text-foreground">Smart Pay</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowNudges((v) => !v)}
                className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-secondary transition-colors"
                style={{ boxShadow: "var(--shadow-card)" }}
                aria-expanded={showNudges}
                aria-label="알림 열기"
              >
              <Bell className="w-5 h-5 text-muted-foreground" />
              </button>

              <AnimatePresence>
                {showNudges && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-12 z-50 w-[320px] max-w-[calc(100vw-32px)]"
                  >
                    <div
                      className="bg-card border border-border rounded-2xl shadow-lg p-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <NudgeAlerts variant="compact" />
                      <div className="pt-2 flex justify-end">
                        <button
                          className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowNudges(false)}
                        >
                          닫기
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-secondary transition-colors" style={{ boxShadow: "var(--shadow-card)" }}>
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </motion.header>

        {/* Content */}
        <div className="space-y-6">
          <BenefitStats
            totalSaved={summary.totalSaved}
            avgPickingRate={summary.avgPickingRate}
            connectedCardCount={summary.connectedCardCount}
            routingCount={summary.routingCount}
            onTileClick={(key) => setBenefitModalKey(key)}
          />
          <RoutingHistory onItemsChange={setRecentPayments} />
          <CardPerformanceSection />
        </div>
      </div>

      <AnimatePresence>
        {benefitModalKey && (
          <motion.div
            className="fixed inset-0 z-[60] bg-foreground/40 flex items-end justify-center sm:items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBenefitModalKey(null)}
          >
            <motion.div
              className="w-full max-w-md bg-card rounded-3xl shadow-lg overflow-hidden"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-card-foreground">
                    {benefitModalKey === "savings"
                      ? "절약 금액 상세"
                      : benefitModalKey === "picking"
                        ? "AI 최적카드 피킹률 상세"
                        : "연결 카드 라우팅 상세"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    피킹률(%) = 선택 카드 예상 절약액 / 최적(1순위) 카드 예상 절약액 × 100
                  </p>
                </div>
                <button
                  className="w-9 h-9 rounded-full hover:bg-muted transition-colors"
                  onClick={() => setBenefitModalKey(null)}
                  aria-label="닫기"
                >
                  ×
                </button>
              </div>

              <div className="p-4 space-y-4 max-h-[60vh] overflow-auto">
                {groupedByCard.length === 0 ? (
                  <div className="text-caption text-muted-foreground">표시할 결제내역이 없어요.</div>
                ) : (
                  groupedByCard.map((group) => (
                    <div key={group.cardName} className="toss-card-elevated p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-card-foreground truncate">{group.cardName}</p>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            카드별 평균 피킹률: <span className="text-primary font-semibold">{group.pickingRateAvg}%</span>
                          </p>
                        </div>
                        <div className="text-right text-[11px] text-muted-foreground flex-shrink-0">
                          {group.items.length}건
                        </div>
                      </div>

                      <div className="space-y-2">
                        {group.items.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start justify-between gap-3 border-b border-border pb-2 last:border-b-0"
                          >
                            <div className="min-w-0">
                              <p className="text-[11px] text-muted-foreground truncate">{item.timeLabel} · {item.place}</p>
                              <p className="text-sm font-medium text-card-foreground truncate mt-1">{item.description}</p>
                              <p className="text-[11px] text-muted-foreground mt-1">
                                가상 → 연결:{" "}
                                <span className="font-medium text-card-foreground">
                                  {item.virtualCardName.split(" ")[0]} · {item.virtualCardLast4}
                                </span>{" "}
                                →{" "}
                                <span className="font-medium text-success">
                                  {item.connectedCardName.split(" ")[0]} · {item.connectedCardLast4}
                                </span>
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-bold text-success">-₩{item.savedAmount.toLocaleString()}</p>
                              <p className="text-[11px] text-primary font-semibold mt-1">{item.pickingRate}%</p>
                              <p className="text-[11px] text-muted-foreground mt-1">결제 {item.amount.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
