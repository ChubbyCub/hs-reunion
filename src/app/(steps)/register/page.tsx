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
  class: z.string().min(1, { message: "Please select your class." }),
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
    router.push("/merchandise");
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
            name="class"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-form">{t('classLabel')}</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 font-form text-base md:text-sm"
                  >
                    <option value="" className="text-muted-foreground">{t('classPlaceholder')}</option>
                    <option value="12A1">12A1</option>
                    <option value="12A2">12A2</option>
                    <option value="12A3">12A3</option>
                    <option value="12A4">12A4</option>
                    <option value="12A5">12A5</option>
                    <option value="12A6">12A6</option>
                    <option value="12A7">12A7</option>
                    <option value="12A8">12A8</option>
                    <option value="12B1">12B1</option>
                    <option value="12B2">12B2</option>
                    <option value="12B3">12B3</option>
                    <option value="12B4">12B4</option>
                    <option value="12B5">12B5</option>
                    <option value="12C">12C</option>
                    <option value="12CA">12CA</option>
                    <option value="12CH">12CH</option>
                    <option value="12CL">12CL</option>
                    <option value="12CS">12CS</option>
                    <option value="12CT">12CT</option>
                    <option value="12CTC">12CTC</option>
                    <option value="12CTIN">12CTIN</option>
                    <option value="12D1">12D1</option>
                    <option value="12D2">12D2</option>
                    <option value="12D3">12D3</option>
                    <option value="12D4">12D4</option>
                    <option value="12D5">12D5</option>
                    <option value="12NT">12NT</option>
                    <option value="12SN1">12SN1</option>
                    <option value="12SN2">12SN2</option>
                  </select>
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