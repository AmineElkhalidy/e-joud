"use client";

import React, { useEffect, useState } from "react";
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

// Define validation schema for the form
const formSchema = z.object({
  fullName: z.string().min(1, { message: "Client name is required!" }),
});

const NewClientPage = () => {
  const router = useRouter();
  const [clients, setClients] = useState([]); // State to store fetched clients
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  // Fetch all clients on component mount
  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await axios.get("/api/clients"); // Fetch existing clients
        setClients(response.data || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast.error("Failed to load clients!");
      }
    }

    fetchClients();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Check if the client already exists
    const clientExists = clients.some(
      (client) =>
        client?.fullName?.toLowerCase() === values.fullName.toLowerCase()
    );

    if (clientExists) {
      toast.error("This client already exists!");
      return;
    }

    // Proceed with creating the client
    try {
      const response = await axios.post("/api/clients", values);
      router.push(`/clients/${response?.data?.id}`);
      toast.success("Client added successfully!");
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Something went wrong!");
    }
  }

  return (
    <div className="max-w-5xl mx-auto h-full p-6 flex md:items-center md:justify-center">
      <div className="w-full h-full">
        <h1 className="text-2xl font-semibold">Add a New Client</h1>
        <p className="text-sm text-muted-foreground">
          Please provide the client's full name. <br /> You can update other
          details later.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            {/* Full Name Field */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="e.g., 'John Doe'"
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

export default NewClientPage;
