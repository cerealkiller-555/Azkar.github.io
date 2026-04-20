import React from 'react';

const formatTime12Hour = (timeStr, language) => {
    if (!timeStr) return "00:00";
    const match = timeStr.match(/^(\d{1,2}):(\d{2})/);
    if (!match) return timeStr;
    let hour = parseInt(match[1], 10);
    const minute = match[2];
    const ampmEn = hour >= 12 ? 'PM' : 'AM';
    const ampmAr = hour >= 12 ? 'م' : 'ص';
    hour = hour % 12;
    hour = hour ? hour : 12;
    const ampm = language === "en" ? ampmEn : ampmAr;
    return `${hour}:${minute} ${ampm}`;
};

const PrayerTimesSection = ({ prayerTimes, location, t, language }) => {
    const prayerCards = [
        { name: language === "en" ? "Fajr" : "الفجر", key: "Fajr", icon: "🌅", color: "from-[#423E87] to-[#2E2A5E]" },
        { name: language === "en" ? "Sunrise" : "الشروق", key: "Sunrise", icon: "☀️", color: "from-[#D4A76A] to-[#B18F67]" },
        { name: language === "en" ? "Dhuhr" : "الظهر", key: "Dhuhr", icon: "🌞", color: "from-[#EAA023] to-[#D4A76A]" },
        { name: language === "en" ? "Asr" : "العصر", key: "Asr", icon: "🌤️", color: "from-[#B18F67] to-[#8C6F54]" },
        { name: language === "en" ? "Maghrib" : "المغرب", key: "Maghrib", icon: "🌆", color: "from-[#CC6243] to-[#8C4B39]" },
        { name: language === "en" ? "Isha" : "العشاء", key: "Isha", icon: "🌙", color: "from-[#1a1a2e] to-[#423E87]" }
    ];

    return (
        <div className="animate-slide-up">
            <div className="mb-6 text-center">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">{t.prayerTimesTitle}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-500 font-medium">
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
                        <p className="text-2xl md:text-3xl font-black tracking-widest" dir="ltr">{formatTime12Hour(prayerTimes[prayer.key], language)}</p>
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
};

export default PrayerTimesSection;