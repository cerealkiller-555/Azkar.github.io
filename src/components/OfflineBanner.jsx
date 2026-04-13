import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Clock, Moon, Sun, MapPin, BookOpen, Plus, Settings, CheckCircle, Share2, Trash2, Heart, Info, ArrowUp, ChevronDown, Wifi, WifiOff, Download, RotateCcw } from 'lucide-react';
import { ICONS, DAILY_TAB_IDS, OFFLINE_PRAYER_TIMES, PRAYER_CHECKLIST, I18N, azkar, defaultCustomDuas, tabConfig } from '../utils/constants';
import { showToast, readJson, readDailyState, dateKey, isSameDay, isYesterday, subscribeToToasts, toastQueue } from '../utils/helpers';

const OfflineBanner = ({ offline, t }) => {
    if (!offline) {
        return null;
    }

    return (
        <div className="offline-banner">
            <WifiOff className="w-4 h-4" />
            <span>{t.offlineNotice}</span>
        </div>
    );
};

export default OfflineBanner;