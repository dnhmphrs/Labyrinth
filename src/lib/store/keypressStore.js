import { writable } from 'svelte/store';

export const keypressHistory = writable([]);

export function addKeypress(key) {
    keypressHistory.update(history => {
        const timestamp = performance.now();
        // return [...history, { key, timestamp }].slice(-10);
        return [...history, { key, timestamp }];
    });
} 