"use client";
import Link from "next/link";
import {  usePathname } from "next/navigation";

const sidebarItems = [
  { name: "Dashboard", href: "/" },
  { name: "Student", href: "/students" },
  { name: "Teacher", href: "/teacher" },
  { name: "Courses", href: "/courses" },
  { name: "Assignments", href: "/assignments" },
  { name: "Attendance", href: "/attendence" },
  { name: "Results", href: "/results" },
  { name: "Products", href: "/products" },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-md p-6 flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold text-blue-600 mb-8">Dashboard</h1>

      <nav className="flex-1 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`w-full flex items-center px-4 py-2 rounded-md ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
