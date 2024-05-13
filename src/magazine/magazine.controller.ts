import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MagazineService } from './magazine.service';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { UpdateMagazineDto } from './dto/update-magazine.dto';

@Controller('magazine')
export class MagazineController {
  constructor(private readonly magazineService: MagazineService) {}

  @Post()
  create(@Body() createMagazineDto: CreateMagazineDto) {
    return this.magazineService.create(createMagazineDto);
  }

  @Get()
  findAll() {
    return this.magazineService.findAll();
  }

  @Get('FromDate/:date')
  findAllFromDate(@Param('date') date: string) {
    return this.magazineService.findAllFromDate(new Date(date));
  }

  @Get('BeforeDate/:date')
  FindAllBeforeDate(@Param('date') date: string) {
    return this.magazineService.FindAllBeforeDate(new Date(date));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.magazineService.findOneById(+id);
  }

  @Get('date')
  findOneByDate(@Param('date') date: string) {
    return this.magazineService.findOneByDate(new Date(date));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMagazineDto: UpdateMagazineDto) {
    return this.magazineService.update(+id, updateMagazineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.magazineService.remove(+id);
  }
}
