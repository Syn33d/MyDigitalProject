import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InvoiceService {
  constructor (@InjectRepository(Invoice) private data: Repository<Invoice>){}

  async create(dto: CreateInvoiceDto): Promise<Invoice> {
    try {
      return await this.data.save(dto);
    } catch (error) {
      throw new ConflictException();
    }
  }

  findAll() {
    return this.data.find();
  }

  async findOne(id: number): Promise<Invoice> {
    try {
      return await this.data.findOneBy({id});
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async update(id: number, dto: UpdateInvoiceDto): Promise<Invoice> {
    try {
      let done = await this.data.update(id, dto);
      if (done.affected != 1) {
        throw new NotFoundException();
      }
    }catch (error) {
      throw error instanceof NotFoundException ? error : new ConflictException();
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    let done = await this.data.delete(id);
    if (done.affected != 1) {
      throw new NotFoundException();
    }
  }
}