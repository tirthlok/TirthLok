# Jain Tirth Explorer - UI/UX Style Guide

## Overview
This document outlines the design system and style guidelines for the Jain Tirth Explorer application, following an Airbnb-inspired, spiritual design philosophy.

---

## Color Palette

### Primary Colors
- **Soft White**: `#FFFFFF` - Main background
- **Cream Sand**: `#F9F6EF` - Subtle background, secondary elements
- **Sage Green**: `#88B47F` - Primary interactive elements, buttons, accents
- **Saffron**: `#EFC65A` - Highlights, badges, special attention elements

### Neutral Colors
- **Charcoal Gray**: `#2C2C2C` - Primary text
- **Light Gray**: `#9A9A9A` - Secondary text, placeholders
- **Border Gray**: `#E5E5E5` - Dividers, subtle borders

### Status Colors
- **Success**: `#22C55E` (Green) - Available, positive actions
- **Warning**: `#F59E0B` (Amber) - Caution, pending
- **Error**: `#EF4444` (Red) - Not available, errors
- **Info**: `#3B82F6` (Blue) - Information, hints

---

## Typography

### Font Families
- **Headlines**: PT Sans (Semi-bold, 600-700 weight)
- **Body Text**: PT Sans (Regular, 400 weight)
- **Numeric/UI Labels**: Inter (Medium, 500 weight)

### Font Sizes
```
Headlines    | PT Sans | Semi-bold (700)
  - 5xl     | 3rem    | Main page title
  - 4xl     | 2.25rem | Section headers
  - 3xl     | 1.875rem| Card titles
  - 2xl     | 1.5rem  | Subsection headers
  - xl      | 1.25rem | Component titles
  
Body Text    | PT Sans | Regular (400)
  - lg      | 1.125rem | Large body text
  - base    | 1rem     | Standard body text
  - sm      | 0.875rem | Secondary text
  - xs      | 0.75rem  | Captions, labels
```

### Line Heights
- Headlines: 1.2 (tight)
- Body: 1.6 (comfortable reading)
- Captions: 1.4

---

## Component Design Patterns

### Cards
```
- Rounded corners: 0.75rem (rounded-lg) to 1rem (rounded-xl)
- Shadow: sm (hover:lg) - subtle elevation
- Padding: 1rem (p-4) to 1.5rem (p-6)
- Border: 1px solid #E5E5E5 (optional)
- Spacing: 1.5rem (gap-6) between cards
```

### Buttons
```
Primary Button:
  - Background: Sage Green (#88B47F)
  - Text: White
  - Padding: 0.5rem 1rem (py-2 px-4)
  - Rounded: 0.5rem (rounded-lg)
  - Hover: opacity-90

Secondary Button:
  - Background: Cream Sand (#F9F6EF)
  - Text: Charcoal Gray (#2C2C2C)
  - Padding: 0.5rem 1rem (py-2 px-4)
  - Rounded: 0.5rem (rounded-lg)
  - Hover: bg-gray-200

Icon Button:
  - Size: 1rem to 1.5rem (16-24px)
  - Rounded: full (rounded-full)
  - Padding: 0.5rem (p-2)
  - Background: transparent or cream on hover
```

### Input Fields
```
- Border: 1px solid #E5E5E5
- Background: Cream Sand (#F9F6EF) for search, white for forms
- Padding: 0.75rem 1rem (py-3 px-4)
- Rounded: full for search (rounded-full), lg for text inputs
- Focus: border-sage ring-2 ring-opacity-20
- Placeholder: Light Gray (#9A9A9A)
```

### Badges
```
- Padding: 0.25rem 0.75rem (py-1 px-3)
- Rounded: full (rounded-full)
- Font: 12px semi-bold
- Colors:
  - Default: Saffron background, charcoal text
  - Status: Based on status colors
```

---

## Layout Patterns

### Hero Section
```
- Background: Gradient (sage to cream to saffron)
- Padding: 2rem to 4rem vertical
- Typography: 3xl to 5xl headline
- Max-width: 50rem (max-w-2xl)
- Center aligned
```

### Search Bar (Pill Style)
```
- Background: Cream Sand
- Padding: 0.75rem 1rem
- Rounded: full (pill-shaped)
- Border: none
- Shadow: sm with hover:md
- Icon: Left-aligned
- Placeholder: Light Gray
- Width: Full or contained (max-width: 50rem)
```

### Grid Layout
```
Mobile:   1 column
Tablet:   2 columns (md:grid-cols-2)
Desktop:  3-4 columns (lg:grid-cols-3 or lg:grid-cols-4)
Gap:      1.5rem (gap-6)
```

### Navigation (Mobile Bottom)
```
- Position: Fixed bottom
- Height: 5rem (h-20)
- Background: White
- Border: Top 1px solid #E5E5E5
- Shadow: Elevated (shadow-lg)
- Safe area: Padding bottom env(safe-area-inset-bottom)
- 5 equally-spaced tab items
- Active indicator: Text color sage
```

