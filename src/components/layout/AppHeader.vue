<script setup lang="ts">
import { ref } from 'vue'

const searchKeyword = ref('')
const handleSearch = () => {
    console.log('搜索:', searchKeyword.value)
}
</script>

<template>
    <header class="app-header">
        <div class="header-left">
            <!-- Logo -->
            <router-link to="/" class="logo">
                <span class="logo-text">SuiXin</span>
            </router-link>
        </div>

        <nav class="header-nav">
            <!-- 导航菜单 -->
            <router-link to="/" class="nav-link">首页</router-link>
            <router-link to="/blog" class="nav-link">博客</router-link>
            <router-link to="/dairy" class="nav-link">日记</router-link>
            <router-link to="/games" class="nav-link">游戏</router-link>
            <router-link to="/music" class="nav-link">音乐</router-link>
        </nav>

        <div class="header-right">
            <!-- 搜索框 -->
            <div class="search-box">
                <input v-model="searchKeyword" type="text" placeholder="搜索..." @keyup.enter="handleSearch" />
                <button class="search-btn" @click="handleSearch">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        viewBox="0 0 16 16">
                        <path
                            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                </button>
            </div>
        </div>
    </header>
</template>

<style scoped>
.app-header {
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 0 20px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.header-left {
    flex-shrink: 0;
}

.logo {
    text-decoration: none;
    display: flex;
    align-items: center;
}

.logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 0.5px;
}

.header-nav {
    display: flex;
    gap: 8px;
    flex: 1;
    justify-content: center;
    align-items: center;
}

.nav-link {
    padding: 8px 16px;
    text-decoration: none;
    color: #333;
    font-size: 0.95rem;
    font-weight: 500;
    border-radius: 6px;
    transition: all 0.3s;
    position: relative;
}

.nav-link:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.08);
}

.nav-link.router-link-active {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
}

.header-right {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 12px;
}

.search-box {
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 20px;
    padding: 4px 12px;
    transition: all 0.3s;
}

.search-box:focus-within {
    background: #fff;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.search-box input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.9rem;
    width: 150px;
    color: #333;
}

.search-box input::placeholder {
    color: #999;
}

.search-btn {
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    transition: color 0.3s;
}

.search-btn:hover {
    color: #667eea;
}

/* 响应式适配 */
@media (max-width: 768px) {
    .app-header {
        padding: 0 12px;
        height: 56px;
    }

    .logo-text {
        font-size: 1.3rem;
    }

    .header-nav {
        gap: 4px;
    }

    .nav-link {
        padding: 6px 10px;
        font-size: 0.85rem;
    }

    .search-box input {
        width: 100px;
    }
}

@media (max-width: 480px) {
    .header-nav {
        display: none;
    }

    .search-box input {
        width: 80px;
    }
}
</style>