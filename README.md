# NestJS Demo

## Table of Contents

[Introduction](#introduction)  
[Getting Started](#getting-started)  

## Introduction
This is a simple NestJS demo application. It demonstrates the use of NestJS with TypeScript, and includes a basic REST API for Order flow management. The application is structured using the NestJS module system, and follows best practices for building scalable and maintainable applications.

## Getting Started

This guide explains how to run the PostgreSQL database, seed it with sample data, and start the NestJS backend.

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/en) `v22.14.0` (required)
- [`npm`](https://www.npmjs.com/)

Install dependencies:

```bash
cd backend
npm install
```

### 1. Start PostgreSQL with Docker

From the project root directory, run the following command to start the PostgreSQL database using Docker:

```bash
docker compose up -d
```

This starts a PostgreSQL container exposed on port 5433.

### 2. Seed the Database

This will create all tables and insert 10 sample properties.

```bash
cd backend
npm run db:seed
```

### 3. Run the NestJS Backend

```bash
npm run start:dev
```

The API will be available at:

http://localhost:3000

Swagger docs (for testing the endpoints) will be available at:

http://localhost:3000/api

### 4. Connect to the Database (Optional)

If you'd like to inspect the database manually from your terminal, use the `psql` CLI:

```bash
psql -h localhost -p 5433 -U postgres -d nestjs_demo
```

Password:

```text
postgres
```

Once connected, you can run SQL commands like:

```bash
\dt                         # List all tables
SELECT * FROM property;     # View all properties
SELECT * FROM "order";      # View all orders (note: "order" is a reserved keyword, so must be in quotes)
```

To exit the psql prompt:

```bash
\q
```
