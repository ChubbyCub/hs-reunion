"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DonationPage() {
    const router = useRouter();
    const { setStep } = useAppStore();

  return (
    <div>
      <h1 className="text-2xl font-bold">Donation</h1>
      <p>Donation form will go here.</p>
       <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={() => {
            setStep(2);
            router.push("/merchandise");
        }}>
          Back
        </Button>
        <Button onClick={() => {
            setStep(4);
            router.push("/payment");
        }}>
          Next
        </Button>
      </div>
    </div>
  );
} 