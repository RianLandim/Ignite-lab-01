import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from '../database/prisma/prisma.service';

type CreateProduct = Omit<Prisma.ProductCreateInput, 'slug'>;

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  listAll() {
    return this.prisma.product.findMany();
  }

  getById(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async create({ title }: CreateProduct) {
    const slug = slugify(title, { lower: true });

    const productWithSameSlug = await this.prisma.product.findUnique({
      where: {
        slug,
      },
    });

    if (productWithSameSlug) {
      throw new Error('Product with same slug already exists');
    }

    return this.prisma.product.create({
      data: {
        title,
        slug,
      },
    });
  }
}
