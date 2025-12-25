# Prompt Control

这是一个基于 Next.js 和 TypeScript 开发的提示词管理服务。

## 功能

- **新增提示词**：创建新的提示词，包含标题和内容。
- **查看提示词**：在主页查看所有提示词列表。
- **编辑提示词**：修改现有的提示词。
- **删除提示词**：删除不再需要的提示词。

## 技术栈

- **框架**: [Next.js](https://nextjs.org/) (App Router)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **数据存储**: 本地 JSON 文件 (`data/prompts.json`)

## 快速开始

1.  安装依赖：

    ```bash
    npm install
    ```

2.  启动开发服务器：

    ```bash
    npm run dev
    ```

3.  打开浏览器访问 [http://localhost:5000](http://localhost:5000)。

## 项目结构

- `src/app/page.tsx`: 主页面，包含提示词列表和管理逻辑。
- `src/app/api/prompts`: API 路由，处理 CRUD 操作。
- `src/components`: React 组件 (`PromptList`, `PromptForm`)。
- `src/lib/db.ts`: 数据存储逻辑。
- `src/types`: TypeScript 类型定义。
- `data/prompts.json`: 存储提示词数据的文件（自动生成）。
