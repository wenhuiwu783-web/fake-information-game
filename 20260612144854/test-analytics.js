#!/usr/bin/env node

/**
 * 测试数据提交 API
 * 用法：node test-analytics.js
 */

const testData = {
  sessionId: `test-${Date.now()}`,
  data: {
    session: {
      sessionId: `test-${Date.now()}`,
      startTime: Date.now() - 1000 * 60 * 5, // 5分钟前
      endTime: Date.now(),
      ending: "truth",
      finalScore: 85,
      finalPercent: 0.85
    },
    events: [
      {
        eventId: 1,
        truth: false,
        type: "fake",
        messageShownAt: Date.now() - 1000 * 60 * 4,
        judgment: "doubt",
        judgmentAt: Date.now() - 1000 * 60 * 3,
        decisionTimeMs: 12000,
        investigated: true,
        responded: true,
        score: 10
      }
    ],
    interactions: [
      {
        type: "click",
        eventId: 1,
        timestamp: Date.now() - 1000 * 60 * 4,
        url: null
      }
    ],
    userAgent: "Test User Agent",
    screenSize: "1920x1080"
  }
};

async function testAnalytics() {
  console.log('测试数据提交 API...');
  
  // 本地测试 URL
  const url = 'http://localhost:3000/api/analytics';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ 数据提交成功:', result);
    } else {
      console.log('❌ 数据提交失败:', result);
    }
  } catch (error) {
    console.log('❌ 请求失败:', error.message);
    console.log('提示：请确保本地开发服务器已启动（npm run dev）');
  }
}

async function testExport() {
  console.log('\n测试数据导出 API...');
  
  const url = 'http://localhost:3000/api/export?token=game-analytics-secret-2024';
  
  try {
    const response = await fetch(url);
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ 数据导出成功');
      console.log(`共 ${result.count} 条数据`);
      if (result.sessions && result.sessions.length > 0) {
        console.log('第一条数据示例:', JSON.stringify(result.sessions[0], null, 2));
      }
    } else {
      console.log('❌ 数据导出失败:', result);
    }
  } catch (error) {
    console.log('❌ 请求失败:', error.message);
  }
}

// 运行测试
(async () => {
  await testAnalytics();
  await testExport();
})();