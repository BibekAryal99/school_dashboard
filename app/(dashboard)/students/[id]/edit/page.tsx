"use client";
import { Student } from "@/app/types/type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { ToastProvider } from "@radix-ui/react-toast";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const STORAGE_KEY = "students_data";

export default function StudentEditPage() {
  const { toast, ToastContainer } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const id = Number(pathname.split("/")[2]);
  const [student, setStudent] = useState<Student | null>(null);

  const form = useForm<Student>({
    defaultValues: {
      name: "",
      email: "",
      grade: "A",
      joinDate: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const students: Student[] = JSON.parse(stored);
      const s = students.find((s) => s.id === id);
      if (s) {
        setStudent(s);
        form.reset(s);
      }
    }
  }, [id, form]);

  if (!student) return <p className="p-6">Student not found</p>;

  const handleSubmit = (data: Student) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const students: Student[] = JSON.parse(stored);
      const updated = students.map((s) =>
        s.id === id ? { ...s, ...data } : s,
      );
      toast({
        title: "Student Updated",
        description: "Student details updated successfully",
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    setTimeout(() => {
      router.push("/students");
    }, 3000);
  };

  return (
    <ToastProvider>
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <h1 className="text-3xl font-bold">Edit {student.name}</h1>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <Label>Name</Label>
            <Input {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div>
            <Label>Email</Label>
            <Input {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label>Grade</Label>
            <Controller
              control={form.control}
              name="grade"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C+">C+</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="F">F</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label>Join Date</Label>
            <Input type="date" {...form.register("joinDate")} />
          </div>
          <div className="col-span-2 mt-4">
            <Button type="submit">Update Student</Button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </ToastProvider>
  );
}
