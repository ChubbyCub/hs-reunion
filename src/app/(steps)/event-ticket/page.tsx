"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
 

export default function EventTicketPage() {
    const router = useRouter();
    const { setStep, formData } = useAppStore();
    const [qrUrl, setQrUrl] = useState<string>("");
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [qrError, setQrError] = useState<string>("");

    const attendeePayload = useMemo(() => {
        const payload = {
            em: formData.email || "",
            ph: formData.phone || "",
            fn: formData.firstName || "",
            ln: formData.lastName || "",
            cl: formData.class || "",
        };
        return JSON.stringify(payload);
    }, [formData.email, formData.phone, formData.firstName, formData.lastName, formData.class]);

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

    const handleRegistrationComplete = () => {
        router.push("/complete");
    };

    return (
        <div>
            <h1 className="text-2xl font-title">Đặt vé sự kiện</h1>
            <p className="font-legalese mb-6">
                Bước cuối cùng! Đây là mã QR của bạn dùng cho khâu check-in.
            </p>

            <div className="bg-white p-6 rounded-lg border mb-6 text-center">
                <div className="mb-4">
                    <p className="font-semibold">
                        {formData.firstName} {formData.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{formData.class}</p>
                    <p className="text-sm text-gray-600">{formData.email}</p>
                    <p className="text-sm text-gray-600">{formData.phone}</p>
                </div>
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
                        alert("Cảm ơn bạn! Vui lòng lưu lại mã QR để sử dụng khi check-in.");
                        handleRegistrationComplete();
                    }}
                >
                    Hoàn thành đăng ký
                </Button>
            </div>
        </div>
    );
}
