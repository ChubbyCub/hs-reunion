"use client";

import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import React from "react";
import { useTranslations } from 'next-intl';

interface StepperProps {
  steps: string[]; // keys for translation
}

export function Stepper({ steps }: StepperProps) {
  const { currentStep } = useAppStore();
  const t = useTranslations('Stepper');

  return (
    <div className="flex w-full items-center">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = currentStep > stepNumber;
        const isActive = currentStep === stepNumber;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center text-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full font-bold",
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isActive
                    ? "border-2 border-primary text-primary"
                    : "border-2 border-gray-300 bg-gray-100 text-gray-500"
                )}
              >
                {isCompleted ? t('checkmark', { defaultValue: '✓' }) : stepNumber}
              </div>
              <p
                className={cn(
                  "mt-2 text-sm",
                  isActive ? "font-bold text-primary" : "text-gray-500"
                )}
              >
                {t(step)}
              </p>
            </div>

            {/* Connector line */}
            {stepNumber < steps.length && (
              <div
                className={cn(
                  "mx-4 h-1 flex-1 rounded-full",
                  isCompleted ? "bg-primary" : "bg-gray-300"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
} 