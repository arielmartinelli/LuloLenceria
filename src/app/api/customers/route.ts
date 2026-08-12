import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    });

    // Group orders by customerPhone or customerName
    const customerMap = new Map<string, any>();

    for (const order of orders) {
      const key = order.customerPhone.trim() || order.customerName.trim().toLowerCase();
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          phone: order.customerPhone,
          name: order.customerName,
          city: order.city,
          address: order.address,
          orderCount: 0,
          totalSpent: 0,
          lastOrderDate: order.createdAt,
          orders: [],
        });
      }

      const cust = customerMap.get(key);
      cust.orderCount += 1;
      cust.totalSpent += order.totalAmount;
      if (new Date(order.createdAt) > new Date(cust.lastOrderDate)) {
        cust.lastOrderDate = order.createdAt;
      }
      cust.orders.push({
        id: order.id,
        orderNumber: order.orderNumber,
        date: order.createdAt,
        total: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        itemCount: order.items.length,
      });
    }

    const customers = Array.from(customerMap.values());
    return NextResponse.json(customers);
  } catch (error) {
    console.error('API Customers GET Error:', error);
    return NextResponse.json({ error: 'Error fetching customers' }, { status: 500 });
  }
}
