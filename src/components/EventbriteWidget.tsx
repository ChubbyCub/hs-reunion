"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface EventbriteWidgetProps {
  eventId: string;
  eventTitle?: string;
  eventDate?: string;
  eventLocation?: string;
  onTicketPurchase?: () => void;
  onError?: (error: string) => void;
  onRegistrationComplete?: () => void;
}

export function EventbriteWidget({
  eventId,
  eventTitle = "Buổi họp mặt cựu học sinh",
  eventDate = "[NGÀY]",
  eventLocation = "[ĐỊA ĐIỂM]",
  onTicketPurchase,
  onError,
  onRegistrationComplete
}: EventbriteWidgetProps) {
  const [ready, setReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const createdRef = useRef(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // HTTPS guard for localhost only
  useEffect(() => {
    if (
      window.location.protocol === "http:" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1")
    ) {
      setHasError(true);
      onError?.(
        "Widget Eventbrite yêu cầu HTTPS để hoạt động. Vui lòng dùng production domain hoặc mở trực tiếp trang Eventbrite."
      );
    }
  }, [onError]);

  // Load the Eventbrite script exactly once
  useEffect(() => {
    if (hasError) return;

    const markReady = () => setReady(true);

    if (window.EBWidgets) {
      markReady();
      return;
    }

    // Reuse if already injected
    const existing = document.getElementById(
      "eventbrite-widgets-script"
    ) as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener("load", markReady, { once: true });
      existing.addEventListener("error", () => {
        setHasError(true);
        onError?.("Không thể tải script Eventbrite.");
      }, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = "eventbrite-widgets-script";
    script.src = "https://www.eventbrite.com/static/widgets/eb_widgets.js";
    script.async = true;
    script.onload = markReady;
    script.onerror = () => {
      setHasError(true);
      onError?.("Không thể tải script Eventbrite.");
    };
    document.head.appendChild(script);
  }, [hasError, onError]);

  // Create the widget once the script AND the button exist
  useEffect(() => {
    if (hasError) return;
    if (!ready) return;
    if (!buttonRef.current) return;
    if (createdRef.current) return;
    if (!window.EBWidgets) return;

    try {
      window.EBWidgets.createWidget({
        widgetType: "checkout",
        eventId,
        modal: true,
        modalTriggerElementId: "eventbrite-widget-trigger",
        onOrderComplete: () => {
          onTicketPurchase?.();
          onRegistrationComplete?.();
        },
      });
      createdRef.current = true; // avoid duplicate binding in Strict Mode/dev
    } catch {
      setHasError(true);
      onError?.("Không thể tạo widget Eventbrite.");
    }
  }, [ready, eventId, onTicketPurchase, hasError, onRegistrationComplete]);

  if (hasError) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800 mb-4">Không thể tải widget Eventbrite</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="text-red-700 border-red-300 hover:bg-red-50"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg border">
      <h2 className="text-lg font-semibold mb-3">{eventTitle}</h2>
      <div className="text-gray-600 mb-4 space-y-2">
        <p>📅 Ngày: {eventDate}</p>
        <p>📍 Địa điểm: {eventLocation}</p>
      </div>

      <div className="text-center">
        <Button
          id="eventbrite-widget-trigger"
          ref={buttonRef}
          type="button"
          disabled={!ready}
          className="font-form bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg disabled:opacity-50"
        >
          🎫 Đặt vé
        </Button>
        {!ready && (
          <p className="text-sm text-gray-500 mt-2">Đang tải widget…</p>
        )}
      </div>
    </div>
  );
}

