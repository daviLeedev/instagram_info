<script setup lang="ts">
const deck = ref<HTMLElement | null>(null)
const currentSlide = ref(0)
let scrollSyncTimer: ReturnType<typeof setTimeout> | undefined

const slides = [
  'Cover',
  'About',
  'Snapshot',
  'Audience',
  'Performance 01',
  'Performance 02',
  'Performance 03',
  'Performance 04',
  'Performance 05',
  'Trust',
  'Style',
  'Why',
  'Opportunity',
  'Deliverables',
  'Evidence',
  'Contact'
]

const reelCases = [
  {
    eyebrow: 'Case 01',
    title: 'Birthday Gift Reel',
    headline: '선물 콘텐츠가 대규모 조회로 확장된 사례',
    reach: '66.6만',
    summary: '감정이 있는 일상 장면과 선물 맥락이 결합되어 높은 조회와 저장 행동으로 이어졌습니다.',
    note: '조회 666,952 · 반응 6,306 · 저장 577',
    thumb: '/reels-cases/case-01-thumb.jpg',
    insight: '/reels-cases/case-01-insight.jpg'
  },
  {
    eyebrow: 'Case 02',
    title: 'Busan Travel Course',
    headline: '여행 코스형 콘텐츠의 저장 가능성',
    reach: '5.4만',
    summary: '부산 여행 코스처럼 재방문과 일정 참고가 가능한 포맷은 브랜드 제안에도 확장성이 높습니다.',
    note: '조회 54,544 · 공유 84 · 저장 146',
    thumb: '/reels-cases/case-02-thumb.jpg',
    insight: '/reels-cases/case-02-insight.jpg'
  },
  {
    eyebrow: 'Case 03',
    title: 'Anniversary Date',
    headline: '데이트 목적지 발견을 만드는 릴스',
    reach: '1.3만',
    summary: '공간, 메뉴, 상황을 함께 보여주는 구성은 레스토랑과 카페 협찬 콘텐츠에 바로 적용할 수 있습니다.',
    note: '조회 13,298 · 반응 199 · 저장 74',
    thumb: '/reels-cases/case-03-thumb.jpg',
    insight: '/reels-cases/case-03-insight.jpg'
  },
  {
    eyebrow: 'Case 04',
    title: 'Mangwon-dong Date',
    headline: '로컬 산책형 콘텐츠의 높은 저장 신호',
    reach: '3.9만',
    summary: '지역명과 데이트 동선이 명확한 콘텐츠는 실제 방문 계획으로 이어지기 좋은 구조입니다.',
    note: '조회 39,267 · 공유 272 · 저장 415',
    thumb: '/reels-cases/case-04-thumb.jpg',
    insight: '/reels-cases/case-04-insight.jpg'
  },
  {
    eyebrow: 'Case 05',
    title: 'Jeju Course',
    headline: '여행 경험을 가볍게 따라가게 만드는 형식',
    reach: '5.6만',
    summary: '짧은 여행 기록도 코스 제안처럼 보이게 설계하면 지역 브랜드와 숙박, F&B 협업에 적합합니다.',
    note: '조회 56,493 · 공유 365 · 저장 253',
    thumb: '/reels-cases/case-05-thumb.jpg',
    insight: '/reels-cases/case-05-insight.jpg'
  }
]

const metrics = [
  { label: '최근 30일 조회수', value: '1,043,296', helper: '4월 19일 - 5월 18일' },
  { label: '도달한 계정', value: '539,290', helper: '+16,721.3%' },
  { label: '프로필 방문', value: '57,004', helper: '+4,861.2%' },
  { label: '반응', value: '1.2만', helper: '콘텐츠 참여 신호' },
  { label: '새 팔로워', value: '176', helper: '최근 30일' },
  { label: '공유된 콘텐츠', value: '103', helper: '회원 공유 기준' }
]

const audienceCards = [
  {
    title: '상위 거주 도시',
    rows: [
      ['서울', 27.5],
      ['부산', 5.7],
      ['인천', 5.6],
      ['대구', 4.5]
    ]
  },
  {
    title: '상위 연령대',
    rows: [
      ['25-34', 59.6],
      ['18-24', 19.2],
      ['35-44', 16.2],
      ['45-54', 4.1]
    ]
  },
  {
    title: '성별',
    rows: [
      ['여성', 89.8],
      ['남성', 10.2]
    ]
  }
]

