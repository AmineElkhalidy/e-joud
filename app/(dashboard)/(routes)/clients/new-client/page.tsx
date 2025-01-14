"use client";

import React from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  fullName: z.string().min(1, {
    message: "Client full name is required!",
  }),
});

const CreateClientPage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post("/api/clients", values);
      router.push(`/clients/${response?.data?.id}`);
      toast.success("Client added successfully!");
    } catch {
      toast.error("Something went wrong!");
    }
  }

  return (
    <div className="max-w-5xl mx-auto h-full p-6 flex md:items-center md:justify-center">
      <div className="w-full h-full">
        <h1 className="text-2xl font-semibold">Name your client</h1>
        <p className="text-sm text-muted-foreground">
          What would you like to name your client?
          <br /> Don&apos;t worry, you can change it later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="e.g 'Amine Elkhalidy'"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Link href="/clients">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                className="bg-sky-700 duration-300 hover:bg-sky-900"
                disabled={!isValid || isSubmitting}
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateClientPage;
