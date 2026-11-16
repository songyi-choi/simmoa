import { useCallback, useEffect, useMemo, useState } from "react";
import { dayKey } from "./lib/rarity";
import { loadState, newId, saveState } from "./lib/storage";
import type { Cookie, FocusState, Goal, OpenedFortune } from "./lib/types";
import { GoalPanel } from "./components/GoalPanel";
import { Oven } from "./components/Oven";
import { Basket } from "./components/Basket";
import { CookieModal } from "./components/CookieModal";
import { Collection } from "./components/Collection";
import { PaperTexture, SketchDefs } from "./components/Doodles";
import { CookieArt } from "./components/Art";
import { RoughBox } from "./components/Rough";

type Tab = "bake" | "collection";

export default function App() {
  const [state, setState] = useState<FocusState>(loadState);
  const [tab, setTab] = useState<Tab>("bake");
  const [opening, setOpening] = useState<Cookie | null>(null);

  useEffect(() => saveState(state), [state]);

  const activeGoal = useMemo(
    () => state.goals.find((g) => g.id === state.activeGoalId) ?? null,
    [state.goals, state.activeGoalId],
  );

  const addGoal = (title: string, targetSessions: number, sessionMinutes: number) => {
    const goal: Goal = { id: newId(), title, targetSessions, sessionMinutes, doneSessions: 0, createdAt: Date.now() };
    setState((s) => ({ ...s, goals: [goal, ...s.goals], activeGoalId: goal.id }));
  };

  const removeGoal = (id: string) =>
    setState((s) => ({
      ...s,
      goals: s.goals.filter((g) => g.id !== id),
      activeGoalId: s.activeGoalId === id ? null : s.activeGoalId,
    }));

  const selectGoal = (id: string) => setState((s) => ({ ...s, activeGoalId: id }));

  /** 집중 세션 하나가 끝났을 때 — 목표를 채우면 쿠키를 준다 */
  const completeSession = useCallback((goalId: string) => {
    setState((s) => {
      const goal = s.goals.find((g) => g.id === goalId);
      if (!goal || goal.achievedAt) return s;
      const done = goal.doneSessions + 1;
      const achieved = done >= goal.targetSessions;
      const now = Date.now();
      const updated: Goal = { ...goal, doneSessions: done, achievedAt: achieved ? now : undefined };
      const next: FocusState = { ...s, goals: s.goals.map((g) => (g.id === goalId ? updated : g)) };
      if (!achieved) return next;
      const cookie: Cookie = {
        id: newId(),
        goalTitle: goal.title,
        focusMinutes: done * goal.sessionMinutes,
        earnedAt: now,
      };
      const today = dayKey(now);
      return {
        ...next,
        cookies: [...s.cookies, cookie],
        achievedDays: s.achievedDays.includes(today) ? s.achievedDays : [...s.achievedDays, today],
      };
    });
  }, []);

  const finishOpening = (fortune: OpenedFortune) => {
    setState((s) => ({
      ...s,
      cookies: s.cookies.filter((c) => c.id !== opening?.id),
      collection: [fortune, ...s.collection],
    }));
  };

  return (
    <div className="bakery">
      <PaperTexture />
      <SketchDefs />
      <header className="bakery-header">
        <a href="/" className="back-link" aria-label="무쓸모.test 홈으로">
          ← 홈
        </a>
        <div className="title-block">
          <h1>
            <CookieArt className="sign-cookie" />
            <span className="title-text">집중하면 복이 와요</span>
          </h1>
          <p className="subtitle">목표를 이루면 갓 구운 포춘쿠키를 드려요</p>
        </div>
        <nav className="tabs" role="tablist">
          {(["bake", "collection"] as const).map((t) => (
            <RoughBox
              key={`${t}-${tab === t}`}
              as="button"
              shape="highlight"
              role="tab"
              aria-selected={tab === t}
              className={tab === t ? "on" : ""}
              fill={tab === t ? "#f7c948" : "transparent"}
              fillStyle="hachure"
              hachureGap={2.2}
              fillWeight={3.4}
              inset={0}
              roughness={2}
              onClick={() => setTab(t)}
            >
              {t === "bake" ? (
                "집중하기"
              ) : (
                <>
                  운세 액자 <span className="count">{state.collection.length}</span>
                </>
              )}
            </RoughBox>
          ))}
        </nav>
      </header>

      {tab === "bake" ? (
        <main className="bake-layout">
          <Oven goal={activeGoal} onSessionComplete={completeSession} />
          <Basket cookies={state.cookies} onOpen={setOpening} />
          <GoalPanel
            goals={state.goals}
            activeGoalId={state.activeGoalId}
            onAdd={addGoal}
            onSelect={selectGoal}
            onRemove={removeGoal}
          />
        </main>
      ) : (
        <main>
          <Collection items={state.collection} />
        </main>
      )}

      {opening && (
        <CookieModal
          cookie={opening}
          achievedDays={state.achievedDays}
          collection={state.collection}
          onDone={finishOpening}
          onClose={() => setOpening(null)}
        />
      )}
    </div>
  );
}
