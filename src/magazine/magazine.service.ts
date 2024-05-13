import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { UpdateMagazineDto } from './dto/update-magazine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Magazine } from './entities/magazine.entity';
import { Repository, MoreThan, LessThan } from 'typeorm';

@Injectable()
export class MagazineService {
  constructor (@InjectRepository(Magazine) private data: Repository<Magazine>){}

  async create(dto: CreateMagazineDto): Promise<Magazine> {
    try {
      return await this.data.save(dto);
    } catch (error) {
      throw new ConflictException();
    }
  }

  findAll() {
    return this.data.find();
  }

  async findOneById(id: number): Promise<Magazine> {
    const magazine = await this.data.findOneBy({id});
    if (!magazine) {
      throw new NotFoundException();
    }
    // Sort articles so that free articles come first
    magazine.article.sort((a, b) => a.isFree === b.isFree ? 0 : a.isFree ? -1 : 1);
    
    // Find the first paid article and mark it as blocked
    const firstPaidArticle = magazine.article.find(article => !article.isFree);
    if (firstPaidArticle) {
      firstPaidArticle.isBlocked = true;
    }
    
    return magazine;
  }

  async findOneByDate(date: Date): Promise<Magazine> {
    try {
      return await this.data.findOneBy({date});
    } catch (error) {
      throw new NotFoundException();
    }
  }
  
  async findAllFromDate(date: Date): Promise<Magazine[]> {
    return this.data.find({
      where: { date: MoreThan(date) }
    });
  }

  FindAllBeforeDate(date: Date): Promise<Magazine[]> {
    return this.data.find({
      where: { date: LessThan(date) }
    });
  }

  async update(id: number, dto: UpdateMagazineDto): Promise<Magazine> {
    try {
      let done = await this.data.update(id, dto);
      if (done.affected != 1) {
        throw new NotFoundException();
      }
    }catch (error) {
      throw error instanceof NotFoundException ? error : new ConflictException();
    }
    return this.findOneById(id);
  }

  async remove(id: number): Promise<void> {
    let done = await this.data.delete(id);
    if (done.affected != 1) {
      throw new NotFoundException();
    }
  }
}
