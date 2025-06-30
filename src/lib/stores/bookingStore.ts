/**
 * @file Booking Store - Centralized state management for the booking process
 * @description 
 * Manages the entire booking flow state using Svelte stores.
 * Provides reactive state for date, time, ticket, and pricing.
 * This version is refactored for simplicity and robustness, enforcing a single ticket type per booking
 * to align with the backend API and simplify the user flow.
 * 
 * @dependencies
 * - Svelte: For reactive stores and state management.
 * - apiClient: For fetching ticket types and availability data.
 *
 * @notes
 * - Enforces a single ticket type selection model for clarity and API compatibility.
 * - Time slots are now loaded on-demand after a date and ticket type have been selected.
 * - State is reset hierarchically (e.g., changing date clears tickets and time) to ensure consistency.
 * - The export 'selectedTicketTypes' has been removed and replaced with 'selectedTicket'.
 */

import { writable, derived, get, type Writable, type Readable } from 'svelte/store';
import { apiClient } from '$lib/api/apiClient';

// --- TYPE DEFINITIONS ---

/** Represents the availability status of a date. */
export type DateAvailabilityStatus = 'available' | 'unavailable' | 'loading' | 'unknown';

/** Represents a ticket type available for booking. */
export interface TicketType {
    id: string;
    price: number;
    name?: string;
    [key: string]: any;
}

/** Represents an available time slot for a booking. */
export interface TimeSlot {
    id: string;
    available_slots: number;
    [key: string]: any;
}

/** Represents the currently selected ticket and its quantity. */
export interface SelectedTicket {
    id: string;
    quantity: number;
}

/** Represents customer details for guest bookings. */
export interface CustomerInfo {
    name: string;
    email: string;
    isGuest: boolean;
}

/** A map of validation error messages for the booking form. */
interface ValidationErrors {
    [key: string]: string | undefined;
    date?: string;
    timeSlot?: string;
    tickets?: string;
    name?: string;
    email?: string;
    capacity?: string;
}

/** A summary of a single ticket line item in the booking. */
interface TicketSummary {
    type: TicketType;
    quantity: number;
    subtotal: number;
}

/** A comprehensive summary of the entire current booking state. */
interface BookingSummary {
    date: Date | null;
    timeSlot: TimeSlot | null;
    tickets: TicketSummary[];
    totalPrice: number;
    totalTickets: number;
    isComplete: boolean;
}

/** Data structure for the booking creation API payload. */
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

// --- CORE BOOKING STATE ---

export const selectedDate: Writable<Date | null> = writable(null);
export const selectedTimeSlot: Writable<TimeSlot | null> = writable(null);
// REFACTORED: Store a single selected ticket object instead of a Map to simplify logic and align with the backend API.
export const selectedTicket: Writable<SelectedTicket | null> = writable(null);
export const availableTicketTypes: Writable<TicketType[]> = writable([]);
export const availableTimeSlots: Writable<TimeSlot[]> = writable([]);


export const customerInfo: Writable<CustomerInfo> = writable({
    name: '',
    email: '',
    isGuest: true
});


// --- NEW: STATE FOR DATE AVAILABILITY CACHE ---
/**
 * Caches the availability status of dates for each ticket type.
 * Structure: Map<ticketTypeId, Map<dateString (YYYY-MM-DD), DateAvailabilityStatus>>
 */
export const dateAvailability: Writable<Map<string, Map<string, DateAvailabilityStatus>>> = writable(new Map());


// --- LOADING AND ERROR STATES ---

// --- NEW: LOADING STATE FOR DATE AVAILABILITY ---
export const isLoadingDateAvailability: Writable<boolean> = writable(false);

// --- LOADING AND ERROR STATES ---

export const isLoadingTicketTypes: Writable<boolean> = writable(false);
export const isLoadingTimeSlots: Writable<boolean> = writable(false);
export const isCreatingBooking: Writable<boolean> = writable(false);
export const bookingError: Writable<string | null> = writable(null);
export const validationErrors: Writable<ValidationErrors> = writable({});

// --- DERIVED STORES FOR COMPUTED VALUES ---

/** Calculates the total price based on the selected ticket and quantity. */
export const totalPrice: Readable<number> = derived(
    [selectedTicket, availableTicketTypes],
    ([$selectedTicket, $availableTicketTypes]) => {
        if (!$selectedTicket) return 0;

        const ticketType = $availableTicketTypes.find(tt => tt.id === $selectedTicket.id);
        if (ticketType) {
            return ticketType.price * $selectedTicket.quantity;
        }
        return 0;
    }
);

/** Calculates the total number of tickets selected. */
export const totalTickets: Readable<number> = derived(
    selectedTicket,
    ($selectedTicket) => $selectedTicket?.quantity ?? 0
);

