"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Product } from "@/app/types/type";
import { ProductFormData, productSchema } from "@/app/validation/schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });
  useEffect(() => {
    const stored = sessionStorage.getItem("product_data_session");
    if (!stored) return;

    const products: Product[] = JSON.parse(stored);
    const found = products.find((p) => p.id === Number(id));
    if (found) {
      setProduct(found);
      form.reset(found);
    }
  }, [id]);

  const onSubmit = async (data: ProductFormData) => {
    if (!product) return;
    await fetch(`https://fakestoreapi.com/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const updatedProduct: Product = { ...product, ...data };
    const stored = sessionStorage.getItem("product_data_session");
    if (!stored) return;
    const products: Product[] = JSON.parse(stored);
    const updatedList = products.map((p) =>
      p.id === product.id ? updatedProduct : p
    );
    sessionStorage.setItem("product_data_session", JSON.stringify(updatedList));
    router.push(`/products/${product.id}`);
  };

  if (!product) return <div className="p-6 text-center text-lg">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="shadow-white rounded-2xl border border-gray-200">
        <CardHeader className="bg-indigo-50 border-b border-gray-200 rounded-t-2xl p-6">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Edit Product
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1">
              <Label>Title</Label>
              <Input {...form.register("title")} />
            </div>

            <div className="space-y-1">
              <Label>Price</Label>
              <Input type="number" {...form.register("price", { valueAsNumber: true })} />
            </div>

            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea {...form.register("description")} rows={5} />
            </div>

            <div className="space-y-1">
              <Label>Category</Label>
              <Input {...form.register("category")} />
            </div>

            <div className="space-y-1">
              <Label>Status</Label>
              <Select
                value={form.watch("status") || ""}
                onValueChange={(value) =>
                  form.setValue("status", value as "Available" | "Out of Stock", { shouldDirty: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Image URL</Label>
              <Input {...form.register("image")} />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md">
                Save
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
