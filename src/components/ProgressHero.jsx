import React from 'react';
import { Sun, Moon, BookOpen, RotateCcw, Target } from 'lucide-react';
import { DAILY_TAB_IDS } from '../utils/constants';

const ProgressHero = ({ activeTab, progressPercentage, completedCount, totalCount, resetAllProgress, t, userProfile, language }) => {
    if (!DAILY_TAB_IDS.includes(activeTab)) return null;

    const theme = {
        morning: {
            gradient: "from-[#FAD961] to-[#D4A76A]",
            icon: Sun,
            label: t.progressTitleMorning,
            accent: "rgba(255, 255, 255, 0.2)",
            text: "text-slate-900"
        },
        evening: {
            gradient: "from-[#423E87] to-[#2E2A5E]",
            icon: Moon,
            label: t.progressTitleEvening,
            accent: "rgba(212, 167, 106, 0.2)",
            text: "text-white"
        },
        sleeping: {
            gradient: "from-[#1E293B] to-[#0F172A]",
            icon: Moon,
            label: t.progressTitleSleeping,
            accent: "rgba(255, 255, 255, 0.1)",
            text: "text-white"
        },
        prayer_azkar: {
            gradient: "from-[#D4A76A] to-[#B18F67]",
            icon: BookOpen,
            label: t.progressTitlePrayer,
            accent: "rgba(0, 0, 0, 0.1)",
            text: "text-slate-900"
        }
    }[activeTab];

    const Icon = theme.icon;

    return (
        <div className={`progress-hero bg-gradient-to-br ${theme.gradient} ${theme.text} shadow-2xl relative animate-scale-in`}>
            {/* Decorative background Icon */}
            <Icon className="absolute top-0 right-0 w-48 h-48 opacity-10 -mr-10 -mt-10 rotate-12" />
            
            <div className="relative z-10 flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-black/10 border border-white/10`}>
                            <Target className="w-3 h-3" />
                            {userProfile?.name ? (language === "en" ? `Goals for ${userProfile.name}` : `أهداف ${userProfile.name}`) : t.goalsTitle}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter">{theme.label}</h2>
                        <p className="text-sm md:text-lg font-bold opacity-80">
                            {t.progressText} <span className="font-black underline underline-offset-4">{completedCount}</span> {t.progressOf} <span className="font-black">{totalCount}</span> {t.progressAzkar}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-black/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 flex flex-col items-center">
                            <span className="text-4xl font-black">{progressPercentage}%</span>
                            <span className="text-[10px] font-black uppercase tracking-wider opacity-60">{t.progressLabel}</span>
                        </div>
                        {progressPercentage > 0 && (
                            <button onClick={resetAllProgress} className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all active:scale-90">
                                <RotateCcw className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="h-4 w-full bg-black/10 rounded-full overflow-hidden border border-white/5">
                        <div 
                            className="h-full bg-white transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressHero;
