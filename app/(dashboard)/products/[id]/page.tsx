"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Product } from "@/app/types/type";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Rating from "@/components/ui/rating";

export default function ProductViewPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const colors = ["Red", "Blue", "Green", "Pink", "Black"];
  const sizes = ["S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const stored = sessionStorage.getItem("product_data_session");
        if (stored) {
          const products: Product[] = JSON.parse(stored);
          const found = products.find((p) => p.id === Number(id));
          if (found) {
            setProduct(found);
            setLoading(false);
            return;
          }
        }

        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await res.json();

        const formatted: Product = {
          id: data.id,
          title: data.title,
          price: data.price,
          category: data.category,
          status: "Available",
          image: data.image,
          description: data.description,
          rating: data.rating,
        };

        setProduct(formatted);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center text-lg font-medium">Loading...</div>;
  }

  if (!product) {
    return <div className="p-6 text-center text-lg font-medium">Product not found</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card className="flex flex-col md:flex-row bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="relative w-full md:w-1/2 h-80 md:h-[500px] flex-shrink-0 bg-gray-50">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-4"
            priority
          />
        </div>

        <CardContent className="w-full md:w-1/2 p-6 md:p-8 flex flex-col space-y-4">
          <CardHeader className="p-0">
            <CardTitle className="text-3xl md:text-4xl font-bold">{product.title}</CardTitle>
          </CardHeader>

          <p className="text-2xl font-semibold text-indigo-600">NPR {product.price}</p>
          <p className="text-gray-500">Category: {product.category}</p>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-green-600 text-white text-sm">{product.status}</span>

            <Rating rate={product.rating?.rate ?? 0} />
            <span className="text-sm text-gray-500">({product.rating?.count ?? 0})</span>
          </div>

          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          <div>
            <p className="font-medium text-gray-600">Color</p>
            <div className="flex gap-2 mt-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color ? "border-black" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-600">Size</p>
            <div className="flex gap-2 mt-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 rounded border font-medium ${
                    selectedSize === size ? "border-black bg-gray-100" : "border-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <Link href="/products">
              <Button variant="outline">Back</Button>
            </Link>

            <Link href={`/products/${product.id}/edit`}>
              <Button className="bg-indigo-600 hover:bg-indigo-700">Edit</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
