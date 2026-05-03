/**
 * @fileoverview Firebase Analytics and Performance Monitoring integration.
 * Provides event tracking for user interactions throughout the VoteWise app.
 * Uses Firebase Analytics for user behavior tracking and Firebase Performance
 * for monitoring Core Web Vitals and custom traces.
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, logEvent as firebaseLogEvent, isSupported } from 'firebase/analytics';
import { getPerformance, trace } from 'firebase/performance';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'mock-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'mock-domain',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mock-id',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'mock-bucket',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'mock-sender',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'mock-app-id',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

// Reuse existing Firebase app if already initialized
const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

let analyticsInstance: ReturnType<typeof getAnalytics> | null = null;
let perfInstance: ReturnType<typeof getPerformance> | null = null;

/** Initialize Firebase Analytics (browser-only, async check for support). */
async function initAnalytics() {
  try {
    const supported = await isSupported();
    if (supported && !analyticsInstance) {
      analyticsInstance = getAnalytics(app);
    }
  } catch {
    // Analytics not supported in this environment (e.g., localhost)
  }
}

/** Initialize Firebase Performance Monitoring. */
function initPerformance() {
  try {
    if (!perfInstance) {
      perfInstance = getPerformance(app);
    }
  } catch {
    // Performance not supported in this environment
  }
}

// Initialize on module load
initAnalytics();
initPerformance();

/**
 * Log a custom analytics event.
 * @param eventName - The name of the event to log.
 * @param params - Optional event parameters.
 */
export function logEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  try {
    if (analyticsInstance) {
      firebaseLogEvent(analyticsInstance, eventName, params);
    }
  } catch {
    // Silently fail if analytics is unavailable
  }
}

/**
 * Track a page view event with the given page name.
 * @param pageName - The name of the page being viewed.
 * @param pageTitle - The display title of the page.
 */
export function trackPageView(pageName: string, pageTitle?: string) {
  logEvent('page_view', {
    page_name: pageName,
    page_title: pageTitle || pageName,
  });
}

/**
 * Track when a user completes a quiz.
 * @param topic - The quiz topic/category ID.
 * @param score - The number of correct answers.
 * @param total - The total number of questions.
 * @param timeTaken - Time taken in seconds.
 */
export function trackQuizComplete(topic: string, score: number, total: number, timeTaken: number) {
  const percentage = Math.round((score / total) * 100);
  logEvent('quiz_complete', {
    quiz_topic: topic,
    score,
    total_questions: total,
    percentage,
    time_taken_seconds: timeTaken,
  });
}

/**
 * Track when a user sends a chat message to the AI assistant.
 * @param sessionId - The current chat session ID.
 * @param isGuest - Whether the user is unauthenticated.
 */
export function trackChatMessage(sessionId: string, isGuest: boolean) {
  logEvent('chat_message_sent', {
    session_id: sessionId,
    is_guest: isGuest,
  });
}

/**
 * Track myth verification feedback.
 * @param mythId - The ID of the myth being rated.
 * @param wasHelpful - Whether the user found it helpful.
 */
export function trackMythFeedback(mythId: string, wasHelpful: boolean) {
  logEvent('myth_feedback', {
    myth_id: mythId,
    was_helpful: wasHelpful,
  });
}

/**
 * Track EVM simulation usage events.
 * @param action - The action taken (e.g., 'vote_cast', 'reset').
 * @param candidate - The candidate selected (if applicable).
 */
export function trackEvmInteraction(action: string, candidate?: string) {
  logEvent('evm_interaction', {
    action,
    ...(candidate ? { candidate } : {}),
  });
}

/**
 * Create and record a Firebase Performance custom trace.
 * @param traceName - The name of the trace to record.
 * @param fn - The async function to measure.
 */
export async function withPerformanceTrace<T>(
  traceName: string,
  fn: () => Promise<T>
): Promise<T> {
  if (!perfInstance) {
    return fn();
  }

  const perfTrace = trace(perfInstance, traceName);
  perfTrace.start();
  try {
    const result = await fn();
    return result;
  } finally {
    perfTrace.stop();
  }
}

/**
 * Track user authentication events.
 * @param method - The sign-in method used ('google', 'email', 'signup').
 */
export function trackAuthEvent(method: 'google' | 'email' | 'signup' | 'logout') {
  const eventName = method === 'logout' ? 'logout' : 'login';
  logEvent(eventName, { method });
}

export default {
  logEvent,
  trackPageView,
  trackQuizComplete,
  trackChatMessage,
  trackMythFeedback,
  trackEvmInteraction,
  withPerformanceTrace,
  trackAuthEvent,
};
