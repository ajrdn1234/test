const GET = async () => {
    const res = await fetch('https://api.upbit.com/v1/candles/minutes/1?market=KRW-BTC&count=200')
    const data = await res.json()
    return Response.json(data)
}