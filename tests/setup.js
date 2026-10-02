import { TextDecoder, TextEncoder } from 'node:util';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

if (!globalThis.TextEncoder) Object.defineProperty(globalThis, 'TextEncoder', { value: TextEncoder });
if (!globalThis.TextDecoder) Object.defineProperty(globalThis, 'TextDecoder', { value: TextDecoder });

if (typeof window !== 'undefined') {
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn(query => ({
    matches: false, media: query,
    addEventListener: jest.fn(), removeEventListener: jest.fn(),
  })),
});
window.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
}
}
