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
import useSetting from "@/app/hooks/use-setting";

export default function SettingPage() {
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
  } = useSetting();

  const settingOptions = ["public", "private"];
  const themeOptions = ["Light", "Dark", "Auto"];

  
  return (
    
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold">Settings</h2>
            <p className="text-sm text-gray-500 font-semibold">
              Preferences, account management
            </p>
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              form.reset({
                userId: "",
                notificationsEnabled: true,
                theme: "Auto",
                language: "English",
                privacy: "Private",
                twoFactorAuth: false,
                lastModified: new Date().toISOString().split("T")[0],
              });
              setOpen(true);
            }}
          >
            Add Setting
          </Button>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Setting" : "Add Setting"}
              </DialogTitle>
            </DialogHeader>

            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div>
                <Label>User ID</Label>
                <Input {...form.register("userId")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.userId?.message}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...form.register("notificationsEnabled")}
                  id="notificationsEnabled"
                  className="w-4 h-4"
                />
                <Label htmlFor="notificationsEnabled" className="text-base">
                  Enable Notifications
                </Label>
              </div>

              <div>
                <Label>Theme</Label>
                <select
                  {...form.register("theme")}
                  className="w-full border rounded-md p-2"
                >
                 {themeOptions.map((theme) => (
                   <option key={theme} value={theme}>{theme}</option>
                 ))} 
                </select>
              </div>

              <div>
                <Label>Language</Label>
                <Input {...form.register("language")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.language?.message}
                </p>
              </div>

              <div>
                <Label>Privacy</Label>
                <select
                  {...form.register("privacy")}
                  className="w-full border rounded-md p-2"
                >
                  {settingOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...form.register("twoFactorAuth")}
                  id="twoFactorAuth"
                  className="w-4 h-4"
                />
                <Label htmlFor="twoFactorAuth" className="text-base">
                  Enable Two Factor Auth
                </Label>
              </div>

              <div>
                <Label>Last Modified</Label>
                <Input type="date" {...form.register("lastModified")} />
                <p className="text-sm text-red-500">
                  {form.formState.errors.lastModified?.message}
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
                <TableHead>User ID</TableHead>
                <TableHead>Notifications</TableHead>
                <TableHead>Theme</TableHead>
                <TableHead>Privacy</TableHead>
                <TableHead>2FA</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.userId}</TableCell>
                  <TableCell>
                    {record.notificationsEnabled ? "Enabled" : "Disabled"}
                  </TableCell>
                  <TableCell>{record.theme}</TableCell>
                  <TableCell>{record.privacy}</TableCell>
                  <TableCell>
                    {record.twoFactorAuth ? "Enabled" : "Disabled"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/settings/${record.id}`)}
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
