"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

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
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const [widgetCreated, setWidgetCreated] = useState(false);

  const handleButtonClick = async () => {
    console.log('EventbriteWidget: Button clicked!');
    
    // If widget is already created, just let Eventbrite handle it
    if (widgetCreated) {
      console.log('EventbriteWidget: Widget already exists, Eventbrite should handle click');
      return;
    }

    // If we're in development, open Eventbrite directly
    if (window.location.protocol === 'http:' && 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      console.log('EventbriteWidget: Development mode, opening Eventbrite directly');
      window.open(`https://www.eventbrite.com/e/${eventId}`, '_blank');
      return;
    }

    // Start loading the widget
    setIsLoading(true);
    setHasError(false);

    try {
      await loadWidget();
    } catch (error) {
      console.error('EventbriteWidget: Failed to load widget:', error);
      setHasError(true);
      onError?.("Không thể tải widget Eventbrite. Vui lòng thử lại sau.");
      setIsLoading(false);
    }
  };

  const loadWidget = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      console.log('EventbriteWidget: Starting to load widget...');
      console.log('EventbriteWidget: Current protocol:', window.location.protocol);
      console.log('EventbriteWidget: Current hostname:', window.location.hostname);
      console.log('EventbriteWidget: Event ID:', eventId);

      // Check if script is already loaded
      if (window.EBWidgets) {
        console.log('EventbriteWidget: EBWidgets already available, initializing...');
        initializeWidget();
        resolve();
        return;
      }

      console.log('EventbriteWidget: Loading Eventbrite script...');
      
      // Load Eventbrite widget script
      const script = document.createElement('script');
      script.src = 'https://www.eventbrite.com/static/widgets/eb_widgets.js';
      script.async = true;
      
      script.onload = () => {
        console.log('EventbriteWidget: Script loaded successfully');
        setWidgetLoaded(true);
        initializeWidget();
        setIsLoading(false);
        resolve();
      };

      script.onerror = () => {
        console.error('EventbriteWidget: Script failed to load');
        setHasError(true);
        setIsLoading(false);
        onError?.("Không thể tải widget Eventbrite. Vui lòng thử lại sau.");
        reject(new Error('Script failed to load'));
      };

      document.head.appendChild(script);

      // Set timeout for script loading
      const timeoutId = setTimeout(() => {
        if (!window.EBWidgets) {
          setIsLoading(false);
          setHasError(true);
          onError?.("Widget Eventbrite tải quá lâu. Vui lòng thử lại sau.");
          reject(new Error('Script loading timeout'));
        }
      }, 10000); // 10 second timeout

      // Cleanup timeout if script loads successfully
      script.onload = () => {
        clearTimeout(timeoutId);
        console.log('EventbriteWidget: Script loaded successfully');
        setWidgetLoaded(true);
        initializeWidget();
        setIsLoading(false);
        resolve();
      };
    });
  };

  const initializeWidget = () => {
    try {
      console.log('EventbriteWidget: Initializing widget...');
      if (window.EBWidgets && !widgetCreated) {
        console.log('EventbriteWidget: Creating widget with config:', {
          widgetType: 'checkout',
          eventId: eventId,
          modal: true,
          modalTriggerElementId: 'eventbrite-widget-trigger'
        });
        
        window.EBWidgets.createWidget({
          widgetType: 'checkout',
          eventId: eventId,
          modal: true,
          modalTriggerElementId: 'eventbrite-widget-trigger',
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
        setWidgetCreated(true);
      } else {
        console.error('EventbriteWidget: EBWidgets not available or widget already created');
      }
    } catch (error) {
      console.error('EventbriteWidget: Failed to initialize widget:', error);
      setHasError(true);
      onError?.("Không thể khởi tạo widget Eventbrite.");
    }
  };

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
          onClick={handleButtonClick}
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
