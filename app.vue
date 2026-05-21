<script setup lang="ts">
import content from '~/data/portfolio-content.json'

const deck = ref<HTMLElement | null>(null)
const currentSlide = ref(0)
let scrollSyncTimer: ReturnType<typeof setTimeout> | undefined

const slides = [
  content.slides[0],
  content.slides[1],
  content.slides[14],
  content.slides[4],
  content.slides[5],
  content.slides[8],
  content.slides[7],
  content.slides[6],
  content.slides[2],
  content.slides[10],
  content.slides[9],
  content.slides[12],
  content.slides[13],
  content.slides[15]
]
const metrics = content.snapshot.metrics
const audienceCards = content.audience.cards
const activePerformanceCases = [0, 1, 4, 3, 2].map((index) => content.performance.cases[index])

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
        <a class="handle" :href="content.meta.instagramUrl" target="_blank" rel="noreferrer">
          {{ content.meta.handle }}
        </a>
        <div class="deck-meta">
          <span>{{ content.meta.deckType }}</span>
          <span>{{ content.meta.year }}</span>
        </div>
      </header>

      <div ref="deck" class="deck" @scroll.passive="onScroll">
        <article class="slide slide-cover">
          <div class="cover-mark">{{ content.cover.mark }}</div>
          <div class="cover-center">
            <p class="serif-note">{{ content.cover.eyebrow }}</p>
            <h1>{{ content.cover.headline }}</h1>
            <p class="cover-copy">{{ content.cover.body }}</p>
          </div>
          <a class="cover-qr" :href="content.meta.instagramUrl" target="_blank" rel="noreferrer">
            <img src="/instagram-qr.svg" :alt="`${content.meta.handle} 인스타그램 QR 코드`" />
            <span>{{ content.cover.qrLabel }}</span>
          </a>
          <div class="cover-bottom">
            <span v-for="category in content.cover.categories" :key="category">{{ category }}</span>
          </div>
        </article>

        <article class="slide slide-about">
          <aside class="slide-index">{{ content.about.index }}</aside>
          <div class="about-copy">
            <p class="kicker">{{ content.about.kicker }}</p>
            <h2>{{ content.about.headline }}</h2>
            <p>{{ content.about.body }}</p>
          </div>
          <div class="editorial-notes">
            <div v-for="note in content.about.notes" :key="note.title">
              <strong>{{ note.title }}</strong>
              <span>{{ note.body }}</span>
            </div>
          </div>
        </article>

        <article class="slide slide-evidence">
          <div class="evidence-heading">
            <p class="kicker">{{ content.evidence.kicker }}</p>
            <h2>{{ content.evidence.headline }}</h2>
            <p>{{ content.evidence.body }}</p>
          </div>
          <div class="evidence-grid">
            <figure v-for="image in content.evidence.images" :key="image.src">
              <img :src="image.src" :alt="image.label" />
              <figcaption>{{ image.label }}</figcaption>
            </figure>
          </div>
        </article>

        <template v-if="false">
          <article class="slide slide-audience">
            <div class="slide-heading">
              <p class="kicker">{{ content.audience.kicker }}</p>
              <h2>{{ content.audience.headline }}</h2>
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
        </template>

        <article v-for="reelCase in activePerformanceCases" :key="reelCase.title" class="slide slide-performance-case">
          <div class="performance-case-copy">
            <p class="kicker">{{ content.performance.kicker }} · {{ reelCase.eyebrow }}</p>
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
              <figcaption>{{ content.performance.thumbnailCaption }}</figcaption>
            </figure>
            <figure class="case-image case-insight">
              <img :src="reelCase.insight" :alt="`${reelCase.title} 릴스 인사이트`" />
              <figcaption>{{ content.performance.insightCaption }}</figcaption>
            </figure>
          </div>
        </article>

        <article class="slide slide-snapshot">
          <div class="snapshot-lead">
            <p class="kicker">{{ content.snapshot.kicker }}</p>
            <h2>{{ content.snapshot.headline }}</h2>
          </div>
          <div class="hero-stat">
            <span>{{ content.snapshot.heroLabel }}</span>
            <strong>{{ content.snapshot.heroValue }}</strong>
            <small>{{ content.snapshot.heroPeriod }}</small>
          </div>
          <div class="metric-table">
            <div v-for="metric in metrics.slice(1)" :key="metric.label">
              <span>{{ metric.label }}</span>
              <strong>{{ metric.value }}</strong>
              <small>{{ metric.helper }}</small>
            </div>
          </div>
        </article>

        <article class="slide slide-style">
          <div class="style-copy">
            <p class="kicker">{{ content.style.kicker }}</p>
            <h2>{{ content.style.headline }}</h2>
          </div>
          <div class="moodboard">
            <figure v-for="image in content.style.images" :key="image.src">
              <img :src="image.src" :alt="image.label" />
              <figcaption>{{ image.label }}</figcaption>
            </figure>
          </div>
        </article>

        <article class="slide slide-trust">
          <div class="trust-statement">
            <p class="kicker">{{ content.trust.kicker }}</p>
            <h2>{{ content.trust.headline }}</h2>
            <p>{{ content.trust.body }}</p>
          </div>
          <div class="trust-metrics">
            <div v-for="metric in content.trust.metrics" :key="metric.label">
              <strong>{{ metric.value }}</strong><span>{{ metric.label }}</span>
            </div>
          </div>
          <figure class="comment-reaction">
            <img :src="content.trust.commentImage.src" :alt="content.trust.commentImage.label" />
            <figcaption>{{ content.trust.commentImage.label }}</figcaption>
          </figure>
        </article>

        <template v-if="false">
          <article class="slide slide-why">
            <p class="kicker">{{ content.why.kicker }}</p>
            <h2>{{ content.why.headline }}</h2>
            <ol class="reason-list">
              <li v-for="reason in content.why.reasons" :key="reason.title">
                <strong>{{ reason.title }}</strong><span>{{ reason.body }}</span>
              </li>
            </ol>
          </article>
        </template>

        <article class="slide slide-opportunity">
          <div class="slide-heading">
            <p class="kicker">{{ content.opportunity.kicker }}</p>
            <h2>{{ content.opportunity.headline }}</h2>
          </div>
          <div class="opportunity-table">
            <div v-for="[number, english, korean] in content.opportunity.items" :key="number">
              <span>{{ number }}</span>
              <strong>{{ english }}</strong>
              <p>{{ korean }}</p>
            </div>
          </div>
        </article>

        <article class="slide slide-packages">
          <div class="slide-heading">
            <p class="kicker">{{ content.deliverables.kicker }}</p>
            <h2>{{ content.deliverables.headline }}</h2>
          </div>
          <div class="package-grid">
            <section v-for="item in content.deliverables.packages" :key="item.label">
              <p>{{ item.label }}</p>
              <h3>{{ item.title }}</h3>
              <span>
                <template v-for="(line, lineIndex) in item.lines" :key="line">
                  {{ line }}<br v-if="lineIndex < item.lines.length - 1" />
                </template>
              </span>
            </section>
          </div>
        </article>

        <article class="slide slide-contact">
          <div class="contact-main">
            <p class="serif-note">{{ content.contact.eyebrow }}</p>
            <h2>{{ content.contact.headline }}</h2>
          </div>
          <div class="contact-row">
            <a :href="content.meta.instagramUrl" target="_blank" rel="noreferrer">{{ content.meta.handle }}</a>
            <a :href="`mailto:${content.meta.email}`">{{ content.meta.email }}</a>
            <a class="qr-card" :href="content.meta.instagramUrl" target="_blank" rel="noreferrer">
              <img src="/instagram-qr.svg" :alt="`${content.meta.handle} 인스타그램 QR 코드`" />
              <span>{{ content.contact.qrLabel }}</span>
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
