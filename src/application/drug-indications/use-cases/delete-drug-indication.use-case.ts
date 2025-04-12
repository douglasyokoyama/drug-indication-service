import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IDrugIndicationRepository } from 'src/domain/drug-indications/repositories/drug-indication.repository.interface';
import { DRUG_INDICATION_REPOSITORY } from './create-drug-indication.use-case';

@Injectable()
export class DeleteDrugIndicationUseCase {
  constructor(
    @Inject(DRUG_INDICATION_REPOSITORY)
    private readonly drugIndicationRepository: IDrugIndicationRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const drugIndication = await this.drugIndicationRepository.findById(id);
    if (!drugIndication) {
      throw new NotFoundException(`Drug indication with ID ${id} not found`);
    }
    await this.drugIndicationRepository.delete(id);
  }
}
