import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const search = searchParams.get('search');
    const isFeatured = searchParams.get('featured');
    const isOffer = searchParams.get('offer');
    const is18Plus = searchParams.get('is18Plus');
    const sort = searchParams.get('sort'); // price_asc, price_desc, bestsellers, newest

    const where: any = { active: true };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    if (isOffer === 'true') {
      where.isOffer = true;
    }

    if (is18Plus !== null) {
      where.is18Plus = is18Plus === 'true';
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
        variants: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('API Products GET Error:', error);
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      originalPrice,
      cost,
      sku,
      categoryId,
      isFeatured,
      isOffer,
      is18Plus,
      images,
      variants,
    } = body;

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Date.now();

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        cost: cost ? parseFloat(cost) : null,
        sku,
        categoryId,
        isFeatured: Boolean(isFeatured),
        isOffer: Boolean(isOffer),
        is18Plus: Boolean(is18Plus),
        images: {
          create: (images || []).map((url: string, index: number) => ({
            url,
            order: index,
          })),
        },
      },
    });

    // Create variants if provided
    if (variants && Array.isArray(variants)) {
      for (const v of variants) {
        const createdVariant = await prisma.productVariant.create({
          data: {
            productId: product.id,
            size: v.size || null,
            color: v.color || null,
            model: v.model || null,
            sku: v.sku || `${sku}-${v.size || ''}-${v.color || ''}`.toUpperCase(),
            stock: parseInt(v.stock) || 0,
          },
        });

        if (v.stock > 0) {
          await prisma.inventoryMovement.create({
            data: {
              variantId: createdVariant.id,
              type: 'INGRESO',
              quantity: parseInt(v.stock),
              previousStock: 0,
              newStock: parseInt(v.stock),
              notes: 'Stock inicial al crear producto',
            },
          });
        }
      }
    }

    const fullProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });

    return NextResponse.json(fullProduct, { status: 201 });
  } catch (error) {
    console.error('API Products POST Error:', error);
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 });
  }
}
