import type { Cookie } from "../lib/types";
import { Heading } from "./Sketch";
import { BasketDoodle } from "./Doodles";
import { CookieArt } from "./Art";

interface Props {
  cookies: Cookie[];
  onOpen: (cookie: Cookie) => void;
}

export function Basket({ cookies, onOpen }: Props) {
  return (
    <section className="side-section basket-card">
      <Heading color="#f4a45c">쿠키 바구니</Heading>
      {cookies.length === 0 ? (
        <div className="basket-empty">
          <BasketDoodle />
          <p>목표를 다 채우면 여기에 포춘쿠키가 담겨요</p>
        </div>
      ) : (
        <>
          <p className="basket-hint">쿠키를 눌러 오늘의 운세를 열어보세요</p>
          <ul className="basket">
            {cookies.map((c) => (
              <li key={c.id}>
                <button className="basket-cookie" onClick={() => onOpen(c)} aria-label={`${c.goalTitle} 쿠키 열기`}>
                  <CookieArt className="mini-cookie" />
                  <span className="basket-label">{c.goalTitle}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
