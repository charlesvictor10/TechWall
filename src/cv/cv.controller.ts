import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvEntity } from './entities/cv.entity';
import { AddCvDto } from './dto/add-cv.dto';
import { UpdateCVDto } from './dto/update-cv.dto';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';

@Controller('cv')
export class CvController {
    constructor(private cvService: CvService){}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllCvs(@User() user): Promise<CvEntity[]> {        
        return await this.cvService.getCvs(user);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async addCv(@Body() cv: AddCvDto, @User() user): Promise<CvEntity> {
        return await this.cvService.addCv(cv, user);
    }

    @Patch()    
    @UseGuards(JwtAuthGuard)
    updateCv2(@Body() UpdateObject, @User() user) {
        const {updateCriteria, updateCvDto} = UpdateObject;
        return this.cvService.updateCv2(updateCriteria, updateCvDto);
    }

    @Get('stats')    
    @UseGuards(JwtAuthGuard)
    async statsCvNumberByAge() {
        return await this.cvService.statCvNumberByAge();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getCv(@Param("id", ParseIntPipe) id: number, @User() user): Promise<CvEntity> {
        return await this.cvService.findCvById(id, user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteCv(@Param('id', ParseIntPipe) id: number, @User() user) {
        return this.cvService.softDeleteCv(id, user);
    }

    /*@Delete(':id')    
    @UseGuards(JwtAuthGuard)
    async removeCv(@Param('id', ParseIntPipe) id: number) {
        return this.cvService.removeCv(id);
    }*/

    @Get('recover/:id')
    @UseGuards(JwtAuthGuard)
    async restoreCv(@Param('id', ParseIntPipe) id: number, @User() user) {
        return await this.cvService.restoreCv(id, user);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async updateCv(@Body() cv: UpdateCVDto, @Param('id', ParseIntPipe) id: number, @User() user): Promise<CvEntity> {
        return await this.cvService.updateCv(id, cv, user);
    }
}
