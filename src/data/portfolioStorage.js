import DEFAULT_DATA from './portfolioData.json';

const STORAGE_KEY = 'diceu_portfolio_data';
const UPDATE_EVENT = 'portfolio-data-updated';

async function notifyAndPersistToDisk(data) {
  // Notify active listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: data }));
  }

  // Attempt to write to disk via Vite dev server middleware
  try {
    const res = await fetch('/api/save-portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data, null, 2)
    });
    if (res.ok) {
      const result = await res.json();
      return { success: true, diskSaved: true, message: result.message || 'Saved to disk & storage' };
    }
  } catch {
    // Expected in production/static hosting without local Node dev server
  }

  return { success: true, diskSaved: false, message: 'Saved to browser storage' };
}

/**
 * Get current portfolio data from localStorage or fallback to default JSON.
 */
export function getPortfolioData() {
  if (typeof window === 'undefined') return DEFAULT_DATA;
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.modules && parsed.profile) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[STORAGE] Failed to load cached portfolio data, using default:', err);
  }
  return DEFAULT_DATA;
}

/**
 * Save updated portfolio data to localStorage and attempt disk persistence via Vite API.
 */
export async function savePortfolioData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('[STORAGE] LocalStorage save failed:', err);
  }

  return notifyAndPersistToDisk(data);
}

/**
 * Reset portfolio data back to default initial JSON.
 */
export async function resetPortfolioData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('[STORAGE] Failed to clear storage:', err);
  }

  await notifyAndPersistToDisk(DEFAULT_DATA);
  return DEFAULT_DATA;
}

/**
 * Export current portfolio data as a downloadable JSON file.
 */
export function exportPortfolioJson(data = null) {
  const payload = data || getPortfolioData();
  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'portfolioData.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Subscribe to portfolio data changes.
 */
export function subscribeToPortfolioData(callback) {
  if (typeof window === 'undefined') return () => {};
  const handler = (event) => callback(event.detail);
  window.addEventListener(UPDATE_EVENT, handler);
  return () => window.removeEventListener(UPDATE_EVENT, handler);
}
