'use client'

import { useState } from 'react'

export default function Order() {
    const [result, setResult] = useState<string | null>(null)
    const [isRunning, setIsRunning] = useState(false)

    const start = async () => {
        setResult('시작 중...')

        const res = await fetch('/api/domestic/order/start', {
            method: 'POST',
        })
        const data = await res.json()

        setResult(`자동 매매 시작 (세션 ID: ${data.tradeId} 시작가: ${data.startPrice.toLocaleString()}원)`)
        setIsRunning(true)
    }

    const stop =  async () => {
        setResult('중지 중...')

        const res = await fetch('/api/domestic/order/stop', {
            method: 'POST',
        })
        const data = await res.json()

        setResult(`자동 매매 중지 (변경된 세션 수: ${data.updatedRows})`)
        setIsRunning(false)
    }

    return (
        <div>
            {!isRunning ? <button onClick={start}>자동 매매 시작</button> : <button onClick={stop}>자동 매매 중지</button>}
            {result && <p>{result}</p>}
        </div>
    )
}