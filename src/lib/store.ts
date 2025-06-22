import { create } from 'zustand';

// Define the shape of your form data
interface FormData {
  fullName: string;
  email: string;
  phone: string;
  occupation?: string;
  workplace?: string;
  // We'll add more fields for merchandise and donation later
}

// Define the shape of your store
interface AppState {
  currentStep: number;
  formData: FormData;
  setStep: (step: number) => void;
  updateFormData: (data: Partial<FormData>) => void;
  reset: () => void;
}

const initialState: { currentStep: number; formData: FormData } = {
  currentStep: 1,
  formData: {
    fullName: '',
    email: '',
    phone: '',
    occupation: '',
    workplace: '',
  },
};

// Create the store
export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  setStep: (step) => set({ currentStep: step }),
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  reset: () => {
    set(initialState);
  },
})); 