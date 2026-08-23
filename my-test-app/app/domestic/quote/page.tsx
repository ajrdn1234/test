'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { StockInfo, USStockInfo } from '@/lib/types'

export default function Quote() {
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null)
  // const [usStockInfo, setUSStockInfo] = useState<USStockInfo | null>(null)

  useEffect(() => {
    fetch('/api/stock/005930')
    .then((res) => res.json())
    .then((data) => setStockInfo(data))

    // fetch('/api/us-stock/AAPL')
    // .then((res) => res.json())
    // .then((data) => setUSStockInfo(data))
  }, [])

  return (
    <div>
      {stockInfo ? `삼성전자: ${stockInfo.currentPrice.toLocaleString()}원` : 'Loading...'}
      <Link href='/domestic/order'>자동 매매 시작</Link>
    </div>
  )
}