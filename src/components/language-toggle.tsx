"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { usePathname } from "next-intl/client";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    router.replace(`/${newLocale}${pathname}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleLanguageChange("en")}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          locale === "en"
            ? "bg-primary text-primary-foreground"
            : "text-gray-500 hover:bg-gray-200"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange("vi")}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          locale === "vi"
            ? "bg-primary text-primary-foreground"
            : "text-gray-500 hover:bg-gray-200"
        }`}
      >
        VI
      </button>
    </div>
  );
} 