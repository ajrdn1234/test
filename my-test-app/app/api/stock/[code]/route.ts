import type { NextRequest } from 'next/server'
import dayjs from '@/lib/dayjs'
import { db } from '@/lib/db'
import { getAccessToken } from '@/lib/kis-auth'
import { StockInfo } from '@/lib/types'

export const GET = async (
    req: NextRequest,
    ctx: RouteContext<'/api/stock/[code]'>
) => {
    const { code } = await ctx.params
    const token = await getAccessToken()

    const res = await fetch(
        `https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/quotations/inquire-price?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=${code}`,
        {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
                appkey: process.env.KIS_VTS_APP_KEY!,
                appsecret: process.env.KIS_VTS_APP_SECRET!,
                tr_id: 'FHKST01010100',
            },
        },
    )

    const data = await res.json()
    const stockInfo: StockInfo = {
        code,
        currentPrice: Number(data.output.stck_prpr),
        changeAmount: Number(data.output.prdy_vrss),
        changeRate: Number(data.output.prdy_ctrt),
        volume: Number(data.output.acml_vol),
    }

    await db.execute({
        sql: 'INSERT INTO stock_prices (code, price, created_at) VALUES (?, ?, ?)',
        args: [stockInfo.code, stockInfo.currentPrice, dayjs().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')],
    })

    return Response.json(stockInfo)
}