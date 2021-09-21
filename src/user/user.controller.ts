import { Controller, Post, Body } from '@nestjs/common';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { UserSubscribeDto } from './dto/user-subscribe.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Post()
    register(@Body() userData: UserSubscribeDto): Promise<Partial<UserEntity>> {
        return this.userService.register(userData);
    }

    @Post('login')
    login(@Body() credentials: LoginCredentialsDto) {
        return this.userService.login(credentials);
    }
}
