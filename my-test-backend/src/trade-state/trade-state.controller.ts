import { Controller, Get } from '@nestjs/common'
import { TradeStateService } from './trade-state.service.js'

@Controller('trade-state')
export class TradeStateController {
    constructor(private readonly tradeStateService: TradeStateService) {}

    @Get()
    async getState() {
        return this.tradeStateService.getOrCreate()
    }
}
