import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtworkDto } from './dto/create-artwork.dto';
import { UpdateArtworkDto } from './dto/update-artwork.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Artwork } from './entities/artwork.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtworkService {
  constructor (@InjectRepository(Artwork) private data: Repository<Artwork>){}

  async create(dto: CreateArtworkDto): Promise<Artwork> {
    try {
      return await this.data.save(dto);
    } catch (error) {
      throw new ConflictException();
    }
  }

  findAll() {
    return this.data.find();
  }

  async findOne(id: number): Promise<Artwork> {
    try {
      return await this.data.findOneBy({id});
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async update(id: number, dto: UpdateArtworkDto): Promise<Artwork> {
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
