import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { QuoteModule } from './quote/quote.module.js'
import { PrismaModule } from './prisma/prisma.module.js'
import { TradeStateModule } from './trade-state/trade-state.module.js'
import { TradeLogModule } from './trade-log/trade-log.module.js'
import { ExecuteModule } from './execute/execute.module.js';

@Module({
  imports: [ScheduleModule.forRoot(), QuoteModule, PrismaModule, TradeStateModule, TradeLogModule, ExecuteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
