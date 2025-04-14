import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

describe('OrdersController', () => {
  let controller: OrdersController;

  const mockOrdersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create() on service', async () => {
    const dto: CreateOrderDto = { propertyId: 1, quantity: 3 };
    const mockResult = { id: 1, quantity: 3 } as Order;
    mockOrdersService.create.mockResolvedValue(mockResult);

    expect(await controller.create(dto)).toEqual(mockResult);
    expect(mockOrdersService.create).toHaveBeenCalledWith(dto);
  });

  it('should return all orders', async () => {
    const mockResult = [{ id: 1 }, { id: 2 }] as Order[];
    mockOrdersService.findAll.mockResolvedValue(mockResult);

    expect(await controller.findAll()).toEqual(mockResult);
  });

  it('should return a single order by id', async () => {
    const mockResult = { id: 1 } as Order;
    mockOrdersService.findOne.mockResolvedValue(mockResult);

    expect(await controller.findOne(1)).toEqual(mockResult);
    expect(mockOrdersService.findOne).toHaveBeenCalledWith(1);
  });

  it('should update an order', async () => {
    const dto: UpdateOrderDto = { quantity: 10 };
    const mockResult = { id: 1, quantity: 10 } as Order;

    mockOrdersService.update.mockResolvedValue(mockResult);

    expect(await controller.update(1, dto)).toEqual(mockResult);
    expect(mockOrdersService.update).toHaveBeenCalledWith(1, dto);
  });

  it('should call remove on service', async () => {
    mockOrdersService.remove.mockResolvedValue(undefined);

    await controller.remove(1);
    expect(mockOrdersService.remove).toHaveBeenCalledWith(1);
  });
});
