"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Product } from "@/app/types/type";
import { ProductFormData, productSchema } from "@/app/validation/schemas/product";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("product_data_session");
    if (!stored) {
      router.push("/products");
      return;
    }

    const products: Product[] = JSON.parse(stored);
    const found = products.find((p) => p.id === Number(id));
    if (found) {
      setProduct(found);
      form.reset(found);
    } else {
      router.push("/products");
    }
  }, [id, form, router]);

  const onSubmit = async (data: ProductFormData) => {
    if (!product) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const updatedProduct: Product = { ...product, ...data };
      
      const stored = sessionStorage.getItem("product_data_session");
      if (stored) {
        const products: Product[] = JSON.parse(stored);
        const updatedList = products.map((p) =>
          p.id === product.id ? updatedProduct : p
        );
        sessionStorage.setItem("product_data_session", JSON.stringify(updatedList));
      }
      router.push(`/products/${product.id}`);
      router.refresh(); 
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="shadow-lg rounded-2xl border border-gray-200">
        <CardHeader className="bg-indigo-50 border-b border-gray-200 rounded-t-2xl p-6">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Edit Product
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title
              </Label>
              <Input
                id="title"
                {...form.register("title")}
                className={form.formState.errors.title ? "border-red-500" : ""}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...form.register("price", { valueAsNumber: true })}
                className={form.formState.errors.price ? "border-red-500" : ""}
              />
              {form.formState.errors.price && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                {...form.register("description")}
                rows={5}
                className={form.formState.errors.description ? "border-red-500" : ""}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Input
                id="category"
                {...form.register("category")}
                className={form.formState.errors.category ? "border-red-500" : ""}
              />
              {form.formState.errors.category && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={form.watch("status") || ""}
                onValueChange={(value) =>
                  form.setValue("status", value as "Available" | "Out of Stock", {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger
                  id="status"
                  className={form.formState.errors.status ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.status && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.status.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-medium">
                Image URL
              </Label>
              <Input
                id="image"
                {...form.register("image")}
                className={form.formState.errors.image ? "border-red-500" : ""}
              />
              {form.formState.errors.image && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.image.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push(`/products/${product.id}`)}
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