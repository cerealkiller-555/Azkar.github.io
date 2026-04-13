const { useState, useEffect, useMemo, useCallback, useRef } = React;
const {
    Clock,
    Moon,
    Sun,
    MapPin,
    BookOpen,
    Plus,
    Settings,
    CheckCircle,
    Share2,
    Trash2,
    Heart,
    Info,
    ArrowUp,
    ChevronDown,
    Wifi,
    WifiOff,
    Download,
    RotateCcw
} = LucideReact;

const ICONS = { Clock, Moon, Sun, BookOpen, Heart, Settings };
const { azkar, defaultCustomDuas, tabs: tabConfig } = window.AZKAR_DATA;
const DAILY_TAB_IDS = ["morning", "evening", "sleeping", "prayer_azkar"];
const OFFLINE_PRAYER_TIMES = {
    Fajr: "04:45",
    Sunrise: "06:15",
    Dhuhr: "11:50",
    Asr: "15:10",
    Maghrib: "17:30",
    Isha: "19:00"
};
const PRAYER_CHECKLIST = [
    { id: "fajr", ar: "الفجر", en: "Fajr" },
    { id: "dhuhr", ar: "الظهر", en: "Dhuhr" },
    { id: "asr", ar: "العصر", en: "Asr" },
    { id: "maghrib", ar: "المغرب", en: "Maghrib" },
    { id: "isha", ar: "العشاء", en: "Isha" }
];

