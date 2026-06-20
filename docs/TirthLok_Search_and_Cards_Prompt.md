# TirthLok — Search Bar Scroll Behaviour & Card System Prompt

> Reference UI: Airbnb (airbnb.co.in). Replicate the exact scroll-transform pattern and card anatomy observed in the recorded session. Adapt to TirthLok's data schema and design tokens.

---

## 1. Search Bar — Two-State Scroll Behaviour

### State 1: Expanded (at top / scroll = 0)

The search bar is a **full horizontal segmented control** sitting below the nav bar, in its own dedicated row.

**Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│  [Where]              [When / Dates]        [Who / Guests]  🔍│
│  Search destinations   Add dates             Add guests      │
└─────────────────────────────────────────────────────────────┘
```

- Container: `background: #FFFFFF`, `border: 1px solid rgba(0,0,0,0.12)`, `border-radius: 40px`, `box-shadow: 0 2px 8px rgba(0,0,0,0.08)`
- Full width, horizontally divided into 3 segments with `1px solid rgba(0,0,0,0.1)` dividers between them
- Each segment: `padding: 14px 24px`, vertically stacked label (12px, `font-weight: 600`, `#1A1A18`) + value (14px, `#6B6B65`)
- Search button: circular `44px`, `background: #E8562A` (saffron), white icon, floated to far right inside container
- Sits in its own row, `margin-top: 12px` below the nav, full content width
- No border-bottom on nav when in this state

**For TirthLok — segment labels per section:**

| Section | Segment 1 | Segment 2 | Segment 3 |
|---|---|---|---|
| Tirth | Where (location/state) | When (visit period) | Who (pilgrims count) |
| Dharamshala | Where (city/tirth) | Check-in → Check-out | Guests |
| Bhojanshala | Where (city/tirth) | When (meal time) | — (2 segments only) |

---

### State 2: Compact (scroll > 80px)

When the user scrolls down past **80px**, the search bar **morphs** into a compact inline pill inside the nav bar itself.

**Structure:**
```
[Logo]   [📍 Location · Dates · Guests]  🔍   [Bell] [Avatar]
              ↑ compact pill in nav center
```

- The expanded search row **disappears** (opacity 0, height collapses)
- Inside the nav, a compact pill appears: `background: #FFFFFF`, `border: 0.5px solid rgba(0,0,0,0.15)`, `border-radius: 40px`, `padding: 8px 6px 8px 16px`
- Pill content: location name (or section name) · date range · guest count — all inline, separated by `·`, `font-size: 14px`, `font-weight: 500`
- Search icon button on the right of the pill: `36px` circle, `background: #E8562A`, white icon
- Clicking the compact pill re-expands to State 1 (animate back down)

**Transition animation:**
- `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- Expanded search row: `transform: translateY(-8px)` + `opacity: 0` → collapses
- Compact pill: `transform: translateY(4px)` + `opacity: 0` → fades + slides into nav
- Nav height changes: State 1 = nav (60px) + search row (72px) = 132px total sticky area. State 2 = nav only (60px)
- Both states: `position: sticky; top: 0; z-index: 100; background: #FAFAF8`

**Scroll-up (back to top):**
- When user scrolls back above 80px: reverse the animation — compact pill fades out, expanded row slides back down

---

### Filter Chips Row (below search, always visible when scrolled)

In State 2 (compact), the filter chips row appears **below the nav** as a second sticky row:

```
[🔧 Filters] [Siddh Kshetra] [Moksha Kshetra] [Gyan Kshetra] [Heritage] ...
```

- `position: sticky; top: 60px` (sits just below the compact nav)
- `background: #FAFAF8`, `border-bottom: 0.5px solid rgba(0,0,0,0.08)`, `padding: 12px 28px`
- Horizontally scrollable, no visible scrollbar
- Filter chips: same design as Master Prompt Section 6

In State 1 (expanded), filter chips sit below the expanded search row (not sticky).

---

## 2. Tirth Card System — Grid Layout

**Exact Airbnb card anatomy, adapted for Tirth:**

### Grid
- `display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 24px`
- Desktop (1440px+): typically 7–8 cards per row (Airbnb shows 7 at ~960px viewport width at ~110px min)
- At 1280px: 5–6 cards
- At 1024px: 4 cards
- At 768px: 3 cards
- At 480px: 2 cards
- At 320px: 1 card

### Card Structure (NO border, NO shadow — Airbnb style)

```
┌────────────────────────────┐
│                            │  ← Image: aspect-ratio 1/1 (square)
│      [image]          ♡    │     border-radius: 12px
│  [badge top-left]          │     object-fit: cover
│                            │
└────────────────────────────┘
[tirth_name]                    ← 14px, font-weight: 500, #1A1A18
[tirth_city], [tirth_state]     ← 13px, #6B6B65
[tirth_kshetra]                 ← 13px, #6B6B65
```

