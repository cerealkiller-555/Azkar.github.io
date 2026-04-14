import React from 'react';

const LoadingSkeleton = ({ count = 3 }) => {
    return (
        <div className="space-y-5">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="animate-pulse">
                    <div className="rounded-3xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shadow-lg p-5 md:p-7">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-700" />
                                <div className="h-6 w-32 rounded-lg bg-slate-200 dark:bg-slate-700" />
                            </div>
                            <div className="flex gap-2">
                                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
                                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
                            </div>
                        </div>
                        {/* Text content */}
                        <div className="space-y-2 mb-6">
                            <div className="h-6 w-full rounded bg-slate-200 dark:bg-slate-700" />
                            <div className="h-6 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
                        </div>
                        {/* Counter button */}
                        <div className="h-12 rounded-2xl bg-slate-200 dark:bg-slate-700" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LoadingSkeleton;
