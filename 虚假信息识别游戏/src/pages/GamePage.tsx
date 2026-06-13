import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import eventsData from '../../data/events.json'
import { calculateTotalScore, calculateMaxScore, calculateScorePercent, type PlayerAction, type Judgment } from '../utils/score'

type Event = typeof eventsData[number]

const avatarColors: Record<string, string> = {
  dad: '#f59e0b',
  mom: '#ec4899',
  uncle: '#8b5cf6',
  cousin: '#06b6d4',
  grandpa: '#6b7280',
}

const senderNameMap: Record<string, string> = {
  dad: '爸',
  mom: '妈',
  uncle: '舅',
  cousin: '哥',
  grandpa: '爷',
}

function getTimeStr(index: number): string {
  const hours = [9, 10, 8, 11, 14, 16, 10, 9, 15, 20]
  const mins = ['05', '18', '42', '23', '07', '31', '50', '12', '28', '44']
  return `${String(hours[index % hours.length]).padStart(2, '0')}:${mins[index % mins.length]}`
}

const events = eventsData as Event[]
const ACTIONS_STORAGE_KEY = 'truth_game_actions'

/** 从 localStorage 恢复已记录的 actions，保证跨导航累计 */
function loadActions(): PlayerAction[] {
  try {
    const raw = localStorage.getItem(ACTIONS_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PlayerAction[]) : []
  } catch {
    return []
  }
}

function GamePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // 从 URL 参数读取"从调查页返回"的目标事件（只读，StrictMode 安全）
  const replyEventIdFromUrl = searchParams.get('replyEventId')

  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!replyEventIdFromUrl) return 0
    const targetIndex = events.findIndex((e) => e.id === Number(replyEventIdFromUrl))
    return targetIndex >= 0 ? targetIndex : 0
  })

  const [phase, setPhase] = useState<'typing' | 'message' | 'reply'>(() => {
    return replyEventIdFromUrl ? 'reply' : 'typing'
  })

  const [typingDots, setTypingDots] = useState('')
  const [actions, setActions] = useState<PlayerAction[]>(loadActions)

  // 包装 setActions：同步写入 localStorage，确保跨导航累计
  const saveActions = useCallback((updater: PlayerAction[] | ((prev: PlayerAction[]) => PlayerAction[])) => {
    setActions((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])
  const [imgError, setImgError] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [videoModal, setVideoModal] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [pendingJudgment, setPendingJudgment] = useState<'unsure' | 'doubt' | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 标记是否为"从调查页返回"模式（初始化时判断）
  const isFromInvestigation = !!replyEventIdFromUrl
  // 用 ref 保存初始 URL 参数值，避免 StrictMode 双挂载导致的竞态问题
  const replyUrlRef = useRef(replyEventIdFromUrl)

  const currentEvent = events[currentIndex]
  const isLastEvent = currentIndex >= events.length - 1

  // 从调查页返回时：从 URL 读取完整判断信息，创建 action
  // 注意：不在此处清理 URL 参数，避免 React Router setSearchParams
  // 在 StrictMode 双挂载中引发竞态条件导致 action 丢失
  useEffect(() => {
    if (!isFromInvestigation) return

    const replyEventId = Number(replyEventIdFromUrl)
    const truth = searchParams.get('truth') === 'true'
    const judgment = (searchParams.get('judgment') || 'doubt') as Judgment

    // 创建 action（从 localStorage 恢复已有 actions，确保跨导航累计）
    saveActions((prev) => {
      // 防重复：check 是否已存在同名 action
      const exists = prev.find((a) => a.eventId === replyEventId)
      if (exists) {
        return prev.map((a) =>
          a.eventId === replyEventId ? { ...a, responded: true } : a
        )
      }
      return [
        ...prev,
        {
          eventId: replyEventId,
          truth,
          judgment,
          investigated: true,
          responded: true,
        },
      ]
    })
  }, []) // 只在挂载时

  // 延迟清理 URL 参数（setTimeout 避免 StrictMode 双挂载竞态）
  useEffect(() => {
    if (!isFromInvestigation) return
    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        prev.delete('replyEventId')
        prev.delete('truth')
        prev.delete('judgment')
        return prev
      }, { replace: true })
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // 进入事件 → 先 typing → 1秒后显示消息
  useEffect(() => {
    // 从调查页返回时跳过打字动画，保持 reply 状态
    // 同时检查 ref 和实时 URL，兼容 StrictMode 双挂载
    if (replyUrlRef.current || searchParams.get('replyEventId')) {
      setImgError(false)
      return
    }
    setPhase('typing')
    setImgError(false)
    const timer = setTimeout(() => {
      setPhase('message')
    }, 1000)
    return () => clearTimeout(timer)
  }, [currentIndex, searchParams])

  // 打字点点动画
  useEffect(() => {
    if (phase !== 'typing') return
    const dots = ['', '.', '..', '...']
    let i = 0
    const interval = setInterval(() => {
      setTypingDots(dots[i % dots.length])
      i++
    }, 400)
    return () => clearInterval(interval)
  }, [phase])

  // 全部事件完成 → 进入结局（由"查看结局"按钮直接调用 gotoEnding，此 effect 仅作兜底）

  useEffect(() => {
    if (phase === 'message' || phase === 'reply') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [phase])

  const gotoInvestigation = useCallback(
    (judgment: 'trust' | 'unsure' | 'doubt') => {
      // 记录玩家行为：判断 + 进入调查
      saveActions((prev) => {
        const exists = prev.find((a) => a.eventId === currentEvent.id)
        if (exists) {
          return prev.map((a) =>
            a.eventId === currentEvent.id
              ? { ...a, judgment, investigated: true }
              : a
          )
        }
        return [
          ...prev,
          {
            eventId: currentEvent.id,
            truth: currentEvent.truth,
            judgment,
            investigated: true,
            responded: false,
          },
        ]
      })
      navigate(`/investigation?eventId=${currentEvent.id}&from=game&judgment=${judgment}`)
    },
    [navigate, currentEvent.id, currentEvent.truth]
  )

  const handleJudgment = useCallback(
    (judgment: 'trust' | 'unsure' | 'doubt') => {
      if (judgment === 'trust') {
        gotoInvestigation(judgment)
      } else {
        setPendingJudgment(judgment)
        setShowModal(true)
      }
    },
    [gotoInvestigation]
  )

  const handleModalAction = useCallback(
    (action: 'investigate' | 'respond') => {
      if (!pendingJudgment) return
      if (action === 'investigate') {
        setShowModal(false)
        gotoInvestigation(pendingJudgment)
      } else {
        // 回应：记录行为（未调查），显示回应内容，等待用户点击"下一条"
        setShowModal(false)
        saveActions((prev) => {
          const exists = prev.find((a) => a.eventId === currentEvent.id)
          if (exists) {
            return prev.map((a) =>
              a.eventId === currentEvent.id
                ? { ...a, judgment: pendingJudgment, investigated: false, responded: true }
                : a
            )
          }
          return [
            ...prev,
            {
              eventId: currentEvent.id,
              truth: currentEvent.truth,
              judgment: pendingJudgment,
              investigated: false,
              responded: true,
            },
          ]
        })
        setPendingJudgment(null)
        setPhase('reply')
      }
    },
    [pendingJudgment, gotoInvestigation, currentEvent.id, currentEvent.truth]
  )

  const totalScore = calculateTotalScore(actions)
  const maxScore = calculateMaxScore(actions)

  // 清理调查返回遗留的 URL 参数
  const cleanReplyParams = useCallback(() => {
    if (searchParams.has('replyEventId')) {
      setSearchParams((prev) => {
        prev.delete('replyEventId')
        prev.delete('truth')
        prev.delete('judgment')
        return prev
      }, { replace: true })
    }
  }, [searchParams, setSearchParams])

  // 直接跳转到结局（在点击"查看结局"按钮时调用）
  const gotoEnding = useCallback(() => {
    cleanReplyParams()
    localStorage.removeItem(ACTIONS_STORAGE_KEY) // 清理存档
    const percent = calculateScorePercent(actions)
    if (percent <= 60) {
      navigate('/ending', { replace: true })   // 结局1: 群聊沦陷
    } else if (percent <= 89) {
      navigate('/ending-clear', { replace: true })  // 结局2: 独自清醒
    } else {
      navigate('/ending-truth', { replace: true })  // 结局3: 真相守护者
    }
  }, [actions, navigate, cleanReplyParams])

  // 进入下一个事件
  const goNext = useCallback(() => {
    cleanReplyParams()
    // 重置 ref，确保下一事件正常显示打字动画
    replyUrlRef.current = null
    if (isLastEvent) {
      gotoEnding()
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }, [isLastEvent, gotoEnding, cleanReplyParams])

  // 积分数字增长动画（动画目标为 totalScore）
  const [displayScore, setDisplayScore] = useState(0)
  const [scoreBounce, setScoreBounce] = useState(false)
  const animFrameRef = useRef<number>(0)

  useLayoutEffect(() => {
    const start = displayScore
    const end = totalScore
    if (start === end) return
    const duration = 500
    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress)
      const current = Math.round(start + (end - start) * eased)
      setDisplayScore(current)
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step)
      } else {
        setScoreBounce(true)
        setTimeout(() => setScoreBounce(false), 300)
      }
    }
    animFrameRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [totalScore])

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  return (
    <div className="relative flex flex-col h-full overflow-hidden animate-fade-in-page" style={{ backgroundColor: '#0d1117' }}>
      {/* 顶部状态卡片 */}
      <div className="relative z-10 flex items-center gap-3 px-4 pt-12 pb-3">
        <div className="flex-1 rounded-xl px-4 py-3" style={{ backgroundColor: '#161b22', border: '1px solid #21262d' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[#8b949e] text-[11px]">真相值</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className={`text-white text-[22px] font-bold ${scoreBounce ? 'animate-score-pop' : ''}`}>{displayScore}<span className="text-[#8b949e] text-[14px]">分</span></span>
        </div>

        <div className="flex-1 rounded-xl px-4 py-3" style={{ backgroundColor: '#161b22', border: '1px solid #21262d' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[#8b949e] text-[11px]">事件进度</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#58a6ff">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-white text-[22px] font-bold">{currentIndex + 1}</span>
            <span className="text-[#8b949e] text-[12px]">/10</span>
          </div>
          <div className="w-full h-[3px] rounded-full mt-2" style={{ backgroundColor: '#21262d' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(currentIndex + 1) * 10}%`, backgroundColor: '#58a6ff' }} />
          </div>
        </div>
      </div>

      {/* 聊天头部 */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3">
        <button onClick={() => { localStorage.removeItem(ACTIONS_STORAGE_KEY); navigate('/') }} className="w-8 h-8 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-white text-[16px] font-medium">相亲相爱一家人 (36)</span>
          <span className="text-[#6e7681] text-[11px] mt-0.5">36人在线</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button className="w-8 h-8 flex items-center justify-center relative">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <circle cx="6" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="18" cy="12" r="2" />
            </svg>
            {currentIndex < events.length ? (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] rounded-full bg-[#da3633] text-white text-[9px] font-bold flex items-center justify-center px-1">
                99+
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {/* 警告提示条 */}
      <div className="relative z-10 mx-4 mb-4">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2.5" style={{ backgroundColor: '#161b22', border: '1px solid #21262d' }}>
          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#da3633' }}>
            <span className="text-white text-[11px] font-bold">!</span>
          </div>
          <span className="text-[#8b949e] text-[13px]">群里有大量未验证信息，注意甄别</span>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
        <div className="flex flex-col gap-3">

          {/* 时间分隔 */}
          <div className="flex justify-center my-2">
            <span className="text-[#484f58] text-[11px] px-3 py-0.5 rounded" style={{ backgroundColor: '#161b22' }}>
              {getTimeStr(currentIndex)}
            </span>
          </div>

          {/* 对方正在输入 */}
          {phase === 'typing' && (
            <div className="flex items-start gap-2.5 animate-fade-in">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-[13px] font-bold"
                style={{ backgroundColor: avatarColors[currentEvent.avatar] || '#30363d' }}
              >
                {senderNameMap[currentEvent.avatar] || capitalize(currentEvent.avatar)}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[#8b949e] text-[11px] ml-0.5">{currentEvent.sender}</span>
                <div className="rounded-2xl rounded-tl-sm px-4 py-2.5" style={{ backgroundColor: '#21262d' }}>
                  <span className="text-[#8b949e] text-[14px]">对方正在输入{typingDots}</span>
                </div>
              </div>
            </div>
          )}

          {/* 消息气泡 — 在 message 或 reply 阶段都显示 */}
          {(phase === 'message' || phase === 'reply') && (
            <div className="flex items-start gap-2.5 animate-fade-in" key={`msg-${currentIndex}`}>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-[13px] font-bold"
                style={{ backgroundColor: avatarColors[currentEvent.avatar] || '#30363d' }}
              >
                {senderNameMap[currentEvent.avatar] || capitalize(currentEvent.avatar)}
              </div>

              <div className="flex flex-col gap-1 max-w-[75%]">
                <span className="text-[#8b949e] text-[11px] ml-0.5">{currentEvent.sender}</span>

                {/* 文字类型 */}
                {currentEvent.type === 'text' && (
                  <div className="rounded-2xl rounded-tl-sm px-4 py-2.5" style={{ backgroundColor: '#21262d' }}>
                    <p className="text-white text-[14px] leading-relaxed whitespace-pre-wrap break-words">
                      {currentEvent.content}
                    </p>
                  </div>
                )}

                {/* 图片类型 */}
                {currentEvent.type === 'image' && (
                  <div className="rounded-2xl rounded-tl-sm overflow-hidden" style={{ backgroundColor: '#21262d', maxWidth: 240 }}>
                    {currentEvent.image && !imgError ? (
                      <div
                        className="cursor-pointer group relative"
                        onClick={() => setLightboxSrc(currentEvent.image!)}
                      >
                        <img
                          src={currentEvent.image}
                          alt={currentEvent.content}
                          className="w-full object-cover max-h-[180px]"
                          onError={() => setImgError(true)}
                        />
                        {/* 放大图标提示 */}
                        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="w-[200px] h-[140px] flex flex-col items-center justify-center gap-2" style={{ backgroundColor: '#1a1f29' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#484f58" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span className="text-[#484f58] text-[11px]">[图片]</span>
                      </div>
                    )}
                    <div className="px-3 py-2">
                      <p className="text-white text-[13px] leading-relaxed">{currentEvent.content}</p>
                    </div>
                  </div>
                )}

                {/* 视频类型 */}
                {currentEvent.type === 'video' && (
                  <div className="rounded-2xl rounded-tl-sm overflow-hidden cursor-pointer" style={{ backgroundColor: '#21262d', maxWidth: 240 }}
                    onClick={() => setVideoModal(true)}>
                    <div className="w-[200px] h-[140px] flex flex-col items-center justify-center gap-2 relative group" style={{ backgroundColor: '#1a1f29' }}>
                      {/* 封面图（如果有） */}
                      {currentEvent.image && !imgError ? (
                        <img
                          src={currentEvent.image}
                          alt={currentEvent.content}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={() => setImgError(true)}
                        />
                      ) : null}
                      {/* 播放按钮叠加层 */}
                      <div className="relative z-10 w-14 h-14 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/45 transition-all group-hover:scale-110">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                          <polygon points="7,3 21,12 7,21" />
                        </svg>
                      </div>
                      <span className="relative z-10 text-white/80 text-[12px] mt-1 font-medium">点击播放</span>
                    </div>
                    <div className="px-3 py-2">
                      <p className="text-white text-[13px] leading-relaxed">{currentEvent.content}</p>
                    </div>
                  </div>
                )}

                <span className="text-[#484f58] text-[10px] ml-0.5">{getTimeStr(currentIndex)}</span>
              </div>
            </div>
          )}

          {/* 玩家回复气泡 (从调查页返回) */}
          {phase === 'reply' && (
            <div className="flex items-start gap-2.5 justify-end animate-fade-in" key={`reply-${currentIndex}`}>
              <div className="flex flex-col items-end gap-1 max-w-[75%]">
                <span className="text-[#8b949e] text-[11px] mr-0.5">我</span>
                <div className="rounded-2xl rounded-tr-sm px-4 py-2.5" style={{ backgroundColor: '#1f6feb' }}>
                  <p className="text-white text-[14px] leading-relaxed whitespace-pre-wrap break-words">
                    {currentEvent.responseText}
                  </p>
                </div>
                <span className="text-[#484f58] text-[10px] mr-0.5">{getTimeStr(currentIndex)}</span>
              </div>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-[13px] font-bold"
                style={{ backgroundColor: '#3fb950' }}
              >
                我
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 底部判断按钮 */}
      {phase === 'message' && (
        <div className="relative z-10 px-4 pb-6 pt-2 flex items-center gap-3 animate-fade-in">
          {/* 不可信 */}
          <button
            onClick={() => handleJudgment('doubt')}
            className="flex-1 h-[72px] rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-95"
            style={{ backgroundColor: 'rgba(218, 54, 51, 0.15)', border: '1px solid rgba(218, 54, 51, 0.3)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#da3633" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="text-[#da3633] text-[13px] font-medium">不可信</span>
          </button>

          {/* 不确定 */}
          <button
            onClick={() => handleJudgment('unsure')}
            className="flex-1 h-[72px] rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-95"
            style={{ backgroundColor: 'rgba(210, 153, 34, 0.15)', border: '1px solid rgba(210, 153, 34, 0.3)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d29922" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="text-[#d29922] text-[13px] font-medium">不确定</span>
          </button>

          {/* 可信 */}
          <button
            onClick={() => handleJudgment('trust')}
            className="flex-1 h-[72px] rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-95"
            style={{ backgroundColor: 'rgba(47, 129, 83, 0.15)', border: '1px solid rgba(47, 129, 83, 0.3)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            <span className="text-[#3fb950] text-[13px] font-medium">可信</span>
          </button>
        </div>
      )}

      {/* 回复后 → 继续下一条 */}
      {phase === 'reply' && (
        <div className="relative z-10 px-4 pb-6 pt-2 flex items-center gap-3 animate-fade-in">
          <button
            onClick={goNext}
            className="flex-1 h-12 rounded-xl text-white text-[15px] font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#21262d', border: '1px solid #30363d' }}
          >
            {isLastEvent ? '查看结局' : '下一条'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      )}

      {/* 底部指示条 */}
      <div className="relative z-10 flex justify-center pb-6 pt-1">
        <div className="w-10 h-1 rounded-full" style={{ backgroundColor: '#30363d' }} />
      </div>

      {/* 调查弹窗 */}
      {showModal && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center px-6 animate-fade-in"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
          onClick={() => { setShowModal(false); setPendingJudgment(null) }}
        >
          <div
            className="w-full max-w-[320px] rounded-2xl p-5 flex flex-col items-center gap-4"
            style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white text-[17px] font-medium">信息调查</h3>

            {/* 消息引用 */}
            <div
              className="w-full rounded-xl px-4 py-3 text-center"
              style={{ backgroundColor: '#0d1117', border: '1px solid #21262d' }}
            >
              <p className="text-white text-[14px] leading-relaxed">
                "{currentEvent.content}"
              </p>
            </div>

            <p className="text-[#6e7681] text-[12px] text-center leading-relaxed">
              该信息已被多人标记，请选择您的下一步行动。
            </p>

            {/* 调查按钮 */}
            <button
              onClick={() => handleModalAction('investigate')}
              className="w-full h-11 rounded-xl text-white text-[15px] font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#2f8147', border: '1px solid #3fb950' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              调查
            </button>

            {/* 回应按钮 */}
            <button
              onClick={() => handleModalAction('respond')}
              className="w-full h-11 rounded-xl text-white text-[15px] font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#1f6feb', border: '1px solid #58a6ff' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 14 4 9 9 4" /><path d="M20 20v-7a4 4 0 0 0-4-4H4" />
              </svg>
              回应
            </button>

            {/* 取消按钮 */}
            <button
              onClick={() => { setShowModal(false); setPendingJudgment(null) }}
              className="text-[#8b949e] text-[14px] py-1 transition-colors hover:text-white"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 图片放大 Lightbox */}
      {lightboxSrc && (
        <div
          className="absolute inset-0 z-[60] flex items-center justify-center animate-fade-in"
          style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
          onClick={() => setLightboxSrc(null)}
        >
          {/* 关闭按钮 */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxSrc(null) }}
            className="absolute top-10 right-4 w-10 h-10 rounded-full flex items-center justify-center z-10"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {/* 大图 */}
          <img
            src={lightboxSrc}
            alt="查看大图"
            className="max-w-[95%] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          {/* 提示文字 */}
          <span className="absolute bottom-16 text-white/50 text-[12px]">点击空白处关闭</span>
        </div>
      )}

      {/* 视频播放弹窗 */}
      {videoModal && (
        <div
          className="absolute inset-0 z-[60] flex items-center justify-center animate-fade-in"
          style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
          onClick={() => setVideoModal(false)}
        >
          {/* 关闭按钮 */}
          <button
            onClick={(e) => { e.stopPropagation(); setVideoModal(false) }}
            className="absolute top-10 right-4 w-10 h-10 rounded-full flex items-center justify-center z-10"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {/* 视频容器 */}
          <div
            className="w-[90%] max-w-[400px] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-video rounded-xl overflow-hidden" style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}>
              {currentEvent.video ? (
                <video
                  src={currentEvent.video}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  poster={currentEvent.image || undefined}
                />
              ) : (
                /* 无真实视频时展示封面+播放状态 */
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 relative">
                  {currentEvent.image && !imgError ? (
                    <img
                      src={currentEvent.image}
                      alt={currentEvent.content}
                      className="absolute inset-0 w-full h-full object-cover opacity-40"
                      onError={() => setImgError(true)}
                    />
                  ) : null}
                  <div className="relative z-10 w-16 h-16 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                      <polygon points="7,3 21,12 7,21" />
                    </svg>
                  </div>
                  <span className="relative z-10 text-white/70 text-[14px]">视频播放中...</span>
                  <div className="relative z-10 w-3/4 h-[3px] rounded-full mt-2" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                    <div className="h-full rounded-full w-2/5" style={{ backgroundColor: '#58a6ff' }} />
                  </div>
                </div>
              )}
            </div>
            <p className="text-white/80 text-[14px] text-center px-4">{currentEvent.content}</p>
            <span className="text-white/40 text-[11px]">点击空白处关闭</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default GamePage
