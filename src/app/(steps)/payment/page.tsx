"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
    const router = useRouter();
    const { setStep, reset } = useAppStore();

  return (
    <div>
      <h1 className="text-2xl font-title">Payment</h1>
      <p className="font-legalese">Payment options will go here.</p>
       <div className="mt-8 flex justify-between">
        <Button variant="outline" className="font-form" onClick={() => {
            setStep(3);
            router.push("/donation");
        }}>
          Back
        </Button>
        <Button className="font-form" onClick={() => {
            alert("Thank you for registering!");
            reset();
            router.push("/");
        }}>
          Finish
        </Button>
      </div>
    </div>
  );
} 