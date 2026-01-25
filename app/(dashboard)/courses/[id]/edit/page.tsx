"use client";
import { Course } from "@/app/types/course";
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

const STORAGE_KEY = "course_data";

export default function CourseEditPage() {
  const { toast, ToastContainer } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const id = Number(pathname.split("/")[2]);
  const [course, setCourse] = useState<Course | null>(null);

  const form = useForm<Course>({
    defaultValues: {
      name: "",
      instructor:"",
      students:0,
      status:"Active",
      joinDate: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const courses: Course[] = JSON.parse(stored);
      const c = courses.find((c) => c.id === id);
      if (c) {
        setCourse(c);
        form.reset(c);
      }
    }
  }, [id, form]);

  if (!course) return <p className="p-6">Course not found</p>;

  const handleSubmit = (data: Course) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const courses: Course[] = JSON.parse(stored);
      const updated = courses.map((c) =>
        c.id === id ? { ...c, ...data } : c,
      );
      toast({
        title: "Course Updated",
        description: "Course details updated successfully",
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    setTimeout(() => {
      router.push("/courses");
    }, 3000);
  };

  return (
    <ToastProvider>
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <h1 className="text-3xl font-bold">Edit {course.name}</h1>
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
            <Label>Instructor</Label>
            <Input {...form.register("instructor")} />
            {form.formState.errors.instructor && (
              <p className="text-sm text-red-500">
                {form.formState.errors.instructor.message}
              </p>
            )}
          </div>
          <div>
            <Label>Status</Label>
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
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
            <Button type="submit">Update Course</Button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </ToastProvider>
  );
}
