import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Clock, Moon, Sun, MapPin, BookOpen, Plus, Settings, CheckCircle, Share2, Trash2, Heart, Info, ArrowUp, ChevronDown, Wifi, WifiOff, Download, RotateCcw } from 'lucide-react';
import { ICONS, DAILY_TAB_IDS, OFFLINE_PRAYER_TIMES, PRAYER_CHECKLIST, I18N, azkar, defaultCustomDuas, tabConfig } from '../utils/constants';
import { showToast, readJson, readDailyState, dateKey, isSameDay, isYesterday, subscribeToToasts, toastQueue } from '../utils/helpers';

const ProgressHero = ({ activeTab, progressPercentage, completedCount, totalCount, resetAllProgress, t }) => {
    if (!DAILY_TAB_IDS.includes(activeTab)) {
        return null;
    }

    const themeClass = activeTab === "morning"
        ? "from-amber-400 to-orange-600"
        : activeTab === "evening"
            ? "from-indigo-600 to-purple-800"
            : activeTab === "sleeping"
                ? "from-slate-800 to-slate-950"
                : "from-emerald-600 to-teal-800";

    const title = activeTab === "morning"
        ? t.progressTitleMorning
        : activeTab === "evening"
            ? t.progressTitleEvening
            : activeTab === "sleeping"
                ? t.progressTitleSleeping
                : t.progressTitlePrayer;

    const Icon = activeTab === "morning"
        ? Sun
        : activeTab === "evening" || activeTab === "sleeping"
            ? Moon
            : BookOpen;

    return (
        <div className={`mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-br transition-all duration-500 shadow-2xl relative overflow-hidden ${themeClass} text-white`}>
            <div className="absolute top-0 right-0 p-6 opacity-[0.08] float-slow">
                <Icon className="w-40 h-40" />
            </div>

            <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-black mb-2">{title}</h2>
                        <p className="text-white/70 text-sm md:text-base font-medium">
                            {t.progressText} {completedCount} {t.progressOf} {totalCount} {t.progressAzkar} • {progressPercentage}%
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20 text-center">
                            <span className="text-2xl md:text-3xl font-black block leading-none mb-0.5">{progressPercentage}%</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{t.progressLabel}</span>
                        </div>
                        {progressPercentage > 0 && (
                            <button
                                onClick={resetAllProgress}
                                className="p-2.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-white/80 hover:text-white hover:bg-white/25 transition-all active:scale-95"
                                title={t.resetProgress}
                                aria-label={t.resetProgress}
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-4 h-2 rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full rounded-full bg-white/80 transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }} />
                </div>
            </div>
        </div>
    );
};

export default ProgressHero;