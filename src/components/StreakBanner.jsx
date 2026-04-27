import React from 'react';
import { CheckCircle, Zap } from 'lucide-react';

const StreakBanner = ({ streakCount, goals, t }) => {
    return (
        <div className="glass-panel p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h3 className="text-2xl font-black text-text-primary tracking-tight">{t.streakTitle}</h3>
                    <p className="text-sm text-text-secondary font-medium">{t.streakSubtitle}</p>
                </div>
                <div className="flex items-center gap-4 bg-accent/10 dark:bg-accent/20 px-6 py-4 rounded-3xl border-2 border-accent/20 group hover:border-accent transition-all">
                    <Zap className="w-8 h-8 text-accent fill-accent/30 group-hover:scale-110 transition-transform" />
                    <div className="flex flex-col">
                        <span className="text-3xl font-black text-accent leading-none">{streakCount}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-accent-dark opacity-80">{t.streakDays}</span>
                    </div>
                </div>
            </div>

            {goals && goals.length > 0 && (
                <div className="pt-4 border-t border-glass-border">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary mb-4">{t.goalsTitle}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {goals.map((goal) => (
                            <div
                                key={goal.id}
                                className={`p-4 rounded-2xl border-2 flex items-center gap-3 text-sm font-black transition-all ${
                                    goal.completed
                                        ? "bg-primary text-accent border-primary shadow-lg shadow-primary/10"
                                        : "bg-bg-subtle dark:bg-slate-900/50 border-glass-border text-text-tertiary"
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                    goal.completed ? "bg-accent/20 text-accent" : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                                }`}>
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <span className="truncate">{goal.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StreakBanner;