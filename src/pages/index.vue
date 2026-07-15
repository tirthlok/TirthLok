
/
Claude finished the response

# MASTER AI PROMPT — Senior UI/UX Designer, Frontend Architect & Quality Assurance Expert ## ROLE You are a world-class **Senior UI/UX Designer, Product Designer, Frontend Architect, CSS Expert, and Quality Assurance Engineer** with over **30 years of experience** designing and building produc

pasted

/skill-creator


Deciphering user intent behind shared system prompt
Deciphering user intent behind shared system prompt
Q: What should the new skill be built from?
A: Merge in the IDENTITY/operating-rules text too

Q: How rigorous should this be?
A: Draft it, then run 2-3 test prompts for you to review


Architected multi-domain test cases validating skill routing and decision-making rigor
Architected multi-domain test cases validating skill routing and decision-making rigor
Drafted the skill. Structure:

senior-multidomain-expert/
├── SKILL.md                                   (122 lines — core principles, mode routing, response formats, decision framework)
└── references/
    ├── engineering-and-architecture.md        (85 lines — code review, Supabase/RLS, architecture trade-offs)
    └── uiux-frontend-design.md                (173 lines — the full responsive/design-system/QA master prompt)
Now running it against 3 test prompts, acting as if the skill just triggered on each:

Test 1 — UI/UX mode
Prompt: "Our product grid shows 4 cards per row on desktop, but on mobile it crushes into a tight 2-column grid and the images look stretched. Vue/Nuxt, feature-first setup. What's wrong?"

Recommendation
Fixed grid-template-columns: repeat(4, 1fr) forced to 2 columns via media query is the root cause — it's shrinking cards to fit a column count instead of letting column count adapt to available width. Switch to an intrinsic auto-fit grid and lock image aspect ratio.

Why
A hardcoded column count is the single most common cause of "cards too small on mobile" — the grid should decide column count from available width, not the other way around.
Stretched images mean nothing is constraining aspect ratio, so the box model is fighting the image on resize.
Implementation
css
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}
.product-card img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
This drops to 1 column automatically once 160px minmax can't fit 2, instead of compressing 2 undersized cards — matches the card-responsiveness rule. Keep the card component itself untouched (feature-first architecture preserved); this is a pure CSS-layer fix.

Test 2 — Engineering/Supabase mode
Prompt: "Adding a subscriptions table (user_id, plan, status, renews_at) to Supabase before we ship. Can you review?"

