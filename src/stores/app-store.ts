import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FormData, CartItem } from '../types/common';

// Define the shape of your store
interface AppState {
  currentStep: number;
  formData: FormData;
  cart: CartItem[];
  paymentProofFile?: {
    file: File;
    name: string;
    size: number;
    type: string;
    uploadedAt: string;
  };
  setStep: (step: number) => void;
  updateFormData: (data: Partial<FormData>) => void;
  updateCart: (cart: CartItem[]) => void;
  setPaymentProofFile: (file: { file: File; name: string; size: number; type: string; uploadedAt: string }) => void;
  saveEverythingToDatabase: () => Promise<{ success: boolean; error?: string; attendeeId?: number; orderId?: number }>;
  reset: () => void;
  hydrated?: boolean;
}

const initialState: { currentStep: number; formData: FormData; cart: CartItem[]; paymentProofFile?: { file: File; name: string; size: number; type: string; uploadedAt: string }; hydrated?: boolean } = {
  currentStep: 1,
  formData: {
    fullName: '',
    email: '',
    phone: '',
    class: '',
    occupation: '',
    workplace: '',
    donationAmount: 0,
  },
  cart: [],
  paymentProofFile: undefined,
  hydrated: false,
};

// Create the store with persistence and 1-day expiration
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setStep: (step) => set({ currentStep: step }),
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      updateCart: (cart) => set({ cart }),
      setPaymentProofFile: (file) => set({ paymentProofFile: file }),
      saveEverythingToDatabase: async () => {
        const { formData, cart, paymentProofFile } = get();
        
        try {
          // First, save the attendee
          const attendeeResponse = await fetch('/api/attendees', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });

          const attendeeResult = await attendeeResponse.json();
          
          if (!attendeeResponse.ok) {
            throw new Error(attendeeResult.error || 'Failed to save attendee to database');
          }
          
          const attendeeId = attendeeResult.data?.id;
          if (!attendeeId) {
            throw new Error('No attendee ID returned from server');
          }

          // Update form data with attendee ID
          set((state) => ({
            formData: { ...state.formData, attendeeId }
          }));

          // Save donation if amount is provided
          let donationId = null;
          if (formData.donationAmount && formData.donationAmount > 0) {
            const donationResponse = await fetch('/api/donations', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                amount: formData.donationAmount,
                attendeeId: attendeeId,
              }),
            });

            const donationResult = await donationResponse.json();

            if (!donationResponse.ok) {
              throw new Error(donationResult.error || 'Failed to save donation to database');
            }

            donationId = donationResult.data?.id;
          }

          // If there are items in cart, save the order
          let orderId = null;
          if (cart.length > 0) {
            // Calculate merchandise total with free t-shirt logic
            const getMerchandiseTotal = () => {
              let total = 0;
              let firstTshirtApplied = false;

              cart.forEach((item) => {
                const isTshirt = item.name.toLowerCase().includes('áo') || item.name.toLowerCase().includes('t-shirt');

                if (isTshirt && !firstTshirtApplied && item.quantity > 0) {
                  total += item.price * (item.quantity - 1);
                  firstTshirtApplied = true;
                } else {
                  total += item.price * item.quantity;
                }
              });

              return total;
            };

            const orderAmount = getMerchandiseTotal();

            const orderData = {
              attendeeId: attendeeId,
              items: cart.map(item => ({
                merchandiseId: item.merchandiseId,
                quantity: item.quantity
              })),
              amount: orderAmount
            };

            const orderResponse = await fetch('/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(orderData),
            });

            const orderResult = await orderResponse.json();

            if (!orderResponse.ok) {
              throw new Error(orderResult.error || 'Failed to save order to database');
            }

            orderId = orderResult.data?.orderId;
          }

          // Upload payment proof if available
          if (paymentProofFile) {
            // Calculate total payment amount
            const getMerchandiseTotal = () => {
              let total = 0;
              let firstTshirtApplied = false;

              cart.forEach((item) => {
                const isTshirt = item.name.toLowerCase().includes('áo') || item.name.toLowerCase().includes('t-shirt');

                if (isTshirt && !firstTshirtApplied && item.quantity > 0) {
                  total += item.price * (item.quantity - 1);
                  firstTshirtApplied = true;
                } else {
                  total += item.price * item.quantity;
                }
              });

              return total;
            };

            const totalAmount = getMerchandiseTotal() + (formData.donationAmount || 0);

            const formDataToSend = new FormData();
            formDataToSend.append('file', paymentProofFile.file);
            formDataToSend.append('attendeeId', attendeeId.toString());
            formDataToSend.append('orderId', orderId ? orderId.toString() : '');
            formDataToSend.append('donationId', donationId ? donationId.toString() : '');
            formDataToSend.append('amount', totalAmount.toString());

            const uploadResponse = await fetch('/api/upload-payment-proof', {
              method: 'POST',
              body: formDataToSend,
            });

            const uploadResult = await uploadResponse.json();

            if (!uploadResponse.ok) {
              console.error('Payment proof upload failed:', uploadResult.error);
              // Don't fail the entire process if payment proof upload fails
            }
          }
          
          // Clear local storage after successful save
          set(initialState);
          localStorage.removeItem('app-store');
          
          return {
            success: true,
            attendeeId,
            orderId
          };
          
        } catch (error) {
          console.error('Error saving to database:', error);
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
          };
        }
      },
      reset: () => {
        set(initialState);
        // Also remove from localStorage
        localStorage.removeItem('app-store');
      },
      hydrated: false,
    }),
    {
      name: 'app-store',
      // Custom serialize/deserialize to handle expiration
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            const data = JSON.parse(str);
            if (data && data.timestamp && Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
              // Expired
              localStorage.removeItem(name);
              return null;
            }
            return data.value;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          const data = { value, timestamp: Date.now() };
          localStorage.setItem(name, JSON.stringify(data));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Zustand recommends using set for updates
          setTimeout(() => {
            // set is not available here, so use a workaround in the component
            // We'll handle hydration in the component
          }, 0);
        }
      },
    }
  )
); 