# Prompt Control

这是一个基于 Next.js 16 和 TypeScript 开发的现代化提示词管理与测试平台。它不仅可以帮助你管理 Prompt，还内置了 AI 对话测试功能，支持实时流式响应。

## ✨ 主要功能

### 📝 提示词管理
- **文档式编辑体验**：采用沉浸式的文档编辑模式，支持 Markdown 语法，所见即所得。
- **Markdown 渲染**：支持表格、代码块、列表等丰富的 Markdown 格式渲染。
- **CRUD 操作**：完整的增删改查功能，数据持久化存储于本地。

### 🤖 AI 对话测试
- **内置聊天面板**：右侧集成 AI 聊天窗口，可直接使用当前提示词进行测试。
- **流式响应 (Streaming)**：支持打字机效果的实时流式回复，体验流畅。
- **自定义配置**：支持配置 OpenAI 兼容的 API (Base URL, API Key, Model Name)。
- **Markdown 对话**：AI 回复支持 Markdown 渲染。

### 🎨 现代化 UI/UX
- **三栏布局**：侧边栏导航 + 中间内容区 + 右侧聊天测试区。
- **视觉美化**：基于 Tailwind CSS v4 设计，拥有精致的阴影、圆角和毛玻璃效果。
- **响应式设计**：适配不同屏幕尺寸，提供舒适的阅读和编辑体验。

## 🛠️ 技术栈

- **核心框架**: [Next.js 16](https://nextjs.org/) (App Router)
- **开发语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式方案**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Markdown**: `react-markdown`, `remark-gfm`, `@tailwindcss/typography`
- **数据存储**: 本地文件系统 (JSON)

## 🚀 快速开始

1.  **安装依赖**：

    ```bash
    npm install
    ```

2.  **启动开发服务器**：

    ```bash
    npm run dev
    ```

3.  **访问应用**：
    打开浏览器访问 [http://localhost:5000](http://localhost:5000)。

## 📂 项目结构

```
src/
├── app/
│   ├── api/              # API 路由 (CRUD, Chat)
│   ├── globals.css       # 全局样式 (Tailwind v4)
│   ├── layout.tsx        # 根布局
│   └── page.tsx          # 主页面容器
├── components/
│   ├── ChatPanel.tsx     # AI 聊天测试面板
│   ├── PromptDetail.tsx  # 提示词详情展示 (Markdown 渲染)
│   ├── PromptForm.tsx    # 提示词编辑器 (文档模式)
│   └── PromptSidebar.tsx # 侧边栏导航列表
├── lib/
│   └── db.ts             # 本地 JSON 数据存储逻辑
└── types/
    └── prompt.ts         # 类型定义
```

## ⚙️ 配置说明

在聊天面板中点击设置图标，可以配置以下参数以连接你的 AI 模型：
- **Base URL**: API 基础地址 (例如: `https://api.openai.com/v1`)
- **API Key**: 你的 API 密钥
- **Model Name**: 模型名称 (例如: `gpt-3.5-turbo`, `gpt-4`)

## 📝 待办事项

- [ ] 支持提示词变量替换 (`{{variable}}`)
- [ ] 增加更多 AI 模型支持
- [ ] 导出/导入功能
