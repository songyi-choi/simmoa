import { useState } from "react";
import { ownerUrl, shareUrl } from "../lib/storage";

async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 오래된 브라우저·권한 거부 시 직접 선택해서 복사
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

interface Props {
  id: string;
  ownerKey: string;
  ownerName: string;
  defaultOpen: boolean;
}

export function SharePanel({ id, ownerKey, ownerName, defaultOpen }: Props) {
  const [done, setDone] = useState<"" | "share" | "owner">("");
  const [showOwner, setShowOwner] = useState(defaultOpen);
  const link = shareUrl(id);

  const flash = (what: "share" | "owner") => {
    setDone(what);
    setTimeout(() => setDone(""), 2000);
  };

  const share = async () => {
    const text = `${ownerName}의 크리스마스 어드벤트에 선물(편지)을 넣어 주세요 🎁`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "크리스마스 어드벤트", text, url: link });
        return;
      } catch (e) {
        if ((e as DOMException)?.name === "AbortError") return;
      }
    }
    if (await copy(link)) flash("share");
  };

  return (
    <section className="card share">
      <div className="share-row">
        <div>
          <p className="card-en">Share</p>
          <h2>친구에게 링크 보내기</h2>
          <p className="share-link">{link}</p>
        </div>
        <button className="btn btn-primary" onClick={share}>
          {done === "share" ? "복사했어요!" : "링크 공유"}
        </button>
      </div>

      <details className="owner-link" open={showOwner} onToggle={(e) => setShowOwner((e.target as HTMLDetailsElement).open)}>
        <summary>다른 기기에서 열어 보려면? (주인 링크)</summary>
        <p>
          지금 이 기기에서는 자동으로 주인으로 들어와요. 휴대폰을 바꾸거나 다른 브라우저에서 열려면
          <b> 아래 주인 링크</b>가 꼭 필요해요. 잃어버리면 다시 찾을 수 없으니 나만 볼 수 있는 곳(메모, 나와의 채팅)에 저장해 두세요.
          <br />
          <em>친구에게는 절대 보내지 마세요 — 편지를 미리 열어 볼 수 있어요.</em>
        </p>
        <button
          className="btn btn-ghost"
          onClick={async () => (await copy(ownerUrl(id, ownerKey))) && flash("owner")}
        >
          {done === "owner" ? "복사했어요!" : "주인 링크 복사"}
        </button>
      </details>
    </section>
  );
}
