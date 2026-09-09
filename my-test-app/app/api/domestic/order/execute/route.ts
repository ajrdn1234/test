import { getAccessToken } from "@/lib/kis-auth";
import { db } from "@/lib/db";
import dayjs from "@/lib/dayjs";

const WINDOW_SIZE = 60; // 판단에 사용할 최근 기록 개수 (웹소켓 전환 시 "최근 60초"가 됨)
const TREND_THRESHOLD = 0; // 누적 변동폭이 이 값을 넘으면 상승세로 판단

export const POST = async () => {
  // 1. 진행 중인 세션 확인
  const stateResult = await db.execute({
    sql: "SELECT * FROM trade_state WHERE is_running = 1 ORDER BY id DESC LIMIT 1",
    args: [],
  });

  if (stateResult.rows.length === 0) {
    return Response.json({ message: "진행 중인 자동매매 없음" });
  }

  const state = stateResult.rows[0];
  const tradeId = state.id;
  const holding = Number(state.holding) === 1;

  // 2. 현재가 조회
  const token = await getAccessToken();
  const priceRes = await fetch(
    "https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/quotations/inquire-price?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=005930",
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
        appkey: process.env.KIS_VTS_APP_KEY!,
        appsecret: process.env.KIS_VTS_APP_SECRET!,
        tr_id: "FHKST01010100",
      },
    }
  );
  const priceData = await priceRes.json();
  const currentPrice = Number(priceData.output.stck_prpr);

  // 3. 최근 기록을 불러와 누적 변동폭(netChange) 계산
  const recentLogsResult = await db.execute({
    sql: "SELECT price FROM trade_logs WHERE trade_id = ? ORDER BY id DESC LIMIT ?",
    args: [tradeId, WINDOW_SIZE - 1],
  });

  // 오래된 -> 최신 순으로 정렬 후, 이번에 조회한 currentPrice를 맨 뒤에 붙임
  const recentPrices = recentLogsResult.rows
    .map((row) => Number(row.price))
    .reverse();
  const priceWindow = [...recentPrices, currentPrice];

  let netChange = 0;
  for (let i = 1; i < priceWindow.length; i++) {
    netChange += priceWindow[i] - priceWindow[i - 1];
  }

  const isRising = netChange > TREND_THRESHOLD;
  const isFalling = netChange < -TREND_THRESHOLD;

  // 4. 매수/매도 판단
  let action: "buy" | "sell" | null = null;
  let orderNo: string | null = null;
  let quantity: number | null = null;
  let newHolding = holding;

  if (!holding && isRising) {
    const buyRes = await fetch(
      "https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/trading/order-cash",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          appkey: process.env.KIS_VTS_APP_KEY!,
          appsecret: process.env.KIS_VTS_APP_SECRET!,
          tr_id: "VTTC0012U",
        },
        body: JSON.stringify({
          CANO: process.env.KIS_VTS_ACCOUNT_CANO,
          ACNT_PRDT_CD: process.env.KIS_VTS_ACCOUNT_PRDT_CD,
          PDNO: "005930",
          ORD_DVSN: "01",
          ORD_QTY: "1",
          ORD_UNPR: "0",
        }),
      }
    );
    const buyData = await buyRes.json();
    if (buyData.rt_cd === "0") {
      action = "buy";
      quantity = 1;
      orderNo = buyData.output.ODNO;
      newHolding = true;
    }
  } else if (holding && isFalling) {
    const sellRes = await fetch(
      "https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/trading/order-cash",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          appkey: process.env.KIS_VTS_APP_KEY!,
          appsecret: process.env.KIS_VTS_APP_SECRET!,
          tr_id: "VTTC0011U",
        },
        body: JSON.stringify({
          CANO: process.env.KIS_VTS_ACCOUNT_CANO,
          ACNT_PRDT_CD: process.env.KIS_VTS_ACCOUNT_PRDT_CD,
          PDNO: "005930",
          ORD_DVSN: "01",
          ORD_QTY: "1",
          ORD_UNPR: "0",
        }),
      }
    );
    const sellData = await sellRes.json();
    if (sellData.rt_cd === "0") {
      action = "sell";
      quantity = 1;
      orderNo = sellData.output.ODNO;
      newHolding = false;
    }
  }

  // 5. 기록 저장
  const now = dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");

  await db.execute({
    sql: `INSERT INTO trade_logs (trade_id, price, action, quantity, order_no, collected_at)
      VALUES (?, ?, ?, ?, ?, ?)`,
    args: [tradeId, currentPrice, action, quantity, orderNo, now],
  });

  // 6. 세션 상태 갱신
  await db.execute({
    sql: `UPDATE trade_state
      SET holding = ?, prev_price = ?, updated_at = ?
      WHERE id = ?`,
    args: [newHolding ? 1 : 0, currentPrice, now, tradeId],
  });

  return Response.json({
    tradeId,
    currentPrice,
    netChange,
    windowSize: priceWindow.length,
    action,
  });
};