export type MinuteQuoteItem = {
    time: string
    open: number
    high: number
    low: number
    close: number
    volumn: number
}

export type MinuteQuoteResponse = {
    currentPrice: number
    changeAmount: number
    changeRate: number
    minuteQuoteItems: MinuteQuoteItem[]
}

export type USStockInfo = {
    symbol: string
    currentPrice: number
    changeAmount: number
    changeRate: number
    volume: number
}