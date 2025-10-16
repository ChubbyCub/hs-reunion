"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/stores/app-store";
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
  fullName: z.string().min(1, { message: "Họ và tên là bắt buộc." }),
  email: z.string().email({ message: "Vui lòng nhập địa chỉ email hợp lệ." }),
  phone: z.string().min(1, { message: "Số điện thoại là bắt buộc." }),
  class: z.string().min(1, { message: "Vui lòng chọn lớp học của bạn." }),
  occupation: z.string().optional(),
  workplace: z.string().optional(),
});

export default function RegisterPage() {
  const router = useRouter();
  const { formData, updateFormData, setStep } = useAppStore();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: formData.fullName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      class: formData.class || '',
      occupation: formData.occupation || '',
      workplace: formData.workplace || '',
    },
  });

  useEffect(() => {
    if (hasHydrated) {
      form.reset({
        fullName: formData.fullName || '',
        email: formData.email || '',
        phone: formData.phone || '',
        class: formData.class || '',
        occupation: formData.occupation || '',
        workplace: formData.workplace || '',
      });
    }
  }, [hasHydrated, form, formData]);

  // Debounced email check
  useEffect(() => {
    const email = form.watch('email');

    if (!email || !email.includes('@')) {
      setEmailExists(false);
      return;
    }

    setCheckingEmail(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/check-duplicate?email=${encodeURIComponent(email)}`);
        const data = await response.json();
        setEmailExists(data.exists);
      } catch (error) {
        console.error('Error checking email:', error);
      } finally {
        setCheckingEmail(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      setCheckingEmail(false);
    };
  }, [form.watch('email')]);

  // Debounced phone check
  useEffect(() => {
    const phone = form.watch('phone');

    if (!phone || phone.length < 8) {
      setPhoneExists(false);
      return;
    }

    setCheckingPhone(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/check-duplicate?phone=${encodeURIComponent(phone)}`);
        const data = await response.json();
        setPhoneExists(data.exists);
      } catch (error) {
        console.error('Error checking phone:', error);
      } finally {
        setCheckingPhone(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      setCheckingPhone(false);
    };
  }, [form.watch('phone')]);



  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Prevent submission if email or phone already exists
    if (emailExists || phoneExists) {
      return;
    }

    try {
      // Update form data first - no database save here
      updateFormData(values);

      // Proceed to next step - everything will be saved at the final step
      setStep(2);
      router.push("/merchandise");
    } catch (error) {
      console.error('Error updating form data:', error);
      // Still proceed to next step
      setStep(2);
      router.push("/merchandise");
    }
  }

  if (!hasHydrated) return <div>Đang tải...</div>;

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-title tracking-tighter">
          Thông tin cá nhân
        </h1>
        <p className="mt-2 text-muted-foreground font-legalese">
          Vui lòng điền thông tin chi tiết của bạn để đăng ký tham gia sự kiện.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-form">Họ và tên</FormLabel>
                <FormControl>
                  <Input className="font-form" placeholder="Nhập họ và tên của bạn" {...field} />
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
                <FormLabel className="font-form">Địa chỉ email</FormLabel>
                <FormControl>
                  <Input
                    className="font-form"
                    placeholder="Địa chỉ email của bạn"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                {checkingEmail && (
                  <p className="text-sm text-gray-500 mt-1">Đang kiểm tra...</p>
                )}
                {!checkingEmail && emailExists && (
                  <p className="text-sm text-red-600 mt-1">Email này đã được sử dụng. Vui lòng sử dụng email khác.</p>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-form">Số điện thoại</FormLabel>
                <FormControl>
                  <Input
                    className="font-form"
                    placeholder="Số điện thoại của bạn"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                {checkingPhone && (
                  <p className="text-sm text-gray-500 mt-1">Đang kiểm tra...</p>
                )}
                {!checkingPhone && phoneExists && (
                  <p className="text-sm text-red-600 mt-1">Số điện thoại này đã được sử dụng. Vui lòng sử dụng số khác.</p>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-form">Lớp</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 font-form text-base md:text-sm"
                  >
                    <option value="" className="text-muted-foreground">Chọn lớp học của bạn</option>
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
                <FormLabel className="font-form">Nghề nghiệp</FormLabel>
                <FormControl>
                  <Input className="font-form" placeholder="Nghề nghiệp của bạn (không bắt buộc)" {...field} />
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
                <FormLabel className="font-form">Nơi công tác</FormLabel>
                <FormControl>
                  <Input className="font-form" placeholder="Nơi công tác của bạn (không bắt buộc)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="font-form"
              disabled={emailExists || phoneExists || checkingEmail || checkingPhone}
            >
              Tiếp theo
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
} 