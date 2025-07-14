import { ReadingData } from '../types';

// Function to clean HTML tags and decode HTML entities
function cleanText(text: string): string {
  // Remove HTML tags
  let cleaned = text.replace(/<[^>]*>/g, '');
  
  // Decode common HTML entities
  cleaned = cleaned
    .replace(/&nbsp;/g, ' ')
    .replace(/&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x2010;/g, '–')
    .replace(/&#x2013;/g, '–')
    .replace(/&#x2014;/g, '—')
    .replace(/&#x2018;/g, '\'')
    .replace(/&#x2019;/g, '\'')
    .replace(/&#x201c;/g, '"')
    .replace(/&#x201d;/g, '"')
    .replace(/&#xa9;/g, '©')
    .replace(/&#xa0;/g, ' ');
  
  // Remove extra whitespace and clean up formatting
  cleaned = cleaned
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
  
  return cleaned;
}

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
      
      // Clean all text content
      const cleanedData = {
        ...data,
        Mass_R1: {
          ...data.Mass_R1,
          text: cleanText(data.Mass_R1.text),
          source: cleanText(data.Mass_R1.source)
        },
        Mass_Ps: {
          ...data.Mass_Ps,
          text: cleanText(data.Mass_Ps.text),
          source: cleanText(data.Mass_Ps.source)
        },
        Mass_R2: data.Mass_R2 ? {
          ...data.Mass_R2,
          text: cleanText(data.Mass_R2.text),
          source: cleanText(data.Mass_R2.source)
        } : undefined,
        Mass_GA: {
          ...data.Mass_GA,
          text: cleanText(data.Mass_GA.text),
          source: cleanText(data.Mass_GA.source)
        },
        Mass_G: {
          ...data.Mass_G,
          text: cleanText(data.Mass_G.text),
          source: cleanText(data.Mass_G.source)
        },
        day: cleanText(data.day)
      };
      
      resolve(cleanedData);
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