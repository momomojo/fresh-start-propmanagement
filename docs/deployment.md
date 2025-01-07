# Deployment Guide

## Prerequisites

1. Node.js v20 or higher
2. npm v9 or higher
3. Firebase CLI
4. GitHub account with repository access
5. Firebase project with Firestore and Authentication enabled
6. GitHub Secrets configured (see [GitHub Secrets Setup Guide](./github-secrets-setup.md))

## Environment Setup

1. Create environment files:

```bash
# .env.development
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
VITE_SENTRY_DSN=xxx

# .env.production
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
VITE_SENTRY_DSN=xxx
```

2. Configure GitHub Secrets:
   - Follow the [GitHub Secrets Setup Guide](./github-secrets-setup.md) to configure all required secrets
   - Ensure all secrets are properly set before running the CI/CD pipeline

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Run tests:

```bash
npm run test
```

4. Build locally:

```bash
npm run build
```

## CI/CD Pipeline

The project uses GitHub Actions for CI/CD. The pipeline includes:

1. Build and Test:
   - Type checking
   - Linting
   - Unit tests
   - Build verification

2. Deployment:
   - Automatic deployment to Firebase Hosting
   - Environment variable injection
   - Firebase configuration

### GitHub Actions Configuration

The workflow is defined in `.github/workflows/ci.yml` and uses environment secrets configured according to the [GitHub Secrets Setup Guide](./github-secrets-setup.md).

## Manual Deployment

If needed, you can deploy manually:

1. Build the project:

```bash
npm run build
```

2. Deploy to Firebase:

```bash
firebase deploy
```

## Firebase Setup

1. Initialize Firebase:

```bash
firebase init
```

2. Select required services:
   - Firestore
   - Hosting
   - Storage
   - Authentication

3. Deploy Firebase Security Rules:

```bash
firebase deploy --only firestore:rules
```

## Monitoring Setup

1. Configure Sentry:
   - Add DSN to environment variables
   - Set up error tracking
   - Configure performance monitoring

2. Monitor deployment:
   - Check Sentry for errors
   - Review Firebase Console
   - Monitor CI/CD pipeline

## Rollback Procedure

If issues are detected after deployment:

1. Revert to previous version:

```bash
firebase hosting:clone <PROJECT_ID>:live <PROJECT_ID>:live --version=<VERSION_NUMBER>
```

2. Check Firebase Console for successful rollback

3. Monitor error rates in Sentry

## Security Checklist

Before deploying to production:

1. Environment Variables:
   - All sensitive values in GitHub Secrets
   - Production environment variables set
   - No development values in production

2. Firebase Security:
   - Security rules deployed
   - Authentication configured
   - Storage rules set

3. Application Security:
   - CSP headers configured
   - CORS settings correct
   - Rate limiting enabled

## Performance Optimization

1. Before deployment:
   - Run lighthouse audit
   - Check bundle size
   - Optimize images
   - Enable code splitting

2. After deployment:
   - Monitor page load times
   - Check API response times
   - Review performance metrics

## Troubleshooting

Common issues and solutions:

1. Build Failures:
   - Check Node.js version
   - Clear npm cache
   - Remove node_modules and reinstall

2. Deployment Failures:
   - Verify GitHub secrets are correctly set
   - Check Firebase token
   - Review deployment logs

3. Runtime Errors:
   - Check Sentry dashboard
   - Review Firebase logs
   - Monitor error rates

## Maintenance

Regular maintenance tasks:

1. Weekly:
   - Review error logs
   - Check performance metrics
   - Update dependencies

2. Monthly:
   - Security audit
   - Database optimization
   - Backup verification

3. Quarterly:
   - Major dependency updates
   - Performance review
   - Security assessment

## Contact

For deployment issues:

1. Development Team: <dev@propmanagement.com>
2. DevOps Team: <devops@propmanagement.com>
3. Security Team: <security@propmanagement.com>