const opportunities = [
  ['01', 'Restaurant Review', '레스토랑 방문 리뷰'],
  ['02', 'Cafe Launch', '카페 신메뉴 / 신규 공간 소개'],
  ['03', 'Hotel Stay', '호텔 및 공간 경험 콘텐츠'],
  ['04', 'Product Placement', '제품 플레이스먼트'],
  ['05', 'Event Coverage', '이벤트 현장 커버리지'],
  ['06', 'Reels Production', '릴스 및 숏폼 제작'],
  ['07', 'Story Promotion', '스토리 홍보'],
  ['08', 'UGC Delivery', '브랜드 소유 UGC 납품']
]

const styleImages = [
  { src: '/style-showcase/style-01.jpg', label: 'Dining Story' },
  { src: '/style-showcase/style-02.jpg', label: 'Food Discovery' },
  { src: '/style-showcase/style-03.jpg', label: 'Travel Mood' },
  { src: '/style-showcase/style-04.jpg', label: 'Cafe Moment' },
  { src: '/style-showcase/style-05.jpg', label: 'Local Dining' },
  { src: '/style-showcase/style-06.jpg', label: 'City Travel' }
]

const proofImages = [
  { src: '/insights/reach.jpg', label: '조회수 인사이트' },
  { src: '/insights/cities.jpg', label: '도시 분포' },
  { src: '/insights/age.jpg', label: '연령대' },
  { src: '/insights/gender.jpg', label: '성별' }
]

const progressWidth = computed(() => `${((currentSlide.value + 1) / slides.length) * 100}%`)

const moveTo = (index: number) => {
  const target = Math.max(0, Math.min(index, slides.length - 1))
  currentSlide.value = target
  if (!deck.value) return

  const left = deck.value.clientWidth * target
  if (typeof deck.value.scrollTo === 'function') {
    deck.value.scrollTo({ left, behavior: 'smooth' })
  } else {
    deck.value.scrollLeft = left
  }
}

const onScroll = () => {
  if (!deck.value) return
  window.clearTimeout(scrollSyncTimer)
  scrollSyncTimer = window.setTimeout(() => {
    if (!deck.value) return
    const width = deck.value.clientWidth || 1
    currentSlide.value = Math.max(0, Math.min(Math.round(deck.value.scrollLeft / width), slides.length - 1))
  }, 90)
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowRight') moveTo(currentSlide.value + 1)
  if (event.key === 'ArrowLeft') moveTo(currentSlide.value - 1)
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.clearTimeout(scrollSyncTimer)
})
</script>

