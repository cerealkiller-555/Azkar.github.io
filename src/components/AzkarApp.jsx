import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Clock, Moon, Sun, BookOpen, Settings, CheckCircle, Share2, WiFi, WifiIcon, WifiOff, MapPin, Zap } from 'lucide-react';
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
    // Basic States
    const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
    const isLocalhost = typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname);
    const backendAvailable = Boolean(apiBaseUrl) || isLocalhost;
    
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("azkarDarkMode") === "true");
    const [language, setLanguage] = useState(() => localStorage.getItem("azkar_language") || "ar");
    const [activeTab, setActiveTab] = useState(() => localStorage.getItem("azkar_activeTab") || "morning");

    const apiUrl = useCallback((path) => {
        if (!path.startsWith('/')) return path;
        return apiBaseUrl ? `${apiBaseUrl}${path}` : path;
    }, [apiBaseUrl]);

    const t = useMemo(() => I18N[language] || I18N.ar, [language]);
    
    const [userProfile, setUserProfile] = useState(() => readJson("azkar_user", { name: "", email: "" }));
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const saved = readJson("azkar_user", null);
        return Boolean(saved && (saved.name || saved.email));
    });

    const userSuffix = useMemo(() => (isLoggedIn && userProfile.email ? `_${userProfile.email}` : ""), [isLoggedIn, userProfile.email]);

    const [prayerTimes, setPrayerTimes] = useState(null);
    const [location, setLocation] = useState(() => readJson("azkar_location", { city: "Cairo", country: "EG" }));
    const [currentTime, setCurrentTime] = useState(new Date());

    const [completedAzkar, setCompletedAzkar] = useState({});
    const [azkarProgress, setAzkarProgress] = useState({});
    const [prayerChecklist, setPrayerChecklist] = useState({});
    const [streak, setStreak] = useState({ count: 0, lastDate: null });
    const [customDuas, setCustomDuas] = useState(() => readJson("azkar_customDuas", defaultCustomDuas));
    const [newDua, setNewDua] = useState("");
    
    const [expandedBenefits, setExpandedBenefits] = useState({});
    const [countAnimation, setCountAnimation] = useState(null);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [highlightedZikr, setHighlightedZikr] = useState(null);
    const mainRef = useRef(null);
    const toastShownRef = useRef(new Set());
    const completedAzkarRef = useRef(completedAzkar);

    useEffect(() => {
        if (!isLoggedIn) return;
        const suffix = `_${userProfile.email}`;
        setCompletedAzkar(readDailyState(`azkar_completed${suffix}`));
        setAzkarProgress(readDailyState(`azkar_progress${suffix}`));
        setPrayerChecklist(readDailyState(`azkar_prayerChecklist${suffix}`));
        setStreak(readJson(`azkar_streak${suffix}`, { count: 0, lastDate: null }));
    }, [isLoggedIn, userProfile.email]);

    useEffect(() => {
        completedAzkarRef.current = completedAzkar;
    }, [completedAzkar]);

    const currentAzkarList = useMemo(() => {
        if (activeTab === "morning") return azkar.morning;
        if (activeTab === "evening") return azkar.evening;
        if (activeTab === "sleeping") return azkar.sleeping;
        if (activeTab === "prayer_azkar") return azkar.prayerAzkar;
        return [];
    }, [activeTab]);

    const progressPercentage = useMemo(() => {
        if (!currentAzkarList.length) return 0;
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

    const morningCompleted = useMemo(() => azkar.morning.every((item) => completedAzkar[`morning_${item.id}`]), [completedAzkar]);
    const eveningCompleted = useMemo(() => azkar.evening.every((item) => completedAzkar[`evening_${item.id}`]), [completedAzkar]);
    const prayersCompleted = useMemo(() => PRAYER_CHECKLIST.every((item) => prayerChecklist[item.id]), [prayerChecklist]);
    const dailyGoalsComplete = morningCompleted && eveningCompleted && prayersCompleted;

    const fetchPrayerTimes = useCallback(async () => {
        try {
            const now = new Date();
            const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
            const response = await fetch(`https://api.aladhan.com/v1/timingsByCity/${date}?city=${encodeURIComponent(location.city)}&country=${encodeURIComponent(location.country)}&method=5`);
            const data = await response.json();
            if (data.code === 200) { setPrayerTimes(data.data.timings); return; }
        } catch (e) { console.error(e); }
        setPrayerTimes(OFFLINE_PRAYER_TIMES);
    }, [location]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => { fetchPrayerTimes(); }, [fetchPrayerTimes]);

    // Persistent Storage
    useEffect(() => {
        if (!isLoggedIn) return;
        const today = new Date().toDateString();
        localStorage.setItem(`azkar_progress${userSuffix}`, JSON.stringify({ date: today, items: azkarProgress }));
        localStorage.setItem(`azkar_completed${userSuffix}`, JSON.stringify({ date: today, items: completedAzkar }));
        localStorage.setItem(`azkar_prayerChecklist${userSuffix}`, JSON.stringify({ date: today, items: prayerChecklist }));
        localStorage.setItem(`azkar_streak${userSuffix}`, JSON.stringify(streak));
    }, [azkarProgress, completedAzkar, prayerChecklist, streak, userSuffix, isLoggedIn]);

    useEffect(() => { localStorage.setItem("azkar_activeTab", activeTab); }, [activeTab]);
    useEffect(() => {
        localStorage.setItem("azkarDarkMode", String(isDarkMode));
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);
    useEffect(() => { localStorage.setItem("azkar_language", language); }, [language]);

    useEffect(() => {
        const handleBeforeInstall = (e) => { e.preventDefault(); setDeferredPrompt(e); };
        window.addEventListener("beforeinstallprompt", handleBeforeInstall);
        return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    }, []);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const handleLogin = (profile, mode) => {
        const user = { name: profile.name.trim(), email: profile.email.trim().toLowerCase() };
        setUserProfile(user);
        setIsLoggedIn(true);
        localStorage.setItem("azkar_user", JSON.stringify(user));
        showToast(t.loginSaved, "success");
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUserProfile({ name: "", email: "" });
        localStorage.removeItem("azkar_user");
        showToast(t.logoutButton, "info");
    };

    const scrollToNextZikr = useCallback((currentId, list, type) => {
        const currentIndex = list.findIndex(zikr => `${type}_${zikr.id}` === currentId);
        const nextIncomplete = list.slice(currentIndex + 1).find(zikr => !completedAzkarRef.current[`${type}_${zikr.id}`]);

        if (nextIncomplete) {
            const nextId = `${type}_${nextIncomplete.id}`;
            setTimeout(() => {
                setHighlightedZikr(nextId);
                const el = document.getElementById(`zikr-${nextId}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => setHighlightedZikr(null), 2000);
            }, 600);
        } else if (list.every(z => completedAzkarRef.current[`${type}_z.id`] || `${type}_${z.id}` === currentId)) {
            showToast("🎉 " + (language === "en" ? "Category Complete!" : "تم إتمام القسم!"), "success");
        }
    }, [language]);

    const handleZikrProgress = (id, max, list, type) => {
        if (completedAzkar[id]) return;
        if (navigator.vibrate) navigator.vibrate(40);
        setCountAnimation(id);
        setTimeout(() => setCountAnimation(null), 200);

        const next = (azkarProgress[id] || 0) + 1;
        setAzkarProgress(prev => ({ ...prev, [id]: next }));

        if (next >= max) {
            setCompletedAzkar(prev => ({ ...prev, [id]: true }));
            showToast(t.progressCompleted);
            scrollToNextZikr(id, list, type);
        }
    };

    const toggleZikrComplete = (id, max) => {
        const done = !completedAzkar[id];
        setCompletedAzkar(prev => ({ ...prev, [id]: done }));
        setAzkarProgress(prev => ({ ...prev, [id]: done ? max : 0 }));
    };

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const addCustomDua = () => {
        if (!newDua.trim()) return;
        const text = newDua.trim();
        setCustomDuas(prev => [...prev, { id: Date.now(), text }]);
        setNewDua("");
        showToast(t.duaAdded);
    };

    const deleteCustomDua = (index) => {
        setCustomDuas(prev => prev.filter((_, i) => i !== index));
        showToast(t.duaDeleted, "info");
    };

    const tabs = tabConfig.map(tab => ({
        ...tab,
        icon: ICONS[tab.icon],
        labelText: language === "en" ? tab.labelEn || tab.label : tab.label
    }));

    const goals = [
        { id: "morning", label: t.goalMorning, completed: morningCompleted },
        { id: "evening", label: t.goalEvening, completed: eveningCompleted },
        { id: "prayers", label: t.goalPrayers, completed: prayersCompleted }
    ];

    const renderAzkarList = (list, type) => (
        <div className="space-y-6">
            {list.map((z, i) => (
                <ZikrCard 
                    key={`${type}_${z.id}`} zikr={z} index={i} uniqueId={`${type}_${z.id}`} t={t} language={language}
                    isCompleted={!!completedAzkar[`${type}_${z.id}`]} progress={azkarProgress[`${type}_${z.id}`] || 0}
                    progressPct={(azkarProgress[`${type}_${z.id}`] || 0) / z.count * 100} isAnimating={countAnimation === `${type}_${z.id}`}
                    isHighlighted={highlightedZikr === `${type}_${z.id}`} isExpanded={!!expandedBenefits[`${type}_${z.id}`]}
                    onToggleBenefit={() => setExpandedBenefits(prev => ({ ...prev, [`${type}_${z.id}`]: !prev[`${type}_${z.id}`] }))}
                    onToggleComplete={() => toggleZikrComplete(`${type}_${z.id}`, z.count)}
                    onProgress={(e, ref) => handleZikrProgress(`${type}_${z.id}`, z.count, list, type)}
                />
            ))}
        </div>
    );

    if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} t={t} language={language} />;

    return (
        <div className={`min-h-screen transition-all duration-500 pattern-bg ${isDarkMode ? 'dark' : ''}`} dir={language === "ar" ? "rtl" : "ltr"}>
            <OfflineBanner offline={isOffline} t={t} />
            <ToastContainer />
            <ScrollToTop t={t} />

            <header className="sticky top-0 z-50 glass-panel !rounded-none border-x-0 border-t-0 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleTabChange("morning")}>
                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg transition-transform">
                            <img src="hesnok_logo.png" alt="logo" className="w-10 h-10 rounded-lg" />
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
                        <button onClick={toggleDarkMode} className="p-2.5 rounded-xl bg-bg-surface dark:bg-slate-800 text-text-secondary border border-glass-border">
                            {isDarkMode ? <Sun className="w-5 h-5 animate-spin-slow" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button onClick={() => handleTabChange("settings")} className={`p-2.5 rounded-xl border transition-all ${activeTab === "settings" ? "bg-primary text-white" : "bg-bg-surface dark:bg-slate-800"}`}>
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                {DAILY_TAB_IDS.includes(activeTab) && (
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800/50">
                        <div className="h-full bg-gradient-to-l from-accent to-accent-dark transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }} />
                    </div>
                )}
            </header>

            <main className="container mx-auto px-4 py-8 max-w-3xl space-y-8 animate-fade-in">
                <StreakBanner streakCount={streak.count} goals={goals} t={t} />
                
                <ProgressHero
                    activeTab={activeTab}
                    progressPercentage={progressPercentage}
                    completedCount={completedCount}
                    totalCount={currentAzkarList.length}
                    resetAllProgress={() => { 
                        if(window.confirm(t.resetAllLabel)) {
                            setCompletedAzkar({}); 
                            setAzkarProgress({}); 
                        }
                    }}
                    t={t}
                    userProfile={userProfile}
                    language={language}
                />

                <div className="space-y-6">
                    {activeTab === "morning" && renderAzkarList(azkar.morning, "morning")}
                    {activeTab === "evening" && renderAzkarList(azkar.evening, "evening")}
                    {activeTab === "sleeping" && renderAzkarList(azkar.sleeping, "sleeping")}
                    {activeTab === "prayer_azkar" && renderAzkarList(azkar.prayerAzkar, "prayer_azkar")}
                    
                    {activeTab === "prayer" && (
                        <div className="animate-slide-up space-y-8">
                            <PrayerTimesSection prayerTimes={prayerTimes} location={location} t={t} language={language} />
                            <PrayerChecklist checklist={prayerChecklist} onToggle={id => setPrayerChecklist(p => ({...p, [id]: !p[id]}))} language={language} t={t} />
                        </div>
                    )}

                    {activeTab === "custom" && (
                        <CustomDuasSection 
                            customDuas={customDuas} newDua={newDua} setNewDua={setNewDua} 
                            addCustomDua={addCustomDua} deleteCustomDua={deleteCustomDua} t={t} 
                        />
                    )}

                    {activeTab === "settings" && (
                        <SettingsSection 
                            t={t} userProfile={userProfile} logout={logout} language={language} setLanguage={setLanguage} 
                            isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} location={location} setLocation={setLocation}
                            resetAllProgress={() => { setCompletedAzkar({}); setAzkarProgress({}); }}
                            deferredPrompt={deferredPrompt} installPWA={() => deferredPrompt.prompt()}
                            updateProfile={setUserProfile}
                        />
                    )}
                </div>
            </main>

            <footer className="py-20 text-center bg-white dark:bg-slate-900 border-t border-glass-border">
                <p className="text-accent font-black mb-4 tracking-[0.3em] text-[10px] uppercase">{t.appName} — {t.appTagline}</p>
                <h2 className="text-2xl font-amiri text-text-primary px-6 mb-8 italic leading-relaxed">"أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"</h2>
                <div className="flex items-center justify-center gap-4 opacity-30">
                    <div className="w-10 h-px bg-current" />
                    <BookOpen className="w-5 h-5 text-accent" />
                    <div className="w-10 h-px bg-current" />
                </div>
            </footer>

            <nav className="bottom-nav">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => handleTabChange(tab.id)} className={`bottom-nav-item ${activeTab === tab.id ? 'active' : ''}`}>
                        <tab.icon />
                        <span>{tab.labelText}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default AzkarApp;
