import type { NextRequest } from 'next/server'
import { getAccessToken } from '@/lib/kis-auth'
import { USStockInfo } from '@/lib/types'

export const GET = async (
    req: NextRequest,
    ctx: RouteContext<'/api/us-stock/[symbol]'>
) => {
    const { symbol } = await ctx.params
    const token = await getAccessToken()

    const res = await fetch(
        `https://openapivts.koreainvestment.com:29443/uapi/overseas-price/v1/quotations/price?AUTH=&EXCD=NAS&SYMB=${symbol}`,
        {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
                appkey: process.env.KIS_VTS_APP_KEY!,
                appsecret: process.env.KIS_VTS_APP_SECRET!,
                tr_id: 'HHDFS00000300',
            },
        },
    )

    const data = await res.json()
    const usStockInfo: USStockInfo = {
        symbol,
        currentPrice: Number(data.output.last),
        changeAmount: Number(data.output.diff),
        changeRate: Number(data.output.rate),
        volume: Number(data.output.tvol),
    }
    return Response.json(usStockInfo)
}