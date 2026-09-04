'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CandlestickSeries, createChart } from 'lightweight-charts'
import { MinuteQuoteResponse } from '@/lib/types'

export default function Quote() {
  const [minuteQuoteResponse, setMinuteQuoteResponse] = useState<MinuteQuoteResponse | null>(null)
  const chartContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/domestic/quote/005930')
    .then((res) => res.json())
    .then((data) => setMinuteQuoteResponse(data))
  }, [])

  useEffect(() => {
    if(!minuteQuoteResponse || !chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
    })

    const chartSerise = chart.addSeries(CandlestickSeries)
    chartSerise.setData(minuteQuoteResponse.minuteQuoteItems)

    return () => chart.remove()
  }, [minuteQuoteResponse])

  if(!minuteQuoteResponse) return <p>Loading...</p>

  return (
    <div>
      <p>삼성전자: {minuteQuoteResponse.currentPrice.toLocaleString()}원</p>
      <div ref={chartContainerRef} />
      <Link href='/domestic/order'>자동 매매 시작</Link>
    </div>
  )
}