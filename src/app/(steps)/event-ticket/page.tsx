"use client";

import { useAppStore } from "@/stores/app-store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EventTicketPage() {
    const router = useRouter();
    const { setStep, saveEverythingToDatabase } = useAppStore();
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [saveStatus, setSaveStatus] = useState<{ success?: boolean; message?: string }>({});

    const handleRegistrationComplete = async () => {
        setIsSaving(true);
        setSaveStatus({});
        
        try {
            const result = await saveEverythingToDatabase();
            if (result.success) {
                // Immediately redirect to success page
                router.push("/complete");
            } else {
                setSaveStatus({ success: false, message: `Lỗi khi lưu dữ liệu: ${result.error}` });
                setIsSaving(false);
            }
        } catch {
            setSaveStatus({ success: false, message: "Lỗi không xác định khi lưu dữ liệu." });
            setIsSaving(false);
        }
    };

    return (
        <div className="px-4 sm:px-0">
            <h1 className="text-xl sm:text-2xl font-title text-center">Xác nhận đăng ký</h1>
            <p className="font-legalese mb-4 sm:mb-6 text-sm sm:text-base text-center">
                Bước cuối cùng! Vui lòng xác nhận thông tin đăng ký của bạn.
            </p>

            {saveStatus.message && !saveStatus.success && (
                <div className="p-4 rounded-lg border-l-4 mb-6 bg-red-50 border-red-400 text-red-800">
                    <p className="font-semibold">{saveStatus.message}</p>
                </div>
            )}

            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border-l-4 border-blue-400 mb-4 sm:mb-6">
                <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Lưu ý quan trọng:</h3>
                <ul className="text-blue-700 text-xs sm:text-sm space-y-1">
                    <li>• Ban tổ chức sẽ xác nhận thanh toán của bạn</li>
                    <li>• Mã QR check-in sẽ được gửi qua email sau khi thanh toán được xác nhận</li>
                    <li>• Liên hệ ban tổ chức nếu gặp vấn đề</li>
                </ul>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
                <Button 
                    variant="outline" 
                    className="font-form order-2 sm:order-1" 
                    onClick={() => {
                        setStep(3);
                        router.push("/payment");
                    }}
                    disabled={isSaving}
                >
                    Quay lại
                </Button>
                <Button 
                    className="font-form bg-green-600 hover:bg-green-700 order-1 sm:order-2" 
                    onClick={handleRegistrationComplete}
                    disabled={isSaving}
                >
                    {isSaving ? "Đang lưu..." : "Hoàn thành đăng ký"}
                </Button>
            </div>
        </div>
    );
}
