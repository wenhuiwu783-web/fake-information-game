import { useNavigate } from 'react-router-dom'

function EndingClearPage() {
  const navigate = useNavigate()

  return (
    <div className="relative flex flex-col h-full overflow-hidden animate-fade-in-page" style={{ backgroundColor: '#0c0e1a' }}>
      {/* 背景：模糊的聊天消息层 */}
      <div className="absolute inset-0 pointer-events-none blur-[2px]">
        {/* 顶部消息 */}
        <div className="pt-[100px] px-5 opacity-[0.12]">
          <div className="mb-3">
            <span className="text-[#8b949e] text-[10px] mb-1 block">二叔</span>
            <div className="bg-[#21262d] rounded-lg px-3 py-2 max-w-[200px]">
              <p className="text-white text-[11px]">转发这个锦鲤，好运连连！</p>
            </div>
          </div>
        </div>

        {/* 中间偏左 */}
        <div className="px-5 opacity-[0.1]">
          <div className="mb-2">
            <span className="text-[#8b949e] text-[10px] mb-1 block">妈妈</span>
            <div className="bg-[#21262d] rounded-lg px-3 py-2 max-w-[180px]">
              <p className="text-white text-[11px]">喝柠檬水能抗癌！</p>
            </div>
          </div>
        </div>

        {/* 右侧 */}
        <div className="px-5 opacity-[0.08] flex justify-end">
          <div className="mb-2">
            <div className="bg-[#21262d] rounded-lg px-3 py-2 max-w-[180px]">
              <p className="text-white text-[11px]">我家喝了，真的好了！</p>
            </div>
          </div>
        </div>

        {/* 转发消息 */}
        <div className="px-5 mt-4 opacity-[0.06] flex justify-center">
          <div className="bg-[#21262d] rounded-lg px-3 py-2 max-w-[220px]">
            <p className="text-white text-[10px]">这篇文章不看，一定会后悔一辈子...</p>
          </div>
        </div>
      </div>

      {/* 背景遮罩 */}
      <div className="absolute inset-0 z-[5]" style={{ backgroundColor: 'rgba(12, 14, 26, 0.75)' }} />

      {/* 顶部导航 */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-12 pb-4">
        <button onClick={() => navigate('/')} className="w-8 h-8 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button className="w-8 h-8 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <circle cx="6" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="18" cy="12" r="2" />
          </svg>
        </button>
      </div>

      {/* 中间主内容 */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        {/* 大标题 */}
        <h1 className="text-white text-[36px] font-light tracking-widest text-center mb-3">
          独自清醒的人
        </h1>
        <p className="text-[#6e7681] text-[14px] text-center mb-12 tracking-wider">
          你看清了真相，却改变不了他们。
        </p>

        {/* 消息卡片 */}
        <div
          className="w-full max-w-[300px] rounded-2xl px-4 py-5 mb-10"
          style={{
            backgroundColor: '#111827',
            border: '1px solid #1e3a5f',
          }}
        >
          {/* 头像 + 用户名 */}
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: '#1a0a00',
                boxShadow: '0 0 12px rgba(255, 160, 60, 0.4), 0 0 24px rgba(255, 160, 60, 0.15)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255, 160, 60, 0.8)">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
              </svg>
            </div>
            <span className="text-[#8b949e] text-[13px]">你</span>
          </div>

          {/* 消息内容 */}
          <p className="text-white text-[16px] leading-relaxed mb-4">
            我查到的证据显示，<br />
            这个消息不可靠。
          </p>

          {/* 底部信息 */}
          <div className="flex items-center justify-between">
            <span className="text-[#484f58] text-[11px] flex items-center gap-0.5">
              <span>□□</span>
              <span>35□</span>
              <span className="text-[#58a6ff]">✓✓</span>
            </span>
            <span className="text-[#484f58] text-[11px]">09:24</span>
          </div>
        </div>

        {/* 底部文案 */}
        <p className="text-[#484f58] text-[12px] text-center mb-8 tracking-wider leading-relaxed">
          但在那个喧嚣的世界里，清醒有时意味着孤独。
        </p>

        {/* 重新开始按钮 */}
        <button
          onClick={() => navigate('/')}
          className="w-full max-w-[320px] py-[14px] rounded-[12px] flex items-center justify-center gap-2 text-white text-[17px] font-medium active:scale-[0.98] transition-transform"
          style={{ backgroundColor: '#1a2332', border: '1px solid #2a3a52' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
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

export default EndingClearPage
