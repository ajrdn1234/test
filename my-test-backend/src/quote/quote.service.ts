import { Injectable } from '@nestjs/common'

@Injectable()
export class QuoteService {
    async getCurrentPrice(market: string): Promise<number> {
        const res = await fetch(`https://api.upbit.com/v1/ticker?markets=${market}`)
        const data = await res.json()
        return data[0].trade_price
    }
}
