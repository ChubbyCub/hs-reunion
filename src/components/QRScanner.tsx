"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import jsQR from 'jsqr';

interface QRScannerProps {
  onScan: (data: string) => void;
  onError: (error: string) => void;
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Check if device supports camera
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasPermission(false);
      onError('Camera not supported on this device');
      return;
    }
    setHasPermission(true);
  }, [onError]);

  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data for QR detection
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // Try to decode QR code
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {

      onScan(code.data);
      stopScanning();
      return;
    }

    // Continue scanning
    animationFrameRef.current = requestAnimationFrame(scanFrame);
  }, [isScanning, onScan]);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        
        // Start scanning frames
        videoRef.current.addEventListener('loadedmetadata', () => {
          scanFrame();
        });
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      onError('Unable to access camera. Please check permissions.');
    }
  };

  const stopScanning = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
  };

  const handleManualInput = () => {
    const input = prompt('Enter QR code data manually:');
    if (input) {
      onScan(input);
    }
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  if (hasPermission === false) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600 mb-4">Camera access denied</p>
        <Button onClick={handleManualInput} variant="outline">
          Enter Manually
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!isScanning ? (
        <div className="text-center">
          <Button onClick={startScanning} className="w-full">
            📱 Start Camera Scanner
          </Button>
          <Button 
            onClick={handleManualInput} 
            variant="outline" 
            className="w-full mt-2"
          >
            ⌨️ Enter QR Data Manually
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full h-64 object-cover rounded-lg border"
              autoPlay
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className="hidden"
            />
            <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-blue-500 rounded-lg">
                {/* Scanning overlay */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Position QR code within the frame
            </p>
            <Button onClick={stopScanning} variant="outline">
              Stop Scanner
            </Button>
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-500 text-center">
        <p>💡 Tip: For testing, you can manually enter the QR data</p>
        <p>📱 Best viewed on mobile devices</p>
        <p>🔍 Scanner will automatically detect QR codes</p>
      </div>
    </div>
  );
}
