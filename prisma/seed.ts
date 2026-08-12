import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SeedVariant {
  size?: string;
  color?: string;
  model?: string;
  sku: string;
  stock: number;
  cost?: number;
}

async function main() {
  console.log('Seeding Lulo Lencería database with local images...');

  // Clean existing tables
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventoryMovement.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.storeSettings.deleteMany();

  // Create Store Settings
  await prisma.storeSettings.create({
    data: {
      id: '1',
      storeName: 'Lulo Lencería',
      logo: '/logo.png',
      whatsappNumber: '5491112345678',
      instagramUrl: 'https://instagram.com/lulolenceria',
      address: 'Av. Santa Fe 1842, CABA',
      hours: 'Lunes a Sábado de 10:00 a 20:00 hs',
      ageNoticeText: 'Este sitio contiene productos destinados exclusivamente a mayores de 18 años. Al ingresar confirmás que sos mayor de 18 años.',
      shippingCost: 2500,
      deliveryMethods: 'Retiro en Local, Envío a Domicilio',
      paymentMethods: 'Efectivo, Transferencia Bancaria, Otro',
    },
  });

  // Create Categories with local image banners
  const catBikinis = await prisma.category.create({
    data: {
      name: 'Bikinis',
      slug: 'bikinis',
      description: 'Trajes de baño de diseño exclusivo y ajuste perfecto.',
      image: '/img/vikinis/3r6a0119-917a25e4dc35892f9417289315787563-1024-1024.jpg',
    },
  });

  const catLenceria = await prisma.category.create({
    data: {
      name: 'Lencería',
      slug: 'lenceria',
      description: 'Conjuntos sensuales, bodies y piezas delicadas de encaje.',
      image: '/img/lenceria/16994300665e1678729e65018751ee1f0f40848ad2_thumbnail_720x.jpg',
    },
  });

  const catDeportiva = await prisma.category.create({
    data: {
      name: 'Indumentaria Deportiva',
      slug: 'indumentaria-deportiva',
      description: 'Tops, calzas y shorts de alta compresión y máximo confort.',
      image: '/img/deportivo/VUORI-yoga-deportes-banner4.jpg',
    },
  });

  const catPlus18 = await prisma.category.create({
    data: {
      name: '+18 / Eróticos',
      slug: 'mas-18',
      description: 'Juguetes sexuales, aceites de masaje y cosmética sensorial para mayores de 18 años.',
      image: '/img/+18/gel-intimo-snella-hidratante-y-lubricante-x-60-g.jpg',
    },
  });

  // Products Data Definition using exact local images from public/img
  const productsData: {
    name: string;
    slug: string;
    description: string;
    price: number;
    originalPrice: number | null;
    cost: number;
    sku: string;
    categoryId: string;
    isFeatured: boolean;
    isOffer: boolean;
    is18Plus: boolean;
    images: string[];
    variants: SeedVariant[];
  }[] = [
    // BIKINIS
    {
      name: 'Bikini Luna Velvet',
      slug: 'bikini-luna-velvet',
      description: 'Bikini con corpiño armado tipo triángulo y bombacha colaless tiro alto. Confeccionada en lycra premium texturada súper suave.',
      price: 28500,
      originalPrice: 34000,
      cost: 12000,
      sku: 'BIK-LUNA',
      categoryId: catBikinis.id,
      isFeatured: true,
      isOffer: true,
      is18Plus: false,
      images: [
        '/img/vikinis/3r6a0119-917a25e4dc35892f9417289315787563-1024-1024.jpg',
        '/img/vikinis/bikini-naima-lurex-botanico-91e0adb3b1da2c67a917722256478856-1024-1024.webp',
      ],
      variants: [
        { size: 'S', color: 'Negro', sku: 'BIK-LUNA-S-NEG', stock: 8, cost: 12000 },
        { size: 'M', color: 'Negro', sku: 'BIK-LUNA-M-NEG', stock: 12, cost: 12000 },
        { size: 'L', color: 'Negro', sku: 'BIK-LUNA-L-NEG', stock: 5, cost: 12000 },
        { size: 'S', color: 'Vino', sku: 'BIK-LUNA-S-VIN', stock: 6, cost: 12000 },
        { size: 'M', color: 'Vino', sku: 'BIK-LUNA-M-VIN', stock: 3, cost: 12000 },
      ],
    },
    {
      name: 'Bikini Roma Gold Edition',
      slug: 'bikini-roma-gold',
      description: 'Top strapless con detalle de argolla dorada y vedetina regulable. Elegancia pura para la playa o piscina.',
      price: 32000,
      originalPrice: null,
      cost: 14000,
      sku: 'BIK-ROMA',
      categoryId: catBikinis.id,
      isFeatured: true,
      isOffer: false,
      is18Plus: false,
      images: [
        '/img/vikinis/mf-26-140965-bc3571359d2bff666b17583136920208-1024-1024.webp',
        '/img/vikinis/texto-4000-x-6000-px-54-5180353b2392b0c19817621813815559-1024-1024.webp',
      ],
      variants: [
        { size: 'S', color: 'Blanco', sku: 'BIK-ROMA-S-BLA', stock: 4, cost: 14000 },
        { size: 'M', color: 'Blanco', sku: 'BIK-ROMA-M-BLA', stock: 7, cost: 14000 },
        { size: 'L', color: 'Blanco', sku: 'BIK-ROMA-L-BLA', stock: 0, cost: 14000 },
        { size: 'S', color: 'Nude', sku: 'BIK-ROMA-S-NUD', stock: 5, cost: 14000 },
      ],
    },
    {
      name: 'Bikini Sol Tropique',
      slug: 'bikini-sol-tropique',
      description: 'Diseño asimétrico ultra moderno con recorte lateral y terminaciones invisibles. Estiliza la figura con gran confort.',
      price: 26000,
      originalPrice: 31000,
      cost: 11000,
      sku: 'BIK-SOL',
      categoryId: catBikinis.id,
      isFeatured: false,
      isOffer: true,
      is18Plus: false,
      images: [
        '/img/vikinis/bikini-naima-lurex-botanico-91e0adb3b1da2c67a917722256478856-1024-1024.webp',
      ],
      variants: [
        { size: 'S', color: 'Rojo', sku: 'BIK-SOL-S-ROJ', stock: 10, cost: 11000 },
        { size: 'M', color: 'Rojo', sku: 'BIK-SOL-M-ROJ', stock: 8, cost: 11000 },
        { size: 'L', color: 'Rojo', sku: 'BIK-SOL-L-ROJ', stock: 4, cost: 11000 },
      ],
    },

    // LENCERÍA
    {
      name: 'Conjunto Venus Encaje & Seda',
      slug: 'conjunto-venus-encaje',
      description: 'Conjunto de corpiño con aro y breteles regulables + colaless regulable en encaje bordó de alta densidad.',
      price: 36000,
      originalPrice: 42000,
      cost: 15000,
      sku: 'LEN-VENUS',
      categoryId: catLenceria.id,
      isFeatured: true,
      isOffer: true,
      is18Plus: false,
      images: [
        '/img/lenceria/16994300665e1678729e65018751ee1f0f40848ad2_thumbnail_720x.jpg',
        '/img/lenceria/conjunto-304-Negro-malena-boomshell-distribuidora.png',
      ],
      variants: [
        { size: '85', color: 'Vino', sku: 'LEN-VEN-85-VIN', stock: 6, cost: 15000 },
        { size: '90', color: 'Vino', sku: 'LEN-VEN-90-VIN', stock: 10, cost: 15000 },
        { size: '95', color: 'Vino', sku: 'LEN-VEN-95-VIN', stock: 4, cost: 15000 },
        { size: '85', color: 'Negro', sku: 'LEN-VEN-85-NEG', stock: 8, cost: 15000 },
        { size: '90', color: 'Negro', sku: 'LEN-VEN-90-NEG', stock: 12, cost: 15000 },
      ],
    },
    {
      name: 'Body Desire Blanc',
      slug: 'body-desire-blanc',
      description: 'Body delicado de encaje blanco con escote profundo en espalda y terminaciones de puntilla suave.',
      price: 44000,
      originalPrice: null,
      cost: 19000,
      sku: 'LEN-BODY-BLANC',
      categoryId: catLenceria.id,
      isFeatured: true,
      isOffer: false,
      is18Plus: false,
      images: [
        '/img/lenceria/beth-blanco-281b45201978a17d7d17781943258337-480-0.webp',
        '/img/lenceria/conjunto-304-Blanco-malena-boomshell-distribuidora.png',
      ],
      variants: [
        { size: 'S', color: 'Blanco', sku: 'LEN-[#BOD-S-BLA', stock: 5, cost: 19000 },
        { size: 'M', color: 'Blanco', sku: 'LEN-BOD-M-BLA', stock: 7, cost: 19000 },
        { size: 'L', color: 'Blanco', sku: 'LEN-BOD-L-BLA', stock: 3, cost: 19000 },
      ],
    },
    {
      name: 'Conjunto Passion Embroidery',
      slug: 'conjunto-passion-embroidery',
      description: 'Edición limitada con bordado florales, tiras elásticas de tacto suave y taza soft con puntilla francesa.',
      price: 39500,
      originalPrice: 47000,
      cost: 17000,
      sku: 'LEN-[#PASSION',
      categoryId: catLenceria.id,
      isFeatured: false,
      isOffer: true,
      is18Plus: false,
      images: [
        '/img/lenceria/Supply-Of-Europe-And-The-United-States-New-Pure-Underwear-Lace-Embroidery-Uniform-Passion-Temptation-Female-Sexy-Underwear-Suit-0.webp',
      ],
      variants: [
        { size: '85', color: 'Negro', sku: 'LEN-PAS-85-NEG', stock: 3, cost: 17000 },
        { size: '90', color: 'Negro', sku: 'LEN-PAS-90-NEG', stock: 5, cost: 17000 },
      ],
    },

    // INDUMENTARIA DEPORTIVA
    {
      name: 'Calza LadyFit High Waist',
      slug: 'calza-ladyfit-high-waist',
      description: 'Calza deportiva seamless con tiro súper alto que moldea la figura y brinda máximo confort durante la actividad.',
      price: 35000,
      originalPrice: null,
      cost: 15000,
      sku: 'DEP-CALZA-LADY',
      categoryId: catDeportiva.id,
      isFeatured: true,
      isOffer: false,
      is18Plus: false,
      images: [
        '/img/deportivo/05a-ladyfit-mujer-3-calza1-3809b5d9835af671a916572394874210-480-0.jpg',
        '/img/deportivo/VUORI-yoga-deportes-banner4.jpg',
      ],
      variants: [
        { size: 'S', color: 'Negro', sku: 'DEP-LAD-S-NEG', stock: 12, cost: 15000 },
        { size: 'M', color: 'Negro', sku: 'DEP-LAD-M-NEG', stock: 15, cost: 15000 },
        { size: 'L', color: 'Negro', sku: 'DEP-LAD-L-NEG', stock: 6, cost: 15000 },
      ],
    },
    {
      name: 'Short Active Swan',
      slug: 'short-active-swan',
      description: 'Short deportivo cómodo de tiro medio, ideal para entrenamiento, running o uso casual veraniego.',
      price: 22000,
      originalPrice: 26000,
      cost: 9000,
      sku: 'DEP-SHORT-SWAN',
      categoryId: catDeportiva.id,
      isFeatured: false,
      isOffer: true,
      is18Plus: false,
      images: [
        '/img/deportivo/Short-deportivo-para-mujer-SWAN-370x444.webp',
        '/img/deportivo/images.jpg',
      ],
      variants: [
        { size: 'S', color: 'Gris', sku: 'DEP-SWA-S-GRI', stock: 9, cost: 9000 },
        { size: 'M', color: 'Gris', sku: 'DEP-SWA-M-GRI', stock: 11, cost: 9000 },
        { size: 'L', color: 'Gris', sku: 'DEP-SWA-L-GRI', stock: 7, cost: 9000 },
      ],
    },

    // +18 / ERÓTICOS
    {
      name: 'Vibrador Varita Sensual Luxe (+18)',
      slug: 'vibrador-varita-sensual-luxe',
      description: 'Estimulador ergonómico recargable por USB, silencioso y 100% resistente al agua. Silicona de grado médico ultramer suave.',
      price: 48000,
      originalPrice: 56000,
      cost: 21000,
      sku: 'ER-VIB-VARITA',
      categoryId: catPlus18.id,
      isFeatured: true,
      isOffer: true,
      is18Plus: true,
      images: [
        '/img/+18/118291-61em2ohsbjl-ac-sl1500.jpeg',
        '/img/+18/D_NQ_NP_850482-MLA115245628195_072026-O.webp',
      ],
      variants: [
        { color: 'Rosa Gold', model: 'Recargable USB', sku: 'ER-VIB-ROS', stock: 6, cost: 21000 },
        { color: 'Negro Mate', model: 'Recargable USB', sku: 'ER-VIB-NEG', stock: 4, cost: 21000 },
      ],
    },
    {
      name: 'Gel Íntimo Snella Lubricante Sabor Frutilla (+18)',
      slug: 'gel-intimo-snella-frutilla',
      description: 'Gel lubricante a base de agua sabor frutilla. No mancha, fácil de lavar e ideal para masajes sensitivos.',
      price: 18500,
      originalPrice: null,
      cost: 7000,
      sku: 'ER-GEL-FRUTILLA',
      categoryId: catPlus18.id,
      isFeatured: false,
      isOffer: false,
      is18Plus: true,
      images: [
        '/img/+18/gel-intimo-snella-hidratante-y-lubricante-x-60-g.jpg',
        '/img/+18/146468_lubricante-en-gel-para-uso-intimo-sabor-frutilla-x-50-gr__imagen-1.webp',
      ],
      variants: [
        { model: 'Frutilla 60g', sku: 'ER-GEL-FRU-60', stock: 15, cost: 7000 },
        { model: 'Frutilla 50g', sku: 'ER-GEL-FRU-50', stock: 12, cost: 7000 },
      ],
    },
    {
      name: 'Bullet Concentrado Sensación Intensa (+18)',
      slug: 'bullet-concentrado-sensacion-intensa',
      description: 'Estimulador discreto compacto de 10 frecuencias de pulsación con acabado metálico suave.',
      price: 29000,
      originalPrice: 35000,
      cost: 11000,
      sku: 'ER-BULLET-GOLD',
      categoryId: catPlus18.id,
      isFeatured: true,
      isOffer: true,
      is18Plus: true,
      images: [
        '/img/+18/D_NQ_NP_981163-MLA115523853847_082026-O.webp',
        '/img/+18/image-1634890884.avif',
      ],
      variants: [
        { color: 'Dorado Champagne', sku: 'ER-BUL-DOR', stock: 8, cost: 11000 },
        { color: 'Vino Satin', sku: 'ER-BUL-VIN', stock: 5, cost: 11000 },
      ],
    },
  ];

  for (const p of productsData) {
    const createdProduct = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        cost: p.cost,
        sku: p.sku,
        categoryId: p.categoryId,
        isFeatured: p.isFeatured,
        isOffer: p.isOffer,
        is18Plus: p.is18Plus,
      },
    });

    // Create Images
    for (let i = 0; i < p.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: p.images[i],
          order: i,
        },
      });
    }

    // Create Variants & Initial Stock Movements
    for (const v of p.variants) {
      const createdVariant = await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          size: v.size || null,
          color: v.color || null,
          model: v.model || null,
          sku: v.sku,
          stock: v.stock,
        },
      });

      if (v.stock > 0) {
        await prisma.inventoryMovement.create({
          data: {
            variantId: createdVariant.id,
            type: 'INGRESO',
            quantity: v.stock,
            previousStock: 0,
            newStock: v.stock,
            notes: 'Stock inicial de inventario',
          },
        });
      }
    }
  }

  // Create Initial Sample Orders for Dashboard
  const p1 = await prisma.product.findFirst({ where: { slug: 'bikini-luna-velvet' }, include: { variants: true } });
  const p2 = await prisma.product.findFirst({ where: { slug: 'conjunto-venus-encaje' }, include: { variants: true } });
  const p3 = await prisma.product.findFirst({ where: { slug: 'calza-ladyfit-high-waist' }, include: { variants: true } });

  if (p1 && p2 && p3 && p1.variants.length > 0 && p2.variants.length > 0 && p3.variants.length > 0) {
    const order1 = await prisma.order.create({
      data: {
        orderNumber: 1001,
        customerName: 'Mariana Gomez',
        customerPhone: '5491145678901',
        city: 'Buenos Aires',
        address: 'Palermo Soho, Calle Armenia 1540 3A',
        deliveryMethod: 'ENVIO',
        paymentMethod: 'TRANSFERENCIA',
        comments: 'Por favor entregar por la tarde',
        totalAmount: 64500,
        status: 'ENTREGADO',
        paymentStatus: 'COBRADO',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.orderItem.create({
      data: {
        orderId: order1.id,
        productId: p1.id,
        variantId: p1.variants[0].id,
        productName: p1.name,
        variantDetails: `${p1.variants[0].color || ''} - ${p1.variants[0].size || ''}`,
        quantity: 1,
        unitPrice: p1.price,
        subtotal: p1.price,
      },
    });

    await prisma.orderItem.create({
      data: {
        orderId: order1.id,
        productId: p2.id,
        variantId: p2.variants[0].id,
        productName: p2.name,
        variantDetails: `${p2.variants[0].color || ''} - ${p2.variants[0].size || ''}`,
        quantity: 1,
        unitPrice: p2.price,
        subtotal: p2.price,
      },
    });

    const order2 = await prisma.order.create({
      data: {
        orderNumber: 1002,
        customerName: 'Camila Rodriguez',
        customerPhone: '5491187654321',
        city: 'Cordoba',
        address: 'Nueva Córdoba, Av. Hipólito Yrigoyen 450',
        deliveryMethod: 'ENVIO',
        paymentMethod: 'EFECTIVO',
        comments: null,
        totalAmount: 35000,
        status: 'PENDIENTE',
        paymentStatus: 'PENDIENTE',
        createdAt: new Date(),
      },
    });

    await prisma.orderItem.create({
      data: {
        orderId: order2.id,
        productId: p3.id,
        variantId: p3.variants[0].id,
        productName: p3.name,
        variantDetails: `${p3.variants[0].color || ''} - ${p3.variants[0].size || ''}`,
        quantity: 1,
        unitPrice: p3.price,
        subtotal: p3.price,
      },
    });
  }

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
