// ====== ИНИЦИАЛИЗАЦИЯ TELEGRAM WEB APP ======
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Адаптация цветовой схемы (опционально)
// tg.setBackgroundColor('#F5F1ED');
// tg.setHeaderColor('#F5F1ED');

// ====== АНАЛИТИКА (SUPABASE) ======
let supabaseClient = null;
let analyticsEnabled = false;

// Инициализация Supabase (с защитой от ошибок)
try {
    if (window.supabase && window.supabase.createClient) {
        supabaseClient = window.supabase.createClient(
            'https://ltqelpbiivubjcqjoweg.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0cWVscGJpaXZ1YmpjcWpvd2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MzM0NzAsImV4cCI6MjA4NjQwOTQ3MH0.THv2lqazDTxP3zMSW7lrRGNUerTsS028x15gmQ3Ji6c'
        );
        analyticsEnabled = true;
        console.log('✅ Аналитика включена');
    }
} catch (error) {
    console.warn('⚠️ Не удалось инициализировать аналитику:', error);
}

// Функция создания/обновления пользователя (защищена от ошибок)
async function upsertUser() {
    if (!analyticsEnabled || !supabaseClient) return;
    
    try {
        const userData = tg.initDataUnsafe?.user || {};
        
        if (!userData.id) {
            console.warn('⚠️ Нет Telegram user ID');
            return;
        }
        
        // Сначала проверяем, существует ли пользователь
        const { data: existingUser } = await supabaseClient
            .from('users')
            .select('telegram_id, source')
            .eq('telegram_id', userData.id)
            .single();
        
        if (existingUser) {
            // Пользователь существует - обновляем только last_active_at
            await supabaseClient.from('users')
                .update({ last_active_at: new Date().toISOString() })
                .eq('telegram_id', userData.id);
            console.log('👤 Активность обновлена:', userData.id);
        } else {
            // Новый пользователь - создаём с source='miniapp'
            await supabaseClient.from('users').insert({
                telegram_id: userData.id,
                username: userData.username || null,
                first_name: userData.first_name || null,
                last_active_at: new Date().toISOString(),
                source: 'miniapp'
            });
            console.log('👤 Новый пользователь создан:', userData.id);
        }
    } catch (error) {
        console.warn('⚠️ Ошибка обновления пользователя:', error);
    }
}

// Функция трекинга событий (полностью защищена от ошибок)
async function trackEvent(eventType, eventData = {}) {
    if (!analyticsEnabled || !supabaseClient) return;
    
    try {
        const userData = tg.initDataUnsafe?.user || {};
        
        // Записываем событие
        await supabaseClient.from('events').insert({
            user_id: userData.id || null,
            event_type: eventType,
            event_data: eventData,
            platform: 'miniapp',
            created_at: new Date().toISOString()
        });
        
        // Обновляем last_active_at пользователя
        if (userData.id) {
            await supabaseClient.from('users')
                .update({ last_active_at: new Date().toISOString() })
                .eq('telegram_id', userData.id);
        }
        
        console.log('📊 Событие записано:', eventType);
    } catch (error) {
        console.warn('⚠️ Ошибка трекинга:', error);
        // Ошибки трекинга НЕ должны ломать приложение!
    }
}

