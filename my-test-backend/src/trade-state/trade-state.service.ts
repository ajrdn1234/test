import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'

@Injectable()
export class TradeStateService {
    constructor(private readonly prisma: PrismaService) {}

    async getOrCreate() {
        const existing = await this.prisma.tradeState.findFirst()

        if(existing) return existing

        return this.prisma.tradeState.create({
            data: {},
        })
    }

    async update(id: number, data: { isExecuting?: boolean; isHolding?: boolean }) {
        return this.prisma.tradeState.update({
            where: { id },
            data,
        })
    }
}
