import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DrugIndicationService } from 'src/application/drug-indications/services/drug-indication.service';
import { FindByIcd10CodeDrugIndicationUseCase } from 'src/application/drug-indications/use-cases/find-icd10-drug-indication.use-case';
import { FindByNameDrugIndicationUseCase } from 'src/application/drug-indications/use-cases/find-name-drug-indication.use-case';
import { DrugIndicationRepository } from 'src/infrastructure/persistence/mongoose/repositories/drug-indication.repository';
import { DrugIndicationSchema } from 'src/infrastructure/persistence/mongoose/schemas/drug-indication.schema';
import { DrugIndicationController } from '../../presentation/rest/drug-indication.controller';
import {
  CreateDrugIndicationUseCase,
  DRUG_INDICATION_REPOSITORY,
} from './use-cases/create-drug-indication.use-case';
import { DeleteDrugIndicationUseCase } from './use-cases/delete-drug-indication.use-case';
import { FindByIdDrugIndicationUseCase } from './use-cases/find-drug-indication.use-case';
import { UpdateDrugIndicationUseCase } from './use-cases/update-drug-indication.use-case';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'DrugIndication',
        schema: DrugIndicationSchema,
        collection: 'drug_indications',
      },
    ]),
  ],
  controllers: [DrugIndicationController],
  providers: [
    DrugIndicationService,
    CreateDrugIndicationUseCase,
    UpdateDrugIndicationUseCase,
    FindByIdDrugIndicationUseCase,
    FindByIdDrugIndicationUseCase,
    FindByNameDrugIndicationUseCase,
    FindByIcd10CodeDrugIndicationUseCase,
    DeleteDrugIndicationUseCase,
    {
      provide: DRUG_INDICATION_REPOSITORY,
      useClass: DrugIndicationRepository,
    },
  ],
  exports: [DRUG_INDICATION_REPOSITORY],
})
export class DrugIndicationsModule {}
