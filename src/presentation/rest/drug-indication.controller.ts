import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateDrugIndicationDto } from '../../application/drug-indications/dto/create-drug-indication.dto';
import { UpdateDrugIndicationDto } from '../../application/drug-indications/dto/update-drug-indication.dto';
import { CreateDrugIndicationUseCase } from '../../application/drug-indications/use-cases/create-drug-indication.use-case';
import { UpdateDrugIndicationUseCase } from '../../application/drug-indications/use-cases/update-drug-indication.use-case';
import { FindDrugIndicationUseCase } from '../../application/drug-indications/use-cases/find-drug-indication.use-case';
import { DeleteDrugIndicationUseCase } from '../../application/drug-indications/use-cases/delete-drug-indication.use-case';
import { DrugIndicationDocument } from 'src/domain/drug-indications/entities/drug-indication.entity';

@ApiTags('drug-indications')
@Controller('drug-indications')
export class DrugIndicationController {
  constructor(
    private readonly createDrugIndicationUseCase: CreateDrugIndicationUseCase,
    private readonly updateDrugIndicationUseCase: UpdateDrugIndicationUseCase,
    private readonly findDrugIndicationUseCase: FindDrugIndicationUseCase,
    private readonly deleteDrugIndicationUseCase: DeleteDrugIndicationUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new drug indication' })
  @ApiResponse({
    status: 201,
    description: 'Drug indication created successfully',
  })
  async create(
    @Body() createDrugIndicationDto: CreateDrugIndicationDto,
  ): Promise<DrugIndicationDocument> {
    return this.createDrugIndicationUseCase.execute(createDrugIndicationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all drug indications' })
  @ApiResponse({ status: 200, description: 'Returns all drug indications' })
  async findAll(
    @Query('drugName') drugName?: string,
    @Query('icd10Code') icd10Code?: string,
  ): Promise<DrugIndicationDocument[]> {
    if (drugName) {
      return this.findDrugIndicationUseCase.findByDrugName(drugName);
    }
    if (icd10Code) {
      return this.findDrugIndicationUseCase.findByIcd10Code(icd10Code);
    }
    return this.findDrugIndicationUseCase.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a drug indication by ID' })
  @ApiResponse({ status: 200, description: 'Returns the drug indication' })
  @ApiResponse({ status: 404, description: 'Drug indication not found' })
  async findOne(@Param('id') id: string): Promise<DrugIndicationDocument> {
    return this.findDrugIndicationUseCase.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a drug indication' })
  @ApiResponse({
    status: 200,
    description: 'Drug indication updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Drug indication not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDrugIndicationDto: UpdateDrugIndicationDto,
  ): Promise<DrugIndicationDocument> {
    return this.updateDrugIndicationUseCase.execute(
      id,
      updateDrugIndicationDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a drug indication' })
  @ApiResponse({
    status: 200,
    description: 'Drug indication deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Drug indication not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.deleteDrugIndicationUseCase.execute(id);
  }
}
