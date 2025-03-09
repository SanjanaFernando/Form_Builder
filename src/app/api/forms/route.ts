import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, elements } = body;

    if (!title) {
      return NextResponse.json({
        success: false, 
        error: 'Title is required'
      });
    }

    const form = await prisma.form.create({
      data: {
        title,
        elements: elements || [],
      },
    });

    return NextResponse.json({
      success: true,
      data: form
    });

  } catch (error) {
    if (error instanceof Error) {
      console.error('POST Error:', error.message);
    } else {
      console.error('POST Error:', String(error));
    }

    return NextResponse.json({
      success: false, 
      error: 'Failed to create form'
    });
  }
}

export async function GET() {
  try {
    const forms = await prisma.form.findMany({
      orderBy: {
        id: 'desc'
      }
    });

    return NextResponse.json(forms || []);
  } catch (error) {
    if (error instanceof Error) {
      console.error('GET Error:', error.message);
    } else {
      console.error('GET Error:', String(error));
    }
    
    return NextResponse.json([]);
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Form ID is required' },
        { status: 400 }
      );
    }

    const formId = parseInt(id);
    
    if (isNaN(formId)) {
      return NextResponse.json(
        { error: 'Invalid Form ID' },
        { status: 400 }
      );
    }

    await prisma.form.delete({
      where: {
        id: formId,
      },
    });

    return NextResponse.json({ 
      message: 'Form deleted successfully',
      success: true 
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Form not found' },
          { status: 404 }
        );
      }
    }
    
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: 'Error deleting form' },
      { status: 500 }
    );
  }
} 