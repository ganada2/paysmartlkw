import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, Plus, Trash2, ChevronRight, CheckCircle2,
  TrendingUp, AlertCircle, ToggleLeft, ToggleRight,
} from "lucide-react";

interface CardData {
  id: string;
  name: string;
  issuer: string;
  last4: string;
  color: string;
  active: boolean;
  currentSpend: number;
  targetSpend: number;
  benefits: string[];
}

const initialCards: CardData[] = [
  {
    id: "1", name: "삼성카드 taptap O", issuer: "삼성카드", last4: "3421",
    color: "hsl(214, 93%, 58%)", active: true,
    currentSpend: 288000, targetSpend: 300000,
    benefits: ["스타벅스 10%", "편의점 5%", "대중교통 10%"],
  },
  {
    id: "2", name: "현대카드 M", issuer: "현대카드", last4: "7892",
    color: "hsl(0, 0%, 15%)", active: true,
    currentSpend: 450000, targetSpend: 500000,
    benefits: ["온라인쇼핑 3%", "영화 50%", "주유 리터당 80원"],
  },
  {
    id: "3", name: "KB국민 My WE:SH", issuer: "KB국민", last4: "5567",
    color: "hsl(38, 92%, 55%)", active: true,
    currentSpend: 180000, targetSpend: 300000,
    benefits: ["배달앱 7%", "마트 5%", "통신비 1만원 할인"],
  },
  {
    id: "4", name: "신한카드 Deep Dream", issuer: "신한카드", last4: "9034",
    color: "hsl(152, 60%, 45%)", active: true,
    currentSpend: 520000, targetSpend: 500000,
    benefits: ["해외결제 1.5%", "카페 10%", "OTT 구독 10%"],
  },
  {
    id: "5", name: "우리카드 카드의정석", issuer: "우리카드", last4: "1188",
    color: "hsl(280, 60%, 55%)", active: false,
    currentSpend: 50000, targetSpend: 300000,
    benefits: ["주유 리터당 60원", "학원비 5%"],
  },
];

const formatKRW = (n: number) => (n >= 10000 ? `${Math.floor(n / 10000)}만` : n.toLocaleString());

const Cards = () => {
  const [cards, setCards] = useState(initialCards);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleActive = (id: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    if (selectedCard === id) setSelectedCard(null);
  };

  const detail = cards.find((c) => c.id === selectedCard);
  const pct = detail ? Math.min((detail.currentSpend / detail.targetSpend) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-5">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between py-4 sticky top-0 bg-background z-10"
        >
          <h1 className="text-display text-foreground">카드 관리</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5 text-primary-foreground" />
          </button>
        </motion.header>

        {/* Active / Inactive Sections */}
        <div className="space-y-6">
          {/* Active Cards */}
          <div>
            <p className="text-caption mb-3">활성 카드 ({cards.filter((c) => c.active).length})</p>
            <div className="space-y-3">
              {cards.filter((c) => c.active).map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`toss-card cursor-pointer transition-all ${
                    selectedCard === card.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: card.color }}
                    >
                      <CreditCard className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-card-foreground truncate">{card.name}</p>
                      <p className="text-caption">•••• {card.last4}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleActive(card.id); }}
                        className="text-primary"
                      >
                        <ToggleRight className="w-6 h-6" />
                      </button>
                      <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${
                        selectedCard === card.id ? "rotate-90" : ""
                      }`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Inactive Cards */}
          {cards.filter((c) => !c.active).length > 0 && (
            <div>
              <p className="text-caption mb-3">비활성 카드 ({cards.filter((c) => !c.active).length})</p>
              <div className="space-y-3">
                {cards.filter((c) => !c.active).map((card) => (
                  <div key={card.id} className="toss-card opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground truncate">{card.name}</p>
                        <p className="text-caption">•••• {card.last4}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleActive(card.id)} className="text-muted-foreground">
                          <ToggleLeft className="w-6 h-6" />
                        </button>
                        <button onClick={() => removeCard(card.id)} className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {detail && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 overflow-hidden"
            >
              <div className="toss-card-elevated space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: detail.color }}>
                    <CreditCard className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-title text-card-foreground">{detail.name}</p>
                    <p className="text-caption">{detail.issuer} · •••• {detail.last4}</p>
                  </div>
                </div>

                {/* Performance Bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-card-foreground">전월 실적</span>
                    <span className={`text-xs font-medium ${pct >= 100 ? "text-success" : "text-muted-foreground"}`}>
                      {formatKRW(detail.currentSpend)} / {formatKRW(detail.targetSpend)}
                      {pct >= 100 && " ✓ 달성"}
                    </span>
                  </div>
                  <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: detail.color }}
                    />
                  </div>
                  {pct < 100 && (
                    <div className="flex items-center gap-1 mt-2">
                      <AlertCircle className="w-3.5 h-3.5 text-warning" />
                      <span className="text-xs text-warning font-medium">
                        실적 달성까지 ₩{(detail.targetSpend - detail.currentSpend).toLocaleString()} 남음
                      </span>
                    </div>
                  )}
                </div>

                {/* Benefits */}
                <div>
                  <p className="text-sm font-medium text-card-foreground mb-2">주요 혜택</p>
                  <div className="space-y-1.5">
                    {detail.benefits.map((b) => (
                      <div key={b} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => toggleActive(detail.id)}
                    className="flex-1 py-2.5 rounded-xl bg-secondary text-sm font-medium text-secondary-foreground hover:bg-muted transition-colors"
                  >
                    비활성화
                  </button>
                  <button
                    onClick={() => removeCard(detail.id)}
                    className="flex-1 py-2.5 rounded-xl bg-destructive/10 text-sm font-medium text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    카드 삭제
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 toss-card"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-title text-card-foreground">이번 달 요약</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-display text-card-foreground">{cards.filter((c) => c.active).length}</p>
              <p className="text-caption">활성 카드</p>
            </div>
            <div>
              <p className="text-display text-success">
                {cards.filter((c) => c.active && c.currentSpend >= c.targetSpend).length}
              </p>
              <p className="text-caption">실적 달성</p>
            </div>
            <div>
              <p className="text-display text-warning">
                {cards.filter((c) => c.active && c.currentSpend < c.targetSpend).length}
              </p>
              <p className="text-caption">실적 미달</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add Card Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-card rounded-t-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-border rounded-full mx-auto mb-6" />
              <h3 className="text-display text-card-foreground mb-2">카드 추가</h3>
              <p className="text-body text-muted-foreground mb-6">마이데이터를 통해 보유 카드를 자동으로 연결합니다.</p>
              <div className="space-y-3 mb-6">
                {["삼성카드", "현대카드", "KB국민카드", "신한카드", "우리카드", "롯데카드", "하나카드"].map((issuer) => (
                  <button
                    key={issuer}
                    className="w-full py-3.5 px-4 rounded-xl bg-secondary text-sm font-medium text-secondary-foreground text-left hover:bg-muted transition-colors flex items-center justify-between"
                  >
                    {issuer}
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-full py-3.5 rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                마이데이터 연결하기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cards;