// ====== ДАННЫЕ ТЕСТА ======
const questions = [
    {
        id: 1,
        question: "Вопрос 1. Как бы ты описала свое внутреннее состояние?",
        image: "assets/images/IMG_5966.jpg",
        options: [
            { text: "Теплота, нежность", value: "warm" },
            { text: "Спокойствие, собранность", value: "clean" },
            { text: "Воздушность, легкость", value: "soft" },
            { text: "Притягательность, харизма", value: "form" },
            { text: "Практичность, комфорт", value: "ice" },
            { text: "Уравновешенность, сдержанность", value: "classic" }
        ]
    },
    {
        id: 2,
        question: "Вопрос 2. Что тебе ближе визуально?",
        image: "assets/images/IMG_5981.jpg",
        options: [
            { text: "Плед, свеча и чашка какао", value: "warm" },
            { text: "Айс латте и костюм", value: "clean" },
            { text: "Балет, акварель, лепестки", value: "soft" },
            { text: "Бархат, золото и мягкий свет", value: "form" },
            { text: "Белая рубашка, кроссовки", value: "ice" },
            { text: "Париж, круассан", value: "classic" }
        ]
    },
    {
        id: 3,
        question: "Вопрос 3. Какие комплименты тебе приятнее всего?",
        image: "assets/images/IMG_5988.jpg",
        options: [
            { text: "Ты такая уютная, с тобой хорошо", value: "warm" },
            { text: "Ты — как босс, всегда чёткая", value: "clean" },
            { text: "Ты — как муза, вдохновляешь", value: "soft" },
            { text: "Ты — нереально притягательная", value: "form" },
            { text: "Ты простая, но стильная", value: "ice" },
            { text: "У тебя идеальный вкус", value: "classic" }
        ]
    },
    {
        id: 4,
        question: "Вопрос 4. Что ты скорее наденешь на первое свидание?",
        image: "assets/images/IMG_5995.jpg",
        options: [
            { text: "Лёгкое платье, пастельные оттенки", value: "warm" },
            { text: "Прямой жакет и брюки", value: "clean" },
            { text: "Платье-комбинацию и туфли", value: "soft" },
            { text: "Обтягивающее платье или кроп с юбкой", value: "form" },
            { text: "Простой топ и джинсы", value: "ice" },
            { text: "Платье-футляр или костюм", value: "classic" }
        ]
    },
    {
        id: 5,
        question: "Вопрос 5. Ты заходишь в комнату. Люди замечают…",
        image: "assets/images/IMG_6003.jpg",
        options: [
            { text: "Что ты светлая и милая", value: "warm" },
            { text: "Ты серьёзная и собранная", value: "clean" },
            { text: "Ты — тонкая и интересная", value: "soft" },
            { text: "От тебя трудно отвести взгляд", value: "form" },
            { text: "Ты простая и дружелюбная", value: "ice" },
            { text: "Ты гармонична и стильно выглядишь", value: "classic" }
        ]
    },
    {
        id: 6,
        question: "Вопрос 6. Если бы ты была едой, ты — это…",
        image: "assets/images/IMG_6004.jpg",
        options: [
            { text: "Булочка с мёдом", value: "warm" },
            { text: "Мороженое", value: "clean" },
            { text: "Кремовая зефиринка", value: "soft" },
            { text: "Шоколадка", value: "form" },
            { text: "Тост с маслом", value: "ice" },
            { text: "Французский багет", value: "classic" }
        ]
    }
];

const typageResults = {
    warm: {
        title: "Warm Girl",
        emoji: "☀️",
        description: "В тебе есть тепло, рядом с которым становится спокойно. С тобой хочется быть — даже без причины.\n\nТвой типаж требует мягких линий, тёплой цветовой базы и баланса между уютом и выразительностью.",
        image: "assets/images/IMG_5960.png"
    },
    clean: {
        title: "Clean Girl",
        emoji: "✨",
        description: "В тебе порядок и сдержанная красота, которую сложно скопировать. Если одета правильно, излучаешь силу без слов.\n\nТвоя сила — в точности: чёткие линии, чистые формы, функциональные силуэты.",
        image: "assets/images/IMG_5956.png"
    },
    soft: {
        title: "Soft Girl",
        emoji: "🌸",
        description: "В тебе чувствуется это… лёгкое, необъяснимое. Ты заходишь в комнату — и всё смягчается.\n\nТвоя сила — в нюансах: мягкие линии, текучие ткани, деликатные акценты, ощущение воздуха в образе.",
        image: "assets/images/IMG_5959.png"
    },
    form: {
        title: "The Form",
        emoji: "💫",
        description: "Можешь быть в простом — и всё равно будешь выглядеть так, будто на тебе что-то \"вау\".\n\nТвой типаж — про форму и акцент: чёткие силуэты, работа с линией тела, осознанные акценты.",
        image: "assets/images/IMG_5954.png"
    },
    ice: {
        title: "Ice Lady",
        emoji: "❄️",
        description: "Ты можешь молчать — и это будет звучать громче, чем чей-то крик.\n\nТвоя сила — в чёткости и дистанции: строгие линии, гладкие ткани, холодная палитра, минимум деталей.",
        image: "assets/images/IMG_5958.png"
    },
    classic: {
        title: "Classic",
        emoji: "🎨",
        description: "Не пытаешься выделиться — но именно поэтому выделяешься. В тебе считывается вкус, уверенность, структура.\n\nТвоя сила — в структуре и балансе: выверенные силуэты, качественные ткани, спокойная цветовая база.",
        image: "assets/images/IMG_5957.png"
    }
};

