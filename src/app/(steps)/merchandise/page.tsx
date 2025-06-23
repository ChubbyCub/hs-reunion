"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MerchandisePage() {
    const router = useRouter();
    const { setStep } = useAppStore();

  return (
    <div>
      <h1 className="text-2xl font-title">Merchandise</h1>
      <p className="font-legalese">T-shirt order form will go here.</p>
       <div className="mt-8 flex justify-between">
        <Button variant="outline" className="font-form" onClick={() => {
            setStep(1);
            router.push("/register");
        }}>
          Back
        </Button>
        <Button className="font-form" onClick={() => {
            setStep(3);
            router.push("/donation");
        }}>
          Next
        </Button>
      </div>
    </div>
  );
} 