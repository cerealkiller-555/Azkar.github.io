export const toastQueue = [];
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
