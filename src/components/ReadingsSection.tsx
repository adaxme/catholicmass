import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Calendar, AlertCircle } from 'lucide-react';
import { ReadingData } from '../types';
import { fetchReadings, formatDate } from '../utils/readingsApi';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../types';

interface ReadingsSectionProps {
  onReadingsChange: (readings: ReadingData | null) => void;
  language: Language;
}

export function ReadingsSection({ onReadingsChange, language }: ReadingsSectionProps) {
  const [readings, setReadings] = useState<ReadingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { t } = useTranslation(language);

  useEffect(() => {
    loadReadings(currentDate);
  }, [currentDate]);

  const loadReadings = async (date: Date) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchReadings(date);
      setReadings(data);
      onReadingsChange(data);
    } catch (err) {
      setError(t('failedToLoad') + ' readings. ' + t('pleaseRetry'));
      onReadingsChange(null);
      console.error('Error loading readings:', err);
    } finally {
      setLoading(false);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const formatReading = (text: string) => {
    return text.split('\n').map((line, index) => (
      <p key={index} className="mb-3 leading-relaxed">
        {line}
      </p>
    ));
  };

  if (loading) {
    return (
      <div className="bg-slate-900 rounded-xl shadow-2xl p-8 border border-slate-700">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
          <span className="ml-3 text-slate-300">{t('loadingReadings')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 rounded-xl shadow-2xl p-8 border border-slate-700">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-200 mb-2">{t('unableToLoadReadings')}</h3>
          <p className="text-slate-300 mb-4">{error}</p>
          <button
            onClick={() => loadReadings(currentDate)}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors border border-amber-500"
          >
            {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 rounded-full hover:bg-slate-700 transition-colors border border-slate-600"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold">{t('dailyMassReadings')}</h2>
            </div>
            <p className="text-slate-300">{formatDate(currentDate)}</p>
            {readings && <p className="text-slate-400 text-sm mt-1">{readings.day}</p>}
          </div>
          
          <button
            onClick={() => navigateDate('next')}
            className="p-2 rounded-full hover:bg-slate-700 transition-colors border border-slate-600"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {readings && (
          <>
            <div className="border-l-4 border-amber-500 pl-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-bold text-slate-200">{t('firstReading')}</h3>
              </div>
              <p className="text-sm font-medium text-amber-400 mb-3">{readings.Mass_R1.source}</p>
              <div className="text-slate-300 leading-relaxed">
                {formatReading(readings.Mass_R1.text)}
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-slate-200">{t('responsorialPsalm')}</h3>
              </div>
              <p className="text-sm font-medium text-purple-400 mb-3">{readings.Mass_Ps.source}</p>
              <div className="text-slate-300 leading-relaxed">
                {formatReading(readings.Mass_Ps.text)}
              </div>
            </div>

            {readings.Mass_R2 && (
              <div className="border-l-4 border-green-500 pl-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-bold text-slate-200">{t('secondReading')}</h3>
                </div>
                <p className="text-sm font-medium text-green-400 mb-3">{readings.Mass_R2.source}</p>
                <div className="text-slate-300 leading-relaxed">
                  {formatReading(readings.Mass_R2.text)}
                </div>
              </div>
            )}

            <div className="border-l-4 border-rose-500 pl-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-rose-600" />
                <h3 className="text-lg font-bold text-slate-200">{t('gospelAcclamation')}</h3>
              </div>
              <p className="text-sm font-medium text-rose-400 mb-3">{readings.Mass_GA.source}</p>
              <div className="text-slate-300 leading-relaxed">
                {formatReading(readings.Mass_GA.text)}
              </div>
            </div>

            <div className="border-l-4 border-red-600 pl-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-bold text-slate-200">{t('gospel')}</h3>
              </div>
              <p className="text-sm font-medium text-red-400 mb-3">{readings.Mass_G.source}</p>
              <div className="text-slate-300 leading-relaxed">
                {formatReading(readings.Mass_G.text)}
              </div>
            </div>

            <div className="text-xs text-slate-500 border-t border-slate-700 pt-4">
              {readings.copyright.text}
            </div>
          </>
        )}
      </div>
    </div>
  );
}