export const GET = async () => {
    const res = await fetch('https://api.coinone.co.kr/public/v2/ticker_new/KRW/BTC')
    const data = await res.json()
    return Response.json({
        price: data.tickers[0].last
    })

    // const res = await fetch('https://api.upbit.com/v1/ticker?markets=KRW-BTC')
    // const data = await res.json()
    // return Response.json({
    //     price: data[0].trade_price
    // })
}