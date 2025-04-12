import { Schema } from 'mongoose';

export const DrugIndicationSchema = new Schema(
  {
    drugName: {
      type: String,
      required: true,
      index: true,
    },
    indication: {
      type: String,
      required: true,
    },
    icd10Code: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);
