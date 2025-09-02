// Database table types
export interface Attendee {
  id: number;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  occupation: string | null;
  employer: string | null;
  allow_contact: boolean;
  checked_in: boolean;
  check_in_time: string | null;
  check_in_method: string | null;
  check_in_notes: string | null;
}

// Insert/Update types (without auto-generated fields)
export interface CreateAttendeeData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  occupation?: string | null;
  employer?: string | null;
  allow_contact?: boolean;
}

export interface UpdateAttendeeData {
  checked_in?: boolean;
  check_in_time?: string | null;
  check_in_method?: string | null;
  check_in_notes?: string | null;
}
