export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',

  // Nuxt 3.21.x: ssr:false dev에서 vite-node IPC 오류 → 개발만 SSR 사용
  $development: {
    ssr: true,
    experimental: {
      appManifest: false
    }
  },
  $production: {
    ssr: false
  },

  app: {
    head: {
      title: 'ooooning_hi Partnership Portfolio',
      htmlAttrs: { lang: 'ko' },
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, viewport-fit=cover'
        },
        {
          name: 'description',
          content: '인스타그램 라이프스타일 크리에이터 ooooning_hi의 브랜드 협업 제안 포트폴리오'
        },
        { property: 'og:title', content: 'ooooning_hi Partnership Portfolio' },
        {
          property: 'og:description',
          content: '푸드, 카페, 로컬 경험 중심의 협업 제안용 미디어 키트'
        }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  vite: {
    server: {
      watch: {
        ignored: ['**/dist/**', '**/.output/**', '**/127.0.0.1/**', '**/0.0.0.0/**']
      }
    }
  },

  devtools: { enabled: false }
})
