"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { eventbriteConfig } from "@/config/eventbrite";

interface EventbriteWidgetProps {
  eventId: string;
  eventTitle?: string;
  eventDate?: string;
  eventLocation?: string;
  onTicketPurchase?: () => void;
  onError?: (error: string) => void;
}

export function EventbriteWidget({
  eventId,
  eventTitle = "Buổi họp mặt cựu học sinh",
  eventDate = "[NGÀY]",
  eventLocation = "[ĐỊA ĐIỂM]",
  onTicketPurchase,
  onError
}: EventbriteWidgetProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;
    let timeoutId: NodeJS.Timeout;

    const loadWidget = () => {
      try {
        console.log('EventbriteWidget: Starting to load widget...');
        console.log('EventbriteWidget: Current protocol:', window.location.protocol);
        console.log('EventbriteWidget: Current hostname:', window.location.hostname);
        
        // Check if we're in development (HTTP) - Eventbrite requires HTTPS
        if (window.location.protocol === 'http:' && 
            (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
          console.log('EventbriteWidget: Detected local development, showing error');
          setIsLoading(false);
          setHasError(true);
          onError?.("Widget Eventbrite yêu cầu HTTPS để hoạt động. Vui lòng sử dụng môi trường production hoặc truy cập trực tiếp Eventbrite.");
          return;
        }

        console.log('EventbriteWidget: Production environment detected, loading widget...');
        console.log('EventbriteWidget: Event ID:', eventId);

        // Check if script is already loaded
        if (window.EBWidgets) {
          console.log('EventbriteWidget: EBWidgets already available, initializing...');
          initializeWidget();
          return;
        }

        console.log('EventbriteWidget: Loading Eventbrite script...');
        // Load Eventbrite widget script
        script = document.createElement('script');
        script.src = 'https://www.eventbrite.com/static/widgets/eb_widgets.js';
        script.async = true;
        
        script.onload = () => {
          console.log('EventbriteWidget: Script loaded successfully');
          setIsLoading(false);
          setWidgetLoaded(true);
          initializeWidget();
        };

        script.onerror = () => {
          console.error('EventbriteWidget: Script failed to load');
          setIsLoading(false);
          setHasError(true);
          onError?.("Không thể tải widget Eventbrite. Vui lòng thử lại sau.");
        };

        document.head.appendChild(script);

        // Set timeout for script loading
        timeoutId = setTimeout(() => {
          if (!window.EBWidgets) {
            setIsLoading(false);
            setHasError(true);
            onError?.("Widget Eventbrite tải quá lâu. Vui lòng thử lại sau.");
          }
        }, 10000); // 10 second timeout

      } catch {
        setIsLoading(false);
        setHasError(true);
        onError?.("Có lỗi xảy ra khi tải widget Eventbrite.");
      }
    };

    const initializeWidget = () => {
      try {
        console.log('EventbriteWidget: Initializing widget...');
        if (window.EBWidgets) {
          console.log('EventbriteWidget: Creating widget with config:', {
            widgetType: 'checkout',
            eventId: eventId,
            modal: eventbriteConfig.widget.modal,
            modalTriggerElementId: eventbriteConfig.widget.modalTriggerElementId
          });
          
          window.EBWidgets.createWidget({
            widgetType: 'checkout',
            eventId: eventId,
            modal: eventbriteConfig.widget.modal,
            modalTriggerElementId: eventbriteConfig.widget.modalTriggerElementId,
            onOrderComplete: () => {
              console.log('EventbriteWidget: Order completed successfully');
              onTicketPurchase?.();
            },
            onWidgetError: (error: { message?: string }) => {
              console.error('EventbriteWidget: Widget error:', error);
              setHasError(true);
              onError?.(`Widget error: ${error.message || 'Unknown error'}`);
            }
          });
          
          console.log('EventbriteWidget: Widget created successfully');
        } else {
          console.error('EventbriteWidget: EBWidgets not available');
        }
      } catch (error) {
        console.error('EventbriteWidget: Failed to initialize widget:', error);
        setHasError(true);
        onError?.("Không thể khởi tạo widget Eventbrite.");
      }
    };

    loadWidget();

    return () => {
      if (script && document.head.contains(script)) {
        document.head.removeChild(script);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [eventId, onTicketPurchase, onError]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải widget Eventbrite...</p>
      </div>
    );
  }

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
          className="font-form bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
          disabled={!widgetLoaded}
        >
          🎫 Đặt vé 
        </Button>
        {!widgetLoaded && (
          <p className="text-sm text-gray-500 mt-2">Đang chuẩn bị...</p>
        )}
      </div>
    </div>
  );
}
