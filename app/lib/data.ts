import { sql } from '@vercel/postgres';

import {

  SalutationField
} from './definitions';


export async function fetchSalutation() {
  try {
    const data = await sql<SalutationField>`
      SELECT
        id,
        name
      FROM salutations
      ORDER BY name ASC
    `;

    const salutations = data.rows;
    return salutations;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all salutations.');
  }
}
