import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import WebSocket from 'ws'

@Injectable()
export class QuoteService implements OnModuleInit {
    private readonly logger = new Logger(QuoteService.name)
    private ws: WebSocket
    private lastPrice: number | null = null

    onModuleInit() {
        this.connect()
    }

    private connect() {
        this.ws = new WebSocket('wss://stream.coinone.co.kr')

        this.ws.on('open', () => {
            this.logger.log('connected')
            this.ws.send(JSON.stringify({
                request_type: 'SUBSCRIBE',
                channel: 'TICKER',
                topic: {
                    quote_currency: 'KRW',
                    target_currency: 'BTC',
                },
            }))
        })

        this.ws.on('message', (raw) => {
            const message = JSON.parse(raw.toString())

            if(message.response_type === 'DATA' && message.channel === 'TICKER') {
                this.lastPrice = Number(message.data.last)
                this.logger.log(`price: ${this.lastPrice}`)
            }
        })

        this.ws.on('close', () => {
            this.logger.warn('disconnected')
            this.connect()
        })

        this.ws.on('error', (err) => {
            this.logger.error('error:', err)
        })
    }

    getCurrentPrice(): number | null {
        return this.lastPrice
    }
}
