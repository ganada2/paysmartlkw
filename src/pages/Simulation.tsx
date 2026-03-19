import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, ArrowRight, CreditCard, CheckCircle2, TrendingUp,
  Search, ChevronDown, Sparkles
} from "lucide-react";

interface CardOption {
  name: string;
  last4: string;
  benefit: string;
  saving: number;
  reason: string;
  color: string;
  recommended: boolean;
}

interface SimResult {
  merchant: string;
  amount: number;
  category: string;
  cards: CardOption[];
}

const merchantCategories: Record<string, string> = {
  "스타벅스": "카페", "이디야": "카페", "투썸플레이스": "카페",
  "쿠팡": "온라인쇼핑", "네이버": "온라인쇼핑", "무신사": "온라인쇼핑",
  "배달의민족": "배달", "요기요": "배달",
  "GS25": "편의점", "CU": "편의점", "세븐일레븐": "편의점",
  "SK주유소": "주유", "GS칼텍스": "주유",
  "CGV": "영화", "메가박스": "영화",
};

const popularMerchants = ["스타벅스", "쿠팡", "배달의민족", "GS25", "SK주유소", "CGV"];

const simulateRouting = (merchant: string, amount: number): SimResult => {
  const category = merchantCategories[merchant] || "일반";

  const cardPool: CardOption[] = [
    {
      name: "삼성카드 taptap O", last4: "3421",
      benefit: category === "편의점" ? "편의점 5% 할인" : category === "카페" ? "카페 10% 할인" : "일반 1% 적립",
      saving: category === "편의점" ? Math.round(amount * 0.05) : category === "카페" ? Math.round(amount * 0.1) : Math.round(amount * 0.01),
      reason: category === "편의점" ? "편의점 카테고리 최고 혜택" : category === "카페" ? "카페 전용 할인 적용" : "기본 적립",
      color: "hsl(214, 93%, 58%)", recommended: false,
    },
    {
      name: "현대카드 M", last4: "7892",
      benefit: category === "온라인쇼핑" ? "온라인 3% M포인트" : category === "영화" ? "영화 50% 할인" : "M포인트 0.7% 적립",
      saving: category === "온라인쇼핑" ? Math.round(amount * 0.03) : category === "영화" ? Math.round(amount * 0.5) : Math.round(amount * 0.007),
      reason: category === "온라인쇼핑" ? "온라인 M포인트 적립 최적" : category === "영화" ? "영화관 반값 혜택" : "기본 M포인트",
      color: "hsl(0, 0%, 15%)", recommended: false,
    },
    {
      name: "KB국민 My WE:SH", last4: "5567",
      benefit: category === "배달" ? "배달앱 7% 할인" : category === "주유" ? "리터당 80원 할인" : "생활 2% 적립",
      saving: category === "배달" ? Math.round(amount * 0.07) : category === "주유" ? Math.round(amount * 0.04) : Math.round(amount * 0.02),
      reason: category === "배달" ? "배달앱 최대 할인율" : category === "주유" ? "주유 리터당 할인 최고" : "생활비 적립",
      color: "hsl(38, 92%, 55%)", recommended: false,
    },
    {
      name: "신한카드 Deep Dream", last4: "9034",
      benefit: category === "카페" ? "카페 15% 할인" : "Dream 포인트 1.5% 적립",
      saving: category === "카페" ? Math.round(amount * 0.15) : Math.round(amount * 0.015),
      reason: category === "카페" ? "카페 카테고리 최강 혜택" : "높은 기본 적립률",
      color: "hsl(152, 60%, 45%)", recommended: false,
    },
  ];

  cardPool.sort((a, b) => b.saving - a.saving);
  cardPool[0].recommended = true;

  return { merchant, amount, category, cards: cardPool };
};

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
