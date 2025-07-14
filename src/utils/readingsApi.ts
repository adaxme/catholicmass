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
    .replace(/&#x2018;/g, ''')
    )
    .replace(/&#x2019;/g, ''')
    )
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
  // For React Native, we'll use a mock implementation since JSONP doesn't work
  // In a real app, you'd need a backend API or use a different approach
  const mockReadings: ReadingData = {
    date: new Date().toISOString().split('T')[0],
    day: 'Weekday in Ordinary Time',
    Mass_R1: {
      source: 'Matthew 10:34–11:1',
      text: `Jesus instructed the Twelve as follows: 'Do not suppose that I have come to bring peace to the earth: it is not peace I have come to bring, but a sword. For I have come to set a man against his father, a daughter against her mother, a daughter-in-law against her mother-in-law. A man's enemies will be those of his own household. 'Anyone who prefers father or mother to me is not worthy of me. Anyone who prefers son or daughter to me is not worthy of me. Anyone who does not take his cross and follow in my footsteps is not worthy of me. Anyone who finds his life will lose it; anyone who loses his life for my sake will find it. 'Anyone who welcomes you welcomes me; and those who welcome me welcome the one who sent me. 'Anyone who welcomes a prophet will have a prophet's reward; and anyone who welcomes a holy man will have a holy man's reward. 'If anyone gives so much as a cup of cold water to one of these little ones because he is a disciple, then I tell you solemnly, he will most certainly not lose his reward.' When Jesus had finished instructing his twelve disciples he moved on from there to teach and preach in their towns.`
    },
    Mass_Ps: {
      source: 'Psalm 69:8-10,14',
      text: 'It is for you that I suffer taunts, that shame covers my face. I have become a stranger to my brothers, an alien to my own mother\'s sons. Zeal for your house devours me and the taunts of those who taunt you fall on me.'
    },
    Mass_GA: {
      source: 'Matthew 11:25',
      text: 'Alleluia, alleluia! Blessed are you, Father, Lord of heaven and earth, for revealing the mysteries of the kingdom to mere children. Alleluia!'
    },
    Mass_G: {
      source: 'Matthew 10:34–11:1',
      text: `Jesus instructed the Twelve as follows: 'Do not suppose that I have come to bring peace to the earth: it is not peace I have come to bring, but a sword. For I have come to set a man against his father, a daughter against her mother, a daughter-in-law against her mother-in-law. A man's enemies will be those of his own household. 'Anyone who prefers father or mother to me is not worthy of me. Anyone who prefers son or daughter to me is not worthy of me. Anyone who does not take his cross and follow in my footsteps is not worthy of me. Anyone who finds his life will lose it; anyone who loses his life for my sake will find it. 'Anyone who welcomes you welcomes me; and those who welcome me welcome the one who sent me. 'Anyone who welcomes a prophet will have a prophet's reward; and anyone who welcomes a holy man will have a holy man's reward. 'If anyone gives so much as a cup of cold water to one of these little ones because he is a disciple, then I tell you solemnly, he will most certainly not lose his reward.' When Jesus had finished instructing his twelve disciples he moved on from there to teach and preach in their towns.`
    },
    copyright: {
      text: 'Copyright © 1996–2025 Universalis Publishing Limited'
    }
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockReadings);
    }, 1000);
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