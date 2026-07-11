import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const redisUrl = process.env.KV_REST_API_URL
    const redisToken = process.env.KV_REST_API_TOKEN

    if (!redisUrl || !redisToken) {
      return res.status(500).json({ error: 'Redis configuration missing' })
    }

    // 获取所有会话数据
    const response = await fetch(`${redisUrl}/lrange/sessions/0/-1`, {
      headers: {
        'Authorization': `Bearer ${redisToken}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[dashboard] Redis API error:', response.status, errorText)
      return res.status(500).json({ error: 'Failed to fetch data' })
    }

    const data = await response.json()

    // 解析 Redis 返回的字符串数组为 JSON 对象
    const sessions = data.result
      .map((item: any) => {
        // 兼容 Redis 多层嵌套结构 [["..."], ...]
        const raw = Array.isArray(item) ? item[0] : item
        return typeof raw === 'string' ? JSON.parse(raw) : raw
      })
      .filter((s: any) => s != null && s.sessionId !== 'manual-test')

    // 按提交时间倒序排列
    sessions.sort((a: any, b: any) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )

    return res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    })
  } catch (e) {
    console.error('[dashboard] API error:', e)
    return res.status(500).json({ error: 'Server error' })
  }
}
