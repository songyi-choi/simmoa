import type { Fortune, Rarity, TimeOfDay } from "./types";

export interface ListFortune extends Fortune {
  id: string;
  rarity: Rarity;
  /** 비어 있으면 아무 시간대에나 나온다 */
  time?: TimeOfDay;
}

/** AI를 쓸 수 없을 때 쓰는 미리 써둔 운세 */
export const FORTUNES: ListFortune[] = [
  // 갓 구운 쿠키 (common)
  { id: "c01", rarity: "common", title: "작은 매듭", message: "오늘 끝낸 일 하나가 내일의 일 세 개를 가볍게 만들어요.", luckyItem: "따뜻한 차 한 잔" },
  { id: "c02", rarity: "common", title: "느린 오븐", message: "천천히 익은 쿠키가 더 바삭해요. 서두르지 않아도 충분히 잘하고 있어요.", luckyItem: "타이머" },
  { id: "c03", rarity: "common", title: "정리의 운", message: "책상 위 한 뼘을 비우면 생각에도 한 뼘의 여유가 생겨요.", luckyItem: "물티슈" },
  { id: "c04", rarity: "common", title: "반가운 연락", message: "오래 연락 못 한 사람에게서 좋은 소식이 들려올 거예요.", luckyItem: "노란색 메모지" },
  { id: "c05", rarity: "common", title: "맛있는 휴식", message: "방금의 집중은 달콤한 간식을 먹을 자격이 충분해요.", luckyItem: "초콜릿 한 조각" },
  { id: "c06", rarity: "common", title: "가벼운 발걸음", message: "잠깐 걷고 오면 막혔던 생각이 술술 풀려요.", luckyItem: "편한 운동화", time: "afternoon" },
  { id: "c07", rarity: "common", title: "아침의 반죽", message: "오늘 아침에 시작한 일이 저녁엔 근사하게 부풀어 있을 거예요.", luckyItem: "버터 토스트", time: "morning" },
  { id: "c08", rarity: "common", title: "밤의 온기", message: "오늘 하루를 잘 마무리했어요. 내일의 당신이 고마워할 거예요.", luckyItem: "포근한 담요", time: "night" },
  { id: "c09", rarity: "common", title: "한 입 크기", message: "큰일도 한 입 크기로 자르면 금방 먹어치울 수 있어요.", luckyItem: "작은 수첩" },
  { id: "c10", rarity: "common", title: "좋은 냄새", message: "주변 사람들이 당신의 꾸준함을 알아채기 시작했어요.", luckyItem: "향긋한 핸드크림" },
  { id: "c11", rarity: "common", title: "새 레시피", message: "평소와 다른 방법을 하나 시도해 보세요. 뜻밖의 맛이 나와요.", luckyItem: "새 펜" },
  { id: "c12", rarity: "common", title: "깊은 잠", message: "오늘은 일찍 자는 게 최고의 자기계발이에요.", luckyItem: "수면 안대", time: "night" },
  // 황금 쿠키 (rare)
  { id: "r01", rarity: "rare", title: "황금빛 타이밍", message: "미뤄둔 제안을 이번 주에 꺼내 보세요. 받아들여질 확률이 아주 높아요.", luckyItem: "금색 클립" },
  { id: "r02", rarity: "rare", title: "숨은 재능", message: "오늘 한 일에서 당신도 몰랐던 재능이 살짝 보였어요. 그 방향을 기억해 두세요.", luckyItem: "형광펜" },
  { id: "r03", rarity: "rare", title: "뜻밖의 귀인", message: "가볍게 나눈 대화가 큰 기회로 이어질 거예요. 오늘 만난 사람을 잘 기억해 두세요.", luckyItem: "명함" },
  { id: "r04", rarity: "rare", title: "막힌 길이 뚫림", message: "오래 붙잡고 있던 문제가 생각지 못한 순간에 풀려요.", luckyItem: "샤워 중 떠오른 생각", time: "morning" },
  { id: "r05", rarity: "rare", title: "작은 행운 연속", message: "오늘은 신호등도, 엘리베이터도 당신 편이에요. 하고 싶었던 일을 시작하기 좋은 날.", luckyItem: "초록색 물건", time: "afternoon" },
  { id: "r06", rarity: "rare", title: "별이 머문 밤", message: "오늘 밤 떠오르는 아이디어는 꼭 적어두세요. 나중에 보물이 돼요.", luckyItem: "머리맡 메모장", time: "night" },
  { id: "r07", rarity: "rare", title: "꾸준함의 보상", message: "쌓아온 노력이 곧 눈에 보이는 결과로 돌아와요.", luckyItem: "저금통" },
  // 전설의 쿠키 (legend)
  { id: "l01", rarity: "legend", title: "전설의 반죽", message: "지금 당신의 집중력은 최고 상태예요. 가장 어려운 일에 도전하면 해낼 수 있어요.", luckyItem: "가장 아끼는 머그컵" },
  { id: "l02", rarity: "legend", title: "운명의 오븐", message: "올해 가장 기억에 남을 성취가 바로 이 목표에서 시작돼요.", luckyItem: "오늘 날짜가 적힌 영수증" },
  { id: "l03", rarity: "legend", title: "무지개 설탕", message: "당신이 만든 결과물이 누군가에게 큰 영감을 줄 거예요. 자신 있게 보여주세요.", luckyItem: "무지개색 스티커" },
  { id: "l04", rarity: "legend", title: "복이 터지는 날", message: "집중이 모여 복이 되었어요. 이번 주에 바라던 일 하나가 이루어져요.", luckyItem: "네잎클로버" },
];

/**
 * 목록에서 운세 하나를 고른다.
 * 1) 희귀도가 같은 것 중 2) 시간대가 맞거나 시간대가 없는 것 중
 * 3) 이미 도감에 있는 것은 가능하면 빼고 무작위로 고른다.
 */
export function pickListFortune(
  rarity: Rarity,
  time: TimeOfDay,
  seenIds: Set<string>,
  rand: number = Math.random(),
): ListFortune {
  const sameRarity = FORTUNES.filter((f) => f.rarity === rarity);
  const fitsTime = sameRarity.filter((f) => !f.time || f.time === time);
  const unseen = fitsTime.filter((f) => !seenIds.has(f.id));
  const pool = unseen.length > 0 ? unseen : fitsTime.length > 0 ? fitsTime : sameRarity;
  return pool[Math.floor(rand * pool.length)];
}
