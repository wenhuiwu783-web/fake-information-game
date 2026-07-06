# 虚假信息识别游戏

这是一个交互式游戏，旨在帮助玩家识别虚假信息。

## 功能特性

- 🎮 交互式游戏体验
- 📊 实时数据收集与分析
- 🏆 得分系统与结局判断
- 🔍 调查功能与证据收集
- 📱 响应式移动端设计

## 新增功能：Vercel KV 数据收集

现在游戏支持自动数据收集！当玩家完成游戏时，数据会自动提交到 Vercel KV 数据库。

### 数据收集内容

- 游戏会话信息（开始/结束时间、得分、结局）
- 每个事件的处理情况（判断、调查、回应）
- 玩家交互行为（点击、调查等）
- 浏览器和设备信息

### 部署步骤

1. **创建 Vercel KV 数据库**
   - 访问 Vercel Dashboard → Storage → Create Database (KV)
   - 命名为 `game-analytics`

2. **部署项目**
   ```bash
   vercel --prod
   ```

3. **查看数据**
   - 访问 `/api/export` 需要认证令牌
   - 或在 Vercel Dashboard → Storage → KV 查看

详细部署说明见 [DEPLOYMENT.md](DEPLOYMENT.md)

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 项目结构

```
├── src/
│   ├── pages/          # 页面组件
│   ├── utils/          # 工具函数
│   │   ├── analytics.ts # 数据收集
│   │   └── score.ts    # 得分计算
│   └── index.css       # 样式文件
├── api/                # Vercel API 路由
│   ├── analytics.ts    # 数据接收
│   └── export.ts       # 数据导出
├── data/              # 游戏数据
├── public/            # 静态资源
└── vercel.json        # Vercel 配置
```

## 技术栈

- **前端**: React + TypeScript + Vite
- **样式**: Tailwind CSS
- **路由**: React Router
- **部署**: Vercel
- **数据存储**: Vercel KV (Redis)

## 数据隐私

所有收集的数据仅用于游戏分析和改进，不会包含个人身份信息。玩家数据在提交时已匿名化处理。

## 许可证

MIT