#!/usr/bin/env node

// Script to migrate videos from public/videos to Cloudflare Stream
// Run with: node scripts/migrate-videos-to-stream.js

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const API_TOKEN = process.env.CLOUDFLARE_STREAM_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

if (!API_TOKEN || !ACCOUNT_ID) {
  console.error('❌ Missing CLOUDFLARE_STREAM_API_TOKEN or CLOUDFLARE_ACCOUNT_ID in .env.local');
  process.exit(1);
}

// Videos to migrate
const videos = [
  { 
    key: 'trimmedIntro',
    filename: 'trimmedIntro.mp4',
    name: 'TimeBack Introduction Video'
  },
  { 
    key: 'learningScience',
    filename: 'learningScience.mp4',
    name: 'Learning Science - 2 Sigma Discovery'
  },
  { 
    key: 'IntroToTB',
    filename: 'IntroToTB.mp4',
    name: 'Introduction to TimeBack'
  },
  { 
    key: 'IntroToLearningApps',
    filename: 'IntroToLearningApps.mp4',
    name: 'Introduction to Learning Apps'
  },
  { 
    key: 'bloom2sig',
    filename: 'bloom2sig.mp4',
    name: 'Bloom 2 Sigma'
  }
];

async function uploadVideo(video) {
  console.log(`\n📤 Uploading ${video.filename}...`);
  
  // For production deployment, you'll need to use your actual production URL
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3002'; // Update port if different
  
  const videoUrl = `${baseUrl}/videos/${video.filename}`;
  
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream/copy`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: videoUrl,
          meta: {
            name: video.name
          },
          // Optional: require signed URLs for additional security
          // requireSignedURLs: true
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Successfully uploaded ${video.filename}`);
      console.log(`   Video ID: ${data.result.uid}`);
      console.log(`   Status: ${data.result.status.state}`);
      return {
        ...video,
        videoId: data.result.uid,
        status: data.result.status.state
      };
    } else {
      throw new Error(`API returned success=false: ${JSON.stringify(data.errors)}`);
    }
  } catch (error) {
    console.error(`❌ Failed to upload ${video.filename}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🎬 Starting video migration to Cloudflare Stream...\n');
  console.log(`📁 Account ID: ${ACCOUNT_ID}`);
  console.log(`🌐 Base URL: ${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3002'}`);
  
  const results = [];
  
  for (const video of videos) {
    const result = await uploadVideo(video);
    if (result) {
      results.push(result);
    }
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n\n📋 Migration Summary:');
  console.log('====================\n');
  
  if (results.length > 0) {
    console.log('Update your lib/cloudflare-stream.ts VIDEO_IDS with these values:\n');
    console.log('export const VIDEO_IDS = {');
    results.forEach(result => {
      console.log(`  ${result.key}: '${result.videoId}',`);
    });
    console.log('} as const;\n');
    
    console.log('\n✅ Successfully migrated', results.length, 'out of', videos.length, 'videos');
  } else {
    console.log('❌ No videos were successfully migrated');
  }
}

// Run the migration
main().catch(console.error); 