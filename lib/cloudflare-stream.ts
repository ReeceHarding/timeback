// Cloudflare Stream video management utilities
// This file handles uploading videos to Cloudflare Stream and getting playback URLs

interface StreamVideoMetadata {
  uid: string;
  thumbnail: string;
  playback: {
    hls: string;
    dash: string;
  };
  duration: number;
  status: {
    state: 'ready' | 'processing' | 'error';
    pctComplete: number;
  };
}

/**
 * Upload a video to Cloudflare Stream via URL
 * This is useful for migrating existing videos from public folder
 */
export async function uploadVideoFromUrl(
  videoUrl: string,
  metadata?: { name?: string; requireSignedURLs?: boolean }
): Promise<StreamVideoMetadata> {
  const apiToken = process.env.CLOUDFLARE_STREAM_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

  if (!apiToken || !accountId) {
    throw new Error('Missing Cloudflare Stream credentials in environment variables');
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/copy`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: videoUrl,
        meta: metadata,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to upload video: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result;
}

/**
 * Get the Cloudflare Stream URL for a video
 * Use this in your components instead of local video paths
 */
export function getStreamVideoUrl(videoId: string, format: 'hls' | 'thumbnail' = 'hls'): string {
  const customerSubdomain = process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN;
  
  if (!customerSubdomain) {
    console.warn('Missing NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN');
    return '';
  }

  if (format === 'thumbnail') {
    return `https://${customerSubdomain}.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg`;
  }

  // Return HLS manifest URL for adaptive bitrate streaming
  return `https://${customerSubdomain}.cloudflarestream.com/${videoId}/manifest/video.m3u8`;
}

/**
 * Video ID mapping for your current videos
 * After uploading to Cloudflare Stream, update these IDs
 */
export const VIDEO_IDS = {
  trimmedIntro: '58ef7fad00bc439c97e9eecbd5df4f10',
  learningScience: 'ba54db52baa14399965d55553ee3db40',
  IntroToTB: '28fbc4ff4ba44a6aadc4444167f8b9b9',
  IntroToLearningApps: '2909dc54ad15416a93e6f8bd8d568af6',
  bloom2sig: 'd9a2589b04104ad78d725b1075a9ea0f',
} as const;

/**
 * Check if we should use Cloudflare Stream (production) or local videos (development)
 */
export function shouldUseStream(): boolean {
  return process.env.NODE_ENV === 'production' && 
    !!process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN;
} 