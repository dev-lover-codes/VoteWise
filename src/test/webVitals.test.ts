/**
 * @fileoverview Tests for Web Vitals reporting module.
 * Validates that Core Web Vitals metrics are correctly registered and reported.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted to declare variables before vi.mock
const mocks = vi.hoisted(() => ({
  mockOnCLS: vi.fn(),
  mockOnFCP: vi.fn(),
  mockOnLCP: vi.fn(),
  mockOnTTFB: vi.fn(),
  mockOnINP: vi.fn(),
}));

vi.mock('web-vitals', () => ({
  onCLS: mocks.mockOnCLS,
  onFCP: mocks.mockOnFCP,
  onLCP: mocks.mockOnLCP,
  onTTFB: mocks.mockOnTTFB,
  onINP: mocks.mockOnINP,
}));

// Mock analytics module
vi.mock('../lib/analytics', () => ({
  logEvent: vi.fn(),
}));

// Mock Firebase modules
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
  getApps: vi.fn(() => [{}]), // Return existing app
}));
vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => ({})),
  logEvent: vi.fn(),
  isSupported: vi.fn(() => Promise.resolve(false)),
}));
vi.mock('firebase/performance', () => ({
  getPerformance: vi.fn(() => ({})),
  trace: vi.fn(() => ({ start: vi.fn(), stop: vi.fn() })),
}));

import { reportWebVitals } from '../lib/webVitals';

describe('Web Vitals Reporter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should register CLS listener on reportWebVitals', () => {
    reportWebVitals();
    expect(mocks.mockOnCLS).toHaveBeenCalledOnce();
  });

  it('should register FCP listener on reportWebVitals', () => {
    reportWebVitals();
    expect(mocks.mockOnFCP).toHaveBeenCalledOnce();
  });

  it('should register LCP listener on reportWebVitals', () => {
    reportWebVitals();
    expect(mocks.mockOnLCP).toHaveBeenCalledOnce();
  });

  it('should register TTFB listener on reportWebVitals', () => {
    reportWebVitals();
    expect(mocks.mockOnTTFB).toHaveBeenCalledOnce();
  });

  it('should register INP listener on reportWebVitals', () => {
    reportWebVitals();
    expect(mocks.mockOnINP).toHaveBeenCalledOnce();
  });

  it('should register all 5 Core Web Vitals listeners at once', () => {
    reportWebVitals();
    expect(mocks.mockOnCLS).toHaveBeenCalledOnce();
    expect(mocks.mockOnFCP).toHaveBeenCalledOnce();
    expect(mocks.mockOnLCP).toHaveBeenCalledOnce();
    expect(mocks.mockOnTTFB).toHaveBeenCalledOnce();
    expect(mocks.mockOnINP).toHaveBeenCalledOnce();
  });

  it('should pass a callback function to each metric listener', () => {
    reportWebVitals();
    
    // Each listener should be called with a function callback
    expect(typeof mocks.mockOnCLS.mock.calls[0][0]).toBe('function');
    expect(typeof mocks.mockOnFCP.mock.calls[0][0]).toBe('function');
    expect(typeof mocks.mockOnLCP.mock.calls[0][0]).toBe('function');
    expect(typeof mocks.mockOnTTFB.mock.calls[0][0]).toBe('function');
    expect(typeof mocks.mockOnINP.mock.calls[0][0]).toBe('function');
  });

  it('should be callable multiple times without errors', () => {
    expect(() => {
      reportWebVitals();
      reportWebVitals();
    }).not.toThrow();
  });
});
