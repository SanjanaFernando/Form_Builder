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

  const handleEdit = (form: Form) => {
    router.push(`/forms/edit/${form.id}`);
  };

  const handleShare = async (formId: number) => {
    try {
      const shareUrl = `${window.location.origin}/forms/fill/${formId}`;
      await navigator.clipboard.writeText(shareUrl);
      
      // You could use a toast notification here instead of alert
      alert('Form link copied to clipboard! Share this link with others to let them fill out the form.');
    } catch (error) {
      console.error('Failed to copy link:', error);
      alert('Failed to copy link. Please try again.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Current Forms</h1>
        <button
          onClick={() => router.push('/form-builder')}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Create New Form
        </button>
      </div>

      {forms.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No forms available. Create your first form!</p>
      ) : (
        <ul className="space-y-4">
          {forms.map((form) => (
            <li key={form.id} className="border rounded-lg p-4 flex justify-between items-center bg-white shadow-sm hover:shadow-md transition">
              <div>
                <h2 className="font-semibold text-lg">{form.title}</h2>
                <p className="text-sm text-gray-500">
                  {form.elements?.length || 0} elements
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleShare(form.id)}
                  className="flex items-center px-3 py-1 text-green-600 hover:bg-green-50 rounded-md transition"
                >
                  <svg 
                    className="w-5 h-5 mr-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  Share
                </button>
                <button 
                  onClick={() => handleEdit(form)}
                  className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition"
                >
                  <svg 
                    className="w-5 h-5 mr-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(form.id)}
                  className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition"
                >
                  <svg 
                    className="w-5 h-5 mr-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
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
