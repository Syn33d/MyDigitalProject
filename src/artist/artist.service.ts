import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor (@InjectRepository(Artist) private data: Repository<Artist>){}

  async create(dto: CreateArtistDto): Promise<Artist> {
    try {
      return await this.data.save(dto);
    } catch (error) {
      throw new ConflictException();
    }
  }

  findAll() {
    return this.data.find();
  }

  async findOne(id: number): Promise<Artist> {
    try {
      return await this.data.findOneBy({id});
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async update(id: number, dto: UpdateArtistDto): Promise<Artist> {
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
