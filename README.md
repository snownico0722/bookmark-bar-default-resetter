# Bookmark Bar Default Resetter

[English](#english) | [中文](#中文)

---

## English

A minimal Chrome extension (Manifest V3) that keeps the **bookmarks bar** as the default folder for your next saved bookmark.

### Why
Chrome remembers the last folder you saved a bookmark into and uses it as the default next time. If you once saved into a deep subfolder, every new bookmark keeps landing there. This extension nudges that default back to the bookmarks bar.

### How it works
When a bookmark or folder is created, moved, or after an import finishes, the extension creates a temporary marker bookmark in the bookmarks bar and immediately removes it. That touch leaves the bookmarks bar as Chrome's "last used" folder, so your next save defaults there.

It stays out of your way:
- Skips activity during bookmark imports.
- Throttles touches (min. 1s apart) and ignores its own marker.
- Cleans up any leftover marker on startup and before creating a new one.

### Install
1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `bookmark-bar-default-resetter` folder.

### Files
- `manifest.json` — extension manifest (permissions: `bookmarks`, `storage`).
- `background.js` — service worker with all the logic.

---

## 中文

一个极简的 Chrome 扩展（Manifest V3），让**书签栏**始终作为你下次保存书签时的默认文件夹。

### 为什么需要它
Chrome 会记住你上次保存书签的文件夹，并把它作为下次的默认位置。如果你曾经存到某个很深的子文件夹里，之后新建的书签就会一直落在那里。这个扩展会把默认位置重新拉回书签栏。

### 工作原理
当有书签或文件夹被创建、移动，或一次导入完成后，扩展会在书签栏里创建一个临时标记书签，然后立刻删除它。这个"触碰"动作让书签栏成为 Chrome 记忆中"最近使用"的文件夹，于是你下次保存就会默认存到这里。

它尽量不打扰你：
- 在书签导入期间不做任何动作。
- 限制触碰频率（至少间隔 1 秒），并忽略自己创建的标记。
- 启动时和创建新标记前会清理掉残留的标记书签。

### 安装
1. 打开 `chrome://extensions`。
2. 开启**开发者模式**。
3. 点击**加载已解压的扩展程序**，选择 `bookmark-bar-default-resetter` 文件夹。

### 文件说明
- `manifest.json` — 扩展清单（权限：`bookmarks`、`storage`）。
- `background.js` — 包含全部逻辑的 service worker。
