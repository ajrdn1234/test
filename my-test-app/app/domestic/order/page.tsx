'use client'

import { useEffect, useRef, useState } from 'react'

export default function Order() {
    const [result, setResult] = useState<string | null>(null)
    const [isRunning, setIsRunning] = useState(false)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const start = async () => {
        setResult('시작 중...')

        const res = await fetch('/api/domestic/order/start', {
            method: 'POST',
        })
        const data = await res.json()

        setResult(`자동 매매 시작 (세션 ID: ${data.tradeId} 시작가: ${data.startPrice.toLocaleString()}원)`)
        setIsRunning(true)

        intervalRef.current = setInterval(async () => {
            const execRes = await fetch('/api/domestic/order/execute', {
                method: 'POST'
            })
            const execData = await execRes.json()
            setResult(`현재가: ${execData.currentPrice?.toLocaleString()}원, riseCount: ${execData.riseCount}, action: ${execData.action ?? "없음"}`)
        }, 60 * 1000)
    }

    const stop =  async () => {
        if(intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }

        setResult('중지 중...')

        const res = await fetch('/api/domestic/order/stop', {
            method: 'POST',
        })
        const data = await res.json()

        setResult(`자동 매매 중지 (변경된 세션 수: ${data.updatedRows})`)
        setIsRunning(false)
    }

    useEffect(() => () => { if(intervalRef.current) clearInterval(intervalRef.current)}, [])

    return (
        <div>
            {!isRunning ? <button onClick={start}>자동 매매 시작</button> : <button onClick={stop}>자동 매매 중지</button>}
            {result && <p>{result}</p>}
        </div>
    )
}