Issues Found
No RLS policy specified — as given, this table would be readable/writable by any authenticated user for any user_id unless RLS is explicitly enabled.
No foreign key to auth.users, no status constraint, no index on renews_at (you'll query this on a cron for renewals).
Risks
Missing RLS is a data-exposure risk (any user could see or edit another user's subscription) — this is the one to fix before anything else ships, per security-first priority.

Fixes
sql
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null,
  status text not null check (status in ('active','past_due','canceled')),
  renews_at timestamptz not null
);

create index idx_subscriptions_renews_at on subscriptions(renews_at);

alter table subscriptions enable row level security;

create policy "users read own subscription"
  on subscriptions for select
  using (auth.uid() = user_id);
Writes (plan changes, status updates) should go through a server-side function using the service role — not a client-side policy — since billing state shouldn't be user-writable at all.

Test 3 — Strategy mode
Prompt: "Build in-house analytics or use Mixpanet-style tool for our B2B SaaS? Give me a real recommendation."

Situation: Need product analytics; team size/scale not specified — assuming early-to-growth stage B2B SaaS.

Options:

Option	Verdict
Buy (PostHog/Mixpanel)	✅ Best
Hybrid (buy now, revisit at scale)	⚠️ Acceptable
Build in-house	❌ Avoid
Recommendation: Buy. Analytics infra (event pipelines, retention/funnel queries, dashboards) is a solved problem; engineering time is better spent on product differentiation. Revisit only past ~50M events/month, where usage-based pricing starts exceeding a dedicated engineer's cost.

Next step: Instrument core funnel events this sprint with PostHog (self-hostable if data residency matters) rather than deferring analytics until "later."

How do these look — any of the three off, or ready to package?


<template> <div class="bg-background min-h-screen font-sans"> <!-- ══════════════════════════════════════════════════════════ HERO Mobile : full-bleed, no rounding, 60vh Tablet : 4px margin each side, rounded-3xl, 65vh Desktop : 32px margin each si

pasted

Check these.
Fix the CSS and enhance the CSS in a way that is company standard.
Spacing, Paddings, Fonts, Contrast.


Audited component spacing, contrast, and tokens while preserving design system integrity
Audited component spacing, contrast, and tokens while preserving design system integrity
Issues Found
Spacing/Padding — inconsistent section rhythm: Tag sections used py-8 md:py-10 (2 steps), Feature and How-It-Works sections used py-12 md:py-16 (2 steps) — neither had an lg step, so large desktops got the same vertical padding as tablets. Feature cards used a fixed p-6 while How-It-Works cards used responsive p-5 sm:p-6 — same card pattern, two different padding rules.

Fonts — inconsistent H2 treatment: "Your Spiritual Companion" and "How It Works" (both H2s) use font-serif; the tag-group headings (also H2s, same visual level) didn't, breaking the type hierarchy.

Contrast — opacity-based dimming on error text: text-error/70 drops a red at 70% opacity onto a light red background (bg-red-50) — a common way to quietly fail the 4.5:1 AA text-contrast threshold. Weight, not opacity, should carry the visual hierarchy for status text.

Fixes
Area	Before	After
Tag sections	py-8 md:py-10	py-8 md:py-10 lg:py-12
Feature / How-It-Works	py-12 md:py-16	py-12 md:py-16 lg:py-20
Feature card padding	p-6	p-5 sm:p-6
Tag heading	no font-serif	font-serif added
Error subtext	text-error/70	text-error font-normal (solid, hierarchy via weight)
Left alone, flagged for your judgment (not changed in code):

bg-accent/20 on the third feature icon (vs. bg-primary-light / bg-secondary-light on the other two) — same visual effect, different mechanism. Worth adding an accent-light token to your Tailwind config for parity, if one doesn't already exist — I didn't add it blind since I can't confirm your config.
text-text-muted on white/light card backgrounds — I can't verify its actual hex against WCAG 4.5:1 without your token values. Worth a quick contrast-checker pass if that color is on the lighter end of gray.
Business logic, routing, API calls, and the <script> block are untouched.


Presented file
Presented file
Next logical step: run this through your actual Tailwind config to confirm font-serif, text-error, and text-text-muted resolve the way I'm assuming — I inferred the token system from usage in the file but haven't seen the config itself.


Index
VUE 






Claude is AI and can make mistakes. Please double-check responses.
Index · VUE
<template>
  <div class="bg-background min-h-screen font-sans">
 
    <!-- ══════════════════════════════════════════════════════════
         HERO
         Mobile  : full-bleed, no rounding, 60vh
         Tablet  : 4px margin each side, rounded-3xl, 65vh
         Desktop : 32px margin each side, rounded-3xl, 500px
    ══════════════════════════════════════════════════════════ -->
    <section
      class="relative overflow-hidden
             w-full h-[60vh]
             md:h-[65vh] md:mx-4 md:w-[calc(100%-2rem)] md:rounded-3xl md:shadow-2xl
             lg:h-[500px] lg:mx-8 lg:w-[calc(100%-4rem)]
             mb-8 sm:mb-10 md:mb-12"
    >
      <!-- Background — cover fills section, scale-100 → scale-105 on hover -->
      <div
        class="absolute inset-0 transition-transform duration-700 scale-100 hover:scale-105"
        :style="{
          backgroundImage:    `url(${heroImg})`,
          backgroundSize:     'cover',
          backgroundPosition: 'center',
          backgroundRepeat:   'no-repeat'
        }"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"/>
      </div>
 
      <!-- Content — page-container is relative to the section, not viewport -->
      <div class="relative h-full flex flex-col justify-center page-container">
        <div class="max-w-2xl">
          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white
                     mb-4 leading-tight font-serif">
            Explore Sacred<br/>
            <span class="text-accent">Jain Tirths</span>
          </h1>
          <p class="text-base sm:text-lg md:text-xl text-white/90 mb-8 font-medium max-w-lg">
            Your comprehensive guide to discovering Jain Derasars across the world.
          </p>
          <NuxtLink
            to="/tirth"
            class="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover
                   text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold
                   shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl
                   text-sm sm:text-base w-fit"
          >
            Start Your Journey
            <Icon name="ArrowRight" :size="20" />
          </NuxtLink>
        </div>
      </div>
    </section>
 
 
    <!-- ══════════════════════════════════════════════════════════
         TAG SECTIONS — dynamic horizontal scroll rows
         Loading and error states placed HERE, before sections
         Spacing: compact rhythm (py-8/10/12) since these sections
         repeat several times per page — see feature/how-it-works
         sections below for the spacious rhythm used on one-off sections.
    ══════════════════════════════════════════════════════════ -->
 
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"/>
    </div>
 
    <!-- Error -->
    <div
      v-else-if="error"
      class="m-4 sm:m-6 lg:m-8 p-4 bg-red-50 border-l-4 border-error rounded-lg"
    >
      <p class="text-error text-sm font-semibold">Failed to load temples</p>
      <p class="text-error text-xs font-normal mt-1">{{ error }}</p>
    </div>
 
    <!-- Tag sections -->
    <template v-else-if="tagGroups.length > 0">
      <section
        v-for="group in tagGroups"
        :key="group.tag"
        class="py-4 md:py-5 lg:py-6 bg-background"
      >
        <div class="page-container">
 
          <!-- Section header -->
          <div class="flex items-center gap-3 mb-5 md:mb-6">
            <h2 class="text-xl sm:text-2xl font-bold font-serif text-text-main tracking-tight">
              {{ group.tag }}
            </h2>
            <NuxtLink
              to="/tirth"
              class="flex items-center justify-center w-7 h-7 rounded-full
                     bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
              :aria-label="`See all ${group.tag}`"
            >
              <svg viewBox="0 0 20 20" width="14" height="14" fill="none"
                   stroke="currentColor" stroke-width="2.2"
                   stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 10h12M11 5l5 5-5 5"/>
              </svg>
            </NuxtLink>
          </div>
 
          <!--
            Horizontal bleed scroll — negative margins match page-container padding
            exactly so the scroll area bleeds edge-to-edge while first card
            stays aligned with page content.
            page-container padding: 1rem(mobile) 1.5rem(sm) 2.5rem(md) 3.5rem(lg) 5rem(xl)
          -->
          <div
            class="overflow-x-auto no-scrollbar
                   -mx-4   sm:-mx-6   md:-mx-10  lg:-mx-14  xl:-mx-20
                    px-4    sm:px-6    md:px-10   lg:px-14   xl:px-20"
          >
            <div class="flex gap-4 sm:gap-5 w-max snap-x snap-mandatory pb-2">
              <div
                v-for="tirth in group.tirths"
                :key="tirth.id"
                class="flex-shrink-0 snap-start
                       w-[200px] sm:w-[240px] md:w-[260px] lg:w-[280px]"
              >
                <TirthCard :tirth="tirth" />
              </div>
            </div>
          </div>
 
        </div>
      </section>
    </template>
 
    <!-- Empty state — tirths loaded but none have tags -->
    <div
      v-else
      class="text-center py-16 px-4"
    >
      <div class="text-5xl mb-4">🏛️</div>
      <h3 class="text-lg sm:text-xl font-semibold text-text-main mb-2">
        No featured tirths yet
      </h3>
      <p class="text-text-muted text-sm mb-6">
        Add tags to tirths to have them appear here
      </p>
      <NuxtLink
        to="/tirth"
        class="inline-flex items-center gap-2 text-primary font-semibold
               hover:underline text-sm"
      >
        Browse all tirths <Icon name="ArrowRight" :size="16" />
      </NuxtLink>
    </div>
 
 
    <!-- ══════════════════════════════════════════════════════════
         YOUR SPIRITUAL COMPANION — feature cards
         Mobile  : single column
         Tablet  : 2 columns (3rd card spans both)
         Desktop : 3 columns
         Spacing: spacious rhythm (py-12/16/20) — one-off section, not repeated.
    ══════════════════════════════════════════════════════════ -->
    <section class="py-12 md:py-16 lg:py-20 bg-background">
      <div class="page-container">
 
        <div class="text-center mb-10 md:mb-12">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-text-main mb-2 font-serif">
            Your Spiritual Companion
          </h2>
          <p class="text-text-muted text-base sm:text-lg">
            Discover ancient temples, find accommodations, and get answers.
          </p>
        </div>
 
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
 
          <!-- Feature 1 — Tirth -->
          <NuxtLink
            to="/tirth"
            class="group rounded-2xl p-[1.5px] transition-all duration-300
                   bg-gradient-to-br from-indigo-100/60 to-purple-100/60
                   hover:from-indigo-200/80 hover:to-purple-200/80 block"
          >
            <div
              class="h-full p-5 sm:p-6 rounded-[13px] bg-white/95 transition-all duration-300
                     group-hover:-translate-y-1 group-hover:shadow-lg"
              style="box-shadow: 0 6px 20px rgba(99,102,241,0.06);"
            >
              <div class="w-14 h-14 rounded-xl bg-primary-light flex items-center
                          justify-center mb-5 group-hover:bg-primary transition-colors duration-300">
                <span class="text-2xl group-hover:scale-110 transition-transform duration-300 block">🏛️</span>
              </div>
              <h3 class="text-lg font-bold text-text-main mb-2">Explore Tirths</h3>
              <p class="text-text-muted text-sm leading-relaxed mb-4">
                Browse a vast directory of Jain Tirths. Filter by sect, type, location, and more.
              </p>
              <span class="text-primary text-sm font-semibold inline-flex items-center gap-1
                           group-hover:gap-2 transition-all">
                Explore <Icon name="ArrowRight" :size="14" />
              </span>
            </div>
          </NuxtLink>
 
          <!-- Feature 2 — Facilities -->
          <NuxtLink
            to="/dharamshala"
            class="group rounded-2xl p-[1.5px] transition-all duration-300
                   bg-gradient-to-br from-blue-100/60 to-cyan-100/60
                   hover:from-blue-200/80 hover:to-cyan-200/80 block"
          >
            <div
              class="h-full p-5 sm:p-6 rounded-[13px] bg-white/95 transition-all duration-300
                     group-hover:-translate-y-1 group-hover:shadow-lg"
              style="box-shadow: 0 6px 20px rgba(59,130,246,0.06);"
            >
              <div class="w-14 h-14 rounded-xl bg-secondary-light flex items-center
                          justify-center mb-5 group-hover:bg-secondary transition-colors duration-300">
                <span class="text-2xl group-hover:scale-110 transition-transform duration-300 block">🏨</span>
              </div>
              <h3 class="text-lg font-bold text-text-main mb-2">Find Facilities</h3>
              <p class="text-text-muted text-sm leading-relaxed mb-4">
                Locate Bhojanshalas and Dharamshalas. View details, timings, and contact information.
              </p>
              <span class="text-primary text-sm font-semibold inline-flex items-center gap-1
                           group-hover:gap-2 transition-all">
                Find Stay <Icon name="ArrowRight" :size="14" />
              </span>
            </div>
          </NuxtLink>
 
          <!-- Feature 3 — AI Assistant (coming soon, no route yet) -->
          <!-- sm:col-span-2 md:col-span-1 centers the 3rd card on tablet 2-col grid -->
          <div
            class="group rounded-2xl p-[1.5px] transition-all duration-300
                   bg-gradient-to-br from-rose-100/60 to-pink-100/60
                   hover:from-rose-200/80 hover:to-pink-200/80
                   sm:col-span-2 md:col-span-1"
          >
            <div
              class="h-full p-5 sm:p-6 rounded-[13px] bg-white/95 transition-all duration-300
                     group-hover:-translate-y-1 group-hover:shadow-lg"
              style="box-shadow: 0 6px 20px rgba(244,63,94,0.06);"
            >
              <div class="w-14 h-14 rounded-xl bg-accent/20 flex items-center
                          justify-center mb-5 group-hover:bg-accent transition-colors duration-300">
                <span class="text-2xl group-hover:scale-110 transition-transform duration-300 block">🤖</span>
              </div>
              <h3 class="text-lg font-bold text-text-main mb-2">AI Tirth Assistant</h3>
              <p class="text-text-muted text-sm leading-relaxed mb-4">
                Questions about history, rituals, or facilities? Our AI assistant has the answers.
              </p>
              <span class="text-primary text-sm font-semibold inline-flex items-center gap-1">
                Coming Soon
              </span>
            </div>
          </div>
 
        </div>
      </div>
    </section>
 
 
    <!-- ══════════════════════════════════════════════════════════
         HOW IT WORKS — 3-step journey guide
         Spacing: spacious rhythm (py-12/16/20), matches feature section above.
    ══════════════════════════════════════════════════════════ -->
    <section class="py-12 md:py-16 lg:py-20 bg-surface-muted">
      <div class="page-container">
 
        <div class="text-center mb-10 md:mb-12">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-text-main mb-2 font-serif">
            How It Works
          </h2>
          <p class="text-text-muted text-base sm:text-lg">
            A simple path to planning your Tirth Yatra.
          </p>
        </div>
 
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
 
          <div class="bg-white rounded-2xl overflow-hidden shadow-sm
                      hover:shadow-lg transition-shadow duration-300 group">
            <div
              class="h-44 bg-cover bg-center relative"
              :style="{ backgroundImage: `url(${step1Image})` }"
            >
              <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"/>
            </div>
            <div class="p-5 sm:p-6">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center
                            justify-center font-bold text-sm flex-shrink-0">1</div>
                <h4 class="font-bold text-base text-text-main">Discover & Filter</h4>
              </div>
              <p class="text-text-muted text-sm leading-relaxed">
                Browse tirths and use powerful search and filter tools to find your destination.
              </p>
            </div>
          </div>
 
          <div class="bg-white rounded-2xl overflow-hidden shadow-sm
                      hover:shadow-lg transition-shadow duration-300 group">
            <div
              class="h-44 bg-cover bg-center relative"
              :style="{ backgroundImage: `url(${step2Image})` }"
            >
              <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"/>
            </div>
            <div class="p-5 sm:p-6">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 rounded-full bg-secondary text-white flex items-center
                            justify-center font-bold text-sm flex-shrink-0">2</div>
                <h4 class="font-bold text-base text-text-main">Explore Details</h4>
              </div>
              <p class="text-text-muted text-sm leading-relaxed">
                Learn about history, architecture, timings, and significance of each tirth.
              </p>
            </div>
          </div>
 
          <div class="bg-white rounded-2xl overflow-hidden shadow-sm
                      hover:shadow-lg transition-shadow duration-300 group
                      sm:col-span-2 md:col-span-1">
            <div
              class="h-44 bg-cover bg-center relative"
              :style="{ backgroundImage: `url(${step3Image})` }"
            >
              <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"/>
            </div>
            <div class="p-5 sm:p-6">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 rounded-full bg-accent text-white flex items-center
                            justify-center font-bold text-sm flex-shrink-0">3</div>
                <h4 class="font-bold text-base text-text-main">Plan Your Stay</h4>
              </div>
              <p class="text-text-muted text-sm leading-relaxed">
                Find accommodation and meal facilities for a complete pilgrimage plan.
              </p>
            </div>
          </div>
 
        </div>
      </div>
    </section>
 
  </div>
