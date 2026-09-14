import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { QuoteModule } from './quote/quote.module.js'
import { PrismaModule } from './prisma/prisma.module.js';
import { TradeStateModule } from './trade-state/trade-state.module.js';

@Module({
  imports: [QuoteModule, PrismaModule, TradeStateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
