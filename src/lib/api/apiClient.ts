/**
* @file apiClient.ts
* @purpose Centralized API client for communicating with FastAPI backend
*
* @dependencies
* - SvelteKit's fetch: Server-side fetch during load functions
* - TypeScript: Strong typing for API responses and requests
*
* @notes
* - Handles authentication for admin endpoints
* - Provides error handling and response validation
* - Supports both server-side and client-side requests
* - Error handling: Throws typed errors for proper catch handling
* - Updated to include payment-related endpoints.
*/


import type { OrderCreatePayload } from "$lib/schemas/payment";

// Types based on backend schema structure
export interface Language {
    code: string;
    name: string;
    is_default: boolean;
}

export interface PageContent {
    id: string;
    slug: string;
    language_code: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export interface PageContentCreate {
    slug: string;
    language_code: string;
    title: string;
    content: string;
}

export interface PageContentUpdate {
    title?: string;
    content?: string;
}

export interface ContactForm {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface User {
    id: string;
    email: string;
    name?: string;
    role: 'Administrator' | 'Staff';
    profile_image_path?: string;
    created_at: string;
    updated_at: string;
}

export interface TicketType {
    id: string;
    name_translations: Record<string, string>;
    description_translations?: Record<string, string>;
    price: number;
    group_size?: number;
    created_at: string;
    updated_at: string;
}

export interface TimeSlot {
    id: string;
    ticket_type_id: string;
    start_time: string;
    end_time: string;
    capacity: number;
    available_slots: number;
    created_at: string;
    updated_at: string;
}

export interface Merchandise {
    id: string;
    name_translations: Record<string, string>;
    description_translations?: Record<string, string>;
    price: number;
    inventory: number;
    created_at: string;
    updated_at: string;
}

export interface Booking {
    id: string;
    user_id?: string;
    customer_name?: string;
    customer_email?: string;
    booking_date: string;
    time_slot_id: string;
    ticket_type_id: string;
    quantity: number;
    total_price: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    order_id?: string;
    source: 'ONLINE' | 'ONSITE';
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: string;
    user_id?: string;
    customer_name?: string;
    customer_email?: string;
    order_date: string;
    total_amount: number;
    payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
    payment_intent_id?: string;
    source: 'ONLINE' | 'ONSITE';
    created_at: string;
    updated_at: string;
}

// Error types for better error handling
export class ApiError extends Error {
    constructor(
        public status: number,
        public detail: string,
        public endpoint: string
    ) {
        super(`API Error ${status}: ${detail}`);
        this.name = 'ApiError';
    }
}

export class NetworkError extends Error {
    constructor(public endpoint: string, public originalError: Error) {
        super(`Network error calling ${endpoint}: ${originalError.message}`);
        this.name = 'NetworkError';
    }
}

// API Client configuration
interface ApiClientConfig {
    baseUrl?: string;
    timeout?: number;
    defaultHeaders?: Record<string, string>;
    debug?: boolean;
}

// Main API Client class
export class ApiClient {
    private baseUrl: string;
    private timeout: number;
    private defaultHeaders: Record<string, string>;
    private debug: boolean;

    constructor(config: ApiClientConfig = {}) {
        // Use relative URLs for SvelteKit proxy - this is crucial
        this.baseUrl = config.baseUrl || '/api/v1';
        this.timeout = config.timeout || 30000;
        this.debug = config.debug || false;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            ...config.defaultHeaders
        };
    }

