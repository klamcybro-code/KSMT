// ============================================================
// 1. SPLASH SCREEN (ЗАГРУЗКА)
// ============================================================
function showSplash() {
    const splash = document.getElementById('splash-screen');
    if (!splash) return;
    
    setTimeout(() => {
        splash.classList.add('fade-out');
        setTimeout(() => {
            splash.style.display = 'none';
            // После загрузки показываем PIN
            checkPin();
        }, 800);
    }, 2200);
}

// ============================================================
// 2. PIN CODE SYSTEM
// ============================================================
let pinCode = '';
let isFirstLaunch = false;

function getPinFromStorage() {
    return localStorage.getItem('ksmt_pin');
}

function savePin(pin) {
    localStorage.setItem('ksmt_pin', pin);
}

function checkPin() {
    const savedPin = getPinFromStorage();
    const pinScreen = document.getElementById('pin-screen');
    const pinTitle = document.getElementById('pin-title');
    const pinSubtitle = document.getElementById('pin-subtitle');
    
    if (savedPin) {
        pinTitle.textContent = 'Введите PIN-код';
        pinSubtitle.textContent = 'Для входа в приложение';
        isFirstLaunch = false;
    } else {
        pinTitle.textContent = 'Создайте PIN-код';
        pinSubtitle.textContent = 'Для защиты вашего аккаунта';
        isFirstLaunch = true;
    }
    
    pinScreen.style.display = 'flex';
    pinCode = '';
    updatePinDots();
    document.getElementById('pin-error').classList.remove('show');
}

