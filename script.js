const { useState, useEffect, useMemo, useCallback, useRef } = React;
const { Clock, Moon, Sun, MapPin, Bell, BookOpen, Plus, Settings, Save, CheckCircle, Share2, Trash2, Heart, Info, ArrowUp, ChevronLeft, ChevronDown, Wifi, WifiOff, Download, X, RotateCcw } = LucideReact;

// ============================================
// TOAST NOTIFICATION SYSTEM
// ============================================
const toastQueue = [];
let toastListener = null;

function showToast(message, type = 'success', duration = 2500) {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    toastQueue.push(toast);
    if (toastListener) toastListener([...toastQueue]);
    setTimeout(() => {
        const idx = toastQueue.findIndex(t => t.id === id);
        if (idx > -1) {
            toastQueue[idx].exiting = true;
            if (toastListener) toastListener([...toastQueue]);
            setTimeout(() => {
                const removeIdx = toastQueue.findIndex(t => t.id === id);
                if (removeIdx > -1) toastQueue.splice(removeIdx, 1);
                if (toastListener) toastListener([...toastQueue]);
            }, 300);
        }
    }, duration);
}

const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);
    useEffect(() => {
        toastListener = setToasts;
        return () => { toastListener = null; };
    }, []);

    if (toasts.length === 0) return null;
    return (
        <div className="toast-container">
            {toasts.map(t => (
                <div key={t.id} className={`toast toast-${t.type} ${t.exiting ? 'toast-exit' : ''}`}>
                    {t.type === 'success' && '✓ '}
                    {t.type === 'info' && 'ℹ '}
                    {t.type === 'warning' && '⚠ '}
                    {t.message}
                </div>
            ))}
        </div>
    );
};

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <button
            className={`scroll-top-btn ${visible ? 'visible' : ''}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="العودة للأعلى"
        >
            <ArrowUp className="w-6 h-6" />
        </button>
    );
};

// ============================================
// OFFLINE BANNER
// ============================================
const OfflineBanner = () => {
    const [offline, setOffline] = useState(!navigator.onLine);
    useEffect(() => {
        const goOffline = () => { setOffline(true); showToast('أنت الآن بدون إنترنت — التطبيق يعمل بشكل طبيعي', 'warning', 3000); };
        const goOnline = () => { setOffline(false); showToast('تم إعادة الاتصال بالإنترنت', 'success', 2000); };
        window.addEventListener('offline', goOffline);
        window.addEventListener('online', goOnline);
        return () => {
            window.removeEventListener('offline', goOffline);
            window.removeEventListener('online', goOnline);
        };
    }, []);

    if (!offline) return null;
    return (
        <div className="offline-banner">
            <WifiOff className="w-4 h-4" />
            <span>أنت حالياً بدون إنترنت — التطبيق يعمل بشكل كامل</span>
        </div>
    );
};

// ============================================
// MAIN APP
// ============================================
const AzkarApp = () => {
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('azkar_activeTab') || 'morning';
    });
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [location, setLocation] = useState(() => {
        const saved = localStorage.getItem('azkar_location');
        return saved ? JSON.parse(saved) : { city: 'Cairo', country: 'EG' };
    });
    const [customDuas, setCustomDuas] = useState(() => {
        const saved = localStorage.getItem('azkar_customDuas');
        return saved ? JSON.parse(saved) : [
            "اللهم إني أسألك العفو والعافية في الدنيا والآخرة",
            "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار"
        ];
    });
    const [newDua, setNewDua] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [completedAzkar, setCompletedAzkar] = useState(() => {
        const saved = localStorage.getItem('azkar_completed');
        if (saved) {
            const data = JSON.parse(saved);
            // Reset daily progress if date changed
            if (data.date !== new Date().toDateString()) {
                return {};
            }
            return data.items || {};
        }
        return {};
    });
    const [azkarProgress, setAzkarProgress] = useState(() => {
        const saved = localStorage.getItem('azkar_progress');
        if (saved) {
            const data = JSON.parse(saved);
            if (data.date !== new Date().toDateString()) {
                return {};
            }
            return data.items || {};
        }
        return {};
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.get    const morningAzkar = [
        {
            id: 1,
            title: "آية الكرسي",
            text: "أَعُوذُ بِاللَّهِ مِنَ الشَّيطَانِ الرَّجِيمِ ﴿اللَّهُ لاَ إِلَهَ إِلاَّ هو الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَواتِ وَمَا فِي الأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلاَّ بِمَا شَاء وَسِعَ كُرْسِيُّهُ السَّمَواتِ وَالْأَرْضَ وَلاَ يَؤُودُهُ حِفْظُهما وَهُوَ الْعَلِيُّ الْعَظِيمُ﴾",
            count: 1,
            benefit: "من قالها حين يصبح أُجير من الجن حتى يُمسي",
            source: "صحيح"
        },
        { id: 2, title: "الإخلاص", text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيمِ ﴿قُلْ هُوَ اللَّهُ أَحَدٌ* اللَّهُ الصَّمَدُ* لَمْ يَلِدْ وَلَمْ يُولَد* لَمْ يَكُن لَّهُ كُفُواً أَحَدٌ﴾", count: 3, benefit: "تكفيه من كل شيء", source: "صحيح" },
        { id: 3, title: "الفلق", text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيمِ ﴿قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ* مِن شَرِّ مَا خَلَقَ* وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ* وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ* وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ﴾", count: 3, benefit: "تكفيه من كل شيء", source: "صحيح" },
        { id: 4, title: "الناس", text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيمِ ﴿قُلْ أَعُوذُ بِرَبِّ النَّاسِ* مَلِكِ النَّاسِ* إِلَهِ النَّاسِ* مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ* الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ* مِنَ الْجِنَّةِ وَ النَّاسِ﴾", count: 3, benefit: "تكفيه من كل شيء", source: "صحيح" }
    ];

    const eveningAzkar = [
        {
            id: 1,
            title: "آية الكرسي",
            text: "أَعُوذُ بِاللَّهِ مِنَ الشَّيطَانِ الرَّجِيمِ ﴿اللَّهُ لاَ إِلَهَ إِلاَّ هو الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَواتِ وَمَا فِي الأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلاَّ بِمَا شَاء وَسِعَ كُرْسِيُّهُ السَّمَواتِ وَالْأَرْضَ وَلاَ يَؤُودُهُ حِفْظُهما وَهُوَ الْعَلِيُّ الْعَظِيمُ﴾",
            count: 1,
            benefit: "من قالها حين يمسي أُجير من الجن حتى يصبح",
            source: "صحيح"
        },
        { id: 2, title: "الإخلاص", text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيمِ ﴿قُلْ هُوَ اللَّهُ أَحَدٌ* اللَّهُ الصَّمَدُ* لَمْ يَلِدْ وَلَمْ يُولَد* لَمْ يَكُن لَّهُ كُفُواً أَحَدٌ﴾", count: 3, benefit: "تكفيه من كل شيء", source: "صحيح" },
        { id: 3, title: "الفلق", text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيمِ ﴿قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ* مِن شَرِّ مَا خَلَقَ* وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ* وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ* وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ﴾", count: 3, benefit: "تكفيه من كل شيء", source: "صحيح" },
        { id: 4, title: "الناس", text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيمِ ﴿قُلْ أَعُوذُ بِرَبِّ النَّاسِ* مَلِكِ النَّاسِ* إِلَهِ النَّاسِ* مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ* الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ* مِنَ الْجِنَّةِ وَ النَّاسِ﴾", count: 3, benefit: "تكفيه من كل شيء", source: "صحيح" }
    ];

    const sleepingAzkar = [
        { id: 1, title: "باسمك ربي", text: "بِاسْمِكَ رَبِّى وَضَعْتُ جَنْبِى، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِى فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا، بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ", count: 1, benefit: "الحفظ عند النوم", source: "البخاري" },
        { id: 2, title: "اللهم خلقه نفسي", text: "اللَّهُمَّ إِنَّكَ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا، لَكَ مَمَاتُهَا وَمَحْيَاهَا، إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا، وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا", count: 1, benefit: "دعاء النوم", source: "مسلم" }
    ];

    const prayerAzkar = [
        { id: 1, text: "أَسْتَغْفِرُ اللَّهَ", count: 3, benefit: "بعد الصلاة", source: "مسلم" },
        { id: 2, text: "سُبْحَانَ اللَّهِ", count: 33, benefit: "مغفرة الخطايا", source: "مسلم" },
        { id: 3, text: "الْحَمْدُ لِلَّهِ", count: 33, benefit: "مغفرة الخطايا", source: "مسلم" },
        { id: 4, text: "اللَّهُ أَكْبَرُ", count: 33, benefit: "مغفرة الخطايا", source: "مسلم" }
    ];
�ِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
            count: 1,
            benefit: "سؤال خير الليلة والاستعاذة من شرورها",
            source: "رواه مسلم"
        },
        {
            id: 6,
            text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا ، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
            count: 1,
            benefit: "ذكر المساء للاستعانة بالله في الليلة",
            source: "صحيح - رواه الترمذي"
        },
        {
            id: 7,
            title: "سيد الاستغفار",
            text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عهدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنوبَ إِلاَّ أَنْتَ",
            count: 1,
            benefit: "من قالها من الليل وهو مُوقن بها، فمات قبل أن يُصبح، فهو من أهل الجنة",
            source: "رواه البخاري"
        },
        {
            id: 8,
            text: "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلاَئِكَتِكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيكَ لَكَ، وَأَنَّ مُحَمَّداً عَبْدُكَ وَرَسُولُكَ",
            count: 4,
            benefit: "من قالها أربعًا أعتقه الله من النار",
            source: "حسن - رواه أبو داود"
        },
        {
            id: 9,
            text: "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لاَ شريكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ",
            count: 1,
            benefit: "من قالها حين يمسي فقد أدى شكر ليلته",
            source: "صحيح - رواه أبو داود"
        },
        {
            id: 10,
            text: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لاَ إِلَهَ إِلاَّ أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ، وَالفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ القَبْرِ، لاَ إِلَهَ إِلاَّ أَنْتَ",
            count: 3,
            benefit: "الدعاء بالعافية والاستعاذة من الكفر والفقر",
            source: "حسن - رواه أحمد"
        },
        {
            id: 11,
            text: "حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ عَلَيهِ تَوَكَّلتُ وَهو رَبُّ الْعَرْشِ الْعَظِيمِ",
            count: 7,
            benefit: "من قالها كفاه الله ما أهمه من أمر الدنيا والآخرة",
            source: "صحيح - رواه ابن السني"
        },
        {
            id: 12,
            text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ: فِي دِينِي وَدُنْيَايَ وَأَهْلِي، وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي، وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَينِ يَدَيَّ، وَمِنْ خَلْفِي، وَعَنْ يَمِينِي، وَعَنْ شِمَالِي، وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي",
            count: 1,
            benefit: "حفظ شامل في جميع الجهات من كل سوء",
            source: "صحيح - رواه أبو داود"
        },
        {
            id: 13,
            text: "اللَّهُمَّ عَالِمَ الغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَواتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطانِ وَشَرَكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءاً، أو أَجُرَّهُ إِلَى مُسْلِمٍ",
            count: 1,
            benefit: "الاستعاذة من شر النفس والشيطان",
            source: "صحيح - رواه الترمذي"
        },
        {
            id: 14,
            text: "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلاَ فِي السّمَاءِ وَهو السَّمِيعُ الْعَلِيمُ",
            count: 3,
            benefit: "من قالها ثلاثًا لم يضره شيء",
            source: "صحيح - رواه الترمذي"
        },
        {
            id: 15,
            text: "رَضِيتُ بِاللَّهِ رَبَّاً، وَبِالْإِسْلاَمِ دِيناً، وَبِمُحَمَّدٍ صلى الله عليه وسلم نَبِيّياً",
            count: 3,
            benefit: "من قالها ثلاثًا كان حقًا على الله أن يرضيه",
            source: "صحيح - رواه الترمذي"
        },
        {
            id: 16,
            text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغيثُ أَصْلِحْ لِي شَأْنِيَ كُلَّهُ وَلاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
            count: 1,
            benefit: "صلاح الشأن كله وعدم الاتكال على النفس",
            source: "صحيح - رواه الحاكم"
        },
        {
            id: 17,
            text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُـمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذِهِ اللَّيْلَةِ: فَتْحَهَا، وَنَصْرَهَا، وَنورَهَا، وَبَرَكَتَهَا، وَهُدَاهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهَا وَشَرِّ مَا بَعْدَهَا",
            count: 1,
            benefit: "سؤال خير الليلة وبركاتها وهداها",
            source: "صحيح - رواه أبو داود"
        },
        {
            id: 18,
            text: "أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلاَمِ، وَعَلَى كَلِمَةِ الْإِخْلاَصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صلى الله عليه وسلم، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ، حَنِيفاً مُسْلِماً وَمَا كَانَ مِنَ الْمُشرِكِينَ",
            count: 1,
            benefit: "تجديد العهد مع الله على الإسلام والتوحيد",
            source: "صحيح - رواه أحمد"
        },
        {
            id: 19,
            text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
            count: 100,
            benefit: "حُطت خطاياه وإن كانت مثل زبد البحر",
            source: "رواه مسلم"
        },
        {
            id: 20,
            text: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شريكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهو عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
            count: 10,
            benefit: "كان كمن أعتق أربعة أنفس من ولد إسماعيل",
            source: "رواه مسلم"
        },
        {
            id: 21,
            text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
            count: 100,
            benefit: "الاستغفار من الذنوب والخطايا",
            source: "رواه البخاري ومسلم"
        },
        {
            id: 22,
            text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
            count: 3,
            benefit: "من قالها لم تضره حمة تلك الليلة",
            source: "صحيح - رواه مسلم"
        },
        {
            id: 23,
            text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبَيِّنَا مُحَمَّدٍ",
            count: 10,
            benefit: "من صلى عليّ حين يصبح وحين يمسي أدركته شفاعتي",
            source: "حسن - رواه الطبراني"
        }
    ];

    // PWA Install Prompt state
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const installPWA = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            showToast('تم البدء في تثبيت التطبيق ✨');
        }
    };
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Clock update
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch prayer times
    useEffect(() => {
        fetchPrayerTimes();
    }, [location.city, location.country]);

    // Persist progress to localStorage
    useEffect(() => {
        localStorage.setItem('azkar_progress', JSON.stringify({
            date: new Date().toDateString(),
            items: azkarProgress
        }));
    }, [azkarProgress]);

    useEffect(() => {
        localStorage.setItem('azkar_completed', JSON.stringify({
            date: new Date().toDateString(),
            items: completedAzkar
        }));
    }, [completedAzkar]);

    useEffect(() => {
        localStorage.setItem('azkar_customDuas', JSON.stringify(customDuas));
    }, [customDuas]);

    useEffect(() => {
        localStorage.setItem('azkar_location', JSON.stringify(location));
    }, [location]);

    useEffect(() => {
        localStorage.setItem('azkar_activeTab', activeTab);
    }, [activeTab]);

    // ============================================
    // COMPUTED VALUES
    // ============================================

    const progressPercentage = useMemo(() => {
        const list = activeTab === 'morning' ? morningAzkar 
                   : activeTab === 'evening' ? eveningAzkar 
                   : activeTab === 'sleeping' ? sleepingAzkar
                   : activeTab === 'prayer_azkar' ? prayerAzkar
                   : [];
        if (list.length === 0) return 0;
        const totalCounts = list.reduce((acc, z) => acc + z.count, 0);
        const currentCounts = list.reduce((acc, z) => {
            const id = `${activeTab}_${z.id}`;
            return acc + Math.min(azkarProgress[id] || 0, z.count);
        }, 0);
        return Math.round((currentCounts / totalCounts) * 100);
    }, [activeTab, azkarProgress, morningAzkar, eveningAzkar, sleepingAzkar, prayerAzkar]);

    const completedCount = useMemo(() => {
        const list = activeTab === 'morning' ? morningAzkar 
                   : activeTab === 'evening' ? eveningAzkar 
                   : activeTab === 'sleeping' ? sleepingAzkar
                   : activeTab === 'prayer_azkar' ? prayerAzkar
                   : [];
        return list.filter(z => completedAzkar[`${activeTab}_${z.id}`]).length;
    }, [activeTab, completedAzkar, morningAzkar, eveningAzkar, sleepingAzkar, prayerAzkar]);

    const totalCount = useMemo(() => {
        const list = activeTab === 'morning' ? morningAzkar 
                   : activeTab === 'evening' ? eveningAzkar 
                   : activeTab === 'sleeping' ? sleepingAzkar
                   : activeTab === 'prayer_azkar' ? prayerAzkar
                   : [];
        return list.length;
    }, [activeTab, morningAzkar, eveningAzkar, sleepingAzkar, prayerAzkar]);

    // ============================================
    // HANDLERS
    // ============================================

    const toggleDarkMode = useCallback(() => {
        setIsDarkMode(prev => {
            const next = !prev;
            localStorage.setItem('azkarDarkMode', next.toString());
            return next;
        });
    }, []);

    const fetchPrayerTimes = async () => {
        try {
            const date = new Date();
            const response = await fetch(
                `https://api.aladhan.com/v1/timingsByCity/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?city=${location.city}&country=${location.country}&method=5`
            );
            const data = await response.json();
            if (data.code === 200) {
                setPrayerTimes(data.data.timings);
            }
        } catch (error) {
            console.error('Error fetching prayer times:', error);
            // Fallback times for offline
            setPrayerTimes({
                Fajr: "04:45",
                Sunrise: "06:15",
                Dhuhr: "11:50",
                Asr: "15:10",
                Maghrib: "17:30",
                Isha: "19:00"
            });
        }
    };

    const addCustomDua = useCallback(() => {
        if (newDua.trim()) {
            setCustomDuas(prev => [...prev, newDua.trim()]);
            setNewDua('');
            showToast('تمت إضافة الدعاء بنجاح');
        }
    }, [newDua]);

    const deleteCustomDua = useCallback((index) => {
        setCustomDuas(prev => prev.filter((_, i) => i !== index));
        showToast('تم حذف الدعاء', 'info');
    }, []);

    const handleZikrProgress = useCallback((id, count) => {
        if (completedAzkar[id]) return;

        // Haptic Feedback
        if (navigator.vibrate) {
            navigator.vibrate(40);
        }

        setCountAnimation(id);
        setTimeout(() => setCountAnimation(null), 300);

        setAzkarProgress(prev => {
            const current = prev[id] || 0;
            const next = current + 1;

            if (next >= count) {
                setCompletedAzkar(comp => ({ ...comp, [id]: true }));
                showToast('ما شاء الله! تم إتمام هذا الذكر ✨');
                if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
            }

            return { ...prev, [id]: next };
        });
    }, [completedAzkar]);

    const toggleZikrComplete = useCallback((id) => {
        setCompletedAzkar(prev => {
            const isCompleted = !prev[id];
            if (!isCompleted) {
                setAzkarProgress(prog => ({ ...prog, [id]: 0 }));
                showToast('تم إعادة تعيين العداد', 'info');
            } else {
                showToast('تم إتمام الذكر ✓');
            }
            return { ...prev, [id]: isCompleted };
        });
    }, []);

    const resetAllProgress = useCallback(() => {
        setCompletedAzkar({});
        setAzkarProgress({});
        showToast('تم إعادة تعيين جميع الأذكار', 'info');
    }, []);

    const toggleBenefit = useCallback((id) => {
        setExpandedBenefits(prev => ({ ...prev, [id]: !prev[id] }));
    }, []);

    const formatTime = () => {
        return currentTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    };

    const handleTabChange = useCallback((tabId) => {
        setActiveTab(tabId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // ============================================
    // RENDER: ZIKR CARD
    // ============================================

    const ZikrCard = ({ zikr, type, index }) => {
        const uniqueId = `${type}_${zikr.id}`;
        const isCompleted = completedAzkar[uniqueId];
        const progress = azkarProgress[uniqueId] || 0;
        const isExpanded = expandedBenefits[uniqueId];
        const progressPct = Math.min((progress / zikr.count) * 100, 100);
        const isAnimating = countAnimation === uniqueId;
        const btnRef = useRef(null);

        const handleCounterClick = (e) => {
            // Ripple effect
            if (btnRef.current && !isCompleted) {
                const rect = btnRef.current.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
                ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
                btnRef.current.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            }
            handleZikrProgress(uniqueId, zikr.count);
        };

        return (
            <div
                className={`zikr-card relative overflow-hidden rounded-3xl transition-all duration-500 ${
                    isCompleted
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400/50 dark:border-emerald-500/30'
                        : 'bg-white dark:bg-slate-800/90 border-slate-100 dark:border-slate-700/50'
                } border shadow-lg hover:shadow-xl`}
                style={{ animationDelay: `${index * 60}ms` }}
            >
                {/* Top progress bar */}
                <div className="h-1 w-full bg-slate-100 dark:bg-slate-700/50">
                    <div
                        className={`h-full transition-all duration-500 ease-out ${isCompleted ? 'bg-emerald-500' : 'bg-emerald-400'}`}
                        style={{ width: `${progressPct}%` }}
                    />
                </div>

                <div className="p-5 md:p-7">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* Number badge */}
                            <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black ${
                                isCompleted
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                            }`}>
                                {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
                            </div>
                            {zikr.title && (
                                <h3 className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400 truncate">
                                    {zikr.title}
                                </h3>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                                onClick={() => {
                                    const shareText = `${zikr.title ? zikr.title + '\n' : ''}${zikr.text}\n\nتطبيق أذكاري`;
                                    if (navigator.share) {
                                        navigator.share({ title: 'ذكر من الأذكار', text: shareText });
                                    } else {
                                        navigator.clipboard.writeText(shareText);
                                        showToast('تم نسخ الذكر');
                                    }
                                }}
                                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all hover:scale-105 active:scale-95"
                                title="مشاركة"
                                aria-label="مشاركة الذكر"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => toggleZikrComplete(uniqueId)}
                                className={`p-2 rounded-xl transition-all hover:scale-105 active:scale-95 ${
                                    isCompleted
                                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200/50 dark:shadow-none'
                                        : 'bg-slate-50 dark:bg-slate-700/50 text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                                }`}
                                aria-label={isCompleted ? 'إعادة تعيين' : 'تحديد كمكتمل'}
                            >
                                <CheckCircle className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Arabic text */}
                    <p className={`font-amiri text-xl md:text-2xl leading-[2] text-center mb-6 px-1 transition-opacity ${
                        isCompleted ? 'text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-100'
                    }`}>
                        {zikr.text}
                    </p>

                    {/* Counter button area */}
                    <div className="flex items-center gap-4 mb-4">
                        {/* Counter button */}
                        <button
                            ref={btnRef}
                            onClick={handleCounterClick}
                            disabled={isCompleted}
                            className={`counter-btn relative flex-1 overflow-hidden px-6 py-4 rounded-2xl font-black text-lg transition-all active:scale-[0.97] ${
                                isCompleted
                                    ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 cursor-default'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 dark:shadow-none cursor-pointer'
                            }`}
                        >
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                {isCompleted ? (
                                    <>
                                        <CheckCircle className="w-6 h-6" />
                                        <span>تم ✓</span>
                                    </>
                                ) : (
                                    <>
                                        <span className={`text-2xl font-black tabular-nums ${isAnimating ? 'animate-count-pulse' : ''}`}>
                                            {progress}
                                        </span>
                                        <span className="opacity-60 text-base">/</span>
                                        <span className="text-base">{zikr.count}</span>
                                    </>
                                )}
                            </div>
                            {/* Inner progress fill */}
                            {!isCompleted && (
                                <div
                                    className="absolute inset-0 bg-white/15 transition-all duration-300 pointer-events-none"
                                    style={{ width: `${progressPct}%` }}
                                />
                            )}
                        </button>

                        {/* Count badge */}
                        <div className="flex flex-col items-center flex-shrink-0">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">المطلوب</span>
                            <div className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-black text-sm">
                                {zikr.count}
                            </div>
                        </div>
                    </div>

                    {/* Expandable benefit & source */}
                    {(zikr.benefit || zikr.source) && (
                        <div>
                            <button
                                onClick={() => toggleBenefit(uniqueId)}
                                className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-bold hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors w-full"
                            >
                                <Info className="w-3.5 h-3.5" />
                                <span>{isExpanded ? 'إخفاء الفضل والمصدر' : 'عرض الفضل والمصدر'}</span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>

                            {isExpanded && (
                                <div className="mt-3 space-y-2 animate-slide-up">
                                    {zikr.benefit && (
                                        <div className="flex gap-3 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-900/10 border border-blue-100/80 dark:border-blue-900/20">
                                            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-500 dark:text-blue-400 h-fit flex-shrink-0">
                                                <Heart className="w-3.5 h-3.5" />
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{zikr.benefit}</p>
                                        </div>
                                    )}
                                    {zikr.source && (
                                        <div className="flex gap-3 p-3 rounded-xl bg-slate-50/60 dark:bg-slate-900/30 border border-slate-100/80 dark:border-slate-800">
                                            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 h-fit flex-shrink-0">
                                                <BookOpen className="w-3.5 h-3.5" />
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">{zikr.source}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // ============================================
    // RENDER: AZKAR LIST
    // ============================================

    const renderAzkarList = (azkarList, type) => (
        <div className="space-y-5 stagger-children">
            {azkarList.map((zikr, index) => (
                <ZikrCard key={`${type}_${zikr.id}`} zikr={zikr} type={type} index={index} />
            ))}
        </div>
    );

    // ============================================
    // TAB CONFIG
    // ============================================

    const tabs = [
        { id: 'morning', label: 'الصباح', icon: Sun, color: 'from-amber-400 to-orange-500' },
        { id: 'evening', label: 'المساء', icon: Moon, color: 'from-indigo-500 to-purple-600' },
        { id: 'sleeping', label: 'النوم', icon: Moon, color: 'from-slate-700 to-slate-900' },
        { id: 'prayer_azkar', label: 'بعد الصلاة', icon: BookOpen, color: 'from-emerald-500 to-teal-600' },
        { id: 'prayer', label: 'المواقيت', icon: Clock, color: 'from-blue-500 to-cyan-500' },
        { id: 'custom', label: 'أدعيتي', icon: Heart, color: 'from-rose-400 to-pink-600' },
        { id: 'settings', label: 'الإعدادات', icon: Settings, color: 'from-slate-500 to-slate-700' }
    ];

    // ============================================
    // MAIN RENDER
    // ============================================

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'} transition-colors duration-500`} dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>

            <OfflineBanner />
            <ToastContainer />
            <ScrollToTop />

            {/* ===== HEADER ===== */}
            <header className="sticky top-0 z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/50">
                <div className="container mx-auto px-4 py-3 md:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 group">
                            <img
                                src="azkari_logo.png"
                                alt="أذكاري"
                                className="w-10 h-10 md:w-12 md:h-12 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-md"
                            />
                            <div>
                                <h1 className="text-lg md:text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">أذكاري</h1>
                                <p className="text-[10px] md:text-xs text-emerald-600 dark:text-emerald-400 font-bold leading-tight">الحِصن المنيع للمسلم</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Clock - hidden on mobile */}
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border border-slate-200/70 dark:border-slate-700/50">
                                <Clock className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm font-mono tracking-wider">{formatTime()}</span>
                            </div>

                            {/* Online/Offline indicator */}
                            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                                navigator.onLine
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200/70 dark:border-emerald-800/50'
                                    : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200/70 dark:border-amber-800/50'
                            }`}>
                                {navigator.onLine ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                                <span>{navigator.onLine ? 'متصل' : 'غير متصل'}</span>
                            </div>

                            {/* Dark mode toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2.5 rounded-xl bg-slate-50 dark:bg-emerald-500/10 text-slate-500 dark:text-emerald-400 border border-slate-200/70 dark:border-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                                aria-label={isDarkMode ? 'الوضع الفاتح' : 'الوضع الداكن'}
                            >
                                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Global progress bar */}
                {(activeTab === 'morning' || activeTab === 'evening') && (
                    <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
                        <div
                            className="h-full bg-gradient-to-l from-emerald-400 to-emerald-600 transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                )}
            </header>

            {/* ===== DESKTOP TAB NAVIGATION ===== */}
            <div className="hidden md:block container mx-auto px-4 py-6">
                <div className="max-w-3xl mx-auto">
                    <div className="p-1.5 bg-white dark:bg-slate-800/90 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50 flex gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl transition-all duration-300 flex-1 font-bold text-sm ${
                                    activeTab === tab.id
                                        ? `bg-gradient-to-br ${tab.color} text-white shadow-lg scale-[1.02]`
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                                }`}
                            >
                                <tab.icon className="w-4.5 h-4.5" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== MAIN CONTENT ===== */}
            <main ref={mainRef} className="container mx-auto px-4 py-6 md:py-8">
                <div className="max-w-3xl mx-auto">

                    {/* Progress Hero for Morning/Evening/Sleeping/PrayerAzkar */}
                    {(activeTab === 'morning' || activeTab === 'evening' || activeTab === 'sleeping' || activeTab === 'prayer_azkar') && (
                        <div className={`mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-br transition-all duration-500 shadow-2xl relative overflow-hidden ${
                            activeTab === 'morning' ? 'from-amber-400 to-orange-600' 
                            : activeTab === 'evening' ? 'from-indigo-600 to-purple-800'
                            : activeTab === 'sleeping' ? 'from-slate-800 to-slate-950'
                            : 'from-emerald-600 to-teal-800'
                        } text-white`}>
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 p-6 opacity-[0.08] float-slow">
                                {activeTab === 'morning' ? <Sun className="w-40 h-40" /> 
                                : activeTab === 'evening' || activeTab === 'sleeping' ? <Moon className="w-40 h-40" />
                                : <BookOpen className="w-40 h-40" />}
                            </div>

                            <div className="relative z-10">
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl md:text-4xl font-black mb-2">
                                            {activeTab === 'morning' ? '☀️ أذكار الصباح' 
                                            : activeTab === 'evening' ? '🌙 أذكار المساء'
                                            : activeTab === 'sleeping' ? '🌌 أذكار النوم'
                                            : '🕌 أذكار بعد الصلاة'}
                                        </h2>
                                        <p className="text-white/70 text-sm md:text-base font-medium">
                                            تم إنجاز {completedCount} من {totalCount} أذكار • {progressPercentage}%
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20 text-center">
                                            <span className="text-2xl md:text-3xl font-black block leading-none mb-0.5">{progressPercentage}%</span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">التقدم</span>
                                        </div>
                                        {progressPercentage > 0 && (
                                            <button
                                                onClick={resetAllProgress}
                                                className="p-2.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-white/80 hover:text-white hover:bg-white/25 transition-all active:scale-95"
                                                title="إعادة تعيين"
                                                aria-label="إعادة تعيين التقدم"
                                            >
                                                <RotateCcw className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Mini progress bar */}
                                <div className="mt-4 h-2 rounded-full bg-white/20 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-white/80 transition-all duration-1000 ease-out"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Morning Azkar */}
                    {activeTab === 'morning' && renderAzkarList(morningAzkar, 'morning')}

                    {/* Evening Azkar */}
                    {activeTab === 'evening' && renderAzkarList(eveningAzkar, 'evening')}

                    {/* Prayer Times */}
                    {activeTab === 'prayer' && (
                        <div className="animate-slide-up">
                            <div className="mb-6 text-center">
                                <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-2">🕌 مواقيت الصلاة</h2>
                                <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">{location.city} — {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {prayerTimes ? [
                                    { name: 'الفجر', key: 'Fajr', icon: '🌅', color: 'from-blue-600 to-indigo-600' },
                                    { name: 'الشروق', key: 'Sunrise', icon: '☀️', color: 'from-amber-400 to-orange-500' },
                                    { name: 'الظهر', key: 'Dhuhr', icon: '🌞', color: 'from-yellow-400 to-amber-500' },
                                    { name: 'العصر', key: 'Asr', icon: '🌤️', color: 'from-orange-500 to-red-500' },
                                    { name: 'المغرب', key: 'Maghrib', icon: '🌆', color: 'from-purple-600 to-pink-600' },
                                    { name: 'العشاء', key: 'Isha', icon: '🌙', color: 'from-indigo-700 to-slate-900' }
                                ].map((p) => (
                                    <div key={p.key} className={`bg-gradient-to-br ${p.color} p-5 md:p-6 rounded-2xl text-white shadow-lg hover:scale-[1.03] transition-all group cursor-default`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform duration-500 block">{p.icon}</span>
                                            <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
                                        </div>
                                        <h3 className="text-sm md:text-base font-bold opacity-80 mb-1">{p.name}</h3>
                                        <p className="text-2xl md:text-3xl font-black tracking-tighter">{prayerTimes[p.key] || '00:00'}</p>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-16 text-center">
                                        <div className="inline-block w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                                        <p className="text-slate-400 font-bold">جاري تحميل المواقيت...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Custom Duas */}
                    {activeTab === 'custom' && (
                        <div className="animate-slide-up space-y-6">
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl">
                                <h2 className="text-2xl font-black mb-1 flex items-center gap-3">
                                    <Heart className="w-7 h-7 text-rose-300" />
                                    أدعيتك الخاصة
                                </h2>
                                <p className="opacity-70 text-sm font-medium">أضف أدعيتك المفضلة هنا واحتفظ بها دائماً</p>
                            </div>

                            <div className="flex gap-2 bg-white dark:bg-slate-800/90 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50 p-1.5">
                                <input
                                    type="text"
                                    value={newDua}
                                    onChange={(e) => setNewDua(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addCustomDua()}
                                    placeholder="اكتب دعاءً جديداً..."
                                    className="flex-1 px-5 py-3 bg-transparent text-slate-800 dark:text-white text-base focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    id="custom-dua-input"
                                />
                                <button
                                    onClick={addCustomDua}
                                    className="px-6 py-3 bg-indigo-600 text-white font-black text-sm rounded-xl hover:bg-indigo-500 shadow-md transition-all active:scale-95"
                                    id="add-dua-btn"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3 stagger-children">
                                {customDuas.length === 0 && (
                                    <div className="py-12 text-center">
                                        <Heart className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                                        <p className="text-slate-400 dark:text-slate-500 font-bold">لا توجد أدعية بعد</p>
                                        <p className="text-sm text-slate-300 dark:text-slate-600">أضف أدعيتك المفضلة عبر الحقل أعلاه</p>
                                    </div>
                                )}
                                {customDuas.map((dua, i) => (
                                    <div key={i} className="group p-5 bg-white dark:bg-slate-800/90 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700/50 hover:shadow-lg transition-all">
                                        <div className="flex items-start justify-between gap-4">
                                            <p className="text-lg md:text-xl font-amiri text-slate-800 dark:text-slate-100 leading-relaxed flex-1">{dua}</p>
                                            <button
                                                onClick={() => deleteCustomDua(i)}
                                                className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                                                aria-label="حذف الدعاء"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Settings */}
                    {activeTab === 'settings' && (
                        <div className="animate-slide-up space-y-6">
                            {/* PWA Settings */}
                            {deferredPrompt && (
                                <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl shadow-lg border border-emerald-100 dark:border-emerald-800/30 animate-scale-in">
                                    <h3 className="text-xl font-black text-emerald-800 dark:text-emerald-400 mb-4 flex items-center gap-3">
                                        <Download className="w-6 h-6" />
                                        تثبيت كمتطبيق
                                    </h3>
                                    <p className="text-sm text-emerald-600 dark:text-emerald-500 mb-6 font-medium">يمكنك تثبيت أذكاري على جهازك للوصول السريع والعمل بدون إنترنت دائماً.</p>
                                    <button 
                                        onClick={installPWA}
                                        className="w-full py-4 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-500 transition-all active:scale-95"
                                    >
                                        تثبيت الآن
                                    </button>
                                </div>
                            )}

                            {/* Location Settings */}
                            <div className="p-6 bg-white dark:bg-slate-800/90 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50">
                                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                                    <MapPin className="w-6 h-6 text-emerald-500" />
                                    الموقع الافتراضي
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 mr-1" htmlFor="city-input">المدينة</label>
                                        <input
                                            id="city-input"
                                            type="text"
                                            value={location.city}
                                            onChange={(e) => setLocation({...location, city: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-emerald-500 outline-none text-slate-800 dark:text-white font-bold text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 mr-1" htmlFor="country-input">كود الدولة</label>
                                        <input
                                            id="country-input"
                                            type="text"
                                            value={location.country}
                                            onChange={(e) => setLocation({...location, country: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-emerald-500 outline-none text-slate-800 dark:text-white font-bold text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Appearance */}
                            <div className="p-6 bg-white dark:bg-slate-800/90 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50">
                                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                                    {isDarkMode ? <Moon className="w-6 h-6 text-indigo-400" /> : <Sun className="w-6 h-6 text-amber-500" />}
                                    المظهر
                                </h3>
                                <button
                                    onClick={toggleDarkMode}
                                    className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
                                >
                                    <span className="text-slate-700 dark:text-slate-300 font-bold">{isDarkMode ? 'الوضع الداكن مُفعّل' : 'الوضع الفاتح مُفعّل'}</span>
                                    <div className={`w-12 h-7 rounded-full transition-colors duration-300 flex items-center p-1 ${isDarkMode ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                        <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${isDarkMode ? '-translate-x-5' : ''}`} />
                                    </div>
                                </button>
                            </div>

                            {/* About / PWA */}
                            <div className="p-6 bg-white dark:bg-slate-800/90 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50">
                                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4 flex items-center gap-3">
                                    <Download className="w-6 h-6 text-emerald-500" />
                                    حول التطبيق
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
                                        <span className="text-sm text-emerald-700 dark:text-emerald-400 font-bold">✅ يعمل بدون إنترنت</span>
                                        <span className="text-xs text-emerald-500 dark:text-emerald-300 font-medium">PWA</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                        <span className="text-sm text-slate-600 dark:text-slate-400 font-bold">💾 يحفظ تقدمك تلقائياً</span>
                                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">localStorage</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                        <span className="text-sm text-slate-600 dark:text-slate-400 font-bold">🔄 يُعاد التعيين تلقائياً كل يوم</span>
                                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">يومي</span>
                                    </div>
                                </div>
                            </div>

                            {/* Reset button */}
                            <button
                                onClick={() => {
                                    resetAllProgress();
                                    showToast('تم إعادة تعيين جميع التقدم', 'info');
                                }}
                                className="w-full py-4 rounded-2xl bg-rose-500 text-white text-base font-black shadow-lg shadow-rose-200 dark:shadow-none hover:bg-rose-400 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                id="reset-all-btn"
                            >
                                <RotateCcw className="w-5 h-5" />
                                إعادة تعيين جميع الأذكار
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* ===== FOOTER ===== */}
            <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-10 md:py-14 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-slate-400 dark:text-slate-500 font-bold mb-4 tracking-widest text-xs uppercase">تطبيق الأذكار اليومية</p>
                    <h2 className="text-xl md:text-2xl font-amiri text-slate-700 dark:text-slate-300 mb-6 italic">"أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"</h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-10 h-px bg-slate-200 dark:bg-slate-800" />
                        <BookOpen className="w-6 h-6 text-emerald-500 opacity-50" />
                        <div className="w-10 h-px bg-slate-200 dark:bg-slate-800" />
                    </div>
                </div>
            </footer>

            {/* ===== MOBILE BOTTOM NAVIGATION ===== */}
            <nav className="bottom-nav" role="navigation" aria-label="القائمة الرئيسية">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`bottom-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                        aria-label={tab.label}
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                    >
                        <tab.icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

// Render the application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AzkarApp />);
