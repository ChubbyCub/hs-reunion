"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(1, { message: "Phone number is required." }),
  occupation: z.string().optional(),
  workplace: z.string().optional(),
});

export default function RegisterPage() {
  const router = useRouter();
  const { formData, updateFormData, setStep } = useAppStore();
  const t = useTranslations('RegisterForm');
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });

  useEffect(() => {
    if (hasHydrated) {
      form.reset(formData);
    }
  }, [hasHydrated]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFormData(values);
    setStep(2);
    router.push("/donation");
  }

  if (!hasHydrated) return <div>Loading...</div>;

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-title tracking-tighter">
          {t('title')}
        </h1>
        <p className="mt-2 text-muted-foreground font-legalese">
          {t('description')}
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-form">{t('fullNameLabel')}</FormLabel>
                <FormControl>
                  <Input className="font-form" placeholder={t('fullNamePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-form">{t('emailLabel')}</FormLabel>
                <FormControl>
                  <Input className="font-form" placeholder={t('emailPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-form">{t('phoneLabel')}</FormLabel>
                <FormControl>
                  <Input className="font-form" placeholder={t('phonePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-form">{t('occupationLabel')}</FormLabel>
                <FormControl>
                  <Input className="font-form" placeholder={t('occupationPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workplace"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-form">{t('workplaceLabel')}</FormLabel>
                <FormControl>
                  <Input className="font-form" placeholder={t('workplacePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" className="font-form">{t('nextButton')}</Button>
          </div>
        </form>
      </Form>
    </>
  );
} 