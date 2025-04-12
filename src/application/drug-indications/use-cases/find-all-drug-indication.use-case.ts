import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DrugIndicationDocument } from 'src/domain/drug-indications/entities/drug-indication.entity';
import { IDrugIndicationRepository } from 'src/domain/drug-indications/repositories/drug-indication.repository.interface';
import { DRUG_INDICATION_REPOSITORY } from './create-drug-indication.use-case';
import { IUseCase } from 'src/shared/use-cases/base.use-case';

@Injectable()
export class FindAllDrugIndicationUseCase
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

  async findAll(): Promise<DrugIndicationDocument[]> {
    return this.drugIndicationRepository.findAll();
  }

  async findByDrugName(drugName: string): Promise<DrugIndicationDocument[]> {
    return this.drugIndicationRepository.findByDrugName(drugName);
  }

  async findByIcd10Code(icd10Code: string): Promise<DrugIndicationDocument[]> {
    return this.drugIndicationRepository.findByIcd10Code(icd10Code);
  }
}
