"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (data: string) => void;
  onError: (error: string) => void;
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const [scanning, setScanning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(mobileCheck);
    console.log('Device detected as mobile:', mobileCheck);
    console.log('User agent:', navigator.userAgent);
  }, []);

  // Cleanup scanner on unmount and page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && html5QrCode) {
        // Stop scanner when page becomes hidden (user navigates away)
        html5QrCode.stop().catch(() => {});
        setScanning(false);
      }
    };

    const handleBeforeUnload = () => {
      if (html5QrCode) {
        // Stop scanner when user is about to leave the page
        html5QrCode.stop().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (html5QrCode) {
        html5QrCode.stop().catch(() => {});
      }
    };
  }, [html5QrCode]);

  const startScanning = async () => {
    try {
      console.log('Starting HTML5 QR Scanner...');
      
      // Set scanning state first to render the DOM element
      setScanning(true);
      
      // Wait for React to re-render and create the DOM element
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Now initialize scanner when DOM element exists
      const scanner = new Html5Qrcode("qr-reader");
      setHtml5QrCode(scanner);
      
      await scanner.start(
        { facingMode: "environment" }, // back camera
        { fps: 10, qrbox: 250 },       // scan settings
        async (decodedText) => {
          console.log('QR Code detected:', decodedText);
          onScan(decodedText);
          await stopScanning();
        },
        (errorMessage) => {
          // optional scan errors - ignore most of them as they're normal
          console.warn("Scan error:", errorMessage);
        }
      );
      console.log('HTML5 QR Scanner started successfully');
    } catch (err) {
      console.error("Unable to start scanning:", err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown scanner error';
      onError(`Failed to start scanner: ${errorMessage}`);
      // Reset scanning state on error
      setScanning(false);
    }
  };

  const stopScanning = async () => {
    if (!html5QrCode) return;

    try {
      console.log('Stopping HTML5 QR Scanner...');
      await html5QrCode.stop();
      setScanning(false);
    } catch (err) {
      console.error("Unable to stop scanning:", err);
    }
  };


  return (
    <div className="space-y-4">
      {!scanning ? (
        <div className="text-center">
          <Button onClick={startScanning} className="w-full py-3 text-base touch-manipulation">
            📱 Start Camera Scanner
          </Button>
          
          {isMobile && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                📱 <strong>Mobile Device Detected</strong><br/>
                Make sure to allow camera permissions when prompted<br/>
                Using HTML5-QR-Code library for better mobile support!
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Scanner container */}
          <div id="qr-reader" style={{ width: "100%" }} />
          
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Position QR code within the frame
            </p>
            <Button onClick={stopScanning} variant="outline" className="py-2 px-4 touch-manipulation">
              Stop Scanner
            </Button>
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-500 text-center">
        <p>📱 Best viewed on mobile devices</p>
        <p>🔍 Scanner will automatically detect QR codes</p>
        {isMobile && (
          <>
            <p>📷 Make sure to allow camera permissions when prompted</p>
            <p>✅ Using HTML5-QR-Code library for better mobile support</p>
          </>
        )}
      </div>
    </div>
  );
}