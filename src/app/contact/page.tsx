"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MessageCircle, Heart, Globe, Facebook } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
              Liên lạc & Kết nối
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground font-legalese px-2">
              Kết nối với Ban Tổ Chức và cộng đồng cựu học sinh LHP khóa 2003-2006
            </p>
          </div>

          {/* Main Contact Information */}
          <div 
            className={`mb-8 transition-all duration-700 ease-out delay-200 ${
              isLoaded 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <Card className="bg-primary/5 border-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                    Mọi góp ý, đóng góp hoặc thắc mắc, xin vui lòng liên hệ Ban Tổ Chức qua các kênh sau:
                  </h2>
                </div>

                {/* Direct Contact - Organizing Committee */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {/* Nguyễn Công Hoàng Yến */}
                    <div 
                      className={`transition-all duration-700 ease-out delay-400 ${
                        isLoaded 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-8'
                      }`}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                        <CardContent className="p-4 sm:p-6 text-center">
                          <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">
                            Nguyễn Công Hoàng Yến
                          </h4>
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center justify-center">
                              <Phone className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                              <a href="https://zalo.me/0909023864" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-primary transition-colors text-sm">
                                0909 023 864
                              </a>
                            </div>
                            <div className="flex items-center justify-center">
                              <Mail className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                              <a href="mailto:yennguyen020814@gmail.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-primary transition-colors text-sm">
                                yennguyen020814@gmail.com
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Phạm Thị Minh Trân */}
                    <div 
                      className={`transition-all duration-700 ease-out delay-500 ${
                        isLoaded 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-8'
                      }`}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                        <CardContent className="p-4 sm:p-6 text-center">
                          <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">
                            Phạm Thị Minh Trân
                          </h4>
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center justify-center">
                              <Phone className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                              <a href="https://zalo.me/0908506586" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-primary transition-colors text-sm">
                                0908 506 586
                              </a>
                            </div>
                            <div className="flex items-center justify-center">
                              <Mail className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                              <a href="mailto:ptminhtran@gmail.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-primary transition-colors text-sm">
                                ptminhtran@gmail.com
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Khổng Nhã Kiều */}
                    <div 
                      className={`transition-all duration-700 ease-out delay-600 ${
                        isLoaded 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-8'
                      }`}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                        <CardContent className="p-4 sm:p-6 text-center">
                          <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">
                            Khổng Nhã Kiều
                          </h4>
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center justify-center">
                              <Phone className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                              <a href="https://zalo.me/0913659477" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-primary transition-colors text-sm">
                                0913 659 477
                              </a>
                            </div>
                            <div className="flex items-center justify-center">
                              <Mail className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                              <a href="mailto:nhakieu.khong@gmail.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-primary transition-colors text-sm">
                                nhakieu.khong@gmail.com
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Community Connection */}
                <div 
                  className={`mb-8 transition-all duration-700 ease-out delay-700 ${
                    isLoaded 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center flex items-center justify-center">
                    <Globe className="h-5 w-6 text-primary mr-2" />
                    Kết nối cộng đồng:
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Email Contact */}
                    <div 
                      className={`transition-all duration-700 ease-out delay-800 ${
                        isLoaded 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-8'
                      }`}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                        <CardContent className="p-4 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Mail className="h-5 w-5 text-red-500 mr-2" />
                            <h4 className="font-semibold text-gray-900 text-sm">Email BTC</h4>
                          </div>
                          <a 
                            href="mailto:lhp0306@gmail.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors text-sm break-all"
                          >
                            lhp0306@gmail.com
                          </a>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Zalo Group */}
                    <div 
                      className={`transition-all duration-700 ease-out delay-900 ${
                        isLoaded 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-8'
                      }`}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                        <CardContent className="p-4 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <MessageCircle className="h-5 w-5 text-blue-500 mr-2" />
                            <h4 className="font-semibold text-gray-900 text-sm">Zalo Group</h4>
                          </div>
                          <a 
                            href="https://zalo.me/g/yrzikb642" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors text-xs break-all"
                          >
                            zalo.me/g/yrzikb642
                          </a>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Facebook Group */}
                    <div 
                      className={`transition-all duration-700 ease-out delay-1000 ${
                        isLoaded 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-8'
                      }`}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                        <CardContent className="p-4 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Facebook className="h-5 w-5 text-blue-600 mr-2" />
                            <h4 className="font-semibold text-gray-900 text-sm">Facebook Group</h4>
                          </div>
                          <a 
                            href="https://web.facebook.com/groups/lhp0306" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors text-xs break-all"
                          >
                            facebook.com/groups/lhp0306
                          </a>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Thank You Message */}
                <div 
                  className={`text-center transition-all duration-700 ease-out delay-1100 ${
                    isLoaded 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                >
                  <div className="flex items-center justify-center mb-3">
                    <Heart className="h-5 w-6 text-red-500 mr-2" />
                    <span className="text-base sm:text-lg font-semibold text-gray-900">Cảm ơn bạn!</span>
                  </div>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base">Mỗi đóng góp nhỏ của bạn sẽ góp phần làm nên kỷ niệm lớn của chúng ta.</p>
                  <p className="text-base sm:text-lg font-semibold text-primary">Hẹn gặp lại tại Trạm Ký Ức – Chạm Ước Mơ 0306!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
