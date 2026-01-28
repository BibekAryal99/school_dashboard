"use client";

import React from "react";
import useMessage from "@/app/hooks/use-message";

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

export default function MessagePage() {
  const {
    router,
    records,
    open,
    setOpen,
    editing,
    setEditing,
    form,
    handleSubmit,
    handleEdit,
    handleDelete,
  } = useMessage();

  const priorityOptions = ["Low", "Medium", "High"];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Messages & Notices</h2>
          <p className="text-sm text-gray-500 font-semibold">
              Announcements from school or teachers
            </p>
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              form.reset({
                title: "",
                content: "",
                sender: "",
                date: new Date().toISOString().split("T")[0],
                priority: "Medium",
                isRead: false,
              });
              setOpen(true);
            }}
          >
            Add Message
          </Button>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Message" : "Add Message"}
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
                <Label>Content</Label>
                <Input {...form.register("content")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.content?.message}
                </p>
              </div>

              <div>
                <Label>Sender</Label>
                <Input {...form.register("sender")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.sender?.message}
                </p>
              </div>

              <div>
                <Label>Date</Label>
                <Input type="date" {...form.register("date")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.date?.message}
                </p>
              </div>

              <div>
                <Label>Priority</Label>
                <select
                  {...form.register("priority")}
                  className="w-full border rounded-md p-2"
                >
                  {priorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...form.register("isRead")}
                  id="isRead"
                  className="w-4 h-4"
                />
                <Label htmlFor="isRead" className="text-base">
                  Mark as Read
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
                <TableHead>Sender</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.title}</TableCell>
                  <TableCell>{record.sender}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.priority}</TableCell>
                  <TableCell>{record.isRead ? "Read" : "Unread"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/messages/${record.id}`)}
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
                              <AlertDialogTitle>
                                Confirm Delete
                              </AlertDialogTitle>
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
