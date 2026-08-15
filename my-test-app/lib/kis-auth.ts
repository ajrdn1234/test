let cachedToken: string | null = null;
let cachedTokenExpiresAt: number | null = null;

export const getAccessToken = async () => {
    const now = Date.now()

    if(cachedToken && cachedTokenExpiresAt && now < cachedTokenExpiresAt) return cachedToken
    
    const res = await fetch(
        'https://openapivts.koreainvestment.com:29443/oauth2/tokenP',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                grant_type: 'client_credentials',
                appkey: process.env.KIS_VTS_APP_KEY,
                appsecret: process.env.KIS_VTS_APP_SECRET,
            }),
        }
    )

    const data = await res.json()
    
    const accessToken: string = data.access_token
    cachedToken = accessToken;
    cachedTokenExpiresAt = now + (data.expires_in - 60) * 1000;

    return accessToken
}