// ====== СОСТОЯНИЕ ПРИЛОЖЕНИЯ ======
let currentQuestionIndex = 0;
let answers = [];
let isAnimating = false;

// ====== УПРАВЛЕНИЕ ЭКРАНАМИ ======
function showScreen(screenId, direction = 'right') {
    if (isAnimating) return;
    isAnimating = true;

    const screens = document.querySelectorAll('.screen');
    const currentScreen = document.querySelector('.screen.active');
    const nextScreen = document.getElementById(screenId);

    if (currentScreen) {
        currentScreen.classList.remove('active');
        currentScreen.classList.add('fade-out');
        
        setTimeout(() => {
            currentScreen.classList.remove('fade-out');
            currentScreen.style.display = 'none';
        }, 400);
    }

    setTimeout(() => {
        nextScreen.classList.add('active');
        if (direction === 'right') {
            nextScreen.classList.add('slide-in-right');
        } else {
            nextScreen.classList.add('slide-in-left');
        }
        
        setTimeout(() => {
            nextScreen.classList.remove('slide-in-right', 'slide-in-left');
            isAnimating = false;
        }, 500);
    }, currentScreen ? 400 : 0);

    // Табы показываем только на приветствии; во время теста скрываем
    updateTabBarVisibility(screenId);
}

function updateTabBarVisibility(currentScreenId) {
    const tabs = document.querySelector('.navigation-tabs');
    if (!tabs) return;
    const hideTabsDuringTest = (currentScreenId === 'rulesScreen') || (currentScreenId === 'questionScreen');
    if (hideTabsDuringTest) {
        tabs.classList.add('tabs-hidden');
    } else {
        tabs.classList.remove('tabs-hidden');
    }
}

// ====== НАЧАЛО ТЕСТА ======
function startTest() {
    showScreen('rulesScreen');
}

function showFirstQuestion() {
    currentQuestionIndex = 0;
    answers = [];
    showQuestion(currentQuestionIndex);
    
    // Трекинг начала теста (не блокирует основную логику)
    trackEvent('test_start', { total_questions: questions.length });
}

// ====== ОТОБРАЖЕНИЕ ВОПРОСА ======
function showQuestion(index) {
    const question = questions[index];
    
    // Обновляем прогресс
    const progress = ((index + 1) / questions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = `Вопрос ${index + 1} из ${questions.length}`;
    
    // Обновляем картинку
    const questionImage = document.getElementById('questionImage');
    questionImage.src = question.image;
    questionImage.alt = `Вопрос ${index + 1}`;
    
    // Обновляем текст вопроса
    document.getElementById('questionText').textContent = question.question;
    
    // Создаем варианты ответов
    const answerOptionsContainer = document.getElementById('answerOptions');
    answerOptionsContainer.innerHTML = '';
    
    question.options.forEach((option, optionIndex) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'answer-option';
        optionElement.textContent = option.text;
        optionElement.onclick = () => selectAnswer(option.value);
        
        // Анимация появления с задержкой
        setTimeout(() => {
            optionElement.style.opacity = '0';
            optionElement.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                optionElement.style.transition = 'all 0.4s ease';
                optionElement.style.opacity = '1';
                optionElement.style.transform = 'translateX(0)';
            }, 10);
        }, optionIndex * 80);
        
        answerOptionsContainer.appendChild(optionElement);
    });
    
    // Показываем/скрываем кнопку "Назад"
    const backButton = document.getElementById('backButton');
    if (index > 0) {
        backButton.style.display = 'inline-block';
    } else {
        backButton.style.display = 'none';
    }
    
    showScreen('questionScreen');
}

// ====== ВЫБОР ОТВЕТА ======
function selectAnswer(value) {
    if (isAnimating) return;
    
    answers[currentQuestionIndex] = value;
    
    // Трекинг шага теста (не блокирует переход к следующему вопросу)
    trackEvent('test_step', { 
        step: currentQuestionIndex + 1, 
        total_steps: questions.length,
        answer: value 
    });
    
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    } else {
        showResult();
    }
}

// ====== НАВИГАЦИЯ ======
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
}

// ====== ПОДСЧЕТ РЕЗУЛЬТАТА ======
function calculateResult() {
    const counts = {};
    answers.forEach(answer => {
        counts[answer] = (counts[answer] || 0) + 1;
    });
    
    let maxCount = 0;
    let resultType = 'warm';
    
    for (const [type, count] of Object.entries(counts)) {
        if (count > maxCount) {
            maxCount = count;
            resultType = type;
        }
    }
    
    return resultType;
}

