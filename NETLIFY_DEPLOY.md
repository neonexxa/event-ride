# Netlify Deployment Guide

Complete guide to deploy your Carpool Seat Selection app to Netlify.

## Prerequisites

- ✅ Code pushed to GitHub
- ✅ Netlify account (free tier is fine)
- ✅ Firebase project configured and running

## Deployment Steps

### Step 1: Connect Repository to Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub account
5. Select your repository: `carpool-to-events`

### Step 2: Configure Build Settings

Netlify should auto-detect the settings from `netlify.toml`, but verify:

- **Base directory**: (leave empty)
- **Build command**: `npm run build`
- **Publish directory**: `build`
- **Node version**: 18

Click **"Deploy site"**

### Step 3: Set Environment Variables (Optional but Recommended)

For better security, set Firebase config as environment variables:

1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add these variables:

```
REACT_APP_FIREBASE_API_KEY = AIzaSyDp2cj2WgrInNEnCdqknzEkG_En6xVyTUQ
REACT_APP_FIREBASE_AUTH_DOMAIN = awesomeproject-cd995.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL = https://awesomeproject-cd995-default-rtdb.asia-southeast1.firebasedatabase.app
REACT_APP_FIREBASE_PROJECT_ID = awesomeproject-cd995
REACT_APP_FIREBASE_STORAGE_BUCKET = awesomeproject-cd995.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID = 103763816586
REACT_APP_FIREBASE_APP_ID = 1:103763816586:web:0ac98718fff8a6ab247d73
REACT_APP_FIREBASE_MEASUREMENT_ID = G-XFLGWLHCZS
```

4. Click **"Redeploy"** → **"Trigger deploy"**

**Note**: Environment variables provide an extra layer of security and make it easier to use different Firebase projects for staging/production.

### Step 4: Configure Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `carpool.airasia.com`)
4. Follow the DNS configuration instructions
5. Wait for SSL certificate to be provisioned (automatic)

## Post-Deployment

### Update Firestore Security Rules

Add your Netlify domain to authorized domains:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Netlify domain:
   - `your-site-name.netlify.app`
   - Your custom domain (if configured)

### Test Your Deployment

Visit your Netlify URL and test:
- ✅ Event dropdown loads
- ✅ Cars display when event selected
- ✅ Can book a seat
- ✅ Seat shows as occupied
- ✅ Can cancel booking

## Configuration Files

### netlify.toml

Located in project root. Configures:
- Build command and publish directory
- SPA redirects (all routes → index.html)
- Security headers
- Cache settings for static assets

### public/_redirects

Backup redirect configuration. Ensures React Router works properly.

## Continuous Deployment

