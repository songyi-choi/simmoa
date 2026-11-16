import { useEffect, useRef, useState } from "react";
import type { Goal } from "../lib/types";
import { Pips } from "./Sketch";
import { shortDate } from "../lib/date";
import { Btn } from "./Rough";
import { OvenArt } from "./Art";

interface Props {
  goal: Goal | null;
  onSessionComplete: (goalId: string) => void;
}

const TIMER_KEY = "simmoa.focus.timer.v1";

/** ?fast 로 열면 1분이 1초 — 개발·시연용 */
const FAST = typeof location !== "undefined" && new URLSearchParams(location.search).has("fast");
const MS_PER_MINUTE = FAST ? 1000 : 60_000;

interface TimerState {
  goalId: string;
  /** 실행 중이면 끝나는 시각, 일시정지면 null */
  endsAt: number | null;
  /** 일시정지 상태일 때 남은 시간(ms) */
  remaining: number;
}

function loadTimer(): TimerState | null {
  try {
    const raw = localStorage.getItem(TIMER_KEY);
    return raw ? (JSON.parse(raw) as TimerState) : null;
  } catch {
    return null;
  }
}

function saveTimer(t: TimerState | null) {
  try {
    if (t) localStorage.setItem(TIMER_KEY, JSON.stringify(t));
    else localStorage.removeItem(TIMER_KEY);
  } catch {
    /* 저장이 막힌 환경 */
  }
}

function chime() {
  try {
    const ctx = new AudioContext();
    [660, 880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = "sine";
      const t = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.55);
    });
  } catch {
    /* 소리를 못 내는 환경 */
  }
}

function fmt(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function Oven({ goal, onSessionComplete }: Props) {
  const [timer, setTimer] = useState<TimerState | null>(loadTimer);
  const [now, setNow] = useState(Date.now());
  const [justDone, setJustDone] = useState(false);
  const completing = useRef(false);

  const sessionMs = goal ? goal.sessionMinutes * MS_PER_MINUTE : 0;
  const mine = timer && goal && timer.goalId === goal.id ? timer : null;
  const remaining = mine ? (mine.endsAt ? mine.endsAt - now : mine.remaining) : sessionMs;
  const running = !!mine?.endsAt;
  const achieved = !!goal?.achievedAt;

  useEffect(() => saveTimer(timer), [timer]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [running]);

  // 세션 완료 처리 (탭이 백그라운드였다가 돌아와도 endsAt 기준으로 판정)
  useEffect(() => {
    if (!mine?.endsAt || remaining > 0 || completing.current) return;
    completing.current = true;
    onSessionComplete(mine.goalId);
    setTimer(null);
    setJustDone(true);
    chime();
    completing.current = false;
  }, [mine, remaining, onSessionComplete]);

  useEffect(() => {
    document.title = running ? `${fmt(remaining)} · 집중하면 복이 와요` : "집중하면 복이 와요 - 포춘쿠키 집중 타이머";
  }, [running, remaining]);

  const top = (
    <div className="card-top">
      <span className="today">
        {shortDate(now)}
        {FAST && (
          <>
            {" "}
            <a className="fast-badge" href={location.pathname} title="눌러서 실제 시간으로 돌아가기">
              빠른 확인 모드 · 1분이 1초
            </a>
          </>
        )}
      </span>
    </div>
  );

  if (!goal) {
    return (
      <section className="oven-card empty">
        {top}
        <div className="oven">
          <OvenArt state="idle" />
          <div className="oven-time small">
            목표를 정하면
            <br />
            오븐이 깨어나요
          </div>
        </div>
        <p className="caption">오늘의 목표를 먼저 적어 주세요.</p>
      </section>
    );
  }

  const start = () => {
    setJustDone(false);
    setNow(Date.now());
    setTimer({ goalId: goal.id, endsAt: Date.now() + (mine ? mine.remaining : sessionMs), remaining: 0 });
  };
  const pause = () => mine?.endsAt && setTimer({ ...mine, endsAt: null, remaining: mine.endsAt - Date.now() });
  const reset = () => setTimer(null);

  const caption = achieved
    ? "다 구웠어요! 바구니에서 쿠키를 열어 보세요."
    : justDone
      ? "한 번 끝! 잠깐 쉬었다가 이어서 해요."
      : running
        ? "쿠키가 노릇노릇 구워지는 중이에요."
        : "준비됐어요. 시작하면 오븐이 켜져요.";

  return (
    <section className="oven-card">
      {top}
      <div className="goal-now">
        <h2 className="title-text">{goal.title}</h2>
        <Pips done={goal.doneSessions} total={goal.targetSessions} />
      </div>

      <div className={`oven ${running ? "baking" : ""}`}>
        <OvenArt state={achieved || justDone ? "done" : running ? "baking" : "idle"} />
        <div className={`oven-time ${achieved ? "small" : ""}`} aria-live="polite">
          {achieved ? "다 구웠어요!" : fmt(remaining)}
        </div>
      </div>

      <p className="caption">{caption}</p>

      {!achieved && (
        <div className="oven-actions">
          {running ? (
            <Btn variant="secondary" onClick={pause}>
              잠깐 멈춤
            </Btn>
          ) : (
            <Btn variant="primary" onClick={start}>
              {mine ? "이어서 굽기" : "굽기 시작"}
            </Btn>
          )}
          {mine && (
            <Btn variant="ghost" onClick={reset}>
              처음부터
            </Btn>
          )}
        </div>
      )}
    </section>
  );
}
