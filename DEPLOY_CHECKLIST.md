# Deployment Checklist ✅

Quick checklist for deploying to Netlify.

## Pre-Deployment

- [ ] Code is working locally (`npm start`)
- [ ] Build succeeds (`npm run build`)
- [ ] All changes committed to Git
- [ ] Pushed to GitHub (`git push origin main`)

## Netlify Setup (One-Time)

- [ ] Create Netlify account at [netlify.com](https://app.netlify.com/)
- [ ] Connect GitHub account
- [ ] Import repository
- [ ] Verify build settings:
  - Build command: `npm run build`
  - Publish directory: `build`
  - Node version: 18

## Optional: Environment Variables

For better security (recommended but not required since defaults are set):

- [ ] Go to Site settings → Environment variables
- [ ] Add Firebase configuration variables:
  ```
  REACT_APP_FIREBASE_API_KEY
  REACT_APP_FIREBASE_AUTH_DOMAIN
  REACT_APP_FIREBASE_PROJECT_ID
  REACT_APP_FIREBASE_STORAGE_BUCKET
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID
  REACT_APP_FIREBASE_APP_ID
  ```
- [ ] Trigger redeploy if added after initial deploy

## Post-Deployment Testing

- [ ] Visit Netlify URL (provided in dashboard)
- [ ] Test event dropdown loads
- [ ] Test car selection works
- [ ] Test seat booking works
- [ ] Test seat cancellation works
- [ ] Check browser console for errors
- [ ] Test on mobile device

## Firebase Console

- [ ] Add Netlify domain to Firebase authorized domains:
  - Go to Authentication → Settings → Authorized domains
  - Add `your-site-name.netlify.app`

## Optional: Custom Domain

- [ ] Purchase/own a domain
- [ ] Add custom domain in Netlify
- [ ] Update DNS records as instructed
- [ ] Wait for SSL certificate (automatic)
- [ ] Add custom domain to Firebase authorized domains

## Continuous Deployment (Automatic)

Now every time you push to GitHub:
1. Git push triggers Netlify build
2. Netlify builds your app
3. Deploys automatically
4. Live in ~2 minutes

## Quick Commands

```bash
# Local testing
npm start

# Build test
npm run build

# Commit and push
git add .
git commit -m "Your message"
git push origin main

# Netlify deploys automatically!
```

## Troubleshooting

### Build fails on Netlify?
- Check deploy logs in Netlify dashboard
- Ensure all dependencies in `package.json`
- Verify Node version matches

### 404 on page refresh?
- Check `netlify.toml` is committed
- Check `public/_redirects` is committed

### Firebase errors?
- Verify Firebase config in `src/firebase.js`
- Check Firestore is enabled
- Verify authorized domains

## Done! 🎉

Your app is live at: `https://your-site-name.netlify.app`

Share it with your team!

