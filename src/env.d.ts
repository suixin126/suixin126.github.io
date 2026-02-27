/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Vite import.meta.glob 类型声明
declare module 'vite' {
  interface ImportGlobOptions {
    query?: string
    import?: string
  }
}

