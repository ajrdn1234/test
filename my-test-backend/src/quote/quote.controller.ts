import { Controller, Get, Param } from '@nestjs/common'
import { QuoteService } from './quote.service.js'

@Controller('quote')
export class QuoteController {
    constructor(private readonly quoteService: QuoteService) {}

    @Get()
    async getQuote() {
        const price = await this.quoteService.getCurrentPrice()
        return { price }
    }
}
