import { Injectable, Inject } from '@nestjs/common';
import { CreateDrugIndicationDto } from '../dto/create-drug-indication.dto';
import { DrugIndicationDocument } from 'src/domain/drug-indications/entities/drug-indication.entity';
import { IDrugIndicationRepository } from 'src/domain/drug-indications/repositories/drug-indication.repository.interface';

export const DRUG_INDICATION_REPOSITORY = 'DRUG_INDICATION_REPOSITORY';

@Injectable()
export class CreateDrugIndicationUseCase {
  constructor(
    @Inject(DRUG_INDICATION_REPOSITORY)
    private readonly drugIndicationRepository: IDrugIndicationRepository,
  ) {}

  async execute(
    createDrugIndicationDto: CreateDrugIndicationDto,
  ): Promise<DrugIndicationDocument> {
    return this.drugIndicationRepository.create(createDrugIndicationDto);
  }
}
