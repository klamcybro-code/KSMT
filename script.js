const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const user = tg.initDataUnsafe?.user;
if (user) {
    const avatarSrc = user.photo_url || 'https://i.pravatar.cc/80';
    document.getElementById('avatar').src = avatarSrc;
    document.querySelector('.profile-avatar').src = avatarSrc;
    const username = user.username || user.first_name || 'Пользователь';
    document.querySelector('.username').textContent = '@' + username;
    
    // Настоящий ID пользователя
    const userIdElement = document.getElementById('user-id');
    if (userIdElement) {
        userIdElement.textContent = `ID: ${user.id}`;
    }
}

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

// Crash Game Variables
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
    
    // Обновляем ID в профиле
    const userIdElement = document.getElementById('user-id');
    if (userIdElement && user.id) {
        userIdElement.textContent = `ID: ${user.id}`;
    }
}

function updateUI() {
    if (!currentUser) return;
    document.querySelector('#top-bar .balance').innerHTML = `<i class="fa-solid fa-star"></i> ${currentUser.balance.toLocaleString()}`;
    document.querySelector('.level').textContent = `Уровень ${currentUser.level}`;
    document.querySelectorAll('.stat .value')[0].textContent = currentUser.sales;
    document.querySelectorAll('.stat .value')[1].textContent = currentUser.purchases;
}

function updateCartBadge() {
    document.getElementById('cart-badge').textContent = cart.length;
}

function isInCart(itemId) {
    return cart.some(i => i.id === itemId);
}

function addToCart(itemId, btnElement) {
    if (isInCart(itemId)) {
        removeFromCart(itemId);
        return;
    }
    
    const item = nftDB.find(i => i.id === itemId);
    if (!item) return;
    
    if (currentUser && currentUser.balance < item.price) {
        if (window.Telegram?.WebApp) {
            Telegram.WebApp.showAlert('Пополните баланс');
        } else {
            alert('Пополните баланс');
        }
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
    
    if (window.Telegram?.WebApp) {
        Telegram.WebApp.showAlert(`${item.name} добавлен в корзину!`);
    } else {
        alert(`${item.name} добавлен в корзину!`);
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(i => i.id !== itemId);
    updateCartBadge();
    renderNFTs(document.getElementById('search-input').value);
    renderCartModal();
}

function renderCartModal() {
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartTotal = document.getElementById('cart-total');
    const totalPrice = document.getElementById('total-price');
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartEmpty.style.display = 'flex';
        cartTotal.style.display = 'none';
        document.getElementById('cart-checkout-btn').style.display = 'none';
        return;
    }
    
    cartEmpty.style.display = 'none';
    cartTotal.style.display = 'flex';
    document.getElementById('cart-checkout-btn').style.display = 'block';
    
    let total = 0;
    cart.forEach(item => {
        total += item.price;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/100x100?text=NFT'">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price"><i class="fa-solid fa-star"></i> ${item.price.toLocaleString()}</div>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    totalPrice.textContent = total.toFixed(2);
    
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            removeFromCart(id);
        });
    });
}

function renderTasks() {
    const tasksList = document.getElementById('tasks-list');
    tasksList.innerHTML = '';
    
    tasksDB.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.innerHTML = `
            <div class="task-icon">
                <i class="fa-solid fa-check"></i>
            </div>
            <div class="task-info">
                <div class="task-name">${task.name}</div>
                <div class="task-reward">Награда: <span><i class="fa-solid fa-star"></i> ${task.reward.toLocaleString()}</span></div>
            </div>
            <div class="task-action" data-id="${task.id}">
                <i class="fa-solid fa-arrow-right"></i>
            </div>
        `;
        
        const actionBtn = taskItem.querySelector('.task-action');
        actionBtn.addEventListener('click', function() {
            if (task.link && task.link !== '#') {
                window.open(task.link, '_blank');
            }
        });
        
        tasksList.appendChild(taskItem);
    });
}

