'use client';

import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop, ConnectDragSource, ConnectDropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HiOutlineUser, HiOutlineMail, HiOutlineClipboardList, HiOutlineCheckCircle, HiOutlineCalendar } from "react-icons/hi";  
import { arrayMoveImmutable } from 'array-move';  
import { useRouter } from 'next/navigation';

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

function DraggableElement({ label }: { label: string }) {
  const [, drag] = useDrag<{ label: string }, void, any>(() => ({
    type: ITEM_TYPE,
    item: { label },
  }));

  const dragRef = (element: HTMLLIElement | null) => {
    if (element) drag(element);
  };

  return (
    <li ref={dragRef} className="mb-2 cursor-pointer hover:text-blue-500 px-3 py-2 border rounded-md bg-white shadow-sm hover:shadow-md transition">
      {label}
    </li>
  );
}

function DroppableArea({ onSave, initialElements = [] }: { 
  onSave: (elements: Array<{ id: number; label: string }>) => void;
  initialElements?: Array<{ id: number; label: string }>;
}) {
  const [formElements, setFormElements] = useState<Array<{ id: number; label: string }>>(initialElements);

  // Log the initial elements and current elements for debugging
  useEffect(() => {
    console.log('Initial elements:', initialElements);
    console.log('Current elements:', formElements);
  }, [initialElements, formElements]);

  const [selectedElement, setSelectedElement] = useState<number | null>(null);

  const [, drop] = useDrop<{ label: string }, void, any>(() => ({
    accept: ITEM_TYPE,
    drop: (item: { label: string }) => {
      const newElement = { id: Date.now(), label: item.label };
      setFormElements(prev => [...prev, newElement]);
    },
  }));

  const dropRef = (element: HTMLDivElement | null) => {
    if (element) drop(element);
  };

  const handleDelete = () => {
    if (selectedElement !== null) {
      setFormElements((prev) => prev.filter((element) => element.id !== selectedElement));
      setSelectedElement(null);
    }
  };

  return (
    <Card ref={dropRef} className="w-full min-h-[250px] p-6 bg-gray-50 border-dashed border-2 border-gray-300">
      <CardHeader>
        <CardTitle className="text-gray-700">Form Preview</CardTitle>
      </CardHeader>
      <CardContent>
        {formElements.length === 0 ? (
          <p className="text-gray-500 text-center">Drag and drop elements here</p>
        ) : (
          <ul>
            {formElements.map((element, index) => (
              <DraggableElementWithSort
                key={element.id}
                index={index}
                element={element}
                formElements={formElements}
                setFormElements={setFormElements}
                setSelectedElement={setSelectedElement}
                isSelected={element.id === selectedElement}
              />
            ))}
          </ul>
        )}
        <div className="mt-4">
          <Button onClick={() => onSave(formElements)} className="w-full bg-green-500 text-white">
            Save Form
          </Button>
          <Button onClick={handleDelete} className="w-full bg-red-500 text-white mt-2" disabled={selectedElement === null}>
            Delete Selected
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface DraggableElementWithSortProps {
  element: { id: number; label: string };
  index: number;
  formElements: Array<{ id: number; label: string }>;
  setFormElements: React.Dispatch<React.SetStateAction<Array<{ id: number; label: string }>>>;
  setSelectedElement: (id: number | null) => void;
  isSelected: boolean;
}

interface DragItem {
  index: number;
}

function DraggableElementWithSort({ 
  element, 
  index, 
  formElements, 
  setFormElements, 
  setSelectedElement, 
  isSelected 
}: DraggableElementWithSortProps) {
  const [, drag] = useDrag<DragItem, void, any>(() => ({
    type: ITEM_TYPE,
    item: { index },
  }));

  const [, drop] = useDrop<DragItem, void, any>(() => ({
    accept: ITEM_TYPE,
    hover: (draggedItem: DragItem) => {
      const { index: draggedIndex } = draggedItem;
      if (draggedIndex !== index) {
        setFormElements((prevElements: Array<{ id: number; label: string }>) => 
          arrayMoveImmutable(prevElements, draggedIndex, index)
        );
      }
    },
  }));

  return (
    <li
      ref={(node) => {
        if (node) {
          drag(drop(node));
        }
      }}
      className={`mb-4 p-2 border rounded-md shadow-sm flex justify-between items-center cursor-pointer transition ${isSelected ? "bg-red-200" : "bg-white"}`}
      onClick={() => setSelectedElement(element.id)}
    >
      {formElementComponents[element.label]}
    </li>
  );
}

export default function FormBuilderPage() {
  const [formTitle, setFormTitle] = useState<string>('');
  const router = useRouter();

  const handleSaveForm = async (elements: Array<{ id: number; label: string }>) => {
    try {
      if (!formTitle.trim()) {
        alert('Please enter a form title');
        return;
      }

      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formTitle.trim(),
          elements: elements,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save form');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to save form');
      }

      router.push('/forms');
    } catch (error) {
      console.error('Error saving form:', error);
      alert(error instanceof Error ? error.message : 'Failed to save form');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col">
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow">
          <h1 className="text-xl font-bold text-yellow-400">Form Builder</h1>
        </header>

        <div className="p-4">
          <input 
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Enter Form Title"
            className="border p-2 w-full rounded-md"
            required
          />
        </div>

        <div className="flex flex-col md:flex-row flex-grow">
          {/* Sidebar */}
          <aside className="w-full md:w-1/4 bg-gray-100 p-4">
            <h2 className="font-bold text-lg text-blue-600 mb-4">Form Elements</h2>
            <Separator className="mb-4" />
            <ul className="space-y-2">
              {Object.keys(formElementComponents).map((label) => (
                <DraggableElement key={label} label={label} />
              ))}
            </ul>
          </aside>

          {/* Main Builder */}
          <main className="w-full md:w-2/4 bg-white p-6 border-x flex justify-center">
            <DroppableArea 
              onSave={handleSaveForm}
              initialElements={[]}
            />
          </main>

          {/* Right Sidebar */}
          <aside className="w-full md:w-1/4 bg-gray-100 p-4">
            <h2 className="font-bold text-lg text-green-500 mb-4">Customize Form</h2>
            <Separator />
          </aside>
        </div>
      </div>
    </DndProvider>
  );
}

export { DraggableElement, DroppableArea };
