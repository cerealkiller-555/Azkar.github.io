import React, { useRef } from 'react';
import { Share2, CheckCircle, Info, ChevronDown, BookOpen } from 'lucide-react';
import { showToast } from '../utils/helpers';

const ZikrCard = ({
    zikr,
    index,
    t,
    isCompleted,
    progress,
    isExpanded,
    progressPct,
    isAnimating,
    language,
    onToggleBenefit,
    onToggleComplete,
    onProgress
}) => {
    const buttonRef = useRef(null);

    const isEn = language === "en";
    const title = isEn && zikr.titleEn ? zikr.titleEn : zikr.title;
    const benefit = isEn && zikr.benefitEn ? zikr.benefitEn : zikr.benefit;
    const meaning = isEn && zikr.meaningEn ? zikr.meaningEn : zikr.meaning;
    const source = isEn && zikr.sourceEn ? zikr.sourceEn : zikr.source;

    return (
        <div
            className={`zikr-card relative overflow-hidden rounded-3xl transition-all duration-500 ${
                isCompleted
                    ? "bg-[#D4A76A]/10 dark:bg-[#D4A76A]/20 border-[#D4A76A]/50 dark:border-[#D4A76A]/30"
                    : "bg-white dark:bg-slate-800/90 border-slate-100 dark:border-slate-700/50"
            } border shadow-lg hover:shadow-xl`}
            style={{ animationDelay: `${index * 60}ms` }}
        >
            <div className="h-1 w-full bg-slate-100 dark:bg-slate-700/50">
                <div
                    className={`h-full transition-all duration-500 ease-out ${isCompleted ? "bg-[#D4A76A]" : "bg-[#B18F67]"}`}
                    style={{ width: `${progressPct}%` }}
                />
            </div>

            <div className="p-5 md:p-7">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black ${
                            isCompleted
                                ? "bg-[#D4A76A] text-white"
                                : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                        }`}>
                            {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
                        </div>
                        {title && (
                            <h3 className="text-lg font-extrabold text-[#423E87] dark:text-[#D4A76A] truncate">{title}</h3>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
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
                            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-400 hover:text-[#D4A76A] dark:hover:text-[#D4A76A] transition-all hover:scale-105 active:scale-95"
                            title={t.shareTitle}
                            aria-label={t.shareLabel}
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onToggleComplete}
                            className={`p-2 rounded-xl transition-all hover:scale-105 active:scale-95 ${
                                isCompleted
                                    ? "bg-[#D4A76A] text-white shadow-md shadow-[#D4A76A]/50 dark:shadow-none"
                                    : "bg-slate-50 dark:bg-slate-700/50 text-slate-400 hover:bg-[#D4A76A]/10 dark:hover:bg-[#D4A76A]/20"
                            }`}
                            aria-label={isCompleted ? t.resetCounter : t.markComplete}
                        >
                            <CheckCircle className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <p className={`font-amiri text-xl md:text-2xl leading-[2] text-center mb-6 px-1 transition-opacity ${
                    isCompleted ? "text-slate-500 dark:text-slate-400" : "text-slate-800 dark:text-slate-100"
                }`}>
                    {zikr.text}
                </p>

                <div className="flex items-center gap-4 mb-4">
                    <button
                        ref={buttonRef}
                        onClick={(event) => onProgress(event, buttonRef)}
                        disabled={isCompleted}
                        className={`counter-btn relative flex-1 overflow-hidden px-6 py-4 rounded-2xl font-black text-lg transition-all active:scale-[0.97] ${
                            isCompleted
                                ? "bg-[#D4A76A]/20 dark:bg-[#D4A76A]/30 text-[#D4A76A] dark:text-[#D4A76A] cursor-default"
                                : "bg-[#423E87] hover:bg-[#2E2A5E] text-white shadow-lg shadow-[#423E87]/20 dark:shadow-none cursor-pointer"
                        }`}
                    >
                        <div className="relative z-10 flex items-center justify-center gap-2">
                            {isCompleted ? (
                                <>
                                    <CheckCircle className="w-6 h-6" />
                                    <span>{t.doneLabel}</span>
                                </>
                            ) : (
                                <>
                                    <span className={`text-2xl font-black tabular-nums ${isAnimating ? "animate-count-pulse" : ""}`}>{progress}</span>
                                    <span className="opacity-60 text-base">/</span>
                                    <span className="text-base">{zikr.count}</span>
                                </>
                            )}
                        </div>

                        {!isCompleted && (
                            <div className="absolute inset-0 bg-white/15 transition-all duration-300 pointer-events-none" style={{ width: `${progressPct}%` }} />
                        )}
                    </button>

                    <div className="flex flex-col items-center flex-shrink-0">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{t.requiredLabel}</span>
                        <div className="px-3 py-1 rounded-xl bg-[#D4A76A]/10 dark:bg-[#D4A76A]/20 text-[#423E87] dark:text-[#D4A76A] font-black text-sm">{zikr.count}</div>
                    </div>
                </div>

                {(benefit || source || meaning) && (
                    <div>
                        <button
                            onClick={onToggleBenefit}
                            className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-bold hover:text-[#D4A76A] dark:hover:text-[#D4A76A] transition-colors w-full"
                        >
                            <Info className="w-3.5 h-3.5" />
                            <span>{isExpanded ? t.benefitHide : t.benefitShow}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                        </button>

                        {isExpanded && (
                            <div className="mt-3 space-y-2 animate-slide-up">
                                {benefit && (
                                    <div className="flex gap-3 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20">
                                        <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-500 h-fit flex-shrink-0">
                                            <Info className="w-3.5 h-3.5" />
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{benefit}</p>
                                    </div>
                                )}
                                {meaning && (
                                    <div className="flex gap-3 p-3 rounded-xl bg-[#D4A76A]/10 dark:bg-[#D4A76A]/20 border border-[#D4A76A]/20 dark:border-[#D4A76A]/30">
                                        <div className="p-1.5 rounded-lg bg-[#D4A76A]/20 dark:bg-[#D4A76A]/30 text-[#423E87] dark:text-[#D4A76A] h-fit flex-shrink-0">
                                            <BookOpen className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-[#423E87] dark:text-[#D4A76A] mb-1 uppercase tracking-wider">{t.meaningTitle}</p>
                                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{meaning}</p>
                                        </div>
                                    </div>
                                )}
                                {source && (
                                    <div className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-700/40">
                                        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 h-fit flex-shrink-0">
                                            <CheckCircle className="w-3.5 h-3.5" />
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">{source}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ZikrCard;