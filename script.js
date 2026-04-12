const { useState, useEffect, useMemo } = React;
const { Clock, Moon, Sun, MapPin, Bell, BookOpen, Plus, Settings, Save, CheckCircle, Share2, Trash2, Heart, Info, ArrowUp, ChevronLeft } = LucideReact;

const AzkarApp = () => {
    const [activeTab, setActiveTab] = useState('morning');
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [location, setLocation] = useState({ city: 'Cairo', country: 'EG' });
    const [customDuas, setCustomDuas] = useState([]);
    const [newDua, setNewDua] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [completedAzkar, setCompletedAzkar] = useState({});
    const [azkarProgress, setAzkarProgress] = useState({});
    const [preferences, setPreferences] = useState({
        morningTime: '06:00',
        eveningTime: '17:00',
        notificationsEnabled: true,
        darkMode: false,
        fontSize: 'xl'
    });
    const [isDarkMode, setIsDarkMode] = useState(false);

    // الأذكار الصباحية والمسائية الصحيحة
    const morningAzkar = [
        {
            id: 1,
            title: "آية الكرسي",
            text: "أَعُوذُ بِاللَّهِ مِنَ الشَّيطَانِ الرَّجِيمِ ﴿اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَواتِ وَمَا فِي الأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلاَّ بِمَا شَاء وَسِعَ كُرْسِيُّهُ السَّمَواتِ وَالْأَرْضَ وَلاَ يَؤُودُهُ حِفْظُهما وَهُوَ الْعَلِيُّ الْعَظِيمُ﴾",
            count: 1,
            benefit: "من قالها حين يصبح أُجير من الجن حتى يُمسي",
            source: "صحيح - رواه الحاكم"
        },
        {
            id: 2,
            title: "سورة الإخلاص",
            text: "بسم الله الرحمن الرحيم ﴿قُلْ هُوَ اللَّهُ أَحَدٌ* اللَّهُ الصَّمَدُ* لَمْ يَلِدْ وَلَمْ يُولَد* لَمْ يَكُن لَّهُ كُفُواً أَحَدٌ﴾",
            count: 3,
            benefit: "تكفيه من كل شيء",
            source: "صحيح - رواه أبو داود"
        },
        {
            id: 3,
            title: "سورة الفلق",
            text: "بسم الله الرحمن الرحيم ﴿قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ* مِن شَرِّ مَا خَلَقَ* وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ* وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ* وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ﴾",
            count: 3,
            benefit: "تكفيه من كل شيء",
            source: "صحيح - رواه أبو داود"
        },
        {
            id: 4,
            title: "سورة الناس",
            text: "بسم الله الرحمن الرحيم ﴿قُلْ أَعُوذُ بِرَبِّ النَّاسِ* مَلِكِ النَّاسِ* إِلَهِ النَّاسِ* مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ* الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ* مِنَ الْجِنَّةِ وَ النَّاسِ﴾",
            count: 3,
            benefit: "تكفيه من كل شيء",
            source: "صحيح - رواه أبو داود"
        },
        {
            id: 5,
            text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ، وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ، وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
            count: 1,
            benefit: "سؤال خير اليوم والاستعاذة من شره",
            source: "رواه مسلم"
        },
        {
            id: 6,
            text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
            count: 1,
            benefit: "ذكر الصباح للاستعانة بالله في اليوم",
            source: "صحيح - رواه الترمذي"
        },
        {
            id: 7,
            title: "سيد الاستغفار",
            text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عهدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنوبَ إِلاَّ أَنْتَ",
            count: 1,
            benefit: "من قالها من النهار موقنًا بها، فمات من يومه قبل أن يُمسي، فهو من أهل الجنة",
            source: "رواه البخاري"
        },
        {
            id: 8,
            text: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلاَئِكَتِكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيكَ لَكَ، وَأَنَّ مُحَمَّداً عَبْدُكَ وَرَسُولُكَ",
            count: 4,
            benefit: "من قالها حين يصبح أو يمسي أربع مرات أعتقه الله من النار",
            source: "حسن - رواه أبو داود"
        },
        {
            id: 9,
            text: "اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لاَ شريكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ",
            count: 1,
            benefit: "من قالها حين يصبح فقد أدى شكر يومه",
            source: "صحيح - رواه أبو داود"
        },
        {
            id: 10,
            text: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لاَ إِلَهَ إِلاَّ أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ، وَالفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ القَبْرِ، لاَ إِلَهَ إِلاَّ أَنْتَ",
            count: 3,
            benefit: "الدعاء بالعافية والاستعاذة من الكفر والفقر",
            source: "حسن - رواه أحمد"
        },
        {
            id: 11,
            text: "حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ عَلَيهِ تَوَكَّلتُ وَهو رَبُّ الْعَرْشِ الْعَظِيمِ",
            count: 7,
            benefit: "من قالها كفاه الله ما أهمه من أمر الدنيا والآخرة",
            source: "صحيح - رواه ابن السني"
        },
        {
            id: 12,
            text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ: فِي دِينِي وَدُنْيَايَ وَأَهْلِي، وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي، وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَينِ يَدَيَّ، وَمِنْ خَلْفِي، وَعَنْ يَمِينِي، وَعَنْ شِمَالِي، وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي",
            count: 1,
            benefit: "حفظ شامل في جميع الجهات من كل سوء",
            source: "صحيح - رواه أبو داود"
        },
        {
            id: 13,
            text: "اللَّهُمَّ عَالِمَ الغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَواتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطانِ وَشَرَكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءاً، أو أَجُرَّهُ إِلَى مُسْلِمٍ",
            count: 1,
            benefit: "الاستعاذة من شر النفس والشيطان",
            source: "صحيح - رواه الترمذي"
        },
        {
            id: 14,
            text: "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلاَ فِي السّمَاءِ وَهو السَّمِيعُ الْعَلِيمُ",
            count: 3,
            benefit: "من قالها ثلاثًا لم يضره شيء",
            source: "صحيح - رواه الترمذي"
        },
        {
            id: 15,
            text: "رَضِيتُ بِاللَّهِ رَبَّاً، وَبِالْإِسْلاَمِ دِيناً، وَبِمُحَمَّدٍ صلى الله عليه وسلم نَبِيّياً",
            count: 3,
            benefit: "من قالها ثلاثًا كان حقًا على الله أن يرضيه",
            source: "صحيح - رواه الترمذي"
        },
        {
            id: 16,
            text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغيثُ أَصْلِحْ لِي شَأْنِيَ كُلَّهُ وَلاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
            count: 1,
            benefit: "صلاح الشأن كله وعدم الاتكال على النفس",
            source: "صحيح - رواه الحاكم"
        },
        {
            id: 17,
            text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ: فَتْحَهُ، وَنَصْرَهُ، وَنورَهُ، وَبَرَكَتَهُ، وَهُدَاهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَشَرِّ مَا بَعْدَهُ",
            count: 1,
            benefit: "سؤال خير اليوم وبركته وهداه",
            source: "صحيح - رواه أبو داود"
        },
        {
            id: 18,
            text: "أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلاَمِ، وَعَلَى كَلِمَةِ الْإِخْلاَصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صلى الله عليه وسلم، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ، حَنِيفاً مُسْلِماً وَمَا كَانَ مِنَ الْمُشرِكِينَ",
            count: 1,
            benefit: "تجديد العهد مع الله على الإسلام والتوحيد",
            source: "صحيح - رواه أحمد"
        },
        {
            id: 19,
            text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
            count: 100,
            benefit: "حُطت خطاياه وإن كانت مثل زبد البحر",
            source: "رواه مسلم"
        },
        {
            id: 20,
            text: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شريكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهو عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
            count: 100,
            benefit: "كانت له حرزًا من الشيطان يومه ذلك حتى يمسي",
            source: "رواه البخاري ومسلم"
        },
        {
            id: 21,
            text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ",
            count: 3,
            benefit: "تسبيح عظيم بعدد مخلوقات الله",
            source: "رواه مسلم"
        },
        {
            id: 22,
            text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْماً نَافِعاً، وَرِزْقاً طَيِّباً، وَعَمَلاً مُتَقَبَّلاً",
            count: 1,
            benefit: "دعاء جامع للخير في الرزق والعمل",
            source: "صحيح - رواه ابن ماجه"
        },
        {
            id: 23,
            text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
            count: 100,
            benefit: "الاستغفار من الذنوب والخطايا",
            source: "رواه البخاري ومسلم"
        },
        {
            id: 24,
            text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبَيِّنَا مُحَمَّدٍ",
            count: 10,
            benefit: "من صلى عليّ حين يصبح وحين يمسي أدركته شفاعتي",
            source: "حسن - رواه الطبراني"
        }
    ];

    // أذكار المساء
    const eveningAzkar = [
        {
            id: 1,
            title: "آية الكرسي",
            text: "أَعُوذُ بِاللَّهِ مِنَ الشَّيطَانِ الرَّجِيمِ ﴿اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَواتِ وَمَا فِي الأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلاَّ بِمَا شَاء وَسِعَ كُرْسِيُّهُ السَّمَواتِ وَالْأَرْضَ وَلاَ يَؤُودُهُ حِفْظُهما وَهُوَ الْعَلِيُّ الْعَظِيمُ﴾",
            count: 1,
            benefit: "من قالها حين يمسي، أُجير من الجن حتى يصبح",
            source: "صحيح - رواه الحاكم"
        },
        {
            id: 2,
            title: "سورة الإخلاص",
            text: "بسم الله الرحمن الرحيم ﴿قُلْ هُوَ اللَّهُ أَحَدٌ* اللَّهُ الصَّمَدُ* لَمْ يَلِدْ وَلَمْ يُولَد* لَمْ يَكُن لَّهُ كُفُواً أَحَدٌ﴾",
            count: 3,
            benefit: "تكفيه من كل شيء",
            source: "صحيح - رواه أبو داود"
        },
        {
            id: 3,
            title: "سورة الفلق",
            text: "بسم الله الرحمن الرحيم ﴿قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ* مِن شَرِّ مَا خَلَقَ* وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ* وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ* وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ﴾",
            count: 3,
            benefit: "تكفيه من كل شيء",
            source: "صحيح - رواه أبو داود"
        },
        {
            id: 4,
            title: "سورة الناس",
            text: "بسم الله الرحمن الرحيم ﴿قُلْ أَعُوذُ بِرَبِّ النَّاسِ* مَلِكِ النَّاسِ* إِلَهِ النَّاسِ* مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ* الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ* مِنَ الْجِنَّةِ وَ النَّاسِ﴾",
            count: 3,
            benefit: "تكفيه من كل شيء",
            source: "صحيح - رواه أبو داود"
        },
        {
            id: 5,
            text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهو عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيرَ مَا بَعْدَهَا ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
            count: 1,
            benefit: "سؤال خير الليلة والاستعاذة من شرورها",
            source: "رواه مسلم"
        },
        {
            id: 6,
            text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا ، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
            count: 1,
            benefit: "ذكر المساء للاستعانة بالله في الليلة",
            source: "صحيح - رواه الترمذي"
        },
        {
            id: 7,
            title: "سيد الاستغفار",
            text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عهدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنوبَ إِلاَّ أَنْتَ",
            count: 1,
            benefit: "من قالها من الليل وهو مُوقن بها، فمات قبل أن يُصبح، فهو من أهل الجنة",
            source: "رواه البخاري"
        },
        {
            id: 8,
            text: "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلاَئِكَتِكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيكَ لَكَ، وَأَنَّ مُحَمَّداً عَبْدُكَ وَرَسُولُكَ",
            count: 4,
            benefit: "من قالها أربعًا أعتقه الله من النار",
            source: "حسن - رواه أبو داود"
        },
        {
            id: 9,
            text: "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لاَ شريكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ",
            count: 1,
            benefit: "من قالها حين يمسي فقد أدى شكر ليلته",
            source: "صحيح - رواه أبو داود"
        },
        {
            id: 10,
            text: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لاَ إِلَهَ إِلاَّ أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ، وَالفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ القَبْرِ، لاَ إِلَهَ إِلاَّ أَنْتَ",
            count: 3,
            benefit: "الدعاء بالعافية والاستعاذة من الكفر والفقر",
            source: "حسن - رواه أحمد"
        },
        {
            id: 11,
            text: "حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ عَلَيهِ تَوَكَّلتُ وَهو رَبُّ الْعَرْشِ الْعَظِيمِ",
            count: 7,
            benefit: "من قالها كفاه الله ما أهمه من أمر الدنيا والآخرة",
            source: "صحيح - رواه ابن السني"
        },
        {
            id: 12,
            text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ: فِي دِينِي وَدُنْيَايَ وَأَهْلِي، وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي، وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَينِ يَدَيَّ، وَمِنْ خَلْفِي، وَعَنْ يَمِينِي، وَعَنْ شِمَالِي، وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي",
            count: 1,
            benefit: "حفظ شامل في جميع الجهات من كل سوء",
            source: "صحيح - رواه أبو داود"
        },
        {
            id: 13,
            text: "اللَّهُمَّ عَالِمَ الغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَواتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطانِ وَشَرَكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءاً، أو أَجُرَّهُ إِلَى مُسْلِمٍ",
            count: 1,
            benefit: "الاستعاذة من شر النفس والشيطان",
            source: "صحيح - رواه الترمذي"
        },
        {
            id: 14,
            text: "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلاَ فِي السّمَاءِ وَهو السَّمِيعُ الْعَلِيمُ",
            count: 3,
            benefit: "من قالها ثلاثًا لم يضره شيء",
            source: "صحيح - رواه الترمذي"
        },
        {
            id: 15,
            text: "رَضِيتُ بِاللَّهِ رَبَّاً، وَبِالْإِسْلاَمِ دِيناً، وَبِمُحَمَّدٍ صلى الله عليه وسلم نَبِيّياً",
            count: 3,
            benefit: "من قالها ثلاثًا كان حقًا على الله أن يرضيه",
            source: "صحيح - رواه الترمذي"
        },
        {
            id: 16,
            text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغيثُ أَصْلِحْ لِي شَأْنِيَ كُلَّهُ وَلاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
            count: 1,
            benefit: "صلاح الشأن كله وعدم الاتكال على النفس",
            source: "صحيح - رواه الحاكم"
        },
        {
            id: 17,
            text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُـمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذِهِ اللَّيْلَةِ: فَتْحَهَا، وَنَصْرَهَا، وَنورَهَا، وَبَرَكَتَهَا، وَهُدَاهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهَا وَشَرِّ مَا بَعْدَهَا",
            count: 1,
            benefit: "سؤال خير الليلة وبركاتها وهداها",
            source: "صحيح - رواه أبو داود"
        },
        {
            id: 18,
            text: "أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلاَمِ، وَعَلَى كَلِمَةِ الْإِخْلاَصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صلى الله عليه وسلم، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ، حَنِيفاً مُسْلِماً وَمَا كَانَ مِنَ الْمُشرِكِينَ",
            count: 1,
            benefit: "تجديد العهد مع الله على الإسلام والتوحيد",
            source: "صحيح - رواه أحمد"
        },
        {
            id: 19,
            text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
            count: 100,
            benefit: "حُطت خطاياه وإن كانت مثل زبد البحر",
            source: "رواه مسلم"
        },
        {
            id: 20,
            text: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شريكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهو عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
            count: 10,
            benefit: "كان كمن أعتق أربعة أنفس من ولد إسماعيل",
            source: "رواه مسلم"
        },
        {
            id: 21,
            text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
            count: 100,
            benefit: "الاستغفار من الذنوب والخطايا",
            source: "رواه البخاري ومسلم"
        },
        {
            id: 22,
            text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
            count: 3,
            benefit: "من قالها لم تضره حمة تلك الليلة",
            source: "صحيح - رواه مسلم"
        },
        {
            id: 23,
            text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبَيِّنَا مُحَمَّدٍ",
            count: 10,
            benefit: "من صلى عليّ حين يصبح وحين يمسي أدركته شفاعتي",
            source: "حسن - رواه الطبراني"
        }
    ];

    useEffect(() => {
        fetchPrayerTimes();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        loadPreferences();

        // Dark mode initial check
        const savedDarkMode = localStorage.getItem('azkarDarkMode') === 'true';
        setIsDarkMode(savedDarkMode);
        if (savedDarkMode) document.documentElement.classList.add('dark');

        return () => clearInterval(timer);
    }, [location]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('azkarDarkMode', (!isDarkMode).toString());
    };

    const progressPercentage = useMemo(() => {
        const list = activeTab === 'morning' ? morningAzkar : activeTab === 'evening' ? eveningAzkar : [];
        if (list.length === 0) return 0;
        const totalCounts = list.reduce((acc, z) => acc + z.count, 0);
        const currentCounts = list.reduce((acc, z) => {
            const id = `${activeTab}_${z.id}`;
            return acc + (azkarProgress[id] || 0);
        }, 0);
        return Math.round((currentCounts / totalCounts) * 100);
    }, [activeTab, azkarProgress, morningAzkar, eveningAzkar]);

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

    const loadPreferences = () => {
        const savedDuas = [
            "اللهم إني أسألك العفو والعافية في الدنيا والآخرة",
            "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار"
        ];
        setCustomDuas(savedDuas);
    };

    const savePreferences = async () => {
        alert('تم حفظ التفضيلات بنجاح! ✓');
    };

    const addCustomDua = () => {
        if (newDua.trim()) {
            setCustomDuas([...customDuas, newDua]);
            setNewDua('');
            alert('تمت إضافة الدعاء بنجاح! ✓');
        }
    };

    const deleteCustomDua = (index) => {
        setCustomDuas(customDuas.filter((_, i) => i !== index));
    };

    const handleZikrProgress = (id, count) => {
        if (completedAzkar[id]) return;

        setAzkarProgress(prev => {
            const current = prev[id] || 0;
            const next = current + 1;
            
            if (next >= count) {
                setCompletedAzkar(comp => ({ ...comp, [id]: true }));
            }
            
            return { ...prev, [id]: next };
        });
    };

    const toggleZikrComplete = (id) => {
        setCompletedAzkar(prev => {
            const isCompleted = !prev[id];
            if (!isCompleted) {
                setAzkarProgress(prog => ({ ...prog, [id]: 0 }));
            }
            return { ...prev, [id]: isCompleted };
        });
    };

    const formatTime = () => {
        return currentTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    };

    const renderAzkarList = (azkarList, type) => {return (
        <div className="space-y-6 animate-slide-up">
            {azkarList.map((zikr, index) => {
                const uniqueId = `${type}_${zikr.id}`;
                const isCompleted = completedAzkar[uniqueId];
                const progress = azkarProgress[uniqueId] || 0;
                
                return (
                    <div
                        key={uniqueId}
                        className={`group relative overflow-hidden rounded-3xl transition-all duration-500 hover:shadow-2xl ${
                            isCompleted 
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500/50' 
                                : 'bg-white dark:bg-slate-800 border-transparent'
                        } border-2 shadow-lg`}
                    >
                        {/* Status Badge */}
                        <div className={`absolute top-0 right-0 h-1 transition-all duration-500 ${isCompleted ? 'bg-emerald-500 w-full' : 'bg-emerald-200 dark:bg-emerald-800 w-0 group-hover:w-full'}`} />
                        
                        <div className="p-6 md:p-8">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                {zikr.title && (
                                    <h3 className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400">
                                        {zikr.title}
                                    </h3>
                                )}
                                <div className="flex items-center gap-2">
                                     <button
                                        onClick={() => {
                                            const shareText = `${zikr.title ? zikr.title + '\n' : ''}${zikr.text}\n\nتطبيق الأذكار`;
                                            if (navigator.share) {
                                                navigator.share({ title: 'ذكر من الأذكار', text: shareText });
                                            } else {
                                                navigator.clipboard.writeText(shareText);
                                                alert('تم نسخ الذكر!');
                                            }
                                        }}
                                        className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                                        title="مشاركة"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => toggleZikrComplete(uniqueId)}
                                        className={`p-2.5 rounded-2xl transition-all ${
                                            isCompleted
                                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200/50 dark:shadow-none'
                                                : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                                        }`}
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <p className="font-amiri text-2xl md:text-3xl text-slate-800 dark:text-slate-100 leading-[1.8] text-center mb-8 px-2">
                                {zikr.text}
                            </p>

                            <div className="flex flex-col gap-6">
                                {/* Interaction Area */}
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-3 order-2 md:order-1">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold mb-1">العدد المطلوب</span>
                                            <div className="flex items-center gap-2">
                                                <div className="px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold text-lg">
                                                    {zikr.count} <span className="text-xs mr-1 opacity-70">مرات</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 w-full order-1 md:order-2">
                                        <button
                                            onClick={() => handleZikrProgress(uniqueId, zikr.count)}
                                            disabled={isCompleted}
                                            className={`relative w-full group/btn overflow-hidden px-8 py-5 rounded-[2rem] font-black text-xl transition-all active:scale-95 shadow-xl ${
                                                isCompleted
                                                    ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 shadow-none'
                                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-200 dark:hover:shadow-none'
                                            }`}
                                        >
                                            <div className="relative z-10 flex items-center justify-center gap-3">
                                                {isCompleted ? (
                                                    <>
                                                        <CheckCircle className="w-8 h-8" />
                                                        <span>تم الانتهاء</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-3xl">{progress}</span>
                                                        <span className="opacity-60">/</span>
                                                        <span>{zikr.count}</span>
                                                    </>
                                                )}
                                            </div>
                                            {!isCompleted && (
                                                <div 
                                                    className="absolute inset-0 bg-white/20 transition-all duration-300 pointer-events-none" 
                                                    style={{ width: `${(progress / zikr.count) * 100}%` }}
                                                />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Details / Source */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {zikr.benefit && (
                                        <div className="flex gap-4 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                                            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 h-fit">
                                                <Info className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">الفضل والأثر</h4>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{zikr.benefit}</p>
                                            </div>
                                        </div>
                                    )}
                                    {zikr.source && (
                                        <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800">
                                            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 h-fit">
                                                <BookOpen className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">تخريج الذكر</h4>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">{zikr.source}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );};  

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 font-inter' : 'bg-slate-50'} transition-colors duration-500`} dir="rtl">
            {/* Main Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/50">
                <div className="container mx-auto px-4 py-4 md:py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 group">
                            <img
                                src="azkari_logo.png"
                                alt="أذكاري"
                                className="w-12 h-12 md:w-16 md:h-16 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-md"
                            />
                            <div>
                                <h1 className="text-xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">أذكاري</h1>
                                <p className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 font-bold">الحِصن المنيع للمسلم</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                                <Clock className="w-5 h-5 text-emerald-500" />
                                <span className="text-lg font-mono tracking-wider">{formatTime()}</span>
                            </div>
                            
                            <button
                                onClick={toggleDarkMode}
                                className="p-3 rounded-2xl bg-slate-100 dark:bg-emerald-500/10 text-slate-600 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Global Progress Bar */}
                {(activeTab === 'morning' || activeTab === 'evening') && (
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
                        <div 
                            className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                )}
            </header>

            <main className="container mx-auto px-4 py-8 md:py-12">
                {/* Navigation Pills */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700 flex gap-1 overflow-x-auto no-scrollbar scroll-smooth">
                        {[
                            { id: 'morning', label: 'الصباح', icon: Sun, color: 'from-amber-400 to-orange-500' },
                            { id: 'evening', label: 'المساء', icon: Moon, color: 'from-indigo-500 to-purple-600' },
                            { id: 'prayer', label: 'المواقيت', icon: MapPin, color: 'from-blue-500 to-cyan-500' },
                            { id: 'custom', label: 'أدعيتي', icon: Heart, color: 'from-rose-400 to-pink-600' },
                            { id: 'settings', label: 'الإعدادات', icon: Settings, color: 'from-slate-500 to-slate-700' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-6 py-4 rounded-3xl transition-all duration-300 min-w-fit flex-1 font-bold ${
                                    activeTab === tab.id
                                        ? `bg-gradient-to-br ${tab.color} text-white shadow-lg shadow-${tab.id === 'morning' ? 'amber' : tab.id === 'evening' ? 'indigo' : 'emerald'}-200 dark:shadow-none scale-[1.02]`
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                                }`}
                            >
                                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'animate-bounce' : ''}`} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Progress Info Header */}
                    {(activeTab === 'morning' || activeTab === 'evening') && (
                        <div className={`mb-12 p-8 rounded-[2.5rem] bg-gradient-to-br transition-all duration-500 ${
                            activeTab === 'morning' ? 'from-amber-400 to-orange-600 shadow-amber-200' : 'from-indigo-600 to-purple-800 shadow-indigo-200'
                        } text-white shadow-2xl relative overflow-hidden group`}>
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                {activeTab === 'morning' ? <Sun className="w-48 h-48" /> : <Moon className="w-48 h-48" />}
                            </div>
                            
                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                    <div>
                                        <h2 className="text-3xl md:text-5xl font-black mb-3">
                                            {activeTab === 'morning' ? 'أذكار الصباح' : 'أذكار المساء'}
                                        </h2>
                                        <p className="text-white/80 text-lg font-medium">تم إنجاز {progressPercentage}% من أذكارك اليومية</p>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 text-center">
                                        <span className="text-3xl font-black block leading-none mb-1">{progressPercentage}%</span>
                                        <span className="text-xs font-bold uppercase tracking-widest opacity-80">التقدم الكلي</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'morning' && renderAzkarList(morningAzkar, 'morning')}
                    {activeTab === 'evening' && renderAzkarList(eveningAzkar, 'evening')}

                    {activeTab === 'prayer' && (
                        <div className="animate-slide-up">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {prayerTimes ? [
                                    { name: 'الفجر', key: 'Fajr', icon: '🌅', color: 'from-blue-600 to-indigo-600' },
                                    { name: 'الشروق', key: 'الشروق', icon: '☀️', color: 'from-amber-400 to-orange-500' },
                                    { name: 'الظهر', key: 'Dhuhr', icon: '🌞', color: 'from-yellow-400 to-amber-500' },
                                    { name: 'العصر', key: 'Asr', icon: '🌤️', color: 'from-orange-500 to-red-500' },
                                    { name: 'المغرب', key: 'Maghrib', icon: '🌆', color: 'from-purple-600 to-pink-600' },
                                    { name: 'العشاء', key: 'Isha', icon: '🌙', color: 'from-indigo-700 to-slate-900' }
                                ].map((p) => (
                                    <div key={p.key} className={`bg-gradient-to-br ${p.color} p-8 rounded-[2rem] text-white shadow-xl hover:scale-[1.02] transition-all group`}>
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="text-4xl group-hover:scale-125 transition-transform duration-500 block">{p.icon}</span>
                                            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                                                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold opacity-80 mb-2">{p.name}</h3>
                                        <p className="text-4xl font-black tracking-tighter">{prayerTimes[p.key] || '00:00'}</p>
                                    </div>
                                )) : <div className="col-span-full py-20 text-center">جاري التحميل...</div>}
                            </div>
                        </div>
                    )}

                    {activeTab === 'custom' && (
                        <div className="animate-slide-up space-y-8">
                             <div className="p-8 rounded-[2rem] bg-indigo-600 text-white shadow-xl shadow-indigo-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                                        <Heart className="w-8 h-8 text-rose-400" />
                                        أدعيتك الخاصة
                                    </h2>
                                    <p className="opacity-80 font-medium">أضف أدعيتك المفضلة هنا</p>
                                </div>
                            </div>
                            
                            <div className="p-2 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700 flex gap-2">
                                <input
                                    type="text"
                                    value={newDua}
                                    onChange={(e) => setNewDua(e.target.value)}
                                    placeholder="اكتب دعاءً جديداً..."
                                    className="flex-1 px-8 py-5 bg-transparent text-slate-800 dark:text-white text-lg focus:outline-none placeholder:text-slate-400"
                                />
                                <button
                                    onClick={addCustomDua}
                                    className="px-8 py-4 bg-indigo-600 text-white font-black rounded-[2rem] hover:bg-indigo-500 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
                                >
                                    إضافة
                                </button>
                            </div>

                            <div className="space-y-4">
                                {customDuas.map((dua, i) => (
                                    <div key={i} className="group p-8 bg-white dark:bg-slate-800 rounded-[2rem] shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-2xl transition-all">
                                        <div className="flex items-start justify-between gap-6">
                                            <p className="text-xl md:text-2xl font-amiri text-slate-800 dark:text-slate-100 leading-relaxed flex-1">{dua}</p>
                                            <button 
                                                onClick={() => deleteCustomDua(i)}
                                                className="p-3 rounded-2xl bg-rose-50 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="animate-slide-up space-y-8">
                            <div className="p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700">
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-3">
                                    <MapPin className="w-8 h-8 text-emerald-500" />
                                    الموقع الافتراضي
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-slate-400 dark:text-slate-500 mr-2">المدينة</label>
                                        <input
                                            type="text"
                                            value={location.city}
                                            onChange={(e) => setLocation({...location, city: e.target.value})}
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-emerald-500 outline-none text-slate-800 dark:text-white font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-slate-400 dark:text-slate-500 mr-2">كود الدولة</label>
                                        <input
                                            type="text"
                                            value={location.country}
                                            onChange={(e) => setLocation({...location, country: e.target.value})}
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-emerald-500 outline-none text-slate-800 dark:text-white font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <button
                                onClick={savePreferences}
                                className="w-full py-6 rounded-[2rem] bg-emerald-600 text-white text-xl font-black shadow-2xl shadow-emerald-200 dark:shadow-none hover:bg-emerald-500 transition-all active:scale-95 flex items-center justify-center gap-4"
                            >
                                <Save className="w-8 h-8" />
                                حفظ جميع التغييرات
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-16 mt-20">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-slate-400 dark:text-slate-500 font-bold mb-6 tracking-widest text-sm uppercase">تطبيق الأذكار اليومية</p>
                    <h2 className="text-2xl md:text-3xl font-amiri text-slate-800 dark:text-slate-200 mb-8 italic">"أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"</h2>
                    <div className="flex items-center justify-center gap-6">
                        <div className="w-12 h-px bg-slate-200 dark:bg-slate-800" />
                        <BookOpen className="w-8 h-8 text-emerald-500 opacity-50" />
                        <div className="w-12 h-px bg-slate-200 dark:bg-slate-800" />
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Render the application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AzkarApp />);
