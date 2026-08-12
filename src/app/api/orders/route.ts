import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const search = searchParams.get('search');

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (search) {
      const numSearch = parseInt(search);
      where.OR = [
        { customerName: { contains: search } },
        { customerPhone: { contains: search } },
        { city: { contains: search } },
        ...(isNaN(numSearch) ? [] : [{ orderNumber: numSearch }]),
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: { include: { images: true } },
            variant: true,
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('API Orders GET Error:', error);
    return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      city,
      address,
      deliveryMethod,
      paymentMethod,
      comments,
      items, // array of { productId, variantId, productName, variantDetails, quantity, unitPrice, subtotal }
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'El carrito no contiene productos' }, { status: 400 });
    }

    // 1. Calculate next order number
    const lastOrder = await prisma.order.findFirst({
      orderBy: { orderNumber: 'desc' },
    });
    const nextOrderNumber = (lastOrder?.orderNumber || 1000) + 1;

    // 2. Calculate Total
    const totalAmount = items.reduce((acc: number, item: any) => acc + item.unitPrice * item.quantity, 0);

    // 3. Verify and update stock for each variant
    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
      });

      if (!variant) {
        return NextResponse.json(
          { error: `Variante no encontrada para el producto "${item.productName}"` },
          { status: 400 }
        );
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Stock insuficiente para "${item.productName} (${item.variantDetails})". Stock disponible: ${variant.stock}`,
          },
          { status: 400 }
        );
      }
    }

    // 4. Create Order & Items inside a transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber: nextOrderNumber,
          customerName,
          customerPhone,
          city,
          address,
          deliveryMethod,
          paymentMethod,
          comments: comments || null,
          totalAmount,
          status: 'PENDIENTE',
          paymentStatus: 'PENDIENTE',
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              variantId: item.variantId,
              productName: item.productName,
              variantDetails: item.variantDetails,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.unitPrice * item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      // Deduct stock and record inventory movement
      for (const item of items) {
        const variant = await tx.productVariant.findUnique({ where: { id: item.variantId } });
        if (variant) {
          const newStock = variant.stock - item.quantity;
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
              notes: `Pedido #${nextOrderNumber} - Venta a ${customerName}`,
            },
          });
        }
      }

      return order;
    });

    // 5. Fetch Store Settings for WhatsApp Number
    const settings = await prisma.storeSettings.findUnique({ where: { id: '1' } });
    const storeWhatsapp = settings?.whatsappNumber || '5491112345678';

    // 6. Format WhatsApp Message
    let itemsText = '';
    items.forEach((item: any) => {
      itemsText += `- ${item.productName} (${item.variantDetails}) x${item.quantity} - $${(
        item.unitPrice * item.quantity
      ).toLocaleString('es-AR')}\n`;
    });

    const waText =
      `Hola Lulo Lencería 💕\n` +
      `Quiero realizar el pedido #${newOrder.orderNumber}\n\n` +
      `Productos:\n${itemsText}\n` +
      `Total: $${totalAmount.toLocaleString('es-AR')}\n\n` +
      `Nombre: ${customerName}\n` +
      `Teléfono: ${customerPhone}\n` +
      `Ciudad: ${city}\n` +
      `Entrega: ${deliveryMethod}\n` +
      `Dirección: ${address}\n` +
      `Método de pago: ${paymentMethod}\n` +
      (comments ? `Comentarios: ${comments}\n` : '') +
      `\nEspero confirmación del pedido. ¡Gracias!`;

    const encodedText = encodeURIComponent(waText);
    const whatsappUrl = `https://wa.me/${storeWhatsapp}?text=${encodedText}`;

    return NextResponse.json(
      {
        order: newOrder,
        whatsappUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API Orders POST Error:', error);
    return NextResponse.json({ error: 'Error al procesar el pedido' }, { status: 500 });
  }
}
