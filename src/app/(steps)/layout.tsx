"use client";

import { Stepper } from "@/components/ui/stepper";

const steps = ["personalInfo", "merchandise", "donate", "payment"];

export default function StepsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center py-12">
      <div className="w-full max-w-4xl">
        <div className="hidden md:block">
          <Stepper steps={steps} />
        </div>
        <div className="mt-12 rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
} 