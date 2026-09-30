import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

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
