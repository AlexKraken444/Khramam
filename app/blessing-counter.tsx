"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Counter = { total: number; blessed: boolean; day: string };

export default function BlessingCounter() {
  const [counter, setCounter] = useState<Counter | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const claiming = useRef(false);
  const sequence = useRef(0);

  const refresh = useCallback(async (claim = false) => {
    if (claiming.current) return;
    if (claim) { claiming.current = true; setPending(true); }
    const version = ++sequence.current;
    try {
      const response = await fetch("/api/blessings", {
        method: claim ? "POST" : "GET", cache: "no-store", credentials: "same-origin",
        signal: AbortSignal.timeout(12000),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Счётчик временно недоступен.");
      if (!Number.isSafeInteger(data.total) || data.total < 0 || typeof data.blessed !== "boolean" || typeof data.day !== "string") throw new Error("Не удалось прочитать общий счётчик.");
      if (version === sequence.current) { setCounter(data); setError(""); }
    } catch (cause) {
      if (version === sequence.current) setError(cause instanceof Error && cause.name !== "TimeoutError" ? cause.message : "Счётчик временно недоступен. Попробуй позже.");
    } finally {
      if (claim) { claiming.current = false; setPending(false); }
    }
  }, []);

  useEffect(() => {
    const sync = () => { if (!document.hidden) void refresh(); };
    sync();
    const timer = window.setInterval(sync, 15000);
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", sync);
      sequence.current++;
    };
  }, [refresh]);

  return <>
    <div className="blessing-counter"><strong>{counter ? counter.total.toLocaleString("ru-RU") : "—"}</strong><span>БЛАГОСЛОВЕНИЙ ЗА ВСЁ ВРЕМЯ</span></div>
    <button className={`button ${counter?.blessed ? "is-blessed" : ""}`} disabled={!counter || pending || counter.blessed || Boolean(error)} onClick={() => void refresh(true)}>{counter?.blessed ? "Благословение получено" : pending ? "Получаем благословение…" : "Получить благословение"}<span>{counter?.blessed ? "✦" : "↗"}</span></button>
    <div className="blessing" role="status" aria-live="polite">{error || (counter?.blessed ? "Ва Васи одобряет. Следующее благословение — завтра. Отменить полученное нельзя." : "Новое благословение — каждый день после полуночи по Москве.")}</div>
    {error && <button className="retry-counter" onClick={() => void refresh()}>Обновить счётчик</button>}

  </>;
}


