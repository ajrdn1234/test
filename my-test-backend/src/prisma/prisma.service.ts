import 'dotenv/config'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../generated/prisma/client.js'

const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL!,
})

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super({ adapter })
    }

    async onModuleInit() {
        await this.$connect()
    }
}
