import '@testing-library/jest-dom';
import { vi } from 'vitest';

// ========================================================
// Setup only browser-incompatible APIs that need to be
// mocked globally. Individual test files should mock their
// specific module dependencies directly for better control.
// ========================================================

// Mock window.scrollTo (not available in JSDOM)
window.scrollTo = vi.fn();

// Mock window.matchMedia (not available in JSDOM)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver (not available in JSDOM)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver (not available in JSDOM)
// Required for Framer Motion viewport animations
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock Spline 3D viewer (heavy 3D rendering, cannot run in JSDOM)
vi.mock('@splinetool/react-spline', () => ({
  default: () => null,
}));

// Mock canvas-confetti (canvas API not available in JSDOM)
vi.mock('canvas-confetti', () => ({
  default: () => {},
}));

// Mock howler audio library (Web Audio API not available in JSDOM)
vi.mock('howler', () => ({
  Howl: class {
    play = () => {};
    stop = () => {};
    pause = () => {};
    volume = () => {};
    on = () => {};
    off = () => {};
  },
  Howler: {
    volume: () => {},
    unload: () => {},
  },
}));

// Suppress React act() warnings and known non-critical errors in tests
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = (...args: unknown[]) => {
    const message = String(args[0] || '');
    if (
      message.includes('Warning: ReactDOM.render is no longer supported') ||
      message.includes('Not implemented: navigation') ||
      message.includes('Warning: An update to') ||
      message.includes('inside a test was not wrapped in act')
    ) {
      return;
    }
    originalConsoleError(...args);
  };
});

afterEach(() => {
  console.error = originalConsoleError;
  vi.clearAllMocks();
});
