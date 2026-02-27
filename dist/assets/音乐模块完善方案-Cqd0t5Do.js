const r=`---\r
title: "音乐模块完善方案（Vue3 + TypeScript）"\r
date: "2026-02-10"\r
category: "前端开发"\r
tags:\r
  - "Vue3"\r
  - "TypeScript"\r
  - "音乐播放器"\r
  - "Audio API"\r
  - "Web Audio"\r
description: "个人博客音乐模块完整实现方案，包含音乐播放器设计、歌单管理、可视化效果、歌词同步等核心功能"\r
author: "SuiXin"\r
readTime: "18 min"\r
---\r
\r
# 音乐模块完善方案\r
\r
## 一、现状分析\r
\r
### 当前状态\r
\r
**文件结构**：\r
\`\`\`\r
src/components/music/\r
├── MusicMain.vue          # 空白组件，显示 "musicMain"\r
└── MusicSidebar.vue       # 空白组件，显示 "1234"\r
\`\`\`\r
\r
**主要问题**：\r
- ❌ \`MusicMain.vue\` - 完全空白，无任何功能\r
- ❌ \`MusicSidebar.vue\` - 仅显示测试文本\r
- ❌ 无音乐数据结构\r
- ❌ 无播放器逻辑\r
- ❌ 无任何音频资源\r
\r
**结论**：音乐模块处于未开发状态，需要从零开始设计。\r
\r
---\r
\r
## 二、模块定位与功能设计\r
\r
### 2.1 音乐模块是什么？\r
\r
**音乐模块** 是个人博客的音频内容展示和播放系统，具有以下特点：\r
\r
| 特征 | 说明 |\r
|------|------|\r
| 🎵 **音乐展示** | 展示博主推荐的音乐、歌单 |\r
| 🎧 **在线播放** | 支持 MP3/FLAC 等格式在线播放 |\r
| 📝 **歌词同步** | 支持 LRC 歌词滚动显示 |\r
| 🎨 **可视化效果** | 音频波形、频谱可视化 |\r
| 📋 **歌单管理** | 创建和管理个人歌单 |\r
| 🔀 **播放控制** | 播放/暂停/上一曲/下一曲/循环 |\r
\r
### 2.2 核心价值\r
\r
- ✅ **展示品味** - 展示博主的音乐品味\r
- ✅ **增强体验** - 为访问者提供音乐陪伴\r
- ✅ **放松氛围** - 营造轻松的浏览环境\r
- ✅ **个性化** - 定制专属音乐空间\r
\r
### 2.3 与其他模块的关系\r
\r
| 模块 | 关系 | 说明 |\r
|------|------|------|\r
| **博客** | 独立 | 博客阅读时可播放背景音乐 |\r
| **说说** | 独立 | 可在说说中分享音乐 |\r
| **游戏** | 配合 | 游戏时可播放背景音乐 |\r
\r
---\r
\r
## 三、数据结构设计\r
\r
### 3.1 类型定义\r
\r
**文件**: \`src/types/music.ts\`\r
\r
\`\`\`typescript\r
/**\r
 * 音乐模块类型定义\r
 */\r
\r
/** 音乐格式 */\r
export type MusicFormat = 'mp3' | 'flac' | 'wav' | 'ogg' | 'm4a'\r
\r
/** 播放模式 */\r
export type PlayMode = 'sequence' | 'loop' | 'random' | 'loop-one'\r
\r
/** 播放状态 */\r
export type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error'\r
\r
/** 歌词行 */\r
export interface LyricLine {\r
  time: number        // 时间戳（秒）\r
  text: string        // 歌词文本\r
  translation?: string // 翻译（可选）\r
}\r
\r
/** 音乐信息 */\r
export interface Music {\r
  /** 唯一标识 */\r
  id: string\r
  /** 歌曲标题 */\r
  title: string\r
  /** 艺术家/歌手 */\r
  artist: string\r
  /** 专辑名称 */\r
  album?: string\r
  /** 封面图 */\r
  cover?: string\r
  /** 音频文件URL */\r
  url: string\r
  /** 音频格式 */\r
  format: MusicFormat\r
  /** 时长（秒） */\r
  duration: number\r
  /** 文件大小（字节） */\r
  size?: number\r
  /** 音频比特率 */\r
  bitrate?: number\r
  /** 歌词文件URL */\r
  lyricUrl?: string\r
  /** 解析后的歌词 */\r
  lyrics?: LyricLine[]\r
  /** 发行年份 */\r
  year?: number\r
  /** 流派 */\r
  genre?: string\r
  /** 语言 */\r
  language?: string\r
  /** 播放次数 */\r
  playCount?: number\r
  /** 添加时间 */\r
  addedAt: string\r
}\r
\r
/** 歌单 */\r
export interface Playlist {\r
  /** 唯一标识 */\r
  id: string\r
  /** 歌单名称 */\r
  name: string\r
  /** 歌单描述 */\r
  description?: string\r
  /** 封面图 */\r
  cover?: string\r
  /** 歌曲列表 */\r
  musicIds: string[]\r
  /** 歌曲数量 */\r
  musicCount: number\r
  /** 总时长 */\r
  totalDuration: number\r
  /** 创建时间 */\r
  createdAt: string\r
  /** 更新时间 */\r
  updatedAt?: string\r
  /** 是否公开 */\r
  isPublic: boolean\r
}\r
\r
/** 播放器状态 */\r
export interface PlayerState {\r
  /** 当前音乐 */\r
  currentMusic: Music | null\r
  /** 当前歌单 */\r
  currentPlaylist: Playlist | null\r
  /** 播放状态 */\r
  status: PlayerStatus\r
  /** 当前时间（秒） */\r
  currentTime: number\r
  /** 音量（0-1） */\r
  volume: number\r
  /** 是否静音 */\r
  isMuted: boolean\r
  /** 播放模式 */\r
  playMode: PlayMode\r
  /** 播放列表（当前歌单的音乐列表） */\r
  playList: Music[]\r
  /** 当前索引 */\r
  currentIndex: number\r
  /** 加载进度（0-1） */\r
  loadProgress: number\r
}\r
\r
/** 音乐统计数据 */\r
export interface MusicStats {\r
  /** 总歌曲数 */\r
  totalMusic: number\r
  /** 总歌单数 */\r
  totalPlaylists: number\r
  /** 总播放时长 */\r
  totalDuration: number\r
  /** 最爱流派 */\r
  favoriteGenre?: string\r
}\r
\`\`\`\r
\r
### 3.2 数据存储方案\r
\r
#### 方案对比\r
\r
| 方案 | 优点 | 缺点 | 推荐度 |\r
|------|------|------|--------|\r
| **方案一：本地文件** | 简单，不依赖网络 | 需手动管理文件 | ⭐⭐⭐⭐⭐ |\r
| **方案二：CDN+配置** | 加载快，节省流量 | 需要CDN服务 | ⭐⭐⭐⭐ |\r
| **方案三：音乐API** | 功能强大，无限制 | 需要后端支持 | ⭐⭐⭐ |\r
\r
**推荐方案**：**本地文件 + 可选CDN**\r
\r
\`\`\`typescript\r
// 配置文件示例\r
export const musicConfig = {\r
  // 本地音频文件路径\r
  localPath: '/music/',\r
\r
  // CDN路径（可选）\r
  cdnPath: 'https://cdn.example.com/music/',\r
\r
  // 使用CDN\r
  useCDN: false,\r
\r
  // 支持的格式\r
  supportedFormats: ['mp3', 'flac', 'wav', 'ogg', 'm4a']\r
}\r
\`\`\`\r
\r
#### 数据结构示例\r
\r
**音乐数据文件**: \`src/config/music/music.data.ts\`\r
\r
\`\`\`typescript\r
import type { Music, Playlist } from '@/types/music'\r
\r
/** 音乐列表 */\r
export const musicData: Music[] = [\r
  {\r
    id: 'music-001',\r
    title: '晴天',\r
    artist: '周杰伦',\r
    album: '叶惠美',\r
    cover: '/music/covers/ye-hui-mei.jpg',\r
    url: '/music/songs/qing-tian.mp3',\r
    format: 'mp3',\r
    duration: 269,\r
    year: 2003,\r
    genre: '流行',\r
    language: '中文',\r
    addedAt: '2025-01-15T00:00:00.000Z'\r
  },\r
  {\r
    id: 'music-002',\r
    title: 'Bohemian Rhapsody',\r
    artist: 'Queen',\r
    album: 'A Night at the Opera',\r
    cover: '/music/covers/bohemian-rhapsody.jpg',\r
    url: '/music/songs/bohemian-rhapsody.mp3',\r
    format: 'mp3',\r
    duration: 354,\r
    year: 1975,\r
    genre: 'Rock',\r
    language: 'English',\r
    addedAt: '2025-01-15T00:00:00.000Z'\r
  }\r
]\r
\r
/** 歌单列表 */\r
export const playlistData: Playlist[] = [\r
  {\r
    id: 'playlist-001',\r
    name: '我的最爱',\r
    description: '精选好歌，循环播放',\r
    cover: '/music/playlists/favorites.jpg',\r
    musicIds: ['music-001', 'music-002'],\r
    musicCount: 2,\r
    totalDuration: 623,\r
    createdAt: '2025-01-15T00:00:00.000Z',\r
    isPublic: true\r
  },\r
  {\r
    id: 'playlist-002',\r
    name: '工作学习',\r
    description: '专注时的背景音乐',\r
    musicIds: ['music-001'],\r
    musicCount: 1,\r
    totalDuration: 269,\r
    createdAt: '2025-01-15T00:00:00.000Z',\r
    isPublic: true\r
  }\r
]\r
\`\`\`\r
\r
---\r
\r
## 四、组件架构设计\r
\r
### 4.1 文件结构\r
\r
\`\`\`\r
src/\r
├── types/\r
│   └── music.ts                       # 音乐类型定义\r
├── stores/\r
│   └── music.ts                       # 音乐状态管理（Pinia）\r
├── composables/\r
│   ├── useMusicPlayer.ts              # 播放器核心逻辑\r
│   ├── useLyric.ts                    # 歌词解析\r
│   └── useVisualizer.ts               # 音频可视化\r
├── components/music/\r
│   ├── MusicMain.vue                  # 主容器\r
│   ├── MusicSidebar.vue               # 侧边栏\r
│   ├── player/\r
│   │   ├── MusicPlayer.vue            # 播放器主组件\r
│   │   ├── PlayerControls.vue         # 播放控制条\r
│   │   ├── PlayerProgress.vue         # 进度条\r
│   │   ├── PlayerVolume.vue           # 音量控制\r
│   │   └── PlayerMode.vue             # 播放模式切换\r
│   ├── playlist/\r
│   │   ├── PlaylistList.vue           # 歌单列表\r
│   │   ├── PlaylistCard.vue           # 歌单卡片\r
│   │   └── PlaylistDetail.vue         # 歌单详情\r
│   ├── music-list/\r
│   │   ├── MusicList.vue              # 音乐列表\r
│   │   ├── MusicItem.vue              # 单首音乐卡片\r
│   │   └── MusicEmpty.vue             # 空状态\r
│   ├── lyric/\r
│   │   ├── LyricPanel.vue             # 歌词面板\r
│   │   ├── LyricLine.vue              # 歌词行\r
│   │   └── LyricSearch.vue            # 歌词搜索\r
│   ├── visualizer/\r
│   │   ├── AudioVisualizer.vue         # 可视化容器\r
│   │   └── Waveform.vue               # 波形显示\r
│   └── upload/\r
│       └── MusicUpload.vue            # 音乐上传（可选）\r
└── utils/\r
    └── lyric.ts                       # 歌词解析工具\r
\`\`\`\r
\r
### 4.2 核心组件说明\r
\r
#### MusicPlayer.vue（播放器主组件）\r
\r
**职责**：\r
- 管理音频播放\r
- 显示当前音乐信息\r
- 整合控制条、进度条、音量等\r
- 集成歌词面板\r
\r
**核心逻辑**：\r
\`\`\`typescript\r
import { ref, onMounted, onUnmounted } from 'vue'\r
import { useMusicStore } from '@/stores/music'\r
\r
export function useMusicPlayer() {\r
  const audio = ref<HTMLAudioElement | null>(null)\r
  const store = useMusicStore()\r
\r
  // 初始化音频对象\r
  onMounted(() => {\r
    audio.value = new Audio()\r
    setupAudioEvents()\r
  })\r
\r
  // 设置音频事件监听\r
  function setupAudioEvents() {\r
    if (!audio.value) return\r
\r
    audio.value.addEventListener('timeupdate', handleTimeUpdate)\r
    audio.value.addEventListener('ended', handleEnded)\r
    audio.value.addEventListener('loadedmetadata', handleLoadedMetadata)\r
    audio.value.addEventListener('error', handleError)\r
    audio.value.addEventListener('progress', handleProgress)\r
  }\r
\r
  // 播放/暂停\r
  async function togglePlay() {\r
    if (!audio.value) return\r
\r
    if (store.status === 'playing') {\r
      audio.value.pause()\r
      store.setStatus('paused')\r
    } else {\r
      await audio.value.play()\r
      store.setStatus('playing')\r
    }\r
  }\r
\r
  // 加载音乐\r
  async function loadMusic(music: Music) {\r
    if (!audio.value) return\r
\r
    store.setStatus('loading')\r
    audio.value.src = music.url\r
    audio.value.load()\r
  }\r
\r
  // 跳转到指定时间\r
  function seek(time: number) {\r
    if (!audio.value) return\r
    audio.value.currentTime = time\r
  }\r
\r
  // 设置音量\r
  function setVolume(volume: number) {\r
    if (!audio.value) return\r
    audio.value.volume = volume\r
  }\r
\r
  return {\r
    audio,\r
    togglePlay,\r
    loadMusic,\r
    seek,\r
    setVolume\r
  }\r
}\r
\`\`\`\r
\r
#### PlayerControls.vue（播放控制条）\r
\r
**UI布局**：\r
\`\`\`\r
┌─────────────────────────────────────────────┐\r
│  ◀◀  ▶  ►►  🔀  📋                     🔊  ▢ │\r
└─────────────────────────────────────────────┘\r
\`\`\`\r
\r
**功能按钮**：\r
- \`◀◀\` - 上一曲\r
- \`▶\` - 播放/暂停\r
- \`►►\` - 下一曲\r
- \`🔀\` - 切换播放模式（顺序/循环/随机/单曲循环）\r
- \`📋\` - 打开播放列表\r
- \`🔊\` - 音量控制\r
- \`▢\` - 打开歌词面板\r
\r
#### PlayerProgress.vue（进度条）\r
\r
**功能**：\r
- 显示播放进度（当前时间/总时长）\r
- 可拖拽进度条跳转\r
- 显示缓冲进度\r
\r
**样式设计**：\r
\`\`\`css\r
.player-progress {\r
  display: flex;\r
  align-items: center;\r
  gap: 12px;\r
}\r
\r
.progress-bar {\r
  flex: 1;\r
  height: 4px;\r
  background: #e5e7eb;\r
  border-radius: 2px;\r
  cursor: pointer;\r
  position: relative;\r
}\r
\r
.progress-current {\r
  height: 100%;\r
  background: var(--music-primary);\r
  border-radius: 2px;\r
  position: relative;\r
}\r
\r
.progress-handle {\r
  position: absolute;\r
  right: -6px;\r
  top: 50%;\r
  transform: translateY(-50%);\r
  width: 12px;\r
  height: 12px;\r
  background: #fff;\r
  border-radius: 50%;\r
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);\r
  opacity: 0;\r
  transition: opacity 0.2s;\r
}\r
\r
.progress-bar:hover .progress-handle {\r
  opacity: 1;\r
}\r
\r
.time-display {\r
  font-size: 12px;\r
  color: var(--text-secondary);\r
  font-variant-numeric: tabular-nums;\r
}\r
\`\`\`\r
\r
#### LyricPanel.vue（歌词面板）\r
\r
**功能**：\r
- 显示同步歌词\r
- 高亮当前行\r
- 自动滚动\r
- 支持手动滚动\r
\r
**核心逻辑**：\r
\`\`\`typescript\r
import { ref, watch, computed } from 'vue'\r
import type { LyricLine } from '@/types/music'\r
\r
export function useLyric(lyrics: LyricLine[], currentTime: number) {\r
  const containerRef = ref<HTMLElement | null>(null)\r
\r
  // 当前高亮的歌词行索引\r
  const currentIndex = computed(() => {\r
    return lyrics.findIndex((line, idx) => {\r
      const nextLine = lyrics[idx + 1]\r
      return (\r
        currentTime >= line.time &&\r
        (!nextLine || currentTime < nextLine.time)\r
      )\r
    })\r
  })\r
\r
  // 自动滚动到当前行\r
  function scrollToCurrent() {\r
    if (!containerRef.value) return\r
\r
    const currentLine = containerRef.value.querySelector('.lyric-line.active')\r
    if (currentLine) {\r
      currentLine.scrollIntoView({\r
        behavior: 'smooth',\r
        block: 'center'\r
      })\r
    }\r
  }\r
\r
  return {\r
    containerRef,\r
    currentIndex,\r
    scrollToCurrent\r
  }\r
}\r
\`\`\`\r
\r
#### AudioVisualizer.vue（音频可视化）\r
\r
**类型**：\r
1. **波形图** - 显示音频波形\r
2. **频谱图** - 显示频率分布\r
3. **圆形频谱** - 圆形可视化效果\r
\r
**实现方案**（使用 Web Audio API）：\r
\`\`\`typescript\r
import { ref, onMounted, onUnmounted } from 'vue'\r
\r
export function useAudioVisualizer(audio: HTMLAudioElement) {\r
  const canvasRef = ref<HTMLCanvasElement | null>(null)\r
  let audioContext: AudioContext | null = null\r
  let analyser: AnalyserNode | null = null\r
  let animationId: number | null = null\r
\r
  function initVisualizer() {\r
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()\r
    analyser = audioContext.createAnalyser()\r
\r
    const source = audioContext.createMediaElementSource(audio)\r
    source.connect(analyser)\r
    analyser.connect(audioContext.destination)\r
\r
    analyser.fftSize = 256\r
    draw()\r
  }\r
\r
  function draw() {\r
    if (!canvasRef.value || !analyser) return\r
\r
    const canvas = canvasRef.value\r
    const ctx = canvas.getContext('2d')!\r
    const bufferLength = analyser.frequencyBinCount\r
    const dataArray = new Uint8Array(bufferLength)\r
\r
    analyser.getByteFrequencyData(dataArray)\r
\r
    // 绘制逻辑...\r
    animationId = requestAnimationFrame(draw)\r
  }\r
\r
  return {\r
    canvasRef,\r
    initVisualizer\r
  }\r
}\r
\`\`\`\r
\r
---\r
\r
## 五、核心功能实现\r
\r
### 5.1 状态管理（Pinia Store）\r
\r
**文件**: \`src/stores/music.ts\`\r
\r
\`\`\`typescript\r
import { defineStore } from 'pinia'\r
import { ref, computed } from 'vue'\r
import type { Music, Playlist, PlayerState, PlayMode, PlayerStatus } from '@/types/music'\r
import { musicData, playlistData } from '@/config/music/music.data'\r
\r
export const useMusicStore = defineStore('music', () => {\r
  // ========== 状态 ==========\r
  const playerState = ref<PlayerState>({\r
    currentMusic: null,\r
    currentPlaylist: null,\r
    status: 'idle',\r
    currentTime: 0,\r
    volume: 0.7,\r
    isMuted: false,\r
    playMode: 'sequence',\r
    playList: [],\r
    currentIndex: -1,\r
    loadProgress: 0\r
  })\r
\r
  const playlists = ref<Playlist[]>(playlistData)\r
  const allMusic = ref<Music[]>(musicData)\r
\r
  // ========== 计算属性 ==========\r
\r
  /** 总音乐数 */\r
  const totalMusic = computed(() => allMusic.value.length)\r
\r
  /** 总歌单数 */\r
  const totalPlaylists = computed(() => playlists.value.length)\r
\r
  /** 当前播放列表的总时长 */\r
  const currentPlaylistDuration = computed(() => {\r
    return playerState.value.playList.reduce((sum, music) => sum + music.duration, 0)\r
  })\r
\r
  /** 格式化当前时间 */\r
  const formattedCurrentTime = computed(() => {\r
    return formatTime(playerState.value.currentTime)\r
  })\r
\r
  /** 格式化总时长 */\r
  const formattedDuration = computed(() => {\r
    const music = playerState.value.currentMusic\r
    return music ? formatTime(music.duration) : '0:00'\r
  })\r
\r
  /** 进度百分比 */\r
  const progressPercent = computed(() => {\r
    const music = playerState.value.currentMusic\r
    if (!music) return 0\r
    return (playerState.value.currentTime / music.duration) * 100\r
  })\r
\r
  // ========== 方法 ==========\r
\r
  /** 加载歌单 */\r
  function loadPlaylist(playlist: Playlist) {\r
    playerState.value.currentPlaylist = playlist\r
    playerState.value.playList = allMusic.value.filter(m =>\r
      playlist.musicIds.includes(m.id)\r
    )\r
    playerState.value.currentIndex = 0\r
\r
    if (playerState.value.playList.length > 0) {\r
      playMusic(playerState.value.playList[0])\r
    }\r
  }\r
\r
  /** 播放音乐 */\r
  function playMusic(music: Music) {\r
    playerState.value.currentMusic = music\r
    playerState.value.status = 'loading'\r
    // 触发音频加载...\r
  }\r
\r
  /** 播放/暂停 */\r
  function togglePlay() {\r
    const status = playerState.value.status\r
    if (status === 'playing') {\r
      playerState.value.status = 'paused'\r
    } else {\r
      playerState.value.status = 'playing'\r
    }\r
  }\r
\r
  /** 下一曲 */\r
  function nextMusic() {\r
    const { currentIndex, playList, playMode } = playerState.value\r
    if (playList.length === 0) return\r
\r
    let nextIndex = 0\r
\r
    switch (playMode) {\r
      case 'sequence':\r
        nextIndex = (currentIndex + 1) % playList.length\r
        break\r
      case 'random':\r
        nextIndex = Math.floor(Math.random() * playList.length)\r
        break\r
      case 'loop-one':\r
        // 单曲循环，不切换\r
        return\r
      case 'loop':\r
        nextIndex = (currentIndex + 1) % playList.length\r
        break\r
    }\r
\r
    playerState.value.currentIndex = nextIndex\r
    playMusic(playList[nextIndex])\r
  }\r
\r
  /** 上一曲 */\r
  function prevMusic() {\r
    const { currentIndex, playList } = playerState.value\r
    if (playList.length === 0) return\r
\r
    const prevIndex = currentIndex <= 0\r
      ? playList.length - 1\r
      : currentIndex - 1\r
\r
    playerState.value.currentIndex = prevIndex\r
    playMusic(playList[prevIndex])\r
  }\r
\r
  /** 切换播放模式 */\r
  function togglePlayMode() {\r
    const modes: PlayMode[] = ['sequence', 'loop', 'random', 'loop-one']\r
    const currentIndex = modes.indexOf(playerState.value.playMode)\r
    const nextIndex = (currentIndex + 1) % modes.length\r
    playerState.value.playMode = modes[nextIndex]\r
  }\r
\r
  /** 更新当前时间 */\r
  function updateCurrentTime(time: number) {\r
    playerState.value.currentTime = time\r
  }\r
\r
  /** 跳转进度 */\r
  function seekTo(percent: number) {\r
    const music = playerState.value.currentMusic\r
    if (!music) return\r
\r
    playerState.value.currentTime = (percent / 100) * music.duration\r
    // 触发音频跳转...\r
  }\r
\r
  /** 设置音量 */\r
  function setVolume(volume: number) {\r
    playerState.value.volume = Math.max(0, Math.min(1, volume))\r
    playerState.value.isMuted = volume === 0\r
  }\r
\r
  /** 切换静音 */\r
  function toggleMute() {\r
    playerState.value.isMuted = !playerState.value.isMuted\r
    playerState.value.volume = playerState.value.isMuted ? 0 : 0.7\r
  }\r
\r
  /** 更新加载进度 */\r
  function updateLoadProgress(progress: number) {\r
    playerState.value.loadProgress = progress\r
  }\r
\r
  return {\r
    // 状态\r
    playerState,\r
    playlists,\r
    allMusic,\r
\r
    // 计算属性\r
    totalMusic,\r
    totalPlaylists,\r
    currentPlaylistDuration,\r
    formattedCurrentTime,\r
    formattedDuration,\r
    progressPercent,\r
\r
    // 方法\r
    loadPlaylist,\r
    playMusic,\r
    togglePlay,\r
    nextMusic,\r
    prevMusic,\r
    togglePlayMode,\r
    updateCurrentTime,\r
    seekTo,\r
    setVolume,\r
    toggleMute,\r
    updateLoadProgress\r
  }\r
}, {\r
  persist: {\r
    key: 'blog_music_store',\r
    storage: localStorage,\r
    pick: ['volume', 'playMode']\r
  }\r
})\r
\`\`\`\r
\r
### 5.2 歌词解析\r
\r
**文件**: \`src/utils/lyric.ts\`\r
\r
\`\`\`typescript\r
import type { LyricLine } from '@/types/music'\r
\r
/**\r
 * 解析 LRC 歌词\r
 */\r
export function parseLRC(lrc: string): LyricLine[] {\r
  const lines: LyricLine[] = []\r
  const timeRegex = /^\\[(\\d{2}):(\\d{2})\\.(\\d{2,3})\\](.*)$/\r
\r
  lrc.split('\\n').forEach(line => {\r
    const match = line.match(timeRegex)\r
    if (match) {\r
      const minutes = parseInt(match[1])\r
      const seconds = parseInt(match[2])\r
      const milliseconds = parseInt(match[3].padEnd(3, '0'))\r
      const text = match[4].trim()\r
\r
      lines.push({\r
        time: minutes * 60 + seconds + milliseconds / 1000,\r
        text\r
      })\r
    }\r
  })\r
\r
  return lines\r
}\r
\r
/**\r
 * 从 URL 加载歌词\r
 */\r
export async function loadLyric(url: string): Promise<LyricLine[]> {\r
  try {\r
    const response = await fetch(url)\r
    const lrc = await response.text()\r
    return parseLRC(lrc)\r
  } catch (error) {\r
    console.error('加载歌词失败:', error)\r
    return []\r
  }\r
}\r
\r
/**\r
 * 搜索歌词\r
 */\r
export function searchLyric(lyrics: LyricLine[], keyword: string): LyricLine[] {\r
  if (!keyword.trim()) return lyrics\r
\r
  const lowerKeyword = keyword.toLowerCase()\r
  return lyrics.filter(line =>\r
    line.text.toLowerCase().includes(lowerKeyword)\r
  )\r
}\r
\`\`\`\r
\r
**LRC 格式示例**：\r
\`\`\`\r
[00:00.00]纯音乐 - 晴天\r
[00:03.50]作曲：周杰伦\r
[00:05.00]作词：周杰伦\r
[00:10.50]故事的小黄花\r
[00:13.20]从出生那年就飘着\r
[00:16.80]童年的荡秋千\r
[00:19.30]随记忆一直晃到现在\r
\`\`\`\r
\r
### 5.3 时间格式化工具\r
\r
**文件**: \`src/utils/time.ts\`\r
\r
\`\`\`typescript\r
/**\r
 * 格式化时间（秒 -> mm:ss）\r
 */\r
export function formatTime(seconds: number): string {\r
  if (!isFinite(seconds) || seconds < 0) return '0:00'\r
\r
  const mins = Math.floor(seconds / 60)\r
  const secs = Math.floor(seconds % 60)\r
\r
  return \`\${mins}:\${secs.toString().padStart(2, '0')}\`\r
}\r
\r
/**\r
 * 格式化详细时间（秒 -> HH:mm:ss）\r
 */\r
export function formatDetailedTime(seconds: number): string {\r
  if (!isFinite(seconds) || seconds < 0) return '0:00:00'\r
\r
  const hours = Math.floor(seconds / 3600)\r
  const mins = Math.floor((seconds % 3600) / 60)\r
  const secs = Math.floor(seconds % 60)\r
\r
  if (hours > 0) {\r
    return \`\${hours}:\${mins.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}\`\r
  }\r
  return \`\${mins}:\${secs.toString().padStart(2, '0')}\`\r
}\r
\r
/**\r
 * 解析时间字符串（mm:ss -> 秒）\r
 */\r
export function parseTime(timeStr: string): number {\r
  const parts = timeStr.split(':').map(Number)\r
\r
  if (parts.length === 2) {\r
    const [mins, secs] = parts\r
    return mins * 60 + secs\r
  } else if (parts.length === 3) {\r
    const [hours, mins, secs] = parts\r
    return hours * 3600 + mins * 60 + secs\r
  }\r
\r
  return 0\r
}\r
\`\`\`\r
\r
---\r
\r
## 六、页面布局设计\r
\r
### 6.1 主页面布局\r
\r
**PC端布局（≥768px）**：\r
\r
\`\`\`\r
┌─────────────────────────────────────────────────────┐\r
│  音乐                          [播放器]           [歌词] │\r
├──────────────────────┬────────────────────────────────┤\r
│                      │                                │\r
│  侧边栏（280px）     │  主内容区（自适应）           │\r
│  ┌────────────────┐ │  ┌──────────────────────────┐ │\r
│  │ 播放器控制     │ │  │  当前播放                  │ │\r
│  │ ┌────────────┐ │ │  │  ┌────────────────────┐ │ │\r
│  │ │ 封面       │ │ │  │  │ 封面 │ 标题         │ │ │\r
│  │ │            │ │ │  │  │      │ 歌──────────┐ │ │ │\r
│  │ │ 标题        │ │ │  │  │      │ │ 晴天    │ │ │ │\r
│  │ │ 歌──────────┐│ │ │  │  │      │ │ 周杰伦   │ │ │ │\r
│  │ │ │ 晴天     ││ │ │  │  └────────────────────┘ │ │\r
│  │ │ │ 周杰伦   ││ │ │  │                          │ │\r
│  │ │ └──────────┘│ │ │  │  [上一曲] [播放] [下一曲]  │ │\r
│  │ └────────────┘ │ │  │  ─────────○─────── 3:45 │ │ │\r
│  └────────────────┘ │  │                          │ │\r
│                      │  │  [顺序播放 ▼] [歌词] [列表]│ │\r
│  ┌────────────────┐ │  └──────────────────────────┘ │\r
│  │ 歌单列表       │ │                                │\r
│  │ ├─ 我的最爱   │ │  ┌──────────────────────────┐ │\r
│  │ ├─ 工作学习   │ │  │  全部音乐                   │ │\r
│  │ ├─ 经典老歌   │ │  │  ┌──────────────────────┐ │ │\r
│  │ └─ 欧美金曲   │ │  │  │ 🎵 晴天               │ │\r
│  └────────────────┘ │  │  │ 周杰伦                  │ │ │\r
│                      │  │  │ 4:49  流行               │ │ │\r
│  ┌────────────────┐ │  │  │ [播放] [添加到歌单]     │ │ │\r
│  │ 统计信息       │ │  │  └──────────────────────┘ │ │\r
│  │ 歌曲：50      │ │  │  ┌──────────────────────┐ │ │\r
│  │ 歌单：5       │ │  │  │ 🎵 Bohemian Rhapsody   │ │ │\r
│  │ 时长：3:25:00 │ │  │  │ Queen                   │ │ │\r
│  └────────────────┘ │  │  │ 5:54  Rock               │ │ │\r
│                      │  │  │ [播放] [添加到歌单]     │ │ │\r
│                      │  │  └──────────────────────┘ │ │\r
│                      │  │                          │ │\r
│                      │  │  [加载更多]               │ │\r
└──────────────────────┴────────────────────────────────┘\r
\`\`\`\r
\r
**移动端布局（<768px）**：\r
\r
\`\`\`\r
┌─────────────────┐\r
│ 音乐            │\r
├─────────────────┤\r
│ 当前播放        │\r
│ ┌─────────────┐ │\r
│ │ 封面 │ 晴天  │ │\r
│ └─────────────┘ │\r
│ 周杰伦          │\r
│ ─────○──── 3:45 │\r
│ [▶] [≡] [≣]     │\r
├─────────────────┤\r
│ [歌单] [列表]   │\r
├─────────────────┤\r
│                 │\r
│ 🎵 晴天         │\r
│ 周杰伦          │\r
│ 4:49  流行      │\r
│ [播放] [...]    │\r
│                 │\r
│ 🎵 Bohemian    │\r
│ Queen           │\r
│ 5:54  Rock      │\r
│ [播放] [...]    │\r
│                 │\r
└─────────────────┘\r
\`\`\`\r
\r
### 6.2 响应式设计\r
\r
\`\`\`css\r
/* PC端 */\r
@media (min-width: 768px) {\r
  .music-container {\r
    display: grid;\r
    grid-template-columns: 280px 1fr;\r
    gap: 20px;\r
  }\r
\r
  .music-sidebar {\r
    position: sticky;\r
    top: 20px;\r
    height: fit-content;\r
  }\r
}\r
\r
/* 移动端 */\r
@media (max-width: 767px) {\r
  .music-container {\r
    display: block;\r
  }\r
\r
  .music-sidebar {\r
    position: fixed;\r
    bottom: 0;\r
    left: 0;\r
    right: 0;\r
    background: #fff;\r
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);\r
    padding: 12px;\r
    z-index: 100;\r
  }\r
\r
  .player-controls {\r
    position: fixed;\r
    bottom: 60px; /* 留出侧边栏空间 */\r
    left: 0;\r
    right: 0;\r
    background: #fff;\r
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);\r
    padding: 12px;\r
    z-index: 99;\r
  }\r
}\r
\`\`\`\r
\r
---\r
\r
## 七、样式设计规范\r
\r
### 7.1 配色方案\r
\r
\`\`\`css\r
:root {\r
  /* 音乐主题色 */\r
  --music-primary: #8b5cf6;\r
  --music-primary-hover: #7c3aed;\r
  --music-primary-light: #ede9fe;\r
\r
  /* 辅助色 */\r
  --music-secondary: #ec4899;\r
  --music-accent: #f59e0b;\r
\r
  /* 内容颜色 */\r
  --music-text-primary: #1a1a1a;\r
  --music-text-secondary: #6b7280;\r
  --music-text-tertiary: #9ca3af;\r
\r
  /* 背景色 */\r
  --music-bg: #f9fafb;\r
  --music-card-bg: #ffffff;\r
\r
  /* 播放器颜色 */\r
  --player-bg: rgba(17, 24, 39, 0.95);\r
  --player-text: #fff;\r
\r
  /* 进度条 */\r
  --progress-bg: #e5e7eb;\r
  --progress-current: #8b5cf6;\r
\r
  /* 音量条 */\r
  --volume-bg: #374151;\r
  --volume-current: #8b5cf6;\r
}\r
\`\`\`\r
\r
### 7.2 播放器样式\r
\r
**固定底部播放器**：\r
\`\`\`css\r
.player-bar {\r
  position: fixed;\r
  bottom: 0;\r
  left: 0;\r
  right: 0;\r
  background: var(--player-bg);\r
  backdrop-filter: blur(10px);\r
  padding: 12px 20px;\r
  z-index: 1000;\r
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);\r
}\r
\r
.player-bar .info {\r
  display: flex;\r
  align-items: center;\r
  gap: 12px;\r
}\r
\r
.player-bar .cover {\r
  width: 48px;\r
  height: 48px;\r
  border-radius: 6px;\r
  overflow: hidden;\r
  animation: rotate 10s linear infinite;\r
  animation-play-state: paused;\r
}\r
\r
.player-bar .cover.playing {\r
  animation-play-state: running;\r
}\r
\r
@keyframes rotate {\r
  from { transform: rotate(0deg); }\r
  to { transform: rotate(360deg); }\r
}\r
\r
.player-bar .title {\r
  color: var(--player-text);\r
  font-size: 14px;\r
  font-weight: 500;\r
}\r
\r
.player-bar .artist {\r
  color: rgba(255, 255, 255, 0.7);\r
  font-size: 12px;\r
  margin-top: 2px;\r
}\r
\`\`\`\r
\r
**歌词面板样式**：\r
\`\`\`css\r
.lyric-panel {\r
  position: fixed;\r
  right: 20px;\r
  top: 50%;\r
  transform: translateY(-50%);\r
  width: 400px;\r
  height: 600px;\r
  background: rgba(17, 24, 39, 0.95);\r
  backdrop-filter: blur(10px);\r
  border-radius: 12px;\r
  padding: 20px;\r
  z-index: 999;\r
  overflow: hidden;\r
}\r
\r
.lyric-container {\r
  height: 100%;\r
  overflow-y: auto;\r
  scroll-behavior: smooth;\r
}\r
\r
.lyric-line {\r
  padding: 12px 0;\r
  color: rgba(255, 255, 255, 0.5);\r
  font-size: 15px;\r
  line-height: 1.6;\r
  transition: all 0.3s;\r
}\r
\r
.lyric-line.active {\r
  color: #8b5cf6;\r
  font-size: 18px;\r
  font-weight: 600;\r
}\r
\`\`\`\r
\r
---\r
\r
## 八、功能分阶段实现\r
\r
### 阶段一：基础播放（MVP）- 1周\r
\r
**目标**：实现基本的音乐播放功能\r
\r
**任务清单**：\r
1. ✅ 创建类型定义 \`src/types/music.ts\`\r
2. ✅ 创建音乐数据文件 \`src/config/music/music.data.ts\`\r
3. ✅ 创建 Music Store（Pinia）\r
4. ✅ 实现 \`MusicPlayer.vue\`（播放器核心）\r
5. ✅ 实现 \`PlayerControls.vue\`（播放控制）\r
6. ✅ 实现 \`PlayerProgress.vue\`（进度条）\r
7. ✅ 实现 \`PlayerVolume.vue\`（音量控制）\r
8. ✅ 实现 \`MusicList.vue\`（音乐列表）\r
9. ✅ 实现 \`MusicItem.vue\`（音乐卡片）\r
10. ✅ 实现基础播放/暂停/切歌\r
\r
**验收标准**：\r
- [x] 可以播放音乐文件\r
- [x] 可以暂停/继续\r
- [x] 可以切换上一曲/下一曲\r
- [x] 进度条实时更新\r
- [x] 可以拖拽进度条跳转\r
- [x] 音量控制正常\r
- [x] 音乐列表显示正确\r
\r
---\r
\r
### 阶段二：播放列表 - 3-4天\r
\r
**目标**：支持歌单管理和播放模式\r
\r
**任务清单**：\r
1. ✅ 实现 \`PlaylistList.vue\`（歌单列表）\r
2. ✅ 实现 \`PlaylistCard.vue\`（歌单卡片）\r
3. ✅ 实现 \`PlaylistDetail.vue\`（歌单详情）\r
4. ✅ 实现播放模式切换（顺序/循环/随机/单曲）\r
5. ✅ 实现歌单加载和播放\r
6. ✅ 实现 \`MusicSidebar\`（侧边栏）\r
7. ✅ 实现统计信息显示\r
\r
**验收标准**：\r
- [x] 可以查看所有歌单\r
- [x] 可以加载歌单播放\r
- [x] 四种播放模式正常切换\r
- [x] 顺序播放：按列表顺序\r
- [x] 循环播放：播放完循环\r
- [x] 随机播放：随机选择下一首\r
- [x] 单曲循环：循环播放当前歌曲\r
\r
---\r
\r
### 阶段三：歌词功能 - 3-4天\r
\r
**目标**：实现歌词解析和同步显示\r
\r
**任务清单**：\r
1. ✅ 实现 LRC 歌词解析\r
2. ✅ 实现 \`LyricPanel.vue\`（歌词面板）\r
3. ✅ 实现 \`LyricLine.vue\`（歌词行）\r
4. ✅ 实现歌词同步滚动\r
5. ✅ 实现当前行高亮\r
6. ✅ 实现歌词搜索\r
7. ✅ 实现手动滚动和自动滚动切换\r
\r
**验收标准**：\r
- [x] 可以解析 LRC 歌词文件\r
- [x] 歌词与播放时间同步\r
- [x] 当前行高亮显示\r
- [x] 歌词自动滚动\r
- [x] 可以手动拖动歌词\r
- [x] 可以搜索歌词内容\r
\r
---\r
\r
### 阶段四：可视化效果 - 3-4天\r
\r
**目标**：实现音频可视化\r
\r
**任务清单**：\r
1. ✅ 实现 \`AudioVisualizer.vue\`（可视化容器）\r
2. ✅ 实现 \`Waveform.vue\`（波形显示）\r
3. ✅ 实现频谱柱状图\r
4. ✅ 实现圆形频谱效果\r
5. ✅ 集成到播放器\r
6. ✅ 优化性能（requestAnimationFrame）\r
\r
**验收标准**：\r
- [x] 实时显示音频波形/频谱\r
- [x] 动画流畅（60fps）\r
- [x] 不同风格的可视化效果\r
- [x] 性能良好，不卡顿\r
- [x] 可以切换/关闭可视化\r
\r
---\r
\r
### 阶段五：高级功能 - 2-3天\r
\r
**目标**：完善体验，增加高级功能\r
\r
**任务清单**：\r
1. ✅ 实现迷你模式（迷你播放器）\r
2. ✅ 实现快捷键控制\r
3. ✅ 实现播放历史\r
4. ✅ 实现收藏功能\r
5. ✅ 实现音乐搜索\r
6. ✅ 优化移动端体验\r
\r
**验收标准**：\r
- [x] 迷你模式正常工作\r
- [x] 快捷键（空格、左右箭头等）正常\r
- [x] 可以查看播放历史\r
- [x] 可以收藏音乐\r
- [x] 可以搜索音乐\r
- [x] 移动端体验流畅\r
\r
---\r
\r
## 九、关键技术点\r
\r
### 9.1 Audio API 使用\r
\r
**HTMLAudioElement 基础使用**：\r
\`\`\`typescript\r
const audio = new Audio()\r
\r
// 加载音乐\r
audio.src = '/music/song.mp3'\r
audio.load()\r
\r
// 播放控制\r
audio.play()\r
audio.pause()\r
audio.currentTime = 30  // 跳到30秒\r
\r
// 获取信息\r
audio.duration      // 总时长\r
audio.currentTime   // 当前时间\r
audio.volume        // 音量（0-1）\r
audio.muted         // 是否静音\r
audio.played        // 已播放比例\r
audio.buffered      // 已缓冲范围\r
\r
// 事件监听\r
audio.addEventListener('timeupdate', () => {})\r
audio.addEventListener('ended', () => {})\r
audio.addEventListener('loadedmetadata', () => {})\r
audio.addEventListener('error', () => {})\r
\`\`\`\r
\r
### 9.2 Web Audio API 可视化\r
\r
**音频上下文和节点**：\r
\`\`\`typescript\r
const audio = new Audio()\r
const audioContext = new AudioContext()\r
const analyser = audioContext.createAnalyser()\r
const source = audioContext.createMediaElementSource(audio)\r
\r
source.connect(analyser)\r
analyser.connect(audioContext.destination)\r
\r
// 获取频率数据\r
const bufferLength = analyser.frequencyBinCount\r
const dataArray = new Uint8Array(bufferLength)\r
\r
function draw() {\r
  requestAnimationFrame(draw)\r
  analyser.getByteFrequencyData(dataArray)\r
\r
  // 绘制到 canvas\r
  const canvas = document.querySelector('canvas')!\r
  const ctx = canvas.getContext('2d')!\r
\r
  for (let i = 0; i < bufferLength; i++) {\r
    const barHeight = dataArray[i]\r
    ctx.fillStyle = \`rgb(\${barHeight}, 100, 150)\`\r
    ctx.fillRect(i * 2, canvas.height - barHeight, 2, barHeight)\r
  }\r
}\r
\r
draw()\r
\`\`\`\r
\r
### 9.3 歌词同步原理\r
\r
**核心逻辑**：\r
\`\`\`typescript\r
// 监听 timeupdate 事件\r
audio.addEventListener('timeupdate', () => {\r
  const currentTime = audio.currentTime\r
\r
  // 找到当前应该高亮的歌词行\r
  const currentIndex = lyrics.findIndex((line, idx) => {\r
    const nextLine = lyrics[idx + 1]\r
    return (\r
      currentTime >= line.time &&\r
      (!nextLine || currentTime < nextLine.time)\r
    )\r
  })\r
\r
  // 滚动到当前行\r
  const activeLine = document.querySelector('.lyric-line.active')\r
  if (activeLine) {\r
    activeLine.scrollIntoView({\r
      behavior: 'smooth',\r
      block: 'center'\r
    })\r
  }\r
})\r
\`\`\`\r
\r
### 9.4 性能优化\r
\r
**问题**：音频可视化消耗性能\r
\r
**解决方案**：\r
1. 降低采样率（fftSize: 128）\r
2. 降低帧率（每30ms更新一次）\r
3. 使用 requestAnimationFrame\r
4. 在不可见时停止动画\r
\r
\`\`\`typescript\r
let animationId: number | null = null\r
let isVisible = true\r
\r
// 使用 IntersectionObserver 监听可见性\r
const observer = new IntersectionObserver((entries) => {\r
  isVisible = entries[0].isIntersecting\r
\r
  if (isVisible && !animationId) {\r
    draw()\r
  } else if (!isVisible && animationId) {\r
    cancelAnimationFrame(animationId)\r
    animationId = null\r
  }\r
})\r
\r
observer.observe(canvasRef.value)\r
\`\`\`\r
\r
---\r
\r
## 十、测试要点\r
\r
### 10.1 功能测试\r
\r
#### 播放功能\r
- [ ] 播放/暂停正常\r
- [ ] 上一曲/下一曲正常\r
- [ ] 进度条拖拽正常\r
- [ ] 音量调节正常\r
- [ ] 静音切换正常\r
- [ ] 加载进度显示正确\r
\r
#### 播放列表\r
- [ ] 可以加载歌单\r
- [ ] 顺序播放正确\r
- [ ] 循环播放正确\r
- [ ] 随机播放正确\r
- [ ] 单曲循环正确\r
\r
#### 歌词功能\r
- [ ] LRC 歌词解析正确\r
- [ ] 歌词同步显示\r
- [ ] 当前行高亮\r
- [ ] 自动滚动流畅\r
- [ ] 手动滚动可用\r
- [ ] 歌词搜索正确\r
\r
#### 可视化\r
- [ ] 波形图正常\r
- [ ] 频谱图正常\r
- [ ] 动画流畅（60fps）\r
- [ ] 不影响播放性能\r
\r
### 10.2 边界测试\r
\r
- [ ] 播放不存在的音乐\r
- [ ] 歌词文件不存在\r
- [ ] 音频文件损坏\r
- [ ] 网络中断\r
- [ ] 快速切换歌曲\r
- [ ] 播放到最后自动切歌\r
\r
### 10.3 兼容性测试\r
\r
**浏览器**：\r
- [ ] Chrome（最新版）\r
- [ ] Edge（最新版）\r
- [ ] Firefox（最新版）\r
- [ ] Safari（macOS/iOS）\r
\r
**移动端**：\r
- [ ] iOS Safari\r
- [ ] Android Chrome\r
- [ ] 微信内置浏览器\r
\r
**音频格式**：\r
- [ ] MP3\r
- [ ] FLAC\r
- [ ] WAV\r
- [ ] OGG\r
\r
### 10.4 性能测试\r
\r
- [ ] 页面加载时间 < 2s\r
- [ ] 播放器响应 < 100ms\r
- [ ] 可视化帧率 ≥ 30fps\r
- [ ] 内存占用合理\r
- [ ] CPU 占用 < 20%\r
\r
---\r
\r
## 十一、快捷键设计\r
\r
### 11.1 全局快捷键\r
\r
| 快捷键 | 功能 | 说明 |\r
|--------|------|------|\r
| \`Space\` | 播放/暂停 | 切换播放状态 |\r
| \`→\` | 快进 | 前进 10 秒 |\r
| \`←\` | 快退 | 后退 10 秒 |\r
| \`↑\` | 音量+ | 增加音量 10% |\r
| \`↓\` | 音量- | 减少音量 10% |\r
| \`Ctrl/M\` | 静音 | 切换静音 |\r
| \`Ctrl+→\` | 下一曲 | 下一首歌曲 |\r
| \`Ctrl+←\` | 上一曲 | 上一首歌曲 |\r
| \`Ctrl+L\` | 打开歌词 | 切换歌词面板 |\r
| \`Ctrl+P\` | 播放列表 | 切换播放列表 |\r
| \`Esc\` | 关闭面板 | 关闭歌词/列表面板 |\r
\r
**实现示例**：\r
\`\`\`typescript\r
function setupKeyboardShortcuts() {\r
  document.addEventListener('keydown', (e) => {\r
    // 如果在输入框中，不触发快捷键\r
    if (e.target instanceof HTMLInputElement ||\r
        e.target instanceof HTMLTextAreaElement) {\r
      return\r
    }\r
\r
    switch (e.code) {\r
      case 'Space':\r
        e.preventDefault()\r
        togglePlay()\r
        break\r
      case 'ArrowRight':\r
        if (e.ctrlKey) {\r
          nextMusic()\r
        } else {\r
          seek(10)\r
        }\r
        break\r
      case 'ArrowLeft':\r
        if (e.ctrlKey) {\r
          prevMusic()\r
        } else {\r
          seek(-10)\r
        }\r
        break\r
      case 'ArrowUp':\r
        if (e.ctrlKey) {\r
          e.preventDefault()\r
          setVolume(volume + 0.1)\r
        }\r
        break\r
      case 'ArrowDown':\r
        if (e.ctrlKey) {\r
          e.preventDefault()\r
          setVolume(volume - 0.1)\r
        }\r
        break\r
      case 'KeyM':\r
        if (e.ctrlKey) {\r
          toggleMute()\r
        }\r
        break\r
      case 'KeyL':\r
        if (e.ctrlKey) {\r
          toggleLyricPanel()\r
        }\r
        break\r
    }\r
  })\r
}\r
\`\`\`\r
\r
---\r
\r
## 十二、数据准备\r
\r
### 12.1 音频文件准备\r
\r
**推荐格式**：\r
- **MP3** - 兼容性最好，推荐使用\r
- **FLAC** - 无损音质，文件较大\r
- **WAV** - 无损，但不推荐（文件太大）\r
\r
**压缩建议**：\r
- 比特率：128-320 kbps\r
- 采样率：44.1 kHz\r
- 声道：立体声\r
\r
**文件组织**：\r
\`\`\`\r
public/music/\r
├── songs/              # 音乐文件\r
│   ├── qing-tian.mp3\r
│   ├── bohemian-rhapsody.mp3\r
│   └── ...\r
├── covers/             # 封面图\r
│   ├── ye-hui-mei.jpg\r
│   ├── bohemian-rhapsody.jpg\r
│   └── ...\r
├── lyrics/             # 歌词文件\r
│   ├── qing-tian.lrc\r
│   ├── bohemian-rhapsody.lrc\r
│   └── ...\r
└── playlists/          # 歌单封面\r
    ├── favorites.jpg\r
    └── work.jpg\r
\`\`\`\r
\r
### 12.2 LRC 歌词文件\r
\r
**标准格式**：\r
\`\`\`\r
[ti:晴天]\r
[ar:周杰伦]\r
[al:叶惠美]\r
[by:刘畅洋]\r
\r
[00:00.00]纯音乐 - 晴天\r
[00:03.50]作曲：周杰伦\r
[00:05.00]作词：周杰伦\r
[00:10.50]故事的小黄花\r
[00:13.20]从出生那年就飘着\r
[00:16.80]童年的荡秋千\r
[00:19.30]随记忆一直晃到现在\r
\`\`\`\r
\r
**标签说明**：\r
- \`[ti:标题]\` - 歌曲标题\r
- \`[ar:艺术家]\` - 艺术家\r
- \`[al:专辑]\` - 专辑名称\r
- \`[by:作词/作曲]\` - 作者信息\r
- \`[00:00.00]歌词\` - 时间+歌词\r
\r
---\r
\r
## 十三、可扩展功能\r
\r
### 13.1 短期扩展（1-2周内）\r
\r
1. **迷你模式** - 收起为小播放器\r
2. **播放历史** - 记录最近播放\r
3. **收藏功能** - 收藏喜欢的音乐\r
4. **本地音乐** - 上传本地音乐文件\r
5. **分享功能** - 分享到社交媒体\r
\r
### 13.2 中期扩展（1个月内）\r
\r
1. **电台模式** - 自动推荐播放\r
2. **音乐下载** - 下载到本地\r
3. **播放队列** - 临时播放列表\r
4. **均衡器** - 音效调节\r
5. **睡眠定时** - 定时停止播放\r
\r
### 13.3 长期扩展（3个月内）\r
\r
1. **音乐上传** - 用户上传音乐\r
2. **用户歌单** - 创建和分享歌单\r
3. **音乐评论** - 对音乐发表评论\r
4. **推荐算法** - 智能推荐\r
5. **后端 API** - 在线音乐库\r
\r
---\r
\r
## 十四、常见问题解决\r
\r
### 14.1 自动播放限制\r
\r
**问题**：浏览器阻止自动播放音频\r
\r
**原因**：浏览器策略，需要用户交互才能播放\r
\r
**解决方案**：\r
\`\`\`typescript\r
// 添加用户交互监听\r
function initAudio() {\r
  document.addEventListener('click', () => {\r
    if (audioContext && audioContext.state === 'suspended') {\r
      audioContext.resume()\r
    }\r
  }, { once: true })\r
}\r
\`\`\`\r
\r
### 14.2 CORS 跨域问题\r
\r
**问题**：音频文件跨域无法播放\r
\r
**解决方案**：\r
\`\`\`typescript\r
// 方案一：配置服务器 CORS\r
// 服务器端添加响应头\r
// Access-Control-Allow-Origin: *\r
\r
// 方案二：使用 crossOrigin\r
const audio = new Audio()\r
audio.crossOrigin = 'anonymous'\r
\`\`\`\r
\r
### 14.3 移动端播放中断\r
\r
**问题**：切换应用或锁屏后播放中断\r
\r
**解决方案**：\r
\`\`\`typescript\r
// 使用 Page Visibility API\r
document.addEventListener('visibilitychange', () => {\r
  if (document.hidden) {\r
    // 页面隐藏，暂停播放\r
    pause()\r
  } else {\r
    // 页面显示，继续播放\r
    play()\r
  }\r
})\r
\`\`\`\r
\r
---\r
\r
## 十五、总结\r
\r
### 15.1 核心亮点\r
\r
1. **完整播放器** - 支持播放/暂停/上下曲/循环\r
2. **歌词同步** - LRC 歌词解析和滚动显示\r
3. **音频可视化** - 实时波形/频谱显示\r
4. **歌单管理** - 创建和管理播放列表\r
5. **响应式设计** - PC 和移动端完美适配\r
\r
### 15.2 技术亮点\r
\r
1. **Web Audio API** - 专业音频处理\r
2. **AudioContext** - 音频可视化\r
3. **LRC 解析** - 歌词同步\r
4. **Canvas 绘制** - 实时可视化\r
5. **Pinia 状态管理** - 复杂播放状态管理\r
\r
### 15.3 适用场景\r
\r
- ✅ 个人博客音乐展示\r
- ✅ 博客阅读时背景音乐\r
- ✅ 分享音乐品味\r
- ✅ 个性化音乐空间\r
\r
### 15.4 预期成果\r
\r
- 🎵 完整的在线音乐播放器\r
- 📋 歌单管理功能\r
- 📝 歌词同步显示\r
- 🎨 音频可视化效果\r
- 📱 移动端完美适配\r
\r
---\r
\r
**文档版本**：v1.0\r
**最后更新**：2026-02-10\r
**作者**：SuiXin\r
**状态**：待实现\r
**预计工作量**：15-20 小时\r
`;export{r as default};
