/**
 * 博客文章元数据接口
 * 用于描述一篇博客文章的核心信息（不包含正文内容）
 */
export interface BlogMeta {
    /** 博客文章的标题 */
    title: string
    /** 博客发布日期（建议格式：YYYY-MM-DD） */
    date: string
    /** 博客所属分类名称 */
    category: string
    /** 博客关联的标签列表 */
    tags: string[]
    /** 博客的简短描述/摘要 */
    description: string
    /** 博客作者名称 */
    author: string
    /** 预估阅读时长（例如："5 min"、"10 分钟"） */
    readTime: string
}

/**
 * 完整博客文章接口
 * 包含博客的所有信息（ID、路径、元数据、正文内容）
 */
export interface BlogPost {
    /** 博客唯一标识ID（可用于路由、数据检索等） */
    id: string
    /** 博客的访问路径/文件路径（例如：/posts/hello-world） */
    path: string
    /** 博客的元数据信息 */
    meta: BlogMeta
    /** 博客的正文内容（通常为Markdown或HTML格式） */
    content: string
}

/**
 * 博客分类接口
 * 用于统计和展示分类信息（包含分类名称、文章数量、URL别名）
 */
export interface Category {
    /** 分类名称（展示用） */
    name: string
    /** 该分类下的博客文章数量 */
    count: number
    /** 分类的URL别名（用于生成分类页面路由，例如：frontend -> /categories/frontend） */
    slug: string
}

/**
 * 博客标签接口
 * 用于统计和展示标签信息（包含标签名称、关联文章数量）
 */
export interface Tag {
    /** 标签名称（展示用） */
    name: string
    /** 该标签关联的博客文章数量 */
    count: number
}