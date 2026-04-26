import React from 'react';
import { Download, MapPin, Moon, Sun, Settings, Heart, RotateCcw } from 'lucide-react';

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
            <div className="p-6 bg-[#D4A76A]/10 dark:bg-[#D4A76A]/20 rounded-2xl shadow-lg border border-[#D4A76A]/20 dark:border-[#D4A76A]/30 animate-scale-in">
                <h3 className="text-xl font-black text-[#423E87] dark:text-[#D4A76A] mb-3 flex items-center gap-3">
                    <Download className="w-6 h-6" />
                    تثبيت كمتطبيق
                </h3>
                <p className="text-sm text-[#B18F67] dark:text-[#B2AE97] mb-6 font-medium">يمكنك تثبيت حصنك على جهازك للوصول السريع والعمل بدون إنترنت دائماً.</p>
                <button
                    onClick={installPWA}
                    className="w-full py-4 rounded-xl bg-[#423E87] text-white font-black hover:bg-[#2E2A5E] transition-all active:scale-95 shadow-lg shadow-[#423E87]/20"
                >
                    تثبيت الآن
                </button>
            </div>
        )}

        <div className="p-6 bg-white dark:bg-slate-800/90 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-[#D4A76A]" />
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
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-[#D4A76A] outline-none text-slate-800 dark:text-white font-bold text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 mr-1" htmlFor="country-input">{t.countryLabel}</label>
                    <input
                        id="country-input"
                        type="text"
                        value={location.country}
                        onChange={(event) => setLocation({ ...location, country: event.target.value.toUpperCase() })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-[#D4A76A] outline-none text-slate-800 dark:text-white font-bold text-sm"
                    />
                </div>
            </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800/90 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                {isDarkMode ? <Moon className="w-6 h-6 text-indigo-400" /> : <Sun className="w-6 h-6 text-amber-500" />}
                {t.appearanceTitle}
            </h3>
            <button
                onClick={toggleDarkMode}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-[#D4A76A] dark:hover:border-[#D4A76A] transition-all"
            >
                <span className="text-slate-800 dark:text-slate-300 font-bold">{isDarkMode ? t.darkOn : t.lightOn}</span>
                <div className={`w-12 h-7 rounded-full transition-colors duration-300 flex items-center p-1 ${isDarkMode ? "bg-[#D4A76A]" : "bg-slate-300"}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${isDarkMode ? "-translate-x-5" : ""}`} />
                </div>
            </button>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800/90 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Settings className="w-6 h-6 text-[#D4A76A]" />
                {t.languageTitle}
            </h3>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setLanguage("ar")}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                        language === "ar"
                            ? "bg-[#423E87] text-white border-[#423E87]"
                            : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                >
                    {t.languageAr}
                </button>
                <button
                    onClick={() => setLanguage("en")}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                        language === "en"
                            ? "bg-[#423E87] text-white border-[#423E87]"
                            : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                >
                    {t.languageEn}
                </button>
            </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800/90 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <Heart className="w-6 h-6 text-[#CC6243]" />
                {t.profileTitle}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-500 mb-4 font-medium">{t.profileNote}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 mr-1" htmlFor="profile-name">{t.nameLabel}</label>
                    <input
                        id="profile-name"
                        type="text"
                        value={userProfile.name}
                        onChange={(event) => updateProfile({ ...userProfile, name: event.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-[#D4A76A] outline-none text-slate-800 dark:text-white font-bold text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 mr-1" htmlFor="profile-email">{t.emailLabel}</label>
                    <input
                        id="profile-email"
                        type="email"
                        value={userProfile.email}
                        onChange={(event) => updateProfile({ ...userProfile, email: event.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-[#D4A76A] outline-none text-slate-800 dark:text-white font-bold text-sm"
                    />
                </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <button
                    onClick={() => updateProfile(userProfile)}
                    className="px-4 py-2 rounded-xl bg-[#423E87] text-white text-sm font-bold hover:bg-[#2E2A5E] transition-all"
                >
                    {t.updateProfile}
                </button>
                <button
                    onClick={logout}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
                >
                    {t.logoutButton}
                </button>
            </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800/90 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <Download className="w-6 h-6 text-[#D4A76A]" />
                {t.aboutTitle}
            </h3>
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#D4A76A]/10 dark:bg-[#D4A76A]/20 border border-[#D4A76A]/20 dark:border-[#D4A76A]/30">
                    <span className="text-sm text-[#423E87] dark:text-[#D4A76A] font-bold">✅ يعمل بدون إنترنت</span>
                    <span className="text-xs text-[#B18F67] dark:text-[#B18F67] font-medium">PWA</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-sm text-slate-700 dark:text-slate-400 font-bold">💾 يحفظ تقدمك تلقائياً</span>
                    <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">localStorage</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-sm text-slate-700 dark:text-slate-400 font-bold">🔄 يُعاد التعيين تلقائياً كل يوم</span>
                    <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">يومي</span>
                </div>
            </div>
        </div>

        <button
            onClick={() => {
                resetAllProgress();
            }}
            className="w-full py-4 rounded-2xl bg-rose-500 text-white text-base font-black shadow-lg shadow-rose-200 dark:shadow-none hover:bg-rose-400 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            id="reset-all-btn"
        >
            <RotateCcw className="w-5 h-5" />
            {t.resetAllLabel}
        </button>
    </div>
);

export default SettingsSection;