import { Controller, Get, Param } from '@nestjs/common'
import { QuoteService } from './quote.service.js'

@Controller('quote')
export class QuoteController {
    constructor(private readonly quoteService: QuoteService) {}

    @Get(':market')
    async getQuote(@Param('market') market: string) {
        const price = await this.quoteService.getCurrentPrice(market)
        return { market, price }
    }
}
