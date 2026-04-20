import React, { useMemo, useState } from 'react';

const LoginScreen = ({ onLogin, t, language }) => {
    const [form, setForm] = useState({ name: "", email: "" });
    const [errors, setErrors] = useState({ name: false, email: false });
    const [mode, setMode] = useState("signin");

    const isCreateMode = mode === "create";
    const title = useMemo(() => (isCreateMode ? t.createAccountTitle : t.loginTitle), [isCreateMode, t]);
    const subtitle = useMemo(() => (isCreateMode ? t.createAccountSubtitle : t.loginSubtitle), [isCreateMode, t]);
    const actionLabel = useMemo(() => (isCreateMode ? t.createAccountButton : t.loginButton), [isCreateMode, t]);

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubmit = () => {
        const nameError = !form.name.trim();
        const emailError = !form.email.trim() || !validateEmail(form.email);
        
        setErrors({ name: nameError, email: emailError });
        
        if (!nameError && !emailError) {
            onLogin(form);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-12"
            dir={language === "en" ? "ltr" : "rtl"}
            style={{
                fontFamily: language === "en" ? "'Inter', sans-serif" : "'Cairo', sans-serif",
                background: 'linear-gradient(160deg, #f8fafc 0%, #EADEC9 50%, #f8fafc 100%)',
                color: '#1e293b'
            }}
        >
            {/* Decorative background elements */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(circle at 20% 20%, rgba(66,62,135,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(212,167,106,0.1) 0%, transparent 50%)',
                pointerEvents: 'none'
            }} />

            <div className="max-w-lg w-full relative" style={{ zIndex: 1 }}>
                {/* Card */}
                <div style={{
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: '2rem',
                    boxShadow: '0 25px 60px rgba(66,62,135,0.12), 0 4px 16px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(212,167,106,0.2)',
                    padding: '2rem',
                    backdropFilter: 'blur(20px)'
                }}>
                    {/* Logo and Title */}
                    <div className="mb-6 text-center">
                        <div style={{
                            margin: '0 auto 1rem',
                            display: 'flex',
                            height: '6rem',
                            width: '6rem',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '1.75rem',
                            background: 'linear-gradient(145deg, #fff, #f8f6f2)',
                            boxShadow: '0 8px 32px rgba(66,62,135,0.1), 0 1px 4px rgba(0,0,0,0.05)',
                            border: '1px solid rgba(212,167,106,0.2)'
                        }}>
                            <img
                                src="hesnok_logo.png"
                                alt={t.appName}
                                style={{ height: '5rem', width: '5rem', objectFit: 'contain', borderRadius: '1rem' }}
                            />
                        </div>
                        <h1 style={{
                            fontSize: '1.75rem',
                            fontWeight: 900,
                            color: '#423E87',
                            marginBottom: '0.5rem',
                            letterSpacing: '-0.02em'
                        }}>{title}</h1>
                        <p style={{
                            fontSize: '0.875rem',
                            color: '#94a3b8',
                            fontWeight: 500
                        }}>{subtitle}</p>
                    </div>

                    {/* Mode toggle */}
                    <div style={{
                        marginBottom: '1.5rem',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.5rem',
                        borderRadius: '1rem',
                        background: '#f1f5f9',
                        padding: '0.375rem'
                    }}>
                        <button
                            type="button"
                            onClick={() => setMode("signin")}
                            style={{
                                borderRadius: '0.75rem',
                                padding: '0.625rem 1rem',
                                fontSize: '0.875rem',
                                fontWeight: 800,
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                ...(mode === "signin"
                                    ? { background: '#fff', color: '#423E87', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }
                                    : { background: 'transparent', color: '#94a3b8' }
                                ),
                                fontFamily: 'inherit'
                            }}
                        >
                            {t.loginButton}
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("create")}
                            style={{
                                borderRadius: '0.75rem',
                                padding: '0.625rem 1rem',
                                fontSize: '0.875rem',
                                fontWeight: 800,
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                ...(mode === "create"
                                    ? { background: '#fff', color: '#423E87', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }
                                    : { background: 'transparent', color: '#94a3b8' }
                                ),
                                fontFamily: 'inherit'
                            }}
                        >
                            {t.createAccountButton}
                        </button>
                    </div>

                    {/* Form fields */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: errors.name ? '#ef4444' : '#94a3b8', display: 'block', marginBottom: '0.5rem' }} htmlFor="login-name">
                                {t.nameLabel} {errors.name && "*"}
                            </label>
                            <input
                                id="login-name"
                                type="text"
                                value={form.name}
                                onChange={(event) => {
                                    setForm({ ...form, name: event.target.value });
                                    if (errors.name) setErrors({ ...errors, name: false });
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    borderRadius: '1rem',
                                    background: '#f8fafc',
                                    border: `1.5px solid ${errors.name ? '#ef4444' : '#e2e8f0'}`,
                                    outline: 'none',
                                    color: '#1e293b',
                                    fontWeight: 700,
                                    fontSize: '0.9375rem',
                                    fontFamily: 'inherit',
                                    transition: 'border-color 0.3s'
                                }}
                                onFocus={(e) => { if(!errors.name) e.target.style.borderColor = '#D4A76A' }}
                                onBlur={(e) => { if(!errors.name) e.target.style.borderColor = '#e2e8f0' }}
                                placeholder={language === "en" ? "Your name" : "اكتب اسمك"}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: errors.email ? '#ef4444' : '#94a3b8', display: 'block', marginBottom: '0.5rem' }} htmlFor="login-email">
                                {t.emailLabel} {errors.email && "*"}
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                value={form.email}
                                onChange={(event) => {
                                    setForm({ ...form, email: event.target.value });
                                    if (errors.email) setErrors({ ...errors, email: false });
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    borderRadius: '1rem',
                                    background: '#f8fafc',
                                    border: `1.5px solid ${errors.email ? '#ef4444' : '#e2e8f0'}`,
                                    outline: 'none',
                                    color: '#1e293b',
                                    fontWeight: 700,
                                    fontSize: '0.9375rem',
                                    fontFamily: 'inherit',
                                    transition: 'border-color 0.3s'
                                }}
                                onFocus={(e) => { if(!errors.email) e.target.style.borderColor = '#D4A76A' }}
                                onBlur={(e) => { if(!errors.email) e.target.style.borderColor = '#e2e8f0' }}
                                placeholder={language === "en" ? "name@example.com" : "name@example.com"}
                            />
                        </div>

                        {/* Submit button - branded */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                borderRadius: '1rem',
                                background: 'linear-gradient(135deg, #423E87, #2E2A5E)',
                                color: '#D4A76A',
                                fontWeight: 900,
                                fontSize: '1rem',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 8px 24px rgba(66,62,135,0.25)',
                                transition: 'all 0.3s',
                                fontFamily: 'inherit'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 12px 32px rgba(66,62,135,0.35)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 8px 24px rgba(66,62,135,0.25)';
                            }}
                        >
                            {actionLabel}
                        </button>

                        {/* Toggle mode link */}
                        <button
                            type="button"
                            onClick={() => setMode(isCreateMode ? "signin" : "create")}
                            style={{
                                width: '100%',
                                fontSize: '0.875rem',
                                fontWeight: 700,
                                color: '#423E87',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                fontFamily: 'inherit',
                                transition: 'color 0.3s'
                            }}
                        >
                            {isCreateMode ? t.signInInstead : t.createAccountLink}
                        </button>

                        {/* Hint */}
                        <div style={{
                            borderRadius: '1rem',
                            border: '1px solid rgba(212,167,106,0.25)',
                            background: 'rgba(212,167,106,0.08)',
                            padding: '0.875rem 1rem',
                            fontSize: '0.8125rem',
                            color: '#64748b',
                            fontWeight: 500
                        }}>
                            {t.settingsHint}
                        </div>

                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, textAlign: 'center' }}>{t.loginRequired}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
