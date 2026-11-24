import { useState } from "react";
import { CalendarScreen } from "./components/CalendarScreen";
import { CreateScreen } from "./components/CreateScreen";
import { rememberCalendar } from "./lib/storage";

/** ?id=… 가 있으면 어드벤트 화면, 없으면 만들기 화면. #key=… 는 주인 키 */
function readRoute(): string | null {
  const id = new URLSearchParams(location.search).get("id");
  const key = location.hash.match(/key=([A-Za-z0-9]+)/)?.[1];
  if (id && key) {
    rememberCalendar(id, key);
    // 주소창에서 키를 지워서, 주소를 그대로 복사해 공유해도 키가 새지 않게 한다
    history.replaceState(null, "", `${location.pathname}?id=${encodeURIComponent(id)}`);
  }
  return id;
}

export default function App() {
  const [id, setId] = useState(readRoute);
  const [justCreated, setJustCreated] = useState(false);

  const onCreated = (newId: string) => {
    history.pushState(null, "", `${location.pathname}?id=${encodeURIComponent(newId)}`);
    setJustCreated(true);
    setId(newId);
    window.scrollTo(0, 0);
  };

  return id ? <CalendarScreen key={id} id={id} justCreated={justCreated} /> : <CreateScreen onCreated={onCreated} />;
}
