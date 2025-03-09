'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FormResponse {
  id: number;
  formId: number;
  responses: Record<string, string>;
  createdAt: string;
  form: {
    title: string;
  };
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const response = await fetch('/api/form-responses');
        if (!response.ok) throw new Error('Failed to fetch submissions');
        const data = await response.json();
        setSubmissions(data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">Form Submissions</h1>
        <nav className="space-x-4">
          <Link href="/" className="hover:underline">Dashboard</Link>
          <Link href="/forms" className="hover:underline">Forms</Link>
        </nav>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        <div className="grid gap-6">
          {submissions.length === 0 ? (
            <Card className="text-center p-6">
              <CardContent>
                <p className="text-gray-500">No submissions yet</p>
              </CardContent>
            </Card>
          ) : (
            submissions.map((submission) => (
              <Card key={submission.id} className="shadow-sm hover:shadow-md transition">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{submission.form.title}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(submission.createdAt).toLocaleString()}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {Object.entries(submission.responses).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b pb-2">
                        <span className="font-medium">{key}:</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
} 