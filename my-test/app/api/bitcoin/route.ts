export const GET = async () => {
    const res = await fetch('https://api.coinone.co.kr/public/v2/ticker_new/KRW/BTC')
    const data = await res.json()
    return Response.json({
        price: parseInt(data.tickers[0].last)
    })
}