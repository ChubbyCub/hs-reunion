"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
 

export default function EventTicketPage() {
    const router = useRouter();
    const { setStep } = useAppStore();
    

    const handleRegistrationComplete = () => {
        router.push("/complete");
    };

    return (
        <div>
            <h1 className="text-2xl font-title">Đặt vé sự kiện</h1>
            <p className="font-legalese mb-6">
                Bước cuối cùng! Việc đặt vé sẽ được thông báo sau. Hiện tại, hãy hoàn tất đăng ký.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">Lưu ý quan trọng:</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Vé sẽ được gửi qua email</li>
                    <li>• Vui lòng kiểm tra email và spam folder</li>
                    <li>• Liên hệ ban tổ chức nếu gặp vấn đề</li>
                </ul>
            </div>

            <div className="mt-8 flex justify-between">
                <Button 
                    variant="outline" 
                    className="font-form" 
                    onClick={() => {
                        setStep(3);
                        router.push("/payment");
                    }}
                >
                    Quay lại
                </Button>
                <Button 
                    className="font-form bg-green-600 hover:bg-green-700" 
                    onClick={() => {
                        alert("Cảm ơn bạn đã hoàn tất đăng ký! Chúng tôi sẽ liên hệ khi mở bán vé.");
                        handleRegistrationComplete();
                    }}
                >
                    Hoàn thành đăng ký
                </Button>
            </div>
        </div>
    );
}
