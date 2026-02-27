import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import type { BlogMeta } from '../types/blog';
import matter from 'gray-matter'

// 配置markdown-it
// 1. 先创建 md 实例（显式声明类型，可选但更规范）
const md: MarkdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
});

// 2. 单独配置 highlight 方法（此时 md 已初始化完成，可安全引用）
md.options.highlight = (str: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
        try {
            return hljs.highlight(str, { language: lang }).value;
        } catch (__) { }
    }
    // 此时引用 md.utils 不会有类型问题
    return md.utils.escapeHtml(str);
};

/**
 * 解析 Markdown 内容，分离元数据和正文并转为 HTML
 * @param all_content 完整的 Markdown 字符串（包含 Front Matter）
 * @returns 包含元数据、HTML 正文、原始 Markdown 正文的对象
 * @throws 解析失败或元数据不完整时抛出错误
 */
export function parseMarkdown(all_content: string): {
    meta: BlogMeta,
    content: string,
    raw: string
} {
    // 空内容校验
    if (!all_content || all_content.trim() === '') {
        throw new Error('解析失败：Markdown内容为空')
    }
    try {
        // 1. 分离 Front Matter 元数据和纯 Markdown 正文
        const { data, content: rawMarkdown } = matter(all_content);

        // 2. 校验元数据是否符合 BlogMeta 结构（必选字段检查）
        const requiredFields: (keyof BlogMeta)[] = [
            'title',
            'date',
            'category',
            'tags',
            'description',
            'author',
            'readTime',
        ]
        const missingFields = requiredFields.filter(field => !(field in data))
        if (missingFields.length > 0) {
            throw new Error(`元数据缺失必选字段：${missingFields.join(', ')}`);
        }

        // 3. 只渲染纯 Markdown 正文
        const htmlContent = md.render(rawMarkdown);

        // 4. 返回类型安全的结果（断言 data 为 BlogMeta 类型）
        return {
            meta: data as BlogMeta,
            content: htmlContent,
            raw: rawMarkdown
        }
    } catch (error) {
        // 统一捕获并包装错误信息
        const errMsg = error instanceof Error ? error.message : '未知解析错误';
        throw new Error(`Markdown 解析失败：${errMsg}`);
    }
}

// 从文件路径生成文章ID
export function generateIdFromPath(path: string): string {
    return path
        // 第一步：移除路径开头到 /docs/ 为止的所有内容
        .replace(/^.*\/docs\//, '')
        // 第二步：移除末尾的 .md 后缀
        .replace(/\.md$/, '')
        // 第三步：将剩余路径中的 / 替换为 -
        .replace(/\//g, '-')
}