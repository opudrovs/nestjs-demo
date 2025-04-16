import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesService } from './properties.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { PropertyStatus } from '../common/enums/property-status.enum';
import { Repository, Not } from 'typeorm';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

describe('PropertiesService', () => {
  let service: PropertiesService;
  let propertiesRepo: jest.Mocked<Repository<Property>>;

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
    propertiesRepo = module.get(getRepositoryToken(Property));
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

    propertiesRepo.create.mockReturnValue(created as Property);
    propertiesRepo.save.mockResolvedValue(created as Property);

    const result = await service.create(dto);

    const createArgs = propertiesRepo.create.mock.calls[0][0];
    expect(createArgs).toEqual(dto);

    const saveArgs = propertiesRepo.save.mock.calls[0][0];
    expect(saveArgs).toEqual(created);

    expect(result).toEqual(created);
  });

  it('should return all non-hidden properties', async () => {
    const visibleProperty1 = {
      id: 1,
      status: PropertyStatus.AVAILABLE,
    } as Property;

    const visibleProperty2 = {
      id: 2,
      status: PropertyStatus.AVAILABLE,
    } as Property;

    // Mock `find` as if TypeORM has already filtered out the hidden one
    propertiesRepo.find.mockResolvedValue([visibleProperty1, visibleProperty2]);

    const result = await service.findAll();

    // Check what the service requested from the repo
    const findArgs = propertiesRepo.find.mock.calls[0][0];
    expect(findArgs).toBeDefined();
    expect(findArgs!.where).toEqual({
      status: Not(PropertyStatus.HIDDEN),
    });

    // Ensure returned result contains only non-hidden
    expect(result).toEqual([visibleProperty1, visibleProperty2]);
  });

  it('should find one property by id', async () => {
    const property = { id: 1 } as Property;
    propertiesRepo.findOne.mockResolvedValue(property);

    const result = await service.findOne(1);

    const findArgs = propertiesRepo.findOne.mock.calls[0][0];
    expect(findArgs).toEqual({
      where: {
        id: 1,
        status: Not(PropertyStatus.HIDDEN),
      },
    });

    expect(result).toEqual(property);
  });

  it('should update a property', async () => {
    const property = { id: 1, city: 'Berlin' } as Property;
    const dto: UpdatePropertyDto = { city: 'Munich' };
    const updated = { id: 1, city: 'Munich' } as Property;

    propertiesRepo.findOne.mockResolvedValue(property);
    propertiesRepo.merge.mockReturnValue(updated);
    propertiesRepo.save.mockResolvedValue(updated);

    const result = await service.update(1, dto);

    const mergeArgs = propertiesRepo.merge.mock.calls[0];
    expect(mergeArgs).toEqual([property, dto]);

    expect(result).toEqual(updated);
  });

  it('should remove a property', async () => {
    propertiesRepo.delete.mockResolvedValue({ affected: 1, raw: {} });

    await service.remove(1);

    const deleteArgs = propertiesRepo.delete.mock.calls[0][0];
    expect(deleteArgs).toBe(1);
  });
});
