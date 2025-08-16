"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Simple chevron icons as SVG components
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className || "h-6 w-6 text-gray-500 flex-shrink-0"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronUpIcon = ({ className }: { className?: string }) => (
  <svg className={className || "h-6 w-6 text-gray-500 flex-shrink-0"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
 );

interface FAQItem {
  id: number;
  question: string;
  answer: string;
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
    answer: "📍 Thời gian: Dự kiến tháng 1 năm 2026\n\n📍 Địa điểm: Trường THPT Chuyên Lê Hồng Phong – Số 235 Nguyễn Văn Cừ, P.4, Q.5, TP.HCM\n\n👉 Thời gian cụ thể sẽ được thông báo sau khi BTC thống nhất với nhà trường."
  },
  {
    id: 3,
    question: "Tôi muốn tài trợ hoặc đóng góp, phải làm sao?",
    answer: "❤️ Rất cảm ơn bạn! Bạn có thể đăng ký tại mục \"Đóng góp & Tài trợ\" trên website hoặc liên hệ trực tiếp Ban Tổ Chức qua lhp0306@gmail.com hoặc thông tin ở mục 📞 Liên hệ & Kết nối. Chúng tôi sẽ phản hồi với các hình thức tài trợ phù hợp: hiện vật, hiện kim, sản phẩm, dịch vụ hoặc ý tưởng."
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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-title text-gray-900 mb-4">
              Câu hỏi thường gặp
            </h1>
            <p className="text-lg text-muted-foreground font-legalese">
              Tìm hiểu thêm về sự kiện họp mặt cựu học sinh LHP khóa 2003-2006
            </p>
          </div>

          {/* Toggle All Button */}
          <div className="text-center mb-6">
            <Button
              variant="outline"
              onClick={toggleAll}
              className="font-form px-6 py-2"
            >
              {openItems.length === faqData.length ? "Thu gọn tất cả" : "Mở rộng tất cả"}
            </Button>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqData.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    onClick={() => toggleItem(item.id)}
                    className="w-full h-auto p-6 text-left justify-between hover:bg-gray-50"
                  >
                    <span className="font-semibold text-lg text-gray-900 pr-4">
                      {item.question}
                    </span>
                    {openItems.includes(item.id) ? (
                      <ChevronUpIcon className="h-6 w-6 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDownIcon className="h-6 w-6 text-gray-500 flex-shrink-0" />
                    )}
                  </Button>
                  
                  {openItems.includes(item.id) && (
                    <div className="px-6 pb-6">
                      <div className="border-t border-gray-200 pt-4">
                        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Section */}
          <Card className="mt-12 bg-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Vẫn còn thắc mắc?
              </h3>
              <p className="text-gray-600 mb-4">
                Nếu bạn có câu hỏi khác, đừng ngần ngại liên hệ với chúng tôi
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📧 Email: lhp0306@gmail.com</p>
                <p>📱 Hoặc liên hệ trực tiếp Ban Tổ Chức</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 