// ====== ПОКАЗ РЕЗУЛЬТАТА ======
function showResult() {
    const resultType = calculateResult();
    const result = typageResults[resultType];
    
    document.getElementById('resultTitle').textContent = result.emoji + ' ' + result.title;
    document.getElementById('resultDescription').textContent = result.description;
    
    // Добавляем картинку результата
    const resultImageContainer = document.getElementById('resultImage');
    resultImageContainer.innerHTML = `<img src="${result.image}" alt="${result.title}">`;
    
    showScreen('resultScreen');
    
    // Сохраняем результат в localStorage
    localStorage.setItem('muse_archetype', resultType);
    
    // Отправляем результат обратно в бот (опционально)
    try {
        tg.sendData(JSON.stringify({
            type: 'test_result',
            result: resultType,
            title: result.title
        }));
    } catch (e) {
        console.log('Telegram sendData not available:', e);
    }
    
    // Сохраняем результат для функции share
    window.currentResult = {
        type: resultType,
        title: result.title
    };
    
    // Трекинг завершения теста (в самом конце, не блокирует показ результата)
    trackEvent('test_complete', { 
        result: resultType,
        title: result.title,
        total_questions: questions.length 
    });
}

// ====== ДЕЙСТВИЯ С РЕЗУЛЬТАТОМ ======
function shareResult() {
    const result = window.currentResult;
    const shareText = `Вау, смотри какой классный тест, чтобы узнать свой типаж! 😍\n\nЯ прошла тест MUSE и узнала, что я — ${result.title}! 💫\n\nЕсли тоже хочешь узнать свой, вот: @musenew_bot 💅🏼`;
    
    // Проверяем доступность Web Share API
    if (navigator.share) {
        navigator.share({
            title: 'MUSE — Стилевой тест',
            text: shareText
        }).catch(err => console.log('Share failed:', err));
    } else {
        // Фолбек: копируем в буфер обмена
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText)
                .then(() => {
                    tg.showAlert('Текст скопирован! Теперь можешь поделиться с друзьями 💫');
                })
                .catch(err => {
                    console.log('Copy failed:', err);
                });
        }
    }
}

function openChannel() {
    tg.openTelegramLink('https://t.me/+7ERJu6Hy3DBhMDk6');
}

function restartTest() {
    currentQuestionIndex = 0;
    answers = [];
    showScreen('welcomeScreen');
}

