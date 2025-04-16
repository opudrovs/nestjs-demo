import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Property } from '../properties/entities/property.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { PropertyStatus } from '../common/enums/property-status.enum';
import { PropertiesService } from '../properties/properties.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepo: jest.Mocked<Repository<Order>>;
  let propertiesRepo: jest.Mocked<Repository<Property>>;
  let propertiesService: jest.Mocked<PropertiesService>;

  beforeEach(async () => {
    const mockOrdersRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      merge: jest.fn(),
    };

    const mockPropertiesRepo = {
      save: jest.fn(),
    };

    const mockPropertiesService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrdersRepo,
        },
        {
          provide: getRepositoryToken(Property),
          useValue: mockPropertiesRepo,
        },
        {
          provide: PropertiesService,
          useValue: mockPropertiesService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    ordersRepo = module.get(getRepositoryToken(Order));
    propertiesRepo = module.get(getRepositoryToken(Property));
    propertiesService = module.get(PropertiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an order and update the property', async () => {
    const createDto: CreateOrderDto = { propertyId: 1, quantity: 2 };
    const mockProperty: Property = {
      id: 1,
      city: 'Berlin',
      address: 'Somewhere 1',
      totalPieces: 100,
      availablePieces: 50,
      soldPieces: 50,
      unitPrice: 5000,
      status: PropertyStatus.AVAILABLE,
      orders: [],
    };

    const createdOrder = { id: 1, quantity: 2, property: mockProperty };

    propertiesService.findOne.mockResolvedValue(mockProperty);
    ordersRepo.create.mockReturnValue(createdOrder as Order);
    ordersRepo.save.mockResolvedValue(createdOrder as Order);
    propertiesRepo.save.mockResolvedValue({
      ...mockProperty,
      availablePieces: 48,
      soldPieces: 52,
    });

    const result = await service.create(createDto);

    const calledWithPropId = propertiesService.findOne.mock.calls[0][0];
    expect(calledWithPropId).toBe(createDto.propertyId);

    const createArgs = ordersRepo.create.mock.calls[0][0];
    expect(createArgs).toEqual({
      quantity: createDto.quantity,
      property: mockProperty,
    });

    const saveOrderArgs = ordersRepo.save.mock.calls[0][0];
    expect(saveOrderArgs).toEqual(createdOrder);

    const savePropertyArgs = propertiesRepo.save.mock.calls[0][0];
    expect(savePropertyArgs).toEqual({
      ...mockProperty,
      availablePieces: 48,
      soldPieces: 52,
    });

    expect(result).toEqual(createdOrder);
  });

  it('should return all orders', async () => {
    const orders = [{ id: 1 }, { id: 2 }] as Order[];
    ordersRepo.find.mockResolvedValue(orders);

    const result = await service.findAll();

    expect(result).toEqual(orders);
    expect(ordersRepo.find.mock.calls.length).toBe(1);
  });

  it('should return one order by id', async () => {
    const order = { id: 1 } as Order;
    ordersRepo.findOne.mockResolvedValue(order);

    const result = await service.findOne(1);

    const findArgs = ordersRepo.findOne.mock.calls[0][0];
    expect(findArgs).toEqual({ where: { id: 1 }, relations: ['property'] });

    expect(result).toEqual(order);
  });

  it('should update an order', async () => {
    const order = { id: 1, quantity: 2 } as Order;
    const updated = { ...order, quantity: 5 } as Order;

    ordersRepo.findOne.mockResolvedValue(order);
    ordersRepo.merge.mockReturnValue(updated);
    ordersRepo.save.mockResolvedValue(updated);

    const result = await service.update(1, { quantity: 5 });

    const findArgs = ordersRepo.findOne.mock.calls[0][0];
    expect(findArgs).toEqual({ where: { id: 1 }, relations: ['property'] });

    const mergeArgs = ordersRepo.merge.mock.calls[0];
    expect(mergeArgs).toEqual([order, { quantity: 5 }]);

    const saveArgs = ordersRepo.save.mock.calls[0][0];
    expect(saveArgs).toEqual(updated);

    expect(result).toEqual(updated);
  });

  it('should remove an order', async () => {
    ordersRepo.delete.mockResolvedValue({ affected: 1, raw: {} });

    await service.remove(1);

    const deleteArgs = ordersRepo.delete.mock.calls[0][0];
    expect(deleteArgs).toBe(1);
  });
});