</template>
 
<script setup lang="ts">
import { computed } from 'vue'
import { useTirthStore } from '~/features/tirth/shared/composables/useTirthStore'
import TirthCard from '~/features/tirth/shared/components/TirthCard.vue'
 
// Icon is auto-imported — no explicit import needed
 
import heroImg    from '~/assets/images/hero-jain-temple.png'
import step1Image from '~/assets/images/discover.png'
import step2Image from '~/assets/images/explore.png'
import step3Image from '~/assets/images/stay.png'
 
definePageMeta({ layout: 'default' })
 
const tirthStore = useTirthStore()
 
// Explicit server:true ensures data arrives in SSR HTML — no client waterfall
const { data: apiResponse } = await useAsyncData(
  'tirths',
  () => $fetch('/api/tirth' as string),
  { server: true }
)
 
if (apiResponse?.value) {
  const response   = apiResponse.value as any
  const tirthsData = response.data || []
  tirthStore.$patch(state => {
    state.tirths         = tirthsData
    state.filteredTirths = tirthsData
    if (response.pagination) state.pagination = response.pagination
  })
}
 
const loading = computed(() => tirthStore.loading)
const error   = computed(() => tirthStore.error)
 
// Dynamic tag groups.
// Map preserves insertion order — display order matches data order,
// not sorted by count. Editors control order by tagging tirths accordingly.
const tagGroups = computed(() => {
  const groups = new Map<string, typeof tirthStore.filteredTirths>()
 
  tirthStore.filteredTirths.forEach(tirth => {
    if (!Array.isArray(tirth.tirth_tags) || tirth.tirth_tags.length === 0) return
    tirth.tirth_tags.forEach(tag => {
      if (!tag) return
      if (!groups.has(tag)) groups.set(tag, [])
      groups.get(tag)!.push(tirth)
    })
  })
 
  return Array.from(groups.entries())
    .filter(([, tirths]) => tirths.length > 0)
    .map(([tag, tirths]) => ({ tag, tirths }))
})
</script>
 
