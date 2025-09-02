"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Simple chevron icons as SVG components
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className || "h-5 w-5 text-gray-500 flex-shrink-0"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronUpIcon = ({ className }: { className?: string }) => (
  <svg className={className || "h-5 w-5 text-gray-500 flex-shrink-0"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  hasLink?: boolean;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Ai có thể tham gia sự kiện này?",
    answer: "👉 Tất cả các cựu học sinh khóa 2003–2006 của Trường THPT Chuyên Lê Hồng Phong, bao gồm tất cả các lớp khối A–B–C–D–Chuyên đều được chào đón.\n\n👉 Giáo viên chủ nhiệm, bộ môn, cán bộ nhân viên từng giảng dạy khóa này cũng được mời trân trọng."
  },
  {
    id: 2,
    question: "Sự kiện sẽ diễn ra khi nào và ở đâu?",
    answer: "📍 Thời gian: Dự kiến tháng 2 năm 2026\n\n📍 Địa điểm: Trường THPT Chuyên Lê Hồng Phong – Số 235 Nguyễn Văn Cừ, P.4, Q.5, TP.HCM\n\n👉 Thời gian cụ thể sẽ được thông báo sau khi BTC thống nhất với nhà trường."
  },
  {
    id: 3,
    question: "Tôi muốn tài trợ hoặc đóng góp, phải làm sao?",
    answer: "❤️ Rất cảm ơn bạn! Bạn có thể đăng ký tại mục \"Đóng góp & Tài trợ\" trên website hoặc liên hệ trực tiếp Ban Tổ Chức qua mục Liên hệ & Kết nối. Chúng tôi sẽ phản hồi với các hình thức tài trợ phù hợp: hiện vật, hiện kim, sản phẩm, dịch vụ hoặc ý tưởng.",
    hasLink: true
  },
  {
    id: 4,
    question: "Tôi không ở TP.HCM, có thể tham gia không?",
    answer: "✈️ Rất khuyến khích bạn sắp xếp về tham dự. Nếu không thể, BTC sẽ có các hoạt động online (video recap, livestream, sổ lưu niệm điện tử...) để bạn cùng kết nối từ xa."
  },
  {
    id: 5,
    question: "Tôi có thể rủ bạn thân (khác khóa) hoặc gia đình đi cùng không?",
    answer: "🎫 Đây là sự kiện riêng dành cho khóa 0306 và thầy cô. Tuy nhiên, bạn có thể đề xuất với BTC để được hỗ trợ thêm vé mời đặc biệt, tuỳ theo chương trình cụ thể."
  }
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (openItems.length === faqData.length) {
      setOpenItems([]);
    } else {
      setOpenItems(faqData.map(item => item.id));
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex-1 w-full px-3 sm:px-6 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div 
            className={`text-center mb-6 sm:mb-8 transition-all duration-700 ease-out ${
              isLoaded 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="text-2xl sm:text-3xl font-title text-gray-900 mb-3 sm:mb-4">
              Câu hỏi thường gặp
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground font-legalese px-2">
              Tìm hiểu thêm về sự kiện họp mặt cựu học sinh LHP khóa 2003-2006
            </p>
          </div>

          {/* Toggle All Button */}
          <div 
            className={`text-center mb-4 sm:mb-6 transition-all duration-700 ease-out delay-200 ${
              isLoaded 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <Button
              variant="outline"
              onClick={toggleAll}
              className="font-form px-4 sm:px-6 py-2 text-sm sm:text-base w-full sm:w-auto"
            >
              {openItems.length === faqData.length ? "Thu gọn tất cả" : "Mở rộng tất cả"}
            </Button>
          </div>

          {/* FAQ Items */}
          <div className="space-y-3 sm:space-y-4">
            {faqData.map((item, index) => (
              <div
                key={item.id}
                className={`transition-all duration-700 ease-out delay-${Math.min(index * 100 + 400, 1000)} ${
                  isLoaded 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <Card className="hover:shadow-md transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                  <CardContent className="p-0">
                    <Button
                      variant="ghost"
                      onClick={() => toggleItem(item.id)}
                      className="w-full h-auto p-4 sm:p-6 text-left justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200"
                    >
                      <span className="font-semibold text-base sm:text-lg text-gray-900 pr-2 sm:pr-4 leading-tight flex-1 min-w-0">
                        {item.question}
                      </span>
                      {openItems.includes(item.id) ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-500 flex-shrink-0 ml-2 transition-transform duration-200" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500 flex-shrink-0 ml-2 transition-transform duration-200" />
                      )}
                    </Button>
                    
                    {openItems.includes(item.id) && (
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 animate-in slide-in-from-top-2 duration-300">
                        <div className="border-t border-gray-200 pt-3 sm:pt-4">
                          <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base break-words">
                            {item.hasLink ? (
                              <>
                                ❤️ Rất cảm ơn bạn! Bạn có thể đăng ký tại mục &ldquo;Đóng góp & Tài trợ&rdquo; trên website hoặc liên hệ trực tiếp Ban Tổ Chức qua{' '}
                                mục{' '}
                                <a 
                                  href="/contact" 
                                  className="text-primary hover:text-primary/80 transition-colors duration-200 font-semibold"
                                >
                                  Liên hệ & Kết nối
                                </a>
                                . Chúng tôi sẽ phản hồi với các hình thức tài trợ phù hợp: hiện vật, hiện kim, sản phẩm, dịch vụ hoặc ý tưởng.
                              </>
                            ) : (
                              item.answer
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div 
            className={`mt-8 sm:mt-12 transition-all duration-700 ease-out delay-1000 ${
              isLoaded 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <Card className="bg-primary/5 border-primary/20 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
              <CardContent className="p-4 sm:p-6 text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  Vẫn còn thắc mắc?
                </h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                  Nếu bạn có câu hỏi khác, đừng ngần ngại liên hệ với chúng tôi
                </p>
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors duration-200 text-sm sm:text-base"
                >
                  Liên hệ Ban Tổ Chức
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 