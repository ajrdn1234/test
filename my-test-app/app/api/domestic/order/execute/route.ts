import dayjs from '@/lib/dayjs'
import { db } from '@/lib/db'
import { getAccessToken } from '@/lib/kis-auth'

export const POST = async () => {
    const stateResult = await db.execute({
        sql: 'SELECT * FROM trade_state WHERE is_running = 1 ORDER BY id DESC LIMIT 1',
        args: [],
    })

    if(stateResult.rows.length === 0)
        return Response.json({ message: '진행 중인 자동 매매 없음' })

    const state = stateResult.rows[0]
    const tradeId = state.id
    const prevPrice = Number(state.prev_price)
    const holding = Number(state.holding) === 1
    let riseCount = Number(state.rise_count)

    const token = await getAccessToken()
    const priceRes = await fetch(
        'https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/quotations/inquire-price?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=005930',
        {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
                appkey: process.env.KIS_VTS_APP_KEY!,
                appsecret: process.env.KIS_VTS_APP_SECRET!,
                tr_id: 'FHKST01010100'
            },
        },
    )
    const priceData = await priceRes.json()
    const currentPrice = Number(priceData.output.stck_prpr)

    const isFall = currentPrice < prevPrice

    if(isFall) riseCount = 0
    else if(currentPrice > prevPrice) riseCount += 1

    let action: 'buy' | 'sell' | null = null
    let orderNo: string | null = null
    let quantity: number | null = null
    let newHolding = holding

    if(!holding && riseCount >= 2) {
        const buyRes = await fetch(
            'https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/trading/order-cash',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                    appkey: process.env.KIS_VTS_APP_KEY!,
                    appsecret: process.env.KIS_VTS_APP_SECRET!,
                    tr_id: 'VTTC0012U'
                },
                body: JSON.stringify({
                    CANO: process.env.KIS_VTS_ACCOUNT_CANO,
                    ACNT_PRDT_CD: process.env.KIS_VTS_ACCOUNT_PRDT_CD,
                    PDNO: '005930',
                    ORD_DVSN: '01',
                    ORD_QTY: '1',
                    ORD_UNPR: '0',
                }),
            }
        )
        const buyData = await buyRes.json()
        if(buyData.rt_cd === '0') {
            action = 'buy'
            quantity = 1
            orderNo = buyData.output.ODNO
            newHolding = true
        }
    } else if(holding && isFall) {
        const sellRes = await fetch(
            'https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/trading/order-cash',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                    appkey: process.env.KIS_VTS_APP_KEY!,
                    appsecret: process.env.KIS_VTS_APP_SECRET!,
                    tr_id: 'VTTC0011U'
                },
                body: JSON.stringify({
                    CANO: process.env.KIS_VTS_ACCOUNT_CANO,
                    ACNT_PRDT_CD: process.env.KIS_VTS_ACCOUNT_PRDT_CD,
                    PDNO: '005930',
                    ORD_DVSN: '01',
                    ORD_QTY: '1',
                    ORD_UNPR: '0',
                }),
            }
        )
        const sellData = await sellRes.json()
        if(sellData.rt_cd === '0') {
            action = 'sell'
            quantity = 1
            orderNo = sellData.output.ODNO
            newHolding = false
        }
    }

    const now = dayjs().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')

    await db.execute({
        sql: 'INSERT INTO trade_logs (trade_id, price, action, quantity, order_no, collected_at) VALUES (?, ?, ?, ?, ?, ?)',
        args: [tradeId, currentPrice, action, quantity, orderNo, now],
    })
    
    await db.execute({
        sql: 'UPDATE trade_state SET holding = ?, rise_count = ?, prev_price = ?, updated_at = ? WHERE id = ?',
        args: [newHolding ? 1 : 0, riseCount, currentPrice, now, tradeId],
    })

    return Response.json({
        tradeId,
        currentPrice,
        riseCount,
        action,
    })
}