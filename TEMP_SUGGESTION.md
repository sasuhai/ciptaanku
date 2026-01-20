# Quick Fix for Random Shuffle on Refresh

## The Issue
The `useMemo` is caching the random shuffle, so it doesn't change on page refresh.

## Solution
Replace lines 100-117 in ShowcaseStage.jsx with:

```javascript
// Helper function to shuffle array (Fisher-Yates)
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Sort products - use useMemo only for date mode, fresh shuffle for random
const sortedProducts = sortOrder === 'date' 
    ? React.useMemo(() => {
        return [...products].sort((a, b) => {
            const dateA = new Date(a.createdDate || '2026-01-01');
            const dateB = new Date(b.createdDate || '2026-01-01');
            return dateB - dateA;
        });
      }, [products])
    : shuffleArray(products); // Fresh shuffle on every render
```

This way:
- **Date mode**: Uses memoization (efficient, same order)
- **Random mode**: Calls `shuffleArray()` on EVERY render (new random order each time, including page refresh)
