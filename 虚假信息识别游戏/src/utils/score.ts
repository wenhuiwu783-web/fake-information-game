export type Judgment = 'trust' | 'unsure' | 'doubt'

export interface PlayerAction {
  eventId: number
  truth: boolean
  judgment: Judgment
  investigated: boolean
  responded: boolean
}

/**
 * 计算单个事件的积分
 */
export function calculateEventScore(action: PlayerAction): number {
  if (action.truth) {
    // ── 真实事件 ──
    if (action.judgment === 'trust') return 10
    return 0 // 其他（不确定/不可信）
  }

  // ── 虚假事件 ──
  if (action.judgment === 'doubt') {
    if (action.investigated && action.responded) return 10
    if (action.responded) return 6 // 仅回应，未调查
    return 0
  }

  if (action.judgment === 'unsure') {
    if (action.investigated && action.responded) return 9
    if (action.responded) return 5 // 仅回应，未调查
    return 0
  }

  // 可信 → 0
  return 0
}

/**
 * 计算所有事件的总积分
 */
export function calculateTotalScore(actions: PlayerAction[]): number {
  return actions.reduce((total, action) => total + calculateEventScore(action), 0)
}

/**
 * 计算满分（用于百分比展示）
 */
export function calculateMaxScore(actions: PlayerAction[]): number {
  return actions.reduce((total, action) => {
    // 每种事件最高可得 10 分
    return total + 10
  }, 0)
}

/**
 * 计算得分百分比
 */
export function calculateScorePercent(actions: PlayerAction[]): number {
  const max = calculateMaxScore(actions)
  if (max === 0) return 0
  return Math.round((calculateTotalScore(actions) / max) * 100)
}

/**
 * 获取评分等级
 */
export function getGrade(percent: number): { label: string; color: string } {
  if (percent >= 90) return { label: '信息辨别专家', color: '#3fb950' }
  if (percent >= 70) return { label: '信息辨别能手', color: '#58a6ff' }
  if (percent >= 50) return { label: '信息辨别新星', color: '#d29922' }
  return { label: '需要继续学习', color: '#da3633' }
}