    /**
     * Internal fetch wrapper with error handling and timeout
     * @param endpoint API endpoint path
     * @param options Fetch options
     * @param customFetch Custom fetch function (for server-side)
     * @returns Promise with parsed response
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        customFetch: typeof fetch = fetch
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        if (this.debug) {
            console.log(`🔄 API Request: ${options.method || 'GET'} ${url}`);
            if (options.body) {
                console.log('📤 Request body:', options.body);
            }
        }

        // Setup request with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await customFetch(url, {
                ...options,
                headers: {
                    ...this.defaultHeaders,
                    ...options.headers
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (this.debug) {
                console.log(`📥 API Response: ${response.status} ${response.statusText} for ${url}`);
            }

            // Handle different content types
            const contentType = response.headers.get('content-type');
            let data: any;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                // For endpoints that return simple text or no body
                const text = await response.text();
                data = text ? { message: text } : { message: 'Success' };
            }

            if (!response.ok) {
                if (this.debug) {
                    console.error(`❌ API Error: ${response.status} for ${url}`, data);
                }

                throw new ApiError(
                    response.status,
                    data.detail || data.message || `HTTP ${response.status}: ${response.statusText}`,
                    endpoint
                );
            }

            if (this.debug) {
                console.log('✅ API Success:', data);
            }

            return data;
        } catch (error) {
            clearTimeout(timeoutId);

            if (error instanceof ApiError) {
                throw error;
            }

            if (error.name === 'AbortError') {
                throw new NetworkError(endpoint, new Error('Request timeout'));
            }

            // Handle network errors and other fetch failures
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new NetworkError(endpoint, new Error('Network connection failed'));
            }

            throw new NetworkError(endpoint, error as Error);
        }
    }

    // Content API methods
    async getPageContent(
        slug: string,
        langCode: string,
        customFetch?: typeof fetch
    ): Promise<PageContent> {
        return this.request<PageContent>(
            `/content/${slug}/${langCode}`,
            { method: 'GET' },
            customFetch
        );
    }

    async submitContactForm(
        contactData: ContactForm,
        customFetch?: typeof fetch
    ): Promise<{ message: string }> {
        return this.request<{ message: string }>(
            '/content/contact',
            {
                method: 'POST',
                body: JSON.stringify(contactData)
            },
            customFetch
        );
    }

    // Admin Content API methods (require authentication)
    async createPageContent(
        contentData: PageContentCreate,
        authToken: string,
        customFetch?: typeof fetch
    ): Promise<PageContent> {
        return this.request<PageContent>(
            '/content/admin/content',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(contentData)
            },
            customFetch
        );
    }

    async updatePageContent(
        contentId: string,
        contentData: PageContentUpdate,
        authToken: string,
        customFetch?: typeof fetch
    ): Promise<PageContent> {
        return this.request<PageContent>(
            `/content/admin/content/${contentId}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(contentData)
            },
            customFetch
        );
    }

    async getLanguages(
        authToken: string,
        customFetch?: typeof fetch
    ): Promise<Language[]> {
        return this.request<Language[]>(
            '/content/admin/languages',
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            },
            customFetch
        );
    }

    // Ticket API methods
    async getTicketTypes(customFetch?: typeof fetch): Promise<TicketType[]> {
        return this.request<TicketType[]>(
            '/tickets/types',
            { method: 'GET' },
            customFetch
        );
    }

    async getTimeSlots(
        ticketTypeId: string,
        date: string,
        customFetch?: typeof fetch
    ): Promise<TimeSlot[]> {
        return this.request<TimeSlot[]>(
            `/tickets/time-slots/${ticketTypeId}?date=${date}`,
            { method: 'GET' },
            customFetch
        );
    }

    // Merchandise API methods
    async getMerchandise(customFetch?: typeof fetch): Promise<Merchandise[]> {
        return this.request<Merchandise[]>(
            '/merchandise',
            { method: 'GET' },
            customFetch
        );
    }

    async getMerchandiseItem(
        merchandiseId: string,
        customFetch?: typeof fetch
    ): Promise<Merchandise> {
        return this.request<Merchandise>(
            `/merchandise/${merchandiseId}`,
            { method: 'GET' },
            customFetch
        );
    }

    // Booking API methods
    async createBooking(
        bookingData: Partial<Booking>,
        customFetch?: typeof fetch
    ): Promise<Booking> {
        return this.request<Booking>(
            '/bookings',
            {
                method: 'POST',
                body: JSON.stringify(bookingData)
            },
            customFetch
        );
    }

    async getBooking(
        bookingId: string,
        customFetch?: typeof fetch
    ): Promise<Booking> {
        return this.request<Booking>(
            `/bookings/${bookingId}`,
            { method: 'GET' },
            customFetch
        );
    }

    // --- ADDED: Payment API methods ---
    async createPaymentIntent(
        payload: OrderCreatePayload,
        customFetch?: typeof fetch
    ): Promise<{ client_secret: string }> {
        return this.request<{ client_secret: string }>(
            '/payments/create-payment-intent',
            {
                method: 'POST',
                body: JSON.stringify(payload)
            },
            customFetch
        );
    }

    // Health check method for debugging
    async healthCheck(customFetch?: typeof fetch): Promise<{ status: string }> {
        return this.request<{ status: string }>(
            '/health',
            { method: 'GET' },
            customFetch
        );
    }
}

// Export default instances for different environments
export const apiClient = new ApiClient();

// Debug version for development
export const debugApiClient = new ApiClient({ debug: true });

// Utility functions for common patterns
export function createApiClient(config?: ApiClientConfig): ApiClient {
    return new ApiClient(config);
}

/**
 * Helper function to handle API errors in load functions
 * @param error Caught error from API call
 * @param fallbackMessage User-friendly fallback message
 * @returns Error object for SvelteKit error function
 */
export function handleApiError(
    error: unknown,
    fallbackMessage: string = 'An unexpected error occurred'
): { status: number; message: string; details: string } {
    if (error instanceof ApiError) {
        return {
            status: error.status,
            message: getPublicErrorMessage(error.status),
            details: error.detail
        };
    }

    if (error instanceof NetworkError) {
        return {
            status: 500,
            message: 'Connection Error',
            details: 'Unable to connect to the server. Please try again later.'
        };
    }

    console.error('Unexpected API error:', error);
    return {
        status: 500,
        message: fallbackMessage,
        details: 'An unexpected error occurred while processing your request.'
    };
}

/**
 * Convert HTTP status codes to user-friendly messages
 * @param status HTTP status code
 * @returns User-friendly error message
 */
function getPublicErrorMessage(status: number): string {
    switch (status) {
        case 400:
            return 'Invalid Request';
        case 401:
            return 'Authentication Required';
        case 403:
            return 'Access Denied';
        case 404:
            return 'Content Not Found';
        case 409:
            return 'Resource Already Exists';
        case 429:
            return 'Too Many Requests';
        case 500:
            return 'Server Error';
        case 502:
        case 503:
        case 504:
            return 'Service Unavailable';
        default:
            return 'An Error Occurred';
    }
}

/**
 * Utility to check if the API client is working correctly
 * Can be used in development to debug proxy issues
 */
export async function testApiConnection(customFetch?: typeof fetch): Promise<boolean> {
    try {
        await debugApiClient.healthCheck(customFetch);
        console.log('✅ API connection test successful');
        return true;
    } catch (error) {
        console.error('❌ API connection test failed:', error);
        return false;
    }
}