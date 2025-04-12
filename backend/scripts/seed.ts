import { DataSource } from 'typeorm';
import { Property } from '../src/properties/entities/property.entity';
import { Order } from '../src/orders/entities/order.entity';

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

  // 🔥 This will create all tables if they don't exist
  await AppDataSource.synchronize();

  console.log('Connected to DB. Seeding data...');

  const propertyRepo = AppDataSource.getRepository(Property);
  const orderRepo = AppDataSource.getRepository(Order);

  // Optional: clear data
  await orderRepo.delete({});
  await propertyRepo.delete({});

  // Sample properties
  const sampleProps = propertyRepo.create([
    {
      city: 'Berlin',
      address: 'Alexanderplatz 1',
      totalPieces: 100,
      availablePieces: 100,
      soldPieces: 0,
      unitPrice: 5000,
      status: 'available',
    },
    {
      city: 'Munich',
      address: 'Marienplatz 8',
      totalPieces: 50,
      availablePieces: 50,
      soldPieces: 0,
      unitPrice: 8000,
      status: 'available',
    },
    {
      city: 'Hamburg',
      address: 'Jungfernstieg 3',
      totalPieces: 75,
      availablePieces: 25,
      soldPieces: 50,
      unitPrice: 6500,
      status: 'available',
    },
    {
      city: 'Cologne',
      address: 'Domstraße 10',
      totalPieces: 120,
      availablePieces: 0,
      soldPieces: 120,
      unitPrice: 7000,
      status: 'not_available',
    },
    {
      city: 'Frankfurt',
      address: 'Main Tower 20',
      totalPieces: 90,
      availablePieces: 90,
      soldPieces: 0,
      unitPrice: 9500,
      status: 'available',
    },
    {
      city: 'Stuttgart',
      address: 'Königstraße 25',
      totalPieces: 60,
      availablePieces: 60,
      soldPieces: 0,
      unitPrice: 7200,
      status: 'available',
    },
    {
      city: 'Leipzig',
      address: 'Augustusplatz 15',
      totalPieces: 80,
      availablePieces: 40,
      soldPieces: 40,
      unitPrice: 4800,
      status: 'available',
    },
    {
      city: 'Düsseldorf',
      address: 'Königsallee 99',
      totalPieces: 100,
      availablePieces: 100,
      soldPieces: 0,
      unitPrice: 6000,
      status: 'available',
    },
    {
      city: 'Bremen',
      address: 'Am Wall 12',
      totalPieces: 70,
      availablePieces: 10,
      soldPieces: 60,
      unitPrice: 5300,
      status: 'available',
    },
    {
      city: 'Nuremberg',
      address: 'Kaiserstraße 7',
      totalPieces: 40,
      availablePieces: 0,
      soldPieces: 40,
      unitPrice: 4300,
      status: 'hidden',
    },
  ]);

  await propertyRepo.save(sampleProps);

  console.log('Seeding completed!');
  await AppDataSource.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
