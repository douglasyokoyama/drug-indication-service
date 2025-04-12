import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DrugIndicationDocument } from 'src/domain/drug-indications/entities/drug-indication.entity';
import { IDrugIndicationRepository } from 'src/domain/drug-indications/repositories/drug-indication.repository.interface';
import { DRUG_INDICATION_REPOSITORY } from './create-drug-indication.use-case';
import { IUseCase } from 'src/shared/use-cases/base.use-case';

@Injectable()
export class FindByIdDrugIndicationUseCase
  implements IUseCase<string, DrugIndicationDocument>
{
  constructor(
    @Inject(DRUG_INDICATION_REPOSITORY)
    private readonly drugIndicationRepository: IDrugIndicationRepository,
  ) {}

  async execute(input: string): Promise<DrugIndicationDocument> {
    const drugIndication = await this.drugIndicationRepository.findById(input);
    if (!drugIndication) {
      throw new NotFoundException(`Drug indication with ID ${input} not found`);
    }
    return drugIndication;
  }
}
