import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDrugIndicationDto {
  @ApiProperty({
    description: 'Name of the drug',
    example: 'Dupixent',
    required: false,
  })
  @IsOptional()
  @IsString()
  drugName?: string;

  @ApiProperty({
    description: 'Medical indication for the drug',
    example: 'Atopic Dermatitis',
    required: false,
  })
  @IsOptional()
  @IsString()
  indication?: string;

  @ApiProperty({
    description: 'ICD-10 code for the indication',
    example: 'L20.89',
    required: false,
  })
  @IsOptional()
  @IsString()
  icd10Code?: string;

  @ApiProperty({
    description: 'Additional description of the indication',
    example: 'For moderate-to-severe atopic dermatitis in adults',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
