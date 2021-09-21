import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class UpdateCVDto {
    @IsString()
    @IsOptional()
    firstname: string;
    @IsString()
    @IsOptional()
    lastname: string;
    @Type(() => Number)
    @IsNumber()
    @Min(15)
    @Max(65)
    @IsOptional()
    age: number;
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    cin: number;
    @IsString()
    @IsOptional()
    job: string;
    @IsOptional()
    @IsString()
    path: string;
}