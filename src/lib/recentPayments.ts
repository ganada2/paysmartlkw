import { popularMerchants, simulateRouting, type CardOption } from "@/lib/simulation";

export type PickingRate = number;

export interface RecentPaymentItem {
  id: number;
  place: string; // 장소/가맹점(위치 포함)
  description: string; // 내역(무엇을 샀는지/결제 성격)
  amount: number; // 결제 금액
  timeLabel: string;

  // AI 라우팅 시각화
  virtualCardName: string; // 가상카드(기본/비최적 기준)
  virtualCardLast4: string;
  connectedCardName: string; // 연결카드(실제 선택 카드)
  connectedCardLast4: string;
  savedAmount: number; // 연결카드 vs 가상카드 절약액

  // AI 최적카드 효과(피킹률)
  pickingRate: PickingRate; // (선택 카드 예상 절약액 / 최적 카드 예상 절약액) * 100
}

const timeLabels = [
  "방금 전",
  "1분 전",
  "2분 전",
  "5분 전",
  "15분 전",
  "30분 전",
  "1시간 전",
  "2시간 전",
];

const merchantPlacePool = [
  // 카페
  "스타벅스 강남점",
  "스타벅스 역삼점",
  "스타벅스 여의도점",
  "이디야 신사점",
  "투썸플레이스 홍대점",

  // 온라인쇼핑
  "쿠팡 로켓배송",
  "네이버 스마트스토어",
  "무신사 입점몰",

  // 배달
  "배달의민족 강남역점",
  "요기요 잠실점",
  "배달의민족 홍대점",

  // 편의점
  "GS25 역삼점",
  "GS25 삼성점",
  "CU 서초점",
  "세븐일레븐 여의도점",

  // 주유
  "SK주유소 잠실점",
  "SK주유소 종로점",
  "GS칼텍스 마포점",

  // 영화
  "CGV 강남",
  "메가박스 신촌",
  "CGV 홍대",
];

const descriptionPoolByCategory: Record<string, string[]> = {
  카페: ["아메리카노", "라떼", "디저트", "커피+샌드위치"],
  온라인쇼핑: ["생활용품 구매", "전자제품 결제", "배송비 포함 주문", "온라인 구독/소모품"],
  배달: ["치킨", "피자", "중식", "도시락/한식"],
  편의점: ["편의점 도시락", "생수/음료", "간식", "마트형 간편식"],
  주유: ["셀프 주유", "주유 결제", "주유 리터", "세차/부대결제"],
  영화: ["영화 관람", "영화 예매", "팝콘/음료 포함", "상영권 결제"],
  일반: ["결제", "구매", "서비스 이용"],
};

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const computePickingRate = (best: CardOption, picked: CardOption) => {
  if (best.saving <= 0) return 100;
  const r = Math.round((picked.saving / best.saving) * 100);
  return Math.max(1, Math.min(100, r));
};

const getCategory = (simCategory: string) => {
  // simulation.ts의 category가 "카페"처럼 매핑되어 들어온다고 가정
  return simCategory in descriptionPoolByCategory ? simCategory : "일반";
};

export const DEFAULT_AI_OPTIMIZATION_RATE = 0.94;

export function generateRecentPaymentItem(args?: {
  aiOptimizationRate?: number;
  avoidPlace?: string | null;
}): RecentPaymentItem {
  const aiOptimizationRate = args?.aiOptimizationRate ?? DEFAULT_AI_OPTIMIZATION_RATE;

  // merchantCategories 매핑을 위해 full place 문자열을 그대로 simulateRouting에 넘김
  const place = pick(merchantPlacePool);
  if (args?.avoidPlace && place === args.avoidPlace) {
    return generateRecentPaymentItem({ ...args, avoidPlace: null });
  }

  const amountPool = [2900, 3200, 3900, 4500, 5000, 5500, 7300, 9800, 12000, 18500, 22000, 28000, 32000, 45000];
  const amount = pick(amountPool);

  const sim = simulateRouting(place, amount);
  const category = getCategory(sim.category);

  const best = sim.cards[0];
  const worst = sim.cards[sim.cards.length - 1];

  const picked =
    Math.random() < aiOptimizationRate
      ? best
      : // 비최적일 경우 top 3 중 랜덤(피킹률이 100%가 되지 않게)
        pick(sim.cards.slice(1, 3).length ? sim.cards.slice(1, 3) : sim.cards.slice(1));

  const pickingRate = computePickingRate(best, picked);
  const savedAmount = Math.max(0, picked.saving - worst.saving);

  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    place,
    description: pick(descriptionPoolByCategory[category] ?? descriptionPoolByCategory["일반"]),
    amount,
    timeLabel: pick(timeLabels),
    virtualCardName: worst.name,
    virtualCardLast4: worst.last4,
    connectedCardName: picked.name,
    connectedCardLast4: picked.last4,
    savedAmount,
    pickingRate,
  };
}

