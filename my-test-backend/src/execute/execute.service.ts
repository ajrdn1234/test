import { Injectable, Logger } from '@nestjs/common'
import { Interval } from '@nestjs/schedule'
import { QuoteService } from '../quote/quote.service.js'
import { TradeStateService } from '../trade-state/trade-state.service.js'
import { TradeLogService } from '../trade-log/trade-log.service.js'

const MARKET = 'KRW-BTC'
const WINDOW_SIZE = 60
const TREND_THRESHOLD = 0

@Injectable()
export class ExecuteService {
    private readonly logger = new Logger(ExecuteService.name)

    constructor(
        private readonly quoteService: QuoteService,
        private readonly tradeStateService: TradeStateService,
        private readonly tradeLogService: TradeLogService,
    ) {}

    async onModuleInit() {
        const state = await this.tradeStateService.getOrCreate()
        if(state.isExecuting) {
            await this.tradeStateService.update(state.id, { isExecuting: false })
            this.logger.warn('initialized')
        }
    }

    @Interval(1000)
    async handleInterval() {
        const state = await this.tradeStateService.getOrCreate()

        if(state.isExecuting) {
            this.logger.warn('executing')
            return
        }

        await this.tradeStateService.update(state.id, { isExecuting: true })

        try {
            const currentPrice = await this.quoteService.getCurrentPrice(MARKET)

            const recentLogs = await this.tradeLogService.getRecent(WINDOW_SIZE - 1)
            const prices = [...recentLogs.map((log) => log.price), currentPrice]

            let netChange = 0
            for(let i = 1; i < prices.length; i++) {
                netChange += prices[i] - prices[i - 1]
            }

            const isRising = netChange > TREND_THRESHOLD
            const isFalling = netChange < -TREND_THRESHOLD

            let action: 'buy' | 'sell' | null = null
            let newHolding = state.holding

            if(!state.holding && isRising) {
                action = 'buy'
                newHolding = true
            } else if(state.holding && isFalling) {
                action = 'sell'
                newHolding = false
            }

            await this.tradeLogService.create(currentPrice, action)
            await this.tradeStateService.update(state.id, { holding: newHolding })

            this.logger.log(`가격: ${currentPrice}, netChange: ${netChange}, action: ${action}`)
        } finally {
            await this.tradeStateService.update(state.id, { isExecuting: false })
        }
    }
}
