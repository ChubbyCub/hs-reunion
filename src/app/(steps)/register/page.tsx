"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFormData(values);
    setStep(2);
    router.push("/merchandise");
  }

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-title tracking-tighter">
          Personal Information
        </h1>
        <p className="mt-2 text-muted-foreground font-legalese">
          Please fill in your details to register for the event.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-form">Full Name</FormLabel>
                <FormControl>
                  <Input className="font-form" placeholder="Your full name" {...field} />
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
                <FormLabel className="font-form">Email Address</FormLabel>
                <FormControl>
                  <Input className="font-form" placeholder="Your email address" {...field} />
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
                <FormLabel className="font-form">Phone Number</FormLabel>
                <FormControl>
                  <Input className="font-form" placeholder="Your phone number" {...field} />
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
                <FormLabel className="font-form">Occupation</FormLabel>
                <FormControl>
                  <Input className="font-form" placeholder="Your occupation (optional)" {...field} />
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
                <FormLabel className="font-form">Workplace</FormLabel>
                <FormControl>
                  <Input className="font-form" placeholder="Your workplace (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" className="font-form">Next</Button>
          </div>
        </form>
      </Form>
    </>
  );
} 