import React from 'react';

const formatTime12Hour = (timeStr, language) => {
    if (!timeStr) return "00:00";
    const match = timeStr.match(/^(\d{1,2}):(\d{2})/);
    if (!match) return timeStr;
    let hour = parseInt(match[1], 10);
    const minute = match[2];
    const ampm = language === "en" ? (hour >= 12 ? 'PM' : 'AM') : (hour >= 12 ? 'م' : 'ص');
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
};

const PRAYER_CARDS = [
    { name_ar: "الفجر",  name_en: "Fajr",    key: "Fajr",    icon: "🌅", color: "from-[#423E87] to-[#2E2A5E]", light: false },
    { name_ar: "الشروق", name_en: "Sunrise",  key: "Sunrise",  icon: "☀️", color: "from-[#D4A76A] to-[#B18F67]", light: true },
    { name_ar: "الظهر",  name_en: "Dhuhr",    key: "Dhuhr",    icon: "🌞", color: "from-[#EAA023] to-[#D4A76A]", light: true },
    { name_ar: "العصر",  name_en: "Asr",      key: "Asr",      icon: "🌤️", color: "from-[#B18F67] to-[#8C6F54]", light: true },
    { name_ar: "المغرب", name_en: "Maghrib",  key: "Maghrib",  icon: "🌆", color: "from-[#CC6243] to-[#8C4B39]", light: false },
    { name_ar: "العشاء", name_en: "Isha",     key: "Isha",     icon: "🌙", color: "from-[#1a1a2e] to-[#423E87]", light: false }
];

const PrayerTimesSection = ({ prayerTimes, location, t, language }) => (
    <div className="animate-slide-up">
        <div className="mb-6 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">{t.prayerTimesTitle}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-500 font-medium">
                {location.city} — {new Date().toLocaleDateString(language === "en" ? "en-US" : "ar-EG", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric"
                })}
            </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {prayerTimes ? PRAYER_CARDS.map((p) => (
                <div key={p.key} className={`bg-gradient-to-br ${p.color} ${p.light ? "text-slate-900" : "text-white"} p-5 md:p-6 rounded-2xl shadow-lg hover:scale-[1.03] transition-all group cursor-default`}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform duration-500 block">{p.icon}</span>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${p.light ? "bg-slate-900/30" : "bg-white/60"}`} />
                    </div>
                    <h3 className={`text-sm md:text-base font-bold mb-1 ${p.light ? "text-slate-800/75" : "text-white/80"}`}>
                        {language === "en" ? p.name_en : p.name_ar}
                    </h3>
                    <p className="text-2xl md:text-3xl font-black tracking-widest" dir="ltr">
                        {formatTime12Hour(prayerTimes[p.key], language)}
                    </p>
                </div>
            )) : (
                <div className="col-span-full py-16 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-[#D4A76A] border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-slate-400 font-bold">{t.prayerTimesLoading}</p>
                </div>
            )}
        </div>
    </div>
);

export default PrayerTimesSection;
