import { DataSource } from 'typeorm';
import { Property } from '../src/properties/entities/property.entity';
import { Order } from '../src/orders/entities/order.entity';
import { sampleProperties } from './seed-data';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'nestjs_demo',
  synchronize: false, // synchronized manually below
  entities: [Property, Order],
});

async function seed() {
  await AppDataSource.initialize();
  await AppDataSource.synchronize();

  console.log('Connected to DB. Seeding data...');

  const propertyRepo = AppDataSource.getRepository(Property);
  const orderRepo = AppDataSource.getRepository(Order);

  await orderRepo.delete({});
  await propertyRepo.delete({});

  // Create properties
  const propertyEntities = propertyRepo.create(sampleProperties);
  const savedProperties = await propertyRepo.save(propertyEntities);

  // Create a few sample orders for existing properties
  const sampleOrderEntities: Order[] = [];

  if (savedProperties.length >= 2) {
    sampleOrderEntities.push(
      orderRepo.create({
        quantity: 2,
        property: savedProperties[0],
      }),
      orderRepo.create({
        quantity: 5,
        property: savedProperties[1],
      }),
    );

    // Adjust available/soldPieces manually
    savedProperties[0].availablePieces -= 2;
    savedProperties[0].soldPieces += 2;

    savedProperties[1].availablePieces -= 5;
    savedProperties[1].soldPieces += 5;

    await propertyRepo.save(savedProperties);
    await orderRepo.save(sampleOrderEntities);
  }

  console.log('Seeding completed!');
  await AppDataSource.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
