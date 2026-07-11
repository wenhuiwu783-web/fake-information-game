import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts'

// ---- 类型定义 ----

interface ExportSession {
  sessionId: string
  ip: string
  submittedAt: string
  startTime: number
  endTime: number
  ending: string
  events: ExportEvent[]
  interactions: any[]
  userAgent: string
  screenSize: string
}

interface ExportEvent {
  eventId: number
  truth: boolean
  type: string
  text?: string
  messageShownAt: number
  investigated: boolean
  responded: boolean
  judgment?: string
  decisionTimeMs?: number
  score: number
}

interface ExportResponse {
  success: boolean
  count: number
  sessions: ExportSession[]
}

// ---- 常量 ----

const COLORS = ['#ff4757', '#2ed573', '#ffa502', '#a55eea', '#1e90ff']
const PIE_COLORS = ['#ff6b81', '#2ed573', '#ffa502']

const ENDING_LABELS: Record<string, string> = {
  'v': '沦陷',
  '-9': '清醒',
  '-10': '真相',
  '清醒': '清醒',
  '沦陷': '沦陷',
  '真相': '真相',
}

// ---- 组件 ----

function DashboardPage() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<ExportSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((data: ExportResponse) => {
        if (data.success) {
          setSessions(data.sessions)
        } else {
          setError('获取数据失败')
        }
      })
      .catch(() => setError('网络错误'))
      .finally(() => setLoading(false))
  }, [])

  // ---- 衍生统计 ----

  // 结局分布
  const endingDist = Object.entries(
    sessions.reduce<Record<string, number>>((acc, s) => {
      const key = s.ending ?? ''
      const label = ENDING_LABELS[key] ?? s.ending ?? '未知'
      acc[label] = (acc[label] || 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  // 每日游戏次数
  const dayMap = sessions.reduce<Record<string, number>>((acc, s) => {
    if (s.submittedAt) {
      const day = s.submittedAt.slice(0, 10)
      acc[day] = (acc[day] || 0) + 1
    }
    return acc
  }, {})
  const dailyTrend = Object.entries(dayMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date: date.slice(5), count }))

  // 事件正确率
  const allEvents = sessions.flatMap((s) => s.events)
  const eventAccuracy = allEvents.reduce<Record<string, { correct: number; total: number }>>((acc, e) => {
    const key = `事件 #${e.eventId}`
    if (!acc[key]) acc[key] = { correct: 0, total: 0 }
    acc[key].total++
    // 假消息判断为 doubt → 正确；真消息判断为 trust → 正确
    const isCorrect =
      (e.truth === false && e.judgment === 'doubt') ||
      (e.truth === true && e.judgment === 'trust')
    if (isCorrect) acc[key].correct++
    return acc
  }, {})
  const accuracyData = Object.entries(eventAccuracy).map(([name, v]) => ({
    name,
    rate: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0,
    total: v.total,
  }))

  // 判断分布
  const judgmentDist = allEvents
    .filter((e) => e.judgment)
    .reduce<Record<string, number>>((acc, e) => {
      const j = e.judgment === 'trust' ? '相信' : e.judgment === 'unsure' ? '不确定' : e.judgment === 'doubt' ? '怀疑' : e.judgment
      acc[j] = (acc[j] || 0) + 1
      return acc
    }, {})
  const judgmentData = Object.entries(judgmentDist).map(([name, value]) => ({ name, value }))

  // 屏幕尺寸分布
  const screenDist = sessions.reduce<Record<string, number>>((acc, s) => {
    if (s.screenSize) {
      acc[s.screenSize] = (acc[s.screenSize] || 0) + 1
    }
    return acc
  }, {})
  const screenData = Object.entries(screenDist)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }))

  // 唯一 IP 数
  const uniqueIPs = new Set(sessions.map((s) => s.ip)).size

  // 平均决策时间
  const decisionTimes = allEvents
    .filter((e) => e.decisionTimeMs != null && e.decisionTimeMs > 0)
    .map((e) => e.decisionTimeMs!)
  const avgDecisionTime =
    decisionTimes.length > 0
      ? Math.round(decisionTimes.reduce((a, b) => a + b, 0) / decisionTimes.length)
      : 0

  // 求证使用率
  const investigatedCount = allEvents.filter((e) => e.investigated).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-white text-lg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>正在加载数据...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white gap-4">
        <p className="text-red-400 text-lg">{error}</p>
        <button onClick={() => navigate('/')} className="text-sm text-blue-400 underline">
          返回首页
        </button>
      </div>
    )
  }

  return (
    <div
      className="h-full overflow-y-auto scrollbar-hide"
      style={{ backgroundColor: '#0d0d1a' }}
    >
      {/* 顶栏 */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3" style={{ backgroundColor: '#0d0d1a', borderBottom: '1px solid #1a1a2e' }}>
        <button onClick={() => navigate('/')} className="text-white/60 text-sm hover:text-white transition-colors">
          ← 返回
        </button>
        <h1 className="text-white text-base font-semibold tracking-wide">📊 数据看板</h1>
        <div className="text-white/40 text-xs">{sessions.length} 局</div>
      </div>

      <div className="px-3 py-4 space-y-4 max-w-lg mx-auto">

        {/* ===== 概览卡片 ===== */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: '总局数', value: sessions.length, color: '#2ed573' },
            { label: '玩家数', value: uniqueIPs, color: '#1e90ff' },
            { label: '平均决策', value: `${(avgDecisionTime / 1000).toFixed(1)}s`, color: '#ffa502' },
            { label: '求证率', value: allEvents.length > 0 ? `${Math.round((investigatedCount / allEvents.length) * 100)}%` : '0%', color: '#a55eea' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl p-3 text-center"
              style={{ backgroundColor: '#141428', border: '1px solid #1e1e3a' }}
            >
              <div className="text-2xl font-bold mb-1" style={{ color: item.color }}>{item.value}</div>
              <div className="text-[11px] text-white/50">{item.label}</div>
            </div>
          ))}
        </div>

        {/* ===== 结局分布 ===== */}
        {endingDist.length > 0 && (
          <Card title="🎯 结局分布">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={endingDist}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={40}
                  paddingAngle={3}
                >
                  {endingDist.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip
                  contentStyle={{ backgroundColor: '#1a1a30', border: '1px solid #2a2a4a', borderRadius: 8, color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-1 text-xs">
              {endingDist.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-white/70">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ===== 每日趋势 ===== */}
        {dailyTrend.length > 1 && (
          <Card title="📈 每日游戏趋势">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
                <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fill: '#888', fontSize: 11 }} />
                <ReTooltip
                  contentStyle={{ backgroundColor: '#1a1a30', border: '1px solid #2a2a4a', borderRadius: 8, color: '#fff' }}
                />
                <Line type="monotone" dataKey="count" stroke="#2ed573" strokeWidth={2} dot={{ fill: '#2ed573', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* ===== 事件正确率 ===== */}
        {accuracyData.length > 0 && (
          <Card title="📊 各事件正确率">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={accuracyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#888', fontSize: 11 }} unit="%" />
                <YAxis type="category" dataKey="name" tick={{ fill: '#aaa', fontSize: 10 }} width={60} />
                <ReTooltip
                  contentStyle={{ backgroundColor: '#1a1a30', border: '1px solid #2a2a4a', borderRadius: 8, color: '#fff' }}
                  formatter={((value: number | string) => [`${value}%`, '正确率']) as any}
                />
                <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                  {accuracyData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* ===== 判断分布 ===== */}
        {judgmentData.length > 0 && (
          <Card title="🔍 玩家判断分布">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={judgmentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  innerRadius={35}
                  paddingAngle={3}
                >
                  {judgmentData.map((_, i) => (
                    <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip
                  contentStyle={{ backgroundColor: '#1a1a30', border: '1px solid #2a2a4a', borderRadius: 8, color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-3 mt-1 text-xs">
              {judgmentData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[(i + 2) % COLORS.length] }} />
                  <span className="text-white/70">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ===== 屏幕尺寸分布 ===== */}
        {screenData.length > 0 && (
          <Card title="📱 屏幕尺寸分布">
            <ResponsiveContainer width="100%" height={screenData.length * 28 + 30}>
              <BarChart data={screenData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
                <XAxis type="number" tick={{ fill: '#888', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#aaa', fontSize: 10 }} width={70} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="#1e90ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* ===== 每局详情 ===== */}
        <Card title="📋 每局记录">
          <div className="space-y-1.5">
            {sessions.map((s) => (
              <div key={s.sessionId}>
                <button
                  onClick={() => setExpandedId(expandedId === s.sessionId ? null : s.sessionId)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors"
                  style={{ backgroundColor: '#181830', border: '1px solid #222244' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white/80">{s.submittedAt?.slice(0, 16).replace('T', ' ')}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{
                      backgroundColor: s.ending === 'v' || s.ending === '沦陷' ? '#ff475720' : s.ending === '-9' || s.ending === '清醒' ? '#2ed57320' : '#ffa50220',
                      color: s.ending === 'v' || s.ending === '沦陷' ? '#ff4757' : s.ending === '-9' || s.ending === '清醒' ? '#2ed573' : '#ffa502',
                    }}>
                      {ENDING_LABELS[s.ending ?? ''] || s.ending || '?'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-xs">{s.ip?.slice(0, 10)}...</span>
                    <span className="text-white/30 text-xs">{expandedId === s.sessionId ? '▲' : '▼'}</span>
                  </div>
                </button>
                {expandedId === s.sessionId && (
                  <div className="mx-3 mt-1 mb-2 p-2.5 rounded-lg text-xs space-y-1" style={{ backgroundColor: '#101020', border: '1px solid #1a1a35' }}>
                    <div className="text-white/50">ID: <span className="text-white/70">{s.sessionId}</span></div>
                    <div className="text-white/50">IP: <span className="text-white/70">{s.ip}</span></div>
                    <div className="text-white/50">设备: <span className="text-white/70">{s.screenSize}</span></div>
                    <div className="text-white/50">UA: <span className="text-white/70 truncate block">{s.userAgent?.slice(0, 60)}...</span></div>
                    <div className="text-white/50">事件数: <span className="text-white/70">{s.events?.length || 0}</span></div>
                    {s.events && s.events.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <div className="text-white/40 text-[10px] uppercase tracking-wider">事件记录</div>
                        {s.events.map((e, i) => (
                          <div key={i} className="flex flex-wrap gap-1" style={{ color: '#888' }}>
                            <span className={e.truth ? 'text-green-400' : 'text-red-400'}>
                              #{e.eventId} {e.type}
                            </span>
                            <span>| 判断: {e.judgment || '-'}</span>
                            <span>| 得分: <span className={e.score >= 0 ? 'text-green-400' : 'text-red-400'}>{e.score}</span></span>
                            {e.decisionTimeMs != null && (
                              <span>| 耗时: {(e.decisionTimeMs / 1000).toFixed(1)}s</span>
                            )}
                            {e.investigated && <span className="text-blue-400">| 已求证</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* 底部留白 */}
        <div className="h-8" />
      </div>
    </div>
  )
}

// ---- 卡片包装组件 ----

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-3.5"
      style={{ backgroundColor: '#12122a', border: '1px solid #1e1e3e' }}
    >
      <h2 className="text-white/80 text-sm font-medium mb-3">{title}</h2>
      {children}
    </div>
  )
}

export default DashboardPage
