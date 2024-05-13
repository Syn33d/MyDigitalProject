import { Module } from '@nestjs/common';
import { ArtworkService } from './artwork.service';
import { ArtworkController } from './artwork.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artwork } from './entities/artwork.entity';

@Module({
  imports: [
  TypeOrmModule.forFeature([Artwork]),
  ],
  controllers: [ArtworkController],
  providers: [ArtworkService],
})
export class ArtworkModule {}
