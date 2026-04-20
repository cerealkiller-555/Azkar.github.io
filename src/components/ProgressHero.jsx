import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Clock, Moon, Sun, MapPin, BookOpen, Plus, Settings, CheckCircle, Share2, Trash2, Heart, Info, ArrowUp, ChevronDown, Wifi, WifiOff, Download, RotateCcw } from 'lucide-react';
import { ICONS, DAILY_TAB_IDS, OFFLINE_PRAYER_TIMES, PRAYER_CHECKLIST, I18N, azkar, defaultCustomDuas, tabConfig } from '../utils/constants';
import { showToast, readJson, readDailyState, dateKey, isSameDay, isYesterday, subscribeToToasts, toastQueue } from '../utils/helpers';

const ProgressHero = ({ activeTab, progressPercentage, completedCount, totalCount, resetAllProgress, t, userProfile, language }) => {
    if (!DAILY_TAB_IDS.includes(activeTab)) {
        return null;
    }

    const themeConfig = {
        morning: {
            gradient: "from-[#FAD961] via-[#D4A76A] to-[#B18F67]",
            icon: Sun,
            label: t.progressTitleMorning,
            accent: "bg-white/30"
        },
        evening: {
            gradient: "from-[#423E87] via-[#332F6A] to-[#2E2A5E]",
            icon: Moon,
            label: t.progressTitleEvening,
            accent: "bg-[#D4A76A]/20"
        },
        sleeping: {
            gradient: "from-[#0f172a] via-[#1e293b] to-[#423E87]",
            icon: Moon,
            label: t.progressTitleSleeping,
            accent: "bg-white/10"
        },
        prayer_azkar: {
            gradient: "from-[#B18F67] via-[#D4A76A] to-[#EADEC9]",
            icon: BookOpen,
            label: t.progressTitlePrayer,
            accent: "bg-black/5"
        }
    }[activeTab] || {
        gradient: "from-[#D4A76A] to-[#B18F67]",
        icon: Sun,
        label: t.progressTitleMorning,
        accent: "bg-white/20"
    };

    const Icon = themeConfig.icon;

    const greeting = userProfile?.name
        ? (language === "en" ? `Welcome, ${userProfile.name}` : `أهلاً بك، ${userProfile.name}`)
        : null;

    return (
        <div className={`mb-10 p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br ${themeConfig.gradient} transition-all duration-700 shadow-2xl relative overflow-hidden text-white`}>
            {/* Animated Decorative Shapes */}
            <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-black/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="absolute top-0 right-0 p-8 opacity-[0.12] float-slow">
                <Icon className="w-48 h-48" />
            </div>

            <div className="relative z-10 flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        {greeting && (
                            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] mb-3 border border-white/10">
                                {greeting}
                            </span>
                        )}
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">{themeConfig.label}</h2>
                        <p className="text-white/80 text-sm md:text-lg font-medium max-w-md">
                            {t.progressText} <span className="text-white font-black">{completedCount}</span> {t.progressOf} <span className="text-white font-black">{totalCount}</span> {t.progressAzkar}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center bg-white/15 backdrop-blur-xl px-8 py-5 rounded-3xl border border-white/20 shadow-xl min-w-[120px]">
                            <span className="text-4xl md:text-5xl font-black block leading-none mb-1 tracking-tighter">{progressPercentage}%</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.15em] opacity-80">{t.progressLabel}</span>
                        </div>
                        
                        {progressPercentage > 0 && (
                            <button
                                onClick={resetAllProgress}
                                className="group p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-all active:scale-90"
                                title={t.resetProgress}
                            >
                                <RotateCcw className="w-6 h-6 group-hover:rotate-[-45deg] transition-transform duration-300" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Enhanced Progress Bar */}
                <div className="space-y-3">
                    <div className="h-4 rounded-full bg-black/10 backdrop-blur-sm p-1 border border-white/5">
                        <div 
                            className="h-full rounded-full bg-gradient-to-r from-white/60 to-white shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-1000 ease-out" 
                            style={{ width: `${progressPercentage}%` }} 
                        />
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-white/50 px-2">
                        <span>{t.beginning || "Start"}</span>
                        <span>{t.completed || "Done"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressHero;