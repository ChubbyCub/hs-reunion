// Common types used across the application
export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  class?: string;
  occupation?: string;
  workplace?: string;
  receiveUpdates: boolean;
  merchandise?: CartItem[];
  attendeeId?: number; // Store the attendee ID after saving to database
}

export interface CheckInStatus {
  isCheckedIn: boolean;
}

export interface AttendeeSummary {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  occupation: string | null;
  employer: string | null;
  checked_in: boolean;
}

export interface CheckInStats {
  totalCheckedIn: number;
  totalAttendees: number;
  checkInRate: number;
}

// QR Code data structure - simplified for check-in
export interface QRCodeData {
  em: string;    // email only
}

// Merchandise types
export interface Merchandise {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  price: number;
  gender: 'men' | 'women' | 'unisex';
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'ONE_SIZE';
}

export interface CartItem {
  merchandiseId: number;
  quantity: number;
  name: string;
  price: number;
  gender: string;
  size: string;
}
