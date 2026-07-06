/**
 * 数据埋点类型定义
 */

/** 判断类型 */
export type Judgment = 'trust' | 'unsure' | 'doubt'

/** 弹窗操作类型 */
export type ModalAction = 'investigate' | 'respond' | 'dismiss'

/** 交互类型 */
export type InteractionType = 'image_zoom' | 'video_play' | 'source_click'

// ============ Session 层 ============

export interface Session {
  sessionId: string
  startTime: number
  endTime?: number
  ending?: EndingType
  finalScore?: number
  finalPercent?: number
}

export type EndingType = '沦陷' | '清醒' | '真相'

// ============ Event 层 ============

export interface EventLog {
  eventId: number
  truth: boolean
  type: string // 'text' | 'image' | 'video'

  messageShownAt: number
  judgmentAt?: number
  decisionTimeMs?: number
  judgment?: Judgment

  modalOpenedAt?: number
  modalAction?: ModalAction
  modalActionAt?: number
  modalDecisionTimeMs?: number

  investigated: boolean
  investigateEnterAt?: number
  investigateExitAt?: number
  investigateDwellMs?: number

  responded: boolean
  respondedAt?: number

  score: number
}

// ============ Interaction 层 ============

export interface InteractionLog {
  type: InteractionType
  eventId: number
  timestamp: number
  url?: string
}

// ============ 汇总 ============

export interface AnalyticsData {
  session: Session
  events: EventLog[]
  interactions: InteractionLog[]
}
