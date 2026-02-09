import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Props } from "@/app/types/type";

export const SummaryCards = ({ data }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {data.map((item, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">
              {item.value}
            </p>
            <p className="text-sm text-green-600 mt-1">
              {item.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
