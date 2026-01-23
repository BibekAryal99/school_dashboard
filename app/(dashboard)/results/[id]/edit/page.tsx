"use client";
import { Result } from "@/app/types/type";

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

const STORAGE_KEY = "results_data";

export default function ResultEditPage() {
  const { toast, ToastContainer } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const id = Number(pathname.split("/")[2]);
  const [result, setResult] = useState<Result | null>(null);

  const form = useForm<Result>({
    defaultValues: {
      studentName: "",
      examName: "",
      marks:100,
      grade: "A",
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const results: Result[] = JSON.parse(stored);
      const r = results.find((r) => r.id === id);
      if (r) {
        setResult(result);
        form.reset();
      }
    }
  }, [result,form,id]);

  if (!result) return <p className="p-6">Result not found</p>;

  const handleSubmit = (data: Result) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const results: Result[] = JSON.parse(stored);
      const updated = results.map((r) =>
        r.id === id ? { ...r, ...data } : r,
      );
      toast({
        title: "Result Updated",
        description: "Result details updated successfully",
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    setTimeout(() => {
      router.push("/results");
    }, 3000);
  };

  return (
    <ToastProvider>
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <h1 className="text-3xl font-bold">Edit {result.studentName}</h1>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <Label>Name</Label>
            <Input {...form.register("studentName")} />
            {form.formState.errors.studentName && (
              <p className="text-sm text-red-500">
                {form.formState.errors.studentName.message}
              </p>
            )}
          </div>
          <div>
            <Label>Exam Name</Label>
            <Input {...form.register("examName")} />
            {form.formState.errors.examName && (
              <p className="text-sm text-red-500">
                {form.formState.errors.examName.message}
              </p>
            )}
          </div>
          <div>
            <Label>Marks</Label>
            <Input {...form.register("marks", {valueAsNumber:true})} />
            {form.formState.errors.marks && (
              <p className="text-sm text-red-500">
                {form.formState.errors.marks.message}
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
        </form>
      </div>
      <ToastContainer />
    </ToastProvider>
  );
}
