"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProfilesListProps {
  users: { id: string; fullName: string; email: string; role: string }[];
}

const ProfilesList = ({ users }: ProfilesListProps) => {
  const [nameFilter, setNameFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const filteredUsers = users.filter((user) => {
    const matchesName = user.fullName
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    return matchesName && matchesRole;
  });

  const handleRemove = async (id: string) => {
    try {
      await axios.delete(`/api/profiles/${id}`);
      toast.success("User removed successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove user.");
    }
  };

  return (
    <div>
      {/* Filter Inputs */}
      <div className="flex items-center gap-4 pb-4">
        {/* Filter by Full Name */}
        <Input
          placeholder="Filter by Full Name..."
          value={nameFilter}
          onChange={(event) => setNameFilter(event.target.value)}
          className="max-w-sm"
        />
        {/* Filter by Role */}
        <Select
          onValueChange={(value) => setRoleFilter(value === "ALL" ? "" : value)}
          value={roleFilter || "ALL"}
        >
          <SelectTrigger className="max-w-sm">
            <SelectValue placeholder="Filter by Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="USER">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        user?.role === "ADMIN"
                          ? "bg-green-600 hover:bg-green-600"
                          : "bg-red-600 hover:bg-red-600"
                      )}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemove(user.id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm">
          Previous
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProfilesList;
