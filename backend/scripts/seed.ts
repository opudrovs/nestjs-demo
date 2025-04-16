import { DataSource } from 'typeorm';
import { Property } from '../src/properties/entities/property.entity';
import { Order } from '../src/orders/entities/order.entity';
import { sampleProperties } from './seed-data';

/**
 * Connection configuration for PostgreSQL database using TypeORM.
 * The connection parameters are read from environment variables
 * or default values are used if not provided.
 */
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

/**
 * Seeds the database with sample data for properties and orders.
 * It connects to the database, deletes existing data,
 * creates new sample properties, and generates a couple sample orders.
 * The availablePieces and soldPieces fields are adjusted accordingly.
 * Finally, it closes the database connection.
 */
async function seed() {
  await AppDataSource.initialize();
  await AppDataSource.synchronize();

  console.log('Connected to DB. Seeding data...');

  const propertiesRepo = AppDataSource.getRepository(Property);
  const ordersRepo = AppDataSource.getRepository(Order);

  await ordersRepo.delete({});
  await propertiesRepo.delete({});

  // Create properties
  const propertyEntities = propertiesRepo.create(sampleProperties);
  const savedProperties = await propertiesRepo.save(propertyEntities);

  // Create a few sample orders for existing properties
  const sampleOrderEntities: Order[] = [];

  if (savedProperties.length >= 2) {
    const quantity1 = 2;
    const quantity2 = 5;

    sampleOrderEntities.push(
      ordersRepo.create({
        quantity: quantity1,
        property: savedProperties[0],
      }),
      ordersRepo.create({
        quantity: quantity2,
        property: savedProperties[1],
      }),
    );

    // Adjust available/soldPieces manually
    savedProperties[0].availablePieces -= quantity1;
    savedProperties[0].soldPieces += quantity1;

    savedProperties[1].availablePieces -= quantity2;
    savedProperties[1].soldPieces += quantity2;

    await propertiesRepo.save(savedProperties);
    await ordersRepo.save(sampleOrderEntities);
  }

  console.log('Seeding completed!');
  await AppDataSource.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