/** Creates a comprehensive summary of the current booking for display. */
export const bookingSummary: Readable<BookingSummary> = derived(
    [selectedDate, selectedTimeSlot, selectedTicket, availableTicketTypes, totalPrice, totalTickets],
    ([$selectedDate, $selectedTimeSlot, $selectedTicket, $availableTicketTypes, $totalPrice, $totalTickets]) => {
        const tickets: TicketSummary[] = [];

        if ($selectedTicket) {
            const ticketType = $availableTicketTypes.find(tt => tt.id === $selectedTicket.id);
            if (ticketType && $selectedTicket.quantity > 0) {
                tickets.push({
                    type: ticketType,
                    quantity: $selectedTicket.quantity,
                    subtotal: ticketType.price * $selectedTicket.quantity
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

// --- BOOKING ACTIONS ---

export const bookingActions = {
    /**
     * Loads all available ticket types from the API.
     /**
     * Fetches and caches the availability of all days in a given month for a specific ticket type.
     * @param {string} ticketTypeId - The ID of the ticket type.
     * @param {number} year - The year to check.
     * @param {number} month - The month to check (0-indexed, e.g., 0 for January).
     * @param {typeof fetch} [customFetch=fetch] - Optional custom fetch for SSR.
     */

    async loadDateAvailabilityForTicket(
        ticketTypeId: string,
        year: number,
        month: number,
        customFetch: typeof fetch = fetch
    ): Promise<void> {
        isLoadingDateAvailability.set(true);

        const availabilityMap = get(dateAvailability).get(ticketTypeId) || new Map<string, DateAvailabilityStatus>();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const promises: Promise<void>[] = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];

            // Skip if already fetched
            if (availabilityMap.has(dateString)) continue;

            // Set to loading state
            availabilityMap.set(dateString, 'loading');

            const promise = apiClient.getTimeSlots(ticketTypeId, dateString, customFetch)
                .then(timeSlots => {
                    if (timeSlots && timeSlots.length > 0) {
                        availabilityMap.set(dateString, 'available');
                    } else {
                        availabilityMap.set(dateString, 'unavailable');
                    }
                })
                .catch(error => {
                    // A 404 error specifically means no slots are available for that day.
                    if (error instanceof Error && (error.message.includes('404') || error.message.includes('No time slots found'))) {
                        availabilityMap.set(dateString, 'unavailable');
                    } else {
                        console.error(`Failed to check availability for ${dateString}:`, error);
                        // Could set a specific error status, but 'unavailable' is safest for the user
                        availabilityMap.set(dateString, 'unavailable');
                    }
                });

            promises.push(promise);
        }

        // Update the store immediately with loading states
        dateAvailability.update(mainMap => mainMap.set(ticketTypeId, availabilityMap));

        await Promise.allSettled(promises);

        // Final update with all results
        dateAvailability.update(mainMap => mainMap.set(ticketTypeId, availabilityMap));
        isLoadingDateAvailability.set(false);
    },

    async loadTicketTypes(customFetch: typeof fetch = fetch): Promise<void> {
        isLoadingTicketTypes.set(true);
        bookingError.set(null);
        try {
            const ticketTypes: TicketType[] = await apiClient.getTicketTypes(customFetch);
            availableTicketTypes.set(ticketTypes);
        } catch (error) {
            console.error('Failed to load ticket types:', error);
            bookingError.set('Unable to load ticket types. Please try again.');
        } finally {
            isLoadingTicketTypes.set(false);
        }
    },

    /**
     * Loads available time slots based on the current date and ticket selection.
     * This should be called from the UI when ready to select a time.
     * @param {typeof fetch} [customFetch=fetch] - Optional custom fetch for SSR.
     */
    async loadTimeSlotsForSelection(customFetch: typeof fetch = fetch): Promise<void> {
        const date = get(selectedDate);
        const ticket = get(selectedTicket);

        if (!date || !ticket) {
            availableTimeSlots.set([]);
            return;
        }

        isLoadingTimeSlots.set(true);
        bookingError.set(null);
        try {
            const dateString = date.toISOString().split('T')[0];
            const timeSlots: TimeSlot[] = await apiClient.getTimeSlots(ticket.id, dateString, customFetch);
            availableTimeSlots.set(timeSlots);

            const currentSlot = get(selectedTimeSlot);
            if (currentSlot && !timeSlots.find(slot => slot.id === currentSlot.id)) {
                selectedTimeSlot.set(null);
            }
        } catch (error) {
            console.error('Failed to load time slots:', error);

            // Handle the case when no time slots are available
            if (error instanceof Error && error.message.includes('No time slots found')) {
                availableTimeSlots.set([]);
                bookingError.set('No available time slots for this date and ticket type. Please try a different date.');
            } else {
                bookingError.set('Unable to load available time slots. Please try again.');
                availableTimeSlots.set([]);
            }
        } finally {
            isLoadingTimeSlots.set(false);
        }
    },

    /**
     * Updates the selected ticket type and quantity. Replaces any existing selection.
     * @param {string} ticketTypeId - The ID of the ticket type.
     * @param {number} quantity - The new quantity.
     */
    /**
        * Updates the selected ticket type and quantity. Replaces any existing selection.
        * @param {string} ticketTypeId - The ID of the ticket type.
        * @param {number} quantity - The new quantity.
        */
    updateTicketQuantity(ticketTypeId: string, quantity: number): void {
        const currentTicket = get(selectedTicket);

        if (quantity > 0) {
            selectedTicket.set({ id: ticketTypeId, quantity });
        } else {
            selectedTicket.set(null);
        }

        // --- MODIFIED: CLEAR AVAILABILITY CACHE IF TICKET TYPE CHANGES ---
        if (currentTicket?.id !== ticketTypeId) {
            dateAvailability.set(new Map()); // Clear cache for new ticket type
        }

        // When tickets change, a previously selected time slot might become invalid.
        selectedTimeSlot.set(null);
        availableTimeSlots.set([]); // Also clear available slots
        validationErrors.update(current => ({ ...current, tickets: undefined, capacity: undefined }));
    },

    /**
     * Sets the selected date and clears dependent state (tickets and time slot).
     * @param {Date} date - The selected date.
     */
    setSelectedDate(date: Date): void {
        selectedDate.set(date);
        // Reset subsequent selections to ensure a clean state.
        // --- MODIFIED: DO NOT RESET TICKET SELECTION ---
        // The user should be able to change the date after selecting a ticket.
        // selectedTicket.set(null); 
        selectedTimeSlot.set(null);
        availableTimeSlots.set([]);
        validationErrors.update(current => ({ ...current, date: undefined }));
    },

    /**
     * Sets the selected time slot.
     * @param {TimeSlot} timeSlot - The selected time slot object.
     */
    setSelectedTimeSlot(timeSlot: TimeSlot): void {
        selectedTimeSlot.set(timeSlot);
        validationErrors.update(current => ({ ...current, timeSlot: undefined, capacity: undefined }));
    },

    /**
     * Updates customer information for guest bookings.
     * @param {Partial<CustomerInfo>} info - Partial customer information.
     */
    updateCustomerInfo(info: Partial<CustomerInfo>): void {
        customerInfo.update(current => ({ ...current, ...info }));
        validationErrors.update(current => ({ ...current, name: undefined, email: undefined }));
    },

    /**
     * Validates the entire booking state before proceeding to payment.
     * @returns {boolean} - True if the booking is valid.
     */
    validateBooking(): boolean {
        const errors: ValidationErrors = {};
        const summary = get(bookingSummary);
        const customer = get(customerInfo);

        if (!summary.date) errors.date = 'Please select a visit date';
        if (summary.totalTickets === 0) errors.tickets = 'Please select a ticket';
        if (!summary.timeSlot) errors.timeSlot = 'Please select a time slot';

        if (customer.isGuest) {
            if (!customer.name || customer.name.trim().length < 2) errors.name = 'Please enter a valid name';
            if (!customer.email || !customer.email.includes('@')) errors.email = 'Please enter a valid email address';
        }

        if (summary.timeSlot && summary.totalTickets > summary.timeSlot.available_slots) {
            errors.capacity = `Only ${summary.timeSlot.available_slots} tickets are available for this slot.`;
        }

        validationErrors.set(errors);
        return Object.keys(errors).length === 0;
    },

    /**
     * Creates a booking with the current state.
     * @param {typeof fetch} [customFetch=fetch] - Optional custom fetch for SSR.
     * @returns {Promise<any>} - The created booking object from the API.
     */
    async createBooking(customFetch: typeof fetch = fetch): Promise<any> {
        if (!this.validateBooking()) {
            throw new Error('Please correct the validation errors before proceeding.');
        }

        isCreatingBooking.set(true);
        bookingError.set(null);

        try {
            const summary = get(bookingSummary);
            const customer = get(customerInfo);
            const ticketInfo = summary.tickets[0];

            const bookingData: BookingData = {
                booking_date: summary.date!.toISOString().split('T')[0],
                time_slot_id: summary.timeSlot!.id,
                ticket_type_id: ticketInfo.type.id,
                quantity: ticketInfo.quantity,
                total_price: summary.totalPrice,
                customer_name: customer.isGuest ? customer.name : null,
                customer_email: customer.isGuest ? customer.email : null,
                source: 'ONLINE'
            };

            const booking = await apiClient.createBooking(bookingData, customFetch);
            this.resetBooking();
            return booking;
        } catch (error) {
            console.error('Failed to create booking:', error);
            bookingError.set('An error occurred while creating your booking. Please try again.');
            throw error;
        } finally {
            isCreatingBooking.set(false);
        }
    },

    /**
     * Resets all booking state to initial values for a new booking.
     */
    resetBooking(): void {
        selectedDate.set(null);
        selectedTimeSlot.set(null);
        selectedTicket.set(null);
        availableTimeSlots.set([]);
        customerInfo.set({ name: '', email: '', isGuest: true });
        bookingError.set(null);
        validationErrors.set({});
    },

    /**
     * Clears all error states from the store.
     */
    clearErrors(): void {
        bookingError.set(null);
        validationErrors.set({});
    }
};