// ====== ДАННЫЕ ТИПАЖЕЙ (МОЙ ТИПАЖ) ======
const archetypeData = {
    classic: {
        name: "Classic",
        tagline: "Ты — вневременная красота.",
        description: "Не кричишь — просто всегда уместна. Ты — как багет из Парижа: простая, качественная, и никогда не надоедаешь.",
        vibe: "Спокойная элегантность",
        pantone: { name: "PMS 2766 C", hex: "#141B4D" },
        palette: [
            { name: "Тёмно-синий", hex: "#141B4D" },
            { name: "Молочный", hex: "#FAF3E8" },
            { name: "Верблюжий", hex: "#C4A46D" },
            { name: "Жемчужный", hex: "#F0E8DA" },
            { name: "Чёрный", hex: "#1A1A1A" },
            { name: "Пыльный беж", hex: "#D5C4A1" }
        ],
        recommendations: [
            { emoji: "👗", category: "Силуэты", text: "Приталенные, чёткие, без лишних деталей. Классический крой — твоё всё." },
            { emoji: "✨", category: "Ткани", text: "Качественные, плотные: шерсть, кашемир, хлопок, шёлк. Всё, что выглядит «дорого»." },
            { emoji: "💎", category: "Аксессуары", text: "Жемчуг, тонкие золотые цепочки, часы. Минимум, но со вкусом." },
            { emoji: "👠", category: "Обувь", text: "Лодочки, лоферы, аккуратные сапоги. Классические формы." },
            { emoji: "❌", category: "Не подходит", text: "Чрезмерные тренды, слишком драматичные детали, кричащие принты." }
        ],
        channelLink: "https://t.me/muse_stylee/813"
    },
    ice: {
        name: "Ice Lady",
        tagline: "Ты — точность, собранность и лёгкий холодок.",
        description: "В тебе стиль без слов и сила без давления. Ты — айс латте: прохладная, структурная, идеальная.",
        vibe: "Статус, рациональность",
        pantone: { name: "19-4015 TCX", hex: "#4A4B56" },
        palette: [
            { name: "Графит", hex: "#4A4B56" },
            { name: "Белый лёд", hex: "#F2EFEB" },
            { name: "Серебро", hex: "#C0C0C0" },
            { name: "Чёрный", hex: "#1A1A1A" },
            { name: "Холодный беж", hex: "#D6CFC7" },
            { name: "Сталь", hex: "#71797E" }
        ],
        recommendations: [
            { emoji: "📐", category: "Силуэты", text: "Структурированные, чёткие линии. Пиджаки, пальто, прямые брюки. Всё «собранное»." },
            { emoji: "🧥", category: "Ткани", text: "Плотные, держащие форму: шерсть, костюмные ткани, кожа, шёлк с холодным блеском." },
            { emoji: "⚪️", category: "Аксессуары", text: "Серебро, белое золото, лаконичные серьги и часы. Всё чёткое, геометричное." },
            { emoji: "👢", category: "Обувь", text: "Остроносые лодочки, ботильоны, минималистичные сапоги." },
            { emoji: "❌", category: "Не подходит", text: "Дешёвые ткани, небрежность, слишком расслабленный или «мятый» стиль." }
        ],
        channelLink: "https://t.me/muse_stylee/895"
    },
    form: {
        name: "The Form",
        tagline: "Ты не стараешься быть притягательной.",
        description: "Ты уже такая — будто сцена гаснет, когда ты выходишь. Ты — шоколадка с золотой фольгой: дорогая, заметная, незабываемая.",
        vibe: "Сила, уверенность",
        pantone: { name: "19-1432 TCX", hex: "#7B4B3A" },
        palette: [
            { name: "Шоколад", hex: "#7B4B3A" },
            { name: "Чёрный", hex: "#1A1A1A" },
            { name: "Карамель", hex: "#C68B59" },
            { name: "Золотой", hex: "#D4A855" },
            { name: "Сливочный", hex: "#F5E6D0" },
            { name: "Бордо", hex: "#722F37" }
        ],
        recommendations: [
            { emoji: "💃", category: "Силуэты", text: "Подчёркивающие фигуру: облегающие, с акцентом на длину и пропорции. Смело с вырезами." },
            { emoji: "🎀", category: "Ткани", text: "Атлас, кожа, трикотаж, всё что облегает и держит форму одновременно." },
            { emoji: "✨", category: "Аксессуары", text: "Крупные серьги, золото, statement-украшения. Можно смело, можно ярко." },
            { emoji: "👠", category: "Обувь", text: "Каблуки, ботфорты, босоножки на шпильке. То, что удлиняет." },
            { emoji: "❌", category: "Не подходит", text: "Мешковатость, инфантильность, «миленькие» детали. Рюши и бантики — не сюда." }
        ],
        channelLink: "https://t.me/muse_stylee/795"
    },
    soft: {
        name: "Soft Girl",
        tagline: "Ты — вдохновение, нежность и тишина в шумном мире.",
        description: "Как зефирка в сливках: лёгкая, чуть мечтательная, совсем не простая. Ты заходишь в комнату — и всё смягчается.",
        vibe: "Романтика, нежность",
        pantone: { name: "3-1023 TCX", hex: "#FBCEB1" },
        palette: [
            { name: "Персиковый", hex: "#FBCEB1" },
            { name: "Пудровый", hex: "#F4C2C2" },
            { name: "Лавандовый", hex: "#D8C4E6" },
            { name: "Сливочный", hex: "#FFF8E7" },
            { name: "Нежно-розовый", hex: "#F8D7DA" },
            { name: "Мятный", hex: "#D4EDDA" }
        ],
        recommendations: [
            { emoji: "🌸", category: "Силуэты", text: "Воздушные, летящие, с мягкими линиями. Платья, юбки, всё что «дышит»." },
            { emoji: "🎀", category: "Ткани", text: "Шифон, тюль, мягкий хлопок, кружево, шёлк. Всё лёгкое и нежное." },
            { emoji: "💖", category: "Аксессуары", text: "Тонкие цепочки, маленькие серьги, ленты в волосах. Нежное золото или розовое золото." },
            { emoji: "🩰", category: "Обувь", text: "Балетки, сандалии с ремешками, маленький каблук, мюли." },
            { emoji: "❌", category: "Не подходит", text: "Грубые ткани, резкие контрасты, тяжёлая обувь, агрессивные принты." }
        ],
        channelLink: "https://t.me/muse_stylee/1268"
    },
    clean: {
        name: "Clean Girl",
        tagline: "Ты — эстетика чистоты и простоты.",
        description: "Как хлеб с маслом: ничего лишнего, но именно то, что надо. Ты из тех, кто выглядит дорого в белой футболке.",
        vibe: "Свежесть, минимализм",
        pantone: { name: "11-0610 TSX", hex: "#EDE4DA" },
        palette: [
            { name: "Silence", hex: "#EDE4DA" },
            { name: "Белый", hex: "#FFFFFF" },
            { name: "Песочный", hex: "#D2B48C" },
            { name: "Нюд", hex: "#E8C9A4" },
            { name: "Светлый деним", hex: "#A4C8E1" },
            { name: "Оливковый", hex: "#A9B18E" }
        ],
        recommendations: [
            { emoji: "⚪️", category: "Силуэты", text: "Простые, чистые линии. Базовые вещи, которые идеально сидят. Оверсайз в меру." },
            { emoji: "🌿", category: "Ткани", text: "Хлопок, лён, деним, мягкий трикотаж. Натуральные, приятные к телу." },
            { emoji: "✨", category: "Аксессуары", text: "Минимум: тонкие кольца, маленькие серьги-гвоздики, аккуратная сумка. Золото или серебро." },
            { emoji: "👟", category: "Обувь", text: "Кроссовки, лоферы, мюли, сандалии. Чистые формы, нейтральные цвета." },
            { emoji: "❌", category: "Не подходит", text: "Перегруженные аксессуары, яркая вычурность, слишком много деталей." }
        ],
        channelLink: "https://t.me/muse_stylee/895"
    },
    warm: {
        name: "Warm Girl",
        tagline: "Ты как булочка с мёдом: тёплая, родная.",
        description: "С тобой хочется быть настоящими — без масок и лишнего. Ты — не просто мило, ты — тепло, от которого трудно уйти.",
        vibe: "Уют, лёгкость, тепло",
        pantone: { name: "11-0507 TCX", hex: "#F0EAD6" },
        palette: [
            { name: "Winter White", hex: "#F0EAD6" },
            { name: "Медовый", hex: "#EB9605" },
            { name: "Тёплый розовый", hex: "#E8A0BF" },
            { name: "Карамель", hex: "#C68B59" },
            { name: "Ваниль", hex: "#F3E5AB" },
            { name: "Терракота", hex: "#CC7A5E" }
        ],
        recommendations: [
            { emoji: "🧸", category: "Силуэты", text: "Мягкие, уютные, обволакивающие. Свитера, кардиганы, платья свободного кроя." },
            { emoji: "☕️", category: "Ткани", text: "Кашемир, мохер, мягкий трикотаж, вельвет, хлопок. Всё тёплое и тактильное." },
            { emoji: "🍯", category: "Аксессуары", text: "Золото тёплого оттенка, уютные шарфы, мягкие сумки. Ничего острого." },
            { emoji: "🥾", category: "Обувь", text: "Мягкие ботинки, UGG, кроссовки, босоножки на платформе." },
            { emoji: "❌", category: "Не подходит", text: "Тотал-чёрный, жёсткие формы, холодные цвета, острые каблуки." }
        ],
        channelLink: "https://t.me/muse_stylee/833"
    }
};

