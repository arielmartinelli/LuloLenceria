import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, image, active } = body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        image,
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('API Categories PUT Error:', error);
    return NextResponse.json({ error: 'Error updating category' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Categories DELETE Error:', error);
    return NextResponse.json({ error: 'Error deleting category' }, { status: 500 });
  }
}
