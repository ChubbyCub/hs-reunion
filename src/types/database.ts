// Database table types
export interface Attendee {
  id: number;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  phone_number: string;
  class: string;
  occupation: string | null;
  employer: string | null;
  checked_in: boolean;
}

// Insert/Update types (without auto-generated fields)
export interface CreateAttendeeData {
  full_name: string;
  email: string;
  phone_number: string;
  class: string;
  occupation?: string | null;
  employer?: string | null;
}

export interface UpdateAttendeeData {
  checked_in?: boolean;
}
