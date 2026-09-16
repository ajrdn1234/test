import { Module } from '@nestjs/common'
import { ExecuteService } from './execute.service.js'

@Module({
  providers: [ExecuteService]
})
export class ExecuteModule {}
