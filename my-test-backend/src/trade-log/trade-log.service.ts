import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'

@Injectable()
export class TradeLogService {
    constructor(private readonly prisma: PrismaService) {}

    async create(price: number, action: 'buy' | 'sell' | null) {
        return this.prisma.tradeLog.create({
            data: { price, action }
        })
    }

    async getRecent(count: number) {
        const logs = await this.prisma.tradeLog.findMany({
            orderBy: { id: 'desc' },
            take: count,
        })
        return logs.reverse()
    }
}
