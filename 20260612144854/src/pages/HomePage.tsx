import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="relative flex flex-col h-full overflow-hidden animate-fade-in-page" style={{ backgroundColor: '#1a1a1a' }}>
      {/* 顶部导航栏 */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-12 pb-3">
        <button className="w-8 h-8 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex flex-col items-center">
            <span className="text-white text-[15px] font-medium tracking-wide">相亲相爱一家人</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#444444]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button className="w-8 h-8 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <circle cx="6" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="18" cy="12" r="2" />
            </svg>
          </button>
        </div>
      </div>

      {/* 背景遮罩层 */}
      <div className="absolute inset-0 z-[5]" style={{ backgroundColor: 'rgba(26, 26, 26, 0.65)' }} />

      {/* 背景聊天消息层 */}
      <div className="absolute inset-0 pt-28 px-4 pointer-events-none blur-[1px]">
        {/* 消息1 */}
        <div className="flex items-start gap-2.5 mb-3 opacity-[0.18]">
          <div className="w-8 h-8 rounded-full bg-[#333] flex-shrink-0" />
          <div className="bg-[#2a2a2a] rounded-lg px-3 py-2 max-w-[200px]">
            <p className="text-white text-[12px]">喝柠檬水能抗癌！</p>
          </div>
        </div>

        {/* 消息2 - 右侧 */}
        <div className="flex items-start gap-2.5 mb-3 justify-end opacity-[0.14]">
          <div className="bg-[#2a2a2a] rounded-lg px-3 py-2 max-w-[200px]">
            <p className="text-white text-[12px]">专家都这么说，快转发！</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#333] flex-shrink-0" />
        </div>

        {/* 消息3 */}
        <div className="flex items-start gap-2.5 mb-3 opacity-[0.14]">
          <div className="w-8 h-8 rounded-full bg-[#333] flex-shrink-0" />
          <div className="bg-[#2a2a2a] rounded-lg px-3 py-2 max-w-[200px]">
            <p className="text-white text-[12px]">转发到相亲相爱群</p>
          </div>
        </div>

        {/* 消息4 */}
        <div className="flex items-start gap-2.5 mb-3 opacity-[0.18]">
          <div className="w-8 h-8 rounded-full bg-[#333] flex-shrink-0" />
          <div className="bg-[#2a2a2a] rounded-lg px-3 py-2 max-w-[220px]">
            <p className="text-white text-[12px]">我家吃了这个，三高全没了！</p>
          </div>
        </div>

        {/* 系统提示 */}
        <div className="flex items-center justify-center gap-1 opacity-[0.14] mt-4">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ff9500" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="text-[#ff9500] text-[10px]">紧急通知！！！扩散周知</span>
        </div>
      </div>

      {/* 中间主内容区 */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        {/* 故障风大标题 */}
        <div className="glitch-text-container mb-8">
          <h1
            className="glitch-text text-white text-[42px] font-black leading-[1.15] tracking-wider text-center"
            data-text="你的家人&#10;正在转发"
          >
            你的家人<br />正在转发
          </h1>
        </div>

        {/* 副标题 */}
        <p className="text-[#999999] text-[14px] text-center leading-[1.8] mb-16 tracking-wide">
          有些消息正在传播<br />
          有些真相正在消失
        </p>

        {/* 进入群聊按钮 */}
        <button
          onClick={() => {
            localStorage.removeItem('truth_game_actions')
            navigate('/game')
          }}
          className="w-full max-w-[320px] py-[14px] rounded-[12px] text-white text-[17px] font-medium tracking-wider active:scale-[0.98] transition-transform"
          style={{ backgroundColor: '#34c759' }}
        >
          进入群聊
        </button>

        {/* 底部文案 */}
        <p className="text-[#666666] text-[12px] mt-5 tracking-[0.15em]">
          真相，需要你来守护
        </p>
      </div>

      {/* 底部进度指示 */}
      <div className="relative z-10 flex justify-center pb-6 pt-2">
        <div className="w-10 h-1 rounded-full bg-[#444444]" />
      </div>
    </div>
  )
}

export default HomePage
