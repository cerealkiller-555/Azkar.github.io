import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Clock, Moon, Sun, MapPin, BookOpen, Plus, Settings, CheckCircle, Share2, Trash2, Heart, Info, ArrowUp, ChevronDown, Wifi, WifiOff, Download, RotateCcw } from 'lucide-react';
import { ICONS, DAILY_TAB_IDS, OFFLINE_PRAYER_TIMES, PRAYER_CHECKLIST, I18N, azkar, defaultCustomDuas, tabConfig } from '../utils/constants';
import { showToast, readJson, readDailyState, dateKey, isSameDay, isYesterday, subscribeToToasts, toastQueue } from '../utils/helpers';

const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        subscribeToToasts(setToasts);
        return () => {
            subscribeToToasts(null);
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

export default ToastContainer;