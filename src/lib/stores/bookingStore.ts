/**
 * @file Booking Store - Centralized state management for the booking process
 * @description 
 * Manages the entire booking flow state using Svelte stores.
 * Provides reactive state for date selection, time slots, ticket types, and pricing.
 * 
 * Key features:
 * - Centralized booking state management
 * - Reactive price calculations
 * - Loading and error state handling
 * - Form validation helpers
 * - Reset functionality for new bookings
 * 
 * @dependencies
 * - Svelte: For reactive stores and state management
 * - apiClient: For fetching ticket types and availability data
 * 
 * @notes
 * - Uses writable stores for mutable state
 * - Derived stores for computed values like total price
 * - Includes helper functions for common booking operations
 * - Handles both guest and authenticated user bookings
 */

import { writable, derived, get, type Writable, type Readable } from 'svelte/store';
import { apiClient } from '$lib/api/apiClient';

// Type definitions
export interface TicketType {
    id: string;
    price: number;
    name?: string;
    [key: string]: any;
}

export interface TimeSlot {
    id: string;
    available_slots: number;
    [key: string]: any;
}

export interface CustomerInfo {
    name: string;
    email: string;
    isGuest: boolean;
}

interface ValidationErrors {
    [key: string]: string | undefined;
    date?: string;
    timeSlot?: string;
    tickets?: string;
    name?: string;
    email?: string;
    capacity?: string;
}

interface TicketSummary {
    type: TicketType;
    quantity: number;
    subtotal: number;
}

interface BookingSummary {
    date: Date | null;
    timeSlot: TimeSlot | null;
    tickets: TicketSummary[];
    totalPrice: number;
    totalTickets: number;
    isComplete: boolean;
}

interface BookingData {
    booking_date: string;
    time_slot_id: string;
    ticket_type_id: string;
    quantity: number;
    total_price: number;
    customer_name: string | null;
    customer_email: string | null;
    source: string;
}

// Core booking state
export const selectedDate: Writable<Date | null> = writable(null);
export const selectedTimeSlot: Writable<TimeSlot | null> = writable(null);
export const selectedTicketTypes: Writable<Map<string, number>> = writable(new Map());
export const availableTicketTypes: Writable<TicketType[]> = writable([]);
export const availableTimeSlots: Writable<TimeSlot[]> = writable([]);

// Customer information for guest bookings
export const customerInfo: Writable<CustomerInfo> = writable({
    name: '',
    email: '',
    isGuest: true
});

// Loading and error states
export const isLoadingTicketTypes: Writable<boolean> = writable(false);
export const isLoadingTimeSlots: Writable<boolean> = writable(false);
export const isCreatingBooking: Writable<boolean> = writable(false);
export const bookingError: Writable<string | null> = writable(null);
export const validationErrors: Writable<ValidationErrors> = writable({});

// Derived store for total price calculation
export const totalPrice: Readable<number> = derived(
    [selectedTicketTypes, availableTicketTypes],
    ([$selectedTicketTypes, $availableTicketTypes]: [Map<string, number>, TicketType[]]) => {
        let total = 0;

        for (const [ticketTypeId, quantity] of $selectedTicketTypes) {
            const ticketType = $availableTicketTypes.find(tt => tt.id === ticketTypeId);
            if (ticketType && quantity > 0) {
                total += ticketType.price * quantity;
            }
        }

        return total;
    }
);

// Derived store for total ticket count
export const totalTickets: Readable<number> = derived(
    selectedTicketTypes,
    ($selectedTicketTypes: Map<string, number>) => {
        let total = 0;
        for (const quantity of $selectedTicketTypes.values()) {
            total += quantity;
        }
        return total;
    }
);

