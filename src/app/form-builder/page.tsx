'use client';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag, useDrop } from 'react-dnd';
import { JSX } from 'react/jsx-runtime';

const ITEM_TYPE = 'FORM_ELEMENT';

const formElementComponents: Record<string, JSX.Element> = {
  "Text Field": <input type="text" placeholder="Enter text" className="border p-2 w-full text-purple-600" />,
  Email: <input type="email" placeholder="Enter email" className="border p-2 w-full text-green-600" />,
  Dropdown: (
    <select className="border p-2 w-full text-blue-600">
      <option>Option 1</option>
      <option>Option 2</option>
      <option>Option 3</option>
    </select>
  ),
  Checkbox: <input type="checkbox" className="mr-2 text-red-600" />,
  "Date Picker": <input type="date" className="border p-2 w-full text-indigo-600" />,
};

function DraggableElement({ label }: { label: string }) {
  const [, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { label },
  }));

  return (
    <li
      ref={drag}
      className="mb-2 text-gray-800 cursor-pointer hover:text-blue-500"
      style={{ padding: '8px', border: '1px solid #ccc' }}
    >
      {label}
    </li>
  );
}

function DroppableArea() {
  const [formElements, setFormElements] = useState<{ id: number; label: string }[]>([]);

  const [, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { label: string }) => {
      setFormElements((prev) => [
        ...prev,
        { id: prev.length + 1, label: item.label },
      ]);
    },
  }));

  return (
    <div
      ref={drop}
      className="w-full h-64 border-dashed border-2 border-gray-300 p-4"
      style={{ minHeight: '200px' }}
    >
      <p className="text-gray-700 mb-4">Form Preview Area</p>
      <ul>
        {formElements.map((element) => (
          <li key={element.id} className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              {element.label}
            </label>
            {formElementComponents[element.label]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FormBuilderPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-yellow-400">Form Builder</h1>
        </header>

        {/* Main Content */}
        <div className="flex flex-grow">
          {/* Sidebar (Form Elements) */}
          <aside className="w-1/4 bg-gray-100 p-4">
            <h2 className="font-bold text-lg text-blue-600 mb-4">Form Elements</h2>
            <ul>
              <DraggableElement label="Text Field" />
              <DraggableElement label="Email" />
              <DraggableElement label="Dropdown" />
              <DraggableElement label="Checkbox" />
              <DraggableElement label="Date Picker" />
            </ul>
          </aside>

          {/* Main Preview Area */}
          <main className="w-2/4 bg-white p-4 border-x">
            <DroppableArea />
          </main>

          {/* Right Sidebar (Customization Panel) */}
          <aside className="w-1/4 bg-gray-100 p-4">
            <h2 className="font-bold text-lg text-green-500 mb-4">Form Designer</h2>
            <p className="text-gray-600">
              Customize your form with colors, styles, and layouts.
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              Apply Theme
            </button>
          </aside>
        </div>
      </div>
    </DndProvider>
  );
}
