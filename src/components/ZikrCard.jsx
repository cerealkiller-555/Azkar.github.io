import React, { useRef, useEffect, useState } from 'react';
import { Share2, CheckCircle, Info, ChevronDown, BookOpen, ChevronRight } from 'lucide-react';
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
        if (isCompleted && progress >= zikr.count) {
            setShowCelebration(true);
            const timer = setTimeout(() => setShowCelebration(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [isCompleted, progress, zikr.count]);

    return (
        <div
            id={`zikr-${uniqueId}`}
            ref={cardRef}
            className={`zikr-card relative overflow-hidden rounded-[2rem] transition-all duration-500 border-2 ${
                isHighlighted
                    ? "ring-4 ring-[#D4A76A]/40 ring-offset-4 dark:ring-offset-slate-900 shadow-2xl"
                    : ""
            } ${
                isCompleted
                    ? "bg-gradient-to-br from-[#fff8eb] to-[#ecfdf5] dark:from-[#1f2937] dark:to-[#064e3b]/20 border-[#10b981]/40 shadow-inner"
                    : "bg-white/95 dark:bg-slate-800/90 border-slate-200/70 dark:border-slate-700/50 glass-card shadow-sm hover:shadow-xl hover:translate-y-[-4px]"
            } mb-6`}
            style={{ animationDelay: `${index * 80}ms` }}
        >
            {/* Celebration overlay */}
            {showCelebration && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                    <div className="celebration-burst" />
                </div>
            )}

            <div className="p-6 md:p-8">
                {/* Header row */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-base font-black transition-all duration-500 transform ${
                            isCompleted
                                ? "bg-gradient-to-br from-[#D4A76A] to-[#B18F67] text-white rotate-[360deg] shadow-lg shadow-[#D4A76A]/40"
                                : "bg-slate-100 dark:bg-slate-700/50 text-slate-400"
                        }`}>
                            {isCompleted ? <CheckCircle className="w-6 h-6 animate-pulse" /> : index + 1}
                        </div>
                        {title && (
                            <h3 className="text-xl font-black text-slate-900 dark:text-[#D4A76A] tracking-tight">{title}</h3>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                const shareText = `${title ? `${title}\n` : ""}${zikr.text}\n\n${t.appName}`;
                                if (navigator.share) {
                                    navigator.share({ title: t.appName, text: shareText });
                                } else if (navigator.clipboard) {
                                    navigator.clipboard.writeText(shareText);
                                    showToast(t.shareCopy);
                                }
                            }}
                            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 text-slate-400 hover:text-[#D4A76A] transition-all hover:bg-[#D4A76A]/10 active:scale-90"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onToggleComplete}
                            className={`p-3 rounded-2xl transition-all active:scale-90 ${
                                isCompleted
                                    ? "bg-[#D4A76A] text-white shadow-lg shadow-[#D4A76A]/30"
                                    : "bg-slate-50 dark:bg-slate-900/40 text-slate-400 hover:bg-[#D4A76A]/20"
                            }`}
                        >
                            <CheckCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Arabic text with beautiful typography */}
                <div className="relative mb-8">
                    <p className={`font-amiri text-2xl md:text-5xl leading-[1.8] text-center transition-all duration-700 ${
                        isCompleted 
                            ? "text-emerald-800 dark:text-emerald-300 opacity-95 scale-95"
                            : "text-slate-950 dark:text-slate-50"
                    }`}>
                        {zikr.text}
                    </p>
                    {isCompleted && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                            <CheckCircle className="w-32 h-32 text-[#D4A76A]" />
                        </div>
                    )}
                </div>

                {/* Main Counter Interaction Area */}
                <div className="flex flex-col gap-6">
                    <button
                        ref={buttonRef}
                        onClick={(event) => onProgress(event, buttonRef)}
                        disabled={isCompleted}
                        className={`counter-btn relative group h-20 rounded-3xl overflow-hidden shadow-lg transition-all active:scale-95 ${
                            isCompleted
                                ? "bg-slate-100/50 dark:bg-slate-800/50 cursor-default shadow-none"
                                : "bg-gradient-to-r from-[#423E87] to-[#2E2A5E] hover:from-[#2E2A5E] hover:to-[#423E87] ring-4 ring-[#423E87]/10"
                        }`}
                    >
                        {/* Internal Progress Fill */}
                        {!isCompleted && (
                            <div 
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#D4A76A]/40 to-[#D4A76A]/60 transition-all duration-500 ease-out" 
                                style={{ width: `${progressPct}%` }} 
                            />
                        )}

                        <div className="relative z-10 flex items-center justify-center gap-4 text-white">
                            {isCompleted ? (
                                <div className="flex items-center gap-2 text-[#D4A76A] font-black italic">
                                    <CheckCircle className="w-7 h-7" />
                                    <span className="text-xl uppercase tracking-widest">{t.doneLabel}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <span className={`text-4xl font-black tabular-nums transition-transform ${isAnimating ? "scale-125" : ""}`}>
                                        {progress}
                                    </span>
                                    <span className="h-8 w-[2px] bg-white/20 rounded-full" />
                                    <div className="flex flex-col items-start leading-none opacity-80 font-bold uppercase tracking-tight">
                                        <span className="text-[10px]">{t.requiredLabel || "Goal"}</span>
                                        <span className="text-sm">{zikr.count}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </button>

                    {/* Metadata Toggle */}
                    {(benefit || source || meaning) && (
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={onToggleBenefit}
                                className="flex items-center justify-between w-full py-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-[#423E87] dark:hover:text-[#D4A76A] transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Info className="w-3.5 h-3.5" />
                                    <span>{isExpanded ? t.benefitHide : t.benefitShow}</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${isExpanded ? "rotate-180" : ""}`} />
                            </button>

                            {isExpanded && (
                                <div className="mt-4 space-y-4 animate-slide-up">
                                    {meaning && (
                                        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                            <span className="block text-[10px] font-black uppercase tracking-widest text-[#D4A76A] mb-2">{t.meaningTitle}</span>
                                            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic font-medium">{meaning}</p>
                                        </div>
                                    )}
                                    {benefit && (
                                        <div className="p-5 rounded-2xl bg-[#423E87]/5 dark:bg-[#D4A76A]/5 border border-[#423E87]/10 dark:border-[#D4A76A]/10">
                                            <p className="text-sm text-slate-900 dark:text-white leading-relaxed font-medium">{benefit}</p>
                                        </div>
                                    )}
                                    {source && (
                                        <div className="flex items-center gap-2 px-4 text-[10px] text-slate-400 italic">
                                            <BookOpen className="w-3 h-3" />
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
