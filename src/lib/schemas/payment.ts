/**
* @file frontend/src/lib/schemas/payment.ts
* @purpose Defines TypeScript types that correspond to the backend's payment-related Pydantic schemas.
*
* @dependencies
* - None
*
* @notes
* - These types ensure that the data sent from the SvelteKit frontend to the FastAPI backend matches the expected structure for creating payment intents.
* - This file centralizes payment-related type definitions for easy maintenance and type safety across the frontend application.
*/



/**
     * Mirrors the backend's `BookingCreate` schema.
     * Used when a booking is part of the checkout payload.
     */
export interface BookingCreate {
    time_slot_id: string; // UUID
    quantity: number;
    customer_name: string;
    customer_email: string;
    user_id?: string; // Optional UUID
}

/**
 * Mirrors the backend's `MerchandiseOrderItemCreate` schema.
 * Represents a single type of merchandise item in the cart.
 */
export interface MerchandiseOrderItemCreate {
    merchandise_id: string; // UUID
    quantity: number;
}

/**
 * Mirrors the backend's `OrderCreatePayload` schema.
 * This is the main data structure sent to the `create-payment-intent` endpoint.
 */
export interface OrderCreatePayload {
    booking?: BookingCreate;
    merchandise_items?: MerchandiseOrderItemCreate[];
    customer_name?: string;
    customer_email?: string;
}