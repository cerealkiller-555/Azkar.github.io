import React, { useRef, useEffect, useState } from 'react';
import { Share2, CheckCircle, Info, ChevronDown, BookOpen } from 'lucide-react';
import { showToast } from '../utils/helpers';

const ZikrCard = ({
    zikr,
    index,
    uniqueId,
    t,
    isCompleted,
    progress,
    isExpanded,
    progressPct,
    isAnimating,
    isHighlighted,
    language,
    onToggleBenefit,
    onToggleComplete,
    onProgress
}) => {
    const buttonRef = useRef(null);
    const cardRef = useRef(null);
    const [showCelebration, setShowCelebration] = useState(false);

    const isEn = language === "en";
    const title = isEn && zikr.titleEn ? zikr.titleEn : zikr.title;
    const benefit = isEn && zikr.benefitEn ? zikr.benefitEn : zikr.benefit;
    const meaning = isEn && zikr.meaningEn ? zikr.meaningEn : zikr.meaning;
    const source = isEn && zikr.sourceEn ? zikr.sourceEn : zikr.source;

    // Celebration animation when completed
    useEffect(() => {
        if (isCompleted && progress >= zikr.count && !showCelebration) {
            setShowCelebration(true);
            const timer = setTimeout(() => setShowCelebration(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isCompleted, progress, zikr.count]);

    return (
        <div
            id={`zikr-${uniqueId}`}
            ref={cardRef}
            className={`zikr-card animate-slide-up ${isCompleted ? 'completed border-emerald-500/30' : 'glass-card'} ${isHighlighted ? 'is-highlighted' : ''}`}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Celebration overlay */}
            {showCelebration && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                    <div className="absolute inset-0 bg-emerald-500/10 animate-pulse rounded-[32px]" />
                </div>
            )}

            <div className="flex flex-col gap-6">
                {/* Header row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black transition-all duration-500 ${
                            isCompleted
                                ? "bg-gradient-to-br from-[#10B981] to-[#059669] text-white rotate-[360deg] shadow-lg shadow-emerald-500/20"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                        }`}>
                            {isCompleted ? <CheckCircle className="w-6 h-6" /> : index + 1}
                        </div>
                        {title && (
                            <h3 className="text-xl font-outfit font-black text-slate-900 dark:text-[#D4A76A] tracking-tight">{title}</h3>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                const shareText = `${title ? `${title}\n` : ""}${zikr.text}\n\nSent from ${t.appName}`;
                                if (navigator.share) {
                                    navigator.share({ title: t.appName, text: shareText });
                                } else {
                                    navigator.clipboard.writeText(shareText);
                                    showToast(t.shareCopy);
                                }
                            }}
                            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:text-[#D4A76A] transition-all hover:bg-[#D4A76A]/10 active:scale-95"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onToggleComplete}
                            className={`p-3 rounded-2xl transition-all active:scale-95 ${
                                isCompleted
                                    ? "bg-[#10B981] text-white shadow-lg shadow-emerald-500/30"
                                    : "bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                            }`}
                        >
                            <CheckCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Arabic text - Maximum Readability */}
                <div className="relative py-2">
                    <p className={`text-arabic font-amiri text-3xl md:text-5xl leading-[1.8] transition-all duration-700 ${
                        isCompleted 
                            ? "text-slate-400 dark:text-slate-500 opacity-60 scale-95"
                            : "text-premium dark:text-white"
                    }`}>
                        {zikr.text}
                    </p>
                </div>

                {/* Interaction - Counter Area */}
                <div className="flex flex-col gap-6">
                    <button
                        ref={buttonRef}
                        onClick={(event) => onProgress(event, buttonRef)}
                        disabled={isCompleted}
                        className={`counter-btn relative group h-20 rounded-[28px] overflow-hidden shadow-xl transition-all active:scale-[0.97] ${
                            isCompleted
                                ? "bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50 cursor-default shadow-none"
                                : "bg-gradient-to-r from-[#423E87] to-[#2E2A5E] hover:shadow-2xl hover:shadow-[#423E87]/20"
                        }`}
                    >
                        {/* Progress Fill */}
                        {!isCompleted && (
                            <div 
                                className="progress-fill z-0" 
                                style={{ width: `${progressPct}%`, background: 'rgba(212, 167, 106, 0.4)' }} 
                            />
                        )}

                        <div className="relative z-10 flex items-center justify-center gap-6">
                            {isCompleted ? (
                                <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-black italic">
                                    <CheckCircle className="w-7 h-7" />
                                    <span className="text-xl uppercase tracking-widest">{t.doneLabel}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-6 text-white">
                                    <span className={`text-5xl font-black tabular-nums transition-transform duration-300 ${isAnimating ? "scale-125" : ""}`}>
                                        {progress}
                                    </span>
                                    <div className="h-10 w-[2px] bg-white/10 rounded-full" />
                                    <div className="flex flex-col items-start leading-none opacity-80">
                                        <span className="text-[10px] font-black uppercase tracking-wider mb-1">{t.requiredLabel}</span>
                                        <span className="text-xl font-black">{zikr.count}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </button>

                    {/* Metadata Toggle */}
                    {(benefit || source || meaning) && (
                        <div className="pt-2">
                            <button
                                onClick={onToggleBenefit}
                                className="flex items-center justify-between w-full py-3 px-1 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#423E87] dark:hover:text-[#D4A76A] transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Info className="w-4 h-4" />
                                    <span>{isExpanded ? t.benefitHide : t.benefitShow}</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${isExpanded ? "rotate-180" : ""}`} />
                            </button>

                            {isExpanded && (
                                <div className="mt-4 space-y-4 animate-slide-up origin-top">
                                    {meaning && (
                                        <div className="p-6 rounded-[24px] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-1.5 h-full bg-[#D4A76A]/40 group-hover:bg-[#D4A76A] transition-colors" />
                                            <span className="block text-[10px] font-black uppercase tracking-widest text-[#D4A76A] mb-3">{t.meaningTitle}</span>
                                            <p className="text-[15px] text-slate-800 dark:text-slate-200 leading-[1.8] font-medium">{meaning}</p>
                                        </div>
                                    )}
                                    {benefit && (
                                        <div className="p-6 rounded-[24px] bg-indigo-50/30 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-900/20">
                                            <p className="text-[15px] text-slate-900 dark:text-slate-50 leading-[1.8] font-medium">{benefit}</p>
                                        </div>
                                    )}
                                    {source && (
                                        <div className="flex items-center gap-3 px-2 text-[11px] text-slate-400 font-bold italic">
                                            <BookOpen className="w-4 h-4" />
                                            <span>{source}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ZikrCard;
