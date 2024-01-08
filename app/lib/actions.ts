'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export type State = {
  errors?: {
    
    salutationId?: string[];
  };
  message?: string | null;
};

const FormSchema = z.object({
  id: z.string(),
  
  salutationId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),

});


const CreateSalutation = FormSchema.omit({ id: true, date: true });

export async function createSalutation(prevState: State, formData: FormData) {
  const validatedFields = CreateSalutation.safeParse({
    salutationId: formData.get('salutationId'),
    
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Salutation. ',
    };
  }

  // Prepare data for insertion into the database
  const { salutationId} = validatedFields.data;
  
  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${salutationId})
  `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
  revalidatePath('/dashboard/profile');
  redirect('/dashboard/profile');
}