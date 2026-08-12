import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: '1' },
    });

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          id: '1',
          storeName: 'Lulo Lencería',
          whatsappNumber: '5491112345678',
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('API Settings GET Error:', error);
    return NextResponse.json({ error: 'Error fetching store settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      storeName,
      logo,
      whatsappNumber,
      instagramUrl,
      address,
      hours,
      ageNoticeText,
      shippingCost,
      deliveryMethods,
      paymentMethods,
    } = body;

    const updated = await prisma.storeSettings.upsert({
      where: { id: '1' },
      update: {
        storeName,
        logo,
        whatsappNumber,
        instagramUrl,
        address,
        hours,
        ageNoticeText,
        shippingCost: parseFloat(shippingCost) || 0,
        deliveryMethods,
        paymentMethods,
      },
      create: {
        id: '1',
        storeName,
        logo,
        whatsappNumber,
        instagramUrl,
        address,
        hours,
        ageNoticeText,
        shippingCost: parseFloat(shippingCost) || 0,
        deliveryMethods,
        paymentMethods,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('API Settings PUT Error:', error);
    return NextResponse.json({ error: 'Error updating store settings' }, { status: 500 });
  }
}
