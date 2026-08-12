import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: { include: { images: true } },
            variant: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('API Order GET Error:', error);
    return NextResponse.json({ error: 'Error fetching order' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, paymentStatus } = body;

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    const previousStatus = existingOrder.status;

    const updatedOrder = await prisma.$transaction(async (tx) => {
      // 1. Check if order is being CANCELLED from a non-cancelled state -> Restore stock
      if (status === 'CANCELADO' && previousStatus !== 'CANCELADO') {
        for (const item of existingOrder.items) {
          const variant = await tx.productVariant.findUnique({ where: { id: item.variantId } });
          if (variant) {
            const newStock = variant.stock + item.quantity;
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: newStock },
            });

            await tx.inventoryMovement.create({
              data: {
                variantId: item.variantId,
                type: 'CANCELACION',
                quantity: item.quantity,
                previousStock: variant.stock,
                newStock: newStock,
                notes: `Restauración por cancelación de Pedido #${existingOrder.orderNumber}`,
              },
            });
          }
        }
      }

      // 2. Check if order is being RE-ACTIVATED from CANCELADO state -> Deduct stock
      if (previousStatus === 'CANCELADO' && status && status !== 'CANCELADO') {
        for (const item of existingOrder.items) {
          const variant = await tx.productVariant.findUnique({ where: { id: item.variantId } });
          if (variant) {
            const newStock = Math.max(0, variant.stock - item.quantity);
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: newStock },
            });

            await tx.inventoryMovement.create({
              data: {
                variantId: item.variantId,
                type: 'VENTA',
                quantity: item.quantity,
                previousStock: variant.stock,
                newStock: newStock,
                notes: `Reactivación de Pedido #${existingOrder.orderNumber}`,
              },
            });
          }
        }
      }

      // Update Order fields
      const dataToUpdate: any = {};
      if (status) dataToUpdate.status = status;
      if (paymentStatus) dataToUpdate.paymentStatus = paymentStatus;

      const order = await tx.order.update({
        where: { id },
        data: dataToUpdate,
        include: { items: true },
      });

      return order;
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('API Order PUT Error:', error);
    return NextResponse.json({ error: 'Error updating order' }, { status: 500 });
  }
}
