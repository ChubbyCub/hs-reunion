// Import the type we need
import type { AttendeeSummary } from './common';

// API request/response types
export interface CheckInRequest {
  qrData: string;
}

export interface CheckInResponse {
  success: boolean;
  error?: string;
}

export interface AttendeesResponse {
  success: boolean;
  data?: AttendeeSummary[];
  error?: string;
}

export interface StatsResponse {
  success: boolean;
  data?: {
    totalCheckedIn: number;
    totalAttendees: number;
    checkInRate: number;
  };
  error?: string;
}
