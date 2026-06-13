import { useNavigate } from 'react-router-dom'

function EndingPage() {
  const navigate = useNavigate()

  return (
    <div className="relative flex flex-col h-full overflow-hidden animate-fade-in-page" style={{ backgroundColor: '#0a0a0a' }}>
      {/* 顶部导航栏 */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-12 pb-3">
        <button onClick={() => navigate('/')} className="w-8 h-8 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-white text-[16px] font-medium">相亲相爱一家人 (36)</span>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-[6px] h-[6px] rounded-full bg-[#cc0000]" />
            <span className="text-[#cc0000] text-[11px]">36位家人在线</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button className="w-8 h-8 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <div className="absolute -top-0.5 -right-1 min-w-[16px] h-4 rounded-full bg-[#cc0000] flex items-center justify-center px-1">
              <span className="text-white text-[8px] font-bold">99+</span>
            </div>
          </div>
          <button className="w-8 h-8 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#8b949e">
              <circle cx="6" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="18" cy="12" r="2" />
            </svg>
          </button>
        </div>
      </div>

      {/* 背景层：散布的转发消息卡片 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 左上卡片 */}
        <div className="absolute top-[120px] left-4 opacity-50" style={{ filter: 'blur(0.5px)' }}>
          <div className="rounded-xl px-3 py-2" style={{ backgroundColor: 'rgba(180, 20, 20, 0.12)', border: '1px solid rgba(180, 20, 20, 0.35)' }}>
            <div className="flex items-center gap-1.5 mb-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cc0000" strokeWidth="2">
                <path d="M7 17l9.2-9.2M17 8v8H9" />
              </svg>
              <span className="text-[#cc0000] text-[10px]">转发</span>
              <div className="px-1 py-[1px] rounded-sm bg-[#cc0000]">
                <span className="text-white text-[8px] font-bold">99+</span>
              </div>
            </div>
            <p className="text-[#8b949e] text-[9px] opacity-40">□□□ 999,999+□</p>
          </div>
        </div>

        {/* 右上卡片 */}
        <div className="absolute top-[150px] right-4 opacity-35">
          <div className="rounded-xl px-3 py-2" style={{ backgroundColor: 'rgba(180, 20, 20, 0.08)', border: '1px solid rgba(180, 20, 20, 0.25)' }}>
            <div className="flex items-center gap-1.5 mb-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#cc0000" strokeWidth="2">
                <path d="M7 17l9.2-9.2M17 8v8H9" />
              </svg>
              <span className="text-[#cc0000] text-[9px]">转发</span>
              <div className="px-1 py-[1px] rounded-sm bg-[#cc0000]">
                <span className="text-white text-[7px] font-bold">99+</span>
              </div>
            </div>
            <p className="text-[#8b949e] text-[8px] opacity-30">□□□ 580,328□</p>
          </div>
        </div>

        {/* 左下卡片 */}
        <div className="absolute top-[420px] left-6 opacity-40">
          <div className="rounded-xl px-3 py-2" style={{ backgroundColor: 'rgba(180, 20, 20, 0.1)', border: '1px solid rgba(180, 20, 20, 0.3)' }}>
            <div className="flex items-center gap-1.5 mb-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#cc0000" strokeWidth="2">
                <path d="M7 17l9.2-9.2M17 8v8H9" />
              </svg>
              <span className="text-[#cc0000] text-[9px]">转发</span>
              <div className="px-1 py-[1px] rounded-sm bg-[#cc0000]">
                <span className="text-white text-[7px] font-bold">99+</span>
              </div>
            </div>
            <p className="text-[#8b949e] text-[8px] opacity-35">□□□ 754,210□</p>
          </div>
        </div>

        {/* 右下卡片 */}
        <div className="absolute top-[400px] right-8 opacity-30">
          <div className="rounded-xl px-3 py-2" style={{ backgroundColor: 'rgba(180, 20, 20, 0.06)', border: '1px solid rgba(180, 20, 20, 0.2)' }}>
            <div className="flex items-center gap-1.5 mb-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#cc0000" strokeWidth="2">
                <path d="M7 17l9.2-9.2M17 8v8H9" />
              </svg>
              <span className="text-[#cc0000] text-[9px]">转发</span>
              <div className="px-1 py-[1px] rounded-sm bg-[#cc0000]">
                <span className="text-white text-[7px] font-bold">99+</span>
              </div>
            </div>
            <p className="text-[#8b949e] text-[8px] opacity-25">□□□ 950,000+□</p>
          </div>
        </div>
      </div>

      {/* 中间主内容 */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        {/* 大标题：群聊已沦陷 */}
        <h1
          className="text-[44px] font-black leading-[1.1] tracking-widest text-center mb-5"
          style={{
            color: '#ff0000',
            textShadow: '3px 0 0 rgba(255, 0, 0, 0.5), -3px 0 0 rgba(0, 150, 255, 0.4)',
          }}
        >
          群聊已沦陷
        </h1>

        {/* 副标题 */}
        <p className="text-[#6e7681] text-[13px] tracking-wider mb-8 flex items-center gap-3">
          <span>信息失控</span>
          <span className="text-[#484f58]">·</span>
          <span>真相消失</span>
          <span className="text-[#484f58]">·</span>
          <span>信任崩塌</span>
        </p>

        {/* 警告条 */}
        <div
          className="flex items-center gap-2 rounded-full px-5 py-2 mb-10"
          style={{ backgroundColor: 'rgba(200, 30, 30, 0.18)', border: '1px solid rgba(200, 30, 30, 0.4)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="text-[#ff3333] text-[13px] font-medium">警告：信息污染已达最大值</span>
        </div>

        {/* 信息污染指数卡片 */}
        <div
          className="w-full max-w-[300px] rounded-2xl p-6 flex flex-col items-center mb-10"
          style={{
            backgroundColor: 'rgba(200, 20, 20, 0.08)',
            border: '2px solid rgba(200, 30, 30, 0.5)',
          }}
        >
          <span className="text-[#ff3333] text-[14px] mb-2 tracking-wider">信息污染指数</span>
          <span
            className="text-[64px] font-black leading-none"
            style={{
              color: '#ff0000',
              textShadow: '2px 2px 8px rgba(255, 0, 0, 0.3)',
            }}
          >
            100%
          </span>
        </div>

        {/* 底部按钮区 */}
        <div className="w-full max-w-[320px]">
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ backgroundColor: '#1a0a0a', border: '1px solid #2a1010' }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(200, 30, 30, 0.2)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-2.5 rounded-lg text-[15px] font-medium tracking-wider"
              style={{
                color: '#ff0000',
                backgroundColor: 'rgba(200, 30, 30, 0.1)',
                border: '1px solid rgba(200, 30, 30, 0.4)',
              }}
            >
              重试连接
            </button>
          </div>
        </div>

        {/* 底部文案 */}
        <p className="text-[#484f58] text-[11px] mt-6 tracking-[0.2em]">
          真相被淹没 &nbsp;你选择沉默 &nbsp;这选择毁灭
        </p>
      </div>

      {/* 底部指示 */}
      <div className="relative z-10 flex justify-center pb-6 pt-2">
        <div className="w-10 h-1 rounded-full" style={{ backgroundColor: '#30363d' }} />
      </div>
    </div>
  )
}

export default EndingPage
