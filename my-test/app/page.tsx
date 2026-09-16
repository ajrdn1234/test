'use client'

import { useEffect, useRef, useState } from 'react'

type Log = {
  state: 'buy' | 'sell'
  price: number
}

export default function Home() {
  const [logs, setLogs] = useState<Log[]>([])
  const isHoldingRef = useRef<boolean>(false)
  const [price, setPrice] = useState<number>(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const total = logs.reduce((acc, cur, index, arr) => index % 2 === 1 ? acc + (cur.price - arr[index - 1].price) : acc + 0, 0)

  useEffect(() => {
    timerRef.current = setInterval(async () => {
      const res = await fetch('/api/bitcoin')
      const data = await res.json()
      if(!isHoldingRef.current && price > data.price) {
        setLogs((preLogs) => [...preLogs, {
          state: 'buy',
          price: data.price
        }])
        isHoldingRef.current = true
      } else if(isHoldingRef.current && data.price !== price) {
        setLogs((preLogs) => [...preLogs, {
          state: 'sell',
          price: data.price
        }])
        isHoldingRef.current = false
      }
      setPrice(data.price)
    }, 1000)

    return () => {
      if(timerRef.current) clearInterval(timerRef.current)
    }
  }, [price])

  return (
    <div>
      <p>현재 가격: {price}원</p>
      <p>합계: {total}원</p>
      {logs.map((log, index) => <p key={index}>{log.state}: {log.price}</p>)}
    </div>
  )
}
