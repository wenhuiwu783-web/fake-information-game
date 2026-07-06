# Vercel KV 数据埋点部署指南

## 已完成的功能

1. ✅ 安装依赖 `@vercel/kv` 和 `@vercel/node`
2. ✅ 创建 API 路由
   - `api/analytics.ts` - 接收游戏数据并存储到 Redis
   - `api/export.ts` - 查看收集的数据（需要认证）
3. ✅ 修改 `src/utils/analytics.ts`
   - 在 `endSession()` 中添加 `submitToServer(data)` 调用
   - 新增 `submitToServer()` 函数发送数据到 `/api/analytics`
   - 新增 `manualSubmit()` 函数用于手动提交

## 部署步骤

### 1. 创建 Redis 数据库（Vercel KV）

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入你的项目 → **Storage** 标签
3. 点击 **Create Database** → 选择 **KV**
4. 命名（如 `game-analytics`）→ **Create**
5. 创建后会自动关联到项目

### 2. 配置环境变量

Vercel 会自动为 KV 数据库创建以下环境变量：
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

你可以在 Vercel Dashboard → Settings → Environment Variables 中查看。

### 3. 部署项目

```bash
# 安装依赖
npm install

# 部署到 Vercel
vercel --prod

# 或者通过 Vercel Dashboard 部署
```

### 4. 验证部署

1. **游戏数据收集**：玩一次游戏，查看控制台是否有 `[analytics] 数据提交成功` 日志
2. **查看数据**：访问 `https://fake-information-game.online/api/export`
   - 需要添加 Authorization header: `Bearer game-analytics-secret-2024`
   - 或者在浏览器中访问：`https://fake-information-game.online/api/export?token=game-analytics-secret-2024`

## 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `KV_REST_API_URL` | Redis REST API URL | Vercel 自动创建 |
| `KV_REST_API_TOKEN` | Redis REST API Token | Vercel 自动创建 |
| `EXPORT_TOKEN` | 数据导出 API 的认证令牌 | `game-analytics-secret-2024` |

## 数据查看方式

### 方式一：API 导出
```bash
curl -H "Authorization: Bearer game-analytics-secret-2024" \
  https://fake-information-game.online/api/export
```

### 方式二：Vercel Dashboard
1. 访问 Vercel Dashboard
2. 进入 Storage → KV
3. 选择 `game-analytics` 数据库
4. 查看 `sessions` 键的数据

### 方式三：命令行工具
```bash
# 安装 Vercel CLI
npm i -g vercel

# 查看 KV 数据
vercel kv:list game-analytics
vercel kv:get game-analytics sessions
```

## 故障排除

### 1. API 返回 500 错误
- 检查 Redis 数据库是否创建
- 检查环境变量是否已设置
- 查看 Vercel 部署日志

### 2. 数据未提交
- 检查浏览器控制台网络请求
- 确认 `endSession()` 被调用
- 确认网络连接正常

### 3. 权限问题
- 确保 `KV_REST_API_TOKEN` 有读写权限
- 确保 `EXPORT_TOKEN` 正确设置

## 数据格式

存储在 Redis 中的每条数据包含：
```json
{
  "sessionId": "字符串",
  "ip": "用户 IP",
  "submittedAt": "提交时间戳",
  "data": {
    "session": {...},
    "events": [...],
    "interactions": [...],
    "userAgent": "浏览器信息",
    "screenSize": "屏幕分辨率"
  }
}
```

## 下一步优化建议

1. **数据清理**：添加定期清理旧数据的逻辑
2. **数据统计**：添加统计 API，如 `/api/stats` 返回汇总信息
3. **数据可视化**：创建简单的 Dashboard 查看数据图表
4. **错误监控**：添加 Sentry 或类似工具监控 API 错误