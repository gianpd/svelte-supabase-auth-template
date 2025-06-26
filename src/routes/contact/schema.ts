/**
* @file schema.ts (for /contact)
* @description Zod schema for validating the contact form.
*
* @dependencies
* - zod: For schema definition and validation.
*/
import { z } from 'zod';


export const formSchema = z.object({
    name: z.string().trim().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    subject: z.string().trim().min(5, { message: 'Subject must be at least 5 characters.' }),
    message: z.string().trim().min(10, { message: 'Message must be at least 10 characters.' })
});

export type FormSchema = typeof formSchema;