const I18N = {
    ar: {
        appName: "أذكاري",
        appTagline: "الحِصن المنيع للمسلم",
        loginTitle: "تسجيل الدخول",
        loginSubtitle: "احفظ بياناتك وتقدمك على هذا الجهاز",
        nameLabel: "الاسم الكامل",
        emailLabel: "البريد الإلكتروني",
        loginButton: "دخول",
        logoutButton: "تسجيل الخروج",
        settingsTitle: "الإعدادات",
        languageTitle: "اللغة",
        languageAr: "العربية",
        languageEn: "English",
        streakTitle: "سلسلة الإنجاز",
        progressLabel: "التقدم",
        streakSubtitle: "حافظ على إنجاز الأذكار والصلوات اليومية",
        streakDays: "أيام متتالية",
        goalsTitle: "أهداف اليوم",
        goalMorning: "أذكار الصباح",
        goalEvening: "أذكار المساء",
        goalPrayers: "الصلوات الخمس",
        prayerChecklistTitle: "تسجيل الصلوات",
        prayerChecklistNote: "علّم كل صلاة عند انتهائها",
        profileTitle: "الملف الشخصي",
        profileNote: "بياناتك محفوظة محلياً على هذا الجهاز",
        updateProfile: "تحديث البيانات",
        loginSaved: "تم حفظ بياناتك",
        loginRequired: "الرجاء تسجيل الدخول للمتابعة",
        duaAdded: "تمت إضافة الدعاء بنجاح",
        duaDeleted: "تم حذف الدعاء",
        pwaInstall: "تم البدء في تثبيت التطبيق",
        progressTitleMorning: "☀️ أذكار الصباح",
        progressTitleEvening: "🌙 أذكار المساء",
        progressTitleSleeping: "🌌 أذكار النوم",
        progressTitlePrayer: "🕌 أذكار بعد الصلاة",
        progressText: "تم إنجاز",
        progressOf: "من",
        progressAzkar: "أذكار",
        resetProgress: "إعادة تعيين",
        prayerTimesTitle: "🕌 مواقيت الصلاة",
        prayerTimesLoading: "جاري تحميل المواقيت...",
        customTitle: "أدعيتك الخاصة",
        customSubtitle: "أضف أدعيتك المفضلة هنا واحتفظ بها دائماً",
        customPlaceholder: "اكتب دعاءً جديداً...",
        addDua: "إضافة دعاء",
        noDuas: "لا توجد أدعية بعد",
        noDuasHint: "أضف أدعيتك المفضلة عبر الحقل أعلاه",
        locationTitle: "الموقع الافتراضي",
        cityLabel: "المدينة",
        countryLabel: "كود الدولة",
        appearanceTitle: "المظهر",
        darkOn: "الوضع الداكن مُفعّل",
        lightOn: "الوضع الفاتح مُفعّل",
        aboutTitle: "حول التطبيق",
        offline: "غير متصل",
        online: "متصل",
        offlineNotice: "أنت الآن بدون إنترنت — التطبيق يعمل بشكل طبيعي",
        onlineNotice: "تم إعادة الاتصال بالإنترنت",
        shareCopy: "تم نسخ الذكر",
        shareTitle: "مشاركة",
        shareLabel: "مشاركة الذكر",
        markComplete: "تحديد كمكتمل",
        resetCounter: "إعادة تعيين",
        doneLabel: "تم ✓",
        requiredLabel: "المطلوب",
        benefitShow: "عرض الفضل والمصدر",
        benefitHide: "إخفاء الفضل والمصدر",
        deleteDua: "حذف الدعاء",
        scrollTopLabel: "العودة للأعلى",
        navLabel: "القائمة الرئيسية",
        resetAllLabel: "إعادة تعيين جميع الأذكار",
        resetAllToast: "تم إعادة تعيين جميع الأذكار",
        progressResetOne: "تم إعادة تعيين العداد",
        progressCompleted: "تم إتمام الذكر ✓"
    },
    en: {
        appName: "Azkar",
        appTagline: "Your daily spiritual companion",
        loginTitle: "Sign In",
        loginSubtitle: "Save your info and progress on this device",
        nameLabel: "Full name",
        emailLabel: "Email",
        loginButton: "Continue",
        logoutButton: "Sign out",
        settingsTitle: "Settings",
        languageTitle: "Language",
        languageAr: "العربية",
        languageEn: "English",
        streakTitle: "Streak",
        progressLabel: "Progress",
        streakSubtitle: "Keep up your daily azkar and prayers",
        streakDays: "days",
        goalsTitle: "Today’s goals",
        goalMorning: "Morning azkar",
        goalEvening: "Evening azkar",
        goalPrayers: "Five prayers",
        prayerChecklistTitle: "Prayer checklist",
        prayerChecklistNote: "Mark each prayer when completed",
        profileTitle: "Profile",
        profileNote: "Your data is stored locally on this device",
        updateProfile: "Update profile",
        loginSaved: "Profile saved",
        loginRequired: "Please sign in to continue",
        duaAdded: "Duaa added",
        duaDeleted: "Duaa deleted",
        pwaInstall: "App installation started",
        progressTitleMorning: "☀️ Morning Azkar",
        progressTitleEvening: "🌙 Evening Azkar",
        progressTitleSleeping: "🌌 Sleeping Azkar",
        progressTitlePrayer: "🕌 After Prayer Azkar",
        progressText: "Completed",
        progressOf: "of",
        progressAzkar: "azkar",
        resetProgress: "Reset",
        prayerTimesTitle: "🕌 Prayer Times",
        prayerTimesLoading: "Loading prayer times...",
        customTitle: "Your duaas",
        customSubtitle: "Add your favorite duaas and keep them here",
        customPlaceholder: "Type a new duaa...",
        addDua: "Add duaa",
        noDuas: "No duaas yet",
        noDuasHint: "Add your favorite duaas above",
        locationTitle: "Default location",
        cityLabel: "City",
        countryLabel: "Country code",
        appearanceTitle: "Appearance",
        darkOn: "Dark mode on",
        lightOn: "Light mode on",
        aboutTitle: "About",
        offline: "Offline",
        online: "Online",
        offlineNotice: "You are offline — the app still works",
        onlineNotice: "Back online",
        shareCopy: "Copied",
        shareTitle: "Share",
        shareLabel: "Share azkar",
        markComplete: "Mark complete",
        resetCounter: "Reset",
        doneLabel: "Done",
        requiredLabel: "Required",
        benefitShow: "Show benefit and source",
        benefitHide: "Hide benefit and source",
        deleteDua: "Delete duaa",
        scrollTopLabel: "Back to top",
        navLabel: "Main navigation",
        resetAllLabel: "Reset all azkar",
        resetAllToast: "All azkar reset",
        progressResetOne: "Counter reset",
        progressCompleted: "Marked complete"
    }
};

