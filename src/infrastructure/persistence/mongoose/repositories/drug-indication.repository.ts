import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DrugIndication,
  DrugIndicationDocument,
} from 'src/domain/drug-indications/entities/drug-indication.entity';
import { IDrugIndicationRepository } from 'src/domain/drug-indications/repositories/drug-indication.repository.interface';

@Injectable()
export class DrugIndicationRepository implements IDrugIndicationRepository {
  constructor(
    @InjectModel('DrugIndication')
    private readonly drugIndicationModel: Model<DrugIndicationDocument>,
  ) {}

  async create(
    drugIndication: DrugIndication,
  ): Promise<DrugIndicationDocument> {
    const createdDrugIndication = new this.drugIndicationModel(drugIndication);
    return createdDrugIndication.save();
  }

  async findById(id: string): Promise<DrugIndicationDocument | null> {
    return this.drugIndicationModel.findById(id).exec();
  }

  async findAll(): Promise<DrugIndicationDocument[]> {
    return this.drugIndicationModel.find().exec();
  }

  async update(
    id: string,
    drugIndication: Partial<DrugIndication>,
  ): Promise<DrugIndicationDocument | null> {
    return this.drugIndicationModel
      .findByIdAndUpdate(id, drugIndication, { new: true })
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.drugIndicationModel.findByIdAndDelete(id).exec();
  }

  async findByDrugName(drugName: string): Promise<DrugIndicationDocument[]> {
    return this.drugIndicationModel
      .find({ drugName: { $regex: drugName, $options: 'i' } })
      .exec();
  }

  async findByIcd10Code(icd10Code: string): Promise<DrugIndicationDocument[]> {
    return this.drugIndicationModel
      .find({ icd10Code: { $regex: icd10Code, $options: 'i' } })
      .exec();
  }
}
