import { supabase } from './supabase';
import type { 
  CheckInStatus, 
  AttendeeSummary, 
  CheckInStats,
  QRCodeData 
} from '../../types/common';

export class CheckInService {
  /**
   * Check in an attendee using their QR code data
   */
  static async checkInAttendee(qrData: string): Promise<{ success: boolean; error?: string }> {
    try {
      let attendeeEmail: string;

      // Try to parse as QR data first
      try {
        const attendeeInfo: QRCodeData = JSON.parse(qrData);
        attendeeEmail = attendeeInfo.em;
      } catch {
        // If parsing fails, treat as plain email
        attendeeEmail = qrData.trim();
      }

      // Validate email format
      if (!attendeeEmail || !attendeeEmail.includes('@')) {
        return { success: false, error: 'Invalid email format' };
      }
      
      // Find attendee by email
      const { data: attendee, error: findError } = await supabase
        .from('Attendees')
        .select('id, checked_in, first_name, last_name, class')
        .eq('email', attendeeEmail)
        .single();
      
      if (findError || !attendee) {
        return { success: false, error: 'Attendee not found' };
      }
      
      // Check if already checked in
      if (attendee.checked_in) {
        return { success: false, error: 'Attendee is already checked in' };
      }
      
      // Perform check-in
      const { error: updateError } = await supabase
        .from('Attendees')
        .update({
          checked_in: true,
        })
        .eq('id', attendee.id);
      
      if (updateError) {
        return { success: false, error: updateError.message };
      }
      
      return { success: true };
      
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error during check-in' 
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