function initCrashGame() {
    crashGame.canvas = document.getElementById('crash-canvas');
    crashGame.ctx = crashGame.canvas.getContext('2d');
    
    const container = crashGame.canvas.parentElement;
    crashGame.canvas.width = container.offsetWidth;
    crashGame.canvas.height = container.offsetHeight;
    
    document.getElementById('crash-bet-btn').addEventListener('click', openCrashBetModal);
    document.getElementById('close-crash-bet-modal').addEventListener('click', closeCrashBetModal);
    document.getElementById('modal-max-btn').addEventListener('click', setMaxBet);
    document.getElementById('confirm-crash-bet').addEventListener('click', confirmCrashBet);
    document.getElementById('auto-cashout-enabled').addEventListener('change', toggleAutoCashoutInput);
    
    setInterval(updateOnlinePlayers, 5000);
    setTimeout(startCrashRound, 1000);
}

function openCrashBetModal() {
    if (crashGame.isRunning && crashGame.hasBet) {
        cashOut();
        return;
    }
    document.getElementById('crash-bet-modal').classList.add('open');
}

function closeCrashBetModal() {
    document.getElementById('crash-bet-modal').classList.remove('open');
}

function toggleAutoCashoutInput() {
    const enabled = document.getElementById('auto-cashout-enabled').checked;
    const group = document.getElementById('modal-auto-cashout-group');
    group.style.display = enabled ? 'flex' : 'none';
}

function confirmCrashBet() {
    const betAmount = parseFloat(document.getElementById('modal-bet-amount').value);
    const autoCashoutEnabled = document.getElementById('auto-cashout-enabled').checked;
    const autoCashout = autoCashoutEnabled ? parseFloat(document.getElementById('modal-auto-cashout').value) : 0;
    
    if (!betAmount || betAmount <= 0) {
        alert('Введите сумму ставки');
        return;
    }
    
    if (!currentUser || currentUser.balance < betAmount) {
        alert('Недостаточно средств');
        return;
    }
    
    if (crashGame.isRunning) {
        alert('Ставки принимаются только перед раундом');
        return;
    }
    
    crashGame.userBet = betAmount;
    crashGame.autoCashout = autoCashout;
    crashGame.hasBet = true;
    crashGame.hasCashedOut = false;
    
    currentUser.balance -= betAmount;
    saveDB();
    updateUI();
    
    closeCrashBetModal();
    document.getElementById('crash-bet-btn').innerHTML = '<i class="fa-solid fa-play"></i> Ожидание...';
    document.getElementById('crash-bet-btn').disabled = true;
}

function generateCrashPoint() {
    const random = Math.random();
    let crashPoint = 0.99 / (1 - random);
    crashPoint = Math.min(crashPoint, 150);
    crashPoint = Math.floor(crashPoint * 100) / 100;
    crashPoint = Math.max(crashPoint, 1.00);
    return crashPoint;
}

function startCrashRound() {
    crashGame.isRunning = true;
    crashGame.currentMultiplier = 1.00;
    crashGame.crashPoint = generateCrashPoint();
    crashGame.hasBet = false;
    crashGame.hasCashedOut = false;
    crashGame.roundNumber++;
    
    document.getElementById('crash-round').textContent = crashGame.roundNumber;
    document.getElementById('crash-multiplier').textContent = '1.00x';
    document.getElementById('crash-multiplier').classList.remove('crashed', 'won');
    document.getElementById('crash-status').textContent = 'Игра идет...';
    document.getElementById('crash-bet-btn').disabled = true;
    document.getElementById('crash-bet-btn').innerHTML = '<i class="fa-solid fa-hourglass"></i> Ожидание...';
    
    setTimeout(() => {
        document.getElementById('crash-bet-btn').disabled = false;
        document.getElementById('crash-bet-btn').innerHTML = '<i class="fa-solid fa-play"></i> Сделать ставку';
    }, 2000);
    
    animateCrash();
}

