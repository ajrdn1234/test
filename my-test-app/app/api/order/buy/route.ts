import { getAccessToken } from '@/lib/kis-auth'

export const POST = async () => {
    const token = await getAccessToken()

    const res = await fetch(
    'https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/trading/order-cash',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
        appkey: process.env.KIS_VTS_APP_KEY!,
        appsecret: process.env.KIS_VTS_APP_SECRET!,
        tr_id: 'VTTC0012U',
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

  const data = await res.json()
  
  return Response.json({ data })
}