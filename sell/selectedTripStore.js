// src/stores/selectedTripStore.js
import { writable } from 'svelte/store';

// Create a writable store to hold the selected trip data
export const selectedTripStore = writable(null);