export const eventbriteConfig = {
  // Your actual Eventbrite event ID
  eventId: "1431313209339",
  
  // Development settings
  development: {
    // Set to true to enable development mode (bypasses HTTPS requirement)
    enabled: process.env.NODE_ENV === 'development',
    // Fallback URL for development (opens Eventbrite directly)
    fallbackUrl: "https://www.eventbrite.com/e/lhp0306-reunion-tickets-1431313209339"
  },
  
  // Event details from your actual Eventbrite event
  event: {
    title: "LHP0306-Reunion",
    date: "Chủ nhật, 01/02/2026 · 8:00 AM - 7:00 PM GMT+7",
    location: "Trường Trung Học Phổ Thông Chuyên Lê Hồng Phong, 235 Đường Nguyễn Văn Cừ, Hồ Chí Minh, 70000 Viet Nam",
    description: ""
  },
  
  // Widget configuration
  widget: {
    modal: true,
    modalTriggerElementId: "eventbrite-widget-trigger",
    // You can customize the widget appearance
    theme: "light",
    // Set to true if you want to show the widget inline instead of modal
    inline: false
  },
  
  // Contact information
  contact: {
    email: "contact@lhp0306-reunion.com", // Update with actual contact email
    phone: "+84 XXX XXX XXX", // Update with actual contact phone
    organizer: "Cuu hoc sinh Le Hong Phong Khoa 0306"
  }
};

// Helper function to get the full Eventbrite URL
export const getEventbriteUrl = () => {
  return `https://www.eventbrite.com/e/${eventbriteConfig.eventId}`;
};

// Helper function to validate event ID format
export const isValidEventId = (eventId: string) => {
  // Eventbrite event IDs are typically numeric
  return /^\d+$/.test(eventId);
};
