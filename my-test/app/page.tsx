'use client'

import { useEffect, useRef, useState } from 'react'

type Log = {
  state: 'buy' | 'sell'
  price: number
}

export default function Home() {
  const [logs, setLogs] = useState<Log[]>([])
  const [isHolding, setIsHolding] = useState<boolean>(false)
  const [price, setPrice] = useState<number>(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    timerRef.current = setInterval(async () => {
      const res = await fetch('/api/bitcoin')
      const data = await res.json()
      if(!isHolding && price > data.price) {
        setLogs((preLogs) => [...preLogs, {
          state: 'buy',
          price: data.price
        }])
        setIsHolding(true)
      } else if(data.price !== price && isHolding) {
        setLogs((preLogs) => [...preLogs, {
          state: 'sell',
          price: data.price
        }])
        setIsHolding(false)
      }
      setPrice(data.price)
    }, 1000)

    return () => {
      if(timerRef.current) clearInterval(timerRef.current)
    }
  }, [isHolding, price])

  return (
    <div>
      <p>현재 가격: {price}원</p>
      {logs.map((log, index) => <p key={index}>{log.state}: {log.price}</p>)}
    </div>
  )
}
