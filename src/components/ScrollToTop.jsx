import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Clock, Moon, Sun, MapPin, BookOpen, Plus, Settings, CheckCircle, Share2, Trash2, Heart, Info, ArrowUp, ChevronDown, Wifi, WifiOff, Download, RotateCcw } from 'lucide-react';
import { ICONS, DAILY_TAB_IDS, OFFLINE_PRAYER_TIMES, PRAYER_CHECKLIST, I18N, azkar, defaultCustomDuas, tabConfig } from '../utils/constants';
import { showToast, readJson, readDailyState, dateKey, isSameDay, isYesterday, subscribeToToasts, toastQueue } from '../utils/helpers';

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

export default ScrollToTop;