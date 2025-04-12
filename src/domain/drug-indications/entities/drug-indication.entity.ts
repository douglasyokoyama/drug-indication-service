import { Document, Types } from 'mongoose';

export interface DrugIndication {
  drugName: string;
  indication: string;
  icd10Code: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DrugIndicationDocument extends DrugIndication, Document {
  _id: Types.ObjectId;
}
