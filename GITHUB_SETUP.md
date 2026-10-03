# GitHub Actions Setup Guide

This document explains how to configure the GitHub repository for correct Supabase environment routing.

## Problem: Wrong Supabase Environment

When building from the **main branch**, GitHub Actions must use **production** Supabase credentials. If it's using development credentials instead, the GitHub Environments are not configured.

## Solution: Create GitHub Environments

The workflows use [GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) to manage secrets per branch:

### 1. Create the `production` Environment

Go to **Settings → Environments → New environment** and create:

**Name:** `production`

**Secrets:**
- `VITE_SUPABASE_URL` = `https://wpdalidqkfsizgdvdbqi.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = *(your production Supabase anon key)*

**Deployment branches (optional):** Restrict to `main` only for safety

### 2. Create the `development` Environment

**Name:** `development`

**Secrets:**
- `VITE_SUPABASE_URL` = `https://uwlhnvlwfvwwaodfryda.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = *(your development Supabase anon key)*

### 3. Verify Configuration

The workflows automatically route based on branch:

```yaml
environment: ${{ github.ref_name == 'main' && 'production' || 'development' }}
```

- **main branch** → uses `production` environment → prod Supabase secrets
- **any other branch** → uses `development` environment → dev Supabase secrets

## How to Find Your Supabase Keys

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Public Key** → `VITE_SUPABASE_ANON_KEY`

## Testing the Setup

After configuring environments:

1. **Test development environment:** Push to a feature branch and watch GitHub Actions
2. **Test production environment:** Push to main and watch GitHub Actions

Both should now:
- Pass the "Verify Supabase secrets are set" step
- Show the correct URL in the "Write env file" step

## Troubleshooting

### Main branch still using dev Supabase?

The most common issue is that the **production environment has dev Supabase credentials**.

**Fix:**

1. Go to **Settings → Environments → production**
2. Click on `VITE_SUPABASE_URL` secret
3. Verify it says: `https://wpdalidqkfsizgdvdbqi.supabase.co` (prod, not dev)
4. If it says `https://uwlhnvlwfvwwaodfryda.supabase.co`, update it to the production URL
5. Re-run the GitHub Actions workflow

**Quick check:** Look at the GitHub Actions logs for the "Write env file" step:
- Should say `Environment: PRODUCTION (branch: main)`
- Should say `Supabase URL: https://wpdalidqkfsizgdvdbqi.supabase.co`
- If it shows `uwlhnvlwfvwwaodfryda`, the production environment has wrong credentials

### Other issues

1. **Check environment exists:** Settings → Environments → Verify both `production` and `development` are listed
2. **Verify secrets are set:** Click each environment → Verify secrets exist and aren't empty
3. **Re-run workflow:** GitHub Actions → Select workflow → Re-run failed job
4. **Check workflow logs:** Look for exact error messages in build output

## Additional Secrets for Release Build

The `android-release.yml` workflow also requires these **repository secrets** (not environment secrets):

- `ANDROID_KEYSTORE_BASE64` — base64 of your upload-keystore.jks
- `ANDROID_KEYSTORE_PASSWORD` — keystore password
- `ANDROID_KEY_ALIAS` — key alias (e.g., "upload")
- `ANDROID_KEY_PASSWORD` — key password
- `GOOGLE_SERVICES_JSON_BASE64` — base64 of android/app/google-services.json

See the workflow file header for more details.
