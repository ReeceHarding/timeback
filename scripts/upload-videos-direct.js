#!/usr/bin/env node

// Script to upload videos directly to Cloudflare Stream
// Run with: node scripts/upload-videos-direct.js

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const https = require('https');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const API_TOKEN = process.env.CLOUDFLARE_STREAM_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

if (!API_TOKEN || !ACCOUNT_ID) {
  console.error('❌ Missing CLOUDFLARE_STREAM_API_TOKEN or CLOUDFLARE_ACCOUNT_ID in .env.local');
  process.exit(1);
}

// Videos to upload
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

async function uploadVideoDirect(video) {
  console.log(`\n📤 Uploading ${video.filename}...`);
  
  const videoPath = path.join(__dirname, '..', 'public', 'videos', video.filename);
  
  // Check if file exists
  if (!fs.existsSync(videoPath)) {
    console.error(`❌ File not found: ${videoPath}`);
    return null;
  }
  
  const fileStats = fs.statSync(videoPath);
  console.log(`   File size: ${(fileStats.size / 1024 / 1024).toFixed(2)} MB`);
  
  // First, initiate the upload with TUS protocol
  return new Promise((resolve, reject) => {
    const tusEndpoint = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream`;
    
    // Step 1: Initiate upload
    const options = {
      method: 'POST',
      hostname: 'api.cloudflare.com',
      path: `/client/v4/accounts/${ACCOUNT_ID}/stream`,
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Tus-Resumable': '1.0.0',
        'Upload-Length': fileStats.size,
        'Upload-Metadata': `name ${Buffer.from(video.name).toString('base64')}`
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 201 && res.headers.location) {
          const uploadUrl = res.headers.location;
          const videoId = res.headers['stream-media-id'];
          
          console.log(`✅ Upload initiated for ${video.filename}`);
          console.log(`   Video ID: ${videoId}`);
          console.log(`   Upload URL: ${uploadUrl}`);
          
          // For large files, you would need to implement chunked upload here
          // For now, we'll just return the video ID
          // The video will be in "processing" state until fully uploaded
          
          resolve({
            ...video,
            videoId: videoId,
            uploadUrl: uploadUrl,
            status: 'initiated'
          });
        } else {
          console.error(`❌ Failed to initiate upload: ${res.statusCode}`);
          console.error(`   Response: ${data}`);
          resolve(null);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`❌ Request error:`, error);
      resolve(null);
    });
    
    req.end();
  });
}

// Alternative: Use direct upload via form data (simpler but less reliable for large files)
async function uploadVideoViaForm(video) {
  console.log(`\n📤 Uploading ${video.filename} via direct upload...`);
  
  const videoPath = path.join(__dirname, '..', 'public', 'videos', video.filename);
  
  // Check if file exists
  if (!fs.existsSync(videoPath)) {
    console.error(`❌ File not found: ${videoPath}`);
    return null;
  }
  
  const fileStats = fs.statSync(videoPath);
  console.log(`   File size: ${(fileStats.size / 1024 / 1024).toFixed(2)} MB`);
  
  try {
    // Create form data
    const form = new FormData();
    form.append('file', fs.createReadStream(videoPath));
    form.append('meta', JSON.stringify({ name: video.name }));
    
    // Get form headers
    const formHeaders = form.getHeaders();
    
    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        hostname: 'api.cloudflare.com',
        path: `/client/v4/accounts/${ACCOUNT_ID}/stream`,
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          ...formHeaders
        }
      };
      
      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', chunk => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            
            if (result.success && result.result) {
              console.log(`✅ Successfully uploaded ${video.filename}`);
              console.log(`   Video ID: ${result.result.uid}`);
              console.log(`   Status: ${result.result.status?.state || 'processing'}`);
              
              resolve({
                ...video,
                videoId: result.result.uid,
                status: result.result.status?.state || 'processing'
              });
            } else {
              console.error(`❌ Upload failed:`, result.errors || data);
              resolve(null);
            }
          } catch (error) {
            console.error(`❌ Failed to parse response:`, error);
            console.error(`   Raw response:`, data);
            resolve(null);
          }
        });
      });
      
      req.on('error', (error) => {
        console.error(`❌ Request error:`, error);
        resolve(null);
      });
      
      // Pipe the form data to the request
      form.pipe(req);
    });
  } catch (error) {
    console.error(`❌ Failed to upload ${video.filename}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🎬 Starting direct video upload to Cloudflare Stream...\n');
  console.log(`📁 Account ID: ${ACCOUNT_ID}`);
  
  const results = [];
  
  for (const video of videos) {
    // Try form upload (simpler method)
    const result = await uploadVideoViaForm(video);
    if (result) {
      results.push(result);
    }
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log('\n\n📋 Upload Summary:');
  console.log('====================\n');
  
  if (results.length > 0) {
    console.log('Update your lib/cloudflare-stream.ts VIDEO_IDS with these values:\n');
    console.log('export const VIDEO_IDS = {');
    results.forEach(result => {
      console.log(`  ${result.key}: '${result.videoId}',`);
    });
    console.log('} as const;\n');
    
    console.log('\n✅ Successfully uploaded', results.length, 'out of', videos.length, 'videos');
    console.log('\n⏳ Note: Videos may still be processing. Check your Cloudflare Stream dashboard.');
  } else {
    console.log('❌ No videos were successfully uploaded');
  }
}

// Run the upload
main().catch(console.error); 