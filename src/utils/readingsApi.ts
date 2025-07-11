import { ReadingData } from '../types';

export async function fetchReadings(date?: Date): Promise<ReadingData> {
  return new Promise<ReadingData>((resolve, reject) => {
    const script = document.createElement('script');
    const uniqueCallbackName = `universalisCallback_${Date.now()}`;

    const targetDate = date || new Date();
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}${month}${day}`;
    const url = `https://universalis.com/United.States/${formattedDate}/jsonpmass.js`;

    script.src = `${url}?callback=${uniqueCallbackName}`;

    // Set timeout for JSONP request
    const timeout = setTimeout(() => {
      reject(new Error('Request timeout'));
      delete (window as any)[uniqueCallbackName];
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    }, 10000);

    // Define the callback function
    (window as any)[uniqueCallbackName] = (data: ReadingData) => {
      clearTimeout(timeout);
      resolve(data);
      delete (window as any)[uniqueCallbackName];
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };

    // Handle JSONP script loading errors
    script.onerror = () => {
      clearTimeout(timeout);
      reject(new Error(`JSONP request to ${url} failed`));
      delete (window as any)[uniqueCallbackName];
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };

    document.body.appendChild(script);
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}