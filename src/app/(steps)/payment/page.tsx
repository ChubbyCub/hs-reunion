"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
    const router = useRouter();
    const { setStep, reset } = useAppStore();

  return (
    <div>
      <h1 className="text-2xl font-bold">Payment</h1>
      <p>Payment options will go here.</p>
       <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={() => {
            setStep(3);
            router.push("/donation");
        }}>
          Back
        </Button>
        <Button onClick={() => {
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