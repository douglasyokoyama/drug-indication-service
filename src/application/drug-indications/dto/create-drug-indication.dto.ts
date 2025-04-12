import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDrugIndicationDto {
  @ApiProperty({
    description: 'Name of the drug',
    example: 'Dupixent',
  })
  @IsNotEmpty()
  @IsString()
  drugName: string;

  @ApiProperty({
    description: 'Medical indication for the drug',
    example: 'Atopic Dermatitis',
  })
  @IsNotEmpty()
  @IsString()
  indication: string;

  @ApiProperty({
    description: 'ICD-10 code for the indication',
    example: 'L20.89',
  })
  @IsNotEmpty()
  @IsString()
  icd10Code: string;

  @ApiProperty({
    description: 'Additional description of the indication',
    example: 'For moderate-to-severe atopic dermatitis in adults',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
