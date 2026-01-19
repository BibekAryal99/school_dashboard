
import { Sidebar } from "@/components/Sidebar";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 bg-blue-50 min-h-screen">{children}</main>
      </div>;
}
