export interface CheckInData {
  attendee_id: number;
  check_in_method: 'qr_scan' | 'manual' | 'admin';
  notes?: string;
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

export class CheckInService {
  /**
   * Check in an attendee using their QR code data
   */
  static async checkInAttendee(qrData: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrData }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Check-in failed' };
      }
      
      return result;
      
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error during check-in' 
      };
    }
  }
  
  /**
   * Get check-in status for an attendee
   */
  static async getCheckInStatus(attendeeId: number): Promise<{ success: boolean; data?: CheckInStatus; error?: string }> {
    try {
      // For now, we'll need to get all attendees and filter
      // In the future, we could create a specific API endpoint for this
      const result = await this.getCheckedInAttendees();
      
      if (!result.success) {
        return { success: false, error: result.error };
      }
      
      const attendee = result.data?.find(a => a.id === attendeeId);
      
      if (!attendee) {
        return { 
          success: true, 
          data: { isCheckedIn: false } 
        };
      }
      
      return {
        success: true,
        data: {
          isCheckedIn: attendee.checked_in,
          checkInTime: attendee.check_in_time || undefined,
          checkInMethod: attendee.check_in_method || undefined,
          notes: attendee.check_in_notes || undefined,
        }
      };
      
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error getting check-in status' 
      };
    }
  }
  
  /**
   * Get all checked-in attendees
   */
  static async getCheckedInAttendees(): Promise<{ success: boolean; data?: AttendeeSummary[]; error?: string }> {
    try {
      const response = await fetch('/api/checkin/attendees');
      const result = await response.json();
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to fetch attendees' };
      }
      
      return result;
      
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error getting attendees' 
      };
    }
  }
  
  /**
   * Get check-in statistics
   */
  static async getCheckInStats(): Promise<{ success: boolean; data?: CheckInStats; error?: string }> {
    try {
      const response = await fetch('/api/checkin');
      const result = await response.json();
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to fetch stats' };
      }
      
      return result;
      
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error getting stats' 
      };
    }
  }
}

// Type definitions for the data structures
export interface CheckInStats {
  totalCheckedIn: number;
  totalAttendees: number;
  checkInRate: number;
}
