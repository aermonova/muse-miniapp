// ====== ИНИЦИАЛИЗАЦИЯ TELEGRAM WEB APP ======
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Адаптация цветовой схемы (опционально)
// tg.setBackgroundColor('#F5F1ED');
// tg.setHeaderColor('#F5F1ED');

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
        if (!window.libraryInitialized) {
            initLibrary();
            window.libraryInitialized = true;
        }
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
            card.onclick = () => openLink(item.url);
            
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

function openLink(url) {
    if (url.includes('t.me')) {
        tg.openTelegramLink(url);
    } else {
        tg.openLink(url);
    }
}

// ====== ИНИЦИАЛИЗАЦИЯ ======
document.addEventListener('DOMContentLoaded', function() {
    console.log('MUSE Mini App загружена');
    console.log('Telegram WebApp version:', tg.version);
    
    // Только секция теста активна; библиотека скрыта
    document.getElementById('testSection').classList.add('active');
    document.getElementById('librarySection').classList.remove('active');
    
    showScreen('welcomeScreen');
    updateTabBarVisibility('welcomeScreen');
});
