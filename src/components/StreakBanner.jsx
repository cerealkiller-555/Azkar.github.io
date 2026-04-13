import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Clock, Moon, Sun, MapPin, BookOpen, Plus, Settings, CheckCircle, Share2, Trash2, Heart, Info, ArrowUp, ChevronDown, Wifi, WifiOff, Download, RotateCcw } from 'lucide-react';
import { ICONS, DAILY_TAB_IDS, OFFLINE_PRAYER_TIMES, PRAYER_CHECKLIST, I18N, azkar, defaultCustomDuas, tabConfig } from '../utils/constants';
import { showToast, readJson, readDailyState, dateKey, isSameDay, isYesterday, subscribeToToasts, toastQueue } from '../utils/helpers';

const StreakBanner = ({ streakCount, goals, t }) => {
    return (
        <div className="mb-8 p-6 md:p-7 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/50 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mb-1">{t.streakTitle}</h3>
                    <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">{t.streakSubtitle}</p>
                </div>
                <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{streakCount}</span>
                    <span className="text-xs font-bold text-emerald-500">{t.streakDays}</span>
                </div>
            </div>

            <div className="mt-5">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-widest">{t.goalsTitle}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {goals.map((goal) => (
                        <div
                            key={goal.id}
                            className={`p-3 rounded-2xl border flex items-center gap-3 text-sm font-bold transition-all ${
                                goal.completed
                                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200/70 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300"
                                    : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                            }`}
                        >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                goal.completed ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                            }`}>
                                <CheckCircle className="w-4 h-4" />
                            </span>
                            <span>{goal.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StreakBanner;