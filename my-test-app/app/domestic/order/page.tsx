"use client";

import { useEffect, useRef, useState } from "react";

export default function Order() {
  const [result, setResult] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const runningRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isExecutingRef = useRef(false);

  const runExecuteLoop = () => {
    timerRef.current = setTimeout(async () => {
      if (!runningRef.current) return;

      if (!isExecutingRef.current) {
        isExecutingRef.current = true;
        try {
          const execRes = await fetch("/api/domestic/order/execute", {
            method: "POST",
          });
          const execData = await execRes.json();
          setResult(
            `현재가: ${execData.currentPrice?.toLocaleString()}원, netChange: ${execData.netChange}, windowSize: ${execData.windowSize}, action: ${execData.action ?? "없음"}`
          );
        } finally {
          isExecutingRef.current = false;
        }
      }

      if (runningRef.current) {
        runExecuteLoop();
      }
    }, 2000);
  };

  const handleStart = async () => {
    setResult("시작 중...");

    const res = await fetch("/api/domestic/order/start", {
      method: "POST",
    });
    const data = await res.json();

    setResult(`자동매매 시작됨 (세션 ID: ${data.tradeId}, 시작가: ${data.startPrice.toLocaleString()}원)`);
    setIsRunning(true);
    runningRef.current = true;

    runExecuteLoop();
  };

  const handleStop = async () => {
    runningRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setResult("중지 중...");

    const res = await fetch("/api/domestic/order/stop", {
      method: "POST",
    });
    const data = await res.json();

    setResult(`자동매매 중지됨 (변경된 세션 수: ${data.updatedRows})`);
    setIsRunning(false);
  };

  useEffect(() => {
    return () => {
      runningRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div>
      {!isRunning ? (
        <button onClick={handleStart}>자동매매 시작</button>
      ) : (
        <button onClick={handleStop}>자동매매 중지</button>
      )}
      {result && <p>{result}</p>}
    </div>
  );
}