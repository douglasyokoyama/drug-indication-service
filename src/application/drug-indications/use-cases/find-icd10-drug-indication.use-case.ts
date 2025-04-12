import { Inject, Injectable } from '@nestjs/common';
import { DrugIndicationDocument } from 'src/domain/drug-indications/entities/drug-indication.entity';
import { IDrugIndicationRepository } from 'src/domain/drug-indications/repositories/drug-indication.repository.interface';
import { IUseCase } from 'src/shared/use-cases/base.use-case';
import { DRUG_INDICATION_REPOSITORY } from './create-drug-indication.use-case';

@Injectable()
export class FindByIcd10CodeDrugIndicationUseCase
  implements IUseCase<string, DrugIndicationDocument[]>
{
  constructor(
    @Inject(DRUG_INDICATION_REPOSITORY)
    private readonly drugIndicationRepository: IDrugIndicationRepository,
  ) {}

  async execute(input: string): Promise<DrugIndicationDocument[]> {
    return this.drugIndicationRepository.findByIcd10Code(input);
  }
}
