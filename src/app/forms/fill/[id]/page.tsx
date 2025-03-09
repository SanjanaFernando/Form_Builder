'use client';

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormData {
  id: number;
  title: string;
  elements: Array<{ id: number; label: string }>;
}

interface FormResponse {
  [key: string]: string;
}

function FormFillPage({ params }: { params: Promise<{ id: string }> }) {
  const [form, setForm] = useState<FormData | null>(null);
  const [formResponse, setFormResponse] = useState<FormResponse>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  useEffect(() => {
    async function fetchForm() {
      try {
        const response = await fetch(`/api/forms/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch form');
        }

        setForm(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching form:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch form');
      } finally {
        setLoading(false);
      }
    }

    fetchForm();
  }, [id]);

  const handleInputChange = (elementId: number, value: string) => {
    setFormResponse(prev => ({
      ...prev,
      [elementId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    try {
      const response = await fetch('/api/form-responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: form.id,
          responses: formResponse
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form');
    }
  };

  const renderFormElement = (element: { id: number; label: string }) => {
    switch (element.label) {
      case 'Text Field':
        return (
          <input
            type="text"
            className="border p-2 w-full rounded-md"
            value={formResponse[element.id] || ''}
            onChange={(e) => handleInputChange(element.id, e.target.value)}
          />
        );
      case 'Email':
        return (
          <input
            type="email"
            className="border p-2 w-full rounded-md"
            value={formResponse[element.id] || ''}
            onChange={(e) => handleInputChange(element.id, e.target.value)}
          />
        );
      case 'Dropdown':
        return (
          <select
            className="border p-2 w-full rounded-md"
            value={formResponse[element.id] || ''}
            onChange={(e) => handleInputChange(element.id, e.target.value)}
          >
            <option value="">Select an option</option>
            <option value="Option 1">Option 1</option>
            <option value="Option 2">Option 2</option>
            <option value="Option 3">Option 3</option>
          </select>
        );
      case 'Checkbox':
        return (
          <input
            type="checkbox"
            className="w-6 h-6"
            checked={formResponse[element.id] === 'true'}
            onChange={(e) => handleInputChange(element.id, e.target.checked.toString())}
          />
        );
      case 'Date Picker':
        return (
          <input
            type="date"
            className="border p-2 w-full rounded-md"
            value={formResponse[element.id] || ''}
            onChange={(e) => handleInputChange(element.id, e.target.value)}
          />
        );
      default:
        return null;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!form) return <div>Form not found</div>;
  if (submitted) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Thank you!</h2>
          <p>Your response has been submitted successfully.</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{form.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {form.elements.map((element) => (
              <div key={element.id} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {element.label}
                </label>
                {renderFormElement(element)}
              </div>
            ))}
            <Button type="submit" className="w-full mt-4">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default FormFillPage; 