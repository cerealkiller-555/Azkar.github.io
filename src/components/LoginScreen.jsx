import React, { useMemo, useState } from 'react';
import { User, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

const LoginScreen = ({ onLogin, t, language }) => {
    const [form, setForm] = useState({ name: "", email: "" });
    const [errors, setErrors] = useState({ name: false, email: false });
    const [mode, setMode] = useState("signin");

    const isCreateMode = mode === "create";
    const title = isCreateMode ? t.createAccountTitle : t.loginTitle;
    const subtitle = isCreateMode ? t.createAccountSubtitle : t.loginSubtitle;
    const actionLabel = isCreateMode ? t.createAccountButton : t.loginButton;

    const validateEmail = (email) => {
        return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    };

    const handleSubmit = () => {
        const nameError = !form.name.trim();
        const emailError = !form.email.trim() || !validateEmail(form.email);
        setErrors({ name: nameError, email: emailError });
        if (!nameError && !emailError) onLogin(form, mode);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-main pattern-bg" dir={language === "ar" ? "rtl" : "ltr"}>
            <div className="max-w-md w-full animate-scale-in">
                <div className="glass-panel p-10 space-y-8 relative overflow-hidden">
                    {/* Branded Logo */}
                    <div className="text-center space-y-4">
                        <div className="w-24 h-24 mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-2xl flex items-center justify-center border border-accent/20 transform hover:rotate-6 transition-transform">
                            <img src="hesnok_logo.png" alt="logo" className="w-20 h-20 rounded-2xl" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-outfit font-black text-primary dark:text-accent tracking-tighter">{title}</h1>
                            <p className="text-sm text-text-secondary font-bold">{subtitle}</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${errors.name ? 'text-error' : 'text-text-tertiary'}`}>
                                    {t.nameLabel}
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary group-focus-within:text-accent transition-colors" />
                                    <input
                                        type="text"
                                        className={`w-full bg-bg-subtle dark:bg-slate-900/50 border-2 py-4 pl-12 pr-6 rounded-2xl focus:outline-none focus:border-accent transition-all font-bold ${errors.name ? 'border-error/50' : 'border-glass-border'}`}
                                        placeholder={language === "en" ? "Your name" : "الاسم الكامل"}
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${errors.email ? 'text-error' : 'text-text-tertiary'}`}>
                                    {t.emailLabel}
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary group-focus-within:text-accent transition-colors" />
                                    <input
                                        type="email"
                                        className={`w-full bg-bg-subtle dark:bg-slate-900/50 border-2 py-4 pl-12 pr-6 rounded-2xl focus:outline-none focus:border-accent transition-all font-bold ${errors.email ? 'border-error/50' : 'border-glass-border'}`}
                                        placeholder="email@example.com"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-primary hover:bg-primary-dark text-accent font-black py-4 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transform active:scale-95 transition-all group"
                        >
                            <span>{actionLabel}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={() => setMode(isCreateMode ? "signin" : "create")}
                            className="w-full text-sm font-black text-primary dark:text-accent opacity-80 hover:opacity-100 transition-opacity underline-offset-4 hover:underline"
                        >
                            {isCreateMode ? t.signInInstead : t.createAccountLink}
                        </button>
                    </div>

                    {/* Trust Banner */}
                    <div className="bg-accent/5 border border-accent/10 p-4 rounded-2xl flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
                        <p className="text-[11px] text-text-primary font-bold leading-relaxed">{t.settingsHint}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
