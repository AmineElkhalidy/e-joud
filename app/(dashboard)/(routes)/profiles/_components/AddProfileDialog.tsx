"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const AddProfileDialog = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "USER">("USER");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!firstName || !lastName || !email || !role) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post("/api/profiles", { firstName, lastName, email, role });
      toast.success("User added successfully!");
      setFirstName("");
      setLastName("");
      setEmail("");
      setRole("USER");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-sky-700 duration-300 hover:bg-sky-900">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-xl font-semibold mb-4">
          Add New User
        </DialogTitle>
        <div className="space-y-4">
          <Input
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <Select
              onValueChange={(value) => setRole(value as "ADMIN" | "USER")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="USER">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-sky-700 hover:bg-sky-900"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProfileDialog;
