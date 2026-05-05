import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Clock, Moon, Sun, BookOpen, Settings } from 'lucide-react';
import {
    ICONS, DAILY_TAB_IDS, OFFLINE_PRAYER_TIMES,
    PRAYER_CHECKLIST, I18N, azkar, defaultCustomDuas, tabConfig
} from '../utils/constants';
import {
    showToast, readJson, readDailyState, writeJson, isSameDay, isYesterday
} from '../utils/helpers';

import ToastContainer   from './ToastContainer';
import ScrollToTop      from './ScrollToTop';
import OfflineBanner    from './OfflineBanner';
import PrayerTimesSection from './PrayerTimesSection';
import CustomDuasSection  from './CustomDuasSection';
import SettingsSection    from './SettingsSection';
import ProgressHero       from './ProgressHero';
import StreakBanner        from './StreakBanner';
import PrayerChecklist     from './PrayerChecklist';
import LoginScreen         from './LoginScreen';
import ZikrCard            from './ZikrCard';

// ═══════════════════════════════════════════════════════
// AzkarApp — Root Component
//
// HOOK ORDERING RULES (prevents TDZ crash):
//   1. All useState declarations first
//   2. All useMemo / useCallback that derive from state
//   3. All useEffect hooks last
// ═══════════════════════════════════════════════════════

