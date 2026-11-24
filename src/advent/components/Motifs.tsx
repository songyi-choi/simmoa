// 편지 밀랍 봉인에 찍는 별. 색은 currentColor 로 CSS에서 정한다.

export function Star({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.4l-6.1 3.4 1.4-6.8-5.1-4.7 6.9-.8z" />
    </svg>
  );
}