// Derived store for booking summary
export const bookingSummary: Readable<BookingSummary> = derived(
    [selectedDate, selectedTimeSlot, selectedTicketTypes, availableTicketTypes, totalPrice, totalTickets],
    ([$selectedDate, $selectedTimeSlot, $selectedTicketTypes, $availableTicketTypes, $totalPrice, $totalTickets]: [
        Date | null,
        TimeSlot | null,
        Map<string, number>,
        TicketType[],
        number,
        number
    ]) => {
        const tickets: TicketSummary[] = [];

        for (const [ticketTypeId, quantity] of $selectedTicketTypes) {
            const ticketType = $availableTicketTypes.find(tt => tt.id === ticketTypeId);
            if (ticketType && quantity > 0) {
                tickets.push({
                    type: ticketType,
                    quantity,
                    subtotal: ticketType.price * quantity
                });
            }
        }

        return {
            date: $selectedDate,
            timeSlot: $selectedTimeSlot,
            tickets,
            totalPrice: $totalPrice,
            totalTickets: $totalTickets,
            isComplete: !!($selectedDate && $selectedTimeSlot && $totalTickets > 0)
        };
    }
);

// Helper functions for booking operations
export const bookingActions = {
    /**
     * Loads available ticket types from the API
     * @param customFetch - Optional custom fetch function for SSR
     */
    async loadTicketTypes(customFetch: typeof fetch = fetch): Promise<void> {
        isLoadingTicketTypes.set(true);
        bookingError.set(null);

        try {
            const ticketTypes: TicketType[] = await apiClient.getTicketTypes(customFetch);
            availableTicketTypes.set(ticketTypes);
        } catch (error: unknown) {
            console.error('Failed to load ticket types:', error);
            bookingError.set('Unable to load ticket types. Please try again.');
        } finally {
            isLoadingTicketTypes.set(false);
        }
    },

    /**
     * Loads available time slots for a specific date and ticket type
     * @param ticketTypeId - The ticket type ID
     * @param date - Date in YYYY-MM-DD format
     * @param customFetch - Optional custom fetch function for SSR
     */
    async loadTimeSlots(ticketTypeId: string, date: string, customFetch: typeof fetch = fetch): Promise<void> {
        if (!ticketTypeId || !date) {
            availableTimeSlots.set([]);
            return;
        }

        isLoadingTimeSlots.set(true);
        bookingError.set(null);

        try {
            const timeSlots: TimeSlot[] = await apiClient.getTimeSlots(ticketTypeId, date, customFetch);
            availableTimeSlots.set(timeSlots);

            // Clear selected time slot if it's no longer available
            const currentSlot: TimeSlot | null = get(selectedTimeSlot);
            if (currentSlot && !timeSlots.find(slot => slot.id === currentSlot.id)) {
                selectedTimeSlot.set(null);
            }
        } catch (error: unknown) {
            console.error('Failed to load time slots:', error);
            bookingError.set('Unable to load available time slots. Please try again.');
            availableTimeSlots.set([]);
        } finally {
            isLoadingTimeSlots.set(false);
        }
    },

    /**
     * Updates the quantity for a specific ticket type
     * @param ticketTypeId - The ticket type ID
     * @param quantity - New quantity (0 to remove)
     */
    updateTicketQuantity(ticketTypeId: string, quantity: number): void {
        selectedTicketTypes.update(current => {
            const updated = new Map(current);

            if (quantity <= 0) {
                updated.delete(ticketTypeId);
            } else {
                updated.set(ticketTypeId, quantity);
            }

            return updated;
        });

        // Clear validation errors when user makes changes
        validationErrors.update(current => {
            const updated: ValidationErrors = { ...current };
            delete updated.tickets;
            return updated;
        });
    },

    /**
     * Sets the selected date and triggers time slot loading
     * @param date - Selected date
     */
    async setSelectedDate(date: Date): Promise<void> {
        selectedDate.set(date);
        selectedTimeSlot.set(null); // Clear time slot when date changes

        // Load time slots for the first available ticket type
        const ticketTypes: TicketType[] = get(availableTicketTypes);
        if (ticketTypes.length > 0 && date) {
            const dateString = date.toISOString().split('T')[0];
            await this.loadTimeSlots(ticketTypes[0].id, dateString);
        }
    },

    /**
     * Sets the selected time slot
     * @param timeSlot - Selected time slot object
     */
    setSelectedTimeSlot(timeSlot: TimeSlot): void {
        selectedTimeSlot.set(timeSlot);

        // Clear validation errors when user makes changes
        validationErrors.update(current => {
            const updated: ValidationErrors = { ...current };
            delete updated.timeSlot;
            return updated;
        });
    },

    /**
     * Updates customer information for guest bookings
     * @param info - Customer information object
     */
    updateCustomerInfo(info: Partial<CustomerInfo>): void {
        customerInfo.update(current => ({ ...current, ...info }));

        // Clear validation errors when user makes changes
        validationErrors.update(current => {
            const updated: ValidationErrors = { ...current };
            delete updated.name;
            delete updated.email;
            return updated;
        });
    },

    /**
     * Validates the current booking state
     * @returns True if booking is valid
     */
    validateBooking(): boolean {
        const errors: ValidationErrors = {};
        const currentDate: Date | null = get(selectedDate);
        const currentTimeSlot: TimeSlot | null = get(selectedTimeSlot);
        const currentTickets: Map<string, number> = get(selectedTicketTypes);
        const currentCustomer: CustomerInfo = get(customerInfo);
        const currentTotalTickets: number = get(totalTickets);

        // Validate date selection
        if (!currentDate) {
            errors.date = 'Please select a visit date';
        }

        // Validate time slot selection
        if (!currentTimeSlot) {
            errors.timeSlot = 'Please select a time slot';
        }

        // Validate ticket selection
        if (currentTotalTickets === 0) {
            errors.tickets = 'Please select at least one ticket';
        }

        // Validate customer information for guest bookings
        if (currentCustomer.isGuest) {
            if (!currentCustomer.name || currentCustomer.name.trim().length < 2) {
                errors.name = 'Please enter a valid name';
            }

            if (!currentCustomer.email || !currentCustomer.email.includes('@')) {
                errors.email = 'Please enter a valid email address';
            }
        }

        // Validate time slot capacity
        if (currentTimeSlot && currentTotalTickets > currentTimeSlot.available_slots) {
            errors.capacity = `Only ${currentTimeSlot.available_slots} tickets available for this time slot`;
        }

        validationErrors.set(errors);
        return Object.keys(errors).length === 0;
    },

    /**
     * Creates a booking with the current state
     * @param customFetch - Optional custom fetch function
     * @returns Created booking object
     */
    async createBooking(customFetch: typeof fetch = fetch): Promise<any> {
        if (!this.validateBooking()) {
            throw new Error('Please correct the validation errors');
        }

        isCreatingBooking.set(true);
        bookingError.set(null);

        try {
            const summary: BookingSummary = get(bookingSummary);
            const customer: CustomerInfo = get(customerInfo);

            // Prepare booking data for API
            const bookingData: BookingData = {
                booking_date: summary.date!.toISOString().split('T')[0],
                time_slot_id: summary.timeSlot!.id,
                ticket_type_id: summary.tickets[0].type.id,
                quantity: summary.totalTickets,
                total_price: summary.totalPrice,
                customer_name: customer.isGuest ? customer.name : null,
                customer_email: customer.isGuest ? customer.email : null,
                source: 'ONLINE'
            };

            const booking = await apiClient.createBooking(bookingData, customFetch);

            // Reset booking state after successful creation
            this.resetBooking();

            return booking;
        } catch (error: unknown) {
            console.error('Failed to create booking:', error);
            bookingError.set('Failed to create booking. Please try again.');
            throw error;
        } finally {
            isCreatingBooking.set(false);
        }
    },

    /**
     * Resets all booking state to initial values
     */
    resetBooking(): void {
        selectedDate.set(null);
        selectedTimeSlot.set(null);
        selectedTicketTypes.set(new Map());
        availableTimeSlots.set([]);
        customerInfo.set({
            name: '',
            email: '',
            isGuest: true
        });
        bookingError.set(null);
        validationErrors.set({});
    },

    /**
     * Clears all error states
     */
    clearErrors(): void {
        bookingError.set(null);
        validationErrors.set({});
    }
};

