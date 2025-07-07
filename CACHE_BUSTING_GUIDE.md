# Cache Busting & Update Management Guide

This guide explains how the PathTracker app ensures users always get the latest version through an advanced cache busting and update management system.

## Overview

The app uses a multi-layered approach to ensure users receive updates:

1. **Dynamic Service Worker Versioning** - Each build gets a unique cache name
2. **Network-First Strategy** - HTML and API responses are fetched from network first
3. **Automatic Update Detection** - Users are notified when new versions are available
4. **Smart Cache Management** - Old caches are automatically cleaned up

## How It Works

### 1. Version Management (`src/lib/version.ts`)

- Generates unique versions using timestamps
- Provides cache configuration constants
- Includes utility functions for version comparison

### 2. Service Worker (`public/sw.js`)

- Uses dynamic cache names with current timestamp
- Implements network-first strategy for HTML/API calls
- Automatically cleans up old caches on activation
- Notifies the app when updates are available

### 3. PWA Provider (`src/components/PWAProvider.tsx`)

- Registers service worker with update detection
- Listens for service worker messages
- Periodically checks for updates (every 30 minutes)
- Checks for updates when app becomes visible
- Handles update notifications and application

### 4. Update Notification (`src/components/UpdateNotification.tsx`)

- Beautiful, animated update prompt
- Shows version information
- Provides "Update Now" and "Later" options
- Prevents showing multiple times per session

## Deployment

### Automatic Version Setting

The build script automatically sets version environment variables:

```bash
npm run build
# This sets NEXT_PUBLIC_APP_VERSION to current timestamp
# and NEXT_PUBLIC_BUILD_TIME to current ISO date
```

### Manual Version Setting

For custom versioning:

```bash
NEXT_PUBLIC_APP_VERSION="1.2.3" npm run build
```

### Production Deployment

```bash
npm run build:production
```

## Configuration

### Cache Configuration

Modify cache settings in `src/lib/version.ts`:

```typescript
export const CACHE_CONFIG = {
  UPDATE_CHECK_INTERVAL: 30 * 60 * 1000, // 30 minutes
  VISIBILITY_CHECK_DELAY: 5000, // 5 seconds
  STATIC_ASSETS: 24 * 60 * 60, // 1 day
  // ... other settings
};
```

### Service Worker Headers

Cache control headers are set in `next.config.js`:

```javascript
{
  source: "/sw.js",
  headers: [
    {
      key: "Cache-Control",
      value: "public, max-age=0, must-revalidate, no-cache, no-store",
    },
  ],
}
```

## Update Flow

1. **User visits app** → Service worker checks for updates
2. **New version detected** → Service worker downloads new files
3. **Update ready** → User sees notification
4. **User clicks "Update Now"** → Page reloads with new version
5. **Old caches cleaned** → Disk space freed up

## Troubleshooting

### Users Not Getting Updates

1. **Check service worker registration**:

   ```javascript
   // In browser console
   navigator.serviceWorker.getRegistrations().then(console.log);
   ```

2. **Verify cache headers**:

   ```bash
   curl -I https://yourapp.com/sw.js
   # Should show Cache-Control: no-cache
   ```

3. **Force update**:
   ```javascript
   // In browser console
   navigator.serviceWorker.getRegistrations().then((registrations) => {
     registrations.forEach((reg) => reg.update());
   });
   ```

### Hard Refresh for Developers

```javascript
// Clear all caches and force update
caches
  .keys()
  .then((names) => {
    names.forEach((name) => caches.delete(name));
  })
  .then(() => location.reload(true));
```

## Browser Support

- ✅ Chrome 40+
- ✅ Firefox 44+
- ✅ Safari 11.1+
- ✅ Edge 17+
- ✅ Mobile browsers

## Environment Variables

- `NEXT_PUBLIC_APP_VERSION` - App version (auto-set during build)
- `NEXT_PUBLIC_BUILD_TIME` - Build timestamp (auto-set during build)

## Best Practices

1. **Always run `npm run build`** for production deployments
2. **Test updates** in development using Chrome DevTools → Application → Service Workers
3. **Monitor update adoption** using analytics
4. **Keep update messages** user-friendly and informative
5. **Don't force updates** unless critical security fixes

## Testing Updates

### Development Testing

1. Run `npm run dev`
2. Open Chrome DevTools → Application → Service Workers
3. Click "Update" to simulate new version
4. Verify update notification appears

### Production Testing

1. Deploy version A
2. Make changes and deploy version B
3. Visit app in browser
4. Should see update notification within 30 minutes

## Files Modified

- `public/sw.js` - Enhanced service worker with cache busting
- `src/components/PWAProvider.tsx` - Update detection and management
- `src/components/UpdateNotification.tsx` - User-friendly update UI
- `src/lib/version.ts` - Version management utilities
- `next.config.js` - Cache headers and build configuration
- `package.json` - Build scripts with automatic versioning

## Next Steps

Consider implementing:

- Update rollback mechanism
- A/B testing for updates
- Update scheduling (e.g., only show updates during off-peak hours)
- Analytics tracking for update adoption rates
- Push notifications for critical updates
