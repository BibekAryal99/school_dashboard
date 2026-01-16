"use client";

import React from "react";

import { DashboardLayout } from "@/app/DashboardLayout";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/app/(dashboard)/navbar/page";

export default function DashboardPage() {
  const stats = [
    { title: "Total Students", value: "1,234", change: "+12%", color: "bg-blue-500" },
    { title: "Total Teachers", value: "89", change: "+5%", color: "bg-green-500" },
    { title: "Active Courses", value: "24", change: "+2%", color: "bg-purple-500" },
    { title: "Attendance Rate", value: "94.2%", change: "+3.1%", color: "bg-orange-500" },
  ];

  const recentActivity = [
    { id: 1, name: "John Smith", action: "Enrolled in Math 101", time: "10 mins ago" },
    { id: 2, name: "Emma Johnson", action: "Submitted Assignment", time: "25 mins ago" },
    { id: 3, name: "Michael Brown", action: "Received Grade Update", time: "1 hour ago" },
    { id: 4, name: "Sarah Davis", action: "Attended Physics Lecture", time: "2 hours ago" },
  ];

  const upcomingEvents = [
    { title: "Midterm Examinations", date: "March 15-22, 2023", description: "All students are required to attend.", color: "bg-blue-100", dotColor: "bg-blue-600" },
    { title: "Parent-Teacher Meeting", date: "March 25-27, 2023", description: "Schedule meetings to discuss student progress.", color: "bg-green-100", dotColor: "bg-green-600" },
    { title: "Science Fair", date: "April 5, 2023", description: "Students will present their science projects.", color: "bg-purple-100", dotColor: "bg-purple-600" },
  ];

  return (
    <DashboardLayout>
      <Navbar />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome back!</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-lg p-3 ${stat.color}`} />
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-500 truncate">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
              <div className="border-t px-6 py-3 bg-muted">
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-green-600">{stat.change}</span> from last month
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Student Enrollment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-muted rounded-lg">
                <p className="text-gray-500 text-center">
                  Chart visualization would appear here.
                  <br />
                  <span className="text-sm text-gray-400">Interactive charts showing enrollment trends</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="py-4">
                    <div className="flex items-center">
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{activity.name}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{activity.action}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${event.color}`}>
                      <div className={`h-4 w-4 rounded-full ${event.dotColor}`} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
                    <p className="mt-1 text-sm text-gray-500">{event.date}</p>
                    <p className="mt-1 text-sm text-gray-500">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
