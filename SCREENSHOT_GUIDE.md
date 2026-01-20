# Screenshot Implementation Guide

## What Changed

Instead of blank gradient placeholders, your portfolio now displays **actual website screenshots** using a free screenshot API service.

## How It Works

### Screenshot Service
We're using **Screenshot Machine API** with a demo key:
```javascript
`https://api.screenshotmachine.com/?key=demo&url=${encodeURIComponent(productUrl)}&dimension=1280x720`
```

### Behavior:
1. **Carousel Cards:** Shows screenshot for inactive products, live iframe for active
2. **Masonry Gallery:** Shows screenshots with hover overlay
3. **Fallback:** If screenshot fails to load, shows gradient placeholder

## Important Notes

⚠️ **Demo Key Limitations:**
- The `key=demo` is for testing only
- Limited requests per day
- May show watermark
- Not for production use

## Production Solutions

### Option 1: Get Your Own Screenshot API Key (Recommended)

**Free Services:**
1. **Screenshot Machine** - https://screenshotmachine.com
   - Free tier: 100 screenshots/day
   - Premium: $9.99/month for unlimited
   
2. **ScreenshotAPI** - https://screenshotapi.net
   - Free tier: 100/month
   - Paid: From $9/month

3. **ApiFlash** - https://apiflash.com
   - Free tier: 100/month
   - Based on AWS Lambda, very fast

**To use:**
1. Sign up for an account
2. Get your API key
3. Replace `key=demo` with `key=YOUR_API_KEY` in the code
4. Or store in `.env`:
   ```env
   VITE_SCREENSHOT_API_KEY=your-key-here
   ```
5. Update code:
   ```javascript
   `https://api.screenshotmachine.com/?key=${import.meta.env.VITE_SCREENSHOT_API_KEY}&url=...`
   ```

### Option 2: Capture Screenshots Manually

Use the included script to capture screenshots of your products:

```bash
npm run capture-screenshots
```

This will:
1. Read your products from Firebase
2. Visit each URL with Puppeteer
3. Save screenshots to `public/thumbnails/`
4. Update product data with local screenshot paths

Then update the code to use local images:
```javascript
// In ShowcaseStage.jsx, replace the screenshot URL with:
src={product.thumbnail || `https://api.screenshotmachine.com/...`}
```

### Option 3: Manual Screenshot Capture

1. Visit each of your product URLs
2. Take a screenshot (Cmd+Shift+4 on Mac, Win+Shift+S on Windows)
3. Save to `public/thumbnails/` with a meaningful name
4. Update your product data in Firebase with the thumbnail path:
   ```javascript
   thumbnail: '/thumbnails/your-product-name.png'
   ```

## Current Implementation Details

### Carousel (ShowcaseStage.jsx lines ~318-356)
```javascript
{activeProduct.id === p.id ? (
  // Active: Show live iframe
  <iframe src={p.url} loading="lazy" />
) : (
  // Inactive: Show screenshot
  <img src={screenshotApiUrl} onError={fallbackToGradient} />
)}
```

### Masonry Gallery (lines ~491-556)
```javascript
<img src={screenshotApiUrl} loading="lazy" />
<div className="masonry-overlay">
  {/* Shows on hover */}
  <div>{product.name}</div>
  <div>CLICK TO VIEW LIVE</div>
</div>
```

## Performance Impact

✅ **Better than before:**
- Screenshots load much faster than iframes
- Only 2-3 iframes max (active product only)
- Images can be cached by browser
- Lazy loading for below-fold images

✅ **Visual improvements:**
- Users see actual website previews
- Professional appearance
- Hover effects show product info
- Fallback to gradient if screenshot fails

## Testing

With `npm run dev` running:
1. Open the app - you should see actual website screenshots in carousel
2. Scroll down to masonry gallery - hover to see overlay
3. Click any card - it becomes active and loads live

## Troubleshooting

**Screenshots not loading?**
- Demo key has rate limits - wait a few minutes
- Some URLs may be blocked by CORS
- Fallback gradient will show automatically

**Want better/faster screenshots?**
- Get your own API key (Option 1 above)
- Or capture locally (Option 2/3 above)

**Need help?**
- Check browser console for errors
- Ensure URLs are publicly accessible
- Test with a single product first

## Next Steps

1. **Test** the current implementation with demo key
2. **Decide** on production solution:
   - Get API key for automatic screenshots
   - OR capture screenshots manually
3. **Update** your products with better thumbnail URLs if needed

---

Current Status: ✅ **Screenshots working with demo API key**
Recommended: 🎯 **Get your own API key for production**
