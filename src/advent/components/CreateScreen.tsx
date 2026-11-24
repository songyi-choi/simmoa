import { useState } from "react";
import { createCalendar, errorMessage } from "../lib/api";
import { DAYS, LIMITS } from "../lib/rules";
import { rememberCalendar, savedCalendars } from "../lib/storage";
import type { DoorView } from "../lib/types";
import { DoorGrid } from "./DoorGrid";
import { Scene } from "./House";

/** 만들기 화면 미리보기: 몇 칸에 선물이 들어 있는 모습 */
const PREVIEW: DoorView[] = DAYS.map((day) => ({
  day,
  count: day === 25 ? 4 : [3, 8, 12, 17, 22].includes(day) ? 1 : 0,
  unlocked: false,
}));

export function CreateScreen({ onCreated }: { onCreated: (id: string) => void }) {
  const [ownerName, setOwnerName] = useState("");
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const mine = savedCalendars();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      const { id, key } = await createCalendar(ownerName, title);
      rememberCalendar(id, key, title.trim() || `${ownerName.trim()}의 크리스마스 어드벤트`);
      onCreated(id);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <Scene
      title="나를 위한 크리스마스 서랍" sub="12월 1일부터 25일까지, 하루에 한 서랍씩"
      grid={<DoorGrid doors={PREVIEW} year={0} mode="guest" now={0} decorative />}
    >
      <ol className="steps">
        <li>
          <span className="step-num">1</span>
          <b>어드벤트 만들기</b>
          <span>이름만 적으면 끝</span>
        </li>
        <li>
          <span className="step-num">2</span>
          <b>친구에게 링크 보내기</b>
          <span>친구가 빈 서랍에 편지를 넣어요</span>
        </li>
        <li>
          <span className="step-num">3</span>
          <b>하루에 한 서랍씩</b>
          <span>25일엔 큰 선물 상자가 열려요</span>
        </li>
      </ol>

      <form className="card form" onSubmit={submit}>
        <p className="card-en">Make your own</p>
        <h2>내 어드벤트 만들기</h2>
        <label>
          <span>내 이름 (친구들에게 보여요)</span>
          <input
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            maxLength={LIMITS.ownerName}
            placeholder="예: 송이"
            required
            autoComplete="nickname"
          />
        </label>
        <label>
          <span>어드벤트 제목 (선택)</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={LIMITS.title}
            placeholder={`${ownerName.trim() || "송이"}의 크리스마스 어드벤트`}
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="btn btn-primary btn-block" disabled={!ownerName.trim() || busy}>
          {busy ? "만드는 중…" : "만들기"}
        </button>
      </form>

      {mine.length > 0 && (
        <section className="card mine">
          <h2>이 기기에서 만든 어드벤트</h2>
          <ul>
            {mine.map((c) => (
              <li key={c.id}>
                <a href={`?id=${c.id}`}>{c.title || "내 어드벤트"}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Scene>
  );
}
