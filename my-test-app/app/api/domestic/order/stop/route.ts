import dayjs from '@/lib/dayjs'
import { db } from '@/lib/db'

export const POST = async () => {
    const now = dayjs().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')

    const result = await db.execute({
        sql: 'UPDATE trade_state SET is_running = 0, updated_at = ? WHERE is_running = 1',
        args: [now],
    })

    return Response.json({
        message: '자동 매매 중지',
        updatedRows: result.rowsAffected,
    })
}