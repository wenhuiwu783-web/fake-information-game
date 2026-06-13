import { useNavigate } from 'react-router-dom'

function EndingTruthPage() {
  const navigate = useNavigate()

  return (
    <div className="relative flex flex-col h-full overflow-hidden animate-fade-in-page" style={{ backgroundColor: '#0a0f1a' }}>
      {/* 顶部标题区 */}
      <div className="relative z-10 flex flex-col items-center pt-12 pb-4">
        {/* 盾牌图标 + 发光 */}
        <div className="relative mb-5">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(46, 160, 67, 0.3) 0%, transparent 70%)',
              transform: 'scale(2)',
            }}
          />
          <div
            className="relative w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(46, 160, 67, 0.15)',
              border: '1px solid rgba(46, 160, 67, 0.4)',
              boxShadow: '0 0 20px rgba(46, 160, 67, 0.3), 0 0 40px rgba(46, 160, 67, 0.1)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
        </div>

        <h1 className="text-white text-[30px] font-normal tracking-widest text-center mb-2">
          真相传播官
        </h1>
        <p className="text-[#6e7681] text-[14px] tracking-wider mb-5">
          真相流动，信任生长，家庭更温暖
        </p>

        {/* 分隔线 */}
        <div className="w-8 h-[1px]" style={{ backgroundColor: '#238636' }} />
      </div>

      {/* 聊天卡片 */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-5 pt-3 pb-6">
        <div
          className="w-full max-w-[320px] rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#111827', border: '1px solid #1e3a5f' }}
        >
          {/* 卡片内导航栏 */}
          <div className="flex items-center justify-between px-3 py-3" style={{ backgroundColor: '#0d1117' }}>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <div className="flex flex-col">
                <span className="text-white text-[13px] font-medium">相亲相爱一家人 (36)</span>
                <div className="flex items-center gap-1">
                  <div className="w-[5px] h-[5px] rounded-full bg-[#3fb950]" />
                  <span className="text-[#3fb950] text-[9px]">36位家人在线</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <div className="relative">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <circle cx="6" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="18" cy="12" r="2" />
                </svg>
                <div className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-[#da3633]" />
              </div>
            </div>
          </div>

          {/* 消息区域 */}
          <div className="px-3 py-3 space-y-3">
            {/* 妈妈的消息 */}
            <div className="flex items-start gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ backgroundColor: '#30363d' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#8b949e">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-[#8b949e] text-[10px] mb-1 block">妈妈</span>
                <div
                  className="rounded-xl px-3 py-2.5 inline-block"
                  style={{ backgroundColor: '#21262d' }}
                >
                  <p className="text-white text-[13px] leading-relaxed">
                    我查了一下，这条消息不是真的。
                  </p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1 px-1.5 py-[2px] rounded" style={{ backgroundColor: 'rgba(46, 160, 67, 0.2)' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span className="text-[#3fb950] text-[9px]">已核实</span>
                  </div>
                  <span className="text-[#484f58] text-[9px]">09:15</span>
                </div>
              </div>
            </div>

            {/* 我的消息（右侧） */}
            <div className="flex items-start gap-2 justify-end">
              <div className="flex-1 flex flex-col items-end">
                <div
                  className="rounded-xl px-3 py-2.5 inline-block"
                  style={{ backgroundColor: '#1a7f37' }}
                >
                  <p className="text-white text-[13px] leading-relaxed">
                    辛苦了妈妈！我们一起守护真相！💪
                  </p>
                </div>
                <span className="text-[#484f58] text-[9px] mt-1">09:16 ✓✓</span>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ backgroundColor: '#30363d' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#8b949e">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                </svg>
              </div>
            </div>

            {/* 姑姑的消息 */}
            <div className="flex items-start gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ backgroundColor: '#30363d' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#8b949e">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-[#8b949e] text-[10px] mb-1 block">姑姑</span>
                <div
                  className="rounded-xl px-3 py-2.5 inline-block"
                  style={{ backgroundColor: '#21262d' }}
                >
                  <p className="text-white text-[13px] leading-relaxed">
                    谢谢提醒！我也去查了一下，确实被多次辟谣了。
                  </p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1 px-1.5 py-[2px] rounded" style={{ backgroundColor: 'rgba(46, 160, 67, 0.2)' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span className="text-[#3fb950] text-[9px]">已核实</span>
                  </div>
                  <span className="text-[#484f58] text-[9px]">09:18</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <button
          onClick={() => navigate('/')}
          className="w-full max-w-[320px] py-[14px] mt-6 rounded-[12px] text-[#0a0f1a] text-[17px] font-medium active:scale-[0.98] transition-transform"
          style={{ backgroundColor: '#34c759' }}
        >
          重新开始
        </button>
      </div>

      {/* 底部指示 */}
      <div className="relative z-10 flex justify-center pb-6 pt-2">
        <div className="w-10 h-1 rounded-full" style={{ backgroundColor: '#30363d' }} />
      </div>
    </div>
  )
}

export default EndingTruthPage
