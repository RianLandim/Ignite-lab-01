import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreatePurchaseInput } from '../http/graphql/inputs/create-purchase';

interface CreatePurchaseParams {
  customerId: string;
  productId: string;
}

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  listAll() {
    return this.prisma.purchase.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  listAllFromCustomer(customerId: string) {
    return this.prisma.purchase.findMany({
      where: {
        customerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create({ customerId, productId }: CreatePurchaseParams) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return await this.prisma.purchase.create({
      data: {
        customerId,
        productId,
      },
    });
  }
}
