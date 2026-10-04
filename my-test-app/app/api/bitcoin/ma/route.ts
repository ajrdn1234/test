import { NextResponse } from 'next/server'

export const GET = async () => {
    const res = await fetch('https://api.coinone.co.kr/public/v2/chart/KRW/BTC?interval=1m&size=60')
    const data = await res.json()
    return NextResponse.json(data)
}
