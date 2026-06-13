import { useNavigate, useSearchParams } from 'react-router-dom'
import eventsData from '../../data/events.json'

type Event = (typeof eventsData)[number]
const events = eventsData as Event[]

function InvestigationPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const eventId = Number(searchParams.get('eventId'))
  const judgment = (searchParams.get('judgment') || 'doubt') as 'trust' | 'unsure' | 'doubt'

  const event = events.find((e) => e.id === eventId)

  if (!event) {
    return (
      <div className="h-full flex flex-col" style={{ backgroundColor: '#0d1117' }}>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#8b949e] text-[15px]">未找到事件数据</p>
        </div>
      </div>
    )
  }

  const fc = event.factCheck
  const credibilityNum = parseInt(fc.credibility.replace('%', ''))
  const isStrictTrue = credibilityNum >= 90
  const isPartiallyTrue = credibilityNum >= 50 && credibilityNum < 90

  const resultColor = isStrictTrue ? '#3fb950' : isPartiallyTrue ? '#d29922' : '#da3633'
  const resultBgColor = isStrictTrue
    ? 'rgba(47, 185, 80, 0.1)'
    : isPartiallyTrue
      ? 'rgba(210, 153, 34, 0.1)'
      : 'rgba(218, 54, 51, 0.1)'
  const resultLabel = isStrictTrue ? '真实' : isPartiallyTrue ? '部分属实' : '虚假'

  const handleRespond = () => {
    navigate(`/game?replyEventId=${event.id}&truth=${event.truth}&judgment=${judgment}`)
  }

  return (
    <div className="relative flex flex-col h-full overflow-hidden animate-slide-in-right" style={{ backgroundColor: '#0d1117' }}>
      {/* 顶部标题栏 */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-12 pb-4">
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="text-white text-[16px] font-medium">线索调查</span>
        <span className="w-8 h-8" />
      </div>

      {/* 主内容区 */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
        <div className="flex flex-col gap-4">
          {/* 原消息引用 */}
          <div
            className="rounded-xl px-4 py-3.5"
            style={{ backgroundColor: '#161b22', border: '1px solid #21262d' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#484f58] text-[11px]">{event.sender}</span>
              <span className="text-[#484f58] text-[11px]">·</span>
              <span className="text-[#484f58] text-[11px]">{event.type === 'image' ? '图片' : event.type === 'video' ? '视频' : '文字'}</span>
            </div>

            {/* 图片缩略图 */}
            {event.type === 'image' && event.image && (
              <div className="mb-2.5 rounded-lg overflow-hidden" style={{ maxHeight: 160 }}>
                <img
                  src={event.image}
                  alt={event.content}
                  className="w-full object-cover max-h-[160px]"
                />
              </div>
            )}

            {/* 视频封面 */}
            {event.type === 'video' && (
              <div className="mb-2.5 rounded-lg overflow-hidden relative" style={{ maxHeight: 160, backgroundColor: '#0d1117' }}>
                {event.image ? (
                  <img src={event.image} alt={event.content} className="w-full object-cover max-h-[160px] opacity-70" />
                ) : (
                  <div className="h-[120px] flex items-center justify-center" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <polygon points="7,3 21,12 7,21" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            <p className="text-white text-[14px] leading-relaxed">{event.content}</p>
          </div>

          {/* 核查结果标签 */}
          <div
            className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ backgroundColor: resultBgColor, border: `1px solid ${resultColor}40` }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: resultColor }}
            >
              {isStrictTrue ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : isPartiallyTrue ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              )}
            </div>
            <div>
              <span className="text-white text-[17px] font-bold" style={{ color: resultColor }}>
                {resultLabel}
              </span>
              <p className="text-[#8b949e] text-[12px] mt-0.5">综合核查结论</p>
            </div>
          </div>

          {/* 可信度 */}
          <div
            className="rounded-xl px-4 py-4"
            style={{ backgroundColor: '#161b22', border: '1px solid #21262d' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="text-[#8b949e] text-[12px] font-medium uppercase tracking-wider">可信度</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-white text-[32px] font-bold">{fc.credibility.replace('%', '')}</span>
              <span className="text-[#8b949e] text-[18px]">/ 100</span>
            </div>
            <div className="w-full h-[4px] rounded-full mt-2" style={{ backgroundColor: '#21262d' }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${credibilityNum}%`, backgroundColor: isStrictTrue ? '#3fb950' : isPartiallyTrue ? '#d29922' : '#da3633' }}
              />
            </div>
          </div>

          {/* 识别依据 */}
          <div
            className="rounded-xl px-4 py-4"
            style={{ backgroundColor: '#161b22', border: '1px solid #21262d' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d29922" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="text-[#d29922] text-[12px] font-medium uppercase tracking-wider">识别依据</span>
            </div>
            <p className="text-[#c9d1d9] text-[13px] leading-relaxed whitespace-pre-wrap">{fc.identifyReason}</p>
          </div>

          {/* 核查结果 */}
          <div
            className="rounded-xl px-4 py-4"
            style={{ backgroundColor: '#161b22', border: '1px solid #21262d' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              <span className="text-[#3fb950] text-[12px] font-medium uppercase tracking-wider">核查结果</span>
            </div>
            <p className="text-[#c9d1d9] text-[13px] leading-relaxed">{fc.result}</p>
          </div>

          {/* 风险提示 */}
          <div
            className="rounded-xl px-4 py-4"
            style={{ backgroundColor: '#161b22', border: '1px solid #21262d' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#da3633" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span className="text-[#da3633] text-[12px] font-medium uppercase tracking-wider">风险提示</span>
            </div>
            <p className="text-[#c9d1d9] text-[13px] leading-relaxed">{fc.risk}</p>
          </div>

          {/* 参考来源 */}
          <div
            className="rounded-xl px-4 py-4"
            style={{ backgroundColor: '#161b22', border: '1px solid #21262d' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span className="text-[#8b949e] text-[12px] font-medium uppercase tracking-wider">参考来源</span>
            </div>
            <div className="text-[#c9d1d9] text-[13px] leading-relaxed whitespace-pre-wrap break-all">
              {fc.reference.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                /^https?:\/\//.test(part) ? (
                  <a
                    key={i}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[#58a6ff] bg-[#58a6ff]/10 hover:bg-[#58a6ff]/20 transition-colors text-[12px] font-medium mb-0.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    查看来源
                  </a>
                ) : (
                  part
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 底部回应按钮 */}
      <div className="relative z-10 px-4 pb-8 pt-3">
        <button
          onClick={handleRespond}
          className="w-full h-12 rounded-xl text-white text-[16px] font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
          style={{ backgroundColor: '#1f6feb', border: '1px solid #58a6ff' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 14 4 9 9 4" />
            <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
          </svg>
          回应
        </button>
      </div>

      {/* 底部指示 */}
      <div className="relative z-10 flex justify-center pb-6 pt-1">
        <div className="w-10 h-1 rounded-full" style={{ backgroundColor: '#30363d' }} />
      </div>
    </div>
  )
}

export default InvestigationPage
