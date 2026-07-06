/**
 * 数据埋点核心模块
 * 所有数据存储在 localStorage，key: truth_game_analytics
 */
import type {
  AnalyticsData,
  Judgment,
  ModalAction,
  InteractionType,
  EndingType,
} from './analyticsTypes'
import type { PlayerAction } from './score'

const STORAGE_KEY = 'truth_game_analytics'

// ============ 工具函数 ============

/** 生成简单唯一 ID */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

/** 读取 localStorage 中的数据 */
function loadData(): AnalyticsData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AnalyticsData) : null
  } catch {
    return null
  }
}

/** 写入 localStorage */
function saveData(data: AnalyticsData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('[analytics] 写入失败', e)
  }
}

/** 安全获取时间戳 */
function now(): number {
  return Date.now()
}

// ============ Session 操作 ============

/** 初始化新会话，返回 sessionId */
export function initSession(): string {
  const sessionId = generateId()
  const data: AnalyticsData = {
    session: {
      sessionId,
      startTime: now(),
    },
    events: [],
    interactions: [],
  }
  saveData(data)
  return sessionId
}

/** 获取当前会话 ID（如果不存在则初始化） */
export function getSessionId(): string {
  const data = loadData()
  if (data) return data.session.sessionId
  return initSession()
}

/** 结束会话，记录结局和得分 */
export function endSession(ending: EndingType, finalScore: number, finalPercent: number): void {
  const data = loadData()
  if (!data) return
  data.session.endTime = now()
  data.session.ending = ending
  data.session.finalScore = finalScore
  data.session.finalPercent = finalPercent
  saveData(data)
  
  // 提交数据到服务器
  submitToServer(data)
}

// ============ Event 操作 ============

/** 记录消息显示（打字结束后调用） */
export function logMessageShown(eventId: number, truth: boolean, type: string): void {
  const data = loadData()
  if (!data) return

  // 防止重复记录同一事件
  const exists = data.events.find((e) => e.eventId === eventId)
  if (exists) return

  data.events.push({
    eventId,
    truth,
    type,
    messageShownAt: now(),
    investigated: false,
    responded: false,
    score: 0,
  })
  saveData(data)
}

/** 记录判断 */
export function logJudgment(eventId: number, judgment: Judgment, decisionTimeMs: number): void {
  const data = loadData()
  if (!data) return

  const evt = data.events.find((e) => e.eventId === eventId)
  if (!evt) return

  evt.judgment = judgment
  evt.judgmentAt = now()
  evt.decisionTimeMs = decisionTimeMs
  saveData(data)
}

/** 记录弹窗打开 */
export function logModalOpen(eventId: number): void {
  const data = loadData()
  if (!data) return

  const evt = data.events.find((e) => e.eventId === eventId)
  if (!evt) return

  evt.modalOpenedAt = now()
  saveData(data)
}

/** 记录弹窗操作 */
export function logModalAction(eventId: number, action: ModalAction): void {
  const data = loadData()
  if (!data) return

  const evt = data.events.find((e) => e.eventId === eventId)
  if (!evt) return

  evt.modalAction = action
  evt.modalActionAt = now()
  if (evt.modalOpenedAt) {
    evt.modalDecisionTimeMs = evt.modalActionAt - evt.modalOpenedAt
  }
  saveData(data)
}

/** 记录进入调查页 */
export function logInvestigateEnter(eventId: number): void {
  const data = loadData()
  if (!data) return

  const evt = data.events.find((e) => e.eventId === eventId)
  if (!evt) return

  evt.investigated = true
  evt.investigateEnterAt = now()
  saveData(data)
}

/** 记录离开调查页 */
export function logInvestigateExit(eventId: number): void {
  const data = loadData()
  if (!data) return

  const evt = data.events.find((e) => e.eventId === eventId)
  if (!evt) return

  evt.investigateExitAt = now()
  if (evt.investigateEnterAt) {
    evt.investigateDwellMs = evt.investigateExitAt - evt.investigateEnterAt
  }
  saveData(data)
}

/** 记录回应 */
export function logResponded(eventId: number): void {
  const data = loadData()
  if (!data) return

  const evt = data.events.find((e) => e.eventId === eventId)
  if (!evt) return

  evt.responded = true
  evt.respondedAt = now()
  saveData(data)
}

/** 更新事件得分 */
export function logEventScore(actions: PlayerAction[]): void {
  const data = loadData()
  if (!data) return

  for (const action of actions) {
    const evt = data.events.find((e) => e.eventId === action.eventId)
    if (evt) {
      // 重新计算得分
      evt.score = calculateEventScore(action)
    }
  }
  saveData(data)
}

/** 计算单个事件得分（从 score.ts 复制逻辑） */
function calculateEventScore(action: PlayerAction): number {
  if (action.truth) {
    if (action.judgment === 'trust') return 10
    return 0
  }
  if (action.judgment === 'doubt') {
    if (action.investigated && action.responded) return 10
    if (action.responded) return 6
    return 0
  }
  if (action.judgment === 'unsure') {
    if (action.investigated && action.responded) return 9
    if (action.responded) return 5
    return 0
  }
  return 0
}

// ============ Interaction 操作 ============

/** 记录交互行为 */
export function logInteraction(type: InteractionType, eventId: number, url?: string): void {
  const data = loadData()
  if (!data) return

  data.interactions.push({
    type,
    eventId,
    timestamp: now(),
    url,
  })
  saveData(data)
}

// ============ 数据导出 ============

/** 获取完整数据 */
export function getAnalyticsData(): AnalyticsData | null {
  return loadData()
}

/** 导出为 JSON 文件并下载 */
export function exportData(): void {
  const data = loadData()
  if (!data) {
    alert('暂无数据可导出')
    return
  }

  const exportObj = {
    exportedAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
    screenSize: `${window.screen.width}x${window.screen.height}`,
    ...data,
  }

  const json = JSON.stringify(exportObj, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `truth-game-data-${data.session.sessionId}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/** 清除所有数据 */
export function clearData(): void {
  localStorage.removeItem(STORAGE_KEY)
}

/** 检查是否有数据 */
export function hasData(): boolean {
  return loadData() !== null
}

// ============ 服务器提交 ============

/** 提交数据到服务器（异步，不阻塞 UI） */
async function submitToServer(data: AnalyticsData): Promise<void> {
  try {
    const payload = {
      sessionId: data.session.sessionId,
      data: {
        session: data.session,
        events: data.events,
        interactions: data.interactions,
        userAgent: navigator.userAgent,
        screenSize: `${window.screen.width}x${window.screen.height}`,
      },
    }

    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.warn('[analytics] 服务器返回异常:', response.status)
    } else {
      console.log('[analytics] 数据提交成功')
    }
  } catch (e) {
    // 静默失败，不影响游戏体验
    console.warn('[analytics] 数据提交失败，仅保存在本地:', e)
  }
}

/** 手动触发数据提交（用于调试） */
export async function manualSubmit(): Promise<boolean> {
  const data = loadData()
  if (!data) return false
  
  try {
    await submitToServer(data)
    return true
  } catch (e) {
    console.error('[analytics] 手动提交失败:', e)
    return false
  }
}
