/**
 * Google Analytics 4 (gtag) — koristi samo u klijentskim komponentama (`'use client'`).
 *
 * @example
 * sendGAEvent('event', 'add_to_cart', { currency: 'RSD', value: 2490, items: [...] });
 */
export { sendGAEvent } from '@next/third-parties/google';
