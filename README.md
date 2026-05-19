# ooooning_hi Partnership Portfolio

Nuxt 3 기반의 가벼운 인스타그램 미디어 키트 웹 포트폴리오입니다. `ooooning_hi` 계정의 인사이트와 콘텐츠 무드를 바탕으로 브랜드, 호텔, 레스토랑, 카페 협업 제안에 사용할 수 있도록 구성했습니다.

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`으로 확인합니다.

## 빌드 확인

```bash
npm run build
```

현재 Nuxt Nitro preset은 `nuxt.config.ts`에서 `cloudflare-pages`로 설정되어 있습니다.

## Cloudflare Pages 배포 설정

Cloudflare Dashboard에서 `Workers & Pages` → `Create` → `Pages` → `Connect to Git` 순서로 진행합니다.

- Repository: `daviLeedev/instagram_info`
- Production branch: `main`
- Framework preset: `Nuxt.js`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: 비워둠
- Node.js version: `22`

배포 후 GitHub `main` 브랜치에 push하면 Cloudflare Pages가 자동으로 다시 빌드합니다.

## 주요 파일

- 메인 슬라이드/콘텐츠: `app.vue`
- 전체 스타일: `assets/css/main.css`
- 인사이트 이미지: `public/insights`
- 릴스 성과 케이스 이미지: `public/reels-cases`
- 스타일 쇼케이스 이미지: `public/style-showcase`
- 인스타그램 QR: `public/instagram-qr.svg`

## 배포 메모

Cloudflare Pages에서 Nuxt 앱은 `npm run build` 후 `dist` 폴더를 배포하도록 설정합니다. 이 프로젝트는 Cloudflare Pages용 Nitro preset을 사용하므로 별도 서버 설정 없이 Pages에서 실행됩니다.
