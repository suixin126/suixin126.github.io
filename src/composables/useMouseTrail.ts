import { onMounted, onUnmounted, ref } from 'vue'

/**
 * 鼠标拖尾效果配置选项
 */
export interface MouseTrailOptions {
  /** 每次鼠标移动时产生的粒子数量，默认 3 */
  particleCount?: number
  /** 屏幕上允许的最大粒子数量，默认 200 */
  maxParticles?: number
  /** 粒子颜色数组，随机选择，默认彩虹色 */
  colors?: string[]
  /** 粒子大小范围（像素），默认 2-6 */
  particleSize?: { min: number; max: number }
  /** 粒子生命周期范围（帧数），默认 60-90 */
  lifeSpan?: { min: number; max: number }
  /** 粒子速度范围，默认 1-3 */
  speed?: { min: number; max: number }
  /** 阻力系数（0-1），越小阻力越大，默认 0.98 */
  decay?: number
}

/**
 * 粒子数据结构
 */
interface Particle {
  /** 粒子 X 坐标 */
  x: number
  /** 粒子 Y 坐标 */
  y: number
  /** X 方向速度 */
  vx: number
  /** Y 方向速度 */
  vy: number
  /** 当前生命值（帧数） */
  life: number
  /** 最大生命值（帧数） */
  maxLife: number
  /** 粒子颜色 */
  color: string
  /** 粒子大小 */
  size: number
}

/**
 * 鼠标拖尾效果 Composable
 *
 * 使用 Canvas 实现的彩色粒子拖尾效果，粒子会跟随鼠标移动并在生命周期结束后消失。
 *
 * @param options - 配置选项
 * @returns 返回 canvasRef、start 和 stop 方法
 *
 * @example
 * ```vue
 * <script setup>
 * import { useMouseTrail } from '@/composables/useMouseTrail'
 *
 * const { canvasRef } = useMouseTrail({
 *   colors: ['#ff0000', '#00ff00', '#0000ff'],
 *   particleCount: 5,
 *   maxParticles: 300
 * })
 * </script>
 *
 * <template>
 *   <canvas ref="canvasRef" />
 * </template>
 * ```
 */
export function useMouseTrail(options: MouseTrailOptions = {}) {
  // Canvas 元素引用
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const canvasRef = ref<HTMLCanvasElement>()

  // Canvas 2D 渲染上下文
  let ctx: CanvasRenderingContext2D | null = null

  // 粒子数组
  let particles: Particle[] = []

  // 动画帧 ID，用于取消动画
  let animationId: number | null = null

  // 解构配置选项，设置默认值
  const {
    /** 每次移动产生的粒子数 */
    particleCount = 3,
    /** 最大粒子数量 */
    maxParticles = 200,
    /** 彩虹色数组 */
    colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],
    /** 粒子大小范围 */
    particleSize = { min: 2, max: 6 },
    /** 生命周期范围 */
    lifeSpan = { min: 60, max: 90 },
    /** 速度范围 */
    speed = { min: 1, max: 3 },
    /** 阻力系数 */
    decay = 0.98
  } = options

  /**
   * 创建单个粒子
   * @param x - 粒子 X 坐标
   * @param y - 粒子 Y 坐标
   * @returns 粒子对象
   */
  function createParticle(x: number, y: number): Particle {
    // 随机角度（0-360度）
    const angle = Math.random() * Math.PI * 2

    // 随机速度
    const speedValue = Math.random() * (speed.max - speed.min) + speed.min

    // 随机选择颜色
    const colorIndex = Math.floor(Math.random() * colors.length)
    const color = colors[colorIndex] ?? '#ff0000'

    // 随机大小
    const size = Math.random() * (particleSize.max - particleSize.min) + particleSize.min

    // 随机生命周期
    const maxLife = Math.random() * (lifeSpan.max - lifeSpan.min) + lifeSpan.min

    // 计算速度分量
    return {
      x,
      y,
      vx: Math.cos(angle) * speedValue,
      vy: Math.sin(angle) * speedValue,
      life: 0,
      maxLife,
      color,
      size
    }
  }

  /**
   * 更新所有粒子的状态
   * - 移除生命值耗尽的粒子
   * - 更新粒子位置
   * - 增加粒子生命值
   * - 应用阻力减速
   */
  function updateParticles() {
    // 过滤掉已死亡的粒子
    particles = particles.filter(p => p.life < p.maxLife)

    // 更新每个粒子的状态
    particles.forEach(p => {
      // 更新位置
      p.x += p.vx
      p.y += p.vy

      // 增加生命值
      p.life++

      // 应用阻力减速
      p.vx *= decay
      p.vy *= decay
    })
  }

  /**
   * 绘制所有粒子到 Canvas
   */
  function drawParticles() {
    if (!ctx || !canvasRef.value) return

    // 清空画布
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

    // 绘制每个粒子
    particles.forEach(p => {
      // 计算透明度（生命值越多，透明度越高）
      const opacity = 1 - (p.life / p.maxLife)

      // 计算半径（随透明度缩小，确保不为负数）
      const radius = Math.max(0, p.size * opacity)

      // 设置透明度
      ctx!.globalAlpha = opacity

      // 设置颜色
      ctx!.fillStyle = p.color

      // 绘制圆形粒子
      ctx!.beginPath()
      ctx!.arc(p.x, p.y, radius, 0, Math.PI * 2)
      ctx!.fill()
    })

    // 重置透明度
    ctx.globalAlpha = 1
  }

  /**
   * 动画循环
   * 使用 requestAnimationFrame 实现流畅动画
   */
  function animate() {
    updateParticles()
    drawParticles()
    animationId = requestAnimationFrame(animate)
  }

  /**
   * 处理鼠标移动事件
   * 在鼠标位置创建新粒子
   */
  function handleMouseMove(e: MouseEvent) {
    // 限制最大粒子数量，避免性能问题
    if (particles.length < maxParticles) {
      // 每次移动创建多个粒子
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle(e.clientX, e.clientY))
      }
    }
  }

  /**
   * 处理窗口大小调整事件
   * 重新设置 Canvas 尺寸
   */
  function handleResize() {
    if (!canvasRef.value) return
    canvasRef.value.width = window.innerWidth
    canvasRef.value.height = window.innerHeight
  }

  /**
   * 启动鼠标拖尾效果
   */
  function start() {
    if (!canvasRef.value) return

    // 获取 2D 渲染上下文
    ctx = canvasRef.value.getContext('2d')

    // 设置初始尺寸
    handleResize()

    // 监听鼠标移动事件
    window.addEventListener('mousemove', handleMouseMove)

    // 监听窗口大小调整事件
    window.addEventListener('resize', handleResize)

    // 开始动画循环
    animate()
  }

  /**
   * 停止鼠标拖尾效果
   * 清理事件监听器和动画
   */
  function stop() {
    // 移除事件监听器
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('resize', handleResize)

    // 取消动画循环
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
    }
  }

  // 组件挂载时自动启动
  onMounted(() => {
    start()
  })

  // 组件卸载时自动停止
  onUnmounted(() => {
    stop()
  })

  // 返回 canvasRef 和控制方法
  return {
    canvasRef,
    start,
    stop
  }
}