// ====== ДАННЫЕ БИБЛИОТЕКИ ======
const libraryData = {
    sections: [
        {
            id: "useful",
            name: "Полезное",
            items: [
                {
                    emoji: "💎",
                    title: "6 женских типажей",
                    url: "https://t.me/muse_stylee/1268"
                },
                {
                    emoji: "📸",
                    title: "Разбор стиля и типажа читательниц",
                    url: "https://t.me/muse_stylee/27"
                },
                {
                    emoji: "✨",
                    title: "Какие проблемы решит знание типажа",
                    url: "https://t.me/muse_stylee/895"
                },
                {
                    emoji: "🎨",
                    title: "Как адаптировать любой типаж под себя",
                    url: "https://t.me/muse_stylee/902"
                },
                {
                    emoji: "💫",
                    title: "Зачем и как использовать типаж",
                    url: "https://t.me/muse_stylee/772"
                }
            ]
        },
        {
            id: "archetypes",
            name: "Про типажи",
            items: [
                {
                    emoji: "🌸",
                    title: "Ошибки типажа The Form",
                    url: "https://t.me/muse_stylee/795"
                },
                {
                    emoji: "👔",
                    title: "Ошибки типажа Classic",
                    url: "https://t.me/muse_stylee/813"
                },
                {
                    emoji: "☕️",
                    title: "Ошибки типажа Warm Girl",
                    url: "https://t.me/muse_stylee/833"
                }
            ]
        },
        {
            id: "fun",
            name: "For fun",
            items: [
                {
                    emoji: "👑",
                    title: "Типажи из «Сплетница»",
                    url: "https://t.me/muse_stylee/1067"
                },
                {
                    emoji: "👠",
                    title: "Типажи из «Секс в большом городе»",
                    url: "https://t.me/muse_stylee/944"
                },
                {
                    emoji: "🐉",
                    title: "Типажи из «Игра престолов»",
                    url: "https://t.me/muse_stylee/847"
                },
                {
                    emoji: "🏡",
                    title: "Типажи из «Отчаянные домохозяйки»",
                    url: "https://t.me/muse_stylee/750"
                },
                {
                    emoji: "💄",
                    title: "Типажи из «Милые обманщицы»",
                    url: "https://t.me/muse_stylee/1251"
                }
            ]
        },
        {
            id: "celebrities",
            name: "Знаменитости",
            items: [
                {
                    emoji: "✨",
                    title: "Стиль Сары Джессики Паркер",
                    url: "https://t.me/muse_stylee/928"
                },
                {
                    emoji: "🖤",
                    title: "Стиль Кендалл Дженнер",
                    url: "https://t.me/muse_stylee/1094"
                }
            ]
        },
        {
            id: "store",
            name: "Muse Store",
            items: [
                {
                    emoji: "🛍",
                    title: "Купить lookbook по типажу",
                    url: "https://musestyle.store/page4"
                }
            ]
        }
    ]
};

