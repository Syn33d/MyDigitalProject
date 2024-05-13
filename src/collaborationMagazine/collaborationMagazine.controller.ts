import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CollaborationMagazineService } from './collaborationMagazine.service';
import { CreateCollaborationMagazineDto } from './dto/create-collaborationMagazine.dto';
import { UpdateCollaborationMagazineDto } from './dto/update-collaborationMagazine.dto';


@Controller('collaborationMagazine')
export class CollaborationMagazineController {
  constructor(private readonly collaborationMagazineService: CollaborationMagazineService) {}

  @Post()
  create(@Body() createCollaborationMagazineDto: CreateCollaborationMagazineDto) {
    return this.collaborationMagazineService.create(createCollaborationMagazineDto);
  }

  @Get()
  findAll() {
    return this.collaborationMagazineService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collaborationMagazineService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCollaborationMagazineDto: UpdateCollaborationMagazineDto) {
    return this.collaborationMagazineService.update(+id, updateCollaborationMagazineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.collaborationMagazineService.remove(+id);
  }
}
