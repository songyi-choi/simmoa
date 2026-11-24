import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { errorMessage, fetchCalendar } from "../lib/api";
import { BIG_BOX_DAY, DAYS, daysUntil } from "../lib/rules";
import { markOpened, rememberCalendar, savedCalendar } from "../lib/storage";
import type { CalendarView, DoorView } from "../lib/types";
import { DoorGrid } from "./DoorGrid";
import { Scene } from "./House";
import { LetterForm } from "./LetterForm";
import { LetterModal } from "./LetterModal";
import { SharePanel } from "./SharePanel";

type Load = { state: "loading" } | { state: "error"; message: string } | { state: "ok"; cal: CalendarView };

/** 불러오는 동안 보여줄 닫힌 서랍들 */
const CLOSED_DOORS: DoorView[] = DAYS.map((day) => ({ day, count: 0, unlocked: false }));

export function CalendarScreen({ id, justCreated }: { id: string; justCreated: boolean }) {
  const [load, setLoad] = useState<Load>({ state: "loading" });
  const ownerKey = savedCalendar(id)?.key ?? null;

  const refresh = useCallback(async () => {
    try {
      const cal = await fetchCalendar(id, ownerKey);
      if (cal.isOwner && ownerKey) rememberCalendar(id, ownerKey, cal.title);
      setLoad({ state: "ok", cal });
    } catch (e) {
      setLoad({ state: "error", message: errorMessage(e) });
    }
  }, [id, ownerKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (load.state !== "ok") {
    const loading = load.state === "loading";
    return (
      <Scene
        title={loading ? "선물 상자를 여는 중…" : "어드벤트를 찾을 수 없어요"}
        grid={<DoorGrid doors={CLOSED_DOORS} year={0} mode="guest" now={0} decorative />}
      >
        {!loading && (
          <div className="card center">
            <p>{load.message}</p>
            <a className="btn btn-primary" href="/advent">
              내 어드벤트 만들기
            </a>
          </div>
        )}
      </Scene>
    );
  }

  const { cal } = load;
  return cal.isOwner && ownerKey ? (
    <OwnerView cal={cal} ownerKey={ownerKey} justCreated={justCreated} />
  ) : (
    <GuestView cal={cal} onSent={refresh} />
  );
}

// ── 주인 화면 ────────────────────────────────
function OwnerView({ cal, ownerKey, justCreated }: { cal: CalendarView; ownerKey: string; justCreated: boolean }) {
  const now = Date.now();
  const [opened, setOpened] = useState<number[]>(() => savedCalendar(cal.id)?.opened ?? []);
  const [openDoor, setOpenDoor] = useState<DoorView | null>(null);
  const [toast, showToast] = useToast();

  const total = cal.doors.reduce((n, d) => n + d.count, 0);
  const toChristmas = daysUntil(cal.year, BIG_BOX_DAY, now);

  const onDoor = (door: DoorView) => {
    const name = door.day === BIG_BOX_DAY ? "크리스마스 상자" : `12월 ${door.day}일 서랍`;
    if (!door.count) return showToast(`${name}은 아직 비어 있어요`);
    if (!door.unlocked) return showToast(`선물이 들어 있어요! ${door.day}일이 되면 열 수 있어요 (D-${daysUntil(cal.year, door.day, now)})`);
    markOpened(cal.id, door.day);
    setOpened((o) => (o.includes(door.day) ? o : [...o, door.day]));
    setOpenDoor(door);
  };

  const sub =
    toChristmas > 0 ? (
      <>
        {total > 0 ? `편지 ${total}통이 도착했어요` : "아직 도착한 편지가 없어요"} <span className="sign-dot">·</span> 크리스마스까지{" "}
        <b>D-{toChristmas}</b>
      </>
    ) : (
      `메리 크리스마스! 편지 ${total}통이 기다리고 있어요`
    );

  return (
    <Scene
      title={cal.title} sub={sub}
      grid={<DoorGrid doors={cal.doors} year={cal.year} mode="owner" now={now} opened={opened} onDoor={onDoor} />}
    >
      <SharePanel id={cal.id} ownerKey={ownerKey} ownerName={cal.ownerName} defaultOpen={justCreated} />
      {toast && <Toast>{toast}</Toast>}
      {openDoor && <LetterModal door={openDoor} onClose={() => setOpenDoor(null)} />}
    </Scene>
  );
}

/** 집(위쪽 장면)보다 위에 뜨도록 body 바로 아래에 그린다 */
function Toast({ children }: { children: string }) {
  return createPortal(
    <p className="toast" role="status">
      {children}
    </p>,
    document.body,
  );
}

function useToast(): [string, (msg: string) => void] {
  const [msg, setMsg] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  const show = useCallback((m: string) => {
    clearTimeout(timer.current);
    setMsg(m);
    timer.current = setTimeout(() => setMsg(""), 2600);
  }, []);
  return [msg, show];
}

// ── 친구 화면 ────────────────────────────────
function GuestView({ cal, onSent }: { cal: CalendarView; onSent: () => Promise<void> }) {
  const now = Date.now();
  const [selected, setSelected] = useState<number | null>(null);
  const [sentDay, setSentDay] = useState<number | null>(null);
  const [toast, showToast] = useToast();

  const pick = (d: DoorView) => {
    if (d.day !== BIG_BOX_DAY && d.count > 0) {
      showToast("이미 다른 친구가 편지를 넣은 서랍이에요. 리본이 없는 서랍을 골라 주세요");
      return;
    }
    setSentDay(null);
    setSelected(d.day);
  };

  const sub = cal.writingOpen
    ? `빈 서랍을 하나 골라 ${cal.ownerName}님에게 편지를 넣어 주세요`
    : "올해 크리스마스가 지나서 더 이상 편지를 받지 않아요";

  return (
    <Scene
      title={cal.title} sub={sub}
      grid={
        <DoorGrid
          doors={cal.doors}
          year={cal.year}
          mode="guest"
          now={now}
          selected={selected}
          writingOpen={cal.writingOpen}
          onDoor={pick}
        />
      }
    >
      {sentDay !== null ? (
        <div className="card center thanks">
          <p className="card-en">Thank you</p>
          <h2>편지를 넣었어요</h2>
          <p>
            {sentDay === BIG_BOX_DAY ? "크리스마스 선물 상자" : `12월 ${sentDay}일 서랍`}에 편지가 들어갔어요.
            <br />
            {cal.ownerName}님이 열어 보면 분명 좋아할 거예요.
          </p>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => setSentDay(null)}>
              한 통 더 넣기
            </button>
            <a className="btn btn-primary" href="/advent">
              나도 어드벤트 만들기
            </a>
          </div>
        </div>
      ) : selected !== null && cal.writingOpen ? (
        <LetterForm
          calendarId={cal.id}
          ownerName={cal.ownerName}
          year={cal.year}
          day={selected}
          now={now}
          onTaken={onSent}
          onCancel={() => {
            setSelected(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onSent={async (day) => {
            setSentDay(day);
            setSelected(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
            await onSent();
          }}
        />
      ) : (
        cal.writingOpen && (
          <div className="card center">
            <p className="card-en">How it works</p>
            <p>
              1~24일 서랍에는 편지가 한 통씩 들어가요. 리본이 묶인 서랍은 이미 찬 곳이에요.
              <br />
              <b>{cal.ownerName}</b>님은 그날이 되어야 열어 볼 수 있어요.
              <br />
              맨 아래 크리스마스 상자에는 몇 통이든 넣을 수 있어요.
            </p>
          </div>
        )
      )}

      <p className="table-link">
        <a href="/advent">나도 어드벤트 만들기 →</a>
      </p>
      {toast && <Toast>{toast}</Toast>}
    </Scene>
  );
}
