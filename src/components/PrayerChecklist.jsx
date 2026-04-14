import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Clock, Moon, Sun, MapPin, BookOpen, Plus, Settings, CheckCircle, Share2, Trash2, Heart, Info, ArrowUp, ChevronDown, Wifi, WifiOff, Download, RotateCcw } from 'lucide-react';
import { ICONS, DAILY_TAB_IDS, OFFLINE_PRAYER_TIMES, PRAYER_CHECKLIST, I18N, azkar, defaultCustomDuas, tabConfig } from '../utils/constants';
import { showToast, readJson, readDailyState, dateKey, isSameDay, isYesterday, subscribeToToasts, toastQueue } from '../utils/helpers';

const PrayerChecklist = ({ checklist, onToggle, language, t }) => (
    <div className="mt-8 p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/50 shadow-lg">
        <div className="flex items-center justify-between mb-4">
            <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white">{t.prayerChecklistTitle}</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">{t.prayerChecklistNote}</p>
            </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {PRAYER_CHECKLIST.map((prayer) => {
                const checked = Boolean(checklist[prayer.id]);
                return (
                    <button
                        key={prayer.id}
                        onClick={() => onToggle(prayer.id)}
                        className={`p-3 rounded-2xl border text-sm font-bold transition-all ${
                            checked
                                ? "bg-[#423E87] text-white border-[#423E87] shadow-md shadow-[#423E87]/20"
                                : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                        }`}
                    >
                        {language === "en" ? prayer.en : prayer.ar}
                    </button>
                );
            })}
        </div>
    </div>
);

export default PrayerChecklist;