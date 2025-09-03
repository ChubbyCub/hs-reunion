"use client";

import { useAppStore } from "@/stores/app-store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
 

export default function EventTicketPage() {
    const router = useRouter();
    const { setStep, formData, saveEverythingToDatabase } = useAppStore();
    const [qrUrl, setQrUrl] = useState<string>("");
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [qrError, setQrError] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [saveStatus, setSaveStatus] = useState<{ success?: boolean; message?: string }>({});

    const attendeePayload = useMemo(() => {
        const payload = {
            em: formData.email || "",
            ph: formData.phone || "",
            fn: formData.firstName || "",
            ln: formData.lastName || "",
            oc: formData.occupation || "",
            emr: formData.workplace || "",
            ac: formData.receiveUpdates || false,
        };
        return JSON.stringify(payload);
    }, [formData.email, formData.phone, formData.firstName, formData.lastName, formData.occupation, formData.workplace, formData.receiveUpdates]);

    useEffect(() => {
        let cancelled = false;
        async function generate() {
            setIsGenerating(true);
            setQrError("");
            try {
                const url = await QRCode.toDataURL(attendeePayload, {
                    errorCorrectionLevel: "M",
                    width: 256,
                    margin: 2,
                    color: { dark: "#000000", light: "#ffffff" },
                });
                if (!cancelled) setQrUrl(url);
            } catch {
                if (!cancelled) setQrError("Không thể tạo mã QR. Vui lòng thử lại.");
            } finally {
                if (!cancelled) setIsGenerating(false);
            }
        }
        generate();
        return () => {
            cancelled = true;
        };
    }, [attendeePayload]);

    const handleRegistrationComplete = async () => {
        setIsSaving(true);
        setSaveStatus({});
        
        try {
            const result = await saveEverythingToDatabase();
            if (result.success) {
                setSaveStatus({ success: true, message: "Đăng ký thành công! Dữ liệu đã được lưu vào cơ sở dữ liệu." });
                setTimeout(() => {
                    router.push("/complete");
                }, 2000);
            } else {
                setSaveStatus({ success: false, message: `Lỗi khi lưu dữ liệu: ${result.error}` });
            }
        } catch {
            setSaveStatus({ success: false, message: "Lỗi không xác định khi lưu dữ liệu." });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-title">Đặt vé sự kiện</h1>
            <p className="font-legalese mb-6">
                Bước cuối cùng! Đây là mã QR của bạn dùng cho khâu check-in.
            </p>

            <div className="bg-white p-6 rounded-lg border mb-6 text-center">
                {qrError ? (
                    <p className="text-red-600">{qrError}</p>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        {isGenerating ? (
                            <p className="text-sm text-gray-500">Đang tạo mã QR…</p>
                        ) : (
                            <>
                                {qrUrl && (
                                    <Image
                                        src={qrUrl}
                                        alt="Mã QR tham dự"
                                        width={256}
                                        height={256}
                                        className="w-64 h-64 border rounded"
                                    />
                                )}
                                {qrUrl && (
                                    <a
                                        href={qrUrl}
                                        download={`ticket-${formData.email || "attendee"}.png`}
                                        className="inline-flex"
                                    >
                                        <Button className="font-form">Tải mã QR</Button>
                                    </a>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {saveStatus.message && (
                <div className={`p-4 rounded-lg border-l-4 mb-6 ${
                    saveStatus.success 
                        ? 'bg-green-50 border-green-400 text-green-800' 
                        : 'bg-red-50 border-red-400 text-red-800'
                }`}>
                    <p className="font-semibold">{saveStatus.message}</p>
                </div>
            )}

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
                    disabled={isSaving}
                >
                    Quay lại
                </Button>
                <Button 
                    className="font-form bg-green-600 hover:bg-green-700" 
                    onClick={handleRegistrationComplete}
                    disabled={isSaving}
                >
                    {isSaving ? "Đang lưu..." : "Hoàn thành đăng ký"}
                </Button>
            </div>
        </div>
    );
}
