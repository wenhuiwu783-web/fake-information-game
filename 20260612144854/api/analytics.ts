import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { sessionId, data } = req.body

    if (!sessionId || !data) {
      return res.status(400).json({ error: 'Missing sessionId or data' })
    }

    // 获取 Redis 连接 URL 和 Token
    const redisUrl = process.env.KV_REST_API_URL
    const redisToken = process.env.KV_REST_API_TOKEN

    if (!redisUrl || !redisToken) {
      console.error('[analytics] Redis environment variables not set')
      return res.status(500).json({ error: 'Server configuration error' })
    }

    // 构造 Redis 数据
    const redisData = {
      sessionId,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown',
      submittedAt: new Date().toISOString(),
      ...data,
    }

    // 使用 Redis REST API 存储数据
    // 使用 LPUSH 将数据添加到 sessions 列表
    const response = await fetch(`${redisUrl}/lpush/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${redisToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([JSON.stringify(redisData)]),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[analytics] Redis API error:', response.status, errorText)
      return res.status(500).json({ error: 'Failed to store data' })
    }

    return res.status(200).json({ success: true })
  } catch (e) {
    console.error('[analytics] API error:', e)
    return res.status(500).json({ error: 'Server error' })
  }
}