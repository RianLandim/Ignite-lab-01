import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

interface CreateCustomerParams {
  authUserID: string;
}

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  getByAuthUserId(authUserID: string) {
    return this.prisma.customer.findUnique({
      where: { authUserID },
    });
  }

  create({ authUserID }: CreateCustomerParams) {
    return this.prisma.customer.create({
      data: {
        authUserID,
      },
    });
  }
}
