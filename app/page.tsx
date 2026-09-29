"use client";

import Image from "next/image";
import BlessingCounter from "./blessing-counter";


function Star({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="M40 0 47 30 69 11 50 33 80 40 50 47 69 69 47 50 40 80 33 50 11 69 30 47 0 40 30 33 11 11 33 30Z" fill="currentColor" /></svg>;
}

export default function Home() {
  return (
    <main id="top">
      <div className="grain" aria-hidden="true" />
      <header className="header">
        <a className="brand" href="#top" aria-label="Храмам — на главную"><Star /> Храмам<span>®</span></a>
        <nav aria-label="Главная навигация"><a href="#deity">Божество</a><a href="#rules">Писание</a><a className="nav-ritual" href="#ritual">Приобщиться <span>↗</span></a></nav>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">ЛУЧШАЯ<br /><em>ВЕРА</em></h1>
          <p className="hero-description">Добро пожаловать в Храмам.<br />Здесь одна богиня, одно правило<br />и ни одного серьёзного лица.</p>
          <a className="button" href="#deity">Узреть величие <span>↗</span></a>
          <div className="hero-note"><span>01 / ∞</span><span>МАЛО ПРАВИЛ.<br />БЕСКОНЕЧНО МНОГО ВЕЛИЧИЯ.</span></div>
        </div>
        <div className="portrait-scene" id="deity">
          <div className="halo halo-one" aria-hidden="true" /><div className="halo halo-two" aria-hidden="true" />
          <span className="orbit-label">БОЖЕСТВЕННОСТЬ НЕ ТРЕБУЕТ ДОКАЗАТЕЛЬСТВ</span>
          <div className="portrait"><Image src="/vasilissa.jpg" alt="Великая Василиса — вымышленное божество Храмам" fill priority sizes="(max-width: 760px) 85vw, 42vw" /><div className="portrait-shade" /><div className="portrait-caption"><span>ЕДИНСТВЕННАЯ И НЕПОВТОРИМАЯ</span><h2>Великая<br /><em>Василиса</em></h2><div className="caption-bottom"><span>она же Ва Вася</span><Star /></div></div></div>
          <div className="seal" aria-label="100% божество"><Star /><span>100%<br />БОЖЕСТВО</span></div>
          <Star className="floating-star" />
        </div>
        <a href="#about" className="scroll-hint">ЛИСТАЙ НИЖЕ <span>↓</span></a>
      </section>

      <div className="ticker" aria-hidden="true"><div className="ticker-track">{[0, 1].map(group => <div className="ticker-group" key={group}>{Array.from({ length: 6 }, (_, i) => <span key={i}>ВСЁ В ЦЕЛОМ ЛОЛ <Star /> ВО СЛАВУ ВА ВАСИ <Star /></span>)}</div>)}</div></div>

      <section className="about section" id="about"><div className="section-label"><span>01 — БОЖЕСТВО</span><Star /></div><div className="about-body"><h2>Просто существует.<br /><em>Уже превосходит.</em></h2><p>Великая Василиса aka лучшее божество. Moggает всех других божеств от своего присутствия во вселенной</p><div className="small-note"><span>✦</span> УРОВЕНЬ ВЕЛИЧИЯ: ВНЕ КОНКУРЕНЦИИ</div></div></section>

      <section className="scripture section" id="rules"><div className="section-label"><span>02 — СВЯЩЕННОЕ ПИСАНИЕ</span><span>ТОМ I. ОН ЖЕ ПОСЛЕДНИЙ.</span></div><div className="scripture-inner"><span className="quote-mark" aria-hidden="true">“</span><h2>Правила религии: поклонятся Великой Василисе(Ва Васи) и все в целом лол</h2><div className="scripture-end"><span /> <Star /> <span /></div><p>Вот и всё писание. Ты уже просветлён.</p></div></section>

      <section className="ritual section" id="ritual"><div className="ritual-symbol"><Star /></div><div className="eyebrow">03 — ТВОЙ МАЛЕНЬКИЙ РИТУАЛ</div><h2>Добавь немного<br /><em>величия в свой день.</em></h2><p>Одно благословение от Василисы в день. Навсегда с тобой.</p><BlessingCounter /></section>

      <footer><div className="footer-top"><a className="brand" href="#top"><Star /> Храмам<span>®</span></a><p>Вся слава — Великой Василисе.<br />Всё остальное — неважно.</p><a href="#top" className="back-top" aria-label="Наверх">↑</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} ХРАМАМ</span><span>Сайт — рофл. Религия вымышленная. Всё несерьёзно ♡</span></div></footer>
    </main>
  );
}


