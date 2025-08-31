"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { EventbriteWidget } from "@/components/EventbriteWidget";
import { eventbriteConfig } from "@/config/eventbrite";
import { useEffect, useState } from "react";

export default function EventTicketPage() {
    const router = useRouter();
    const { setStep, reset } = useAppStore();
    const [isDevelopment, setIsDevelopment] = useState(false);

    useEffect(() => {
        // Check if we're in development (HTTP) or production (HTTPS)
        // In production, we should show the widget, not the fallback
        const isLocalDev = window.location.protocol === 'http:' && 
                          (window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1');
        setIsDevelopment(isLocalDev);
    }, []);

    const handleTicketPurchase = () => {
        // This will be called when a ticket is purchased
        console.log("Ticket purchased successfully!");
    };

    const handleError = (error: string) => {
        console.error("Eventbrite widget error:", error);
    };

    const handleDirectEventbrite = () => {
        // Open Eventbrite in a new tab for development
        const fallbackUrl = eventbriteConfig.development.fallbackUrl.replace('1431313209339', eventbriteConfig.eventId);
        window.open(fallbackUrl, '_blank');
    };

    return (
        <div>
            <h1 className="text-2xl font-title">Đặt vé sự kiện</h1>
            <p className="font-legalese mb-6">
                Bước cuối cùng! Hãy đặt vé tham dự buổi họp mặt qua Eventbrite.
            </p>
            
            {isDevelopment ? (
                // Development fallback - show event info and direct link
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-semibold text-yellow-800 mb-3">⚠️ Chế độ phát triển</h2>
                    <p className="text-yellow-700 mb-4">
                        Widget Eventbrite yêu cầu HTTPS để hoạt động. Trong môi trường phát triển, 
                        bạn có thể truy cập trực tiếp trang Eventbrite để đặt vé.
                    </p>
                    
                    <div className="bg-white p-4 rounded border mb-4">
                        <h3 className="font-semibold mb-2">{eventbriteConfig.event.title}</h3>
                        <p className="text-gray-600 mb-2">📅 {eventbriteConfig.event.date}</p>
                        <p className="text-gray-600 mb-2">📍 {eventbriteConfig.event.location}</p>
                        <p className="text-gray-600">{eventbriteConfig.event.description}</p>
                    </div>
                    
                    <Button 
                        onClick={handleDirectEventbrite}
                        className="font-form bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg w-full"
                    >
                        🎫 Mở Eventbrite để đặt vé
                    </Button>
                    
                    <p className="text-sm text-yellow-600 mt-3">
                        <strong>Lưu ý:</strong> Trong môi trường production (HTTPS), widget sẽ hoạt động bình thường.
                    </p>
                </div>
            ) : (
                // Production - show the actual widget
                <EventbriteWidget
                    eventId={eventbriteConfig.eventId}
                    eventTitle={eventbriteConfig.event.title}
                    eventDate={eventbriteConfig.event.date}
                    eventLocation={eventbriteConfig.event.location}
                    onTicketPurchase={handleTicketPurchase}
                    onError={handleError}
                />
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
                >
                    Quay lại
                </Button>
                <Button 
                    className="font-form bg-green-600 hover:bg-green-700" 
                    onClick={() => {
                        alert("Cảm ơn bạn đã hoàn tất đăng ký! Vui lòng kiểm tra email để xác nhận vé.");
                        reset();
                        router.push("/");
                    }}
                >
                    Hoàn thành đăng ký
                </Button>
            </div>
        </div>
    );
}
