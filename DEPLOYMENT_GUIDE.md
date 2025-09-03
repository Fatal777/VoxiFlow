# VoxiFlow Vercel Deployment Guide

## 🚀 Step 1: Deploy to Vercel

1. **Connect your repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your VoxiFlow repository from GitHub

2. **Configure build settings:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add environment variables in Vercel dashboard:**
   ```
   REACT_APP_SUPABASE_URL=https://aywcvmlnhfsbrxojmcso.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5d2N2bWxuaGZzYnJ4b2ptY3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4ODU3MTIsImV4cCI6MjA3MjQ2MTcxMn0.DAEngKjljHQ8ptbmpdrxbKoeWA126FReaPCwwQeeuDI
   REACT_APP_SCALEKIT_ENVIRONMENT_URL=https://voxiflow.scalekit.dev
   REACT_APP_SCALEKIT_CLIENT_ID=skc_88553148733458692
   REACT_APP_SCALEKIT_CLIENT_SECRET=test_RVMi6NRtngR4pAw7alPFPCsSHrTOgjRStbr4naBQvn8bPXWmVB7wwDnw8AOt07zH
   ```

4. **Deploy and get your Vercel URL:**
   - After deployment, you'll get a URL like: `https://voxiflow-xyz123.vercel.app`

## 🔐 Step 2: Configure Google OAuth in Supabase

### Google Cloud Console Setup:

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**

2. **Create/Select a project:**
   - Create new project: "VoxiFlow"
   - Enable Google+ API

3. **Create OAuth 2.0 credentials:**
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "VoxiFlow Web App"

4. **Configure authorized URLs:**
   ```
   Authorized JavaScript origins:
   - https://YOUR_VERCEL_APP.vercel.app
   - https://aywcvmlnhfsbrxojmcso.supabase.co
   
   Authorized redirect URIs:
   - https://aywcvmlnhfsbrxojmcso.supabase.co/auth/v1/callback
   - https://YOUR_VERCEL_APP.vercel.app/auth/callback
   ```

5. **Copy your credentials:**
   - Client ID: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
   - Client Secret: `GOCSPX-abcdefghijklmnopqrstuvwxyz`

### Supabase Configuration:

1. **Go to your Supabase dashboard:**
   - Navigate to Authentication > Providers
   - Enable Google provider

2. **Add Google OAuth credentials:**
   ```
   Client ID: 123456789-abcdefghijklmnop.apps.googleusercontent.com
   Client Secret: GOCSPX-abcdefghijklmnopqrstuvwxyz
   ```

3. **Callback URL (already configured):**
   ```
   https://aywcvmlnhfsbrxojmcso.supabase.co/auth/v1/callback
   ```

## 🔐 Step 3: Configure GitHub OAuth in Supabase

### GitHub OAuth App Setup:

1. **Go to GitHub Settings:**
   - Settings > Developer settings > OAuth Apps
   - Click "New OAuth App"

2. **Configure OAuth App:**
   ```
   Application name: VoxiFlow
   Homepage URL: https://YOUR_VERCEL_APP.vercel.app
   Authorization callback URL: https://aywcvmlnhfsbrxojmcso.supabase.co/auth/v1/callback
   ```

3. **Copy credentials:**
   - Client ID: `Iv1.abcdefghijklmnop`
   - Client Secret: `abcdefghijklmnopqrstuvwxyz1234567890abcdef`

### Supabase GitHub Configuration:

1. **Enable GitHub provider in Supabase:**
   - Authentication > Providers > GitHub
   - Enable the provider

2. **Add GitHub credentials:**
   ```
   Client ID: Iv1.abcdefghijklmnop
   Client Secret: abcdefghijklmnopqrstuvwxyz1234567890abcdef
   ```

## 🔐 Step 4: Update ScaleKit Configuration

1. **Go to ScaleKit Dashboard:**
   - Navigate to your VoxiFlow environment
   - Update redirect URIs:
   ```
   - https://YOUR_VERCEL_APP.vercel.app/auth/callback
   - https://YOUR_VERCEL_APP.vercel.app/
   ```

## ✅ Step 5: Test Your Deployment

1. **Visit your Vercel app:**
   - `https://YOUR_VERCEL_APP.vercel.app`

2. **Test authentication flows:**
   - Google OAuth login
   - GitHub OAuth login  
   - ScaleKit SSO login
   - Email/password signup

3. **Verify database connection:**
   - Check if user profiles are created in Supabase
   - Test profile updates and settings

## 🛠️ Troubleshooting

### Common Issues:

1. **OAuth redirect mismatch:**
   - Ensure all callback URLs match exactly
   - Check for trailing slashes

2. **Environment variables not loading:**
   - Verify all env vars are set in Vercel dashboard
   - Redeploy after adding new variables

3. **CORS issues:**
   - Check Supabase CORS settings
   - Verify domain is whitelisted

4. **Build failures:**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in package.json

## 📝 Replace Placeholders

**Before deploying, replace these placeholders:**

1. `YOUR_VERCEL_APP` → Your actual Vercel app name
2. `123456789-abcdefghijklmnop.apps.googleusercontent.com` → Your Google Client ID
3. `GOCSPX-abcdefghijklmnopqrstuvwxyz` → Your Google Client Secret
4. `Iv1.abcdefghijklmnop` → Your GitHub Client ID
5. `abcdefghijklmnopqrstuvwxyz1234567890abcdef` → Your GitHub Client Secret

## 🎉 Success!

Once configured, your VoxiFlow app will be live on Vercel with full OAuth authentication working across Google, GitHub, and ScaleKit providers!
