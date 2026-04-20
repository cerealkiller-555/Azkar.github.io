import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Clock, Moon, Sun, MapPin, BookOpen, Plus, Settings, CheckCircle, Share2, Trash2, Heart, Info, ArrowUp, ChevronDown, Wifi, WifiOff, Download, RotateCcw } from 'lucide-react';
import { ICONS, DAILY_TAB_IDS, OFFLINE_PRAYER_TIMES, PRAYER_CHECKLIST, I18N, azkar, defaultCustomDuas, tabConfig } from '../utils/constants';
import { showToast, readJson, readDailyState, dateKey, isSameDay, isYesterday, subscribeToToasts, toastQueue } from '../utils/helpers';

const StreakBanner = ({ streakCount, goals, t }) => {
    return (
        <div className="mb-8 p-6 md:p-7 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/50 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-1">{t.streakTitle}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{t.streakSubtitle}</p>
                </div>
                <div className="flex items-center gap-3 bg-[#D4A76A]/10 dark:bg-[#D4A76A]/20 px-4 py-2 rounded-2xl border border-[#D4A76A]/20 dark:border-[#D4A76A]/30">
                    <span className="text-2xl font-black text-[#D4A76A] dark:text-[#D4A76A]">{streakCount}</span>
                    <span className="text-xs font-bold text-[#B18F67]">{t.streakDays}</span>
                </div>
            </div>

            <div className="mt-5">
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-widest">{t.goalsTitle}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {goals.map((goal) => (
                        <div
                            key={goal.id}
                            className={`p-3 rounded-2xl border flex items-center gap-3 text-sm font-bold transition-all ${
                                goal.completed
                                    ? "bg-[#D4A76A]/10 dark:bg-[#D4A76A]/20 border-[#D4A76A]/30 dark:border-[#D4A76A]/40 text-[#423E87] dark:text-[#D4A76A]"
                                    : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                            }`}
                        >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                goal.completed ? "bg-[#D4A76A] text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-400"
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