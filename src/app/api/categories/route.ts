import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: { where: { active: true } } },
        },
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('API Categories GET Error:', error);
    return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, image } = body;

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-');

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('API Categories POST Error:', error);
    return NextResponse.json({ error: 'Error creating category' }, { status: 500 });
  }
}
