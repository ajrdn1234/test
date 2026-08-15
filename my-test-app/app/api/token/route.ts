import { getAccessToken } from '@/lib/kis-auth'

export const GET = async () => {
    const token = await getAccessToken()
    return Response.json({ token })
}