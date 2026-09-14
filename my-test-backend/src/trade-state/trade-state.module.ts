import { Module } from '@nestjs/common'
import { TradeStateService } from './trade-state.service.js'
import { PrismaModule } from '../prisma/prisma.module.js'

@Module({
  imports: [PrismaModule],
  providers: [TradeStateService],
  exports: [TradeStateService],
})
export class TradeStateModule {}
