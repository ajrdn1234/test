import { Module } from '@nestjs/common'
import { TradeLogService } from './trade-log.service.js'
import { PrismaModule } from '../prisma/prisma.module.js'
import { TradeLogController } from './trade-log.controller.js'

@Module({
  imports: [PrismaModule],
  providers: [TradeLogService],
  exports: [TradeLogService],
  controllers: [TradeLogController],
})
export class TradeLogModule {}
