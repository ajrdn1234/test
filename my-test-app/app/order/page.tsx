'use client'

import { useState } from 'react'

export default function Home() {
    const [orderResult, setOrderResult] = useState<string | null>(null)

    const buy = async () => {
        setOrderResult('주문 중...')

        const res = await fetch('/api/order/buy', {
            method: 'POST',
        })
        const data = await res.json()

        if(data.rt_cd === '0') setOrderResult(`매수 성공! 주문번호: ${data.output.ODNO}`)
        else setOrderResult(`매수 실패: ${data.msg1}`)
    }

    return (
        <div>
            <button onClick={buy}>주식 매수</button>
            {orderResult && <p>{orderResult}</p>}
        </div>
    )
}