import { getAccessToken } from '@/lib/kis-auth'
import { StockInfo } from '@/lib/types'

type RouteParams = {
  params: Promise<{ code: string }>
}

export const GET = async (
    request: Request,
    { params }: RouteParams
) => {
    const { code } = await params
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

    return Response.json(stockInfo)
}