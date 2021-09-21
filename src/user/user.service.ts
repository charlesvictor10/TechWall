import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserSubscribeDto } from './dto/user-subscribe.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRoleEnum } from 'src/enums/user-role.enum';

@Injectable()
export class UserService {
    
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private jwtService: JwtService
    ) {}

    async register(userData: UserSubscribeDto): Promise<Partial<UserEntity>> {
        const user = this.userRepository.create({
            ...userData
        });
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, user.salt);
        try{
            await this.userRepository.save(user);
        } catch(e) {
            throw new ConflictException(`Le username et le password doivent être unique`);
        }        
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            password: user.password
        };
    }

    async login(credentials: LoginCredentialsDto) {
        const {username, password} = credentials;
        const user = await this.userRepository.createQueryBuilder("user")
            .where("user.username =:username or user.email =: username", {username})
            .getOne();
        if(!user) 
            throw new NotFoundException('username ou password incorrect');
        const hashPassword = await bcrypt.hash(password, user.salt);
        if(hashPassword ===  user.password) {
            const payload = {
                username: user.username,
                email: user.email,
                role: user.role
            }
            const jwt = await this.jwtService.sign(payload);
            return {
                "access_token": jwt
            }
        } else {
            throw new NotFoundException('username ou password incorrect');
        }
    }

    isOwnerOrAdmin(objet, user) {
        return user.role === UserRoleEnum.ADMIN || (objet.user && objet.user.id === user.id);
    }
}
