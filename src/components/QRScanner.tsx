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

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => {
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

  const handleManualInput = () => {
    const input = prompt('Enter QR code data manually:');
    if (input) {
      onScan(input);
    }
  };

  return (
    <div className="space-y-4">
      {!scanning ? (
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