import type { Merchandise } from '../../types/common';

export class MerchandiseService {
  /**
   * Get all merchandise from the database
   */
  static async getAllMerchandise(): Promise<{ success: boolean; data?: Merchandise[]; error?: string }> {
    try {
      const response = await fetch('/api/merchandise');
      const result = await response.json();
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to fetch merchandise' };
      }
      
      return result;
      
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error getting merchandise' 
      };
    }
  }

  /**
   * Get merchandise by category (e.g., all T-shirts)
   */
  static async getMerchandiseByCategory(category: string): Promise<{ success: boolean; data?: Merchandise[]; error?: string }> {
    try {
      const response = await fetch(`/api/merchandise?category=${encodeURIComponent(category)}`);
      const result = await response.json();
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to fetch merchandise' };
      }
      
      return result;
      
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error getting merchandise' 
      };
    }
  }

  /**
   * Get available sizes for a specific product
   */
  static async getAvailableSizes(productName: string): Promise<{ success: boolean; data?: string[]; error?: string }> {
    try {
      const result = await this.getAllMerchandise();
      
      if (!result.success) {
        return { success: false, error: result.error };
      }
      
      const sizes = [...new Set(
        result.data
          ?.filter(item => item.name.toLowerCase().includes(productName.toLowerCase()))
          .map(item => item.size) || []
      )];
      
      return { success: true, data: sizes };
      
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error getting available sizes' 
      };
    }
  }

  /**
   * Get available genders for a specific product
   */
  static async getAvailableGenders(productName: string): Promise<{ success: boolean; data?: string[]; error?: string }> {
    try {
      const result = await this.getAllMerchandise();
      
      if (!result.success) {
        return { success: false, error: result.error };
      }
      
      const genders = [...new Set(
        result.data
          ?.filter(item => item.name.toLowerCase().includes(productName.toLowerCase()))
          .map(item => item.gender) || []
      )];
      
      return { success: true, data: genders };
      
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error getting available genders' 
      };
    }
  }
}
