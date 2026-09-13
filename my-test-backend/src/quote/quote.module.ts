import { Module } from '@nestjs/common'
import { QuoteController } from './quote.controller.js'
import { QuoteService } from './quote.service.js'

@Module({
  controllers: [QuoteController],
  providers: [QuoteService],
})
export class QuoteModule {}
