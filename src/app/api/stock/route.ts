import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const variants = await prisma.productVariant.findMany({
      include: {
        product: {
          include: { category: true, images: { take: 1 } },
        },
        movements: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
      orderBy: { stock: 'asc' },
    });

    const movements = await prisma.inventoryMovement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        variant: {
          include: { product: true },
        },
      },
    });

    return NextResponse.json({ variants, movements });
  } catch (error) {
    console.error('API Stock GET Error:', error);
    return NextResponse.json({ error: 'Error fetching inventory' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { variantId, type, quantity, notes } = body;
    // type: INGRESO, AJUSTE_MANUAL, DEVOLUCION

    const qtyNum = parseInt(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      return NextResponse.json({ error: 'La cantidad debe ser un número positivo' }, { status: 400 });
    }

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      return NextResponse.json({ error: 'Variante no encontrada' }, { status: 404 });
    }

    let newStock = variant.stock;
    if (type === 'INGRESO' || type === 'DEVOLUCION') {
      newStock += qtyNum;
    } else if (type === 'AJUSTE_MANUAL') {
      // Notes or flag determine if addition or subtraction, or new absolute stock
      const isNegative = notes && notes.includes('-');
      newStock = isNegative ? Math.max(0, variant.stock - qtyNum) : variant.stock + qtyNum;
    } else {
      return NextResponse.json({ error: 'Tipo de movimiento no válido' }, { status: 400 });
    }

    if (newStock < 0) {
      return NextResponse.json({ error: 'El stock no puede ser negativo' }, { status: 400 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedVariant = await tx.productVariant.update({
        where: { id: variantId },
        data: { stock: newStock },
        include: { product: true },
      });

      const movement = await tx.inventoryMovement.create({
        data: {
          variantId,
          type,
          quantity: qtyNum,
          previousStock: variant.stock,
          newStock,
          notes: notes || `Ajuste manual de inventario (${type})`,
        },
      });

      return { variant: updatedVariant, movement };
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('API Stock POST Error:', error);
    return NextResponse.json({ error: 'Error adjusting stock' }, { status: 500 });
  }
}
