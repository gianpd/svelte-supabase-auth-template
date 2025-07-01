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
* - Exports key interfaces like BookingSummary for use in other components.
* - Fixed availability data flow to ensure calendar displays visual indicators correctly.
* - Error handling: Comprehensive error states and validation with user feedback.
*/



import { writable, derived, get, type Writable, type Readable } from 'svelte/store';
import { apiClient } from '$lib/api/apiClient';

// --- TYPE DEFINITIONS (EXPORTED FOR REUSE) ---

/** Represents the availability status of a date. */
export type DateAvailabilityStatus = 'available' | 'unavailable' | 'loading' | 'unknown';

/** Represents a ticket type available for booking. */
export interface TicketType {
    id: string;
    price: number;
    name_translations: Record<string, string>;
    description_translations?: Record<string, string>;
    group_size?: number;
    [key: string]: any;
}

/** Represents an available time slot for a booking. */
export interface TimeSlot {
    id: string;
    start_time: string;
    end_time: string;
    available_slots: number;
    capacity: number;
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
export interface BookingSummary {
    date: Date | null;
    timeSlot: TimeSlot | null;
    tickets: TicketSummary[];
    totalPrice: number;
    totalTickets: number;
    isComplete: boolean;
}

/** Data structure for the booking creation API payload. */
interface BookingData {
    time_slot_id: string;
    quantity: number;
    customer_name: string;
    customer_email: string;
    user_id?: string;
}

// --- CORE BOOKING STATE ---

export const selectedDate: Writable<Date | null> = writable(null);
export const selectedTimeSlot: Writable<TimeSlot | null> = writable(null);
export const selectedTicket: Writable<SelectedTicket | null> = writable(null);
export const availableTicketTypes: Writable<TicketType[]> = writable([]);
export const availableTimeSlots: Writable<TimeSlot[]> = writable([]);

export const customerInfo: Writable<CustomerInfo> = writable({
    name: '',
    email: '',
    isGuest: true
});

// --- DATE AVAILABILITY CACHE ---
/**
 * Caches the availability status of dates for each ticket type.
 * Structure: Map<ticketTypeId, Map<dateString (YYYY-MM-DD), DateAvailabilityStatus>>
 */
export const dateAvailability: Writable<Map<string, Map<string, DateAvailabilityStatus>>> = writable(new Map());

// --- LOADING AND ERROR STATES ---
export const isLoadingDateAvailability: Writable<boolean> = writable(false);
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
            isComplete: !!($selectedDate && $selectedTimeSlot && $totalTickets > 0 && get(customerInfo).name && get(customerInfo).email)
        };
    }
);

// --- BOOKING ACTIONS ---

