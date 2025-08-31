"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
    const router = useRouter();
    const { setStep, reset } = useAppStore();

  return (
    <div>
      <h1 className="text-2xl font-title">Thanh toán</h1>
      <p className="font-legalese">Các tùy chọn thanh toán sẽ được hiển thị tại đây.</p>
       <div className="mt-8 flex justify-between">
        <Button variant="outline" className="font-form" onClick={() => {
            setStep(2);
            router.push("/merchandise");
        }}>
          Quay lại
        </Button>
        <Button className="font-form" onClick={() => {
            alert("Cảm ơn bạn đã đăng ký!");
            reset();
            router.push("/");
        }}>
          Hoàn thành
        </Button>
      </div>
    </div>
  );
} 