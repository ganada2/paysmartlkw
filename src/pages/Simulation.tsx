import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, ArrowRight, CreditCard, CheckCircle2, TrendingUp,
  Search, ChevronDown, Sparkles
} from "lucide-react";

import { popularMerchants, simulateRouting, type SimResult } from "@/lib/simulation";

const Simulation = () => {
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<SimResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMerchants, setShowMerchants] = useState(false);

  const runSimulation = () => {
    if (!merchant || !amount) return;
    setIsProcessing(true);
    setResult(null);
    setTimeout(() => {
      setResult(simulateRouting(merchant, parseInt(amount)));
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-5">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-4 sticky top-0 bg-background z-10"
        >
          <h1 className="text-display text-foreground">라우팅 시뮬레이션</h1>
          <p className="text-caption mt-1">결제 전 최적의 카드를 미리 확인해보세요</p>
        </motion.header>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="toss-card-elevated space-y-4 mb-6"
        >
          {/* Merchant Input */}
          <div>
            <label className="text-sm font-medium text-card-foreground mb-1.5 block">가맹점</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                onFocus={() => setShowMerchants(true)}
                placeholder="가맹점명을 입력하세요"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <button
                onClick={() => setShowMerchants(!showMerchants)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showMerchants ? "rotate-180" : ""}`} />
              </button>
            </div>
            <AnimatePresence>
              {showMerchants && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2">
                    {popularMerchants.map((m) => (
                      <button
                        key={m}
                        onClick={() => { setMerchant(m); setShowMerchants(false); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          merchant === m
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Amount Input */}
          <div>
            <label className="text-sm font-medium text-card-foreground mb-1.5 block">결제 금액</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₩</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="금액을 입력하세요"
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {["5,000", "10,000", "30,000", "50,000"].map((v) => (
                <button
                  key={v}
                  onClick={() => setAmount(v.replace(/,/g, ""))}
                  className="flex-1 py-1.5 rounded-lg bg-secondary text-xs text-muted-foreground hover:bg-muted transition-colors"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Run Button */}
          <button
            onClick={runSimulation}
            disabled={!merchant || !amount || isProcessing}
            className="w-full py-3.5 rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                AI 분석 중...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" /> 최적 카드 분석
              </>
            )}
          </button>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4"
            >
              {/* Result Header */}
              <div className="toss-card">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-card-foreground">분석 결과</span>
                </div>
                <p className="text-caption">
                  {result.merchant} · {result.category} · ₩{result.amount.toLocaleString()}
                </p>
              </div>

              {/* Card Rankings */}
              {result.cards.map((card, i) => (
                <motion.div
                  key={card.last4}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className={`toss-card transition-all ${
                    card.recommended ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-xs font-bold ${
                        i === 0 ? "text-primary" : "text-muted-foreground"
                      }`}>{i + 1}순위</span>
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: card.color }}
                      >
                        <CreditCard className="w-5 h-5 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-card-foreground">{card.name}</p>
                        {card.recommended && (
                          <span className="px-1.5 py-0.5 bg-accent text-accent-foreground text-[10px] font-semibold rounded-md">
                            최적
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{card.benefit}</p>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-success" />
                        <span className="text-xs text-muted-foreground">{card.reason}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-success">-₩{card.saving.toLocaleString()}</p>
                      <p className="text-caption">{((card.saving / result.amount) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Comparison */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="toss-card bg-accent/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-accent-foreground" />
                  <span className="text-sm font-semibold text-accent-foreground">절약 비교</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption">최적 vs 최악</p>
                    <p className="text-lg font-bold text-accent-foreground">
                      ₩{(result.cards[0].saving - result.cards[result.cards.length - 1].saving).toLocaleString()} 차이
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-accent-foreground">
                    {result.cards[result.cards.length - 1].name.split(" ")[0]}
                    <ArrowRight className="w-3 h-3" />
                    {result.cards[0].name.split(" ")[0]}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Simulation;
