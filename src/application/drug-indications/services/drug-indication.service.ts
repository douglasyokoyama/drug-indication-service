import { Injectable } from '@nestjs/common';
import { CreateDrugIndicationDto } from 'src/application/drug-indications/dto/create-drug-indication.dto';
import { UpdateDrugIndicationDto } from 'src/application/drug-indications/dto/update-drug-indication.dto';
import { CreateDrugIndicationUseCase } from 'src/application/drug-indications/use-cases/create-drug-indication.use-case';
import { DeleteDrugIndicationUseCase } from 'src/application/drug-indications/use-cases/delete-drug-indication.use-case';
import { FindDrugIndicationUseCase } from 'src/application/drug-indications/use-cases/find-drug-indication.use-case';
import { UpdateDrugIndicationUseCase } from 'src/application/drug-indications/use-cases/update-drug-indication.use-case';
import { DrugIndication } from 'src/domain/drug-indications/entities/drug-indication.entity';

@Injectable()
export class DrugIndicationService {
  constructor(
    private readonly createDrugIndicationUseCase: CreateDrugIndicationUseCase,
    private readonly findDrugIndicationUseCase: FindDrugIndicationUseCase,
    private readonly updateDrugIndicationUseCase: UpdateDrugIndicationUseCase,
    private readonly deleteDrugIndicationUseCase: DeleteDrugIndicationUseCase,
  ) {}

  async create(
    createDrugIndicationDto: CreateDrugIndicationDto,
  ): Promise<DrugIndication> {
    return this.createDrugIndicationUseCase.execute(createDrugIndicationDto);
  }

  async findOne(id: string): Promise<DrugIndication> {
    return this.findDrugIndicationUseCase.findById(id);
  }

  async update(
    id: string,
    updateDrugIndicationDto: UpdateDrugIndicationDto,
  ): Promise<DrugIndication> {
    return this.updateDrugIndicationUseCase.execute(
      id,
      updateDrugIndicationDto,
    );
  }

  async remove(id: string): Promise<void> {
    return this.deleteDrugIndicationUseCase.execute(id);
  }
}
