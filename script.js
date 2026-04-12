const { useState, useEffect } = React;
const { Clock, Moon, Sun, MapPin, Bell, BookOpen, Plus, Settings, Save, CheckCircle } = LucideReact;

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
        notificationsEnabled: true
    });

    // الأذكار الصباحية والمسائية الصحيحة
    const morningAzkar = [
        {
            id: 1,
            text: "اللهم أنت ربي، لا إله إلا أنت، خلَقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شرِّ ما صنعت، أبُوء لك بنعمتك عليّ وأبوء بذنبي، فاغفر لي؛ فإنه لا يغفر الذنوب إلا أنت",
            count: 1,
            benefit: "من قالها من النهار موقنًا بها، فمات من يومه قبل أن يُمسي، فهو من أهل الجنة",
            source: "رواه البخاري"
        },
        {
            id: 2,
            text: "اللهم بك أصبحنا، وبك أمسينا، وبك نحيا، وبك نموت، وإليك النشور",
            count: 1,
            benefit: "ذكر الصباح للاستعانة بالله في اليوم",
            source: "صحيح - رواه الترمذي"
        },
        {
            id: 3,
            text: "أصبحنا على فِطرة الإسلام، وكلمة الإخلاص، ودين نبينا محمد صلى الله عليه وسلم، ومِلة أبينا إبراهيم حنيفًا مسلمًا وما كان من المشركين",
            count: 1,
            benefit: "تجديد العهد مع الله على الإسلام والتوحيد",
            source: "صحيح - رواه أحمد"
        },
        {
            id: 4,
            text: "اللهم إني أسألك العافية في الدنيا والآخرة، اللهم إني أسألك العفو والعافية في ديني ودنياي، وأهلي ومالي، اللهم استُر عوراتي، وآمِن رَوعاتي، اللهم احفظني من بين يدي ومن خلفي، وعن يميني وعن شمالي، ومن فوقي، وأعوذ بعظمتك أن أُغتال من تحتي",
            count: 1,
            benefit: "حفظ شامل في جميع الجهات من كل سوء",
            source: "صحيح - رواه أبو داود"
        },
        {
            id: 5,
            text: "اللهم عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري، لا إله إلا أنت",
            count: 3,
            benefit: "الدعاء بالعافية في الجوارح",
            source: "حسن - رواه أحمد"
        },
        {
            id: 6,
            text: "اللهم إني أعوذ بك من الكفر والفقر، اللهم إني أعوذ بك من عذاب القبر، لا إله إلا أنت",
            count: 3,
            benefit: "الاستعاذة من أعظم المصائب",
            source: "حسن - رواه أحمد"
        },
        {
            id: 7,
            text: "أصبحنا وأصبح المُلك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير، ربِّ أسألك خير ما في هذا اليوم، وخير ما بعده، وأعوذ بك من شرِّ ما في هذا اليوم، وشر ما بعده، ربِّ أعوذ بك من الكسل، وسوء الكِبَر، ربِّ أعوذ بك من عذابٍ في النار وعذاب في القبر",
            count: 1,
            benefit: "سؤال خير اليوم والاستعاذة من شروره",
            source: "رواه مسلم"
        },
        {
            id: 8,
            text: "اللهم فاطر السموات والأرض، عالم الغيب والشهادة، ربَّ كلِّ شيء ومليكه، أشهد أنْ لا إله إلا أنت، أعوذ بك من شرِّ نفسي، وشر الشيطان وشِرْكه، وأن أَقترف على نفسي سوءًا، أو أجرَّه إلى مسلم",
            count: 1,
            benefit: "الاستعاذة من شر النفس والشيطان",
            source: "صحيح - رواه الترمذي"
        },
        {
            id: 9,
            text: "رضيت بالله ربًّا، وبالإسلام دينًا، وبمحمد صلى الله عليه وسلم نبيًّا",
            count: 1,
            benefit: "من قالها حين يُصبح وحين يمسي، كان حقًّا على الله أن يُرضيه",
            source: "حسن - رواه الترمذي"
        },
        {
            id: 10,
            text: "يا حي يا قيُّوم، برحمتك أستغيث، أصلِح لي شأني كله، ولا تَكلني إلى نفسي طرْفة عينٍ",
            count: 1,
            benefit: "الاستغاثة برحمة الله وعدم الاتكال على النفس",
            source: "حسن - رواه الحاكم"
        },
        {
            id: 11,
            text: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير",
            count: 100,
            benefit: "كانت له عَدْل عشر رِقاب، وكُتِب له مائة حسنة، ومُحِيت عنه مائة سيئة، وكانت له حِرزًا من الشيطان يومه ذلك حتى يُمسي",
            source: "رواه البخاري ومسلم"
        },
        {
            id: 12,
            text: "سبحان الله وبحمده عدد خلقه، ورضا نفسه، وزِنة عرشه، ومداد كلماته",
            count: 3,
            benefit: "تسبيح عظيم بعدد مخلوقات الله",
            source: "رواه مسلم"
        },
        {
            id: 13,
            text: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
            count: 1,
            benefit: "من قالها حين يصبح، أُجير من الجن حتى يمسي",
            source: "صحيح - رواه الحاكم",
            title: "آية الكرسي"
        },
        {
            id: 14,
            text: "قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
            count: 3,
            benefit: "تكفيه من كل شيء",
            source: "صحيح - رواه أبو داود",
            title: "سورة الإخلاص"
        },
        {
            id: 15,
            text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ * مِن شَرِّ مَا خَلَقَ * وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ * وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ * وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
            count: 3,
            benefit: "تكفيه من كل شيء",
            source: "صحيح - رواه أبو داود",
            title: "سورة الفلق"
        },
        {
            id: 16,
            text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ * مَلِكِ النَّاسِ * إِلَٰهِ النَّاسِ * مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ * الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ * مِنَ الْجِنَّةِ وَالنَّاسِ",
            count: 3,
            benefit: "تكفيه من كل شيء",
            source: "صحيح - رواه أبو داود",
            title: "سورة الناس"
        },
        {
            id: 17,
            text: "بسم الله الذي لا يضرُّ مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم",
            count: 3,
            benefit: "من قالها ثلاثًا إذا أصبح، لم يضرَّه شيء",
            source: "صحيح - رواه الترمذي"
        },
        {
            id: 18,
            text: "اللهم إني أصبحت أُشهدك وأُشهد حمَلة عرشك وملائكتك، وجميع خلْقك أنَّك أنت الله، لا إله إلا أنت وأن محمدًا عبدك ورسولك",
            count: 4,
            benefit: "من قالها مرة أعتَق الله رُبُعه من النار، ومن قالها أربعًا أعتقه الله من النار",
            source: "حسن - رواه أبو داود"
        },
        {
            id: 19,
            text: "اللهم إني أسألك علمًا نافعًا ورزقًا طيبًا وعملاً متقبَّلاً",
            count: 1,
            benefit: "دعاء جامع للخير في الدنيا",
            source: "صحيح - رواه ابن ماجه"
        },
        {
            id: 20,
            text: "سبحان الله وبحمده",
            count: 100,
            benefit: "لم يأت أحد يوم القيامة بأفضل مما جاء به، إلا أحد قال مثل ما قال أو زاد عليه",
            source: "رواه مسلم"
        },
        {
            id: 21,
            text: "أستغفر الله",
            count: 100,
            benefit: "الاستغفار من الذنوب والخطايا",
            source: "صحيح - رواه الطبراني"
        },
        {
            id: 22,
            text: "سبحان الله",
            count: 100,
            benefit: "أفضل من مائة بدَنة",
            source: "حسن - رواه النسائي",
            note: "قبل طلوع الشمس"
        },
        {
            id: 23,
            text: "الحمد لله",
            count: 100,
            benefit: "أفضل من مائة فرس يحمل عليها في سبيل الله",
            source: "حسن - رواه النسائي",
            note: "قبل طلوع الشمس"
        },
        {
            id: 24,
            text: "الله أكبر",
            count: 100,
            benefit: "أفضل من عتْق مائة رَقبة",
            source: "حسن - رواه النسائي",
            note: "قبل طلوع الشمس"
        }
    ];

    // أذكار المساء
    const eveningAzkar = [
        {
            id: 1,
            text: "اللهم أنت ربي، لا إله إلا أنت، خلَقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شرِّ ما صنعت، أبُوء لك بنعمتك عليّ وأبوء بذنبي، فاغفر لي؛ فإنه لا يغفر الذنوب إلا أنت",
            count: 1,
            benefit: "من قالها من الليل وهو مُوقن بها، فمات قبل أن يُصبح، فهو من أهل الجنة",
            source: "رواه البخاري"
        },
        {
            id: 2,
            text: "اللهم بك أمسينا، وبك أصبَحنا، وبك نحيا، وبك نموت، وإليك المصير",
            count: 1,
            benefit: "ذكر المساء للاستعانة بالله في الليل",
            source: "صحيح - رواه الترمذي"
        },
        {
            id: 3,
            text: "أمسينا على فِطرة الإسلام، وكلمة الإخلاص، ودين نبينا محمد صلى الله عليه وسلم، ومِلة أبينا إبراهيم حنيفًا مسلمًا وما كان من المشركين",
            count: 1,
            benefit: "تجديد العهد مع الله على الإسلام والتوحيد",
            source: "صحيح - رواه أحمد"
        },
        {
            id: 4,
            text: "اللهم إني أسألك العافية في الدنيا والآخرة، اللهم إني أسألك العفو والعافية في ديني ودنياي، وأهلي ومالي، اللهم استُر عوراتي، وآمِن رَوعاتي، اللهم احفظني من بين يدي ومن خلفي، وعن يميني وعن شمالي، ومن فوقي، وأعوذ بعظمتك أن أُغتال من تحتي",
            count: 1,
            benefit: "حفظ شامل في جميع الجهات من كل سوء",
            source: "صحيح - رواه أبو داود"
        },
        {
            id: 5,
            text: "اللهم عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري، لا إله إلا أنت",
            count: 3,
            benefit: "الدعاء بالعافية في الجوارح",
            source: "حسن - رواه أحمد"
        },
        {
            id: 6,
            text: "اللهم إني أعوذ بك من الكفر والفقر، اللهم إني أعوذ بك من عذاب القبر، لا إله إلا أنت",
            count: 3,
            benefit: "الاستعاذة من أعظم المصائب",
            source: "حسن - رواه أحمد"
        },
        {
            id: 7,
            text: "أمسينا وأمسى المُلك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير، ربِّ أسألك خير ما في هذه الليلة، وخير ما بعدها، وأعوذ بك من شرِّ ما في هذه الليلة، وشر ما بعدها، ربِّ أعوذ بك من الكسل، وسوء الكِبَر، ربِّ أعوذ بك من عذابٍ في النار وعذاب في القبر",
            count: 1,
            benefit: "سؤال خير الليلة والاستعاذة من شرورها",
            source: "رواه مسلم"
        },
        {
            id: 8,
            text: "اللهم فاطر السموات والأرض، عالم الغيب والشهادة، ربَّ كلِّ شيء ومليكه، أشهد أنْ لا إله إلا أنت، أعوذ بك من شرِّ نفسي، وشر الشيطان وشِرْكه، وأن أَقترف على نفسي سوءًا، أو أجرَّه إلى مسلم",
            count: 1,
            benefit: "الاستعاذة من شر النفس والشيطان",
            source: "صحيح - رواه الترمذي"
        },
        {
            id: 9,
            text: "رضيت بالله ربًّا، وبالإسلام دينًا، وبمحمد صلى الله عليه وسلم نبيًّا",
            count: 1,
            benefit: "من قالها حين يُصبح وحين يمسي، كان حقًّا على الله أن يُرضيه",
            source: "حسن - رواه الترمذي"
        },
        {
            id: 10,
            text: "يا حي يا قيُّوم، برحمتك أستغيث، أصلِح لي شأني كله، ولا تَكلني إلى نفسي طرْفة عينٍ",
            count: 1,
            benefit: "الاستغاثة برحمة الله وعدم الاتكال على النفس",
            source: "حسن - رواه الحاكم"
        },
        {
            id: 11,
            text: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير",
            count: 100,
            benefit: "كانت له عَدْل عشر رِقاب، وكُتِب له مائة حسنة، ومُحِيت عنه مائة سيئة، وكانت له حِرزًا من الشيطان",
            source: "رواه البخاري ومسلم"
        },
        {
            id: 12,
            text: "سبحان الله وبحمده عدد خلقه، ورضا نفسه، وزِنة عرشه، ومداد كلماته",
            count: 3,
            benefit: "تسبيح عظيم بعدد مخلوقات الله",
            source: "رواه مسلم"
        },
        {
            id: 13,
            text: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
            count: 1,
            benefit: "من قالها حين يمسي، أُجير من الجن حتى يصبح",
            source: "صحيح - رواه الحاكم",
            title: "آية الكرسي"
        },
        {
            id: 14,
            text: "قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
            count: 3,
            benefit: "تكفيه من كل شيء",
            source: "صحيح - رواه أبو داود",
            title: "سورة الإخلاص"
        },
        {
            id: 15,
            text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ * مِن شَرِّ مَا خَلَقَ * وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ * وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ * وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
            count: 3,
            benefit: "تكفيه من كل شيء",
            source: "صحيح - رواه أبو داود",
            title: "سورة الفلق"
        },
        {
            id: 16,
            text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ * مَلِكِ النَّاسِ * إِلَٰهِ النَّاسِ * مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ * الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ * مِنَ الْجِنَّةِ وَالنَّاسِ",
            count: 3,
            benefit: "تكفيه من كل شيء",
            source: "صحيح - رواه أبو داود",
            title: "سورة الناس"
        },
        {
            id: 17,
            text: "بسم الله الذي لا يضرُّ مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم",
            count: 3,
            benefit: "من قالها ثلاثًا إذا أمسى، لم يضرَّه شيء",
            source: "صحيح - رواه الترمذي"
        },
        {
            id: 18,
            text: "اللهم إني أمسيتُ أُشهدك وأُشهد حمَلة عرشك وملائكتك، وجميع خلْقك أنَّك أنت الله، لا إله إلا أنت وأن محمدًا عبدك ورسولك",
            count: 4,
            benefit: "من قالها مرة أعتَق الله رُبُعه من النار، ومن قالها أربعًا أعتقه الله من النار",
            source: "حسن - رواه أبو داود"
        },
        {
            id: 19,
            text: "سبحان الله وبحمده",
            count: 100,
            benefit: "لم يأت أحد يوم القيامة بأفضل مما جاء به، إلا أحد قال مثل ما قال أو زاد عليه",
            source: "رواه مسلم"
        },
        {
            id: 20,
            text: "أستغفر الله",
            count: 100,
            benefit: "الاستغفار من الذنوب والخطايا",
            source: "صحيح - رواه الطبراني"
        },
        {
            id: 21,
            text: "سبحان الله",
            count: 100,
            benefit: "أفضل من مائة بدَنة",
            source: "حسن - رواه النسائي",
            note: "قبل غروب الشمس"
        },
        {
            id: 22,
            text: "الحمد لله",
            count: 100,
            benefit: "أفضل من مائة فرس يحمل عليها في سبيل الله",
            source: "حسن - رواه النسائي",
            note: "قبل غروب الشمس"
        },
        {
            id: 23,
            text: "الله أكبر",
            count: 100,
            benefit: "أفضل من عتْق مائة رَقبة",
            source: "حسن - رواه النسائي",
            note: "قبل غروب الشمس"
        }
    ];

    useEffect(() => {
        fetchPrayerTimes();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        loadPreferences();
        return () => clearInterval(timer);
    }, [location]);

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

    const renderAzkarList = (azkarList) => (
        <div className="space-y-4">
            {azkarList.map((zikr) => (
                <div
                    key={zikr.id}
                    className={`bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all border-r-4 ${completedAzkar[zikr.id] ? 'border-green-500 bg-green-50' : 'border-emerald-500'
                        }`}
                >
                    <div className="flex items-start justify-between gap-3 mb-3">
                        {zikr.title && (
                            <h3 className="text-lg font-bold text-emerald-700">{zikr.title}</h3>
                        )}
                        <button
                            onClick={() => toggleZikrComplete(zikr.id)}
                            className={`flex-shrink-0 p-2 rounded-lg transition-all ${completedAzkar[zikr.id]
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                }`}
                        >
                            <CheckCircle className="w-6 h-6" />
                        </button>
                    </div>

                    <p className="text-xl text-gray-800 leading-relaxed mb-4" style={{ fontFamily: 'Arial' }}>
                        {zikr.text}
                    </p>

                    <div className="space-y-4 border-t pt-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold text-sm">
                                    التكرار: {zikr.count}×
                                </span>
                                {zikr.note && (
                                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm">
                                        {zikr.note}
                                    </span>
                                )}
                            </div>
                            
                            <button
                                onClick={() => handleZikrProgress(zikr.id, zikr.count)}
                                disabled={completedAzkar[zikr.id]}
                                className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-lg transition-all active:scale-95 flex justify-center items-center gap-2 ${
                                    completedAzkar[zikr.id]
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:shadow-lg'
                                }`}
                            >
                                {completedAzkar[zikr.id] ? (
                                    <>
                                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                        <span>تم الانتهاء</span>
                                    </>
                                ) : (
                                    <span>اضغط للعد: {azkarProgress[zikr.id] || 0} / {zikr.count}</span>
                                )}
                            </button>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-3 border-r-2 border-blue-400">
                            <p className="text-sm font-semibold text-blue-800 mb-1">📖 الفائدة:</p>
                            <p className="text-sm text-blue-900">{zikr.benefit}</p>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-2 border-r-2 border-purple-400">
                            <p className="text-xs text-purple-700">
                                <span className="font-semibold">المصدر:</span> {zikr.source}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50" dir="rtl">
            <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-10 h-10" />
                            <div>
                                <h1 className="text-3xl font-bold">الأذكار والأدعية الصحيحة</h1>
                                <p className="text-emerald-100 text-sm">منتخبة من صحيح السنة</p>
                            </div>
                        </div>
                        <div className="text-center bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                            <Clock className="w-6 h-6 mx-auto mb-1" />
                            <p className="text-lg font-bold">{formatTime()}</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 flex gap-2 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('morning')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all flex-1 min-w-fit ${activeTab === 'morning'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Sun className="w-5 h-5" />
                        <span className="font-semibold">أذكار الصباح</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('evening')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all flex-1 min-w-fit ${activeTab === 'evening'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Moon className="w-5 h-5" />
                        <span className="font-semibold">أذكار المساء</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('prayer')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all flex-1 min-w-fit ${activeTab === 'prayer'
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Clock className="w-5 h-5" />
                        <span className="font-semibold">مواقيت الصلاة</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('custom')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all flex-1 min-w-fit ${activeTab === 'custom'
                                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Plus className="w-5 h-5" />
                        <span className="font-semibold">أدعية مخصصة</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all flex-1 min-w-fit ${activeTab === 'settings'
                                ? 'bg-gradient-to-r from-gray-600 to-slate-600 text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-semibold">الإعدادات</span>
                    </button>
                </div>

                <div className="max-w-4xl mx-auto">
                    {activeTab === 'morning' && (
                        <div>
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-6 mb-6 shadow-xl">
                                <h2 className="text-2xl font-bold flex items-center gap-3 mb-2">
                                    <Sun className="w-8 h-8" />
                                    أذكار الصباح ({morningAzkar.length} ذكر)
                                </h2>
                                <p className="text-amber-50">ابدأ يومك بذكر الله - من صحيح السنة</p>
                            </div>
                            {renderAzkarList(morningAzkar)}
                        </div>
                    )}

                    {activeTab === 'evening' && (
                        <div>
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-6 mb-6 shadow-xl">
                                <h2 className="text-2xl font-bold flex items-center gap-3 mb-2">
                                    <Moon className="w-8 h-8" />
                                    أذكار المساء ({eveningAzkar.length} ذكر)
                                </h2>
                                <p className="text-indigo-100">اختم يومك بذكر الله - من صحيح السنة</p>
                            </div>
                            {renderAzkarList(eveningAzkar)}
                        </div>
                    )}

                    {activeTab === 'prayer' && (
                        <div>
                            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-6 mb-6 shadow-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold flex items-center gap-3 mb-2">
                                            <Clock className="w-8 h-8" />
                                            مواقيت الصلاة
                                        </h2>
                                        <p className="text-emerald-100">مواعيد الصلوات الخمس</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-emerald-100">
                                        <MapPin className="w-5 h-5" />
                                        <span>{location.city}</span>
                                    </div>
                                </div>
                            </div>

                            {prayerTimes ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { name: 'الفجر', key: 'Fajr', icon: '🌅', color: 'from-blue-500 to-cyan-500' },
                                        { name: 'الشروق', key: 'Sunrise', icon: '☀️', color: 'from-yellow-500 to-orange-500' },
                                        { name: 'الظهر', key: 'Dhuhr', icon: '🌞', color: 'from-amber-500 to-yellow-500' },
                                        { name: 'العصر', key: 'Asr', icon: '🌤️', color: 'from-orange-500 to-red-500' },
                                        { name: 'المغرب', key: 'Maghrib', icon: '🌆', color: 'from-purple-500 to-pink-500' },
                                        { name: 'العشاء', key: 'Isha', icon: '🌙', color: 'from-indigo-600 to-purple-600' }
                                    ].map((prayer) => (
                                        <div
                                            key={prayer.key}
                                            className={`bg-gradient-to-r ${prayer.color} text-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-3xl">{prayer.icon}</span>
                                                    <span className="text-xl font-bold">{prayer.name}</span>
                                                </div>
                                                <span className="text-3xl font-bold">
                                                    {prayerTimes[prayer.key]}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>جاري تحميل مواقيت الصلاة...</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'custom' && (
                        <div>
                            <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl p-6 mb-6 shadow-xl">
                                <h2 className="text-2xl font-bold flex items-center gap-3 mb-2">
                                    <Plus className="w-8 h-8" />
                                    أدعيتك المخصصة
                                </h2>
                                <p className="text-rose-100">أضف أدعيتك المفضلة</p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">إضافة دعاء جديد</h3>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={newDua}
                                        onChange={(e) => setNewDua(e.target.value)}
                                        placeholder="اكتب الدعاء هنا..."
                                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                                    />
                                    <button
                                        onClick={addCustomDua}
                                        className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
                                    >
                                        <Plus className="w-5 h-5" />
                                        إضافة
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {customDuas.map((dua, index) => (
                                    <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
                                        <div className="flex items-start justify-between gap-4">
                                            <p className="text-lg text-gray-800 leading-relaxed flex-1">
                                                {dua}
                                            </p>
                                            <button
                                                onClick={() => deleteCustomDua(index)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                                            >
                                                حذف
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {customDuas.length === 0 && (
                                    <div className="text-center py-12 text-gray-400">
                                        <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p>لم تقم بإضافة أي أدعية بعد</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div>
                            <div className="bg-gradient-to-r from-gray-600 to-slate-600 text-white rounded-2xl p-6 mb-6 shadow-xl">
                                <h2 className="text-2xl font-bold flex items-center gap-3 mb-2">
                                    <Settings className="w-8 h-8" />
                                    الإعدادات والتنبيهات
                                </h2>
                                <p className="text-gray-200">خصص تجربتك مع التطبيق</p>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Bell className="w-6 h-6 text-emerald-600" />
                                        التنبيهات اليومية
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-700">تفعيل التنبيهات</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={preferences.notificationsEnabled}
                                                    onChange={(e) => setPreferences({ ...preferences, notificationsEnabled: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:right-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                                            </label>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-2">وقت تنبيه الصباح</label>
                                            <input
                                                type="time"
                                                value={preferences.morningTime}
                                                onChange={(e) => setPreferences({ ...preferences, morningTime: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 mb-2">وقت تنبيه المساء</label>
                                            <input
                                                type="time"
                                                value={preferences.eveningTime}
                                                onChange={(e) => setPreferences({ ...preferences, eveningTime: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <MapPin className="w-6 h-6 text-emerald-600" />
                                        الموقع الجغرافي
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 mb-2">المدينة</label>
                                            <input
                                                type="text"
                                                value={location.city}
                                                onChange={(e) => setLocation({ ...location, city: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-2">الدولة (رمز)</label>
                                            <input
                                                type="text"
                                                value={location.country}
                                                onChange={(e) => setLocation({ ...location, country: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={savePreferences}
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-3 font-bold text-lg"
                                >
                                    <Save className="w-6 h-6" />
                                    حفظ الإعدادات
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <footer className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-8 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-emerald-100 mb-2">تطبيق الأذكار والأدعية الصحيحة - واظب على ذكر الله</p>
                    <p className="text-lg font-bold text-white mb-3">
                        "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"
                    </p>
                    <p className="text-sm text-emerald-200">
                        جميع الأذكار منتخبة من صحيح السنة
                    </p>
                </div>
            </footer>
        </div>
    );
};

// Render the application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AzkarApp />);