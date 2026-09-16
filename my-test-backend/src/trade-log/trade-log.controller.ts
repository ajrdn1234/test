import { Controller, Get, Post } from '@nestjs/common'
import { TradeLogService } from './trade-log.service.js'

@Controller('trade-log')
export class TradeLogController {
    constructor(private readonly tradeLogService: TradeLogService) {}

    @Post()
    async create() {
        const randomPrice = Math.floor(Math.random() * 1000000)
        return this.tradeLogService.create(randomPrice, null)
    }

    @Get()
    async getRecent() {
        return this.tradeLogService.getRecent(10)
    }
}
