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
  checkInTime?: string;
  checkInMethod?: string;
  notes?: string;
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
  check_in_time: string | null;
  check_in_method: string | null;
  check_in_notes: string | null;
}

export interface CheckInStats {
  totalCheckedIn: number;
  totalAttendees: number;
  checkInRate: number;
}

// QR Code data structure
export interface QRCodeData {
  em: string;    // email
  ph: string;    // phone
  fn: string;    // first name
  ln: string;    // last name
  oc: string;    // occupation
  emr: string;   // employer
  ac: boolean;   // allow contact
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