// ====== ФУНКЦИИ НАВИГАЦИИ ======
function switchTab(tabName) {
    console.log('switchTab вызвана с:', tabName);
    
    // Обновляем активный таб
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
    
    // Показываем только одну секцию — вторая всегда скрыта
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    if (tabName === 'test') {
        document.getElementById('testSection').classList.add('active');
        document.querySelector('.navigation-tabs').classList.remove('tabs-hidden');
    } else if (tabName === 'library') {
        document.getElementById('librarySection').classList.add('active');
        document.querySelector('.navigation-tabs').classList.remove('tabs-hidden');
        
        // Трекинг открытия библиотеки
        trackEvent('library_open');
        
        if (!window.libraryInitialized) {
            initLibrary();
            window.libraryInitialized = true;
        }
    } else if (tabName === 'archetype') {
        console.log('Переключаемся на archetype');
        const archetypeSection = document.getElementById('archetypeSection');
        console.log('archetypeSection найдена:', archetypeSection);
        archetypeSection.classList.add('active');
        document.querySelector('.navigation-tabs').classList.remove('tabs-hidden');
        
        // Трекинг открытия "Мой типаж"
        trackEvent('my_type_open');
        
        showArchetypeSection();
    }
}

// ====== ФУНКЦИИ БИБЛИОТЕКИ ======
function initLibrary() {
    renderLibraryCards('all');
}

function renderLibraryCards(filter = 'all') {
    const cardsContainer = document.getElementById('libraryCards');
    cardsContainer.innerHTML = '';
    
    libraryData.sections.forEach(section => {
        // Фильтруем секции
        if (filter !== 'all' && section.id !== filter) {
            return;
        }
        
        // Добавляем карточки из секции
        section.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'content-card';
            card.dataset.section = section.id;
            card.onclick = () => openLink(item.url, item.title);
            
            card.innerHTML = `
                <div class="card-emoji">${item.emoji}</div>
                <div class="card-content">
                    <div class="card-title">${item.title}</div>
                    <div class="card-section">${section.name}</div>
                </div>
                <div class="card-arrow">→</div>
            `;
            
            cardsContainer.appendChild(card);
        });
    });
}

function filterLibrary(filter) {
    // Обновляем активный фильтр
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    document.querySelector(`.filter-chip[data-filter="${filter}"]`).classList.add('active');
    
    // Перерисовываем карточки
    renderLibraryCards(filter);
}

function openLink(url, title = '') {
    // Трекинг клика по карточке библиотеки
    trackEvent('library_click', { url, title });
    
    if (url.includes('t.me')) {
        tg.openTelegramLink(url);
    } else {
        tg.openLink(url);
    }
}