Now that your site is connected to GitHub:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update features"
   git push origin main
   ```

2. **Netlify auto-deploys** (usually takes 1-2 minutes)

3. **Check deployment status** in Netlify dashboard

## Common Issues & Solutions

### Issue: Build Fails

**Solution**: Check the build log in Netlify dashboard. Common causes:
- Missing dependencies: Run `npm install` locally first
- Environment variables not set
- Node version mismatch

### Issue: Page refreshes show 404

**Solution**: Verify `netlify.toml` and `public/_redirects` exist and are committed to Git.

### Issue: Firebase connection fails

**Solution**: 
1. Check environment variables are set correctly
2. Verify Firebase project is active
3. Check browser console for specific errors

### Issue: Slow initial load

**Solution**: 
- Firebase SDK is loaded from CDN (normal delay)
- Consider adding a loading screen
- Implement code splitting for large apps

## Deployment Workflow Comparison

### Netlify (Current)
```
GitHub push → Netlify detects → Auto-build → Auto-deploy → Live
```
- ✅ Automatic deployments
- ✅ Preview deployments for PRs
- ✅ Free SSL certificates
- ✅ CDN included
- ✅ Easy rollbacks

### App Engine (Previous)
```
npm build → gcloud deploy → Manual upload → Live
```
- ❌ Manual deployment
- ✅ Google Cloud integration
- ✅ Scales automatically
- ✅ Custom domains

## Advanced Features

### Deploy Previews

Every pull request gets its own preview URL:
1. Create a branch: `git checkout -b feature/new-ui`
2. Push changes: `git push origin feature/new-ui`
3. Open PR on GitHub
4. Netlify creates preview deployment
5. Test on preview URL before merging

### Split Testing

Deploy multiple versions and split traffic:
1. Go to **Deploys** → **Split testing**
2. Choose deployments to test
3. Set traffic percentage
4. Monitor analytics

### Webhooks

Trigger rebuilds on external events:
1. Go to **Site settings** → **Build & deploy** → **Build hooks**
2. Create a new hook
3. Use the webhook URL to trigger builds

### Environment-Specific Builds

Use different Firebase projects for staging/production:

**For Staging**:
1. Create new site on Netlify
2. Connect to `staging` branch
3. Set staging Firebase credentials

**For Production**:
1. Use main site
2. Connect to `main` branch
3. Set production Firebase credentials

## Monitoring & Analytics

### Netlify Analytics
- **Site settings** → **Analytics**
- View page views, bandwidth, and performance
- Track deploy frequency

### Firebase Analytics
- Add Firebase Analytics to track user behavior
- Monitor Firestore read/write operations
- Set up budget alerts

### Error Tracking
Consider adding:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Google Analytics** for user analytics

## Performance Optimization

### Current Setup
- ✅ Static asset caching (1 year)
- ✅ Brotli compression
- ✅ HTTP/2 enabled
- ✅ Global CDN

### Future Improvements
- Add service worker for offline support
- Implement lazy loading for routes
- Optimize images (use WebP)
- Add performance monitoring

## Security

### Current Security Headers
```
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### Additional Security
- Use environment variables for sensitive data
- Keep dependencies updated: `npm audit fix`
- Review Firestore security rules regularly
- Enable 2FA on Netlify account

## Cost

### Netlify Free Tier
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Unlimited sites
- ✅ Automatic SSL

**Your app**: Likely stays within free tier
- Static files: ~2MB
- Average bandwidth: Depends on users
- Build time: ~2-3 minutes per deploy

### When to Upgrade
- More than 100GB bandwidth/month
- More than 300 build minutes/month
- Need team collaboration features
- Want more concurrent builds

## Support

### Netlify Resources
- [Netlify Docs](https://docs.netlify.com/)
- [Community Forum](https://answers.netlify.com/)
- [Status Page](https://www.netlifystatus.com/)

### Quick Links
- **Site Dashboard**: `https://app.netlify.com/sites/YOUR-SITE-NAME`
- **Deploy Logs**: Dashboard → Deploys → Latest deploy
- **Environment Vars**: Dashboard → Site settings → Environment variables

## Rollback Procedure

If something goes wrong:

1. Go to **Deploys**
2. Find the last working deployment
3. Click **"⋯"** → **"Publish deploy"**
4. Confirm rollback

Your site reverts to that version immediately.

## Next Steps

After successful deployment:

1. ✅ Test all features on production URL
2. ✅ Set up custom domain (optional)
3. ✅ Configure monitoring/analytics
4. ✅ Share URL with team
5. ✅ Document any environment-specific configs
6. ✅ Set up staging environment (optional)

## Quick Reference

```bash
# Local development
npm start                 # Dev server on port 3000

# Test build locally
npm run build            # Create production build
npx serve -s build       # Test build locally

# Deploy (automatic)
git push origin main     # Netlify auto-deploys

# Check deployment
# Visit Netlify dashboard or your URL
```

## Troubleshooting Checklist

Before reaching out for help:

- [ ] Check Netlify deploy logs
- [ ] Verify all environment variables are set
- [ ] Test build locally: `npm run build`
- [ ] Clear browser cache and test
- [ ] Check Firebase Console for errors
- [ ] Review Firestore security rules
- [ ] Check browser console for errors

## Success! 🎉

Your carpool app is now live on Netlify with:
- ✅ Automatic deployments on Git push
- ✅ Global CDN delivery
- ✅ Free SSL certificate
- ✅ Preview deployments for PRs
- ✅ Easy rollback capability

Share your live URL with your team! 🚀