const AzkarApp = () => {
    // ───────────────────────────────────────
    // 1. STATE DECLARATIONS (all at the top)
    // ───────────────────────────────────────
    const [isOffline, setIsOffline]       = useState(!navigator.onLine);
    const [isDarkMode, setIsDarkMode]     = useState(() => localStorage.getItem("azkarDarkMode") === "true");
    const [language, setLanguage]         = useState(() => localStorage.getItem("azkar_language") || "ar");
    const [activeTab, setActiveTab]       = useState(() => localStorage.getItem("azkar_activeTab") || "morning");
    const [userProfile, setUserProfile]   = useState(() => readJson("azkar_user", { name: "", email: "" }));
    const [isLoggedIn, setIsLoggedIn]     = useState(() => {
        const saved = readJson("azkar_user", null);
        return Boolean(saved && (saved.name || saved.email));
    });

    const [prayerTimes, setPrayerTimes]   = useState(null);
    const [location, setLocation]         = useState(() => readJson("azkar_location", { city: "Cairo", country: "EG" }));
    const [currentTime, setCurrentTime]   = useState(new Date());

    const [completedAzkar, setCompletedAzkar]     = useState({});
    const [azkarProgress, setAzkarProgress]       = useState({});
    const [prayerChecklist, setPrayerChecklist]    = useState({});
    const [streak, setStreak]                     = useState({ count: 0, lastDate: null });
    const [customDuas, setCustomDuas]             = useState(() => readJson("azkar_customDuas", defaultCustomDuas));
    const [newDua, setNewDua]                     = useState("");

    const [expandedBenefits, setExpandedBenefits] = useState({});
    const [countAnimation, setCountAnimation]     = useState(null);
    const [deferredPrompt, setDeferredPrompt]     = useState(null);
    const [highlightedZikr, setHighlightedZikr]   = useState(null);

    // Refs
    const completedAzkarRef = useRef(completedAzkar);
    const toastShownRef     = useRef(new Set());

    // ───────────────────────────────────────
    // 2. DERIVED VALUES (useMemo / useCallback)
    // ───────────────────────────────────────
    const userSuffix = useMemo(
        () => (isLoggedIn && userProfile.email ? `_${userProfile.email}` : ""),
        [isLoggedIn, userProfile.email]
    );

    const t = useMemo(() => I18N[language] || I18N.ar, [language]);

    const currentAzkarList = useMemo(() => {
        const map = {
            morning: azkar.morning,
            evening: azkar.evening,
            sleeping: azkar.sleeping,
            prayer_azkar: azkar.prayerAzkar
        };
        return map[activeTab] || [];
    }, [activeTab]);

    const progressPercentage = useMemo(() => {
        if (!currentAzkarList.length) return 0;
        const totalCounts   = currentAzkarList.reduce((s, z) => s + z.count, 0);
        const currentCounts = currentAzkarList.reduce((s, z) => {
            const key = `${activeTab}_${z.id}`;
            return s + Math.min(azkarProgress[key] || 0, z.count);
        }, 0);
        return Math.round((currentCounts / totalCounts) * 100);
    }, [activeTab, azkarProgress, currentAzkarList]);

    const completedCount = useMemo(
        () => currentAzkarList.filter((z) => completedAzkar[`${activeTab}_${z.id}`]).length,
        [activeTab, completedAzkar, currentAzkarList]
    );

    const formatTime = useCallback(
        () => currentTime.toLocaleTimeString(language === "en" ? "en-US" : "ar-EG", { hour: "2-digit", minute: "2-digit" }),
        [currentTime, language]
    );

    // Daily goal checks
    const morningCompleted  = useMemo(() => azkar.morning.every((z) => completedAzkar[`morning_${z.id}`]), [completedAzkar]);
    const eveningCompleted  = useMemo(() => azkar.evening.every((z) => completedAzkar[`evening_${z.id}`]), [completedAzkar]);
    const prayersCompleted  = useMemo(() => PRAYER_CHECKLIST.every((p) => prayerChecklist[p.id]), [prayerChecklist]);
    const dailyGoalsComplete = morningCompleted && eveningCompleted && prayersCompleted;

    const tabs = useMemo(() => tabConfig.map(tab => ({
        ...tab,
        icon: ICONS[tab.icon],
        labelText: language === "en" ? tab.labelEn || tab.label : tab.label
    })), [language]);

    const goals = useMemo(() => [
        { id: "morning",  label: t.goalMorning,  completed: morningCompleted },
        { id: "evening",  label: t.goalEvening,  completed: eveningCompleted },
        { id: "prayers",  label: t.goalPrayers,  completed: prayersCompleted }
    ], [t, morningCompleted, eveningCompleted, prayersCompleted]);

    // Prayer times fetcher
    const fetchPrayerTimes = useCallback(async () => {
        try {
            const now  = new Date();
            const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
            const url  = `https://api.aladhan.com/v1/timingsByCity/${date}?city=${encodeURIComponent(location.city)}&country=${encodeURIComponent(location.country)}&method=5`;
            const res  = await fetch(url);
            const data = await res.json();
            if (data.code === 200) { setPrayerTimes(data.data.timings); return; }
        } catch (e) {
            console.error("Prayer times fetch failed:", e);
        }
        setPrayerTimes(OFFLINE_PRAYER_TIMES);
    }, [location]);

    // Auto-advance: scroll to next incomplete zikr
    const scrollToNextZikr = useCallback((currentId, list, type) => {
        const currentIndex = list.findIndex((z) => `${type}_${z.id}` === currentId);
        const remaining    = list.slice(currentIndex + 1);
        const nextIncomplete = remaining.find((z) => !completedAzkarRef.current[`${type}_${z.id}`]);

        if (nextIncomplete) {
            const nextId = `${type}_${nextIncomplete.id}`;
            setTimeout(() => {
                setHighlightedZikr(nextId);
                const el = document.getElementById(`zikr-${nextId}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => setHighlightedZikr(null), 2000);
            }, 600);
        } else {
            // Check if ALL items in the list are now complete
            const allDone = list.every((z) => {
                const key = `${type}_${z.id}`;
                return completedAzkarRef.current[key] || key === currentId;
            });
            if (allDone) {
                showToast(t.allComplete, "success");
            }
        }
    }, [t]);

    // ───────────────────────────────────────
    // 3. EVENT HANDLERS
    // ───────────────────────────────────────
    const handleLogin = useCallback((profile) => {
        const user = { name: profile.name.trim(), email: profile.email.trim().toLowerCase() };
        setUserProfile(user);
        setIsLoggedIn(true);
        writeJson("azkar_user", user);
        showToast(t.loginSaved, "success");
    }, [t]);

    const logout = useCallback(() => {
        setIsLoggedIn(false);
        setUserProfile({ name: "", email: "" });
        localStorage.removeItem("azkar_user");
        // Reset in-memory state
        setCompletedAzkar({});
        setAzkarProgress({});
        setPrayerChecklist({});
        setStreak({ count: 0, lastDate: null });
        showToast(t.logoutButton, "info");
    }, [t]);

    const handleZikrProgress = useCallback((id, max, list, type) => {
        if (completedAzkarRef.current[id]) return;
        if (navigator.vibrate) navigator.vibrate(40);

        setCountAnimation(id);
        setTimeout(() => setCountAnimation(null), 200);

        setAzkarProgress((prev) => {
            const next = (prev[id] || 0) + 1;
            const updated = { ...prev, [id]: next };

            if (next >= max) {
                // Mark as completed
                setCompletedAzkar((prevC) => {
                    const newCompleted = { ...prevC, [id]: true };
                    // Update ref immediately for scrollToNextZikr
                    completedAzkarRef.current = newCompleted;
                    return newCompleted;
                });
                showToast(t.progressCompleted);
                scrollToNextZikr(id, list, type);
            }

            return updated;
        });
    }, [t, scrollToNextZikr]);

    const toggleZikrComplete = useCallback((id, max) => {
        setCompletedAzkar((prev) => {
            const done = !prev[id];
            const updated = { ...prev, [id]: done };
            completedAzkarRef.current = updated;
            return updated;
        });
        setAzkarProgress((prev) => {
            const done = !completedAzkarRef.current[id];
            // Note: completedAzkarRef was just updated above, so check the NEW value
            // Actually we need the value AFTER the toggle. Since setCompletedAzkar runs first:
            const isDone = completedAzkarRef.current[id];
            return { ...prev, [id]: isDone ? max : 0 };
        });
    }, []);

    const handleTabChange = useCallback((tabId) => {
        setActiveTab(tabId);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const addCustomDua = useCallback(() => {
        if (!newDua.trim()) return;
        setCustomDuas((prev) => [...prev, { id: Date.now(), text: newDua.trim() }]);
        setNewDua("");
        showToast(t.duaAdded);
    }, [newDua, t]);

    const deleteCustomDua = useCallback((index) => {
        setCustomDuas((prev) => prev.filter((_, i) => i !== index));
        showToast(t.duaDeleted, "info");
    }, [t]);

    const resetAllProgress = useCallback(() => {
        if (!window.confirm(t.resetAllLabel)) return;
        setCompletedAzkar({});
        setAzkarProgress({});
        completedAzkarRef.current = {};
        showToast(t.resetAllToast, "info");
    }, [t]);

    // ───────────────────────────────────────
    // 4. EFFECTS (all at the bottom)
    // ───────────────────────────────────────

    // Keep ref in sync
    useEffect(() => {
        completedAzkarRef.current = completedAzkar;
    }, [completedAzkar]);

    // Load user-scoped data when logged in or user changes
    useEffect(() => {
        if (!isLoggedIn || !userProfile.email) return;
        const suffix = `_${userProfile.email}`;
        setCompletedAzkar(readDailyState(`azkar_completed${suffix}`));
        setAzkarProgress(readDailyState(`azkar_progress${suffix}`));
        setPrayerChecklist(readDailyState(`azkar_prayerChecklist${suffix}`));
        setStreak(readJson(`azkar_streak${suffix}`, { count: 0, lastDate: null }));
    }, [isLoggedIn, userProfile.email]);

    // Persist user-scoped data
    useEffect(() => {
        if (!isLoggedIn || !userProfile.email) return;
        const today = new Date().toDateString();
        writeJson(`azkar_progress${userSuffix}`,       { date: today, items: azkarProgress });
        writeJson(`azkar_completed${userSuffix}`,      { date: today, items: completedAzkar });
        writeJson(`azkar_prayerChecklist${userSuffix}`, { date: today, items: prayerChecklist });
        writeJson(`azkar_streak${userSuffix}`,         streak);
    }, [azkarProgress, completedAzkar, prayerChecklist, streak, userSuffix, isLoggedIn, userProfile.email]);

    // Persist custom duas
    useEffect(() => {
        writeJson("azkar_customDuas", customDuas);
    }, [customDuas]);

    // Persist UI preferences
    useEffect(() => { localStorage.setItem("azkar_activeTab", activeTab); }, [activeTab]);
    useEffect(() => {
        localStorage.setItem("azkarDarkMode", String(isDarkMode));
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);
    useEffect(() => { localStorage.setItem("azkar_language", language); }, [language]);
    useEffect(() => { writeJson("azkar_location", location); }, [location]);

    // Clock tick
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch prayer times
    useEffect(() => { fetchPrayerTimes(); }, [fetchPrayerTimes]);

    // Online/offline detection
    useEffect(() => {
        const goOnline  = () => { setIsOffline(false); showToast(t.onlineNotice, "success"); };
        const goOffline = () => { setIsOffline(true); };
        window.addEventListener("online",  goOnline);
        window.addEventListener("offline", goOffline);
        return () => {
            window.removeEventListener("online",  goOnline);
            window.removeEventListener("offline", goOffline);
        };
    }, [t]);

    // PWA install prompt
    useEffect(() => {
        const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); };
        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    // Streak updater — runs when dailyGoalsComplete changes
    useEffect(() => {
        if (!isLoggedIn || !dailyGoalsComplete) return;

        const today = new Date();
        const todayStr = today.toDateString();

        // Don't update if we already counted today
        if (streak.lastDate === todayStr) return;

        setStreak((prev) => {
            if (prev.lastDate) {
                const lastDate = new Date(prev.lastDate);
                if (isYesterday(lastDate, today)) {
                    // Consecutive day
                    return { count: prev.count + 1, lastDate: todayStr };
                } else if (!isSameDay(lastDate, today)) {
                    // Streak broken — restart
                    return { count: 1, lastDate: todayStr };
                }
            }
            // First time or same day (shouldn't happen due to guard above)
            return { count: Math.max(prev.count, 1), lastDate: todayStr };
        });
    }, [dailyGoalsComplete, isLoggedIn, streak.lastDate]);

    // ───────────────────────────────────────
    // 5. RENDER HELPERS
    // ───────────────────────────────────────
    const renderAzkarList = (list, type) => (
        <div className="space-y-6">
            {list.map((z, i) => {
                const uid = `${type}_${z.id}`;
                return (
                    <ZikrCard
                        key={uid}
                        zikr={z}
                        index={i}
                        uniqueId={uid}
                        t={t}
                        language={language}
                        isCompleted={!!completedAzkar[uid]}
                        progress={azkarProgress[uid] || 0}
                        progressPct={((azkarProgress[uid] || 0) / z.count) * 100}
                        isAnimating={countAnimation === uid}
                        isHighlighted={highlightedZikr === uid}
                        isExpanded={!!expandedBenefits[uid]}
                        onToggleBenefit={() => setExpandedBenefits((p) => ({ ...p, [uid]: !p[uid] }))}
                        onToggleComplete={() => toggleZikrComplete(uid, z.count)}
                        onProgress={() => handleZikrProgress(uid, z.count, list, type)}
                    />
                );
            })}
        </div>
    );

    // ───────────────────────────────────────
    // 6. RENDER
    // ───────────────────────────────────────
    if (!isLoggedIn) {
        return <LoginScreen onLogin={handleLogin} t={t} language={language} />;
    }

    return (
        <div
            className={`min-h-screen transition-all duration-500 pattern-bg ${isDarkMode ? 'dark' : ''}`}
            dir={language === "ar" ? "rtl" : "ltr"}
        >
            <OfflineBanner offline={isOffline} t={t} />
            <ToastContainer />
            <ScrollToTop t={t} />

            {/* Header */}
            <header className="sticky top-0 z-50 glass-panel !rounded-none border-x-0 border-t-0 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleTabChange("morning")}>
                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg transition-transform">
                            <img src="hesnok_logo.png" alt="Hesnok" className="w-10 h-10 rounded-lg" />
                        </div>
                        <div>
                            <h1 className="text-xl font-outfit font-black text-primary dark:text-accent tracking-tighter leading-none">{t.appName}</h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-dark dark:text-slate-400 mt-1">{t.appTagline}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-surface dark:bg-slate-800 text-text-primary font-bold border border-glass-border">
                            <Clock className="w-4 h-4 text-accent" />
                            <span className="text-sm font-mono">{formatTime()}</span>
                        </div>
                        <button onClick={() => setIsDarkMode((d) => !d)} className="p-2.5 rounded-xl bg-bg-surface dark:bg-slate-800 text-text-secondary border border-glass-border">
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button onClick={() => handleTabChange("settings")} className={`p-2.5 rounded-xl border transition-all ${activeTab === "settings" ? "bg-primary text-white" : "bg-bg-surface dark:bg-slate-800 text-text-secondary border-glass-border"}`}>
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Progress bar in header */}
                {DAILY_TAB_IDS.includes(activeTab) && (
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800/50">
                        <div className="h-full bg-gradient-to-l from-accent to-accent-dark transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }} />
                    </div>
                )}
            </header>

            {/* Main content */}
            <main className="container mx-auto px-4 py-8 max-w-3xl space-y-8 animate-fade-in">
                <StreakBanner streakCount={streak.count} goals={goals} t={t} />

                <ProgressHero
                    activeTab={activeTab}
                    progressPercentage={progressPercentage}
                    completedCount={completedCount}
                    totalCount={currentAzkarList.length}
                    resetAllProgress={resetAllProgress}
                    t={t}
                    userProfile={userProfile}
                    language={language}
                />

                <div className="space-y-6">
                    {activeTab === "morning"       && renderAzkarList(azkar.morning, "morning")}
                    {activeTab === "evening"       && renderAzkarList(azkar.evening, "evening")}
                    {activeTab === "sleeping"      && renderAzkarList(azkar.sleeping, "sleeping")}
                    {activeTab === "prayer_azkar"  && renderAzkarList(azkar.prayerAzkar, "prayer_azkar")}

                    {activeTab === "prayer" && (
                        <div className="animate-slide-up space-y-8">
                            <PrayerTimesSection prayerTimes={prayerTimes} location={location} t={t} language={language} />
                            <PrayerChecklist
                                checklist={prayerChecklist}
                                onToggle={(id) => setPrayerChecklist((p) => ({ ...p, [id]: !p[id] }))}
                                language={language}
                                t={t}
                            />
                        </div>
                    )}

                    {activeTab === "custom" && (
                        <CustomDuasSection
                            customDuas={customDuas}
                            newDua={newDua}
                            setNewDua={setNewDua}
                            addCustomDua={addCustomDua}
                            deleteCustomDua={deleteCustomDua}
                            t={t}
                        />
                    )}

                    {activeTab === "settings" && (
                        <SettingsSection
                            t={t}
                            userProfile={userProfile}
                            logout={logout}
                            language={language}
                            setLanguage={setLanguage}
                            isDarkMode={isDarkMode}
                            toggleDarkMode={() => setIsDarkMode((d) => !d)}
                            location={location}
                            setLocation={setLocation}
                            resetAllProgress={resetAllProgress}
                            deferredPrompt={deferredPrompt}
                            installPWA={() => deferredPrompt?.prompt()}
                            updateProfile={setUserProfile}
                        />
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="py-20 text-center bg-white dark:bg-slate-900 border-t border-glass-border">
                <p className="text-accent font-black mb-4 tracking-[0.3em] text-[10px] uppercase">{t.appName} — {t.appTagline}</p>
                <h2 className="text-2xl font-amiri text-text-primary px-6 mb-8 italic leading-relaxed">"أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"</h2>
                <div className="flex items-center justify-center gap-4 opacity-30">
                    <div className="w-10 h-px bg-current" />
                    <BookOpen className="w-5 h-5 text-accent" />
                    <div className="w-10 h-px bg-current" />
                </div>
            </footer>

            {/* Bottom navigation */}
            <nav className="bottom-nav" aria-label={t.navLabel}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`bottom-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    >
                        <tab.icon />
                        <span>{tab.labelText}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default AzkarApp;