const toastQueue = [];
let toastListener = null;

function showToast(message, type = "success", duration = 2500) {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };

    toastQueue.push(toast);
    if (toastListener) {
        toastListener([...toastQueue]);
    }

    window.setTimeout(() => {
        const index = toastQueue.findIndex((item) => item.id === id);
        if (index === -1) {
            return;
        }

        toastQueue[index].exiting = true;
        if (toastListener) {
            toastListener([...toastQueue]);
        }

        window.setTimeout(() => {
            const removeIndex = toastQueue.findIndex((item) => item.id === id);
            if (removeIndex > -1) {
                toastQueue.splice(removeIndex, 1);
            }

            if (toastListener) {
                toastListener([...toastQueue]);
            }
        }, 300);
    }, duration);
}

function readJson(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        return fallback;
    }
}

function readDailyState(key) {
    const saved = readJson(key, null);
    if (!saved || saved.date !== new Date().toDateString()) {
        return {};
    }

    return saved.items || {};
}

function dateKey(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function isSameDay(a, b) {
    return dateKey(a) === dateKey(b);
}

function isYesterday(previous, today) {
    const oneDay = 24 * 60 * 60 * 1000;
    return dateKey(today) - dateKey(previous) === oneDay;
}

const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        toastListener = setToasts;
        return () => {
            toastListener = null;
        };
    }, []);

    if (!toasts.length) {
        return null;
    }

    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast toast-${toast.type} ${toast.exiting ? "toast-exit" : ""}`}>
                    {toast.type === "success" && "✓ "}
                    {toast.type === "info" && "ℹ "}
                    {toast.type === "warning" && "⚠ "}
                    {toast.message}
                </div>
            ))}
        </div>
    );
};

const ScrollToTop = ({ t }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <button
            className={`scroll-top-btn ${visible ? "visible" : ""}`}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label={t.scrollTopLabel}
        >
            <ArrowUp className="w-6 h-6" />
        </button>
    );
};

const OfflineBanner = ({ offline, t }) => {
    if (!offline) {
        return null;
    }

    return (
        <div className="offline-banner">
            <WifiOff className="w-4 h-4" />
            <span>{t.offlineNotice}</span>
        </div>
    );
};

const PrayerTimesSection = ({ prayerTimes, location, t, language }) => {
    const prayerCards = [
        { name: "الفجر", key: "Fajr", icon: "🌅", color: "from-blue-600 to-indigo-600" },
        { name: "الشروق", key: "Sunrise", icon: "☀️", color: "from-amber-400 to-orange-500" },
        { name: "الظهر", key: "Dhuhr", icon: "🌞", color: "from-yellow-400 to-amber-500" },
        { name: "العصر", key: "Asr", icon: "🌤️", color: "from-orange-500 to-red-500" },
        { name: "المغرب", key: "Maghrib", icon: "🌆", color: "from-purple-600 to-pink-600" },
        { name: "العشاء", key: "Isha", icon: "🌙", color: "from-indigo-700 to-slate-900" }
    ];

    return (
        <div className="animate-slide-up">
            <div className="mb-6 text-center">
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-2">{t.prayerTimesTitle}</h2>
                <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
                    {location.city} — {new Date().toLocaleDateString(language === "en" ? "en-US" : "ar-EG", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    })}
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {prayerTimes ? prayerCards.map((prayer) => (
                    <div key={prayer.key} className={`bg-gradient-to-br ${prayer.color} p-5 md:p-6 rounded-2xl text-white shadow-lg hover:scale-[1.03] transition-all group cursor-default`}>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform duration-500 block">{prayer.icon}</span>
                            <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
                        </div>
                        <h3 className="text-sm md:text-base font-bold opacity-80 mb-1">{prayer.name}</h3>
                        <p className="text-2xl md:text-3xl font-black tracking-tighter">{prayerTimes[prayer.key] || "00:00"}</p>
                    </div>
                )) : (
                    <div className="col-span-full py-16 text-center">
                        <div className="inline-block w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-slate-400 font-bold">{t.prayerTimesLoading}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const CustomDuasSection = ({ customDuas, newDua, setNewDua, addCustomDua, deleteCustomDua, t }) => (
    <div className="animate-slide-up space-y-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl">
            <h2 className="text-2xl font-black mb-1 flex items-center gap-3">
                <Heart className="w-7 h-7 text-rose-300" />
                {t.customTitle}
            </h2>
            <p className="opacity-70 text-sm font-medium">{t.customSubtitle}</p>
        </div>

        <div className="flex gap-2 bg-white dark:bg-slate-800/90 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50 p-1.5">
            <input
                type="text"
                value={newDua}
                onChange={(event) => setNewDua(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && addCustomDua()}
                placeholder={t.customPlaceholder}
                className="flex-1 px-5 py-3 bg-transparent text-slate-800 dark:text-white text-base focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                id="custom-dua-input"
            />
            <button
                onClick={addCustomDua}
                className="px-6 py-3 bg-indigo-600 text-white font-black text-sm rounded-xl hover:bg-indigo-500 shadow-md transition-all active:scale-95"
                id="add-dua-btn"
                aria-label={t.addDua}
            >
                <Plus className="w-5 h-5" />
            </button>
        </div>

        <div className="space-y-3 stagger-children">
            {!customDuas.length && (
                <div className="py-12 text-center">
                    <Heart className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-400 dark:text-slate-500 font-bold">{t.noDuas}</p>
                    <p className="text-sm text-slate-300 dark:text-slate-600">{t.noDuasHint}</p>
                </div>
            )}

            {customDuas.map((dua, index) => (
                <div key={`${dua}-${index}`} className="group p-5 bg-white dark:bg-slate-800/90 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700/50 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between gap-4">
                        <p className="text-lg md:text-xl font-amiri text-slate-800 dark:text-slate-100 leading-relaxed flex-1">{dua}</p>
                        <button
                            onClick={() => deleteCustomDua(index)}
                            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                            aria-label={t.deleteDua}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const SettingsSection = ({
    deferredPrompt,
    installPWA,
    location,
    setLocation,
    isDarkMode,
    toggleDarkMode,
    resetAllProgress,
    userProfile,
    updateProfile,
    logout,
    language,
    setLanguage,
    t
}) => (
    <div className="animate-slide-up space-y-6">
        {deferredPrompt && (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl shadow-lg border border-emerald-100 dark:border-emerald-800/30 animate-scale-in">
                <h3 className="text-xl font-black text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-3">
                    <Download className="w-6 h-6" />
                    تثبيت كمتطبيق
                </h3>
                <p className="text-sm text-emerald-600 dark:text-emerald-500 mb-6 font-medium">يمكنك تثبيت أذكاري على جهازك للوصول السريع والعمل بدون إنترنت دائماً.</p>
                <button
                    onClick={installPWA}
                    className="w-full py-4 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-500 transition-all active:scale-95"
                >
                    تثبيت الآن
                </button>
            </div>
        )}

        <div className="p-6 bg-white dark:bg-slate-800/90 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50">
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-emerald-500" />
                    {t.locationTitle}
                </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 mr-1" htmlFor="city-input">{t.cityLabel}</label>
                    <input
                        id="city-input"
                        type="text"
                        value={location.city}
                        onChange={(event) => setLocation({ ...location, city: event.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-emerald-500 outline-none text-slate-800 dark:text-white font-bold text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 mr-1" htmlFor="country-input">{t.countryLabel}</label>
                    <input
                        id="country-input"
                        type="text"
                        value={location.country}
                        onChange={(event) => setLocation({ ...location, country: event.target.value.toUpperCase() })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-emerald-500 outline-none text-slate-800 dark:text-white font-bold text-sm"
                    />
                </div>
            </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800/90 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50">
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                {isDarkMode ? <Moon className="w-6 h-6 text-indigo-400" /> : <Sun className="w-6 h-6 text-amber-500" />}
                {t.appearanceTitle}
            </h3>
            <button
                onClick={toggleDarkMode}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
            >
                <span className="text-slate-700 dark:text-slate-300 font-bold">{isDarkMode ? t.darkOn : t.lightOn}</span>
                <div className={`w-12 h-7 rounded-full transition-colors duration-300 flex items-center p-1 ${isDarkMode ? "bg-emerald-500" : "bg-slate-300"}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${isDarkMode ? "-translate-x-5" : ""}`} />
                </div>
            </button>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800/90 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50">
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                <Settings className="w-6 h-6 text-emerald-500" />
                {t.languageTitle}
            </h3>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setLanguage("ar")}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                        language === "ar"
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                >
                    {t.languageAr}
                </button>
                <button
                    onClick={() => setLanguage("en")}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                        language === "en"
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                >
                    {t.languageEn}
                </button>
            </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800/90 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50">
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4 flex items-center gap-3">
                <Heart className="w-6 h-6 text-emerald-500" />
                {t.profileTitle}
            </h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-4 font-medium">{t.profileNote}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 mr-1" htmlFor="profile-name">{t.nameLabel}</label>
                    <input
                        id="profile-name"
                        type="text"
                        value={userProfile.name}
                        onChange={(event) => updateProfile({ ...userProfile, name: event.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-emerald-500 outline-none text-slate-800 dark:text-white font-bold text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 mr-1" htmlFor="profile-email">{t.emailLabel}</label>
                    <input
                        id="profile-email"
                        type="email"
                        value={userProfile.email}
                        onChange={(event) => updateProfile({ ...userProfile, email: event.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-emerald-500 outline-none text-slate-800 dark:text-white font-bold text-sm"
                    />
                </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <button
                    onClick={() => updateProfile(userProfile)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-500 transition-all"
                >
                    {t.updateProfile}
                </button>
                <button
                    onClick={logout}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-300 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
                >
                    {t.logoutButton}
                </button>
            </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800/90 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50">
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4 flex items-center gap-3">
                <Download className="w-6 h-6 text-emerald-500" />
                {t.aboutTitle}
            </h3>
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
                    <span className="text-sm text-emerald-700 dark:text-emerald-400 font-bold">✅ يعمل بدون إنترنت</span>
                    <span className="text-xs text-emerald-500 dark:text-emerald-300 font-medium">PWA</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-bold">💾 يحفظ تقدمك تلقائياً</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">localStorage</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-bold">🔄 يُعاد التعيين تلقائياً كل يوم</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">يومي</span>
                </div>
            </div>
        </div>

        <button
            onClick={() => {
                resetAllProgress();
                showToast(t.resetAllToast, "info");
            }}
            className="w-full py-4 rounded-2xl bg-rose-500 text-white text-base font-black shadow-lg shadow-rose-200 dark:shadow-none hover:bg-rose-400 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            id="reset-all-btn"
        >
            <RotateCcw className="w-5 h-5" />
            {t.resetAllLabel}
        </button>
    </div>
);

const ProgressHero = ({ activeTab, progressPercentage, completedCount, totalCount, resetAllProgress, t }) => {
    if (!DAILY_TAB_IDS.includes(activeTab)) {
        return null;
    }

    const themeClass = activeTab === "morning"
        ? "from-amber-400 to-orange-600"
        : activeTab === "evening"
            ? "from-indigo-600 to-purple-800"
            : activeTab === "sleeping"
                ? "from-slate-800 to-slate-950"
                : "from-emerald-600 to-teal-800";

    const title = activeTab === "morning"
        ? t.progressTitleMorning
        : activeTab === "evening"
            ? t.progressTitleEvening
            : activeTab === "sleeping"
                ? t.progressTitleSleeping
                : t.progressTitlePrayer;

    const Icon = activeTab === "morning"
        ? Sun
        : activeTab === "evening" || activeTab === "sleeping"
            ? Moon
            : BookOpen;

    return (
        <div className={`mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-br transition-all duration-500 shadow-2xl relative overflow-hidden ${themeClass} text-white`}>
            <div className="absolute top-0 right-0 p-6 opacity-[0.08] float-slow">
                <Icon className="w-40 h-40" />
            </div>

            <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-black mb-2">{title}</h2>
                        <p className="text-white/70 text-sm md:text-base font-medium">
                            {t.progressText} {completedCount} {t.progressOf} {totalCount} {t.progressAzkar} • {progressPercentage}%
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20 text-center">
                            <span className="text-2xl md:text-3xl font-black block leading-none mb-0.5">{progressPercentage}%</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{t.progressLabel}</span>
                        </div>
                        {progressPercentage > 0 && (
                            <button
                                onClick={resetAllProgress}
                                className="p-2.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-white/80 hover:text-white hover:bg-white/25 transition-all active:scale-95"
                                title={t.resetProgress}
                                aria-label={t.resetProgress}
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-4 h-2 rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full rounded-full bg-white/80 transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }} />
                </div>
            </div>
        </div>
    );
};

const StreakBanner = ({ streakCount, goals, t }) => {
    return (
        <div className="mb-8 p-6 md:p-7 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/50 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mb-1">{t.streakTitle}</h3>
                    <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">{t.streakSubtitle}</p>
                </div>
                <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{streakCount}</span>
                    <span className="text-xs font-bold text-emerald-500">{t.streakDays}</span>
                </div>
            </div>

            <div className="mt-5">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-widest">{t.goalsTitle}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {goals.map((goal) => (
                        <div
                            key={goal.id}
                            className={`p-3 rounded-2xl border flex items-center gap-3 text-sm font-bold transition-all ${
                                goal.completed
                                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200/70 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300"
                                    : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                            }`}
                        >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                goal.completed ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                            }`}>
                                <CheckCircle className="w-4 h-4" />
                            </span>
                            <span>{goal.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const PrayerChecklist = ({ checklist, onToggle, language, t }) => (
    <div className="mt-8 p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/50 shadow-lg">
        <div className="flex items-center justify-between mb-4">
            <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white">{t.prayerChecklistTitle}</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">{t.prayerChecklistNote}</p>
            </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {PRAYER_CHECKLIST.map((prayer) => {
                const checked = Boolean(checklist[prayer.id]);
                return (
                    <button
                        key={prayer.id}
                        onClick={() => onToggle(prayer.id)}
                        className={`p-3 rounded-2xl border text-sm font-bold transition-all ${
                            checked
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200/40"
                                : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                        }`}
                    >
                        {language === "en" ? prayer.en : prayer.ar}
                    </button>
                );
            })}
        </div>
    </div>
);

const LoginScreen = ({ onLogin, t, language }) => {
    const [form, setForm] = useState({ name: "", email: "" });

    return (
        <div
            className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12"
            dir={language === "en" ? "ltr" : "rtl"}
            style={{ fontFamily: language === "en" ? "'Inter', sans-serif" : "'Cairo', sans-serif" }}
        >
            <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 md:p-8">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">{t.loginTitle}</h1>
                    <p className="text-sm text-slate-400 font-medium">{t.loginSubtitle}</p>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-black text-slate-400" htmlFor="login-name">{t.nameLabel}</label>
                        <input
                            id="login-name"
                            type="text"
                            value={form.name}
                            onChange={(event) => setForm({ ...form, name: event.target.value })}
                            className="w-full mt-2 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none text-slate-800 font-bold"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-black text-slate-400" htmlFor="login-email">{t.emailLabel}</label>
                        <input
                            id="login-email"
                            type="email"
                            value={form.email}
                            onChange={(event) => setForm({ ...form, email: event.target.value })}
                            className="w-full mt-2 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none text-slate-800 font-bold"
                        />
                    </div>
                    <button
                        onClick={() => onLogin(form)}
                        className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-500 transition-all"
                    >
                        {t.loginButton}
                    </button>
                    <p className="text-xs text-slate-400 font-medium">{t.loginRequired}</p>
                </div>
            </div>
        </div>
    );
};

const AzkarApp = () => {
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
    const mainRef = useRef(null);

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

    const handleZikrProgress = useCallback((id, count) => {
        if (completedAzkar[id]) {
            return;
        }

        if (navigator.vibrate) {
            navigator.vibrate(40);
        }

        setCountAnimation(id);
        window.setTimeout(() => setCountAnimation(null), 300);

        setAzkarProgress((prev) => {
            const nextCount = (prev[id] || 0) + 1;
            const cappedCount = Math.min(nextCount, count);

            if (cappedCount >= count) {
                setCompletedAzkar((current) => ({ ...current, [id]: true }));
                showToast(t.progressCompleted);
                if (navigator.vibrate) {
                    navigator.vibrate([100, 50, 100]);
                }
            }

            return { ...prev, [id]: cappedCount };
        });
    }, [completedAzkar, t]);

    const toggleZikrComplete = useCallback((id, count) => {
        setCompletedAzkar((prev) => {
            const nextCompleted = !prev[id];

            setAzkarProgress((current) => ({
                ...current,
                [id]: nextCompleted ? count : 0
            }));

            showToast(nextCompleted ? t.progressCompleted : t.progressResetOne, nextCompleted ? "success" : "info");
            return { ...prev, [id]: nextCompleted };
        });
    }, [t]);

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
        <div className="space-y-5 stagger-children">
            {list.map((zikr, index) => {
                const uniqueId = `${type}_${zikr.id}`;
                const isCompleted = Boolean(completedAzkar[uniqueId]);
                const progress = azkarProgress[uniqueId] || 0;
                const isExpanded = Boolean(expandedBenefits[uniqueId]);
                const progressPct = Math.min((progress / zikr.count) * 100, 100);
                const isAnimating = countAnimation === uniqueId;

                return (
                    <ZikrCard
                        key={uniqueId}
                        zikr={zikr}
                        index={index}
                        t={t}
                        isCompleted={isCompleted}
                        progress={progress}
                        isExpanded={isExpanded}
                        progressPct={progressPct}
                        isAnimating={isAnimating}
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

                            handleZikrProgress(uniqueId, zikr.count);
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
            style={{ fontFamily: language === "en" ? "'Inter', sans-serif" : "'Cairo', sans-serif" }}
        >
            <OfflineBanner offline={isOffline} t={t} />
            <ToastContainer />
            <ScrollToTop t={t} />

            <header className="sticky top-0 z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/50">
                <div className="container mx-auto px-4 py-3 md:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 group">
                            <img src="azkari_logo.png" alt="أذكاري" className="w-10 h-10 md:w-12 md:h-12 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-md" />
                            <div>
                                <h1 className="text-lg md:text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">{t.appName}</h1>
                                <p className="text-[10px] md:text-xs text-emerald-600 dark:text-emerald-400 font-bold leading-tight">{t.appTagline}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border border-slate-200/70 dark:border-slate-700/50">
                                <Clock className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm font-mono tracking-wider">{formatTime()}</span>
                            </div>

                            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                                isOffline
                                    ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200/70 dark:border-amber-800/50"
                                    : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200/70 dark:border-emerald-800/50"
                            }`}>
                                {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                                <span>{isOffline ? t.offline : t.online}</span>
                            </div>

                            <button
                                onClick={toggleDarkMode}
                                className="p-2.5 rounded-xl bg-slate-50 dark:bg-emerald-500/10 text-slate-500 dark:text-emerald-400 border border-slate-200/70 dark:border-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                                aria-label={isDarkMode ? t.lightOn : t.darkOn}
                            >
                                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {["morning", "evening"].includes(activeTab) && (
                    <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
                        <div className="h-full bg-gradient-to-l from-emerald-400 to-emerald-600 transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }} />
                    </div>
                )}
            </header>

            <div className="hidden md:block container mx-auto px-4 py-6">
                <div className="max-w-3xl mx-auto">
                    <div className="p-1.5 bg-white dark:bg-slate-800/90 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50 flex gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl transition-all duration-300 flex-1 font-bold text-sm ${
                                    activeTab === tab.id
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

            <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-10 md:py-14 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-slate-400 dark:text-slate-500 font-bold mb-4 tracking-widest text-xs uppercase">تطبيق الأذكار اليومية</p>
                    <h2 className="text-xl md:text-2xl font-amiri text-slate-700 dark:text-slate-300 mb-6 italic">"أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"</h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-10 h-px bg-slate-200 dark:bg-slate-800" />
                        <BookOpen className="w-6 h-6 text-emerald-500 opacity-50" />
                        <div className="w-10 h-px bg-slate-200 dark:bg-slate-800" />
                    </div>
                </div>
            </footer>

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

const ZikrCard = ({
    zikr,
    index,
    t,
    isCompleted,
    progress,
    isExpanded,
    progressPct,
    isAnimating,
    onToggleBenefit,
    onToggleComplete,
    onProgress
}) => {
    const buttonRef = useRef(null);

    return (
        <div
            className={`zikr-card relative overflow-hidden rounded-3xl transition-all duration-500 ${
                isCompleted
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400/50 dark:border-emerald-500/30"
                    : "bg-white dark:bg-slate-800/90 border-slate-100 dark:border-slate-700/50"
            } border shadow-lg hover:shadow-xl`}
            style={{ animationDelay: `${index * 60}ms` }}
        >
            <div className="h-1 w-full bg-slate-100 dark:bg-slate-700/50">
                <div
                    className={`h-full transition-all duration-500 ease-out ${isCompleted ? "bg-emerald-500" : "bg-emerald-400"}`}
                    style={{ width: `${progressPct}%` }}
                />
            </div>

            <div className="p-5 md:p-7">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black ${
                            isCompleted
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                        }`}>
                            {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
                        </div>
                        {zikr.title && (
                            <h3 className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400 truncate">{zikr.title}</h3>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                            onClick={() => {
                                const shareText = `${zikr.title ? `${zikr.title}\n` : ""}${zikr.text}\n\n${t.appName}`;
                                if (navigator.share) {
                                    navigator.share({ title: t.appName, text: shareText });
                                } else if (navigator.clipboard) {
                                    navigator.clipboard.writeText(shareText);
                                    showToast(t.shareCopy);
                                }
                            }}
                            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all hover:scale-105 active:scale-95"
                            title={t.shareTitle}
                            aria-label={t.shareLabel}
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onToggleComplete}
                            className={`p-2 rounded-xl transition-all hover:scale-105 active:scale-95 ${
                                isCompleted
                                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-200/50 dark:shadow-none"
                                    : "bg-slate-50 dark:bg-slate-700/50 text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
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
                                ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 cursor-default"
                                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 dark:shadow-none cursor-pointer"
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
                        <div className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-black text-sm">{zikr.count}</div>
                    </div>
                </div>

                {(zikr.benefit || zikr.source) && (
                    <div>
                        <button
                            onClick={onToggleBenefit}
                            className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-bold hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors w-full"
                        >
                            <Info className="w-3.5 h-3.5" />
                            <span>{isExpanded ? t.benefitHide : t.benefitShow}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                        </button>

                        {isExpanded && (
                            <div className="mt-3 space-y-2 animate-slide-up">
                                {zikr.benefit && (
                                    <div className="flex gap-3 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20">
                                        <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-500 h-fit flex-shrink-0">
                                            <Info className="w-3.5 h-3.5" />
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{zikr.benefit}</p>
                                    </div>
                                )}
                                {zikr.source && (
                                    <div className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-700/40">
                                        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 h-fit flex-shrink-0">
                                            <BookOpen className="w-3.5 h-3.5" />
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">{zikr.source}</p>
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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AzkarApp />);
