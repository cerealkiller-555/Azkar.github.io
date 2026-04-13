import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Clock, Moon, Sun, MapPin, BookOpen, Plus, Settings, CheckCircle, Share2, Trash2, Heart, Info, ArrowUp, ChevronDown, Wifi, WifiOff, Download, RotateCcw } from 'lucide-react';
import { ICONS, DAILY_TAB_IDS, OFFLINE_PRAYER_TIMES, PRAYER_CHECKLIST, I18N, azkar, defaultCustomDuas, tabConfig } from '../utils/constants';
import { showToast, readJson, readDailyState, dateKey, isSameDay, isYesterday, subscribeToToasts, toastQueue } from '../utils/helpers';

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

export default LoginScreen;