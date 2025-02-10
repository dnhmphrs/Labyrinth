import { writable } from 'svelte/store';

export const keypressHistory = writable([]);

export function addKeypress(key) {
    const timestamp = performance.now();
    keypressHistory.update(history => [{key, timestamp}, ...history]);
} 