import { Module } from '@nestjs/common'
import { ExecuteService } from './execute.service.js'
import { QuoteModule } from '../quote/quote.module.js'
import { TradeStateModule } from '../trade-state/trade-state.module.js'
import { TradeLogModule } from '../trade-log/trade-log.module.js'

@Module({
  imports: [QuoteModule, TradeStateModule, TradeLogModule],
  providers: [ExecuteService],
})
export class ExecuteModule {}
