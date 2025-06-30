/**
    * @file cartStore.ts
    * @purpose Manages the state of the user's shopping cart for merchandise.
    * 
    * @dependencies
    * - svelte/store: For creating writable and derived stores.
    * - $lib/api/apiClient: For the Merchandise type definition.
    *
    * @notes
    * - The cart state is persisted to `localStorage` to survive page reloads and new sessions.
    * - It provides reactive derived stores for `cartCount` and `cartTotal` for easy display in the UI.
    * - All interactions with the cart (add, remove, update) are handled through exported functions.
    * - Error handling: Assumes valid product data is passed in; validation should occur at the component level.
    */

import { writable, derived, type Writable } from 'svelte/store';
import type { Merchandise } from '$lib/api/apiClient';

/** Defines the structure of an item within the shopping cart. */
export interface CartItem extends Merchandise {
    quantity: number;
}

const CART_STORAGE_KEY = 'zungri-museum-cart';

/**
 * Creates a Svelte store for the shopping cart that automatically
 * synchronizes its state with the browser's localStorage.
 * @returns An object with store subscription and action methods.
 */
function createCartStore() {
    const isBrowser = typeof window !== 'undefined';
    const initialValue: CartItem[] = isBrowser
        ? JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]')
        : [];

    const store: Writable<CartItem[]> = writable(initialValue);

    // If in a browser environment, subscribe to the store to update localStorage on any change.
    if (isBrowser) {
        store.subscribe((value) => {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(value));
        });
    }

    /**
     * Adds a product to the cart or increments its quantity if it already exists.
     * @param product The merchandise item to add.
     * @param quantity The number of items to add. Defaults to 1.
     */
    function addToCart(product: Merchandise, quantity = 1) {
        store.update((items) => {
            const existingItem = items.find((item) => item.id === product.id);
            if (existingItem) {
                // Update quantity if item already in cart
                existingItem.quantity = Math.min(existingItem.quantity + quantity, product.inventory);
            } else {
                // Add new item to cart
                items.push({ ...product, quantity });
            }
            return items;
        });
    }

    /**
     * Removes an item entirely from the cart.
     * @param productId The ID of the product to remove.
     */
    function removeFromCart(productId: string) {
        store.update((items) => items.filter((item) => item.id !== productId));
    }

    /**
     * Updates the quantity of a specific item in the cart.
     * If quantity is 0 or less, the item is removed.
     * @param productId The ID of the product to update.
     * @param quantity The new quantity.
     */
    function updateQuantity(productId: string, quantity: number) {
        store.update((items) => {
            if (quantity <= 0) {
                return items.filter((item) => item.id !== productId);
            }
            const itemToUpdate = items.find((item) => item.id === productId);
            if (itemToUpdate) {
                itemToUpdate.quantity = Math.min(quantity, itemToUpdate.inventory);
            }
            return items;
        });
    }

    /** Empties the entire cart. */
    function clearCart() {
        store.set([]);
    }

    return {
        subscribe: store.subscribe,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    };
}

/** The main cart store instance. */
export const cart = createCartStore();

/** A derived store that calculates the total number of items in the cart. */
export const cartCount = derived(cart, ($cart) => {
    return $cart.reduce((total, item) => total + item.quantity, 0);
});

/** A derived store that calculates the total price of all items in the cart. */
export const cartTotal = derived(cart, ($cart) => {
    return $cart.reduce((total, item) => total + item.price * item.quantity, 0);
});