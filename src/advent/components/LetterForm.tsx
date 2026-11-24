import { useEffect, useRef, useState } from "react";
import { ApiFailure, errorMessage, sendLetter } from "../lib/api";
import { BIG_BOX_DAY, LIMITS, isUnlocked } from "../lib/rules";

interface Props {
  calendarId: string;
  ownerName: string;
  year: number;
  day: number;
  now: number;
  onSent: (day: number) => void;
  onCancel: () => void;
  /** 다른 친구가 먼저 이 칸을 채웠을 때 (칸 목록 새로고침) */
  onTaken: () => void;
}

export function LetterForm({ calendarId, ownerName, year, day, now, onSent, onCancel, onTaken }: Props) {
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setError("");
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [day]);

  const big = day === BIG_BOX_DAY;
  const openNow = isUnlocked(year, day, now);
  const where = big ? "크리스마스 선물 상자" : `12월 ${day}일 서랍`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || !nickname.trim() || !message.trim()) return;
    setBusy(true);
    setError("");
    try {
      await sendLetter(calendarId, day, nickname, message);
      onSent(day);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
      if (err instanceof ApiFailure && err.code === "door_taken") onTaken();
    }
  };

  return (
    <form ref={ref} className="card form letter-form" onSubmit={submit}>
      <p className="card-en">Dear {ownerName}</p>
      <h2>
        <span className="tag">{where}</span>에 넣을 편지
      </h2>
      <p className="form-hint">
        {big
          ? `${ownerName}님이 크리스마스 아침에 다른 선물들과 함께 열어 봐요.`
          : openNow
            ? `이미 지난 날짜라 ${ownerName}님이 바로 열어 볼 수 있어요.`
            : `${ownerName}님은 12월 ${day}일이 되어야 열어 볼 수 있어요.`}
      </p>
      <label>
        <span>보내는 사람</span>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={LIMITS.nickname}
          placeholder="이름이나 별명"
          required
          autoComplete="nickname"
        />
      </label>
      <label>
        <span>편지</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={LIMITS.message}
          rows={6}
          placeholder={`${ownerName}에게 하고 싶은 말을 적어 주세요`}
          required
        />
        <span className="char-count">
          {Array.from(message).length}/{LIMITS.message}
        </span>
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          다른 서랍 고르기
        </button>
        <button className="btn btn-primary" disabled={busy || !nickname.trim() || !message.trim()}>
          {busy ? "넣는 중…" : "편지 넣기"}
        </button>
      </div>
      <p className="form-note">한 번 넣은 편지는 고치거나 지울 수 없어요.</p>
    </form>
  );
}
