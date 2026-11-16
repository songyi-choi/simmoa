import { useState } from "react";
import type { Goal } from "../lib/types";
import { Heading } from "./Sketch";
import { Btn, RoughBox, RoughLine } from "./Rough";

interface Props {
  goals: Goal[];
  activeGoalId: string | null;
  onAdd: (title: string, targetSessions: number, sessionMinutes: number) => void;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

const MIN_MINUTES = 1;
const MAX_MINUTES = 180;
/** 입력 중인 글자를 1~180분 사이 정수로 */
const toMinutes = (v: string) => Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, Math.round(Number(v)) || 25));

export function GoalPanel({ goals, activeGoalId, onAdd, onSelect, onRemove }: Props) {
  const [title, setTitle] = useState("");
  const [sessions, setSessions] = useState(2);
  // 입력 중에는 비워 둘 수도 있게 글자로 들고 있다가, 쓸 때 숫자로 맞춘다
  const [minutesText, setMinutesText] = useState("25");
  const minutes = toMinutes(minutesText);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    onAdd(t, sessions, minutes);
    setMinutesText(String(minutes));
    setTitle("");
  };

  const inProgress = goals.filter((g) => !g.achievedAt);
  const achieved = goals.filter((g) => g.achievedAt).slice(0, 5);

  return (
    <section className="side-section recipe-card">
      <Heading color="#9fd0f2">오늘의 목표</Heading>
      <form className="goal-form" onSubmit={submit}>
        <div className="input-line">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={40}
            placeholder="예: 보고서 초안 완성하기"
            aria-label="목표"
          />
          <RoughLine />
        </div>
        <div className="goal-options">
          <label>
            <span>몇 번 집중할까요?</span>
            <RoughBox as="span" className="select-box" shape="underline" stroke="#8a7a6a" strokeWidth={1.6} inset={1}>
              <select value={sessions} onChange={(e) => setSessions(Number(e.target.value))}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n}번
                  </option>
                ))}
              </select>
            </RoughBox>
          </label>
          <label>
            <span>한 번에 몇 분?</span>
            <RoughBox as="span" className="select-box" shape="underline" stroke="#8a7a6a" strokeWidth={1.6} inset={1}>
              <input
                className="minutes-input"
                type="number"
                inputMode="numeric"
                min={MIN_MINUTES}
                max={MAX_MINUTES}
                step={1}
                value={minutesText}
                onChange={(e) => setMinutesText(e.target.value)}
                onBlur={() => setMinutesText(String(minutes))}
                aria-label="한 번에 집중할 분"
              />
              <span className="unit">분</span>
            </RoughBox>
          </label>
          <Btn variant="primary" type="submit" disabled={!title.trim()}>
            반죽하기
          </Btn>
        </div>
        <p className="goal-sum">
          {minutes}분씩 {sessions}번, 모두 {minutes * sessions}분 집중하면 쿠키 1개
        </p>
      </form>

      {inProgress.length > 0 && (
        <ul className="goal-list">
          {inProgress.map((g) => (
            <li key={g.id} className={g.id === activeGoalId ? "active" : ""}>
              <button className="goal-pick" onClick={() => onSelect(g.id)}>
                {g.id === activeGoalId ? (
                  <RoughBox as="span" shape="highlight" className="goal-title" fill="#f7c948" fillStyle="hachure" hachureGap={2.2} fillWeight={3.2} inset={0} roughness={2}>
                    {g.title}
                  </RoughBox>
                ) : (
                  <span className="goal-title">{g.title}</span>
                )}
                <span className="goal-meta">
                  {g.doneSessions}/{g.targetSessions}번 · {g.sessionMinutes}분씩
                </span>
              </button>
              <button className="goal-remove" onClick={() => onRemove(g.id)} aria-label={`${g.title} 삭제`}>
                ×
              </button>
              <RoughLine className="li-rule" stroke="#c9bfb1" strokeWidth={1.4} />
            </li>
          ))}
        </ul>
      )}

      {achieved.length > 0 && (
        <>
          <h3>다 한 일</h3>
          <ul className="goal-list done">
            {achieved.map((g) => (
              <li key={g.id}>
                <span className="goal-title">✓ {g.title}</span>
                <button className="goal-remove" onClick={() => onRemove(g.id)} aria-label={`${g.title} 삭제`}>
                  ×
                </button>
                <RoughLine className="li-rule" stroke="#c9bfb1" strokeWidth={1.4} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
