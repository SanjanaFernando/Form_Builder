import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { formId, responses } = body;

    if (!formId || !responses) {
      return NextResponse.json(
        { error: 'FormId and responses are required' },
        { status: 400 }
      );
    }

    const formResponse = await prisma.formResponse.create({
      data: {
        formId: parseInt(formId.toString()),
        responses: responses,
      },
    });

    return NextResponse.json(formResponse);
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Error saving form response' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');

    const where = formId ? { formId: parseInt(formId) } : {};

    const responses = await prisma.formResponse.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        form: {
          select: {
            title: true,
          },
        },
      },
    });

    return NextResponse.json(responses);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json([]);
  }
} 