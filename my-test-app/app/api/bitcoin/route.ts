export const GET = async () => {
    const res = await fetch(
        'https://api.upbit.com/v1/ticker?markets=KRW-BTC'
    )

    const data = await res.json()
    return Response.json(data[0].trade_price)
}