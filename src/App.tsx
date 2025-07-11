import React, { useState } from 'react';
import { Cross, Heart } from 'lucide-react';
import { ReadingData, Language } from './types';
import { ReadingsSection } from './components/ReadingsSection';
import { SaintSection } from './components/SaintSection';
import { HomilySection } from './components/HomilySection';
import { LanguageSelector } from './components/LanguageSelector';
import { useTranslation } from './hooks/useTranslation';

function App() {
  const [readings, setReadings] = useState<ReadingData | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [currentDate] = useState(new Date());
  const { t } = useTranslation(selectedLanguage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Cross className="w-8 h-8 text-amber-200" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{t('appTitle')}</h1>
                <p className="text-blue-100 mt-1">
                  {t('appSubtitle')}
                </p>
              </div>
            </div>
            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Readings */}
          <div>
            <ReadingsSection onReadingsChange={setReadings} language={selectedLanguage} />
          </div>

          {/* Right Column - Saint and Quick Stats */}
          <div className="space-y-8">
            <SaintSection date={currentDate} language={selectedLanguage} />
            
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('todaysLiturgy')}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">{t('liturgicalSeason')}</span>
                  <span className="text-slate-800 font-medium">{t('ordinaryTime')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">{t('liturgicalColor')}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-slate-800 font-medium">{t('green')}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">{t('rank')}</span>
                  <span className="text-slate-800 font-medium">{t('weekday')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Homily and Saint Side by Side */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <HomilySection 
              readings={readings} 
              selectedLanguage={selectedLanguage}
            />
          </div>
          <div>
            <SaintSection date={currentDate} language={selectedLanguage} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-slate-300">{t('madeWithLove')}</span>
            </div>
            <p className="text-slate-400 text-sm">
              {t('readingsCourtesy')}
            </p>
            <p className="text-slate-500 text-xs mt-2">
              {t('scriptureQuote')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;