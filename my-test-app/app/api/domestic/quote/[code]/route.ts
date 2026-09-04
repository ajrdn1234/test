import type { NextRequest } from 'next/server'
import dayjs from '@/lib/dayjs'
import { getAccessToken } from '@/lib/kis-auth'
import { MinuteQuoteResponse } from '@/lib/types'

export const GET = async (
    req: NextRequest,
    ctx: RouteContext<'/api/domestic/quote/[code]'>
) => {
    const { code } = await ctx.params
    const token = await getAccessToken()

    const now = dayjs().tz('Asia/Seoul').format('HHmmss')
    const params = new URLSearchParams({
        FID_ETC_CLS_CODE: '',
        FID_COND_MRKT_DIV_CODE: 'J',
        FID_INPUT_ISCD: code,
        FID_INPUT_HOUR_1: now,
        FID_PW_DATA_INCU_YN: 'N',
    })

    const res = await fetch(
        `https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/quotations/inquire-time-itemchartprice?${params}`,
        {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
                appkey: process.env.KIS_VTS_APP_KEY!,
                appsecret: process.env.KIS_VTS_APP_SECRET!,
                tr_id: 'FHKST03010200',
            },
        },
    )

    const data = await res.json()
    const output1 = data.output1
    const output2 = data.output2

    const minuteQuoteResponse: MinuteQuoteResponse = {
        currentPrice: Number(output1.stck_prpr),
        changeAmount: Number(output1.prdy_vrss),
        changeRate: Number(output1.prdy_ctrt),
        minuteQuoteItems: output2.map((item: any) => ({
            time: dayjs.tz(
                `${item.stck_bsop_date} ${item.stck_cntg_hour}`,
                'YYYYMMDD HHmmss',
                'Asia/Seoul'
            ).unix(),
            open: Number(item.stck_oprc),
            high: Number(item.stck_hgpr),
            low: Number(item.stck_lwpr),
            close: Number(item.stck_prpr),
            volume: Number(item.cntg_vol),
        })).reverse(),
    }

    return Response.json(minuteQuoteResponse)
}