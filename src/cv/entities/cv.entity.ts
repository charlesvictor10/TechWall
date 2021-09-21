import { TimeStamp } from "src/generic/timestamp.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('cv')
export class CvEntity extends TimeStamp {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    firstname: string;
    @Column()
    lastname: string;
    @Column()
    age: number;
    @Column({
        unique: true,
        nullable: false
    })
    cin: number;
    @Column()
    job: string;
    @Column()
    path: string;
    @ManyToOne(
        type => UserEntity,
        (user) => user.cvs,
        {
            cascade: ['insert', 'update'],
            nullable: true,
            eager: true
        }
    )
    user: UserEntity;
}
