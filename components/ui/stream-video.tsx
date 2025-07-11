'use client';

import { useEffect, useRef, useState } from 'react';
import { getStreamVideoUrl, shouldUseStream, VIDEO_IDS } from '@/lib/cloudflare-stream';

interface StreamVideoProps {
  videoKey: keyof typeof VIDEO_IDS;
  localPath: string; // Fallback for development
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onError?: (error: any) => void;
}

export function StreamVideo({
  videoKey,
  localPath,
  className = '',
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
  poster,
  onLoadStart,
  onCanPlay,
  onError,
}: StreamVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const useStream = shouldUseStream();
    const videoId = VIDEO_IDS[videoKey];

    // Log video loading details
    console.log(`[StreamVideo ${new Date().toISOString()}] Loading video:`, {
      videoKey,
      useStream,
      videoId,
      localPath
    });

    // Use local video in development or if Stream is not configured
    if (!useStream) {
      console.log(`[StreamVideo ${new Date().toISOString()}] Using local video:`, localPath);
      video.src = localPath;
      return;
    }

    // Use Cloudflare Stream in production
    const streamUrl = getStreamVideoUrl(videoId);
    console.log(`[StreamVideo ${new Date().toISOString()}] Using Cloudflare Stream:`, streamUrl);

    // Check if browser supports HLS natively (Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      console.log(`[StreamVideo ${new Date().toISOString()}] Native HLS support detected`);
      video.src = streamUrl;
    } else {
      // Use HLS.js for browsers without native HLS support
      console.log(`[StreamVideo ${new Date().toISOString()}] Loading HLS.js...`);
      
      import('hls.js').then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          console.log(`[StreamVideo ${new Date().toISOString()}] HLS.js loaded successfully`);
          
          const hls = new Hls({
            // Optimized settings for faster loading
            maxBufferLength: 30,
            maxMaxBufferLength: 600,
            maxBufferSize: 60 * 1000 * 1000, // 60 MB
            maxBufferHole: 0.5,
            lowLatencyMode: true,
            progressive: true,
          });

          hlsRef.current = hls;

          // Track loading events
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log(`[StreamVideo ${new Date().toISOString()}] HLS manifest parsed`);
          });

          hls.on(Hls.Events.LEVEL_LOADED, (_event: any, data: any) => {
            console.log(`[StreamVideo ${new Date().toISOString()}] HLS level loaded:`, {
              level: data.level,
              duration: data.details.totalduration
            });
          });

          hls.on(Hls.Events.ERROR, (_event: any, data: any) => {
            console.error(`[StreamVideo ${new Date().toISOString()}] HLS error:`, data);
            
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.log(`[StreamVideo ${new Date().toISOString()}] Fatal network error, trying to recover...`);
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.log(`[StreamVideo ${new Date().toISOString()}] Fatal media error, trying to recover...`);
                  hls.recoverMediaError();
                  break;
                default:
                  console.error(`[StreamVideo ${new Date().toISOString()}] Fatal error, cannot recover`);
                  setError('Video playback error');
                  onError?.(data);
                  hls.destroy();
                  break;
              }
            }
          });

          hls.loadSource(streamUrl);
          hls.attachMedia(video);
        } else {
          console.error(`[StreamVideo ${new Date().toISOString()}] HLS.js not supported in this browser`);
          setError('Video format not supported in this browser');
        }
      }).catch(err => {
        console.error(`[StreamVideo ${new Date().toISOString()}] Failed to load HLS.js:`, err);
        setError('Failed to load video player');
      });
    }

    // Cleanup
    return () => {
      if (hlsRef.current) {
        console.log(`[StreamVideo ${new Date().toISOString()}] Cleaning up HLS.js`);
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoKey, localPath, onError]);

  const handleLoadStart = () => {
    console.log(`[StreamVideo ${new Date().toISOString()}] Video load started`);
    setIsLoading(true);
    onLoadStart?.();
  };

  const handleCanPlay = () => {
    console.log(`[StreamVideo ${new Date().toISOString()}] Video can play`);
    setIsLoading(false);
    setError(null);
    onCanPlay?.();
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    const errorCode = video.error?.code;
    const errorMessage = video.error?.message || 'Unknown error';
    
    // Only log if there's actual error information
    if (errorCode || errorMessage !== 'Unknown error') {
      console.error(`[StreamVideo ${new Date().toISOString()}] Video error:`, {
        code: errorCode,
        message: errorMessage,
        src: video.src
      });
    }
    
    setError('Failed to load video');
    setIsLoading(false);
    onError?.(e);
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
          <div className="text-white text-sm">Loading video...</div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg">
          <div className="text-red-400 text-sm">{error}</div>
        </div>
      )}
      
      <video
        ref={videoRef}
        className="w-full h-full rounded-lg"
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        poster={poster}
        playsInline
        preload="metadata"
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
      />
    </div>
  );
} 