---

## Animation & Transitions

### Micro-interactions
```
Duration:        200-300ms (standard)
                 400-500ms (longer sequences)
Easing:          ease-out (natural deceleration)

Types:
- Fade In:       opacity 0 → 1 (300ms)
- Slide Up:      translateY(10px) → 0 + fade (400ms)
- Slide In:      translateX(-10px) → 0 + fade (300ms)
- Scale Hover:   scale(1) → scale(1.05) (300ms)
```

### CSS Keyframes (Tailwind)
```css
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes slideUp {
  0% { transform: translateY(10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes slideIn {
  0% { transform: translateX(-10px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}
```

---

## Spacing System

### Base Unit: 0.25rem (4px)
```
0:    0
1:    0.25rem (4px)
2:    0.5rem (8px)
3:    0.75rem (12px)
4:    1rem (16px)          ← Base padding
6:    1.5rem (24px)        ← Card spacing
8:    2rem (32px)          ← Section spacing
12:   3rem (48px)          ← Major section spacing
16:   4rem (64px)          ← Page sections
```

---

## Accessibility Guidelines

### Color Contrast
- Text on backgrounds: Minimum 4.5:1 (WCAG AA)
- Charcoal on white: ✓ 11:1
- Sage on white: ✓ 5.5:1
- Light gray on white: ⚠ 3.5:1 (avoid for body text)

### Interactive Elements
- Minimum touch target: 44x44px (accessibility standard)
- Focus states: Visible outline or ring
- Hover states: Visual feedback (color/scale change)

### Typography
- Line length: 50-75 characters (optimal readability)
- Line height: 1.6 for body (comfortable reading)
- Font size: Minimum 16px for readable text

---

## Icons

### Style
- Lucide Vue Next icons
- Consistent 24px size for navigation
- 16-20px for inline/inline text
- Rounded, minimalist style matching Airbnb aesthetic

### Usage
```
Navigation:     24px, solid fill where active
Interactive:    20px, outlined by default
Status:         20-24px, colored by status
Decorative:     16-20px, light gray
```

### Common Icons
```
Home            | Map.svg
Explore/Map     | MapPin.svg
Favorites       | Heart.svg
Messages        | MessageCircle.svg
Profile         | User.svg
Search          | Search.svg
Phone           | Phone.svg
Email           | Mail.svg
Location        | MapPin.svg
Star            | Star.svg
Settings        | Settings.svg
Menu            | Menu.svg
Close           | X.svg
```

---

## Responsive Design

### Breakpoints (Tailwind defaults)
```
sm:    640px   - Tablets (portrait)
md:    768px   - Tablets (landscape)
lg:    1024px  - Desktops
xl:    1280px  - Large desktops
2xl:   1536px  - Extra large desktops
```

### Mobile-First Approach
1. Design for mobile (default)
2. Add md: for tablet enhancements
3. Add lg: for desktop layouts
4. Use hidden/block utilities for responsive visibility

### Safe Areas (PWA/Native)
```
Top:    padding-top: env(safe-area-inset-top)
Bottom: padding-bottom: max(1rem, env(safe-area-inset-bottom))
Left:   padding-left: env(safe-area-inset-left)
Right:  padding-right: env(safe-area-inset-right)
```

---

## Dark Mode (Future)

When implementing dark mode:
```
White           → #1A1A1A
Cream           → #2D2D2D
Charcoal        → #E0E0E0
Light Gray      → #A0A0A0
Sage (adjusted) → #A8C99F
Saffron         → #FFD96F
```

---

## Best Practices

### 1. Consistency
- Use the color palette consistently
- Maintain uniform spacing
- Apply animations uniformly

### 2. Performance
- Minimize animations on low-end devices
- Use CSS animations over JS
- Optimize images for web

### 3. Usability
- Ensure clear call-to-action buttons
- Provide visual feedback for interactions
- Use progressive disclosure for complex information

### 4. Spiritual Design
- Maintain calm, peaceful color scheme
- Avoid aggressive, flashy elements
- Use whitespace generously
- Let content breathe

### 5. Mobile-First
- Touch-friendly sizing (min 44x44px)
- Readable font sizes (min 16px)
- Easy-to-tap buttons and links
- Bottom navigation for single-hand use

---

## Implementation Checklist

- [ ] Color variables defined in Tailwind config
- [ ] Font families imported from Google Fonts
- [ ] Icon library installed (Lucide Vue Next)
- [ ] Animation keyframes configured
- [ ] Spacing system documented
- [ ] Responsive breakpoints tested
- [ ] Accessibility tested (WCAG AA)
- [ ] Dark mode variants prepared
- [ ] Components follow design patterns
- [ ] Animations tested on performance

