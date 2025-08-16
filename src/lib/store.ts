import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the shape of your form data
interface FormData {
  fullName: string;
  email: string;
  phone: string;
  class?: string;
  occupation?: string;
  workplace?: string;
  donationAmount: number;
  // We'll add more fields for merchandise later
}

// Define the shape of your store
interface AppState {
  currentStep: number;
  formData: FormData;
  setStep: (step: number) => void;
  updateFormData: (data: Partial<FormData>) => void;
  reset: () => void;
  hydrated?: boolean;
}

const initialState: { currentStep: number; formData: FormData; hydrated?: boolean } = {
  currentStep: 1,
  formData: {
    fullName: '',
    email: '',
    phone: '',
    class: '',
    occupation: '',
    workplace: '',
    donationAmount: 500000,
  },
  hydrated: false,
};

// Create the store with persistence and 1-day expiration
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,
      setStep: (step) => set({ currentStep: step }),
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
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