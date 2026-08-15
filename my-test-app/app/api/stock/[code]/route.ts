import { getAccessToken } from '@/lib/kis-auth'

type RouteParams = {
  params: Promise<{ code: string }>
}

type StockInfo = {
    code: string
    currentPrice: number
    changeAmount: number
    
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
                appkey: process.env.KIS_VTS_APP_KEY,
                appsecret: process.env.KIS_VTS_APP_SECRET,
                tr_id: 'FHKST01010100',
            },
        },
    )

    const data = await res.json()

    return Response.json(data)
}