function animateCrash() {
    if (!crashGame.isRunning) return;
    
    const startTime = Date.now();
    const baseDuration = 5000 + (crashGame.crashPoint - 1) * 1000;
    const duration = Math.min(baseDuration, 20000);
    const speedVariation = 0.8 + Math.random() * 0.4;
    
    function animate() {
        if (!crashGame.isRunning) return;
        
        const elapsed = (Date.now() - startTime) * speedVariation;
        const progress = elapsed / duration;
        const smoothProgress = Math.pow(progress, 0.8);
        const randomFluctuation = (Math.random() - 0.5) * 0.02 * progress;
        crashGame.currentMultiplier = 1 + (crashGame.crashPoint - 1) * (smoothProgress + randomFluctuation);
        
        document.getElementById('crash-multiplier').textContent = crashGame.currentMultiplier.toFixed(2) + 'x';
        drawCrashGraph();
        
        if (crashGame.hasBet && !crashGame.hasCashedOut && crashGame.autoCashout > 0 && crashGame.currentMultiplier >= crashGame.autoCashout) {
            cashOut();
        }
        
        const crashThreshold = crashGame.crashPoint * (0.98 + Math.random() * 0.04);
        
        if (crashGame.currentMultiplier >= crashThreshold) {
            crash();
            return;
        }
        
        crashGame.animationId = requestAnimationFrame(animate);
    }
    
    animate();
}

