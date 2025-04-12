import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UpdateDrugIndicationDto } from '../dto/update-drug-indication.dto';
import { DrugIndicationDocument } from 'src/domain/drug-indications/entities/drug-indication.entity';
import { IDrugIndicationRepository } from 'src/domain/drug-indications/repositories/drug-indication.repository.interface';
import { DRUG_INDICATION_REPOSITORY } from './create-drug-indication.use-case';

@Injectable()
export class UpdateDrugIndicationUseCase {
  constructor(
    @Inject(DRUG_INDICATION_REPOSITORY)
    private readonly drugIndicationRepository: IDrugIndicationRepository,
  ) {}

  async execute(
    id: string,
    updateDrugIndicationDto: UpdateDrugIndicationDto,
  ): Promise<DrugIndicationDocument> {
    const updatedDrugIndication = await this.drugIndicationRepository.update(
      id,
      updateDrugIndicationDto,
    );
    if (!updatedDrugIndication) {
      throw new NotFoundException(`Drug indication with ID ${id} not found`);
    }
    return updatedDrugIndication;
  }
}
