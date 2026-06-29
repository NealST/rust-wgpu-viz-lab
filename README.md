# rust-wgpu-viz-lab

使用 Rust + wgpu 开发的数据可视化实验室，编译为 WebAssembly 并通过 TanStack Start 在 Web 端展示。

## 项目结构

```
rust-wgpu-viz-lab/
├── Cargo.toml                  # Rust workspace 配置
├── crates/
│   └── viz-core/               # Rust wgpu 核心库 (编译为 wasm)
│       ├── Cargo.toml
│       └── src/lib.rs
├── frontend/                   # TanStack Start 前端应用
│   ├── package.json
│   ├── app.config.ts           # TanStack Start / Vite 配置
│   ├── app/
│   │   ├── client.tsx
│   │   ├── ssr.tsx
│   │   ├── router.tsx
│   │   ├── components/
│   │   │   └── WgpuCanvas.tsx  # WebGPU Canvas 组件
│   │   └── routes/
│   │       ├── __root.tsx
│   │       ├── index.tsx
│   │       └── docs/$slug.tsx  # Markdown 动态路由
│   └── public/
│       └── wasm/               # wasm-pack 输出目录
├── content/
│   └── docs/                   # Markdown 文档
│       ├── introduction.md
│       └── webgpu-basics.md
└── package.json                # 根 workspace 配置
```

## 快速开始

### 前置条件

- [Rust](https://rustup.rs/) (stable)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)
- [Node.js](https://nodejs.org/) >= 18

### 1. 构建 Wasm 模块

```bash
cd crates/viz-core
wasm-pack build --target web --out-dir ../../frontend/public/wasm
```

### 2. 启动前端开发服务器

```bash
cd frontend
npm install
npm run dev
```

### 3. 访问应用

打开浏览器访问 `http://localhost:3000`

- 首页：展示 WebGPU Canvas 渲染效果
- `/docs/introduction`：查看项目文档

## 技术栈

| 层级 | 技术 | 用途 |
|------|------|------|
| GPU 计算 | Rust + wgpu | 高性能数据可视化渲染 |
| 编译目标 | WebAssembly | 浏览器端运行 |
| 前端框架 | TanStack Start + React | 全栈 Web 应用 |
| 构建工具 | Vite + vinxi | 开发服务器 & 打包 |
| 文档 | Markdown + marked | 技术原理记录 |
