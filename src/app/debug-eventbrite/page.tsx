"use client";

import { EventbriteWidget } from "@/components/EventbriteWidget";
import { eventbriteConfig } from "@/config/eventbrite";

export default function DebugEventbritePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Eventbrite Widget Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(eventbriteConfig, null, 2)}
            </pre>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Environment Info</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Protocol:</strong> {typeof window !== 'undefined' ? window.location.protocol : 'N/A'}</p>
            <p><strong>Hostname:</strong> {typeof window !== 'undefined' ? window.location.hostname : 'N/A'}</p>
            <p><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
            <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Widget Test</h2>
        <EventbriteWidget
          eventId={eventbriteConfig.eventId}
          eventTitle={eventbriteConfig.event.title}
          eventDate={eventbriteConfig.event.date}
          eventLocation={eventbriteConfig.event.location}
          onTicketPurchase={() => console.log('Ticket purchased!')}
          onError={(error) => console.error('Widget error:', error)}
        />
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Debug Instructions</h2>
        <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-400">
          <ol className="list-decimal list-inside space-y-2">
            <li>Open browser console (F12)</li>
            <li>Look for &quot;EventbriteWidget:&quot; log messages</li>
            <li>Check for any error messages</li>
            <li>Verify the widget button appears and is clickable</li>
            <li>Click the &quot;🎫 Đặt vé&quot; button to test</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
