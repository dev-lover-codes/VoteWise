/**
 * @fileoverview Tests for Web Vitals reporting module.
 * Validates that Core Web Vitals metrics are correctly registered and reported.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock web-vitals library
const mockOnCLS = vi.fn();
const mockOnFCP = vi.fn();
const mockOnLCP = vi.fn();
const mockOnTTFB = vi.fn();
const mockOnINP = vi.fn();

vi.mock('web-vitals', () => ({
  onCLS: mockOnCLS,
  onFCP: mockOnFCP,
  onLCP: mockOnLCP,
  onTTFB: mockOnTTFB,
  onINP: mockOnINP,
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
    expect(mockOnCLS).toHaveBeenCalledOnce();
  });

  it('should register FCP listener on reportWebVitals', () => {
    reportWebVitals();
    expect(mockOnFCP).toHaveBeenCalledOnce();
  });

  it('should register LCP listener on reportWebVitals', () => {
    reportWebVitals();
    expect(mockOnLCP).toHaveBeenCalledOnce();
  });

  it('should register TTFB listener on reportWebVitals', () => {
    reportWebVitals();
    expect(mockOnTTFB).toHaveBeenCalledOnce();
  });

  it('should register INP listener on reportWebVitals', () => {
    reportWebVitals();
    expect(mockOnINP).toHaveBeenCalledOnce();
  });

  it('should register all 5 Core Web Vitals listeners at once', () => {
    reportWebVitals();
    expect(mockOnCLS).toHaveBeenCalledOnce();
    expect(mockOnFCP).toHaveBeenCalledOnce();
    expect(mockOnLCP).toHaveBeenCalledOnce();
    expect(mockOnTTFB).toHaveBeenCalledOnce();
    expect(mockOnINP).toHaveBeenCalledOnce();
  });

  it('should pass a callback function to each metric listener', () => {
    reportWebVitals();
    
    // Each listener should be called with a function callback
    expect(typeof mockOnCLS.mock.calls[0][0]).toBe('function');
    expect(typeof mockOnFCP.mock.calls[0][0]).toBe('function');
    expect(typeof mockOnLCP.mock.calls[0][0]).toBe('function');
    expect(typeof mockOnTTFB.mock.calls[0][0]).toBe('function');
    expect(typeof mockOnINP.mock.calls[0][0]).toBe('function');
  });

  it('should be callable multiple times without errors', () => {
    expect(() => {
      reportWebVitals();
      reportWebVitals();
    }).not.toThrow();
  });
});