<template>
  <main class="page">
    <section class="portfolio-frame" aria-label="ooooning_hi 협업 제안 포트폴리오">
      <header class="frame-header">
        <a class="handle" href="https://www.instagram.com/ooooning_hi/" target="_blank" rel="noreferrer">
          @ooooning_hi
        </a>
        <div class="deck-meta">
          <span>Partnership Portfolio</span>
          <span>2026 Media Kit</span>
        </div>
      </header>

      <div ref="deck" class="deck" @scroll.passive="onScroll">
        <article class="slide slide-cover">
          <div class="cover-mark">OH</div>
          <div class="cover-center">
            <p class="serif-note">Organic lifestyle creator</p>
            <h1>일상의 발견이<br />누군가의 다음 방문이 되도록</h1>
            <p class="cover-copy">
              푸드, 카페, 로컬 경험을 기록하며<br />
              사람들의 저장과 공유를 이끄는 콘텐츠를 만듭니다.
            </p>
          </div>
          <a class="cover-qr" href="https://www.instagram.com/ooooning_hi/" target="_blank" rel="noreferrer">
            <img src="/instagram-qr.svg" alt="ooooning_hi 인스타그램 QR 코드" />
            <span>Scan Instagram</span>
          </a>
          <div class="cover-bottom">
            <span>Food</span>
            <span>Cafe</span>
            <span>Local Experience</span>
            <span>Reels</span>
          </div>
        </article>

        <article class="slide slide-about">
          <aside class="slide-index">01</aside>
          <div class="about-copy">
            <p class="kicker">About the Creator</p>
            <h2>협찬 이력보다 먼저 증명된 콘텐츠 반응</h2>
            <p>
              ooooning_hi는 맛집, 카페, 로컬 경험, 일상 속 장면을 감도 있게 소개하는 인스타그램
              라이프스타일 계정입니다. 아직 유료 협업 이력은 없지만, 개인 콘텐츠만으로 높은 도달과
              프로필 유입을 만들어낸 점이 강점입니다.
            </p>
          </div>
          <div class="editorial-notes">
            <div>
              <strong>Content Lens</strong>
              <span>방문 전 저장하고 싶은 발견형 스토리텔링</span>
            </div>
            <div>
              <strong>Brand Fit</strong>
              <span>외식, 카페, 호텔, 뷰티, 로컬 브랜드와 자연스러운 연결</span>
            </div>
            <div>
              <strong>Positioning</strong>
              <span>광고처럼 보이지 않는 실제 경험 기반 콘텐츠</span>
            </div>
          </div>
        </article>

        <article class="slide slide-snapshot">
          <div class="snapshot-lead">
            <p class="kicker">Channel Snapshot</p>
            <h2>최근 30일, 유기적 성과로 확인된 확산력</h2>
          </div>
          <div class="hero-stat">
            <span>Reach / Views</span>
            <strong>1,043,296</strong>
            <small>2026.04.19 - 2026.05.18</small>
          </div>
          <div class="metric-table">
            <div v-for="metric in metrics.slice(1)" :key="metric.label">
              <span>{{ metric.label }}</span>
              <strong>{{ metric.value }}</strong>
              <small>{{ metric.helper }}</small>
            </div>
          </div>
        </article>

        <article class="slide slide-audience">
          <div class="slide-heading">
            <p class="kicker">Audience Demographics</p>
            <h2>서울 중심, 25-34 여성 오디언스</h2>
          </div>
          <div class="audience-composition">
            <section v-for="card in audienceCards" :key="card.title" class="chart-card">
              <h3>{{ card.title }}</h3>
              <div v-for="[label, value] in card.rows" :key="label" class="chart-row">
                <span>{{ label }}</span>
                <div><i :style="{ width: `${Math.min(value * 1.45, 100)}%` }" /></div>
                <strong>{{ value }}%</strong>
              </div>
            </section>
          </div>
        </article>

        <article v-for="reelCase in reelCases" :key="reelCase.title" class="slide slide-performance-case">
          <div class="performance-case-copy">
            <p class="kicker">Top Content Performance · {{ reelCase.eyebrow }}</p>
            <h2>{{ reelCase.headline }}</h2>
            <p>{{ reelCase.summary }}</p>
            <div class="case-stat">
              <strong>{{ reelCase.reach }}</strong>
              <span>{{ reelCase.title }}</span>
              <small>{{ reelCase.note }}</small>
            </div>
          </div>
          <div class="case-pair" :aria-label="`${reelCase.title} 릴스 썸네일과 인사이트`">
            <figure class="case-image case-thumb">
              <img :src="reelCase.thumb" :alt="`${reelCase.title} 릴스 썸네일`" />
              <figcaption>Reels thumbnail</figcaption>
            </figure>
            <figure class="case-image case-insight">
              <img :src="reelCase.insight" :alt="`${reelCase.title} 릴스 인사이트`" />
              <figcaption>Instagram insight</figcaption>
            </figure>
          </div>
        </article>

        <article class="slide slide-trust">
          <div class="trust-statement">
            <p class="kicker">Engagement Quality</p>
            <h2>조회에서 방문 의향으로 이어지는 신호</h2>
            <p>
              브랜드 협업에서 중요한 것은 노출 그 자체보다 저장, 공유, 프로필 방문처럼 다음 행동으로
              이어지는 반응입니다.
            </p>
          </div>
          <div class="trust-metrics">
            <div><strong>57,004</strong><span>프로필 방문</span></div>
            <div><strong>103</strong><span>공유된 콘텐츠</span></div>
            <div><strong>1.2만</strong><span>콘텐츠 반응</span></div>
          </div>
          <div class="quote-panel">
            <blockquote>댓글 예시 입력 영역</blockquote>
            <blockquote>스토리 답장 또는 DM 반응 입력 영역</blockquote>
          </div>
        </article>

        <article class="slide slide-style">
          <div class="style-copy">
            <p class="kicker">Content Style Showcase</p>
            <h2>푸드, 카페, 로컬 경험을 하나의 톤으로</h2>
          </div>
          <div class="moodboard">
            <figure v-for="image in styleImages" :key="image.src">
              <img :src="image.src" :alt="image.label" />
              <figcaption>{{ image.label }}</figcaption>
            </figure>
          </div>
        </article>

        <article class="slide slide-why">
          <p class="kicker">Why Collaborate</p>
          <h2>브랜드가 먼저 테스트해볼 이유</h2>
          <ol class="reason-list">
            <li><strong>강한 유기적 도달</strong><span>광고 집행 없이 최근 30일 100만 이상의 조회 경험</span></li>
            <li><strong>로컬 구매 맥락</strong><span>서울과 수도권 방문 가능성이 높은 오디언스 구성</span></li>
            <li><strong>발견형 콘텐츠</strong><span>맛집, 카페, 공간, 제품을 저장 가능한 정보로 소개</span></li>
            <li><strong>첫 협업 프리미엄</strong><span>초기 브랜드 사례로 더 정성 높은 콘텐츠 설계 가능</span></li>
          </ol>
        </article>

        <article class="slide slide-opportunity">
          <div class="slide-heading">
            <p class="kicker">Partnership Opportunities</p>
            <h2>브랜드 목적에 맞춘 협업 메뉴</h2>
          </div>
          <div class="opportunity-table">
            <div v-for="[number, english, korean] in opportunities" :key="number">
              <span>{{ number }}</span>
              <strong>{{ english }}</strong>
              <p>{{ korean }}</p>
            </div>
          </div>
        </article>

        <article class="slide slide-packages">
          <div class="slide-heading">
            <p class="kicker">Deliverables</p>
            <h2>작게 시작하고 성과에 맞춰 확장</h2>
          </div>
          <div class="package-grid">
            <section>
              <p>Starter</p>
              <h3>방문 리뷰</h3>
              <span>방문 콘텐츠 1건<br />스토리 2컷<br />기본 인사이트 공유</span>
            </section>
            <section>
              <p>Growth</p>
              <h3>릴스 중심</h3>
              <span>릴스 1건<br />피드/스토리 연계<br />성과 리포트</span>
            </section>
            <section>
              <p>Custom</p>
              <h3>캠페인형</h3>
              <span>호텔, 행사, 시즌 프로모션<br />UGC 납품 등 별도 구성</span>
            </section>
          </div>
        </article>

        <article class="slide slide-evidence">
          <div class="evidence-heading">
            <p class="kicker">Insight Evidence</p>
            <h2>협업 제안의 근거가 되는 실제 인사이트</h2>
            <p>
              아래 이미지는 인스타그램 프로페셔널 대시보드에서 확인한 최근 30일 인사이트 자료입니다.
              브랜드 제안 시 수치의 출처를 함께 확인할 수 있도록 별도 페이지로 분리했습니다.
            </p>
          </div>
          <div class="evidence-grid">
            <figure v-for="image in proofImages" :key="image.src">
              <img :src="image.src" :alt="image.label" />
              <figcaption>{{ image.label }}</figcaption>
            </figure>
          </div>
        </article>

        <article class="slide slide-contact">
          <div class="contact-main">
            <p class="serif-note">Contact</p>
            <h2>브랜드의 첫 발견을<br />함께 만들겠습니다.</h2>
          </div>
          <div class="contact-row">
            <a href="https://www.instagram.com/ooooning_hi/" target="_blank" rel="noreferrer">@ooooning_hi</a>
            <a href="mailto:dkssud2608@naver.com">dkssud2608@naver.com</a>
            <a class="qr-card" href="https://www.instagram.com/ooooning_hi/" target="_blank" rel="noreferrer">
              <img src="/instagram-qr.svg" alt="ooooning_hi 인스타그램 QR 코드" />
              <span>Instagram QR</span>
            </a>
          </div>
        </article>
      </div>

      <footer class="frame-controls">
        <div class="progress-track"><i :style="{ width: progressWidth }" /></div>
        <button type="button" aria-label="이전 슬라이드" :disabled="currentSlide === 0" @click="moveTo(currentSlide - 1)">
          ‹
        </button>
        <div class="dots" aria-label="슬라이드 이동">
          <button
            v-for="(slide, index) in slides"
            :key="slide"
            type="button"
            :aria-label="`${index + 1}번 슬라이드: ${slide}`"
            :class="{ active: currentSlide === index }"
            @click="moveTo(index)"
          />
        </div>
        <span class="slide-count">{{ currentSlide + 1 }} / {{ slides.length }}</span>
        <button
          type="button"
          aria-label="다음 슬라이드"
          :disabled="currentSlide === slides.length - 1"
          @click="moveTo(currentSlide + 1)"
        >
          ›
        </button>
      </footer>
    </section>
  </main>
</template>
