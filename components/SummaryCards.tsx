import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
<<<<<<< HEAD
import type { SummaryCard, Props } from "@/app/types/type";
=======
>>>>>>> c53e6bb3105ea3cdd7f65b4e6265a0b8acc1b6e1

export const SummaryCards = ({ data }) => {
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
