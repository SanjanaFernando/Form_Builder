'use client';

import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HiOutlineUser, HiOutlineMail, HiOutlineClipboardList, HiOutlineCheckCircle, HiOutlineCalendar } from "react-icons/hi";  
import { arrayMoveImmutable } from 'array-move';  

const ITEM_TYPE = 'FORM_ELEMENT';

const formElementComponents: Record<string, JSX.Element> = {
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
  const [, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { label },
  }));

  return (
    <li ref={drag} className="mb-2 cursor-pointer hover:text-blue-500 px-3 py-2 border rounded-md bg-white shadow-sm hover:shadow-md transition">
      {label}
    </li>
  );
}

function DroppableArea() {
  const [formElements, setFormElements] = useState<{ id: number; label: string }[]>([]);
  const [selectedElement, setSelectedElement] = useState<number | null>(null);

  const [, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { label: string }) => {
      setFormElements((prev) => [...prev, { id: Date.now(), label: item.label }]);
    },
  }));

  const handleDelete = () => {
    if (selectedElement !== null) {
      setFormElements((prev) => prev.filter((element) => element.id !== selectedElement));
      setSelectedElement(null);
    }
  };

  return (
    <Card ref={drop} className="w-full min-h-[250px] p-6 bg-gray-50 border-dashed border-2 border-gray-300">
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
          <Button onClick={handleDelete} className="w-full bg-red-500 text-white" disabled={selectedElement === null}>
            Delete Selected
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DraggableElementWithSort({ element, index, formElements, setFormElements, setSelectedElement, isSelected }: any) {
  const [, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { index },
  }));

  const [, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    hover: (draggedItem: { index: number }) => {
      const { index: draggedIndex } = draggedItem;
      if (draggedIndex !== index) {
        setFormElements((prevElements) => arrayMoveImmutable(prevElements, draggedIndex, index));
      }
    },
  }));

  return (
    <li
      ref={(node) => drag(drop(node))}
      className={`mb-4 p-2 border rounded-md shadow-sm flex justify-between items-center cursor-pointer transition ${isSelected ? "bg-red-200" : "bg-white"}`}
      onClick={() => setSelectedElement(element.id)}
    >
      {formElementComponents[element.label]}
    </li>
  );
}

export default function FormBuilderPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col">
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow">
          <h1 className="text-xl font-bold text-yellow-400">Form Builder</h1>
          <Button variant="secondary">Save Form</Button>
        </header>

        <div className="flex flex-col md:flex-row flex-grow">
          <aside className="w-full md:w-1/4 bg-gray-100 p-4">
            <h2 className="font-bold text-lg text-blue-600 mb-4">Form Elements</h2>
            <Separator className="mb-4" />
            <ul className="space-y-2">
              <DraggableElement label="Text Field" />
              <DraggableElement label="Email" />
              <DraggableElement label="Dropdown" />
              <DraggableElement label="Checkbox" />
              <DraggableElement label="Date Picker" />
            </ul>
          </aside>

          <main className="w-full md:w-2/4 bg-white p-6 border-x flex justify-center">
            <DroppableArea />
          </main>

          <aside className="w-full md:w-1/4 bg-gray-100 p-4">
            <h2 className="font-bold text-lg text-green-500 mb-4">Form Designer</h2>
            <Separator className="mb-4" />
            <p className="text-gray-600 mb-4">Customize your form with colors, styles, and layouts.</p>
            <Button className="w-full bg-blue-500 text-white">Apply Theme</Button>
          </aside>
        </div>
      </div>
    </DndProvider>
  );
}