function drawCrashGraph() {
    const ctx = crashGame.ctx;
    const canvas = crashGame.canvas;
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(0, 122, 255, 0.15)');
    gradient.addColorStop(1, 'rgba(0, 122, 255, 0.02)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = 'rgba(0, 122, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        const y = (height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    ctx.beginPath();
    ctx.moveTo(0, height);
    
    const progress = (crashGame.currentMultiplier - 1) / (crashGame.crashPoint - 1);
    const x = progress * width;
    const y = height - (progress * height * 0.85);
    
    ctx.quadraticCurveTo(x * 0.3, height, x * 0.6, y * 0.5 + height * 0.3);
    ctx.quadraticCurveTo(x * 0.8, y, x, y);
    ctx.lineTo(x, height);
    ctx.closePath();
    
    const fillGradient = ctx.createLinearGradient(0, height, 0, y);
    fillGradient.addColorStop(0, 'rgba(0, 122, 255, 0.4)');
    fillGradient.addColorStop(1, 'rgba(0, 122, 255, 0.05)');
    ctx.fillStyle = fillGradient;
    ctx.fill();
    
    ctx.shadowColor = '#007AFF';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.quadraticCurveTo(x * 0.3, height, x * 0.6, y * 0.5 + height * 0.3);
    ctx.quadraticCurveTo(x * 0.8, y, x, y);
    ctx.strokeStyle = '#007AFF';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    if (progress > 0) {
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#007AFF';
        ctx.shadowColor = '#007AFF';
        ctx.shadowBlur = 30;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function crash() {
    crashGame.isRunning = false;
    cancelAnimationFrame(crashGame.animationId);
    
    document.getElementById('crash-multiplier').textContent = crashGame.crashPoint.toFixed(2) + 'x';
    document.getElementById('crash-multiplier').classList.add('crashed');
    document.getElementById('crash-status').textContent = 'CRASHED!';
    
    addToHistory(crashGame.crashPoint);
    
    if (crashGame.hasBet && !crashGame.hasCashedOut) {
        crashGame.userBet = 0;
    }
    
    setTimeout(startCrashRound, 3000);
}

function cashOut() {
    if (!crashGame.hasBet || crashGame.hasCashedOut) return;
    
    crashGame.hasCashedOut = true;
    
    const winnings = crashGame.userBet * crashGame.currentMultiplier;
    currentUser.balance += winnings;
    saveDB();
    updateUI();
    
    document.getElementById('crash-multiplier').classList.add('won');
    document.getElementById('crash-status').textContent = `Вывод: ${winnings.toLocaleString()}`;
    document.getElementById('crash-bet-btn').innerHTML = '<i class="fa-solid fa-check"></i> Выведено!';
    
    crashGame.userBet = 0;
}

function setMaxBet() {
    if (!currentUser) return;
    document.getElementById('crash-bet-amount').value = currentUser.balance.toFixed(2);
}

function updateOnlinePlayers() {
    const change = Math.floor(Math.random() * 200) - 100;
    crashGame.onlinePlayers = Math.max(11000, Math.min(13000, crashGame.onlinePlayers + change));
    document.getElementById('crash-online').textContent = crashGame.onlinePlayers.toLocaleString();
}

function addToHistory(crashPoint) {
    crashGame.history.unshift(crashPoint);
    if (crashGame.history.length > 10) {
        crashGame.history.pop();
    }
    
    const historyList = document.getElementById('crash-history');
    historyList.innerHTML = '';
    
    crashGame.history.forEach(point => {
        const item = document.createElement('div');
        item.className = `history-item ${point >= 2 ? 'win' : 'loss'}`;
        item.textContent = point.toFixed(2) + 'x';
        historyList.appendChild(item);
    });
}

function renderNFTs(filter = '') {
    const grid = document.getElementById('nft-grid');
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
            <div class="nft-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/400x400?text=NFT'">
            </div>
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

document.getElementById('load-more-btn').addEventListener('click', function() {
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

function openNFTModal(id) {
    const item = nftDB.find(i => i.id === id);
    if (!item) return;
    currentModalItem = item;
    const modal = document.getElementById('nft-modal');
    document.getElementById('modal-title').textContent = item.name;
    document.getElementById('modal-id').textContent = item.id;
    document.getElementById('modal-desc').textContent = item.description;
    
    const attrs = document.getElementById('modal-attributes');
    attrs.innerHTML = '';
    item.attributes.forEach(attr => {
        const el = document.createElement('div');
        el.className = 'nft-attribute';
        el.textContent = `${attr.trait}: ${attr.value}`;
        attrs.appendChild(el);
    });
    
    document.getElementById('modal-price').innerHTML = `<i class="fa-solid fa-star"></i> <span>${item.price.toLocaleString()}</span>`;
    
    const lc = document.getElementById('modal-lottie');
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
    
    const buyBtn = document.getElementById('modal-buy-btn');
    const errorText = document.getElementById('error-text');
    
    if (isInCart(item.id)) {
        buyBtn.textContent = '✓ В корзине';
        buyBtn.className = 'buy-btn in-cart';
        errorText.classList.remove('show');
    } else {
        buyBtn.textContent = 'Купить';
        buyBtn.className = 'buy-btn';
        errorText.classList.remove('show');
        buyBtn.onclick = function() {
            if (isInCart(item.id)) {
                return;
            }
            if (currentUser.balance < item.price) {
                errorText.classList.add('show');
                setTimeout(() => {
                    errorText.classList.remove('show');
                }, 3000);
                return;
            }
            cart.push(item);
            updateCartBadge();
            renderNFTs(document.getElementById('search-input').value);
            this.textContent = '✓ В корзине';
            this.className = 'buy-btn in-cart';
            if (window.Telegram?.WebApp) {
                Telegram.WebApp.showAlert(`${item.name} добавлен в корзину!`);
            } else {
                alert(`${item.name} добавлен в корзину!`);
            }
        };
    }
    modal.classList.add('open');
}

function updateStorageUI() {
    const saleCount = currentUser ? currentUser.inventory.filter(id => nftDB.find(i => i.id === id && i.owner === currentUser.telegramId)).length : 0;
    const storageCount = currentUser ? currentUser.inventory.filter(id => nftDB.find(i => i.id === id && i.owner !== null)).length : 0;
    document.getElementById('sale-count').textContent = `(${saleCount})`;
    document.getElementById('storage-count').textContent = `(${storageCount})`;
    
    const text = document.getElementById('storage-empty-text');
    if (currentStorageTab === 'sale') {
        text.textContent = saleCount === 0 ? 'Нет подарков на продаже' : `Подарков на продаже: ${saleCount}`;
    } else {
        text.textContent = storageCount === 0 ? 'В хранилище пока пусто' : `В хранилище: ${storageCount} подарков`;
    }
}

function switchPage(page) {
    document.getElementById('market-page').classList.remove('active');
    document.getElementById('storage-page').classList.remove('active');
    document.getElementById('games-page').classList.remove('active');
    document.getElementById('tasks-page').classList.remove('active');
    
    if (page === 'market') {
        document.getElementById('market-page').classList.add('active');
    } else if (page === 'storage') {
        document.getElementById('storage-page').classList.add('active');
    } else if (page === 'games') {
        document.getElementById('games-page').classList.add('active');
    } else if (page === 'tasks') {
        document.getElementById('tasks-page').classList.add('active');
    }
}

// ========== EVENT LISTENERS ==========

document.getElementById('search-input').addEventListener('input', function() {
    if (document.getElementById('market-page').classList.contains('active')) {
        renderNFTs(this.value);
    }
});

document.getElementById('avatar-wrapper').addEventListener('click', () => {
    document.getElementById('profile-modal').classList.add('open');
});

document.getElementById('close-profile').addEventListener('click', () => {
    document.getElementById('profile-modal').classList.remove('open');
});

document.getElementById('close-nft-modal').addEventListener('click', function() {
    document.getElementById('nft-modal').classList.remove('open');
    if (currentLottieInstance) {
        currentLottieInstance.destroy();
        currentLottieInstance = null;
    }
});

document.getElementById('channelBtn').addEventListener('click', () => {
    window.open('https://t.me/KSMT_community', '_blank');
});

document.getElementById('cartBtn').addEventListener('click', function() {
    renderCartModal();
    document.getElementById('cart-modal').classList.add('open');
});

// ✅ ИСПРАВЛЕНО: Подключение кошелька (работает!)
document.getElementById('connect-wallet-btn').addEventListener('click', () => {
    document.getElementById('wallet-modal').classList.add('open');
});

document.getElementById('ton-connect-btn').addEventListener('click', function() {
    if (window.Telegram?.WebApp) {
        Telegram.WebApp.openTelegramLink('https://t.me/wallet?attach=connect');
        document.getElementById('wallet-modal').classList.remove('open');
        Telegram.WebApp.showAlert('Подключите кошелек в Telegram');
    } else {
        if (currentUser) {
            currentUser.walletConnected = true;
            saveDB();
            document.getElementById('wallet-modal').classList.remove('open');
            alert('✅ Кошелек подключен! (Тестовый режим)');
            updateUI();
        }
    }
});

document.getElementById('tonkeeper-btn').addEventListener('click', function() {
    window.open('tonkeeper://', '_blank');
    document.getElementById('wallet-modal').classList.remove('open');
    if (window.Telegram?.WebApp) {
        Telegram.WebApp.showAlert('Откройте Tonkeeper для подключения');
    }
});

document.getElementById('close-wallet-modal').addEventListener('click', () => {
    document.getElementById('wallet-modal').classList.remove('open');
});

document.getElementById('close-cart-modal').addEventListener('click', () => {
    document.getElementById('cart-modal').classList.remove('open');
});

document.getElementById('cart-checkout-btn').addEventListener('click', function() {
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
    renderNFTs(document.getElementById('search-input').value);
    renderCartModal();
    document.getElementById('cart-modal').classList.remove('open');
    
    if (window.Telegram?.WebApp) {
        Telegram.WebApp.showAlert('Покупка успешно оформлена!');
    } else {
        alert('Покупка успешно оформлена!');
    }
});

document.querySelectorAll('.nav-item').forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(function(b) {
            b.classList.remove('active');
        });
        this.classList.add('active');
        const page = this.dataset.page;
        switchPage(page);
        
        const searchWrapper = document.getElementById('search-wrapper');
        if (page === 'market') {
            searchWrapper.classList.remove('hidden');
        } else {
            searchWrapper.classList.add('hidden');
        }
        
        if (page === 'storage') {
            updateStorageUI();
        } else if (page === 'market') {
            renderNFTs(document.getElementById('search-input').value);
        } else if (page === 'tasks') {
            renderTasks();
        } else if (page === 'games') {
            setTimeout(initCrashGame, 100);
        }
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

// Banner
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

// Close mod
