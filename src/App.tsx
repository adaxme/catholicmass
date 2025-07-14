import React, { useState, useEffect } from 'react';
import { Cross, Heart, Book, Star, Lightbulb, Globe, Calendar } from 'lucide-react';
import { ReadingData, Language, Saint, Homily } from './types';
import { fetchReadings } from './utils/readingsApi';
import { geminiService } from './services/geminiService';
import { languages } from './utils/languages';

function App() {
  const [readings, setReadings] = useState<ReadingData | null>(null);
  const [saint, setSaint] = useState<Saint | null>(null);
  const [homily, setHomily] = useState<Homily | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [loadingReadings, setLoadingReadings] = useState(true);
  const [loadingSaint, setLoadingSaint] = useState(true);
  const [loadingHomily, setLoadingHomily] = useState(false);
  const [currentDate] = useState(new Date());

  useEffect(() => {
    loadReadings();
    loadSaintOfTheDay();
  }, []);

  useEffect(() => {
    if (readings && !homily && !loadingHomily) {
      generateHomily();
    }
  }, [readings]);

  const loadReadings = async () => {
    try {
      const data = await fetchReadings();
      setReadings(data);
    } catch (error) {
      console.error('Error loading readings:', error);
    } finally {
      setLoadingReadings(false);
    }
  };

  const loadSaintOfTheDay = async () => {
    try {
      const saintData = await geminiService.getSaintOfTheDay(currentDate);
      setSaint(saintData);
    } catch (error) {
      setSaint({
        name: 'Saint of the Day',
        feast: 'Daily Commemoration',
        biography: 'Today we remember all the saints who have gone before us.',
      });
    } finally {
      setLoadingSaint(false);
    }
  };

  const generateHomily = async () => {
    if (!readings) return;

    setLoadingHomily(true);
    try {
      const content = await geminiService.generateHomily(readings, selectedLanguage);
      setHomily({
        content,
        language: selectedLanguage,
        generatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error generating homily:', error);
    } finally {
      setLoadingHomily(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="bg-amber-900/30 p-2 md:p-3 rounded-full border border-amber-700/50">
                <Cross className="w-6 h-6 md:w-8 md:h-8 text-amber-200" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold">Daily Mass Companion</h1>
                <p className="text-slate-300 mt-1 text-sm md:text-base">
                  Readings • Saints • AI Homilies
                </p>
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="relative">
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Date */}
          <div className="mt-4 flex items-center gap-2 text-slate-400">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formatDate(currentDate)}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Left Column - Readings */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 border-b border-slate-600">
                <div className="flex items-center gap-3">
                  <Book className="w-6 h-6 text-amber-400" />
                  <h2 className="text-xl font-bold text-slate-100">Daily Mass Readings</h2>
                </div>
              </div>
              
              <div className="p-6">
                {loadingReadings ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mb-4"></div>
                    <p className="text-slate-400">Loading readings...</p>
                  </div>
                ) : readings ? (
                  <div className="space-y-8">
                    {/* First Reading */}
                    <div className="border-l-4 border-amber-500 pl-6">
                      <h3 className="text-lg font-semibold text-slate-200 mb-2">First Reading</h3>
                      <p className="text-amber-400 font-medium mb-4">{readings.Mass_R1.source}</p>
                      <div className="reading-text text-slate-300 leading-relaxed whitespace-pre-line">
                        {readings.Mass_R1.text}
                      </div>
                    </div>

                    {/* Psalm */}
                    <div className="border-l-4 border-amber-500 pl-6">
                      <h3 className="text-lg font-semibold text-slate-200 mb-2">Responsorial Psalm</h3>
                      <p className="text-amber-400 font-medium mb-4">{readings.Mass_Ps.source}</p>
                      <div className="reading-text text-slate-300 leading-relaxed whitespace-pre-line">
                        {readings.Mass_Ps.text}
                      </div>
                    </div>

                    {/* Second Reading (if exists) */}
                    {readings.Mass_R2 && (
                      <div className="border-l-4 border-amber-500 pl-6">
                        <h3 className="text-lg font-semibold text-slate-200 mb-2">Second Reading</h3>
                        <p className="text-amber-400 font-medium mb-4">{readings.Mass_R2.source}</p>
                        <div className="reading-text text-slate-300 leading-relaxed whitespace-pre-line">
                          {readings.Mass_R2.text}
                        </div>
                      </div>
                    )}

                    {/* Gospel Acclamation */}
                    <div className="border-l-4 border-amber-500 pl-6">
                      <h3 className="text-lg font-semibold text-slate-200 mb-2">Gospel Acclamation</h3>
                      <p className="text-amber-400 font-medium mb-4">{readings.Mass_GA.source}</p>
                      <div className="reading-text text-slate-300 leading-relaxed whitespace-pre-line">
                        {readings.Mass_GA.text}
                      </div>
                    </div>

                    {/* Gospel */}
                    <div className="border-l-4 border-amber-500 pl-6">
                      <h3 className="text-lg font-semibold text-slate-200 mb-2">Gospel</h3>
                      <p className="text-amber-400 font-medium mb-4">{readings.Mass_G.source}</p>
                      <div className="reading-text text-slate-300 leading-relaxed whitespace-pre-line">
                        {readings.Mass_G.text}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-red-400">Failed to load readings. Please try again later.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Saint and Stats */}
          <div className="space-y-6 md:space-y-8">
            
            {/* Saint Section */}
            <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 border-b border-slate-600">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-amber-400" />
                  <h2 className="text-xl font-bold text-slate-100">Saint of the Day</h2>
                </div>
              </div>
              
              <div className="p-6">
                {loadingSaint ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mb-4"></div>
                    <p className="text-slate-400 text-sm">Loading saint...</p>
                  </div>
                ) : saint ? (
                  <div>
                    <h3 className="text-lg font-bold text-amber-400 mb-2">{saint.name}</h3>
                    <p className="text-amber-300 font-medium mb-4 text-sm">{saint.feast}</p>
                    <p className="text-slate-300 leading-relaxed text-sm">{saint.biography}</p>
                  </div>
                ) : (
                  <p className="text-red-400 text-sm">Failed to load saint information.</p>
                )}
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="bg-slate-900 rounded-xl shadow-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Today's Liturgy</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Liturgical Season</span>
                  <span className="text-slate-200 font-medium text-sm">Ordinary Time</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Liturgical Color</span>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-slate-200 font-medium text-sm">Green</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Rank</span>
                  <span className="text-slate-200 font-medium text-sm">Weekday</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Homily Section - Full Width Below */}
        <div className="mt-6 md:mt-8">
          <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 border-b border-slate-600">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-6 h-6 text-amber-400" />
                <h2 className="text-xl font-bold text-slate-100">AI-Generated Homily</h2>
              </div>
            </div>
            
            <div className="p-6">
              {loadingHomily ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mb-4"></div>
                  <p className="text-slate-400">Generating homily...</p>
                </div>
              ) : homily ? (
                <div className="prose prose-invert max-w-none">
                  <div className="text-slate-200 leading-relaxed whitespace-pre-line">
                    {homily.content}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-red-400">Failed to generate homily. Please try again later.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-16 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-amber-400" />
              <span className="text-slate-300">Made with love for the Catholic community</span>
            </div>
            <p className="text-slate-400 text-sm">
              Readings courtesy of Universalis Publishing Limited
            </p>
            <p className="text-slate-500 text-xs mt-2">
              "Your word is a lamp to my feet and a light to my path." - Psalm 119:105
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;