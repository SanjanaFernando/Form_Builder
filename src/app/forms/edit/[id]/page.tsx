'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HiOutlineUser, HiOutlineMail, HiOutlineClipboardList, HiOutlineCheckCircle, HiOutlineCalendar } from "react-icons/hi";
import { arrayMoveImmutable } from 'array-move';
import { useRouter } from 'next/navigation';

// Import the DraggableElement and DroppableArea components
import { DraggableElement, DroppableArea } from '@/app/form-builder/page';

// Reuse the same components from form-builder
const ITEM_TYPE = 'FORM_ELEMENT';

const formElementComponents: Record<string, React.ReactElement> = {
  "Text Field": <div className="flex items-center"><HiOutlineUser className="mr-2" /> <input type="text" placeholder="Enter text" className="border p-2 w-full rounded-md" /></div>,
  Email: <div className="flex items-center"><HiOutlineMail className="mr-2" /> <input type="email" placeholder="Enter email" className="border p-2 w-full rounded-md" /></div>,
  Dropdown: (
    <div className="flex items-center">
      <HiOutlineClipboardList className="mr-2" />
      <select className="border p-2 w-full rounded-md">
        <option>Option 1</option>
        <option>Option 2</option>
        <option>Option 3</option>
      </select>
    </div>
  ),
  Checkbox: <div className="flex items-center"><HiOutlineCheckCircle className="mr-2" /> <input type="checkbox" className="mr-2 w-6 h-6" /></div>,
  "Date Picker": <div className="flex items-center"><HiOutlineCalendar className="mr-2" /> <input type="date" className="border p-2 w-full rounded-md" /></div>,
};

interface FormData {
  id: number;
  title: string;
  elements: Array<{ id: number; label: string }>;
}

function EditFormContent({ id }: { id: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchForm() {
      try {
        const response = await fetch(`/api/forms/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch form');
        }

        // Ensure elements is an array
        const elements = Array.isArray(data.elements) ? data.elements : [];
        
        setFormData({
          ...data,
          elements: elements.map((el: any) => ({
            id: el.id || Date.now(),
            label: el.label
          }))
        });
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

  const handleUpdateForm = async (elements: Array<{ id: number; label: string }>) => {
    if (!formData) return;

    try {
      const response = await fetch(`/api/forms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          elements: elements
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update form');
      }

      router.push('/forms');
    } catch (error) {
      console.error('Error updating form:', error);
      alert(error instanceof Error ? error.message : 'Failed to update form');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!formData) return <div>Form not found</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col">
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow">
          <h1 className="text-xl font-bold text-yellow-400">Edit Form: {formData.title}</h1>
        </header>

        <div className="p-4">
          <input 
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="border p-2 w-full rounded-md"
          />
        </div>

        <div className="flex flex-col md:flex-row flex-grow">
          <aside className="w-full md:w-1/4 bg-gray-100 p-4">
            <h2 className="font-bold text-lg text-blue-600 mb-4">Form Elements</h2>
            <Separator className="mb-4" />
            <ul className="space-y-2">
              {Object.keys(formElementComponents).map((label) => (
                <DraggableElement key={label} label={label} />
              ))}
            </ul>
          </aside>

          <main className="w-full md:w-2/4 bg-white p-6 border-x flex justify-center">
            <DroppableArea 
              initialElements={formData.elements}
              onSave={handleUpdateForm}
            />
          </main>

          <aside className="w-full md:w-1/4 bg-gray-100 p-4">
            <h2 className="font-bold text-lg text-green-500 mb-4">Customize Form</h2>
            <Separator />
          </aside>
        </div>
      </div>
    </DndProvider>
  );
}

export default function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditFormContent id={resolvedParams.id} />
    </Suspense>
  );
} 