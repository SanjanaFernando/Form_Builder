'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Navbar */}
      <header className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center w-full max-w-6xl">
        <h1 className="text-lg font-bold">Easy Forms</h1>
        <nav className="space-x-4">
          <Link href="/" className="hover:underline">Dashboard</Link>
          <Link href="/forms" className="hover:underline">Forms</Link>
          <Link href="/themes" className="hover:underline">Themes</Link>
          <Link href="/add-ons" className="hover:underline">Add-ons</Link>
          <Link href="/users" className="hover:underline">Users</Link>
        </nav>
        <Button variant="secondary">Admin</Button>
      </header>

      {/* Main Content */}
      <div className="p-6 w-full max-w-6xl">
        <h2 className="text-2xl font-bold text-center mb-8">Dashboard - Today Summary(Test6)</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
          {[
            { value: "1", label: "Unique Users", color: "text-blue-600" },
            { value: "5", label: "Submissions", color: "text-blue-600" },
            { value: "500%", label: "Submission Rate", color: "text-purple-600" },
          ].map((item, index) => (
            <Card key={index} className="shadow-lg rounded-xl p-6 hover:shadow-xl transition">
              <CardContent className="text-center">
                <h3 className={`${item.color} font-bold text-4xl`}>{item.value}</h3>
                <p className="text-gray-600 mt-2 text-lg">{item.label}</p>
              </CardContent>
            </Card>
          ))}

          <Card className="bg-green-500 text-white shadow-lg rounded-xl p-6 hover:shadow-xl transition">
            <CardContent className="flex justify-center items-center h-full">
              <Link href="/form-builder">
                <Button variant="ghost" className="font-bold text-lg">+ CREATE FORM </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/submissions">
            <Card className="bg-blue-500 text-white shadow-lg rounded-xl p-6 hover:shadow-xl transition cursor-pointer">
              <CardContent className="text-center">
                <svg 
                  className="w-8 h-8 mx-auto mb-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="font-bold text-lg">View Submissions</h3>
              </CardContent>
            </Card>
          </Link>
          {/* Rest of your cards */}
        </div>

        {/* Most Viewed/Submitted Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Most Viewed", content: "Bug Tracker" },
            { title: "Most Submitted", content: "Bug Tracker" },
            { title: "Last Updated", content: (
              <ul className="text-gray-600 space-y-2">
                <li>Bug Tracker - 4 minutes ago</li>
                <li>Simple Contact Form - 6 minutes ago</li>
                <li>Trivia Quiz - 6 minutes ago</li>
              </ul>
            ) }
          ].map((item, index) => (
            <Card key={index} className="shadow-lg rounded-xl p-6 hover:shadow-xl transition">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {typeof item.content === "string" ? <p className="text-gray-600">{item.content}</p> : item.content}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