**Key rules:**
- **No card border.** No `box-shadow`. Cards are borderless — just image + text below.
- **No card background.** The card blends into the page background.
- Image container: `border-radius: 12px`, `overflow: hidden`, `aspect-ratio: 1/1` (square), `background: #F0EDE8`
- Wishlist heart: `position: absolute; top: 12px; right: 12px`, always visible, outline = not saved, filled saffron = saved
- Badge (grouping): `position: absolute; top: 12px; left: 12px`, pill shape, section-tinted, semi-transparent backdrop

**Text block below image:**
```css
.card-info {
  padding: 8px 0 0 0;  /* no side padding — card has no container */
  display: flex;
  flex-direction: column;
  gap: 2px;
}
```

| Line | Content | DB Source | Style |
|---|---|---|---|
| Line 1 | `tirth_name` | `tirth_cards.tirth_name` | 14px, weight 500, `#1A1A18` |
| Line 2 | `tirth_city, tirth_state` | `tirth_cards.tirth_city` + `tirth_state` | 13px, `#6B6B65` |
| Line 3 | `tirth_kshetra` | `tirth_cards.tirth_kshetra` | 13px, `#6B6B65` |

**No ratings on Tirth cards.**

Image hover: `transform: scale(1.04)`, `transition: transform 0.3s ease` on the `<img>` inside fixed container.

---

## 3. Dharamshala Card System — Grid Layout

**Same Airbnb-style grid card. NOT horizontal layout for the listing page.**

Dharamshala listing uses the **same square grid card pattern** as Tirth. The horizontal card layout is reserved for the detail/comparison view only.

### Grid
Same as Tirth: `repeat(auto-fill, minmax(220px, 1fr))`, `gap: 24px`

### Card Structure

```
┌────────────────────────────┐
│                       ♡    │  ← Image: aspect-ratio 1/1 (square)
│      [image]               │     border-radius: 12px
│  [badge top-left]          │
│  ● ● ○  (dots)             │  ← image carousel dots, bottom-center
└────────────────────────────┘
[dharamshala_name]              ← 14px, weight 500, #1A1A18
[dharamshala_city], [state]     ← 13px, #6B6B65
[dharamshala_rating] ★ [n reviews] ← 13px, inline, #1A1A18
[price_range or min_price]      ← 13px, #1A1A18, "from ₹X / night"
```

**Data mapping:**

| Line | Content | DB Source |
|---|---|---|
| Image | Carousel from array | `dharamshala_cards.dharamshala_images[0]` default |
| Badge | First tag | `dharamshala_cards.dharamshala_tags[0]` |
| Name | Property name | `dharamshala_cards.dharamshala_name` |
| Location | City, State | `dharamshala_cards.dharamshala_city`, `dharamshala_state` |
| Rating | Rating + reviews | `dharamshala_cards.dharamshala_rating` ★ `total_reviews` reviews |
| Price | Lowest room price | `MIN(room_types.base_price)` WHERE `dharamshala_id` matches |
| Discount | Strike original | `room_types.discount_price` — show base_price struck, discount bold |

Rating line format: `★ 4.7 (318)` — star icon in `#1A1A18`, number in `#1A1A18`, count in `#6B6B65`

Price line format: `from ₹800 / night` — "from" in `#6B6B65`, amount in `#1A1A18` weight 500

If `discount_price` exists: `~~₹1,200~~ ₹800 / night` — strikethrough original in `#9C9B96`, discounted in `#1A1A18`

**Image carousel on hover:**
- On desktop hover, show left/right chevron arrows (same as Airbnb)
- Arrows: `width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.95); box-shadow: 0 1px 4px rgba(0,0,0,0.15)`
- Dot indicators: `position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%)`
- Active dot: `6px` white filled; inactive: `6px` white `opacity: 0.6`

---

## 4. Bhojanshala Card System — Grid Layout

**Same Airbnb-style square grid card.** Consistent with Tirth and Dharamshala listing pages.

### Card Structure

```
┌────────────────────────────┐
│                       ♡    │  ← Image: aspect-ratio 1/1
│      [image]               │     border-radius: 12px
│  [type badge]              │
│  [🌿 Free] [🕐 Lunch 12–2] │  ← meal pills at bottom of image
└────────────────────────────┘
[bhojanshala_name]              ← 14px, weight 500, #1A1A18
[bhojanshala_city], [state]     ← 13px, #6B6B65
[dietary_info]                  ← 13px, #6B6B65  e.g. "Pure Jain · Veg only"
[payment_info]                  ← 13px, #1A1A18  e.g. "Free" or "₹80 / thali"
```

