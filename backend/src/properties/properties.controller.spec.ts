import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyStatus } from '../common/enums/property-status.enum';

describe('PropertiesController', () => {
  let controller: PropertiesController;

  const mockPropertiesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertiesController],
      providers: [
        {
          provide: PropertiesService,
          useValue: mockPropertiesService,
        },
      ],
    }).compile();

    controller = module.get<PropertiesController>(PropertiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create() on service', async () => {
    const dto: CreatePropertyDto = {
      city: 'Berlin',
      address: 'Some address',
      totalPieces: 100,
      availablePieces: 100,
      soldPieces: 0,
      unitPrice: 5000,
      status: PropertyStatus.AVAILABLE,
    };

    const result = { id: 1, ...dto };
    mockPropertiesService.create.mockResolvedValue(result);

    expect(await controller.create(dto)).toEqual(result);
    expect(mockPropertiesService.create).toHaveBeenCalledWith(dto);
  });

  it('should return all properties', async () => {
    const result = [{ id: 1 }, { id: 2 }];
    mockPropertiesService.findAll.mockResolvedValue(result);

    expect(await controller.findAll()).toEqual(result);
  });

  it('should return a single property', async () => {
    const result = { id: 1 };
    mockPropertiesService.findOne.mockResolvedValue(result);

    expect(await controller.findOne(1)).toEqual(result);
    expect(mockPropertiesService.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a property', async () => {
    const dto: UpdatePropertyDto = { city: 'Updated City' };
    const result = { id: 1, ...dto };

    mockPropertiesService.update.mockResolvedValue(result);
    expect(await controller.update(1, dto)).toEqual(result);
    expect(mockPropertiesService.update).toHaveBeenCalledWith(1, dto);
  });

  it('should call remove on service', async () => {
    mockPropertiesService.remove.mockResolvedValue(undefined);

    await controller.remove(1);
    expect(mockPropertiesService.remove).toHaveBeenCalledWith(1);
  });
});
