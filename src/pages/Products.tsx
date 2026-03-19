import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Sparkles, TrendingUp, Star, ChevronRight,
  Coffee, ShoppingCart, Fuel, Utensils, Monitor, Bus, Heart
} from "lucide-react";

interface VirtualProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ElementType;
  matchScore: number;
  monthlySaving: string;
  benefits: string[];
  recommended: boolean;
  color: string;
}

const products: VirtualProduct[] = [
  {
    id: "1", name: "카페 마스터 플랜", description: "월 평균 ₩45,000 카페 지출 기반",
    category: "카페/디저트", icon: Coffee, matchScore: 97,
    monthlySaving: "₩6,750", benefits: ["스타벅스 15%", "투썸 10%", "이디야 20%"],
    recommended: true, color: "hsl(25, 80%, 55%)",
  },
  {
    id: "2", name: "온라인 쇼핑 번들", description: "월 평균 ₩180,000 온라인 결제 기반",
    category: "온라인쇼핑", icon: ShoppingCart, matchScore: 94,
    monthlySaving: "₩9,000", benefits: ["쿠팡 5%", "네이버페이 3%", "무신사 7%"],
    recommended: true, color: "hsl(214, 93%, 58%)",
  },
  {
    id: "3", name: "주유 절약 패키지", description: "월 평균 ₩120,000 주유 지출 기반",
    category: "주유", icon: Fuel, matchScore: 89,
    monthlySaving: "₩4,800", benefits: ["SK주유 리터당 100원", "GS주유 80원"],
    recommended: false, color: "hsl(152, 60%, 45%)",
  },
  {
    id: "4", name: "배달/외식 올인원", description: "월 평균 ₩95,000 외식비 기반",
    category: "외식/배달", icon: Utensils, matchScore: 91,
    monthlySaving: "₩7,600", benefits: ["배민 8%", "요기요 5%", "일반음식점 3%"],
    recommended: true, color: "hsl(0, 72%, 55%)",
  },
  {
    id: "5", name: "디지털 구독 패키지", description: "월 ₩35,000 OTT/구독 지출 기반",
    category: "구독/OTT", icon: Monitor, matchScore: 85,
    monthlySaving: "₩3,500", benefits: ["넷플릭스 10%", "유튜브 프리미엄 5%"],
    recommended: false, color: "hsl(280, 60%, 55%)",
  },
  {
    id: "6", name: "통근 최적화 플랜", description: "월 ₩65,000 교통비 기반",
    category: "교통", icon: Bus, matchScore: 82,
    monthlySaving: "₩3,900", benefits: ["대중교통 10%", "택시 5%", "주차비 3%"],
    recommended: false, color: "hsl(200, 70%, 50%)",
  },
];

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [activeProducts, setActiveProducts] = useState<string[]>(["1", "2"]);
  const [filter, setFilter] = useState<"all" | "recommended" | "active">("all");

  const toggleProduct = (id: string) => {
    setActiveProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const filtered = products.filter((p) => {
    if (filter === "recommended") return p.recommended;
    if (filter === "active") return activeProducts.includes(p.id);
    return true;
  });

  const totalSaving = products
    .filter((p) => activeProducts.includes(p.id))
    .reduce((sum, p) => sum + parseInt(p.monthlySaving.replace(/[^0-9]/g, "")), 0);

  const detail = products.find((p) => p.id === selectedProduct);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-5">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-4 sticky top-0 bg-background z-10"
        >
          <h1 className="text-display text-foreground">AI 맞춤 상품</h1>
          <p className="text-caption mt-1">결제 내역을 분석하여 최적의 가상 상품을 추천합니다</p>
        </motion.header>

        {/* Savings Summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="toss-card-elevated mb-6"
          style={{
            background: "linear-gradient(135deg, hsl(214, 93%, 58%), hsl(230, 80%, 55%))",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground opacity-90">활성 상품 예상 절약액</span>
          </div>
          <p className="text-3xl font-bold text-primary-foreground tracking-tight">
            월 ₩{totalSaving.toLocaleString()}
          </p>
          <p className="text-xs text-primary-foreground opacity-60 mt-1">
            {activeProducts.length}개 상품 적용 중
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {([
            { key: "all", label: "전체" },
            { key: "recommended", label: "AI 추천" },
            { key: "active", label: "적용 중" },
          ] as const).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Product List */}
        <div className="space-y-3">
          {filtered.map((product, i) => {
            const isActive = activeProducts.includes(product.id);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                className={`toss-card cursor-pointer transition-all ${
                  selectedProduct === product.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedProduct(selectedProduct === product.id ? null : product.id)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: product.color + "18" }}
                  >
                    <product.icon className="w-5 h-5" style={{ color: product.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-card-foreground truncate">{product.name}</p>
                      {product.recommended && (
                        <span className="px-1.5 py-0.5 bg-accent text-accent-foreground text-[10px] font-semibold rounded-md flex-shrink-0">
                          AI 추천
                        </span>
                      )}
                    </div>
                    <p className="text-caption">{product.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-semibold text-success">월 {product.monthlySaving} 절약</span>
                      <span className="text-caption flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-warning" /> 적합도 {product.matchScore}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleProduct(product.id); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-muted"
                      }`}
                    >
                      {isActive ? "적용 중" : "적용"}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {detail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40"
              onClick={() => setSelectedProduct(null)}
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
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: detail.color + "18" }}
                  >
                    <detail.icon className="w-7 h-7" style={{ color: detail.color }} />
                  </div>
                  <div>
                    <h3 className="text-display text-card-foreground">{detail.name}</h3>
                    <p className="text-caption">{detail.category}</p>
                  </div>
                </div>

                <div className="toss-card bg-secondary mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-caption">예상 월 절약</p>
                      <p className="text-xl font-bold text-success">{detail.monthlySaving}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-caption">적합도</p>
                      <p className="text-xl font-bold text-card-foreground">{detail.matchScore}%</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm font-medium text-card-foreground mb-2">포함 혜택</p>
                <div className="space-y-2 mb-6">
                  {detail.benefits.map((b) => (
                    <div key={b} className="flex items-center gap-2 py-2 px-3 bg-secondary rounded-xl">
                      <Heart className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="text-sm text-card-foreground">{b}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    toggleProduct(detail.id);
                    setSelectedProduct(null);
                  }}
                  className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all ${
                    activeProducts.includes(detail.id)
                      ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  }`}
                >
                  {activeProducts.includes(detail.id) ? "상품 해제" : "상품 적용하기"}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Products;
