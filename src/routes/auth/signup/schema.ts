/**
 * @file signup/schema.ts
 * @description Zod schema definition for the user signup form.
 * Includes validation rules for email, password, confirmPassword, and optionally full name.
 */
import { z } from 'zod';

export const formSchema = z
    .object({
        // Optional full name field
        fullName: z
            .string()
            .trim()
            .min(2, 'Full name must be at least 2 characters')
            .optional(), // Make it optional for signup
        email: z.string().email('Please enter a valid email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters long')
            // Optional: Add complexity requirements if desired (e.g., regex)
            .max(100, 'Password must be no more than 100 characters'),
        confirmPassword: z.string() // Confirmation field
    })
    // Refine step to check if passwords match
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'] // Set the error path to the confirmation field
    });

// Infer the TypeScript type from the schema
export type FormSchema = z.infer<typeof formSchema>;
