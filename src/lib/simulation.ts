export type SimCategory = string;

export interface CardOption {
  name: string;
  last4: string;
  benefit: string;
  saving: number;
  reason: string;
  color: string;
  recommended: boolean;
}

export interface SimResult {
  merchant: string;
  amount: number;
  category: SimCategory;
  cards: CardOption[];
}

export const merchantCategories: Record<string, string> = {
  "스타벅스": "카페",
  "이디야": "카페",
  "투썸플레이스": "카페",
  "쿠팡": "온라인쇼핑",
  "네이버": "온라인쇼핑",
  "무신사": "온라인쇼핑",
  "배달의민족": "배달",
  "요기요": "배달",
  "GS25": "편의점",
  "CU": "편의점",
  "세븐일레븐": "편의점",
  "SK주유소": "주유",
  "GS칼텍스": "주유",
  "CGV": "영화",
  "메가박스": "영화",
};

export const popularMerchants = ["스타벅스", "쿠팡", "배달의민족", "GS25", "SK주유소", "CGV"] as const;

const normalizeMerchantKey = (merchant: string) => {
  // "스타벅스 강남점"처럼 접두/접미가 붙어도 매핑되게 앞부분 일부만 사용
  // (요구사항에 맞춘 간단한 휴리스틱)
  const keys = Object.keys(merchantCategories);
  return keys.find((k) => merchant.includes(k)) ?? merchant;
};

const getCategory = (merchant: string) => {
  const normalized = normalizeMerchantKey(merchant);
  return merchantCategories[normalized] ?? "일반";
};

export function simulateRouting(merchant: string, amount: number): SimResult {
  const category = getCategory(merchant);

  const cardPool: CardOption[] = [
    {
      name: "삼성카드 taptap O",
      last4: "3421",
      benefit: category === "편의점" ? "편의점 5% 할인" : category === "카페" ? "카페 10% 할인" : "일반 1% 적립",
      saving: category === "편의점" ? Math.round(amount * 0.05) : category === "카페" ? Math.round(amount * 0.1) : Math.round(amount * 0.01),
      reason: category === "편의점" ? "편의점 카테고리 최고 혜택" : category === "카페" ? "카페 전용 할인 적용" : "기본 적립",
      color: "hsl(214, 93%, 58%)",
      recommended: false,
    },
    {
      name: "현대카드 M",
      last4: "7892",
      benefit: category === "온라인쇼핑" ? "온라인 3% M포인트" : category === "영화" ? "영화 50% 할인" : "M포인트 0.7% 적립",
      saving: category === "온라인쇼핑" ? Math.round(amount * 0.03) : category === "영화" ? Math.round(amount * 0.5) : Math.round(amount * 0.007),
      reason: category === "온라인쇼핑" ? "온라인 M포인트 적립 최적" : category === "영화" ? "영화관 반값 혜택" : "기본 M포인트",
      color: "hsl(0, 0%, 15%)",
      recommended: false,
    },
    {
      name: "KB국민 My WE:SH",
      last4: "5567",
      benefit: category === "배달" ? "배달앱 7% 할인" : category === "주유" ? "리터당 80원 할인" : "생활 2% 적립",
      saving: category === "배달" ? Math.round(amount * 0.07) : category === "주유" ? Math.round(amount * 0.04) : Math.round(amount * 0.02),
      reason: category === "배달" ? "배달앱 최대 할인율" : category === "주유" ? "주유 리터당 할인 최고" : "생활비 적립",
      color: "hsl(38, 92%, 55%)",
      recommended: false,
    },
    {
      name: "신한카드 Deep Dream",
      last4: "9034",
      benefit: category === "카페" ? "카페 15% 할인" : "Dream 포인트 1.5% 적립",
      saving: category === "카페" ? Math.round(amount * 0.15) : Math.round(amount * 0.015),
      reason: category === "카페" ? "카페 카테고리 최강 혜택" : "높은 기본 적립률",
      color: "hsl(152, 60%, 45%)",
      recommended: false,
    },
  ];

  cardPool.sort((a, b) => b.saving - a.saving);
  cardPool[0].recommended = true;

  return { merchant, amount, category, cards: cardPool };
}

