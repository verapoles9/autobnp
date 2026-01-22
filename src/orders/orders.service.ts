import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export class CreateOrderDto {
  items: { productId: number; quantity: number }[];
}

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto, userId: number) {
    const productIds = dto.items.map(item => item.productId);
    const products = await this.prisma.product.findMany({
      where: { 
        id: { in: productIds }, 
        deletedAt: null 
      }
    });

    // ✅ Явное приведение типов
    const productMap = new Map<number, Prisma.ProductGetPayload<{}>>(
      products.map(p => [p.id, p])
    );

    for (const item of dto.items) {
      const product = productMap.get(item.productId);
      if (!product) throw new NotFoundException(`Product ${item.productId} not found`);
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Недостаточно товара ${item.productId}`);
      }
    }

    // ✅ Рассчет total с типизацией
    let total = 0;
    for (const item of dto.items) {
      const product = productMap.get(item.productId) as Prisma.ProductGetPayload<{}>;
      total += Number(product.price) * item.quantity;
    }

    const order = await this.prisma.order.create({
      data: { userId, total },
      include: { items: { include: { product: true } } }
    });

    for (const item of dto.items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    return order;
  }

  async findAll(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: number, userId: number) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: { items: { include: { product: true } } }
    });
    if (!order) throw new NotFoundException('Заказ не найден');
    return order;
  }
}
