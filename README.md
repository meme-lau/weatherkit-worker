# 🌤 WeatherKit-Worker

这是一个专门为 **Cloudflare Workers** 优化的 WeatherKit 远程代理项目。本项目是对 [NSRingo/WeatherKit](https://github.com/NSRingo/WeatherKit) 的重构与改造，使其支持自主独立部署。基于 Hono.js 开发，移除了所有本地繁琐的脚本代理依赖，提供一键独立部署与代理配置的动态下载。

关于本项目的架构设计、内部原理与工作流，请阅读 [项目架构设计与实现原理](docs/architecture.md) 以及 [BoxJS 配置项与系统默认参数映射说明](docs/boxjs-settings-mapping.md)。

---

## 🌟 核心特性

- ⚡ **无缝部署**：支持 Cloudflare Workers 独立自托管部署，无需依赖任何第三方中转服务。
- 📦 **极简化架构**：移除本地配置编译工具链，代理配置全内置在代码中，随时发布。
- 🔄 **动态重写下载**：直接访问部署的 Worker 地址即可下载客户端配置，**自动动态将配置中的重定向域名替换为您部署的 Worker 域名**。
- 🛠️ **多客户端原生支持**：直接提供对主流网络代理工具（Surge、Loon、Shadowrocket、Stash、Egern）配置的完整输出与适配。
- 🌤️ **天气体验增强**：
  - 解锁全球完整的 WeatherKit 天气服务功能。
  - 支持融合和替换第三方空气质量（如彩云天气、和风天气等）。
  - 新增下一小时降水预测及昨日天气对比等扩展数据。
  - 精准拦截 QUIC / UDP (443端口) 握手包以避免请求回退。

---

## 🚀 部署指南

您可以选择以下任意一种方式进行部署：

### 选项 A：通过 Cloudflare 网页后台部署（推荐，零门槛）
1. 登录您的 [Cloudflare 仪表板](https://dash.cloudflare.com/)。
2. 依次进入 **Workers 和 Pages** -> **创建** -> **克隆 Git 存储库**。
3. 在 **Git 存储库 URL** 输入框中，直接填入本项目的 Git 地址：
   `https://github.com/meme-lau/weatherkit-worker.git`
4. 点击 **下一步**，Cloudflare 将在云端自动完成打包构建并为您分配部署的 Workers 域名。

---

### 选项 B：通过本地命令行部署（适合开发者）
#### 1. 准备工作
- 确保您本地已安装 [Node.js](https://nodejs.org/) 环境。
- 准备一个 Cloudflare 账号。

#### 2. 克隆项目与安装依赖
```bash
git clone https://github.com/meme-lau/weatherkit-worker.git
cd weatherkit-worker
npm install
```

#### 3. 登录并一键部署
```bash
# 登录您的 Cloudflare 账号
npx wrangler login

# 部署服务
npm run deploy:wrangler
```

---

## ⚙️ 可视化配置中心与一键导入

部署成功后，**直接在浏览器中访问您部署的 Worker 根路径地址**即可访问全新的**无状态可视化配置中心**：
`https://<your-worker-host>/`

### 🎨 核心功能特点：
- 🔒 **无状态安全设计**：您填写的 API 令牌（如彩云/和风 API Token）及其他偏好设置**不会上传或保存在云端服务器**，而是以无状态的 Base64 方式直接编码在重定向 URL 路径中，安全私密，且配置会自动保存在您的浏览器本地缓存中以方便复用。
- 📊 **多步骤配置向导**：
  - **第一步：服务参数配置**：一站式填写 API 令牌，选择天气数据源、未来一小时降水数据源、今日/昨日空气指数计算服务提供商。展开“高级配置选项”还可调节天气替换范围国家码、昨日污染物细分数据源、今日/昨日污染物单位转换模式、今日空气指数 18 种不同标准的替换目标，以及选择内置算法公式（支持 HJ 633 2025年草案）。
  - **第二步：选择客户端导入**：完美适配 Surge、Loon、Shadowrocket、Stash、Egern，支持**一键拉起导入**、**复制订阅链接**或**直接下载配置**。

> 💡 **提示**：当客户端通过生成的重载 URL 请求配置时，服务端会自动将配置文件中的占位符 `__HOST__` 替换为您当前的 Worker 部署域名，并把 Base64 的偏好设置实时无缝注入，实现无需手动修改的极简部署与使用。

---

## 📄 License & 致谢

- **作者/重构优化**：[meme](https://github.com/meme)
- **致谢**：原项目基于 [VirgilClyne/iRingo](https://github.com/VirgilClyne) 进行了简化与 CF Worker 适配优化重构。