export const bookingActions = {
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
        console.log(`[BookingStore] Loading availability for ticket ${ticketTypeId}, ${year}-${month + 1}`);

        isLoadingDateAvailability.set(true);

        // Get current availability map for this ticket type
        const currentMap = get(dateAvailability);
        let availabilityMap = currentMap.get(ticketTypeId) || new Map<string, DateAvailabilityStatus>();

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const promises: Promise<void>[] = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];

            // Skip if we already have data for this date
            if (availabilityMap.has(dateString)) {
                console.log(`[BookingStore] Skipping ${dateString} - already loaded`);
                continue;
            }

            // Set loading state
            availabilityMap.set(dateString, 'loading');

            const promise = apiClient.getTimeSlots(ticketTypeId, dateString, customFetch)
                .then(timeSlots => {
                    const hasAvailability = timeSlots && timeSlots.length > 0 &&
                        timeSlots.some(slot => slot.available_slots > 0);
                    const status: DateAvailabilityStatus = hasAvailability ? 'available' : 'unavailable';
                    availabilityMap.set(dateString, status);
                    console.log(`[BookingStore] ${dateString}: ${status} (${timeSlots?.length || 0} slots)`);
                })
                .catch(error => {
                    console.error(`[BookingStore] Failed to check availability for ${dateString}:`, error);
                    if (error instanceof Error && (error.message.includes('404') || error.message.includes('No time slots found'))) {
                        availabilityMap.set(dateString, 'unavailable');
                    } else {
                        availabilityMap.set(dateString, 'unavailable');
                    }
                });

            promises.push(promise);
        }

        // Update the store with loading states immediately
        const updatedMap = new Map(currentMap);
        updatedMap.set(ticketTypeId, availabilityMap);
        dateAvailability.set(updatedMap);

        // Wait for all API calls to complete
        await Promise.allSettled(promises);

        // Update the store with final results
        const finalMap = new Map(get(dateAvailability));
        finalMap.set(ticketTypeId, availabilityMap);
        dateAvailability.set(finalMap);

        console.log(`[BookingStore] Completed loading availability for ${ticketTypeId}. Map size: ${availabilityMap.size}`);
        isLoadingDateAvailability.set(false);
    },

    async loadTicketTypes(customFetch: typeof fetch = fetch): Promise<void> {
        isLoadingTicketTypes.set(true);
        bookingError.set(null);
        try {
            const ticketTypes: TicketType[] = await apiClient.getTicketTypes(customFetch);
            availableTicketTypes.set(ticketTypes);
            console.log(`[BookingStore] Loaded ${ticketTypes.length} ticket types`);
        } catch (error) {
            console.error('[BookingStore] Failed to load ticket types:', error);
            bookingError.set('Unable to load ticket types. Please try again.');
        } finally {
            isLoadingTicketTypes.set(false);
        }
    },

    /**
     * Loads available time slots based on the current date and ticket selection.
     * @param {typeof fetch} [customFetch=fetch] - Optional custom fetch for SSR.
     */
    async loadTimeSlotsForSelection(customFetch: typeof fetch = fetch): Promise<void> {
        const date = get(selectedDate);
        const ticket = get(selectedTicket);

        if (!date || !ticket) {
            availableTimeSlots.set([]);
            return;
        }

        console.log(`[BookingStore] Loading time slots for ${date.toISOString().split('T')[0]} and ticket ${ticket.id}`);

        isLoadingTimeSlots.set(true);
        bookingError.set(null);
        try {
            const dateString = date.toISOString().split('T')[0];
            const timeSlots: TimeSlot[] = await apiClient.getTimeSlots(ticket.id, dateString, customFetch);
            availableTimeSlots.set(timeSlots);
            console.log(`[BookingStore] Loaded ${timeSlots.length} time slots`);

            const currentSlot = get(selectedTimeSlot);
            if (currentSlot && !timeSlots.find(slot => slot.id === currentSlot.id)) {
                selectedTimeSlot.set(null);
                console.log(`[BookingStore] Reset selected time slot - no longer available`);
            }
        } catch (error) {
            console.error('[BookingStore] Failed to load time slots:', error);
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
    updateTicketQuantity(ticketTypeId: string, quantity: number): void {
        const currentTicket = get(selectedTicket);
        console.log(`[BookingStore] Updating ticket quantity: ${ticketTypeId} = ${quantity}`);

        if (quantity > 0) {
            selectedTicket.set({ id: ticketTypeId, quantity });
        } else {
            selectedTicket.set(null);
        }

        // If ticket type changed, clear availability cache and dependent state
        if (currentTicket?.id !== ticketTypeId) {
            console.log(`[BookingStore] Ticket type changed, clearing dependent state`);
            // Don't clear the entire dateAvailability cache, just reset selection-dependent state
            selectedDate.set(null);
            selectedTimeSlot.set(null);
            availableTimeSlots.set([]);
        }

        validationErrors.update(current => ({ ...current, tickets: undefined, capacity: undefined }));
    },

    /**
     * Sets the selected date and clears dependent state (time slot).
     * @param {Date} date - The selected date.
     */
    setSelectedDate(date: Date): void {
        console.log(`[BookingStore] Setting selected date: ${date.toISOString().split('T')[0]}`);
        selectedDate.set(date);
        selectedTimeSlot.set(null);
        availableTimeSlots.set([]);
        validationErrors.update(current => ({ ...current, date: undefined }));
    },

    /**
     * Sets the selected time slot.
     * @param {TimeSlot} timeSlot - The selected time slot object.
     */
    setSelectedTimeSlot(timeSlot: TimeSlot): void {
        console.log(`[BookingStore] Setting selected time slot: ${timeSlot.id}`);
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
        const isValid = Object.keys(errors).length === 0;
        console.log(`[BookingStore] Validation result: ${isValid ? 'VALID' : 'INVALID'}`, errors);
        return isValid;
    },

    /**
     * This method is now DEPRECATED in favor of creating a full order payload for the
     * `/payments/create-payment-intent` endpoint. A standalone booking creation via the
     * frontend is no longer the standard flow.
     * This function is maintained for potential direct use or testing but should not be
     * part of the main checkout flow.
     */
    async createBooking(customFetch: typeof fetch = fetch): Promise<any> {
        if (!this.validateBooking()) {
            const errorMsg = 'Please correct the validation errors before proceeding.';
            bookingError.set(errorMsg);
            throw new Error(errorMsg);
        }

        isCreatingBooking.set(true);
        bookingError.set(null);

        try {
            const summary = get(bookingSummary);
            const customer = get(customerInfo);
            const ticket = get(selectedTicket);

            const bookingData: BookingData = {
                time_slot_id: summary.timeSlot!.id,
                quantity: ticket!.quantity,
                customer_name: customer.name,
                customer_email: customer.email,
            };

            // The standalone booking endpoint is no longer the primary path.
            // This demonstrates how it *would* work if needed.
            console.warn("[BookingStore] Using deprecated createBooking flow. The standard flow is via the checkout/payment intent page.");
            const booking = await apiClient.createBooking(bookingData, customFetch);
            // In a real scenario, we might reset state here.
            // this.resetBooking();
            return booking;
        } catch (error) {
            console.error('[BookingStore] Failed to create booking:', error);
            const errorMsg = 'An error occurred while creating your booking. Please try again.';
            bookingError.set(errorMsg);
            throw error;
        } finally {
            isCreatingBooking.set(false);
        }
    },

    /**
     * Resets all booking state to initial values for a new booking.
     * Also clears associated validation and error messages.
     */
    resetBooking(): void {
        console.log(`[BookingStore] Resetting booking state`);
        selectedDate.set(null);
        selectedTimeSlot.set(null);
        selectedTicket.set(null);
        availableTimeSlots.set([]);
        dateAvailability.set(new Map()); // Clear availability cache
        customerInfo.set({ name: '', email: '', isGuest: true });
        bookingError.set(null);
        validationErrors.set({});
    },

    /** Clears all error states from the store. */
    clearErrors(): void {
        bookingError.set(null);
        validationErrors.set({});
    }
};