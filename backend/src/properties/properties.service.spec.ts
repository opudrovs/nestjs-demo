import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesService } from './properties.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { PropertyStatus } from '../common/enums/property-status.enum';
import { Repository } from 'typeorm';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

describe('PropertiesService', () => {
  let service: PropertiesService;
  let propertyRepo: jest.Mocked<Repository<Property>>;

  beforeEach(async () => {
    const mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      merge: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertiesService,
        {
          provide: getRepositoryToken(Property),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<PropertiesService>(PropertiesService);
    propertyRepo = module.get(getRepositoryToken(Property));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a property', async () => {
    const dto: CreatePropertyDto = {
      city: 'Berlin',
      address: '123 Main St',
      totalPieces: 100,
      availablePieces: 100,
      soldPieces: 0,
      unitPrice: 5000,
      status: PropertyStatus.AVAILABLE,
    };
    const created = { id: 1, ...dto };

    propertyRepo.create.mockReturnValue(created as Property);
    propertyRepo.save.mockResolvedValue(created as Property);

    const result = await service.create(dto);

    const createArgs = propertyRepo.create.mock.calls[0][0];
    expect(createArgs).toEqual(dto);

    const saveArgs = propertyRepo.save.mock.calls[0][0];
    expect(saveArgs).toEqual(created);

    expect(result).toEqual(created);
  });

  it('should return all non-hidden properties', async () => {
    const properties = [{ id: 1 }, { id: 2 }] as Property[];
    propertyRepo.find.mockResolvedValue(properties);

    const result = await service.findAll();

    expect(propertyRepo.find.mock.calls.length).toBe(1);

    const findArgs =
      propertyRepo.find.mock.calls.length > 0
        ? propertyRepo.find.mock.calls[0][0]
        : undefined;

    expect(findArgs?.order).toEqual({ id: 'ASC' }); // use optional chaining
    expect(result).toEqual(properties);
  });

  it('should find one property by id', async () => {
    const property = { id: 1 } as Property;
    propertyRepo.findOne.mockResolvedValue(property);

    const result = await service.findOne(1);

    const findArgs = propertyRepo.findOne.mock.calls[0][0];
    expect(findArgs).toEqual({ where: { id: 1 } });

    expect(result).toEqual(property);
  });

  it('should update a property', async () => {
    const property = { id: 1, city: 'Berlin' } as Property;
    const dto: UpdatePropertyDto = { city: 'Munich' };
    const updated = { id: 1, city: 'Munich' } as Property;

    propertyRepo.findOne.mockResolvedValue(property);
    propertyRepo.merge.mockReturnValue(updated);
    propertyRepo.save.mockResolvedValue(updated);

    const result = await service.update(1, dto);

    const mergeArgs = propertyRepo.merge.mock.calls[0];
    expect(mergeArgs).toEqual([property, dto]);

    expect(result).toEqual(updated);
  });

  it('should remove a property', async () => {
    propertyRepo.delete.mockResolvedValue({ affected: 1, raw: {} });

    await service.remove(1);

    const deleteArgs = propertyRepo.delete.mock.calls[0][0];
    expect(deleteArgs).toBe(1);
  });
});
