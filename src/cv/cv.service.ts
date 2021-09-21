import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddCvDto } from './dto/add-cv.dto';
import { UpdateCVDto } from './dto/update-cv.dto';
import { CvEntity } from './entities/cv.entity';
import { UserRoleEnum } from 'src/enums/user-role.enum';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CvService {
    constructor(
        @InjectRepository(CvEntity)
        private cvRepository: Repository<CvEntity>,
        private userService: UserService
    ) {}

    async findCvById(id: number, user) {
        const cv = await this.cvRepository.findOne(id);
        if(!cv)
            throw new NotFoundException(`Le cv d'id ${id} n'existe pas`);
        if(this.userService.isOwnerOrAdmin(cv, user))
            return cv;
        else
            throw new UnauthorizedException();    
    }
    
    async getCvs(user): Promise<CvEntity[]> {
        if(user.role === UserRoleEnum.ADMIN)
            return await this.cvRepository.find();
        return await this.cvRepository.find({user});
    }

    async addCv(cv: AddCvDto, user): Promise<CvEntity> {
        const newCv = this.cvRepository.create(cv);
        newCv.user = user;
        return await this.cvRepository.save(newCv);
    }

    async updateCv(id: number, cv: UpdateCVDto, user): Promise<CvEntity> {
        const newCv = await this.cvRepository.preload({
            id,
            ...cv
        });

        if(!newCv)
            throw new NotFoundException(`Le cv d'id ${id} n'existe pas`); 

        if(this.userService.isOwnerOrAdmin(newCv, user)) 
            return await this.cvRepository.save(newCv);
        else
            throw new UnauthorizedException();
    }

    updateCv2(updateCriteria, cv: UpdateCVDto) {
        return this.cvRepository.update(updateCriteria, cv);
    }

    /*async removeCv(id: number) {
        const cvRemove = await this.findCvById(id);
        return await this.cvRepository.remove(cvRemove)
    }*/

    async softDeleteCv(id: number, user) {
        const cv = await this.cvRepository.findOne(id);
        if(!cv)
            throw new NotFoundException(`Le cv d'id ${id} n'existe pas`); 

        if(this.userService.isOwnerOrAdmin(cv, user)) 
            return await this.cvRepository.softDelete(id);
        else
            throw new UnauthorizedException();        
    }

    async restoreCv(id: number, user) {
        const cv = await this.cvRepository.query("select * from cv where id = ?", [id]);
        if(!cv)
            throw new NotFoundException(`Le cv d'id ${id} n'existe pas`); 

        if(this.userService.isOwnerOrAdmin(cv, user)) 
            return await this.cvRepository.restore(id);
        else
            throw new UnauthorizedException(); 
    }

    async statCvNumberByAge() {
        const qb = this.cvRepository.createQueryBuilder("cv");
        return await qb.select("cv.age, count(cv.id) as nbCv")
            .groupBy("cv.age")
            .getRawMany();
    }
}
