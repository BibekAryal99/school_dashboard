"use client";

import React from "react";

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
import useResource from "@/app/hooks/use-resource";

export default function ResourcePage() {
  const { router,
    records,
    setRecords,
    open,
    setOpen,
    editing,
    setEditing,
    form,
    handleSubmit,
    handleEdit,
    handleDelete, } = useResource();

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold">Resources</h2>
            <p className="text-sm text-gray-500 font-semibold">
              Study materials, downloads, links
            </p>
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              form.reset({
                title: "",
                description: "",
                category: "",
                fileUrl: "",
                uploadDate: new Date().toISOString().split("T")[0],
                downloadCount: 0,
              });
              setOpen(true);
            }}
          >
            Add Resource
          </Button>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Resource" : "Add Resource"}
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
                <Label>Description</Label>
                <Input {...form.register("description")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.description?.message}
                </p>
              </div>

              <div>
                <Label>Category</Label>
                <Input {...form.register("category")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.category?.message}
                </p>
              </div>

              <div>
                <Label>File URL</Label>
                <Input {...form.register("fileUrl")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.fileUrl?.message}
                </p>
              </div>

              <div>
                <Label>Upload Date</Label>
                <Input type="date" {...form.register("uploadDate")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.uploadDate?.message}
                </p>
              </div>

              <div>
                <Label>Download Count</Label>
                <Input
                  type="number"
                  {...form.register("downloadCount", { valueAsNumber: true })}
                />
                <p className="text-sm text-red-500">
                  {form.formState.errors.downloadCount?.message}
                </p>
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
                <TableHead>Upload Date</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.title}</TableCell>
                  <TableCell>{record.category}</TableCell>
                  <TableCell>{record.uploadDate}</TableCell>
                  <TableCell>{record.downloadCount}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/resources/${record.id}`)}
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
