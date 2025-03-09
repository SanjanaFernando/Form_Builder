import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const form = await prisma.form.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Error fetching form' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, elements } = body;

    const updatedForm = await prisma.form.update({
      where: {
        id: parseInt(id)
      },
      data: {
        title,
        elements
      }
    });

    return NextResponse.json(updatedForm);
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: 'Error updating form' }, { status: 500 });
  }
} 