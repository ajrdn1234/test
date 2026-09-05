'use client'

import { createChart, LineSeries } from 'lightweight-charts'
import { useEffect, useRef } from 'react'

export default function Quote() {
    // const chartContainerRef = useRef()
    // const chartRef = useRef(null)

    // useEffect(() => {
    //     const chart = createChart(chartContainerRef.current, {
    //         width: chartContainerRef.current.clientWidth,
    //         height: 400,
    //         layout: {
    //             background: { color: '#ffffff' },
    //             textColor: '#333',
    //         },
    //         grid: {
    //             vertLines: { color: '#f0f0f0' },
    //             horzLines: { color: '#f0f0f0' },
    //         },
    //         timeScale: {
    //             timeVisible: true,
    //             secondsVisible: false,
    //         }
    //     })
    //     chartRef.current = chart

    //     const lineSeries = chart.addSeries(LineSeries, {
    //         color: '#f7931a',
    //         lineWidth: 2,
    //     })

    //     const fetchData = async () => {
    //         const res = await fetch('/api/bitcoin/view')
            
    //         const rawData = await res.json()
            
    //         const formatted = rawData.map((candle) => ({
    //             time: Math.floor(new Date(candle.candle_date_time_kst).getTime() / 1000),
    //             value: candle.trade_price,
    //         })).reverse()
            
    //         lineSeries.setData(formatted)
    //     }

    //     fetchData()

    //     const handleResize = () => chart.applyOptions({ width: chartContainerRef.current.clientWidth })
    //     window.addEventListener('resize', handleResize)
        
    //     return () => {
    //         window.removeEventListener('resize', handleResize)
    //         chart.remove()
    //     }
    // }, [])

    // return <div ref={chartContainerRef} />
    return <div></div>
}