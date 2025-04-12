import {
  DrugIndication,
  DrugIndicationDocument,
} from '../entities/drug-indication.entity';

export interface IDrugIndicationRepository {
  create(drugIndication: DrugIndication): Promise<DrugIndicationDocument>;
  findById(id: string): Promise<DrugIndicationDocument | null>;
  findAll(): Promise<DrugIndicationDocument[]>;
  update(
    id: string,
    drugIndication: Partial<DrugIndication>,
  ): Promise<DrugIndicationDocument | null>;
  delete(id: string): Promise<void>;
  findByDrugName(drugName: string): Promise<DrugIndicationDocument[]>;
  findByIcd10Code(icd10Code: string): Promise<DrugIndicationDocument[]>;
}