**Data mapping:**

| Line | Content | DB Source |
|---|---|---|
| Image | Main image | `bhojanshala_cards.bhojanshala_images` (parse jsonb → first URL) |
| Badge | Type | `bhojanshala_cards.bhojanshala_type` |
| Meal pills | Active meal times | `bhojanshala_details.meal_timings` (jsonb keys: breakfast/lunch/dinner) |
| Name | Facility name | `bhojanshala_cards.bhojanshala_name` |
| Location | City, State | `bhojanshala_cards.bhojanshala_city`, `bhojanshala_state` |
| Dietary | Diet type | `bhojanshala_details.dietary_info` |
| Pricing | Payment info | `bhojanshala_details.payment_info` — "Free" in jade `#1A7F5A`, else `#1A1A18` |

Meal timing pills (on image, bottom-left):
```css
.meal-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  background: rgba(255,255,255,0.92);
  color: #1A1A18;
  backdrop-filter: blur(4px);
}
```
Show only pills for meal times that exist in `meal_timings` jsonb.

---

## 5. Shared Card Rules (All Three Sections)

| Property | Value |
|---|---|
| Card container | No border, no shadow, no background — borderless Airbnb style |
| Image aspect ratio | `1 / 1` (square) — enforced with `aspect-ratio: 1/1` |
| Image border-radius | `12px` |
| Image object-fit | `cover` |
| Gap between cards | `24px` |
| Gap below image to text | `8px` |
| Text line-height | `1.4` |
| Text line gap | `2–3px` |
| Hover on image | `scale(1.04)`, `transition: 0.3s ease` |
| Wishlist heart | `position: absolute; top: 12px; right: 12px`, always visible |
| Heart — default | Outline, white with `drop-shadow(0 1px 2px rgba(0,0,0,0.3))` |
| Heart — saved | Filled, `#E8562A` |
| Card click target | Entire card — `cursor: pointer` |

---

## 6. Page Layout with Scroll Behaviour — Full Specification

```
┌─────────────────────────────────────────┐
│ STICKY LAYER (z-index: 100)             │
│ ┌─────────────────────────────────────┐ │
│ │ Nav Bar (60px)                      │ │  ← always sticky
│ │ [Logo] [Tabs] [Bell] [Avatar]       │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ Search Row (72px) — STATE 1 ONLY    │ │  ← collapses into nav on scroll
│ │ [Where | Dates | Guests]     [🔍]   │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ Filter Chips (48px)                 │ │  ← sticky at top:60px after scroll
│ │ [All] [Siddh] [Moksha] [Heritage].. │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

SCROLLABLE CONTENT
┌─────────────────────────────────────────┐
│ Page title + count (20px top padding)   │
│ "13 tirths" / "2 dharamshalas"          │
├─────────────────────────────────────────┤
│ Card Grid                               │
│  [card] [card] [card] [card] [card]     │
│  [card] [card] [card] [card] [card]     │
│  ...                                    │
└─────────────────────────────────────────┘
```

**JavaScript scroll logic:**
```javascript
const SCROLL_THRESHOLD = 80;

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > SCROLL_THRESHOLD;
  
  // Toggle search states
  searchExpanded.style.opacity = scrolled ? '0' : '1';
  searchExpanded.style.transform = scrolled ? 'translateY(-8px)' : 'translateY(0)';
  searchExpanded.style.pointerEvents = scrolled ? 'none' : 'auto';
  searchExpanded.style.height = scrolled ? '0' : '72px';
  
  searchCompact.style.opacity = scrolled ? '1' : '0';
  searchCompact.style.transform = scrolled ? 'translateY(0)' : 'translateY(4px)';
  searchCompact.style.pointerEvents = scrolled ? 'auto' : 'none';
  
  // Filter chips sticky position
  filterChips.style.top = scrolled ? '60px' : 'auto';
  filterChips.style.position = scrolled ? 'sticky' : 'relative';
});
```

All transitions: `transition: opacity 0.25s ease, transform 0.25s ease, height 0.25s ease`

---

## 7. What Not To Do

- **Never** keep the expanded search bar visible when user has scrolled down
- **Never** hide the compact search pill — it must always be accessible during scroll
- **Never** use horizontal card layout on listing pages — Airbnb-style square grid only
- **Never** add card borders or box shadows to listing cards
- **Never** show ratings on Tirth cards
- **Never** use `aspect-ratio` other than `1/1` for listing card images
- **Never** wrap filter chips — horizontal scroll only, no multi-line chips

