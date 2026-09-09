import { getAccessToken } from '@/lib/kis-auth'

export const GET = async () => {
  const token = await getAccessToken()

  const params = new URLSearchParams({
    CANO: process.env.KIS_VTS_ACCOUNT_CANO!,
    ACNT_PRDT_CD: process.env.KIS_VTS_ACCOUNT_PRDT_CD!,
    AFHR_FLPR_YN: 'N',
    OFL_YN: '',
    INQR_DVSN: '02',
    UNPR_DVSN: '01',
    FUND_STTL_ICLD_YN: 'N',
    FNCG_AMT_AUTO_RDPT_YN: 'N',
    PRCS_DVSN: '01',
    CTX_AREA_FK100: '',
    CTX_AREA_NK100: '',
  })

  const res = await fetch(
    `https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/trading/inquire-balance?${params}`,
    {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
        appkey: process.env.KIS_VTS_APP_KEY!,
        appsecret: process.env.KIS_VTS_APP_SECRET!,
        tr_id: 'VTTC8434R',
      },
    }
  )

  const data = await res.json()

  console.log('잔고: ', data.output2[0].dnca_tot_amt)
  console.log('평가금액: ', data.output2[0].tot_evlu_amt)
  console.log('평가손익 합계: ', data.output2[0].evlu_pfls_smtl_amt)

  return Response.json(data)
}