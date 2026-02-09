import { SummaryCards } from "@/components/SummaryCards";

export default function DashboardPage() {
  const statsData = [
    { title: "Total Students", value: "1,234", change: "+12% from last month" },
    { title: "Total Teachers", value: "89", change: "+5% from last month" },
    { title: "Active Courses", value: "24", change: "+2% from last month" },
    { title: "Attendance Rate", value: "94.2%", change: "+3.1% from last month" },
  ];

  const recentActivity = [
    { name: "John Smith", action: "Enrolled in Math 101", time: "10 mins ago" },
    { name: "Emma Johnson", action: "Submitted Assignment", time: "25 mins ago" },
    { name: "Michael Brown", action: "Received Grade Update", time: "1 hour ago" },
    { name: "Sarah Davis", action: "Attended Physics Lecture", time: "2 hours ago" },
  ];

  const upcomingEvents = [
    { title: "Midterm Examinations", date: "March 15-22, 2023", description: "All students are required to attend." },
    { title: "Parent-Teacher Meeting", date: "March 25-27, 2023", description: "Schedule meetings to discuss student progress." },
    { title: "Science Fair", date: "April 5, 2023", description: "Students will present their science projects." },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back!</p>
      </div>

      <SummaryCards data={statsData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Enrollment</h2>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Chart visualization would appear here.</p>
              <p className="text-gray-400 text-sm ml-2">Interactive charts showing enrollment trends</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.name}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-medium text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.date}</p>
                <p className="text-sm text-gray-500">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
