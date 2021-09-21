import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { UserEntity } from '../entities/user.entity';
import { PayloadInterface } from "../interface/payload.interface";
import { InjectRepository } from '@nestjs/typeorm';
import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export class PassportJwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
        ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('SECRET'),
        });
    }

    async validate(payload: PayloadInterface) {
        const user = await this.userRepository.findOne({username: payload.username});
        if(user) {
            delete user.salt;
            delete user.password;
            return user;
        } else {
            throw new UnauthorizedException();
        }
    }
}