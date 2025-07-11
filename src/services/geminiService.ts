import { GoogleGenerativeAI } from '@google/generative-ai';
import { ReadingData, Language } from '../types';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    this.initializeAPI();
  }

  private initializeAPI() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file');
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    } catch (error) {
      console.error('Failed to initialize Gemini API:', error);
    }
  }

  async generateHomily(readings: ReadingData, language: Language = 'en'): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini API not initialized. Please check your API key.');
    }

    const languageNames = {
      en: 'English',
      es: 'Spanish',
      fr: 'French',
      la: 'Latin',
      pt: 'Portuguese',
      de: 'German'
    };

    const prompt = `
You are a Catholic priest preparing a homily for Mass. Based on the following readings, write a thoughtful, inspiring homily in ${languageNames[language]} that is EXACTLY 50% theological reflection and 50% practical life application.

Structure your homily as follows:
1. Opening greeting and brief context (2-3 sentences)
2. THEOLOGICAL SECTION (50% of content):
   - Deep scriptural analysis and interpretation
   - Connection to Catholic doctrine and tradition
   - Historical and biblical context
   - Theological insights from Church Fathers or saints
3. PRACTICAL SECTION (50% of content):
   - Real-world applications for modern Catholics
   - Concrete examples from daily life
   - Actionable steps for spiritual growth
   - How to live these teachings in work, family, and community
4. Closing call to action and blessing

Keep the total length to 300-350 words. Make it accessible yet profound.

Today's Readings:

FIRST READING (${readings.Mass_R1.source}):
${readings.Mass_R1.text}

PSALM (${readings.Mass_Ps.source}):
${readings.Mass_Ps.text}

${readings.Mass_R2 ? `SECOND READING (${readings.Mass_R2.source}):
${readings.Mass_R2.text}` : ''}

GOSPEL ACCLAMATION (${readings.Mass_GA.source}):
${readings.Mass_GA.text}

GOSPEL (${readings.Mass_G.source}):
${readings.Mass_G.text}

Begin with "Dear brothers and sisters in Christ" (or equivalent greeting in ${languageNames[language]}).
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating homily:', error);
      throw error instanceof Error ? error : new Error('Failed to generate homily. Please try again.');
    }
  }

  async getSaintOfTheDay(date: Date): Promise<{ name: string; feast: string; biography: string }> {
    if (!this.model) {
      throw new Error('Gemini API not initialized. Please check your API key.');
    }

    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const day = date.getDate();
    const dateString = `${month} ${day}`;

    const prompt = `
You are a Catholic scholar with access to comprehensive information about Catholic saints and their feast days. 

For ${dateString}, please provide information about the primary Catholic saint celebrated on this date. If there are multiple saints, choose the most significant one according to the Roman Catholic liturgical calendar.

Please research and provide:
1. The saint's full name and title
2. Their feast day designation (Memorial, Optional Memorial, Feast, Solemnity, etc.)
3. A compelling 150-200 word biography that includes:
   - Their life dates and location
   - Their path to sainthood
   - Their major contributions to the Church
   - Why they are remembered and venerated
   - Their patronage (what they are patron saint of)
   - Any miracles or notable spiritual gifts

Format your response as JSON:
{
  "name": "Saint's Full Name",
  "feast": "Type of liturgical celebration",
  "biography": "Complete biography text here"
}

If no major saint is celebrated on ${dateString}, provide information about a notable saint whose feast is close to this date, and mention that in the feast field.

Please ensure all information is historically accurate and reflects official Catholic teaching and tradition.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.warn('Could not parse JSON response, using fallback parsing');
      }
      
      // Fallback parsing if JSON parsing fails
      const lines = text.split('\n').filter(line => line.trim());
      return {
        name: lines.find(line => line.includes('name') || line.includes('Name'))?.replace(/[^a-zA-Z\s,.-]/g, '').trim() || 'Saint of the Day',
        feast: lines.find(line => line.includes('feast') || line.includes('Feast'))?.replace(/[^a-zA-Z\s,.-]/g, '').trim() || 'Daily Commemoration',
        biography: text.replace(/[{}"\[\]]/g, '').replace(/name:|feast:|biography:/gi, '').trim() || 'A holy person who dedicated their life to serving God and others.'
      };
    } catch (error) {
      console.error('Error fetching saint information:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch saint information. Please try again.');
    }
  }

  async translateText(text: string, targetLanguage: Language): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini API not initialized. Please check your API key.');
    }

    const languageNames = {
      en: 'English',
      es: 'Spanish',
      fr: 'French',
      la: 'Latin',
      pt: 'Portuguese',
      de: 'German'
    };

    const prompt = `
Translate the following Catholic homily text to ${languageNames[targetLanguage]}. 
Maintain the spiritual tone, theological accuracy, and reverent language appropriate for Catholic liturgy.
Preserve any biblical references and Catholic terminology correctly.
Keep the same structure and formatting.

Text to translate:
${text}

Please provide only the translation without any additional commentary.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error translating text:', error);
      throw error instanceof Error ? error : new Error('Failed to translate text. Please try again.');
    }
  }

  isConfigured(): boolean {
    return this.model !== null;
  }
}

export const geminiService = new GeminiService();