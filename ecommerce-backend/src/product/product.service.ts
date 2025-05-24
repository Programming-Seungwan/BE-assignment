import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  async create(createProductDto: CreateProductDto) {
    await this.productRepository.save(createProductDto);

    const storedProduct = await this.productRepository.findOne({
      where: {
        productName: createProductDto.productName,
      },
    });

    return storedProduct;
  }

  async findAll() {
    return await this.productRepository.findAndCount();
  }

  async findOne(id: number) {
    const foundProductWithId = await this.productRepository.findOne({
      where: { id },
    });

    if (!foundProductWithId) {
      throw new NotFoundException(`해당 ${id}에 해당하는 제품이 없습니다!`);
    }

    return foundProductWithId;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const foundExistingProductWithId = await this.productRepository.findOne({
      where: { id },
    });

    if (!foundExistingProductWithId) {
      throw new NotFoundException(
        `변경하려는 ${id}에 해당하는 제품이 없습니다!`
      );
    }

    await this.productRepository.update(id, updateProductDto);

    return await this.productRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const foundExistingProductWithId = await this.productRepository.findOne({
      where: { id },
    });

    if (!foundExistingProductWithId) {
      throw new NotFoundException(
        `삭제하려는 ${id}에 해당하는 제품이 없습니다!`
      );
    }

    await this.productRepository.delete(id);
  }
}
