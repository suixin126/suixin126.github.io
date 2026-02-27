/**
 * 博客相关的 Pinia 状态管理仓库
 * 负责加载、存储、管理所有博客文章数据，以及提供分类、标签、筛选等核心功能
 * @module useBlogStore
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// 导入博客相关的类型定义
import type { BlogPost, Category, Tag } from '@/types/blog'
// 导入 Markdown 解析和 ID 生成工具函数
import { parseMarkdown, generateIdFromPath } from '@/utils/markdown'

/**
 * 使用 import.meta.glob 动态导入所有博客 Markdown 文件
 * - 匹配 @/docs 目录下所有层级的 .md 文件
 * - query: '?raw' 表示导入文件的原始文本内容
 * - import: 'default' 表示导入默认导出的内容（即文件原始字符串）
 */
const blogModules = import.meta.glob<string>('@/docs/blog/**/*.md', {
  query: '?raw',
  import: 'default'
})

/**
 * 定义并导出博客仓库
 * 使用 Pinia 的组合式 API 风格（setup 模式）
 * @returns {Store} 博客仓库实例
 */
export const useBlogStore = defineStore('blog', () => {
  // ========== 状态 (State) ==========
  /**
   * 所有博客文章列表
   * @type {Ref<BlogPost[]>}
   */
  const posts = ref<BlogPost[]>([])

  /**
   * 加载状态标识
   * true: 正在加载博客文章，false: 加载完成/未加载
   * @type {Ref<boolean>}
   */
  const loading = ref(false)

  /**
   * 加载过程中的错误信息
   * null: 无错误，string: 具体错误描述
   * @type {Ref<string | null>}
   */
  const error = ref<string | null>(null)

  /**
   * 博客文章是否已加载完成的标识
   * 用于避免重复加载
   * @type {Ref<boolean>}
   */
  const isLoaded = ref(false)

  // ========== 计算属性 (Getters) ==========
  /**
   * 计算所有博客分类及其文章数量
   * 自动从 posts 中提取分类信息并统计数量
   * @type {ComputedRef<Category[]>}
   * @returns {Category[]} 分类列表（包含名称、数量、URL友好的slug）
   */
  const categories = computed<Category[]>(() => {
    // 使用 Map 统计每个分类的文章数量，避免重复
    const categoryMap = new Map<string, number>()

    // 遍历所有文章，累加分类计数
    posts.value.forEach(post => {
      const cat = post.meta.category
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1)
    })

    // 将 Map 转换为 Category 数组，并生成 slug（用于URL）
    return Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,         // 分类名称
      count,        // 该分类下的文章数量
      slug: name.toLowerCase().replace(/\s+/g, '-') // 转为小写，空格替换为横线
    }))
  })

  /**
   * 计算所有博客标签及其文章数量
   * 自动从 posts 中提取标签信息并统计数量
   * @type {ComputedRef<Tag[]>}
   * @returns {Tag[]} 标签列表（包含名称、数量）
   */
  const tags = computed<Tag[]>(() => {
    // 使用 Map 统计每个标签的文章数量
    const tagMap = new Map<string, number>()

    // 遍历所有文章，再遍历每篇文章的标签，累加标签计数
    posts.value.forEach(post => {
      post.meta.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
      })
    })

    // 将 Map 转换为 Tag 数组
    return Array.from(tagMap.entries()).map(([name, count]) => ({
      name,  // 标签名称
      count  // 该标签下的文章数量
    }))
  })

  // ========== 方法 (Actions) ==========
  /**
   * 加载所有博客文章的核心方法
   * 异步加载并解析所有 Markdown 文件，处理后存入 posts 状态
   * 具备防重复加载、错误捕获、加载状态管理、排序等能力
   * @async
   * @returns {Promise<void>}
   */
  async function loadBlogPosts() {
    // 防重复加载：如果已加载完成且有文章数据，直接返回
    if (isLoaded.value && posts.value.length > 0) {
      return
    }

    // 开始加载：更新状态
    loading.value = true
    error.value = null
    // 临时存储解析后的文章列表，避免直接修改响应式数据导致多次更新
    const postList: BlogPost[] = []

    try {
      // 获取所有匹配的 Markdown 文件路径
      const filePaths = Object.keys(blogModules)

      // 遍历每个文件路径，逐一解析
      for (const path of filePaths) {
        try {
          // 获取文件加载器（import.meta.glob 返回的是异步加载函数）
          const moduleLoader = blogModules[path]
          
          // 跳过不存在的加载器，避免运行时错误
          if (!moduleLoader) {
            console.warn(`模块加载器不存在: ${path}`)
            continue
          }

          // 加载文件原始内容
          const rawContent = await moduleLoader()
          // 解析 Markdown 内容（提取元信息和正文）
          const { meta, content } = parseMarkdown(rawContent)
          // 根据文件路径生成唯一 ID
          const id = generateIdFromPath(path)

          // 将解析后的文章信息加入临时列表
          postList.push({ id, path, meta, content })
        } catch (err) {
          // 单个文件解析失败不影响整体，记录错误并继续
          const errMsg = err instanceof Error ? err.message : '解析文件失败'
          console.error(`处理文件 ${path} 失败：`, errMsg)
          continue
        }
      }

      // 对文章列表按发布日期倒序排序（最新发布的文章排在前面）
      postList.sort((a, b) => {
        return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
      })

      // 将解析并排序后的文章列表存入状态
      posts.value = postList
      // 标记加载完成
      isLoaded.value = true
    } catch (err) {
      // 捕获整体加载过程中的错误，更新错误状态
      error.value = err instanceof Error ? err.message : '加载博客失败'
      console.error('博客加载异常：', err)
    } finally {
      // 无论成功还是失败，都标记加载结束
      loading.value = false
    }
  }

  /**
   * 根据分类筛选博客文章
   * 不区分大小写，实现模糊匹配（实际是全匹配，仅统一大小写）
   * @param {string} category - 要筛选的分类名称
   * @returns {BlogPost[]} 该分类下的所有文章
   */
  function filterByCategory(category: string) {
    return posts.value.filter(post =>
      post.meta.category.toLowerCase() === category.toLowerCase()
    )
  }

  /**
   * 根据标签筛选博客文章
   * 不区分大小写，只要文章包含该标签即被筛选出来
   * @param {string} tag - 要筛选的标签名称
   * @returns {BlogPost[]} 包含该标签的所有文章
   */
  function filterByTag(tag: string) {
    return posts.value.filter(post =>
      post.meta.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    )
  }

  /**
   * 根据 ID 获取单篇博客文章
   * @param {string} id - 文章的唯一 ID（由 generateIdFromPath 生成）
   * @returns {BlogPost | undefined} 匹配的文章，无匹配则返回 undefined
   */
  function getPostById(id: string) {
    return posts.value.find(post => post.id === id)
  }

  // ========== 暴露仓库成员 ==========
  return {
    // State - 响应式状态
    posts,
    loading,
    error,
    isLoaded,
    // Getters - 计算属性
    categories,
    tags,
    // Actions - 方法
    loadBlogPosts,
    filterByCategory,
    filterByTag,
    getPostById
  }
})