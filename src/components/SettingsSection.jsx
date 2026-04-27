import React from 'react';
import { Download, MapPin, Moon, Sun, Settings, Heart, RotateCcw, Globe, ShieldCheck } from 'lucide-react';

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
    <div className="animate-slide-up space-y-8">
        {/* PWA Install Promo */}
        {deferredPrompt && (
            <div className="p-8 bg-gradient-to-br from-[#423E87] to-[#2E2A5E] rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-10 blur-3xl transform translate-x-16 -translate-y-16" />
                <h3 className="text-2xl font-outfit font-black text-accent mb-3 flex items-center gap-3">
                    <Download className="w-7 h-7" />
                    {language === "en" ? "Install App" : "تثبيت كمتطبيق"}
                </h3>
                <p className="text-white/70 text-sm mb-8 font-medium leading-relaxed">
                    {language === "en" ? "Install Hesnok on your device for quick access and offline use." : "يمكنك تثبيت حصنك على جهازك للوصول السريع والعمل بدون إنترنت دائماً."}
                </p>
                <button
                    onClick={installPWA}
                    className="w-full py-4 rounded-2xl bg-accent text-primary font-black hover:bg-accent-light transition-all active:scale-95 shadow-xl shadow-black/20"
                >
                    {language === "en" ? "Install Now" : "تثبيت الآن"}
                </button>
            </div>
        )}

        {/* Location Settings */}
        <div className="glass-panel p-8 space-y-6">
            <h3 className="text-xl font-black text-text-primary flex items-center gap-3">
                <MapPin className="w-6 h-6 text-accent" />
                {t.locationTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest ml-1" htmlFor="city-input">{t.cityLabel}</label>
                    <input
                        id="city-input"
                        type="text"
                        value={location.city}
                        onChange={(e) => setLocation({ ...location, city: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-bg-subtle dark:bg-slate-900 border-2 border-glass-border focus:border-accent outline-none text-text-primary font-bold transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest ml-1" htmlFor="country-input">{t.countryLabel}</label>
                    <input
                        id="country-input"
                        type="text"
                        value={location.country}
                        onChange={(e) => setLocation({ ...location, country: e.target.value.toUpperCase() })}
                        className="w-full px-5 py-4 rounded-2xl bg-bg-subtle dark:bg-slate-900 border-2 border-glass-border focus:border-accent outline-none text-text-primary font-bold transition-all"
                    />
                </div>
            </div>
        </div>

        {/* Appearance & Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-8 space-y-6">
                <h3 className="text-xl font-black text-text-primary flex items-center gap-3">
                    {isDarkMode ? <Moon className="w-6 h-6 text-indigo-400" /> : <Sun className="w-6 h-6 text-amber-500" />}
                    {t.appearanceTitle}
                </h3>
                <button
                    onClick={toggleDarkMode}
                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-bg-subtle dark:bg-slate-900 border-2 border-glass-border hover:border-accent transition-all group"
                >
                    <span className="text-text-secondary font-black">{isDarkMode ? t.darkOn : t.lightOn}</span>
                    <div className={`w-14 h-8 rounded-full transition-all duration-500 flex items-center p-1 ${isDarkMode ? "bg-accent" : "bg-slate-300 dark:bg-slate-700"}`}>
                        <div className={`w-6 h-6 rounded-full bg-white shadow-xl transform transition-transform duration-500 ${isDarkMode ? (language === 'ar' ? 'translate-x-6' : '-translate-x-6') : 'translate-x-0'}`} />
                    </div>
                </button>
            </div>

            <div className="glass-panel p-8 space-y-6">
                <h3 className="text-xl font-black text-text-primary flex items-center gap-3">
                    <Globe className="w-6 h-6 text-accent" />
                    {t.languageTitle}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setLanguage("ar")}
                        className={`py-4 rounded-2xl text-sm font-black border-2 transition-all ${language === "ar" ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-bg-subtle dark:bg-slate-900 text-text-secondary border-glass-border hover:border-accent"}`}
                    >
                        العربية
                    </button>
                    <button
                        onClick={() => setLanguage("en")}
                        className={`py-4 rounded-2xl text-sm font-black border-2 transition-all ${language === "en" ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-bg-subtle dark:bg-slate-900 text-text-secondary border-glass-border hover:border-accent"}`}
                    >
                        English
                    </button>
                </div>
            </div>
        </div>

        {/* Profile Management */}
        <div className="glass-panel p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-text-primary flex items-center gap-3">
                    <Heart className="w-6 h-6 text-rose-500" />
                    {t.profileTitle}
                </h3>
                <button onClick={logout} className="text-[10px] font-black uppercase tracking-widest text-text-tertiary hover:text-error transition-colors px-3 py-1.5 rounded-lg bg-bg-subtle dark:bg-slate-900">
                    {t.logoutButton}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest ml-1">{t.nameLabel}</label>
                    <input
                        type="text"
                        value={userProfile.name}
                        onChange={(e) => updateProfile({ ...userProfile, name: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-bg-subtle dark:bg-slate-900 border-2 border-glass-border focus:border-accent outline-none text-text-primary font-bold"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest ml-1">{t.emailLabel}</label>
                    <input
                        type="email"
                        value={userProfile.email}
                        readOnly
                        className="w-full px-5 py-4 rounded-2xl bg-bg-subtle/50 dark:bg-slate-900/50 border-2 border-glass-border text-text-tertiary font-bold cursor-not-allowed"
                    />
                </div>
            </div>
        </div>

        {/* Safety Reset */}
        <button
            onClick={resetAllProgress}
            className="w-full py-5 rounded-3xl bg-rose-500 hover:bg-rose-600 text-white font-black shadow-xl shadow-rose-500/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
            <RotateCcw className="w-5 h-5 animate-spin-hover" />
            {t.resetAllLabel}
        </button>

        {/* Trust Banner */}
        <div className="text-center space-y-2 pt-4">
            <div className="flex items-center justify-center gap-2 text-text-tertiary">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">{t.profileNote}</span>
            </div>
        </div>
    </div>
);

export default SettingsSection;