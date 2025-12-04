#!/usr/bin/env node

/**
 * Reset script to clear all bookings and ratings from localStorage
 */

// This is a helper script - actual clearing will be done through browser console
console.log(`
╔════════════════════════════════════════════════════════════════╗
║                  DATA RESET INSTRUCTIONS                      ║
╚════════════════════════════════════════════════════════════════╝

To reset all bookings and ratings, run this in your browser console:

localStorage.removeItem('dharamshala_bookings');
localStorage.removeItem('dharamshala_stays');
localStorage.removeItem('dharamshala_favorites');
location.reload();

Or copy-paste this command:

JSON.stringify({
  actions: [
    'localStorage.removeItem("dharamshala_bookings")',
    'localStorage.removeItem("dharamshala_stays")',
    'localStorage.removeItem("dharamshala_favorites")',
    'location.reload()'
  ]
})

Keys that will be cleared:
- dharamshala_bookings (all room bookings)
- dharamshala_stays (all stay records and ratings)
- dharamshala_favorites (favorite dharamshalas)
`);
