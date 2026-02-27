import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

export const pinia = createPinia()
pinia.use(createPersistedState({
    storage: sessionStorage, // 使用 sessionStorage（只保存会话期间）
    // 自定义序列化
    serializer: {
        deserialize: (value) => JSON.parse(value),
        serialize: (value) => JSON.stringify(value)
    }
}))