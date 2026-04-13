import os
import re

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Generate utils/constants.jsx
constants_content = """import { Clock, Moon, Sun, BookOpen, Heart, Settings } from 'lucide-react';

export const ICONS = { Clock, Moon, Sun, BookOpen, Heart, Settings };
// window.AZKAR_DATA is assumed to be loaded globally or imported. For now we use the global from azkar-data.js
export const { azkar, defaultCustomDuas, tabs: tabConfig } = window.AZKAR_DATA;
export const DAILY_TAB_IDS = ["morning", "evening", "sleeping", "prayer_azkar"];
export const OFFLINE_PRAYER_TIMES = {
    Fajr: "04:45", Sunrise: "06:15", Dhuhr: "11:50", Asr: "15:10", Maghrib: "17:30", Isha: "19:00"
};
export const PRAYER_CHECKLIST = [
    { id: "fajr", ar: "الفجر", en: "Fajr" },
    { id: "dhuhr", ar: "الظهر", en: "Dhuhr" },
    { id: "asr", ar: "العصر", en: "Asr" },
    { id: "maghrib", ar: "المغرب", en: "Maghrib" },
    { id: "isha", ar: "العشاء", en: "Isha" }
];
"""
# Extract I18N
i18n_match = re.search(r'(const I18N = \{.*?\n\};\n)', content, re.DOTALL)
if i18n_match:
    constants_content += "\nexport " + i18n_match.group(1)

write_file('src/utils/constants.js', constants_content)

# Generate utils/helpers.js
helpers_content = """export const toastQueue = [];
let toastListener = null;

export function showToast(message, type = "success", duration = 2500) {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };

    toastQueue.push(toast);
    if (toastListener) {
        toastListener([...toastQueue]);
    }

    window.setTimeout(() => {
        const index = toastQueue.findIndex((item) => item.id === id);
        if (index === -1) {
            return;
        }

        toastQueue[index].exiting = true;
        if (toastListener) {
            toastListener([...toastQueue]);
        }

        window.setTimeout(() => {
            const removeIndex = toastQueue.findIndex((item) => item.id === id);
            if (removeIndex > -1) {
                toastQueue.splice(removeIndex, 1);
            }

            if (toastListener) {
                toastListener([...toastQueue]);
            }
        }, 300);
    }, duration);
}

export function subscribeToToasts(listener) {
    toastListener = listener;
    return () => { toastListener = null; };
}

export function readJson(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        return fallback;
    }
}

export function readDailyState(key) {
    const saved = readJson(key, null);
    if (!saved || saved.date !== new Date().toDateString()) {
        return {};
    }
    return saved.items || {};
}

export function dateKey(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function isSameDay(a, b) {
    return dateKey(a) === dateKey(b);
}

export function isYesterday(previous, today) {
    const oneDay = 24 * 60 * 60 * 1000;
    return dateKey(today) - dateKey(previous) === oneDay;
}
"""
write_file('src/utils/helpers.js', helpers_content)

components = ['ToastContainer', 'ScrollToTop', 'OfflineBanner', 'PrayerTimesSection', 'CustomDuasSection', 'SettingsSection', 'ProgressHero', 'StreakBanner', 'PrayerChecklist', 'LoginScreen', 'AzkarApp', 'ZikrCard']

# Basic extraction for React components
imports_block = """import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Clock, Moon, Sun, MapPin, BookOpen, Plus, Settings, CheckCircle, Share2, Trash2, Heart, Info, ArrowUp, ChevronDown, Wifi, WifiOff, Download, RotateCcw } from 'lucide-react';
import { ICONS, DAILY_TAB_IDS, OFFLINE_PRAYER_TIMES, PRAYER_CHECKLIST, I18N, azkar, defaultCustomDuas, tabConfig } from '../utils/constants';
import { showToast, readJson, readDailyState, dateKey, isSameDay, isYesterday, subscribeToToasts, toastQueue } from '../utils/helpers';
"""

# Extract components
for comp in components:
    if comp == 'ToastContainer':
        # Custom fix for ToastContainer because it accesses toastListener
        comp_code = re.search(r'(const ToastContainer = \(\) => \{.+?return \(.+?\);\n\};\n)', content, re.DOTALL)
        if comp_code:
            code = comp_code.group(1)
            code = code.replace("toastListener = setToasts;", "subscribeToToasts(setToasts);")
            code = code.replace("toastListener = null;", "subscribeToToasts(null);")
            write_file(f'src/components/{comp}.jsx', imports_block + "\n" + code + f"\nexport default {comp};")
    else:
        # Match components definition `const Comp = ({ ... }) => { ... }` or `const Comp = ({ ... }) => ( ... )`
        pattern = r'(const ' + comp + r' = .*?)(?=\nconst [A-Z]|\nconst root =|\n$)'
        comp_match = re.search(pattern, content, re.DOTALL)
        if comp_match:
            code = comp_match.group(1)
            
            # Special case for AzkarApp because it references ZikrCard, LoginScreen, PrayerChecklist, etc.
            if comp == 'AzkarApp':
                extra_imports = ""
                for child in components:
                    if child != 'AzkarApp' and child in code:
                        extra_imports += f"import {child} from './{child}';\n"
                write_file(f'src/components/{comp}.jsx', imports_block + extra_imports + "\n" + code + f"\nexport default {comp};")
            else:
                write_file(f'src/components/{comp}.jsx', imports_block + "\n" + code + f"\nexport default {comp};")

# Create main.jsx
main_content = """import React from 'react';
import ReactDOM from 'react-dom/client';
import AzkarApp from './components/AzkarApp';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AzkarApp />
  </React.StrictMode>
);
"""
write_file('src/main.jsx', main_content)

print("Split complete!")
