import React, { useMemo, useState } from 'react';

const LoginScreen = ({ onLogin, t, language }) => {
    const [form, setForm] = useState({ name: "", email: "" });
    const [mode, setMode] = useState("signin");

    const isCreateMode = mode === "create";
    const title = useMemo(() => (isCreateMode ? t.createAccountTitle : t.loginTitle), [isCreateMode, t]);
    const subtitle = useMemo(() => (isCreateMode ? t.createAccountSubtitle : t.loginSubtitle), [isCreateMode, t]);
    const actionLabel = useMemo(() => (isCreateMode ? t.createAccountButton : t.loginButton), [isCreateMode, t]);

    return (
        <div
            className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,167,106,0.25),_transparent_38%),linear-gradient(180deg,_#f8fafc_0%,_#eef4f1_100%)] flex items-center justify-center px-4 py-12"
            dir={language === "en" ? "ltr" : "rtl"}
            style={{ fontFamily: language === "en" ? "'Inter', sans-serif" : "'Cairo', sans-serif", background: 'linear-gradient(180deg, #f8fafc 0%, #eef4f1 100%)', color: '#1e293b' }}
        >
            <div className="max-w-lg w-full bg-white/95 rounded-[2rem] shadow-2xl border border-slate-200/70 p-6 md:p-8 backdrop-blur">
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-white shadow-lg ring-1 ring-slate-200/60">
                        <img
                            src="azkari_logo.png"
                            alt={t.appName}
                            className="h-20 w-20 object-contain"
                        />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">{title}</h1>
                    <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
                </div>

                <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">
                    <button
                        type="button"
                        onClick={() => setMode("signin")}
                        className={`rounded-xl px-4 py-2.5 text-sm font-black transition-all ${!isCreateMode ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}
                    >
                        {t.loginButton}
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("create")}
                        className={`rounded-xl px-4 py-2.5 text-sm font-black transition-all ${isCreateMode ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}
                    >
                        {t.createAccountButton}
                    </button>
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
                            placeholder={language === "en" ? "Your name" : "اكتب اسمك"}
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
                            placeholder={language === "en" ? "name@example.com" : "name@example.com"}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => onLogin(form)}
                        className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-200/70"
                    >
                        {actionLabel}
                    </button>

                    <button
                        type="button"
                        onClick={() => setMode(isCreateMode ? "signin" : "create")}
                        className="w-full text-sm font-bold text-[#423E87] hover:text-[#2E2A5E] transition-colors"
                    >
                        {isCreateMode ? t.signInInstead : t.createAccountLink}
                    </button>

                    <div className="rounded-2xl border border-[#D4A76A]/25 bg-[#D4A76A]/10 px-4 py-3 text-sm text-slate-600 font-medium">
                        {t.settingsHint}
                    </div>

                    <p className="text-xs text-slate-400 font-medium text-center">{t.loginRequired}</p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
