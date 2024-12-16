# Setting Up GitHub Secrets

This guide explains how to set up the required secrets in your GitHub repository for the CI/CD pipeline.

## Required Secrets

### 1. Firebase Configuration Secrets

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

### 2. Firebase Service Account Secret

```
VITE_FIREBASE_SERVICE_ACCOUNT
```

### 3. Sentry Configuration Secrets

```
VITE_SENTRY_DSN
VITE_SENTRY_AUTH_TOKEN
VITE_SENTRY_ORG
VITE_SENTRY_PROJECT
VITE_RELEASE_VERSION
```

## Setup Instructions

### Firebase Configuration

1. Navigate to Firebase Console:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to Project Settings > General
   - Under "Your apps", find your web app configuration
   - Copy each value to its corresponding GitHub secret

### Firebase Service Account Setup

1. Get Service Account JSON:
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save the downloaded JSON file
   - Copy the entire contents

2. Add Service Account to GitHub Secrets:
   - Name: `VITE_FIREBASE_SERVICE_ACCOUNT`
   - Value: The entire JSON content from the service account file

### Sentry Configuration

1. Get Sentry DSN:
   - Log in to [Sentry](https://sentry.io)
   - Navigate to Settings > Projects > [Your Project]
   - Go to Client Keys (DSN)
   - Copy the DSN value

2. Get Sentry Auth Token:
   - Go to Settings > Account > API > Auth Tokens
   - Create a new token with the following scopes:
     - project:read
     - project:write
     - org:read
     - release:write
   - Copy the generated token

3. Get Sentry Organization and Project:
   - Organization slug is in your Sentry URL: sentry.io/organizations/[org-name]
   - Project slug is in Settings > Projects > [Project Name]

4. Set Release Version:
   - Use your application version (e.g., "1.0.0")
   - Or use a dynamic value in CI/CD (e.g., git commit hash)

## GitHub Repository Setup

1. Navigate to GitHub Repository Settings:
   - Go to your repository on GitHub
   - Click on "Settings" tab
   - In the left sidebar, click on "Secrets and variables"
   - Select "Actions"

2. Create Environment:
   - Click on "Environments"
   - Click "New environment"
   - Name it "production"
   - Click "Configure environment"

3. Adding Environment Secrets:
   - Click "Add secret"
   - For each secret listed above:
     1. Enter the secret name exactly as shown
     2. Enter the corresponding value
     3. Click "Add secret"

## Environment Configuration

The CI/CD pipeline uses a "production" environment with the following configuration:

1. Environment Protection Rules:
   - Required reviewers: None (optional)
   - Wait timer: None (optional)
   - Deployment branches: main

2. Environment Variables:
   - All secrets are scoped to the production environment
   - Secrets are only available to workflows running on the main branch

## Verification

After adding all secrets:

1. The secrets should appear in your GitHub repository's environment secrets list (values will be hidden)
2. The CI/CD pipeline warnings about invalid context access will disappear
3. The workflow will be able to access these secrets during execution
4. Sentry source maps will be properly uploaded during deployment

To verify the setup:

1. Go to your repository's Actions tab
2. Check the latest workflow run
3. Verify no secret-related errors appear in the logs
4. Confirm all jobs complete successfully
5. Check Sentry for proper error tracking and source maps

## Security Notes

- Never commit these values directly to your repository
- Don't share or expose these secrets
- Regularly rotate the Firebase service account key
- Review access to these secrets periodically
- Environment secrets are only available to protected branches
- Rotate Sentry auth tokens periodically

## Troubleshooting

If you encounter issues:

1. Verify secret names match exactly (case-sensitive)
2. Ensure Firebase service account JSON is valid
3. Check that all required secrets are present
4. Verify the secrets are accessible to the workflow
5. Confirm the environment is properly configured
6. Check Sentry DSN format is correct (should start with https://)
7. Verify Sentry auth token has correct scopes

Common Issues:

- Invalid JSON format in Firebase service account
- Missing or malformed Sentry DSN
- Incorrect secret names (must include VITE_ prefix)
- Environment not properly configured in workflow
- Insufficient Sentry token permissions

For additional help, contact the development team at <dev@propmanagement.com>
