const { db } = require('@vercel/postgres');
const {

  salutations
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');


async function seedSalutations(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "salutations" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS salutations (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
      );
    `;

    console.log(`Created "salutations" table`);

    // Insert data into the "salutations" table
    const insertedSalutations = await Promise.all(
      salutations.map(
        (salutation) => client.sql`
        INSERT INTO salutations (id, name)
        VALUES (${salutation.id}, ${salutation.name})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedSalutations.length} customers`);

    return {
      createTable,
      salutations: insertedSalutations,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();
  await seedSalutations(client);
  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
