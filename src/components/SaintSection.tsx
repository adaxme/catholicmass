import React, { useState, useEffect } from 'react';
import { Crown, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { Saint } from '../types';
import { geminiService } from '../services/geminiService';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../types';

interface SaintSectionProps {
  date: Date;
  language: Language;
}

export function SaintSection({ date, language }: SaintSectionProps) {
  const [saint, setSaint] = useState<Saint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation(language);

  useEffect(() => {
    loadSaintOfTheDay();
  }, [date]);

  const loadSaintOfTheDay = async () => {
    setLoading(true);
    setError(null);

    try {
      const saintData = await geminiService.getSaintOfTheDay(date);
      setSaint(saintData);
    } catch (err) {
      setError(t('failedToLoad') + ' saint information');
      console.error('Error loading saint:', err);
      // Fallback saint data
      setSaint({
        name: t('saintOfTheDay'),
        feast: 'Daily Commemoration',
        biography: 'Today we remember all the saints who have gone before us, marked with the sign of faith.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="w-6 h-6 text-amber-600" />
          <h2 className="text-xl font-bold text-slate-800">{t('saintOfTheDay')}</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
          <span className="ml-3 text-amber-700">{t('loadingSaint')}</span>
        </div>
      </div>
    );
  }

  if (error && !saint) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="w-6 h-6 text-amber-600" />
          <h2 className="text-xl font-bold text-slate-800">{t('saintOfTheDay')}</h2>
        </div>
        <div className="text-center py-6">
          <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-3" />
          <p className="text-amber-700 mb-4">{error}</p>
          <button
            onClick={loadSaintOfTheDay}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Crown className="w-6 h-6 text-amber-600" />
          <h2 className="text-xl font-bold text-slate-800">{t('saintOfTheDay')}</h2>
        </div>
        <button
          onClick={loadSaintOfTheDay}
          disabled={loading}
          className="p-2 rounded-full hover:bg-amber-100 transition-colors disabled:opacity-50"
          title={t('refreshSaint')}
        >
          <RefreshCw className={`w-4 h-4 text-amber-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {saint && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-amber-800 mb-1">{saint.name}</h3>
            <p className="text-sm text-amber-700 font-medium">{saint.feast}</p>
          </div>
          
          <div className="prose prose-sm max-w-none">
            <p className="text-slate-700 leading-relaxed">{saint.biography}</p>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-amber-600">
            <Calendar className="w-4 h-4" />
            <span>
              {date.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}