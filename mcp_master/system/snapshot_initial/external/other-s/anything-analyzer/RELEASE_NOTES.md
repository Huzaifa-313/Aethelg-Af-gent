# Anything Analyzer v3.6.7

## 新功能

- **手机证书下载页** — MITM 代理新增内置证书下载页面，移动设备配置代理后可直接访问证书下载地址安装 CA 证书
	- 自动识别 iOS / Android / 桌面端并显示对应安装步骤
	- 支持证书文件下载与页面引导一体化

## 修复

- **iOS 证书下载兼容性** — 新增 `cert.anything.test` 作为 iOS 优先下载域名，避免 `.local` 域名在部分 iPhone / Safari 环境下访问失败
- **iOS 证书安装识别** — 证书下载改为 `.cer` 文件名，并返回 `application/pkix-cert`，提升 iOS 对证书文件的识别与安装兼容性
- **Safari 标签切换脚本兼容** — 修复证书下载页依赖全局 `event` 的写法，避免 Safari 中标签页切换按钮失效

## 改进

- **代理设置提示优化** — MITM 设置页将设备代理地址说明改为 `<本机IP>:端口`，并明确展示手机访问地址 `http://cert.anything.test`
- **证书下载域名兼容** — 代理同时兼容 `cert.anything.test` 与 `cert.anything.local`，覆盖更多设备访问场景

## 下载

| 平台 | 文件 |
|------|------|
| Windows | Anything-Analyzer-Setup-3.6.7.exe |
| macOS (Apple Silicon) | Anything-Analyzer-3.6.7-arm64.dmg |
| macOS (Intel) | Anything-Analyzer-3.6.7-x64.dmg |
| Linux | Anything-Analyzer-3.6.7.AppImage |