function updatePinDots() {
    const dots = document.querySelectorAll('.pin-dots .dot');
    dots.forEach((dot, index) => {
        if (index < pinCode.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

function handlePinInput(value) {
    const errorEl = document.getElementById('pin-error');
    errorEl.classList.remove('show');
    
    if (pinCode.length >= 4) return;
    
    pinCode += value;
    updatePinDots();
    
    if (pinCode.length === 4) {
        const savedPin = getPinFromStorage();
        
        if (isFirstLaunch) {
            // Сохраняем новый PIN
            savePin(pinCode);
            setTimeout(() => {
                document.getElementById('pin-screen').style.display = 'none';
                document.getElementById('app').style.display = 'flex';
                initApp();
            }, 300);
        } else {
            // Проверяем PIN
            if (pinCode === savedPin) {
                setTimeout(() => {
                    document.getElementById('pin-screen').style.display = 'none';
                    document.getElementById('app').style.display = 'flex';
                    initApp();
                }, 300);
            } else {
                // Неверный PIN
                errorEl.textContent = '❌ Неверный PIN-код';
                errorEl.classList.add('show');
                document.querySelectorAll('.pin-dots .dot').forEach(dot => {
                    dot.classList.add('error');
                });
                setTimeout(() => {
                    document.querySelectorAll('.pin-dots .dot').forEach(dot => {
                        dot.classList.remove('error');
                    });
                }, 400);
                pinCode = '';
                setTimeout(() => {
                    updatePinDots();
                }, 400);
            }
        }
    }
}

function handlePinDelete() {
    if (pinCode.length > 0) {
        pinCode = pinCode.slice(0, -1);
        updatePinDots();
        document.getElementById('pin-error').classList.remove('show');
    }
}

// ============================================================
// 3. TELEGRAM WEBAPP & USER (инициализация до PIN)
// ============================================================
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const user = tg.initDataUnsafe?.user;
if (user) {
    const avatarSrc = user.photo_url || 'https://i.pravatar.cc/80';
    // Отложим обновление аватара до загрузки DOM
    setTimeout(() => {
        const avatar = document.getElementById('avatar');
        const profileAvatar = document.querySelector('.profile-avatar');
        if (avatar) avatar.src = avatarSrc;
        if (profileAvatar) profileAvatar.src = avatarSrc;
        const username = user.username || user.first_name || 'Пользователь';
        const usernameEl = document.querySelector('.username');
        if (usernameEl) usernameEl.textContent = '@' + username;
        const userIdElement = document.getElementById('user-id');
        if (userIdElement) {
            userIdElement.textContent = `ID: ${user.id}`;
        }
    }, 100);
}

// ============================================================
// 4. NFT DATABASE
// ============================================================
let nftDB = [
    {
        id: 'signetring-1505',
        name: 'Signet Ring #1505',
        description: 'An exclusive Signet Ring with the appearance Obsidian on a Onyx Black background with Mountain Lion icons.',
        price: 171,
        image: 'https://nft.fragment.com/gift/signetring-1505.webp',
        lottie: 'https://nft.fragment.com/gift/signetring-1505.lottie.json',
        attributes: [
            { trait: 'Model', value: 'Obsidian' },
            { trait: 'Backdrop', value: 'Onyx Black' },
            { trait: 'Symbol', value: 'Mountain Lion' }
        ],
        owner: null
    },
    {
        id: 'snoopcigar-75928',
        name: 'Snoop Cigar #75928',
        description: 'An exclusive Snoop Cigar with the appearance Gold on a White background with Party icons.',
        price: 214,
        image: 'https://nft.fragment.com/gift/snoopcigar-75928.webp',
        lottie: 'https://nft.fragment.com/gift/snoopcigar-75928.lottie.json',
        attributes: [
            { trait: 'Model', value: 'Gold' },
            { trait: 'Backdrop', value: 'White' },
            { trait: 'Symbol', value: 'Party' }
        ],
        owner: null
    },
    {
        id: 'scaredcat-1310',
        name: 'Scared Cat #1310',
        description: 'An exclusive Scared Cat gift.',
        price: 42532,
        image: 'https://nft.fragment.com/gift/scaredcat-1310.webp',
        lottie: 'https://nft.fragment.com/gift/scaredcat-1310.lottie.json',
        attributes: [],
        owner: null
    },
    {
        id: 'snoopdogg-171549',
        name: 'Snoop Dogg #171549',
        description: 'An exclusive Snoop Dogg gift.',
        price: 679,
        image: 'https://nft.fragment.com/gift/snoopdogg-171549.webp',
        lottie: 'https://nft.fragment.com/gift/snoopdogg-171549.lottie.json',
        attributes: [],
        owner: null
    },
    {
        id: 'magicpotion-293',
        name: 'Magic Potion #293',
        description: 'An exclusive Magic Potion gift.',
        price: 8789,
        image: 'https://nft.fragment.com/gift/magicpotion-293.webp',
        lottie: 'https://nft.fragment.com/gift/magicpotion-293.lottie.json',
        attributes: [],
        owner: null
    },
    {
        id: 'lunarsnake-8997',
        name: 'Lunar Snake #8997',
        description: 'An exclusive Lunar Snake gift.',
        price: 464,
        image: 'https://nft.fragment.com/gift/lunarsnake-8997.webp',
        lottie: 'https://nft.fragment.com/gift/lunarsnake-8997.lottie.json',
        attributes: [],
        owner: null
    },
    {
        id: 'lightsword-12264',
        name: 'Light Sword #12264',
        description: 'An exclusive Light Sword gift.',
        price: 611,
        image: 'https://nft.fragment.com/gift/lightsword-12264.webp',
        lottie: 'https://nft.fragment.com/gift/lightsword-12264.lottie.json',
        attributes: [],
        owner: null
    },
    {
        id: 'kissedfrog-7560',
        name: 'Kissed Frog #7560',
        description: 'An exclusive Kissed Frog gift.',
        price: 9916,
        image: 'https://nft.fragment.com/gift/kissedfrog-7560.webp',
        lottie: 'https://nft.fragment.com/gift/kissedfrog-7560.lottie.json',
        attributes: [],
        owner: null
    },
    {
        id: 'jesterhat-106256',
        name: 'Jester Hat #106256',
        description: 'An exclusive Jester Hat gift.',
        price: 499,
        image: 'https://nft.fragment.com/gift/jesterhat-106256.webp',
        lottie: 'https://nft.fragment.com/gift/jesterhat-106256.lottie.json',
        attributes: [],
        owner: null
    },
    {
        id: 'icecream-236560',
        name: 'Ice Cream #236560',
        description: 'An exclusive Ice Cream gift.',
        price: 396,
        image: 'https://nft.fragment.com/gift/icecream-236560.webp',
        lottie: 'https://nft.fragment.com/gift/icecream-236560.lottie.json',
        attributes: [],
        owner: null
    }
];

// ============================================================
// 5. USER & STORAGE
// ============================================================
let usersDB = [];
let currentUser = null;
let cart = [];
let currentStorageTab = 'sale';
let currentLottieInstance = null;
let currentModalItem = null;

const tasksDB = [
    { id: 1, name: 'Подписаться на канал KSMT', reward: 43, link: 'https://t.me/KSMT_community', completed: false },
    { id: 2, name: 'Совершить покупку более 215 звезд', reward: 26, link: '#', completed: false },
    { id: 3, name: 'Выиграть в Crash более 5 раз подряд (кф не менее х2)', reward: 17, link: '#', completed: false }
];

// ============================================================
// 6. CRASH GAME
// ============================================================
let crashGame = {
    isRunning: false,
    currentMultiplier: 1.00,
    crashPoint: 0,
    roundNumber: 120000,
    onlinePlayers: 12000,
    userBet: 0,
    autoCashout: 0,
    hasBet: false,
    hasCashedOut: false,
    history: [],
    animationId: null,
    canvas: null,
    ctx: null
};

// ============================================================
// 7. DATABASE FUNCTIONS
// ============================================================
function loadDB() {
    const saved = localStorage.getItem('ksmt_users');
    if (saved) usersDB = JSON.parse(saved);
}

function saveDB() {
    localStorage.setItem('ksmt_users', JSON.stringify(usersDB));
}

function initUser() {
    if (!user) return;
    let found = usersDB.find(u => u.telegramId === user.id);
    if (!found) {
        found = {
            telegramId: user.id,
            username: user.username || user.first_name || 'Пользователь',
            balance: 0,
            level: 1,
            sales: 0,
            purchases: 0,
            inventory: [],
            cart: []
        };
        usersDB.push(found);
        saveDB();
    }
    currentUser = found;
    updateUI();
}

function updateUI() {
    if (!currentUser) return;
    const balanceEl = document.querySelector('#top-bar .balance');
    if (balanceEl) balanceEl.innerHTML = `<i class="fa-solid fa-star"></i> ${currentUser.balance.toLocaleString()}`;
    const levelEl = document.querySelector('.level');
    if (levelEl) levelEl.textContent = `Уровень ${currentUser.level}`;
    const statValues = document.querySelectorAll('.stat .value');
    if (statValues.length >= 2) {
        statValues[0].textContent = currentUser.sales;
        statValues[1].textContent = currentUser.purchases;
    }
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) badge.textContent = cart.length;
}

function isInCart(itemId) {
    return cart.some(i => i.id === itemId);
}

// ============================================================
// 8. CART FUNCTIONS
// ============================================================
function addToCart(itemId, btnElement) {
    if (isInCart(itemId)) {
        removeFromCart(itemId);
        return;
    }
    const item = nftDB.find(i => i.id === itemId);
    if (!item) return;
    if (currentUser && currentUser.balance < item.price) {
        if (window.Telegram?.WebApp) Telegram.WebApp.showAlert('Пополните баланс');
        else alert('Пополните баланс');
        return;
    }
    cart.push(item);
    updateCartBadge();
    if (btnElement) {
        btnElement.classList.add('added');
        setTimeout(() => {
            btnElement.classList.remove('added');
            btnElement.classList.add('in-cart');
        }, 150);
    }
    if (window.Telegram?.WebApp) Telegram.WebApp.showAlert(`${item.name} добавлен в корзину!`);
    else alert(`${item.name} добавлен в корзину!`);
}

function removeFromCart(itemId) {
    cart = cart.filter(i => i.id !== itemId);
    updateCartBadge();
    renderNFTs(document.getElementById('search-input')?.value || '');
    renderCartModal();
}

function renderCartModal() {
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartTotal = document.getElementById('cart-total');
    const totalPrice = document.getElementById('total-price');
    if (!cartItems) return;
    cartItems.innerHTML = '';
    if (cart.length === 0) {
        if (cartEmpty) cartEmpty.style.display = 'flex';
        if (cartTotal) cartTotal.style.display = 'none';
        const checkoutBtn = document.getElementById('cart-checkout-btn');
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }
    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartTotal) cartTotal.style.display = 'flex';
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) checkoutBtn.style.display = 'block';
    let total = 0;
    cart.forEach(item => {
        total += item.price;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image"><img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/100x100?text=NFT'"></div>
            <div class="cart-item-info"><div class="cart-item-name">${item.name}</div><div class="cart-item-price"><i class="fa-solid fa-star"></i> ${item.price.toLocaleString()}</div></div>
            <button class="cart-item-remove" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button>
        `;
        cartItems.appendChild(cartItem);
    });
    if (totalPrice) totalPrice.textContent = total.toFixed(2);
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            removeFromCart(this.dataset.id);
        });
    });
}

// ============================================================
// 9. TASKS
// ============================================================
function renderTasks() {
    const tasksList = document.getElementById('tasks-list');
    if (!tasksList) return;
    tasksList.innerHTML = '';
    tasksDB.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.innerHTML = `
            <div class="task-icon"><i class="fa-solid fa-check"></i></div>
            <div class="task-info"><div class="task-name">${task.name}</div><div class="task-reward">Награда: <span><i class="fa-solid fa-star"></i> ${task.reward.toLocaleString()}</span></div></div>
            <div class="task-action" data-id="${task.id}"><i class="fa-solid fa-arrow-right"></i></div>
        `;
        taskItem.querySelector('.task-action').addEventListener('click', function() {
            if (task.link && task.link !== '#') window.open(task.link, '_blank');
        });
        tasksList.appendChild(taskItem);
    });
}

// ============================================================
// 10. NFT RENDER
// ============================================================
function renderNFTs(filter = '') {
    const grid = document.getElementById('nft-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const filtered = nftDB.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()));
    if (filtered.length === 0) {
        grid.innerHTML = '<div style="color:#8E8E93;text-align:center;padding:40px 0;font-size:14px;">NFT не найдены</div>';
        return;
    }
    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'nft-card';
        const inCart = isInCart(item.id);
        card.innerHTML = `
            <div class="nft-image"><img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/400x400?text=NFT'"></div>
            <div class="nft-info">
                <div class="nft-name">${item.name}</div>
                <div class="nft-id">${item.id}</div>
                <div class="nft-footer">
                    <button class="buy-btn-card ${inCart ? 'in-cart' : ''}" data-id="${item.id}">
                        <i class="fa-solid fa-star"></i> ${item.price.toLocaleString()}
                    </button>
                    <button class="cart-btn ${inCart ? 'in-cart' : ''}" data-id="${item.id}">
                        <i class="fa-solid fa-cart-shopping"></i>
                        <i class="fa-solid fa-check check-icon"></i>
                    </button>
                </div>
            </div>
        `;
        const buyBtn = card.querySelector('.buy-btn-card');
        const cartBtn = card.querySelector('.cart-btn');
        
        buyBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openNFTModal(item.id);
        });
        
        cartBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            addToCart(item.id, this);
        });
        
        card.addEventListener('click', function() {
            openNFTModal(item.id);
        });
        
        grid.appendChild(card);
    });
}

// ============================================================
// 11. NFT MODAL
// ============================================================
function openNFTModal(id) {
    const item = nftDB.find(i => i.id === id);
    if (!item) return;
    currentModalItem = item;
    const modal = document.getElementById('nft-modal');
    if (!modal) return;
    document.getElementById('modal-title').textContent = item.name;
    document.getElementById('modal-id').textContent = item.id;
    document.getElementById('modal-desc').textContent = item.description;
    
    const attrs = document.getElementById('modal-attributes');
    if (attrs) {
        attrs.innerHTML = '';
        item.attributes.forEach(attr => {
            const el = document.createElement('div');
            el.className = 'nft-attribute';
            el.textContent = `${attr.trait}: ${attr.value}`;
            attrs.appendChild(el);
        });
    }
    
    const priceEl = document.getElementById('modal-price');
    if (priceEl) priceEl.innerHTML = `<i class="fa-solid fa-star"></i> <span>${item.price.toLocaleString()}</span>`;
    
    const lc = document.getElementById('modal-lottie');
    if (lc) {
        lc.innerHTML = '';
        if (currentLottieInstance) {
            currentLottieInstance.destroy();
            currentLottieInstance = null;
        }
        currentLottieInstance = lottie.loadAnimation({
            container: lc,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: item.lottie
        });
    }
    
    const buyBtn = document.getElementById('modal-buy-btn');
    const errorText = document.getElementById('error-text');
    
    if (isInCart(item.id)) {
        if (buyBtn) {
            buyBtn.textContent = '✓ В корзине';
            buyBtn.className = 'buy-btn in-cart';
        }
        if (errorText) errorText.classList.remove('show');
    } else {
        if (buyBtn) {
            buyBtn.textContent = 'Купить';
            buyBtn.className = 'buy-btn';
            buyBtn.onclick = function() {
                if (isInCart(item.id)) {
                    return;
                }
                if (currentUser.balance < item.price) {
                    if (errorText) errorText.classList.add('show');
                    setTimeout(() => {
                        if (errorText) errorText.classList.remove('show');
                    }, 3000);
                    return;
                }
                cart.push(item);
                updateCartBadge();
                renderNFTs(document.getElementById('search-input')?.value || '');
                this.textContent = '✓ В корзине';
                this.className = 'buy-btn in-cart';
                if (window.Telegram?.WebApp) {
                    Telegram.WebApp.showAlert(`${item.name} добавлен в корзину!`);
                } else {
                    alert(`${item.name} добавлен в корзину!`);
                }
            };
        }
        if (errorText) errorText.classList.remove('show');
    }
    modal.classList.add('open');
}

// ============================================================
// 12. STORAGE
// ============================================================
function updateStorageUI() {
    const saleCount = currentUser ? currentUser.inventory.filter(id => nftDB.find(i => i.id === id && i.owner === currentUser.telegramId)).length : 0;
    const storageCount = currentUser ? currentUser.inventory.filter(id => nftDB.find(i => i.id === id && i.owner !== null)).length : 0;
    const saleEl = document.getElementById('sale-count');
    const storageEl = document.getElementById('storage-count');
    if (saleEl) saleEl.textContent = `(${saleCount})`;
    if (storageEl) storageEl.textContent = `(${storageCount})`;
    
    const text = document.getElementById('storage-empty-text');
    if (text) {
        if (currentStorageTab === 'sale') {
            text.textContent = saleCount === 0 ? 'Нет подарков на продаже' : `Подарков на продаже: ${saleCount}`;
        } else {
            text.textContent = storageCount === 0 ? 'В хранилище пока пусто' : `В хранилище: ${storageCount} подарков`;
        }
    }
}

// ============================================================
// 13. PAGE SWITCHER
// ============================================================
function switchPage(page) {
    const marketPage = document.getElementById('market-page');
    const storagePage = document.getElementById('storage-page');
    const gamesPage = document.getElementById('games-page');
    const tasksPage = document.getElementById('tasks-page');
    const searchWrapper = document.getElementById('search-wrapper');
    
    if (marketPage) marketPage.classList.remove('active');
    if (storagePage) storagePage.classList.remove('active');
    if (gamesPage) gamesPage.classList.remove('active');
    if (tasksPage) tasksPage.classList.remove('active');
    
    if (page === 'market') {
        if (marketPage) marketPage.classList.add('active');
        setTimeout(() => {
            renderNFTs(document.getElementById('search-input')?.value || '');
        }, 50);
        if (searchWrapper) searchWrapper.classList.remove('hidden');
    } else if (page === 'storage') {
        if (storagePage) storagePage.classList.add('active');
        updateStorageUI();
        if (searchWrapper) searchWrapper.classList.add('hidden');
    } else if (page === 'games') {
        if (gamesPage) gamesPage.classList.add('active');
        setTimeout(initCrashGame, 100);
        if (searchWrapper) searchWrapper.classList.add('hidden');
    } else if (page === 'tasks') {
        if (tasksPage) tasksPage.classList.add('active');
        renderTasks();
        if (searchWrapper) searchWrapper.classList.add('hidden');
    }
}

// ============================================================
// 14. CRASH GAME FUNCTIONS (сокращённо)
// ============================================================
function initCrashGame() {
    // Базовая инициализация, если нужно
}

// ============================================================
// 15. LOAD MORE BUTTON
// ============================================================
const loadBtn = document.getElementById('load-more-btn');
if (loadBtn) {
    loadBtn.addEventListener('click', function() {
        const btn = this;
        btn.disabled = true;
        btn.classList.add('loading');
        btn.innerHTML = '<i class="fa-solid fa-rotate"></i> Загрузка...';
        setTimeout(() => {
            btn.classList.remove('loading');
            btn.classList.add('error');
            btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Ошибка подключения';
            setTimeout(() => {
                btn.classList.remove('error');
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-rotate"></i> Загрузить еще';
            }, 2000);
        }, 2000);
    });
}

// ============================================================
// 16. EVENT LISTENERS
// ============================================================
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        if (document.getElementById('market-page')?.classList.contains('active')) {
            renderNFTs(this.value);
        }
    });
}

const avatarWrapper = document.getElementById('avatar-wrapper');
if (avatarWrapper) {
    avatarWrapper.addEventListener('click', () => {
        const profileModal = document.getElementById('profile-modal');
        if (profileModal) profileModal.classList.add('open');
    });
}

const closeProfile = document.getElementById('close-profile');
if (closeProfile) {
    closeProfile.addEventListener('click', () => {
        const profileModal = document.getElementById('profile-modal');
        if (profileModal) profileModal.classList.remove('open');
    });
}

const closeNftModal = document.getElementById('close-nft-modal');
if (closeNftModal) {
    closeNftModal.addEventListener('click', function() {
        const nftModal = document.getElementById('nft-modal');
        if (nftModal) nftModal.classList.remove('open');
        if (currentLottieInstance) {
            currentLottieInstance.destroy();
            currentLottieInstance = null;
        }
    });
}

const channelBtn = document.getElementById('channelBtn');
if (channelBtn) {
    channelBtn.addEventListener('click', () => {
        window.open('https://t.me/KSMT_community', '_blank');
    });
}

const cartBtn = document.getElementById('cartBtn');
if (cartBtn) {
    cartBtn.addEventListener('click', function() {
        renderCartModal();
        const cartModal = document.getElementById('cart-modal');
        if (cartModal) cartModal.classList.add('open');
    });
}

const connectWalletBtn = document.getElementById('connect-wallet-btn');
if (connectWalletBtn) {
    connectWalletBtn.addEventListener('click', () => {
        const walletModal = document.getElementById('wallet-modal');
        if (walletModal) walletModal.classList.add('open');
    });
}

const tonConnectBtn = document.getElementById('ton-connect-btn');
if (tonConnectBtn) {
    tonConnectBtn.addEventListener('click', function() {
        if (window.Telegram?.WebApp) {
            Telegram.WebApp.openTelegramLink('https://t.me/wallet?attach=connect');
            const walletModal = document.getElementById('wallet-modal');
            if (walletModal) walletModal.classList.remove('open');
            Telegram.WebApp.showAlert('Подключите кошелек в Telegram');
        } else {
            if (currentUser) {
                currentUser.walletConnected = true;
                saveDB();
                const walletModal = document.getElementById('wallet-modal');
                if (walletModal) walletModal.classList.remove('open');
                alert('✅ Кошелек подключен! (Тестовый режим)');
                updateUI();
            }
        }
    });
}

const tonkeeperBtn = document.getElementById('tonkeeper-btn');
if (tonkeeperBtn) {
    tonkeeperBtn.addEventListener('click', function() {
        window.open('tonkeeper://', '_blank');
        const walletModal = document.getElementById('wallet-modal');
        if (walletModal) walletModal.classList.remove('open');
        if (window.Telegram?.WebApp) {
            Telegram.WebApp.showAlert('Откройте Tonkeeper для подключения');
        }
    });
}

const closeWalletModal = document.getElementById('close-wallet-modal');
if (closeWalletModal) {
    closeWalletModal.addEventListener('click', () => {
        const walletModal = document.getElementById('wallet-modal');
        if (walletModal) walletModal.classList.remove('open');
    });
}

const closeCartModal = document.getElementById('close-cart-modal');
if (closeCartModal) {
    closeCartModal.addEventListener('click', () => {
        const cartModal = document.getElementById('cart-modal');
        if (cartModal) cartModal.classList.remove('open');
    });
}

const cartCheckoutBtn = document.getElementById('cart-checkout-btn');
if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener('click', function() {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        if (currentUser.balance < total) {
            if (window.Telegram?.WebApp) {
                Telegram.WebApp.showAlert('Недостаточно средств для покупки');
            } else {
                alert('Недостаточно средств для покупки');
            }
            return;
        }
        
        currentUser.balance -= total;
        currentUser.purchases += cart.length;
        currentUser.inventory.push(...cart.map(i => i.id));
        saveDB();
        updateUI();
        
        cart = [];
        updateCartBadge();
        renderNFTs(document.getElementById('search-input')?.value || '');
        renderCartModal();
        const cartModal = document.getElementById('cart-modal');
        if (cartModal) cartModal.classList.remove('open');
        
        if (window.Telegram?.WebApp) {
            Telegram.WebApp.showAlert('Покупка успешно оформлена!');
        } else {
            alert('Покупка успешно оформлена!');
        }
    });
}

document.querySelectorAll('.nav-item').forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(function(b) {
            b.classList.remove('active');
        });
        this.classList.add('active');
        const page = this.dataset.page;
        switchPage(page);
    });
});

document.querySelectorAll('.storage-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.storage-tab').forEach(function(t) {
            t.classList.remove('active');
        });
        this.classList.add('active');
        currentStorageTab = this.dataset.tab;
        updateStorageUI();
    });
});

const howToAddBtn = document.getElementById('how-to-add-btn');
if (howToAddBtn) {
    howToAddBtn.addEventListener('click', () => {
        const howToAddModal = document.getElementById('how-to-add-modal');
        if (howToAddModal) howToAddModal.classList.add('open');
    });
}

const closeHowToAdd = document.getElementById('close-how-to-add-modal');
if (closeHowToAdd) {
    closeHowToAdd.addEventListener('click', () => {
        const howToAddModal = document.getElementById('how-to-add-modal');
        if (howToAddModal) howToAddModal.classList.remove('open');
    });
}

const goToBankBtn = document.getElementById('go-to-bank-btn');
if (goToBankBtn) {
    goToBankBtn.addEventListener('click', () => {
        window.open('https://t.me/KSMTBank', '_blank');
    });
}

const howToAddModal = document.getElementById('how-to-add-modal');
if (howToAddModal) {
    howToAddModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('open');
        }
    });
}

// ============================================================
// 17. BANNER
// ============================================================
const slider = document.getElementById('bannerSlider');
const totalOriginal = 2;
let currentIndex = 0;
let autoInterval;

if (slider) {
    function goToNextSlide() {
        currentIndex++;
        slider.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
        slider.style.transition = 'transform 0.5s ease-in-out';
        setTimeout(function() {
            if (currentIndex >= totalOriginal) {
                slider.style.transition = 'none';
                currentIndex = 0;
                slider.style.transform = 'translateX(0)';
                setTimeout(function() {
                    if (slider) slider.style.transition = 'transform 0.5s ease-in-out';
                }, 10);
            }
        }, 500);
    }
    autoInterval = setInterval(goToNextSlide, 3000);
}

// ============================================================
// 18. CLOSE MODALS ON BACKDROP
// ============================================================
const nftModal = document.getElementById('nft-modal');
if (nftModal) {
    nftModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('open');
            if (currentLottieInstance) {
                currentLottieInstance.destroy();
                currentLottieInstance = null;
            }
        }
    });
}

const profileModal = document.getElementById('profile-modal');
if (profileModal) {
    profileModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('open');
        }
    });
}

const walletModal = document.getElementById('wallet-modal');
if (walletModal) {
    walletModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('open');
        }
    });
}

const cartModal = document.getElementById('cart-modal');
if (cartModal) {
    cartModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('open');
        }
    });
}

// ============================================================
// 19. PIN EVENT LISTENERS
// ============================================================
document.querySelectorAll('.pin-key[data-value]').forEach(btn => {
    btn.addEventListener('click', function() {
        handlePinInput(this.dataset.value);
    });
});

const pinDelete = document.getElementById('pin-delete');
if (pinDelete) {
    pinDelete.addEventListener('click', handlePinDelete);
}

// ============================================================
// 20. INIT APP
// ============================================================
function initApp() {
    loadDB();
    initUser();
    renderNFTs();
    updateCartBadge();
    updateStorageUI();
}

// ============================================================
// 21. START — SHOW SPLASH FIRST
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    showSplash();
});
