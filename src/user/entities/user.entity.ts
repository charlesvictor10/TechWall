import { CvEntity } from "src/cv/entities/cv.entity";
import { UserRoleEnum } from "src/enums/user-role.enum";
import { TimeStamp } from "src/generic/timestamp.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class UserEntity extends TimeStamp {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        length: 50,
        unique: true
    })
    username: string;
    @Column({
        unique: true
    })
    email: string;
    @Column()
    password: string;
    @Column()
    salt: string;
    @Column({
        type: 'enum',
        enum: UserRoleEnum,
        default: UserRoleEnum.USER
    })
    role: string;
    @OneToMany(
        type => CvEntity,
        (cv) => cv.user,
        {
            eager: true,
            nullable: true, 
            cascade: true
        }
    )
    cvs: CvEntity[];
}
