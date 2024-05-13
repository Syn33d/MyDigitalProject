import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollaborationMagazineController } from './collaborationMagazine.controller';
import { CollaborationMagazine } from './entities/collaborationMagazine.entity';
import { CollaborationMagazineService } from './collaborationMagazine.service';

@Module({
  imports: [
  TypeOrmModule.forFeature([CollaborationMagazine]),
  ],
  controllers: [CollaborationMagazineController],
  providers: [CollaborationMagazineService],
})
export class CollaborationMagazineModule {}
