"use client";

import React, { useState } from "react";
import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  initialType: string;
  clientId: string;
}

const formSchema = z.object({
  clientType: z.enum(["REGULAR", "PROFESSIONAL"], {
    required_error: "Client type is required!",
  }),
});

const ClientTypeForm = ({ initialType, clientId }: Props) => {
  const [isEditting, setIsEditting] = useState(false);
  const [isDisabled, setIsDisabled] = useState(initialType !== "REGULAR"); // Disable if already changed
  const router = useRouter();

  const toggleEdit = () => setIsEditting((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientType: initialType,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/clients/${clientId}`, values);
      toast.success("Client type updated successfully!");
      toggleEdit();
      setIsDisabled(true); // Disable input after successful change
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <span>Client Type</span>
        {!isDisabled && (
          <Button variant="ghost" onClick={toggleEdit}>
            {isEditting ? (
              <>
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Type
              </>
            )}
          </Button>
        )}
      </div>

      {!isEditting && (
        <p className={cn("text-sm", isDisabled ? "mt-4" : "mt-2")}>
          {initialType}
        </p>
      )}
      {isEditting && !isDisabled && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="clientType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select client type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="REGULAR">Regular</SelectItem>
                        <SelectItem value="PROFESSIONAL">
                          Professional
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ClientTypeForm;
