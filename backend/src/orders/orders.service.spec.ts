import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Property } from '../properties/entities/property.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { PropertyStatus } from '../common/enums/property-status.enum';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepo: jest.Mocked<Repository<Order>>;
  let propertyRepo: jest.Mocked<Repository<Property>>;

  beforeEach(async () => {
    const mockOrderRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      merge: jest.fn(),
    };

    const mockPropertyRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepo,
        },
        {
          provide: getRepositoryToken(Property),
          useValue: mockPropertyRepo,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderRepo = module.get(getRepositoryToken(Order));
    propertyRepo = module.get(getRepositoryToken(Property));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an order and update the property', async () => {
    const createDto: CreateOrderDto = { propertyId: '1', quantity: 2 };
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

    propertyRepo.findOne.mockResolvedValue(mockProperty);
    orderRepo.create.mockReturnValue(createdOrder as Order);
    orderRepo.save.mockResolvedValue(createdOrder as Order);
    propertyRepo.save.mockResolvedValue({
      ...mockProperty,
      availablePieces: 48,
      soldPieces: 52,
    });

    const result = await service.create(createDto);

    const findPropArgs = propertyRepo.findOne.mock.calls[0][0];
    expect(findPropArgs).toEqual({
      where: { id: parseInt(createDto.propertyId) },
    });

    const createOrderArgs = orderRepo.create.mock.calls[0][0];
    expect(createOrderArgs).toEqual({
      quantity: createDto.quantity,
      property: mockProperty,
    });

    expect(result).toEqual(createdOrder);
  });

  it('should return all orders', async () => {
    const orders = [{ id: 1 }, { id: 2 }] as Order[];
    orderRepo.find.mockResolvedValue(orders);

    const result = await service.findAll();

    expect(result).toEqual(orders);
    expect(orderRepo.find.mock.calls.length).toBe(1);
  });

  it('should return one order by id', async () => {
    const order = { id: 1 } as Order;
    orderRepo.findOne.mockResolvedValue(order);

    const result = await service.findOne(1);

    expect(result).toEqual(order);
    const findArgs = orderRepo.findOne.mock.calls[0][0];
    expect(findArgs).toEqual({ where: { id: 1 }, relations: ['property'] });
  });

  it('should update an order', async () => {
    const order = { id: 1, quantity: 2 } as Order;
    const updated = { ...order, quantity: 5 } as Order;

    orderRepo.findOne.mockResolvedValue(order);
    orderRepo.merge.mockReturnValue(updated);
    orderRepo.save.mockResolvedValue(updated);

    const result = await service.update(1, { quantity: 5 });

    const findArgs = orderRepo.findOne.mock.calls[0][0];
    expect(findArgs).toEqual({ where: { id: 1 }, relations: ['property'] });

    const mergeArgs = orderRepo.merge.mock.calls[0];
    expect(mergeArgs).toEqual([order, { quantity: 5 }]);

    const saveArgs = orderRepo.save.mock.calls[0][0];
    expect(saveArgs).toEqual(updated);

    expect(result).toEqual(updated);
  });

  it('should remove an order', async () => {
    orderRepo.delete.mockResolvedValue({ affected: 1, raw: {} });

    await service.remove(1);

    const deleteArgs = orderRepo.delete.mock.calls[0][0];
    expect(deleteArgs).toBe(1);
  });
});