// ====== МОЙ ТИПАЖ ======
function showArchetypeSection() {
    console.log('showArchetypeSection вызвана');
    const savedArchetype = localStorage.getItem('muse_archetype');
    console.log('Saved archetype:', savedArchetype);
    
    const promptElement = document.getElementById('archetypePrompt');
    const pageElement = document.getElementById('archetypePage');
    
    console.log('promptElement:', promptElement);
    console.log('pageElement:', pageElement);
    
    if (!savedArchetype) {
        // Показываем приглашение пройти тест
        console.log('Показываем prompt - тест не пройден');
        promptElement.style.display = 'flex';
        pageElement.style.display = 'none';
    } else {
        // Показываем страницу типажа
        console.log('Показываем страницу типажа:', savedArchetype);
        promptElement.style.display = 'none';
        pageElement.style.display = 'block';
        renderArchetypePage(savedArchetype);
    }
}

function renderArchetypePage(archetypeId) {
    const archetype = archetypeData[archetypeId];
    if (!archetype) {
        console.error('Archetype not found:', archetypeId);
        return;
    }
    
    // Заголовок и описание
    document.getElementById('archetypeTitle').textContent = archetype.name;
    document.getElementById('archetypeTagline').textContent = archetype.tagline;
    document.getElementById('archetypeDescription').textContent = archetype.description;
    document.getElementById('archetypeVibe').textContent = archetype.vibe;
    
    // Палитра цветов
    const paletteContainer = document.getElementById('colorPalette');
    paletteContainer.innerHTML = archetype.palette.map(color => `
        <div class="color-item">
            <div class="color-circle" style="background-color: ${color.hex}"></div>
            <div class="color-name">${color.name}</div>
        </div>
    `).join('');
    
    // Рекомендации
    const recommendationsContainer = document.getElementById('recommendations');
    recommendationsContainer.innerHTML = archetype.recommendations.map(rec => `
        <div class="recommendation-card">
            <div class="recommendation-emoji">${rec.emoji}</div>
            <div class="recommendation-content">
                <div class="recommendation-category">${rec.category}</div>
                <div class="recommendation-text">${rec.text}</div>
            </div>
        </div>
    `).join('');
    
    // Сохраняем ссылку на пост для кнопки
    window.currentArchetypeLink = archetype.channelLink;
}

function shareArchetypeResult() {
    const savedArchetype = localStorage.getItem('muse_archetype');
    if (!savedArchetype) return;
    
    const archetype = archetypeData[savedArchetype];
    if (!archetype) return;
    
    // Трекинг клика "Поделиться"
    trackEvent('share_click', { archetype: savedArchetype });
    
    const shareText = `✨ Я прошла тест типажей MUSE и узнала, что я — ${archetype.name}! ${archetype.tagline}\n\nПройди тест сама: @musenew_bot 💫`;
    
    // Копируем в буфер обмена
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareText).then(() => {
            tg.showAlert('Текст скопирован! Теперь можешь поделиться им 💕');
        });
    } else {
        // Fallback для старых браузеров
        tg.showAlert(shareText);
    }
}

function openArchetypePost() {
    if (window.currentArchetypeLink) {
        tg.openTelegramLink(window.currentArchetypeLink);
    }
}

function retakeTest() {
    // Трекинг клика "Пройти заново"
    trackEvent('retake_test');
    
    // Очищаем результат
    localStorage.removeItem('muse_archetype');
    
    // Сбрасываем тест
    currentQuestion = 0;
    Object.keys(scores).forEach(key => scores[key] = 0);
    
    // Переключаемся на таб теста и показываем приветственный экран
    switchTab('test');
    showScreen('welcomeScreen');
}

// ====== ИНИЦИАЛИЗАЦИЯ ======
document.addEventListener('DOMContentLoaded', function() {
    console.log('MUSE Mini App загружена');
    console.log('Telegram WebApp version:', tg.version);
    
    // Создаём/обновляем пользователя в базе
    upsertUser();
    
    // Трекинг открытия Mini App
    trackEvent('miniapp_open');
    
    // Только секция теста активна; библиотека и типаж скрыты
    document.getElementById('testSection').classList.add('active');
    document.getElementById('librarySection').classList.remove('active');
    document.getElementById('archetypeSection').classList.remove('active');
    
    showScreen('welcomeScreen');
    updateTabBarVisibility('welcomeScreen');
});
