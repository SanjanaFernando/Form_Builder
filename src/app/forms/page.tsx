'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Corrected import

// Define the type for a single form
interface Form {
  id: number;
  title: string;
  elements: any; // Replace 'any' with a more specific type if possible
}

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize router for navigation

  useEffect(() => {
    async function fetchForms() {
      try {
        const response = await fetch('/api/forms');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setForms(data);
      } catch (error) {
        console.error('Failed to fetch forms:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchForms();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this form?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/forms?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete form');
      }

      // Update state to remove the deleted form
      setForms((prevForms) => prevForms.filter((form) => form.id !== id));
    } catch (error) {
      console.error('Error deleting form:', error);
    }
  };

  [{
	"resource": "/c:/Ruhuna Eng/Semester 6/EE6254 DevOps/dynamic-form-builder/src/app/forms/page.tsx",
	"owner": "typescript",
	"code": "2345",
	"severity": 8,
	"message": "Argument of type '{ pathname: string; query: { id: string; title: string; elements: string; }; }' is not assignable to parameter of type 'string'.",
	"source": "ts",
	"startLineNumber": 59,
	"startColumn": 17,
	"endLineNumber": 62,
	"endColumn": 6
}]
  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Current Forms</h1>
      {forms.length === 0 ? (
        <p>No forms available.</p>
      ) : (
        <ul>
          {forms.map((form) => (
            <li key={form.id} className="border p-4 mb-2 flex justify-between items-center">
              {/* Display only the form title */}
              <h2 className="font-semibold">{form.title}</h2>
              <div>
                <button 
                  onClick={() => handleEdit(form)} 
                  className="mr-2 text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(form.id)} 
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
