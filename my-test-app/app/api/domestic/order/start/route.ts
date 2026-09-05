import dayjs from '@/lib/dayjs'
import { db } from '@/lib/db'
import { getAccessToken } from '@/lib/kis-auth'

export const POST = async () => {
  const token = await getAccessToken()

  const res = await fetch(
    'https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/quotations/inquire-price?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=005930',
    {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
        appkey: process.env.KIS_VTS_APP_KEY!,
        appsecret: process.env.KIS_VTS_APP_SECRET!,
        tr_id: 'FHKST01010100'
      }
    },
  )
  const data = await res.json()
  const currentPrice = Number(data.output.stck_prpr)
  const symbolResult = await db.execute({
    sql: 'SELECT id FROM symbols WHERE code = ?',
    args: ['005930'],
  })
  const symbolId = symbolResult.rows[0].id
  const now = dayjs().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')

  const insertResult = await db.execute({
    sql: 'INSERT INTO trade_state (symbol_id, is_running, holding, rise_count, prev_price, started_at, updated_at) VALUES (?, 1, 0, 0, ?, ?, ?)',
    args: [symbolId, currentPrice, now, now],
  })

  return Response.json({
    message: '자동 매매 시작',
    tradeId: insertResult.lastInsertRowid?.toString(),
    startPrice: currentPrice,
  })

  //   const res = await fetch(
  //   'https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/trading/order-cash',
  //   {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       authorization: `Bearer ${token}`,
  //       appkey: process.env.KIS_VTS_APP_KEY!,
  //       appsecret: process.env.KIS_VTS_APP_SECRET!,
  //       tr_id: 'VTTC0012U',
  //     },
  //     body: JSON.stringify({
  //       CANO: process.env.KIS_VTS_ACCOUNT_CANO,
  //       ACNT_PRDT_CD: process.env.KIS_VTS_ACCOUNT_PRDT_CD,
  //       PDNO: '005930',
  //       ORD_DVSN: '01',
  //       ORD_QTY: '1',
  //       ORD_UNPR: '0',
  //     }),
  //   }
  // )

  // const start = await res.json()
  
  // return Response.json(start)
}