import { Injectable, Logger } from '@nestjs/common'
import { Interval } from '@nestjs/schedule'

@Injectable()
export class ExecuteService {
    private readonly logger = new Logger(ExecuteService.name)

    @Interval(1000)
    handleInterval() {
        this.logger.log('execute')
    }
}
