'use client'

import { useState } from 'react'

export default function Order() {
    const [start, setStart] = useState<string | null>(null)

    const buy = async () => {
        setStart('주문 중...')

        const res = await fetch('/api/domestic/order/start', {
            method: 'POST',
        })
        const data = await res.json()

        if(data.rt_cd === '0') setStart(`매수 성공! 주문번호: ${data.output.ODNO}`)
        else setStart(`매수 실패: ${data.msg1}`)
    }

    return (
        <div>
            <button onClick={buy}>주식 매수</button>
            {start && <p>{start}</p>}
        </div>
    )
}