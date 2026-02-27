<script setup lang="ts">
import type { BlogPost } from '@/types/blog'

// 定义 props
defineProps<{
    post: BlogPost
}>()
</script>

<template>
    <article class="blog-card">
        <!-- 卡片头部：标题和元信息 -->
        <div class="card-header">
            <h2 class="post-title">{{ post.meta.title }}</h2>
            <div class="post-meta">
                <span class="meta-item">
                    <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                    </svg>
                    {{ post.meta.date }}
                </span>
                <span class="meta-item">
                    <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                    </svg>
                    {{ post.meta.author }}
                </span>
                <span class="meta-item">
                    <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z"/>
                    </svg>
                    阅读: {{ post.meta.readTime }}
                </span>
            </div>
        </div>

        <!-- 摘要内容 -->
        <p class="post-excerpt">
            {{ post.meta.description }}
        </p>

        <!-- 分类和标签 -->
        <div class="post-tags">
            <span class="category-badge">{{ post.meta.category }}</span>
            <span
                v-for="tag in post.meta.tags"
                :key="tag"
                class="tag-badge"
            >
                #{{ tag }}
            </span>
        </div>

        <!-- 卡片底部：阅读按钮 -->
        <div class="card-footer">
            <router-link :to="`/blog/${post.id}`" class="read-more-btn">
                阅读全文
                <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                </svg>
            </router-link>
        </div>
    </article>
</template>

<style scoped>
.blog-card {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border: 1px solid #f0f0f0;
}

.blog-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
}

.card-header {
    margin-bottom: 16px;
}

.post-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 12px 0;
    line-height: 1.4;
    transition: color 0.3s ease;
}

.post-title:hover {
    color: #667eea;
}

.post-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    font-size: 0.875rem;
    color: #666;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.meta-icon {
    flex-shrink: 0;
}

.post-excerpt {
    color: #555;
    line-height: 1.7;
    margin: 0 0 16px 0;
    font-size: 1rem;
}

.post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
}

.category-badge {
    display: inline-block;
    padding: 4px 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border-radius: 16px;
    font-size: 0.875rem;
    font-weight: 500;
}

.tag-badge {
    display: inline-block;
    padding: 4px 12px;
    background: #f0f0f0;
    color: #555;
    border-radius: 16px;
    font-size: 0.875rem;
    transition: all 0.3s ease;
}

.tag-badge:hover {
    background: #667eea;
    color: #fff;
}

.card-footer {
    display: flex;
    justify-content: flex-end;
}

.read-more-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 20px;
    background: #667eea;
    color: #fff;
    text-decoration: none;
    border-radius: 20px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.read-more-btn:hover {
    background: #5568d3;
    transform: translateX(4px);
}

.arrow-icon {
    transition: transform 0.3s ease;
}

.read-more-btn:hover .arrow-icon {
    transform: translateX(4px);
}

/* 响应式适配 */
@media (max-width: 768px) {
    .blog-card {
        padding: 20px;
    }

    .post-title {
        font-size: 1.25rem;
    }

    .post-meta {
        flex-direction: column;
        gap: 8px;
    }
}
</style>
