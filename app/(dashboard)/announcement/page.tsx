"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AnnouncementType } from "@/app/types/announcement";
import {
  AnnouncementFormData,
  announcementSchema,
} from "@/app/validation/schemas/announcement";

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
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AnnouncementPage() {
  const router = useRouter();

  const [records, setRecords] = useState<AnnouncementType[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AnnouncementType | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("announcement_data");
    setRecords(stored ? JSON.parse(stored) : []);
   setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("announcement_data", JSON.stringify(records));
    }
  }, [records, mounted]);

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      message: "",
      category: "General",
      publishedDate: "",
      isPinned:false,
    },
  });

  if (!mounted) return null;

  const handleSubmit = (data: AnnouncementFormData) => {
    if (editing) {
      setRecords((prev) =>
        prev.map((r) => (r.id === editing.id ? { ...r, ...data } : r))
      );
    } else {
      setRecords((prev) => [...prev, { id: Date.now(), ...data }]);
    }
    setOpen(false);
    setEditing(null);
    form.reset();
  };
  const handleEdit = (record: AnnouncementType) => {
    setEditing(record);
    form.reset({
      title: record.title,
      message: record.message,
      category: record.category,
      publishedDate: record.publishedDate,
      isPinned: record.isPinned || false,
    });
    setOpen(true);
  };
  const handleDelete = (id: number) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Announcements</h2>
          <p className="text-sm text-gray-500 font-semibold">
            Manage school announcements & notices
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            form.reset();
            setOpen(true);
          }}
        >
          Add Announcement
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Announcement" : "Add Announcement"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div>
              <Label>Title</Label>
              <Input {...form.register("title")} />
              <p className="text-sm text-red-500">
                {form.formState.errors.title?.message}
              </p>
            </div>

            <div>
              <Label>Message</Label>
              <Input {...form.register("message")} />
              <p className="text-sm text-red-500">
                {form.formState.errors.message?.message}
              </p>
            </div>

            <div>
              <Label>Category</Label>
              <select
                {...form.register("category")}
                className="w-full border rounded-md p-2"
              >
                <option value="General">General</option>
                <option value="Exam">Exam</option>
                <option value="Event">Event</option>
                <option value="Holiday">Holiday</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <Label>Published Date</Label>
              <Input type="date" {...form.register("publishedDate")} />
              <p className="text-sm text-red-500">
                {form.formState.errors.publishedDate?.message}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...form.register("isPinned")}
                id="isPinned"
                className="w-4 h-4"
              />
              <Label htmlFor="isPinned" className="text-base">
                Pin Announcement
              </Label>
            </div>

            <Button type="submit" className="w-full">
              {editing ? "Update" : "Add"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border bg-white mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Pinned</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.title}</TableCell>
                <TableCell>{record.category}</TableCell>
                <TableCell>{record.publishedDate}</TableCell>
                <TableCell>{record.isPinned ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/announcement/${record.id}`)
                        }
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(record)}>
                        Edit
                      </DropdownMenuItem>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => handleDelete(record.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
