"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (data: string) => Promise<{ success: boolean; message: string }>;
  onError: (error: string) => void;
}

type ScannerState = 'idle' | 'scanning' | 'processing' | 'success' | 'error';

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const [scannerState, setScannerState] = useState<ScannerState>('idle');
  const [isMobile, setIsMobile] = useState(false);
  const [resultMessage, setResultMessage] = useState<string>('');
  const [shouldInitScanner, setShouldInitScanner] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

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
      if (document.hidden && scannerRef.current) {
        // Stop scanner when page becomes hidden (user navigates away)
        scannerRef.current.stop().catch(() => {});
        setScannerState('idle');
        setShouldInitScanner(false);
      }
    };

    const handleBeforeUnload = () => {
      if (scannerRef.current) {
        // Stop scanner when user is about to leave the page
        scannerRef.current.stop().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  // Effect to initialize scanner when state changes to 'scanning'
  useEffect(() => {
    if (scannerState !== 'scanning' || !shouldInitScanner) return;

    const initScanner = async () => {
      try {
        console.log('Initializing HTML5 QR Scanner...');

        // Wait for DOM to be ready
        await new Promise(resolve => setTimeout(resolve, 100));

        // Verify element exists
        if (!document.getElementById("qr-reader")) {
          throw new Error("QR reader element not found in DOM");
        }

        // Create new scanner instance
        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" }, // back camera
          { fps: 10, qrbox: 250 },       // scan settings
          async (decodedText) => {
            console.log('QR Code detected:', decodedText);

            // Immediately set to processing to prevent double scans
            setScannerState('processing');
            setShouldInitScanner(false);

            // Stop the scanner immediately
            try {
              await scanner.stop();
              await scanner.clear();
            } catch {
              console.log('Error stopping scanner');
            }

            // Process the check-in
            const result = await onScan(decodedText);

            if (result.success) {
              setScannerState('success');
              setResultMessage(result.message);
            } else {
              setScannerState('error');
              setResultMessage(result.message);
            }
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
        setScannerState('idle');
        setShouldInitScanner(false);
      }
    };

    initScanner();
  }, [scannerState, shouldInitScanner, onScan, onError]);

  const startScanning = async () => {
    console.log('Starting HTML5 QR Scanner...');

    // If there's an existing scanner, try to clear it first
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
        scannerRef.current = null;
      } catch {
        console.log('Clearing previous scanner instance');
      }
    }

    // Set state to trigger scanner initialization in useEffect
    setResultMessage('');
    setScannerState('scanning');
    setShouldInitScanner(true);
  };

  const stopScanning = async () => {
    if (!scannerRef.current) return;

    try {
      console.log('Stopping HTML5 QR Scanner...');
      await scannerRef.current.stop();
      await scannerRef.current.clear();
      scannerRef.current = null;
      setScannerState('idle');
      setResultMessage('');
      setShouldInitScanner(false);
    } catch (err) {
      console.error("Unable to stop scanning:", err);
    }
  };


  return (
    <div className="space-y-4">
      {/* Idle State - Ready to scan */}
      {scannerState === 'idle' && (
        <div className="text-center">
          <Button onClick={startScanning} className="w-full py-3 text-base touch-manipulation">
            📱 Bật Camera để Quét QR
          </Button>

          {isMobile && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                📱 <strong>Thiết bị di động được phát hiện</strong><br/>
                Hãy cho phép truy cập camera khi được hỏi
              </p>
            </div>
          )}
        </div>
      )}

      {/* Scanning State - Camera is active */}
      {scannerState === 'scanning' && (
        <div className="space-y-4">
          {/* Scanner container */}
          <div id="qr-reader" style={{ width: "100%" }} />

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              📷 Đặt mã QR vào khung hình để quét
            </p>
            <Button onClick={stopScanning} variant="outline" className="py-2 px-4 touch-manipulation">
              Dừng quét
            </Button>
          </div>
        </div>
      )}

      {/* Processing State - Validating QR code */}
      {scannerState === 'processing' && (
        <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-lg font-semibold text-yellow-800">Đang xử lý...</p>
          <p className="text-sm text-yellow-600 mt-2">Vui lòng đợi trong giây lát</p>
        </div>
      )}

      {/* Success State - Check-in successful */}
      {scannerState === 'success' && (
        <div className="text-center p-8 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-xl font-bold text-green-800 mb-2">Check-in thành công!</p>
          <p className="text-sm text-green-600 mb-6">{resultMessage}</p>
          <Button
            onClick={startScanning}
            className="w-full py-3 text-base touch-manipulation bg-green-600 hover:bg-green-700"
          >
            ✨ Quét mã QR tiếp theo
          </Button>
        </div>
      )}

      {/* Error State - Check-in failed */}
      {scannerState === 'error' && (
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl font-bold text-red-800 mb-2">Check-in thất bại</p>
          <p className="text-sm text-red-600 mb-6">{resultMessage}</p>
          <Button
            onClick={startScanning}
            className="w-full py-3 text-base touch-manipulation"
          >
            🔄 Thử lại
          </Button>
        </div>
      )}

    </div>
  );
}