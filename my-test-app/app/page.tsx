'use client'

import { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'

type Candle = {
    candleTimestamp: number
    first: number
    high: number
    low: number
    last: number
}

const PING_INTERVAL_MS = 1000 * 60 * 25

export default function Home() {
    const [candlesByFetch, setCandlesByFetch] = useState<Candle[]>([])
    const [candlesByWS, setCandlesByWS] = useState<Candle[]>([])
    const [currentCandle, setCurrentCandle] = useState<Candle | null>(null)
    const candleRef = useRef<Candle | null>(null)

    const fetchInitialCandles = async () => {
        const res = await fetch('/api/bitcoin/ma')
        const data = await res.json()
        setCandlesByFetch(data.chart.map((candle: any) => ({
            candleTimestamp: candle.timestamp,
            first: Number(candle.open),
            high: Number(candle.high),
            low: Number(candle.low),
            last: Number(candle.close),
        })).sort((a: Candle, b: Candle) => a.candleTimestamp - b.candleTimestamp))
    }

    useEffect(() => {
        const ws = new WebSocket('wss://stream.coinone.co.kr')
        let pingTimer: ReturnType<typeof setInterval>

        ws.onopen = () => {
            ws.send(
                JSON.stringify({
                    request_type: 'SUBSCRIBE',
                    channel: 'CHART',
                    topic: {
                        quote_currency: 'KRW',
                        target_currency: 'BTC',
                        interval: '1m'
                    },
                }),
            )

            pingTimer = setInterval(() => {
                ws.send(JSON.stringify({ request_type: 'PING' }))
            }, PING_INTERVAL_MS)
        }
        
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data)
            
            if(message.response_type !== 'DATA' || message.channel !== 'CHART') return

            const nextCandle: Candle = {
                candleTimestamp: message.data.candle_timestamp,
                first: Number(message.data.first),
                high: Number(message.data.high),
                low: Number(message.data.low),
                last: Number(message.data.last),
            }
            const prev = candleRef.current

            if(prev && prev.candleTimestamp !== nextCandle.candleTimestamp) {
                setCandlesByWS((prevCandles) => [...prevCandles.filter((candle) => candle.candleTimestamp !== prev.candleTimestamp), prev])
                fetchInitialCandles()
            }

            candleRef.current = nextCandle
            setCurrentCandle(nextCandle)
        }

    return () => {
        clearInterval(pingTimer)
        ws.close()
    }
    }, [])

    return (
        <div>
            {currentCandle && <p>1분봉: {currentCandle?.last}</p>}
            <p>웹소캣</p>
            {candlesByWS.map((candle) => (
                <p key={candle.candleTimestamp}>
                    {dayjs(candle.candleTimestamp).format('YYYY-MM-DD HH:mm')} 종가: {candle.last}
                </p>
            ))}
            <p>REST API</p>
            {candlesByFetch.map((candle) => (
                <p key={candle.candleTimestamp}>
                    {dayjs(candle.candleTimestamp).format('YYYY-MM-DD HH:mm')} 종가: {candle.last}
                </p>
            ))}
        </div>
    )
}
