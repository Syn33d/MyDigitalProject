import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCollaborationMagazineDto } from './dto/create-collaborationMagazine.dto';
import { CollaborationMagazine } from './entities/collaborationMagazine.entity';
import { UpdateCollaborationMagazineDto } from './dto/update-collaborationMagazine.dto';

@Injectable()
export class CollaborationMagazineService {
  constructor (@InjectRepository(CollaborationMagazine) private data: Repository<CollaborationMagazine>){}

  async create(dto: CreateCollaborationMagazineDto): Promise<CollaborationMagazine> {
    try {
      return await this.data.save(dto);
    } catch (error) {
      throw new ConflictException();
    }
  }

  findAll() {
    return this.data.find();
  }

  async findOne(id: number): Promise<CollaborationMagazine> {
    try {
      return await this.data.findOneBy({id});
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async update(id: number, dto: UpdateCollaborationMagazineDto): Promise<CollaborationMagazine> {
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