import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Clock, Moon, Sun, MapPin, BookOpen, Plus, Settings, CheckCircle, Share2, Trash2, Heart, Info, ArrowUp, ChevronDown, Wifi, WifiOff, Download, RotateCcw } from 'lucide-react';
import { ICONS, DAILY_TAB_IDS, OFFLINE_PRAYER_TIMES, PRAYER_CHECKLIST, I18N, azkar, defaultCustomDuas, tabConfig } from '../utils/constants';
import { showToast, readJson, readDailyState, isSameDay, isYesterday } from '../utils/helpers';
import ToastContainer from './ToastContainer';
import ScrollToTop from './ScrollToTop';
import OfflineBanner from './OfflineBanner';
import PrayerTimesSection from './PrayerTimesSection';
import CustomDuasSection from './CustomDuasSection';
import SettingsSection from './SettingsSection';
import ProgressHero from './ProgressHero';
import StreakBanner from './StreakBanner';
import PrayerChecklist from './PrayerChecklist';
import LoginScreen from './LoginScreen';
import ZikrCard from './ZikrCard';

const AzkarApp = () => {
    console.log('AzkarApp component initializing...');

    const [activeTab, setActiveTab] = useState(() => localStorage.getItem("azkar_activeTab") || "morning");
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [location, setLocation] = useState(() => readJson("azkar_location", { city: "Cairo", country: "EG" }));
    const [customDuas, setCustomDuas] = useState(() => readJson("azkar_customDuas", defaultCustomDuas));
    const [newDua, setNewDua] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [completedAzkar, setCompletedAzkar] = useState(() => readDailyState("azkar_completed"));
    const [azkarProgress, setAzkarProgress] = useState(() => readDailyState("azkar_progress"));
    const [prayerChecklist, setPrayerChecklist] = useState(() => readDailyState("azkar_prayerChecklist"));
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("azkarDarkMode") === "true");
    const [language, setLanguage] = useState(() => localStorage.getItem("azkar_language") || "ar");
    const [userProfile, setUserProfile] = useState(() => readJson("azkar_user", { name: "", email: "" }));
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const saved = readJson("azkar_user", null);
        return Boolean(saved && (saved.name || saved.email));
    });
    const [streak, setStreak] = useState(() => readJson("azkar_streak", { count: 0, lastDate: null }));
    const [expandedBenefits, setExpandedBenefits] = useState({});
    const [countAnimation, setCountAnimation] = useState(null);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [highlightedZikr, setHighlightedZikr] = useState(null);
    const mainRef = useRef(null);
    const toastShownRef = useRef(new Set());
    // Use a ref to always have the latest completedAzkar for auto-advance logic
    const completedAzkarRef = useRef(completedAzkar);
    useEffect(() => {
        completedAzkarRef.current = completedAzkar;
    }, [completedAzkar]);

    const t = useMemo(() => I18N[language] || I18N.ar, [language]);

    const currentAzkarList = useMemo(() => {
        if (activeTab === "morning") return azkar.morning;
        if (activeTab === "evening") return azkar.evening;
        if (activeTab === "sleeping") return azkar.sleeping;
        if (activeTab === "prayer_azkar") return azkar.prayerAzkar;
        return [];
    }, [activeTab]);

    const progressPercentage = useMemo(() => {
        if (!currentAzkarList.length) {
            return 0;
        }

        const totalCounts = currentAzkarList.reduce((sum, item) => sum + item.count, 0);
        const currentCounts = currentAzkarList.reduce((sum, item) => {
            const itemId = `${activeTab}_${item.id}`;
            return sum + Math.min(azkarProgress[itemId] || 0, item.count);
        }, 0);

        return Math.round((currentCounts / totalCounts) * 100);
    }, [activeTab, azkarProgress, currentAzkarList]);

    const completedCount = useMemo(
        () => currentAzkarList.filter((item) => completedAzkar[`${activeTab}_${item.id}`]).length,
        [activeTab, completedAzkar, currentAzkarList]
    );

    const formatTime = useCallback(
        () => currentTime.toLocaleTimeString(language === "en" ? "en-US" : "ar-EG", { hour: "2-digit", minute: "2-digit" }),
        [currentTime, language]
    );

    const morningCompleted = useMemo(
        () => azkar.morning.every((item) => completedAzkar[`morning_${item.id}`]),
        [completedAzkar]
    );
    const eveningCompleted = useMemo(
        () => azkar.evening.every((item) => completedAzkar[`evening_${item.id}`]),
        [completedAzkar]
    );
    const prayersCompleted = useMemo(
        () => PRAYER_CHECKLIST.every((item) => prayerChecklist[item.id]),
        [prayerChecklist]
    );
    const dailyGoalsComplete = morningCompleted && eveningCompleted && prayersCompleted;

    const fetchPrayerTimes = useCallback(async () => {
        try {
            const now = new Date();
            const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
            const response = await fetch(
                `https://api.aladhan.com/v1/timingsByCity/${date}?city=${encodeURIComponent(location.city)}&country=${encodeURIComponent(location.country)}&method=5`
            );
            const data = await response.json();

            if (data.code === 200) {
                setPrayerTimes(data.data.timings);
                return;
            }
        } catch (error) {
            console.error("Error fetching prayer times:", error);
        }

        setPrayerTimes(OFFLINE_PRAYER_TIMES);
    }, [location.city, location.country]);

    useEffect(() => {
        const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);
        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchPrayerTimes();
    }, [fetchPrayerTimes]);

    useEffect(() => {
        localStorage.setItem("azkar_progress", JSON.stringify({
            date: new Date().toDateString(),
            items: azkarProgress
        }));
    }, [azkarProgress]);

    useEffect(() => {
        localStorage.setItem("azkar_completed", JSON.stringify({
            date: new Date().toDateString(),
            items: completedAzkar
        }));
    }, [completedAzkar]);

    useEffect(() => {
        localStorage.setItem("azkar_prayerChecklist", JSON.stringify({
            date: new Date().toDateString(),
            items: prayerChecklist
        }));
    }, [prayerChecklist]);

    useEffect(() => {
        localStorage.setItem("azkar_customDuas", JSON.stringify(customDuas));
    }, [customDuas]);

    useEffect(() => {
        localStorage.setItem("azkar_location", JSON.stringify(location));
    }, [location]);

    useEffect(() => {
        localStorage.setItem("azkar_activeTab", activeTab);
    }, [activeTab]);

    useEffect(() => {
        localStorage.setItem("azkarDarkMode", String(isDarkMode));
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);

    useEffect(() => {
        localStorage.setItem("azkar_language", language);
    }, [language]);

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }
        localStorage.setItem("azkar_user", JSON.stringify(userProfile));
    }, [userProfile, isLoggedIn]);

    useEffect(() => {
        localStorage.setItem("azkar_streak", JSON.stringify(streak));
    }, [streak]);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event) => {
            event.preventDefault();
            setDeferredPrompt(event);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }, []);

    useEffect(() => {
        const goOffline = () => {
            setIsOffline(true);
            showToast(t.offlineNotice, "warning", 3000);
        };

        const goOnline = () => {
            setIsOffline(false);
            showToast(t.onlineNotice, "success", 2000);
        };

        window.addEventListener("offline", goOffline);
        window.addEventListener("online", goOnline);

        return () => {
            window.removeEventListener("offline", goOffline);
            window.removeEventListener("online", goOnline);
        };
    }, [t]);

    useEffect(() => {
        if (!dailyGoalsComplete) {
            return;
        }

        setStreak((prev) => {
            const today = new Date();
            const lastDate = prev.lastDate ? new Date(prev.lastDate) : null;

            if (lastDate && isSameDay(lastDate, today)) {
                return prev;
            }

            const nextCount = lastDate && isYesterday(lastDate, today) ? prev.count + 1 : 1;
            return { count: nextCount, lastDate: today.toISOString() };
        });
    }, [dailyGoalsComplete]);

    const toggleDarkMode = useCallback(() => {
        setIsDarkMode((prev) => !prev);
    }, []);

    const handleLogin = useCallback((profile) => {
        if (!profile.name.trim() && !profile.email.trim()) {
            showToast(t.loginRequired, "warning");
            return;
        }

        const cleaned = { name: profile.name.trim(), email: profile.email.trim() };
        setUserProfile(cleaned);
        setIsLoggedIn(true);
        showToast(t.loginSaved, "success");
    }, [t]);

    const updateProfile = useCallback((profile) => {
        setUserProfile(profile);
    }, []);

    const logout = useCallback(() => {
        setIsLoggedIn(false);
        setUserProfile({ name: "", email: "" });
        localStorage.removeItem("azkar_user");
    }, []);

    const addCustomDua = useCallback(() => {
        if (!newDua.trim()) {
            return;
        }

        setCustomDuas((prev) => [...prev, newDua.trim()]);
        setNewDua("");
        showToast(t.duaAdded);
    }, [newDua, t]);

    const deleteCustomDua = useCallback((index) => {
        setCustomDuas((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
        showToast(t.duaDeleted, "info");
    }, [t]);

    // Auto-advance: scroll to the next incomplete zikr after finishing one
    const scrollToNextZikr = useCallback((currentId, list, type) => {
        const currentIndex = list.findIndex(zikr => `${type}_${zikr.id}` === currentId);
        if (currentIndex === -1) return;

        // Find the next incomplete zikr after the current one
        const nextIncomplete = list.slice(currentIndex + 1).find(
            zikr => !completedAzkarRef.current[`${type}_${zikr.id}`]
        );

        if (nextIncomplete) {
            const nextId = `${type}_${nextIncomplete.id}`;
            // Highlight and scroll with a delay for the completion animation to play
            setTimeout(() => {
                setHighlightedZikr(nextId);
                const nextElement = document.getElementById(`zikr-${nextId}`);
                if (nextElement) {
                    nextElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                // Remove highlight after 2 seconds
                setTimeout(() => setHighlightedZikr(null), 2500);
            }, 600);
        } else {
            // All done! Show a congratulations toast
            setTimeout(() => {
                const allDone = list.every(zikr => completedAzkarRef.current[`${type}_${zikr.id}`] || `${type}_${zikr.id}` === currentId);
                if (allDone) {
                    showToast(language === "en" ? "🎉 All azkar completed!" : "🎉 تم إتمام جميع الأذكار!", "success", 3000);
                }
            }, 600);
        }
    }, [language]);

    const handleZikrProgress = useCallback((id, count, list, type) => {
        if (completedAzkar[id]) {
            return;
        }

        if (navigator.vibrate) {
            navigator.vibrate(40);
        }

        setCountAnimation(id);
        window.setTimeout(() => setCountAnimation(null), 300);

        const currentCount = azkarProgress[id] || 0;
        const nextCount = currentCount + 1;
        const cappedCount = Math.min(nextCount, count);

        setAzkarProgress((prev) => ({ ...prev, [id]: cappedCount }));

        if (cappedCount >= count) {
            setCompletedAzkar((current) => {
                if (current[id]) return current;
                if (!toastShownRef.current.has(id)) {
                    toastShownRef.current.add(id);
                    showToast(t.progressCompleted);
                    if (navigator.vibrate) {
                        navigator.vibrate([100, 50, 100]);
                    }
                }
                // Trigger auto-advance to next incomplete zikr
                scrollToNextZikr(id, list, type);
                return { ...current, [id]: true };
            });
        }
    }, [azkarProgress, completedAzkar, t, scrollToNextZikr]);

    const toggleZikrComplete = useCallback((id, count) => {
        const nextCompleted = !completedAzkar[id];

        setCompletedAzkar((prev) => ({ ...prev, [id]: nextCompleted }));
        setAzkarProgress((prev) => ({ ...prev, [id]: nextCompleted ? count : 0 }));

        showToast(nextCompleted ? t.progressCompleted : t.progressResetOne, nextCompleted ? "success" : "info");
    }, [completedAzkar, t]);

    const resetAllProgress = useCallback(() => {
        setCompletedAzkar({});
        setAzkarProgress({});
        showToast(t.resetAllToast, "info");
    }, [t]);

    const togglePrayerChecklist = useCallback((prayerId) => {
        setPrayerChecklist((prev) => ({ ...prev, [prayerId]: !prev[prayerId] }));
    }, []);

    const handleTabChange = useCallback((tabId) => {
        setActiveTab(tabId);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const installPWA = useCallback(async () => {
        if (!deferredPrompt) {
            return;
        }

        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        if (result.outcome === "accepted") {
            showToast(t.pwaInstall);
            setDeferredPrompt(null);
        }
    }, [deferredPrompt, t]);

    const renderAzkarList = (list, type) => (
        <div className="space-y-5">
            {list.map((zikr, index) => {
                const uniqueId = `${type}_${zikr.id}`;
                const isCompleted = Boolean(completedAzkar[uniqueId]);
                const progress = azkarProgress[uniqueId] || 0;
                const isExpanded = Boolean(expandedBenefits[uniqueId]);
                const progressPct = Math.min((progress / zikr.count) * 100, 100);
                const isAnimating = countAnimation === uniqueId;
                const isHighlighted = highlightedZikr === uniqueId;

                return (
                    <ZikrCard
                        key={uniqueId}
                        zikr={zikr}
                        index={index}
                        uniqueId={uniqueId}
                        t={t}
                        language={language}
                        isCompleted={isCompleted}
                        progress={progress}
                        isExpanded={isExpanded}
                        progressPct={progressPct}
                        isAnimating={isAnimating}
                        isHighlighted={isHighlighted}
                        onToggleBenefit={() => setExpandedBenefits((prev) => ({ ...prev, [uniqueId]: !prev[uniqueId] }))}
                        onToggleComplete={() => toggleZikrComplete(uniqueId, zikr.count)}
                        onProgress={(event, buttonRef) => {
                            if (buttonRef.current && !isCompleted) {
                                const rect = buttonRef.current.getBoundingClientRect();
                                const ripple = document.createElement("span");
                                const size = Math.max(rect.width, rect.height);

                                ripple.className = "ripple-effect";
                                ripple.style.width = `${size}px`;
                                ripple.style.height = `${size}px`;
                                ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
                                ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

                                buttonRef.current.appendChild(ripple);
                                window.setTimeout(() => ripple.remove(), 600);
                            }

                            handleZikrProgress(uniqueId, zikr.count, list, type);
                        }}
                    />
                );
            })}
        </div>
    );

    const tabs = tabConfig.map((tab) => ({
        ...tab,
        icon: ICONS[tab.icon],
        labelText: language === "en" ? tab.labelEn || tab.label : tab.label
    }));

    const goals = [
        { id: "morning", label: t.goalMorning, completed: morningCompleted },
        { id: "evening", label: t.goalEvening, completed: eveningCompleted },
        { id: "prayers", label: t.goalPrayers, completed: prayersCompleted }
    ];

    if (!isLoggedIn) {
        return <LoginScreen onLogin={handleLogin} t={t} language={language} />;
    }

    return (
        <div
            className={`min-h-screen ${isDarkMode ? "dark bg-slate-950" : "bg-slate-50"} transition-colors duration-500`}
            dir={language === "en" ? "ltr" : "rtl"}
            style={{ fontFamily: language === "en" ? "'Inter', sans-serif" : "'Cairo', sans-serif", backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}
        >
            <OfflineBanner offline={isOffline} t={t} />
            <ToastContainer />
            <ScrollToTop t={t} />

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/50 shadow-sm">
                <div className="container mx-auto px-4 py-3 md:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => handleTabChange("morning")}>
                            <div className="flex h-11 w-11 md:h-13 md:w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 ring-1 ring-slate-200/70 dark:ring-slate-600/50 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                                <img src="hesnok_logo.png" alt="حصنك" className="w-9 h-9 md:w-11 md:h-11 object-contain drop-shadow-sm rounded-xl" />
                            </div>
                            <div>
                                <h1 className="text-lg md:text-2xl font-black text-[#423E87] dark:text-[#D4A76A] tracking-tight leading-tight">{t.appName}</h1>
                                <p className="text-[10px] md:text-xs text-[#B18F67] dark:text-[#B2AE97] font-bold leading-tight">{t.appTagline}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border border-slate-200/70 dark:border-slate-700/50">
                                <Clock className="w-4 h-4 text-[#D4A76A]" />
                                <span className="text-sm font-mono tracking-wider">{formatTime()}</span>
                            </div>

                            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${isOffline
                                    ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200/70 dark:border-amber-800/50"
                                    : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200/70 dark:border-emerald-800/50"
                                }`}>
                                {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                                <span>{isOffline ? t.offline : t.online}</span>
                            </div>

                            <button
                                onClick={() => handleTabChange("settings")}
                                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition-all ${activeTab === "settings"
                                        ? "bg-[#423E87] text-white border-[#423E87] shadow-md shadow-[#423E87]/20"
                                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/70 dark:border-slate-700/50 hover:border-[#D4A76A]"
                                    }`}
                                aria-label={t.openSettings}
                            >
                                <Settings className="w-4 h-4" />
                                <span className="hidden sm:inline">{t.openSettings}</span>
                            </button>

                            <button
                                onClick={toggleDarkMode}
                                className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#D4A76A]/10 text-slate-500 dark:text-[#D4A76A] border border-slate-200/70 dark:border-[#D4A76A]/20 hover:scale-105 active:scale-95 transition-all"
                                aria-label={isDarkMode ? t.lightOn : t.darkOn}
                            >
                                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {DAILY_TAB_IDS.includes(activeTab) && (
                    <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
                        <div className="h-full bg-gradient-to-l from-[#D4A76A] to-[#B18F67] transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }} />
                    </div>
                )}
            </header>

            {/* Desktop Tab Navigation */}
            <div className="hidden md:block container mx-auto px-4 py-6">
                <div className="max-w-3xl mx-auto">
                    <div className="p-1.5 bg-white dark:bg-slate-800/90 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50 flex gap-1 overflow-x-auto no-scrollbar scroll-smooth">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl transition-all duration-300 whitespace-nowrap font-bold text-sm ${activeTab === tab.id
                                        ? `bg-gradient-to-br ${tab.color} text-white shadow-lg scale-[1.02]`
                                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                                    }`}
                            >
                                <tab.icon className="w-4.5 h-4.5" />
                                <span>{tab.labelText}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main ref={mainRef} className="container mx-auto px-4 py-6 md:py-8">
                <div className="max-w-3xl mx-auto">
                    <StreakBanner streakCount={streak.count} goals={goals} t={t} />
                    <ProgressHero
                        activeTab={activeTab}
                        progressPercentage={progressPercentage}
                        completedCount={completedCount}
                        totalCount={currentAzkarList.length}
                        resetAllProgress={resetAllProgress}
                        t={t}
                    />

                    {activeTab === "morning" && renderAzkarList(azkar.morning, "morning")}
                    {activeTab === "evening" && renderAzkarList(azkar.evening, "evening")}
                    {activeTab === "sleeping" && renderAzkarList(azkar.sleeping, "sleeping")}
                    {activeTab === "prayer_azkar" && renderAzkarList(azkar.prayerAzkar, "prayer_azkar")}
                    {activeTab === "prayer" && (
                        <>
                            <PrayerTimesSection prayerTimes={prayerTimes} location={location} t={t} language={language} />
                            <PrayerChecklist checklist={prayerChecklist} onToggle={togglePrayerChecklist} language={language} t={t} />
                        </>
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
                            deferredPrompt={deferredPrompt}
                            installPWA={installPWA}
                            location={location}
                            setLocation={setLocation}
                            isDarkMode={isDarkMode}
                            toggleDarkMode={toggleDarkMode}
                            resetAllProgress={resetAllProgress}
                            userProfile={userProfile}
                            updateProfile={updateProfile}
                            logout={logout}
                            language={language}
                            setLanguage={setLanguage}
                            t={t}
                        />
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-10 md:py-14 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-slate-400 dark:text-slate-500 font-bold mb-4 tracking-widest text-xs uppercase">تطبيق الأذكار اليومية</p>
                    <h2 className="text-xl md:text-2xl font-amiri text-slate-700 dark:text-slate-300 mb-6 italic">"أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"</h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-10 h-px bg-slate-200 dark:bg-slate-800" />
                        <BookOpen className="w-6 h-6 text-[#D4A76A] opacity-50" />
                        <div className="w-10 h-px bg-slate-200 dark:bg-slate-800" />
                    </div>
                </div>
            </footer>

            {/* Bottom Navigation (Mobile) */}
            <nav className="bottom-nav" role="navigation" aria-label={t.navLabel}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`bottom-nav-item ${activeTab === tab.id ? "active" : ""}`}
                        aria-label={tab.labelText}
                        aria-current={activeTab === tab.id ? "page" : undefined}
                    >
                        <tab.icon className="w-5 h-5" />
                        <span>{tab.labelText}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default AzkarApp;
