"use client";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

const sidebarItems = [
  { name: "Dashboard", href: "/" },
  { name: "Student", href: "/students" },
  { name: "Teacher", href: "/teacher" },
  { name: "Courses", href: "/courses" },
  {name:"Assignments", href:"/assignments"},
  { name: "Attendance", href:"/attendence" },
  { name: "Results", href: "/results" },
  {name:"Products", href:'/products'}
];

export const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-md p-6 flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold text-blue-600 mb-8">Dashboard</h1>

      <nav className="flex-1 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Button
              key={item.name}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start ${
                isActive
                  ? "bg-blue-100"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
              onClick={() => router.push(item.href)}
            >
              {item.name}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
};
