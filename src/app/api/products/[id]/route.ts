import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }],
      },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
        variants: {
          include: {
            movements: { orderBy: { createdAt: 'desc' }, take: 5 },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('API Product GET Error:', error);
    return NextResponse.json({ error: 'Error fetching product' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      active,
      images,
      variants,
    } = body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        cost: cost ? parseFloat(cost) : null,
        sku,
        categoryId,
        isFeatured: Boolean(isFeatured),
        isOffer: Boolean(isOffer),
        is18Plus: Boolean(is18Plus),
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    // Handle Images update if provided
    if (images && Array.isArray(images)) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      for (let i = 0; i < images.length; i++) {
        await prisma.productImage.create({
          data: {
            productId: id,
            url: images[i],
            order: i,
          },
        });
      }
    }

    // Handle variants update if provided
    if (variants && Array.isArray(variants)) {
      for (const v of variants) {
        if (v.id) {
          // Update existing variant stock
          const currentVariant = await prisma.productVariant.findUnique({ where: { id: v.id } });
          if (currentVariant) {
            const newStock = parseInt(v.stock);
            const diff = newStock - currentVariant.stock;

            await prisma.productVariant.update({
              where: { id: v.id },
              data: {
                size: v.size || null,
                color: v.color || null,
                model: v.model || null,
                stock: newStock,
              },
            });

            if (diff !== 0) {
              await prisma.inventoryMovement.create({
                data: {
                  variantId: v.id,
                  type: 'AJUSTE_MANUAL',
                  quantity: Math.abs(diff),
                  previousStock: currentVariant.stock,
                  newStock: newStock,
                  notes: `Ajuste manual desde edición de producto (${diff > 0 ? '+' : ''}${diff})`,
                },
              });
            }
          }
        } else {
          // Create new variant
          const createdVar = await prisma.productVariant.create({
            data: {
              productId: id,
              size: v.size || null,
              color: v.color || null,
              model: v.model || null,
              sku: v.sku || `${sku}-${v.size || ''}-${v.color || ''}`.toUpperCase(),
              stock: parseInt(v.stock) || 0,
            },
          });

          if (parseInt(v.stock) > 0) {
            await prisma.inventoryMovement.create({
              data: {
                variantId: createdVar.id,
                type: 'INGRESO',
                quantity: parseInt(v.stock),
                previousStock: 0,
                newStock: parseInt(v.stock),
                notes: 'Nueva variante agregada',
              },
            });
          }
        }
      }
    }

    const fullProduct = await prisma.product.findUnique({
      where: { id },
      include: { category: true, images: true, variants: true },
    });

    return NextResponse.json(fullProduct);
  } catch (error) {
    console.error('API Product PUT Error:', error);
    return NextResponse.json({ error: 'Error updating product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Soft delete or hard delete
    await prisma.product.update({
      where: { id },
      data: { active: false },
    });
    return NextResponse.json({ success: true, message: 'Producto desactivado correctamente' });
  } catch (error) {
    console.error('API Product DELETE Error:', error);
    return NextResponse.json({ error: 'Error deleting product' }, { status: 500 });
  }
}
