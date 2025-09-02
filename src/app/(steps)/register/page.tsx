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
  firstName: z.string().min(1, { message: "Tên là bắt buộc." }),
  lastName: z.string().min(1, { message: "Họ là bắt buộc." }),
  email: z.string().email({ message: "Vui lòng nhập địa chỉ email hợp lệ." }),
  phone: z.string().min(1, { message: "Số điện thoại là bắt buộc." }),
  class: z.string().min(1, { message: "Vui lòng chọn lớp học của bạn." }),
  occupation: z.string().optional(),
  workplace: z.string().optional(),
  receiveUpdates: z.boolean(),
});

export default function RegisterPage() {
  const router = useRouter();
  const { formData, updateFormData, setStep } = useAppStore();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [originalData, setOriginalData] = useState(formData);

  useEffect(() => {
    setHasHydrated(true);
    setOriginalData(formData);
  }, [formData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...formData,
      receiveUpdates: formData.receiveUpdates || false,
    },
  });

  useEffect(() => {
    if (hasHydrated) {
      form.reset(formData);
    }
  }, [hasHydrated, form, formData]);

  // Check if form data has changed from original
  const hasDataChanged = (currentValues: z.infer<typeof formSchema>) => {
    return Object.keys(currentValues).some(key => {
      const k = key as keyof z.infer<typeof formSchema>;
      return currentValues[k] !== originalData[k];
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Update form data first
      updateFormData(values);
      
      // Check if we're updating an existing attendee or creating a new one
      const { saveToDatabase, updateInDatabase, formData } = useAppStore.getState();
      
      if (formData.attendeeId) {
        // Only update if data has actually changed
        if (hasDataChanged(values)) {
          await updateInDatabase();
        }
      } else {
        // Create new attendee
        await saveToDatabase();
      }
      
      // Proceed to next step
      setStep(2);
      router.push("/merchandise");
    } catch (error) {
      console.error('Error saving attendee data:', error);
      // Still proceed to next step, data can be saved later
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-form">Tên</FormLabel>
                  <FormControl>
                    <Input className="font-form" placeholder="Tên của bạn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-form">Họ</FormLabel>
                  <FormControl>
                    <Input className="font-form" placeholder="Họ của bạn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-form">Địa chỉ email</FormLabel>
                <FormControl>
                  <Input className="font-form" placeholder="Địa chỉ email của bạn" {...field} />
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
                <FormLabel className="font-form">Số điện thoại</FormLabel>
                <FormControl>
                  <Input className="font-form" placeholder="Số điện thoại của bạn" {...field} />
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
          {/* Newsletter Subscription Checkbox */}
          <FormField
            control={form.control}
            name="receiveUpdates"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-1"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-form text-sm">
                    Tôi muốn nhận thông tin sự kiện qua email hoặc Zalo
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Chúng tôi sẽ gửi thông tin cập nhật về sự kiện và các hoạt động liên quan
                  </p>
                </div>
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button type="submit" className="font-form">Tiếp theo</Button>
          </div>
        </form>
      </Form>
    </>
  );
} 