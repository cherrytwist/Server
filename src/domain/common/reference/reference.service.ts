import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityNotFoundException } from '@common/exceptions';
import { LogContext } from '@common/enums';
import { ReferenceInput } from './reference.dto';
import { Reference } from './reference.entity';
import { IReference } from './reference.interface';

@Injectable()
export class ReferenceService {
  constructor(
    @InjectRepository(Reference)
    private referenceRepository: Repository<Reference>
  ) {}

  async createReference(referenceInput: ReferenceInput): Promise<IReference> {
    const reference = new Reference(
      referenceInput.name,
      referenceInput.uri || '',
      referenceInput.description
    );
    await this.referenceRepository.save(reference);
    return reference;
  }

  async updateReference(
    reference: IReference,
    referenceData: ReferenceInput
  ): Promise<IReference> {
    // Copy over the received data if a uri is supplied
    if (referenceData.uri) {
      reference.uri = referenceData.uri;
    }

    if (referenceData.description) {
      reference.description = referenceData.description;
    } else {
      reference.description = '';
    }

    const updatedReference = await this.referenceRepository.save(reference);

    return updatedReference;
  }

  async getReferenceOrFail(referenceID: number): Promise<IReference> {
    const reference = await this.referenceRepository.findOne({
      id: referenceID,
    });
    if (!reference)
      throw new EntityNotFoundException(
        `Not able to locate reference with the specified ID: ${referenceID}`,
        LogContext.CHALLENGES
      );
    return reference;
  }

  async removeReference(referenceID: number): Promise<boolean> {
    await this.getReferenceOrFail(referenceID);
    await this.referenceRepository.delete(referenceID);
    return true;
  }

  async updateReferences(
    references: IReference[],
    referenceDTOs: ReferenceInput[]
  ) {
    for (const referenceDTO of referenceDTOs) {
      const existingReference = await references.find(
        e => e.name === referenceDTO.name
      );
      if (!existingReference) {
        const reference = await this.createReference(referenceDTO);
        references.push(reference);
      } else {
        await this.updateReference(existingReference, referenceDTO);
      }
    }
  }
}
