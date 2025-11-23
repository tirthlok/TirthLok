# Mobile Testing Quick Reference

## How to Test Mobile Responsiveness

### Method 1: Browser DevTools (Recommended for Quick Testing)
1. Open http://localhost:3000 in your browser
2. Press `F12` or `Ctrl+Shift+I` (Windows) to open DevTools
3. Click the mobile device icon in the top-left corner
4. Select a device preset (iPhone 12, iPad, etc.) or drag to resize
5. Refresh the page to see responsive design in action

### Method 2: Manual Breakpoint Testing
1. Resize your browser window to these widths:
   - **320px**: iPhone SE (test minimum width)
   - **640px**: Tablet portrait (test sm: breakpoint)
   - **768px**: Tablet landscape (test md: breakpoint)
   - **1024px**: iPad/Small laptop (test lg: breakpoint)
   - **1280px+**: Desktop monitor (test xl: breakpoint)

### Method 3: Device Testing
1. Find your machine's local IP address
2. In terminal: `ipconfig getifaddr en0` (Mac) or use network settings
3. On mobile device, visit: `http://<your-ip>:3000`
4. Test on actual devices (iPhone, Android, iPad)

## Pages to Test

### 1. Home Page (`/`)
**Desktop**: 
- Hero section displays full width
- 3-4 column temple grid
- Horizontal filters visible

**Mobile**: 
- Hero text stacks nicely
- 1 column temple grid
- Filters stack vertically
- Search bar is full width
- Bottom nav doesn't cover cards

### 2. Temple Detail (`/tirth/[id]`)
**Desktop**: 
- Tabs visible side-by-side
- Multiple columns for related temples

**Mobile**: 
- Tabs scroll horizontally if needed
- Related temples in 1 column
- Back button is prominent
- Proper touch spacing on buttons

### 3. Favorites (`/favorites`)
**Desktop**: 
- 3-4 column grid

**Mobile**: 
- 1-2 column grid
- Counter updates properly
- Empty state is clear

### 4. Admin (`/admin`)
**Desktop**: 
- 4 stat cards in a row
- Full table with all columns visible

**Mobile**: 
- 2x2 stat card grid
- Table scrolls horizontally
- Some columns hide
- Add button is full width

## Responsive Classes Reference

### Grid Layouts
```
1 column (mobile):     grid-cols-1
1→2 columns:           sm:grid-cols-2
1→2→3 columns:         lg:grid-cols-3
1→2→3→4 columns:       xl:grid-cols-4
```

### Padding
```
Mobile:  px-4 (16px)
Tablet:  sm:px-6 (24px)
Desktop: lg:px-8 (32px)
```

### Text Size
```
Mobile heading:  text-3xl
Tablet heading:  sm:text-4xl
Desktop heading: md:text-5xl
Large desktop:   lg:text-6xl
```

### Visibility
```
Show only on mobile:     visible (default)
Hide on mobile:          hidden
Show on tablet+:         sm:block
Hide on tablet+:         sm:hidden
Hide on mobile/tablet:   hidden md:table-cell
```

## Common Issues to Check

### ✅ Touch Targets
- All buttons should be at least 44x44px
- Tappable elements have proper spacing
- No overlapping touch areas

### ✅ Text Readability
- No text smaller than 12px on mobile
- Proper line-height for mobile text
- Good color contrast (WCAG AA)
- No text overflow

### ✅ Layout
- No horizontal scrolling at intended breakpoints
- Images scale with container
- Proper spacing between elements
- Bottom nav accessible

### ✅ Forms
- Input fields are full width on mobile
- Clear labels above inputs
- Submit button is large and easily tappable
- Error messages are visible

### ✅ Navigation
- Bottom navigation bar visible
- All 5 tabs are clickable
- Active state indicator works
- No content hidden behind nav

## Performance Metrics to Monitor

Open DevTools → Lighthouse → Mobile to check:
- ✅ Performance (target: 90+)
- ✅ Accessibility (target: 95+)
- ✅ Best Practices (target: 90+)
- ✅ SEO (target: 90+)

## Debugging Mobile Issues

### Issue: Content Overlaps Navigation
**Solution**: Check `pb-32 md:pb-12` padding on pages

### Issue: Text Too Small
**Solution**: Look for missing responsive sizing (should have `sm:` prefix)

### Issue: Grid Wrong Columns
**Solution**: Verify `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` classes

### Issue: Buttons Not Clickable
**Solution**: Ensure buttons have minimum `px-4 py-2` padding

### Issue: Table Unreadable on Mobile
**Solution**: Check for `overflow-x-auto` wrapper and `hidden sm:table-cell` classes

## Browser DevTools Tips

1. **Throttle Network**: Test with "Fast 3G" to simulate real mobile
2. **Disable Cache**: Prevents seeing cached desktop version
3. **Emulate Touch**: Simulates touch events more accurately
4. **Device Orientation**: Toggle between portrait/landscape

## Quick Refresh

If changes don't appear:
1. Soft refresh: `Ctrl+R` (Windows) or `Cmd+R` (Mac)
2. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Clear cache: DevTools → Settings → Clear Site Data

## Testing Checklist

- [ ] Mobile home page loads without scrolling
- [ ] Temple cards are properly sized
- [ ] Search bar is functional
- [ ] Filters work on mobile
- [ ] Detail page tabs are accessible
- [ ] Images load and display correctly
- [ ] Bottom navigation is always visible
- [ ] Favorites page works
- [ ] Admin stats are readable
- [ ] Forms are usable on mobile
- [ ] No console errors
- [ ] All colors match design system
- [ ] Typography is consistent
- [ ] Touch targets are adequate

---

**Server Status**: ✅ Running on http://localhost:3000

Ready to test! 🚀
