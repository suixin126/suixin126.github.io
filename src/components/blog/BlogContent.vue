<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useBlogStore } from '@/stores/blog'

const route = useRoute()
const blogStore = useBlogStore()
const { posts } = storeToRefs(blogStore)

// 当前文章
const currentPost = computed(() => {
    const id = route.params.id as string
    return blogStore.getPostById(id)
})

// 组件挂载时确保数据已加载
onMounted(async () => {
    // 如果 posts 为空，说明还没有加载过
    if (posts.value.length === 0) {
        await blogStore.loadBlogPosts()
    }
})

// 返回列表
function goBack() {
    window.history.back()
}
</script>

<template>
    <div v-if="currentPost" class="blog-content">
        <!-- 文章头部 -->
        <header class="article-header">
            <button @click="goBack" class="back-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                </svg>
                返回列表
            </button>

            <h1 class="article-title">{{ currentPost.meta.title }}</h1>

            <div class="article-meta">
                <span class="meta-item">
                    <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                    </svg>
                    {{ currentPost.meta.date }}
                </span>
                <span class="meta-item">
                    <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                    </svg>
                    {{ currentPost.meta.author }}
                </span>
                <span class="meta-item">
                    <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z"/>
                    </svg>
                    阅读: {{ currentPost.meta.readTime }}
                </span>
            </div>

            <div class="article-tags">
                <span class="category-badge">{{ currentPost.meta.category }}</span>
                <span
                    v-for="tag in currentPost.meta.tags"
                    :key="tag"
                    class="tag-badge"
                >
                    #{{ tag }}
                </span>
            </div>
        </header>

        <!-- 文章正文 -->
        <article class="article-body" v-html="currentPost.content"></article>
    </div>

    <div v-else class="not-found">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
        </svg>
        <h2>文章未找到</h2>
        <p>抱歉，您访问的文章不存在。</p>
        <button @click="goBack" class="back-btn">返回列表</button>
    </div>
</template>

<style scoped>
.blog-content {
    background: #fff;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 文章头部 */
.article-header {
    margin-bottom: 40px;
    padding-bottom: 30px;
    border-bottom: 2px solid #f0f0f0;
}

.back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: #f5f5f5;
    color: #333;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
    margin-bottom: 24px;
}

.back-btn:hover {
    background: #667eea;
    color: #fff;
    transform: translateX(-4px);
}

.article-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #1a1a1a;
    margin: 0 0 20px 0;
    line-height: 1.3;
}

.article-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
    font-size: 0.95rem;
    color: #666;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
}

.meta-icon {
    flex-shrink: 0;
}

.article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.category-badge {
    display: inline-block;
    padding: 6px 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
}

.tag-badge {
    display: inline-block;
    padding: 6px 16px;
    background: #f0f0f0;
    color: #555;
    border-radius: 20px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.tag-badge:hover {
    background: #667eea;
    color: #fff;
}

/* 文章正文 */
.article-body {
    font-size: 1.05rem;
    line-height: 1.8;
    color: #333;
}

/* Markdown 内容样式 */
.article-body :deep(h1) {
    font-size: 2rem;
    font-weight: 700;
    margin: 40px 0 20px 0;
    color: #1a1a1a;
    padding-bottom: 10px;
    border-bottom: 2px solid #f0f0f0;
}

.article-body :deep(h2) {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 32px 0 16px 0;
    color: #1a1a1a;
}

.article-body :deep(h3) {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 28px 0 14px 0;
    color: #333;
}

.article-body :deep(p) {
    margin: 0 0 16px 0;
}

.article-body :deep(code) {
    background: #f5f5f5;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
    color: #e83e8c;
}

.article-body :deep(pre) {
    background: #282c34;
    color: #abb2bf;
    padding: 20px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 20px 0;
}

.article-body :deep(pre code) {
    background: transparent;
    color: inherit;
    padding: 0;
}

.article-body :deep(ul),
.article-body :deep(ol) {
    margin: 16px 0;
    padding-left: 24px;
}

.article-body :deep(li) {
    margin: 8px 0;
}

.article-body :deep(blockquote) {
    margin: 20px 0;
    padding: 16px 20px;
    background: #f8f9fa;
    border-left: 4px solid #667eea;
    color: #555;
}

.article-body :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 20px 0;
}

.article-body :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}

.article-body :deep(th),
.article-body :deep(td) {
    padding: 12px;
    border: 1px solid #e0e0e0;
    text-align: left;
}

.article-body :deep(th) {
    background: #f5f5f5;
    font-weight: 600;
}

.article-body :deep(a) {
    color: #667eea;
    text-decoration: none;
    transition: color 0.3s ease;
}

.article-body :deep(a:hover) {
    color: #5568d3;
    text-decoration: underline;
}

/* 未找到状态 */
.not-found {
    text-align: center;
    padding: 60px 20px;
    color: #666;
}

.not-found svg {
    color: #ddd;
    margin-bottom: 20px;
}

.not-found h2 {
    font-size: 1.5rem;
    color: #333;
    margin: 0 0 10px 0;
}

.not-found p {
    font-size: 1rem;
    margin: 0 0 20px 0;
}

/* 响应式适配 */
@media (max-width: 768px) {
    .blog-content {
        padding: 24px;
    }

    .article-title {
        font-size: 1.75rem;
    }

    .article-meta {
        flex-direction: column;
        gap: 8px;
    }

    .article-body :deep(h1) {
        font-size: 1.5rem;
    }

    .article-body :deep(h2) {
        font-size: 1.3rem;
    }
}
</style>
