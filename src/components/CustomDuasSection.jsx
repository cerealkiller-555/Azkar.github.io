import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Clock, Moon, Sun, MapPin, BookOpen, Plus, Settings, CheckCircle, Share2, Trash2, Heart, Info, ArrowUp, ChevronDown, Wifi, WifiOff, Download, RotateCcw } from 'lucide-react';
import { ICONS, DAILY_TAB_IDS, OFFLINE_PRAYER_TIMES, PRAYER_CHECKLIST, I18N, azkar, defaultCustomDuas, tabConfig } from '../utils/constants';
import { showToast, readJson, readDailyState, dateKey, isSameDay, isYesterday, subscribeToToasts, toastQueue } from '../utils/helpers';

const CustomDuasSection = ({ customDuas, newDua, setNewDua, addCustomDua, deleteCustomDua, t }) => (
    <div className="animate-slide-up space-y-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl">
            <h2 className="text-2xl font-black mb-1 flex items-center gap-3">
                <Heart className="w-7 h-7 text-rose-300" />
                {t.customTitle}
            </h2>
            <p className="opacity-70 text-sm font-medium">{t.customSubtitle}</p>
        </div>

        <div className="flex gap-2 bg-white dark:bg-slate-800/90 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50 p-1.5">
            <input
                type="text"
                value={newDua}
                onChange={(event) => setNewDua(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && addCustomDua()}
                placeholder={t.customPlaceholder}
                className="flex-1 px-5 py-3 bg-transparent text-slate-800 dark:text-white text-base focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                id="custom-dua-input"
            />
            <button
                onClick={addCustomDua}
                className="px-6 py-3 bg-indigo-600 text-white font-black text-sm rounded-xl hover:bg-indigo-500 shadow-md transition-all active:scale-95"
                id="add-dua-btn"
                aria-label={t.addDua}
            >
                <Plus className="w-5 h-5" />
            </button>
        </div>

        <div className="space-y-3 stagger-children">
            {!customDuas.length && (
                <div className="py-12 text-center">
                    <Heart className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-400 dark:text-slate-500 font-bold">{t.noDuas}</p>
                    <p className="text-sm text-slate-300 dark:text-slate-600">{t.noDuasHint}</p>
                </div>
            )}

            {customDuas.map((dua, index) => (
                <div key={`${dua}-${index}`} className="group p-5 bg-white dark:bg-slate-800/90 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700/50 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between gap-4">
                        <p className="text-lg md:text-xl font-amiri text-slate-800 dark:text-slate-100 leading-relaxed flex-1">{dua}</p>
                        <button
                            onClick={() => deleteCustomDua(index)}
                            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                            aria-label={t.deleteDua}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default CustomDuasSection;