# Video Serving Setup with Cloudflare Stream

This guide explains how to set up efficient video serving for your Vercel deployment using Cloudflare Stream.

## Why Cloudflare Stream?

- **Cost-effective**: $5/1000 minutes stored + $1/1000 minutes delivered
- **Global CDN**: 330+ data centers worldwide for fast delivery
- **Automatic optimization**: Adaptive bitrate streaming (HLS)
- **No bandwidth fees**: All included in the delivery price
- **Handles high traffic**: Built for scale

## Setup Steps

### 1. Create Cloudflare Stream Account

1. Sign up for a [Cloudflare account](https://dash.cloudflare.com/sign-up)
2. Go to the Stream section in your dashboard
3. Enable Cloudflare Stream (billing required)
4. Note your Account ID from the right sidebar

### 2. Generate API Token

1. Go to My Profile → API Tokens
2. Click "Create Token"
3. Use "Custom token" template with these permissions:
   - **Account** → Cloudflare Stream:Edit
   - **Zone** → Zone:Read (optional, for custom domains)
4. Save the token securely

### 3. Configure Environment Variables

Create `.env.local` in your project root:

```bash
# Cloudflare Stream Configuration
NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN=customer-xxxxx
CLOUDFLARE_STREAM_API_TOKEN=your_api_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
```

The customer subdomain can be found in Stream → Settings.

### 4. Upload Videos to Stream

#### Option A: Using the Migration Script (Recommended)

1. Make sure your dev server is running locally
2. Run the migration script:

```bash
node scripts/migrate-videos-to-stream.js
```

3. The script will upload all videos and output the video IDs
4. Update `lib/cloudflare-stream.ts` with the provided IDs

#### Option B: Manual Upload via Dashboard

1. Go to Stream in your Cloudflare dashboard
2. Click "Upload video" 
3. Upload each video file
4. Copy the video ID from the video details
5. Update `lib/cloudflare-stream.ts` with the IDs

### 5. Update Video IDs

After uploading, update the VIDEO_IDS in `lib/cloudflare-stream.ts`:

```typescript
export const VIDEO_IDS = {
  trimmedIntro: 'abc123...', // Replace with actual ID
  learningScience: 'def456...', // Replace with actual ID
  IntroToTB: 'ghi789...', // Replace with actual ID
  IntroToLearningApps: 'jkl012...', // Replace with actual ID
  bloom2sig: 'mno345...', // Replace with actual ID
} as const;
```

### 6. Deploy to Vercel

1. Add environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all three Cloudflare Stream variables
   - Deploy your project

## How It Works

The `StreamVideo` component automatically:
- Uses local videos in development (faster iteration)
- Uses Cloudflare Stream in production (better performance)
- Implements HLS.js for adaptive bitrate streaming
- Handles loading states and errors gracefully
- Provides detailed logging for debugging

## Video Performance Tips

1. **Preload Strategy**: Videos use `preload="metadata"` to load faster
2. **Adaptive Bitrate**: Stream automatically adjusts quality based on connection
3. **Global CDN**: Videos are cached at edge locations worldwide
4. **Progressive Enhancement**: Falls back gracefully if HLS isn't supported

## Monitoring Usage

Check your usage in the Cloudflare dashboard:
- **Stream** → Analytics for delivery metrics
- **Billing** → Usage for storage and delivery costs

## Troubleshooting

### Videos not playing in production?
1. Check browser console for errors
2. Verify VIDEO_IDS are correct
3. Ensure environment variables are set in Vercel
4. Check Cloudflare Stream dashboard for video status

### Slow loading?
1. Videos are encoded on first upload (takes a few minutes)
2. First play might be slower (CDN warming up)
3. Subsequent plays will be faster (cached at edge)

### Need custom domain?
You can use a custom domain for video delivery:
1. Add a CNAME record pointing to your Stream subdomain
2. Configure in Stream settings
3. Update the subdomain in your environment variables 