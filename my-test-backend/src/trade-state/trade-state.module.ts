import { Module } from '@nestjs/common'
import { TradeStateService } from './trade-state.service.js'
import { PrismaModule } from '../prisma/prisma.module.js'
import { TradeStateController } from './trade-state.controller.js';

@Module({
  imports: [PrismaModule],
  providers: [TradeStateService],
  exports: [TradeStateService],
  controllers: [TradeStateController],
})
export class TradeStateModule {}
