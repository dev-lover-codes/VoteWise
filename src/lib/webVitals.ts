/**
 * @fileoverview Web Vitals reporting for Core Web Vitals monitoring.
 * Reports LCP, CLS, FID, FCP, TTFB, and INP metrics to Firebase Analytics
 * and optionally to the browser console in development mode.
 */

import { onCLS, onFCP, onLCP, onTTFB, onINP, type Metric } from 'web-vitals';
import { logEvent } from './analytics';

/**
 * Sends a Web Vitals metric to Firebase Analytics.
 * @param metric - The Web Vitals metric object containing name, value, and rating.
 */
function sendToAnalytics(metric: Metric) {
  const { name, value, rating, id } = metric;

  // Log to Firebase Analytics
  logEvent('web_vitals', {
    metric_name: name,
    metric_value: Math.round(name === 'CLS' ? value * 1000 : value),
    metric_rating: rating,
    metric_id: id,
  });

  // Log to console in development
  if (import.meta.env.DEV) {
    const color = rating === 'good' ? '#0CCE6B' : rating === 'needs-improvement' ? '#FFA400' : '#FF4E42';
    console.log(
      `%c[Web Vitals] ${name}: ${Math.round(value)}ms (${rating})`,
      `color: ${color}; font-weight: bold`
    );
  }
}

/**
 * Initialize Web Vitals reporting.
 * Registers listeners for all Core Web Vitals metrics.
 */
export function reportWebVitals() {
  onCLS(sendToAnalytics);
  onFCP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
  onINP(sendToAnalytics);
}

export default reportWebVitals;
