/** "11월 16일 월요일" */
export function shortDate(time: number): string {
  const d = new Date(time);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${"일월화수목금토"[d.getDay()]}요일`;
}
