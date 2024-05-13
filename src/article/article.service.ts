import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(@InjectRepository(Article) private data: Repository<Article>){}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    try {
      return await this.data.save(createArticleDto);
    } catch (error) {
      throw new ConflictException();
    }
  }

  async findAll(): Promise<Article[]> {
    return this.data.find();
  }

  async findOneById(id: number): Promise<Article> {
    try {
      return await this.data.findOneBy({id});
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async update(id: number, dto: UpdateArticleDto): Promise<Article> {
    try {
      let done = await this.data.update(id, dto);
      if (done.affected != 1) {
        throw new NotFoundException();
      }
    }catch (error) {
      throw error instanceof NotFoundException ? error : new ConflictException();
    }
    return this.data.findOneById(id);
  }

  async remove (id: number): Promise<void> {
    try {
      let done = await this.data.delete(id);
      if (done.affected != 1) {
        throw new NotFoundException();
      }
    }catch (error) {
      throw error instanceof NotFoundException ? error : new ConflictException();
    }
  }
}
