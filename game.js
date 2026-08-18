// ===== GAME CONFIG =====
const CONFIG = {
  GRID_SIZE: 12,
  MAX_DAYS: 100,
  START_MONEY: 50000,
  START_POPULATION: 5000,
  START_HAPPINESS: 75,
  START_HEALTH: 80,
  START_SAFETY: 70,
  START_POWER: 100,
  START_WATER: 100,
};

const BUILDINGS = {
  house: {
    id: 'house',
    name: 'Жилой дом',
    icon: '🏠',
    price: 2000,
    population: 500,
    happiness: 0,
    health: 0,
    safety: 0,
    powerUse: 5,
    waterUse: 5,
    income: 0,
    upkeep: 50,
    desc: '+500 населения'
  },
  factory: {
    id: 'factory',
    name: 'Завод',
    icon: '🏭',
    price: 8000,
    population: 0,
    happiness: -5,
    health: -3,
    safety: 0,
    powerUse: 15,
    waterUse: 10,
    income: 1500,
    upkeep: 200,
    desc: '+1500$/день, -счастье'
  },
  hospital: {
    id: 'hospital',
    name: 'Больница',
    icon: '🏥',
    price: 12000,
    population: 0,
    happiness: 5,
    health: 10,
    safety: 0,
    powerUse: 10,
    waterUse: 8,
    income: 0,
    upkeep: 300,
    desc: '+10 здоровья, +5 счастья'
  },
  police: {
    id: 'police',
    name: 'Полицейский участок',
    icon: '🚓',
    price: 7000,
    population: 0,
    happiness: 4,
    health: 0,
    safety: 10,
    powerUse: 8,
    waterUse: 4,
    income: 0,
    upkeep: 250,
    desc: '+10 безопасности, +4 счастья'
  },
  park: {
    id: 'park',
    name: 'Парк',
    icon: '🌳',
    price: 3000,
    population: 0,
    happiness: 8,
    health: 2,
    safety: 2,
    powerUse: 2,
    waterUse: 5,
    income: 0,
    upkeep: 30,
    desc: '+8 счастья'
  },
  powerplant: {
    id: 'powerplant',
    name: 'Электростанция',
    icon: '⚡',
    price: 10000,
    population: 0,
    happiness: -2,
    health: -1,
    safety: 0,
    powerUse: 0,
    waterUse: 5,
    powerGen: 50,
    income: 0,
    upkeep: 400,
    desc: '+50 электричества'
  },
  waterplant: {
    id: 'waterplant',
    name: 'Водная станция',
    icon: '💧',
    price: 8000,
    population: 0,
    happiness: 0,
    health: 2,
    safety: 0,
    powerUse: 8,
    waterUse: 0,
    waterGen: 50,
    income: 0,
    upkeep: 350,
    desc: '+50 воды'
  }
};

const EVENTS = [
  {
    id: 'fire',
    icon: '🔥',
    title: 'Пожар на заводе',
    desc: 'На одном из заводов вспыхнул пожар!',
    condition: (s) => s.buildings.filter(b => b.type === 'factory').length > 0,
    options: [
      { text: 'Потратить $1500 на тушение', money: -1500, happiness: 3, health: 0 },
      { text: 'Ничего не делать', money: 0, happiness: -8, health: -3 }
    ]
  },
  {
    id: 'flood',
    icon: '🌧️',
    title: 'Наводнение',
    desc: 'Сильные дожди вызвали подтопление в городе.',
    condition: () => true,
    options: [
      { text: 'Выделить $2000 на ликвидацию', money: -2000, happiness: 2, health: 2 },
      { text: 'Подождать, пока вода уйдёт', money: 0, happiness: -6, health: -4 }
    ]
  },
  {
    id: 'investor',
    icon: '💼',
    title: 'Инвестор',
    desc: 'Богатый инвестор хочет вложить деньги в ваш город.',
    condition: () => true,
    options: [
      { text: 'Принять инвестиции (+$8000)', money: 8000, happiness: 0 },
      { text: 'Отказаться (сохранить независимость)', money: 0, happiness: 5 }
    ]
  },
  {
    id: 'factory_offer',
    icon: '🏭',
    title: 'Предложение завода',
    desc: 'Крупная компания предлагает построить завод за свой счёт.',
    condition: () => true,
    options: [
      { text: 'Согласиться (+завод, -5 счастья)', money: 0, happiness: -5, health: -2, addBuilding: 'factory' },
      { text: 'Отказаться', money: 0, happiness: 3 }
    ]
  },
  {
    id: 'protest',
    icon: '👥',
    title: 'Протест жителей',
    desc: 'Жители недовольны условиями в городе и вышли на митинг.',
    condition: (s) => s.happiness < 50,
    options: [
      { text: 'Улучшить условия (-$3000)', money: -3000, happiness: 10 },
      { text: 'Игнорировать протест', money: 0, happiness: -10, population: -200 }
    ]
  },
  {
    id: 'crime_wave',
    icon: '🚓',
    title: 'Волна преступности',
    desc: 'Преступность резко возросла в городе!',
    condition: (s) => s.safety < 50,
    options: [
      { text: 'Усилить полицию (-$2500)', money: -2500, safety: 8, happiness: 2 },
      { text: 'Надеяться на лучшее', money: 0, safety: -8, happiness: -6 }
    ]
  },
  {
    id: 'power_accident',
    icon: '⚡',
    title: 'Авария на электростанции',
    desc: 'На электростанции произошла авария.',
    condition: (s) => s.buildings.filter(b => b.type === 'powerplant').length > 0,
    options: [
      { text: 'Срочный ремонт (-$3000)', money: -3000, power: 20 },
      { text: 'Использовать резервы', money: 0, power: -20, happiness: -5 }
    ]
  },
  {
    id: 'water_problem',
    icon: '💧',
    title: 'Проблема с водоснабжением',
    desc: 'Водопроводная система дала сбой.',
    condition: () => true,
    options: [
      { text: 'Срочный ремонт (-$2000)', money: -2000, water: 15 },
      { text: 'Ограничить подачу воды', money: 0, water: -15, happiness: -5, health: -3 }
    ]
  },
  {
    id: 'disease',
    icon: '🏥',
    title: 'Вспышка болезни',
    desc: 'В городе началась вспышка неизвестной болезни.',
    condition: (s) => s.health < 60,
    options: [
      { text: 'Массовая вакцинация (-$4000)', money: -4000, health: 15, happiness: 3 },
      { text: 'Карантин', money: 0, health: -5, happiness: -8, population: -300 }
    ]
  },
  {
    id: 'festival',
    icon: '🎉',
    title: 'Городской праздник',
    desc: 'Жители предлагают устроить городской праздник.',
    condition: () => true,
    options: [
      { text: 'Организовать праздник (-$1500)', money: -1500, happiness: 12 },
      { text: 'Отказаться', money: 0, happiness: -3 }
    ]
  },
  {
    id: 'tax_bonus',
    icon: '💰',
    title: 'Неожиданный доход',
    desc: 'Федеральное правительство выделило дополнительные средства.',
    condition: () => true,
    options: [
      { text: 'Принять субсидию (+$5000)', money: 5000 },
      { text: 'Отказаться', money: 0, happiness: 3 }
    ]
  },
  {
    id: 'subsidy',
    icon: '🏗️',
    title: 'Государственная субсидия',
    desc: 'Вам предлагают субсидию на развитие инфраструктуры.',
    condition: () => true,
    options: [
      { text: 'Принять (+$6000)', money: 6000 },
      { text: 'Отказаться', money: 0, happiness: 2 }
    ]
  },
  {
    id: 'park_demand',
    icon: '🌳',
    title: 'Требование парка',
    desc: 'Жители требуют построить новый парк.',
    condition: (s) => s.buildings.filter(b => b.type === 'park').length < 2,
    options: [
      { text: 'Построить парк (-$3000)', money: -3000, happiness: 10 },
      { text: 'Игнорировать', money: 0, happiness: -7 }
    ]
  },
  {
    id: 'road_damage',
    icon: '🚧',
    title: 'Поломка дороги',
    desc: 'Главная дорога в городе серьёзно повреждена.',
    condition: () => true,
    options: [
      { text: 'Срочный ремонт (-$1800)', money: -1800, happiness: 4 },
      { text: 'Отложить ремонт', money: 0, happiness: -5, safety: -3 }
    ]
  },
  {
    id: 'economic_boom',
    icon: '📈',
    title: 'Экономический подъём',
    desc: 'Экономика региона растёт, налоговые поступления увеличились.',
    condition: () => true,
    options: [
      { text: 'Инвестировать в город (-$2000)', money: -2000, happiness: 5 },
      { text: 'Положить в резерв (+$4000)', money: 4000 }
    ]
  },
  {
    id: 'tourism',
    icon: '📸',
    title: 'Поток туристов',
    desc: 'Ваш город стал популярным среди туристов!',
    condition: (s) => s.happiness > 60 && s.buildings.filter(b => b.type === 'park').length >= 1,
    options: [
      { text: 'Развивать туризм (-$1500)', money: -1500, happiness: 5, income: 500 },
      { text: 'Просто наслаждаться', money: 1000, happiness: 2 }
    ]
  },
  {
    id: 'earthquake',
    icon: '🌋',
    title: 'Землетрясение',
    desc: 'Небольшое землетрясение повредило несколько зданий.',
    condition: () => true,
    options: [
      { text: 'Восстановление (-$3500)', money: -3500, happiness: 3 },
      { text: 'Медленный ремонт', money: 0, happiness: -6, health: -2 }
    ]
  }
];

const ACHIEVEMENTS = {
  first_house: { id: 'first_house', name: 'Первый дом', icon: '🏠', condition: (s) => s.buildings.filter(b => b.type === 'house').length >= 1 },
  first_factory: { id: 'first_factory', name: 'Первый завод', icon: '🏭', condition: (s) => s.buildings.filter(b => b.type === 'factory').length >= 1 },
  pop_10000: { id: 'pop_10000', name: '10 000 жителей', icon: '👥', condition: (s) => s.population >= 10000 },
  money_100k: { id: 'money_100k', name: '$100 000 в казне', icon: '💰', condition: (s) => s.money >= 100000 },
  happy_90: { id: 'happy_90', name: '90% счастья', icon: '😊', condition: (s) => s.happiness >= 90 },
  health_100: { id: 'health_100', name: 'Здоровье 100%', icon: '❤️', condition: (s) => s.health >= 100 },
  safety_100: { id: 'safety_100', name: 'Безопасность 100%', icon: '🛡️', condition: (s) => s.safety >= 100 },
  buildings_50: { id: 'buildings_50', name: '50 зданий', icon: '🏙️', condition: (s) => s.buildings.length >= 50 },
  survive_100: { id: 'survive_100', name: 'Пережить 100 дней', icon: '🏆', condition: (s) => s.day >= 100 }
};

// ===== GAME STATE =====
let state = null;
let selectedBuilding = null;
let settings = {
  sound: false,
  music: false,
  animations: true,
  vibration: false
};

// ===== UTILITY =====
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function formatMoney(val) {
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return Math.floor(val / 1000) + 'K';
  return val.toString();
}

function formatNumber(val) {
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return Math.floor(val / 1000) + 'K';
  return val.toString();
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function vibrate(ms = 50) {
  if (settings.vibration && navigator.vibrate) {
    navigator.vibrate(ms);
  }
}

// ===== SETTINGS =====
const settingsManager = {
  load() {
    try {
      const saved = localStorage.getItem('mayor_settings');
      if (saved) settings = { ...settings, ...JSON.parse(saved) };
    } catch (e) {}
    this.apply();
  },
  save() {
    localStorage.setItem('mayor_settings', JSON.stringify(settings));
  },
  toggle(key) {
    settings[key] = !settings[key];
    this.save();
    this.apply();
    ui.updateSettingsUI();
  },
  apply() {
    document.getElementById('toggleSound').classList.toggle('active', settings.sound);
    document.getElementById('toggleMusic').classList.toggle('active', settings.music);
    document.getElementById('toggleAnim').classList.toggle('active', settings.animations);
    document.getElementById('toggleVibro').classList.toggle('active', settings.vibration);
  }
};

// ===== UI =====
const ui = {
  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  },

  showOverlay(id) {
    document.getElementById(id).classList.add('active');
  },

  hideOverlay(id) {
    document.getElementById(id).classList.remove('active');
  },

  showMainMenu() {
    this.showScreen('mainMenu');
    this.updateMainMenu();
  },

  updateMainMenu() {
    const hasSave = localStorage.getItem('mayor_save') !== null;
    document.getElementById('btnContinue').disabled = !hasSave;
  },

  showSettings() {
    settingsManager.apply();
    this.showOverlay('settingsOverlay');
  },

  updateSettingsUI() {
    settingsManager.apply();
  },

  showHowToPlay() {
    this.showOverlay('howToPlay');
  },

  exitGame() {
    this.showOverlay('exitOverlay');
  },

  showPause() {
    this.showOverlay('pauseOverlay');
  },

  newGameConfirm() {
    const hasSave = localStorage.getItem('mayor_save') !== null;
    if (hasSave) {
      this.showOverlay('confirmNewGame');
    } else {
      game.startNewGame();
    }
  },

  confirmDeleteSave() {
    this.showOverlay('confirmDelete');
  },

  toggleBuildPanel() {
    const panel = document.getElementById('buildPanel');
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
      selectedBuilding = null;
      this.renderBuildingsGrid();
      this.renderCity();
    }
  },

  closeBuildPanel() {
    document.getElementById('buildPanel').classList.remove('open');
    selectedBuilding = null;
    this.renderCity();
  },

  renderBuildingsGrid() {
    const grid = document.getElementById('buildingsGrid');
    grid.innerHTML = '';
    Object.values(BUILDINGS).forEach(b => {
      const card = document.createElement('div');
      card.className = 'building-card' + (state.money < b.price ? ' disabled' : '');
      card.innerHTML = `
        <div class="building-card-icon">${b.icon}</div>
        <div class="building-card-name">${b.name}</div>
        <div class="building-card-price">$${b.price.toLocaleString()}</div>
        <div class="building-card-effect">${b.desc}</div>
      `;
      card.onclick = () => {
        if (state.money >= b.price) {
          selectedBuilding = b.id;
          this.renderBuildingsGrid();
          this.renderCity();
          vibrate(30);
        }
      };
      if (selectedBuilding === b.id) {
        card.style.borderColor = 'var(--accent)';
        card.style.boxShadow = '0 0 15px rgba(59,130,246,0.3)';
      }
      grid.appendChild(card);
    });
  },

  renderCity() {
    const grid = document.getElementById('cityGrid');
    grid.innerHTML = '';

    for (let y = 0; y < CONFIG.GRID_SIZE; y++) {
      for (let x = 0; x < CONFIG.GRID_SIZE; x++) {
        const cell = document.createElement('div');
        const cellData = state.map[y][x];
        cell.className = 'cell cell-' + cellData.type;

        if (cellData.type === 'road') {
          const neighbors = this.getRoadNeighbors(x, y);
          if (neighbors.h && neighbors.v) cell.classList.add('cell-intersection');
          else if (neighbors.h) cell.classList.add('cell-road-h');
          else if (neighbors.v) cell.classList.add('cell-road-v');
          else cell.classList.add('cell-road-h');
        }

        if (cellData.building) {
          const b = BUILDINGS[cellData.building];
          cell.classList.add('cell-building');
          cell.textContent = b.icon;
          cell.title = b.name;
        } else if (cellData.type === 'tree') {
          cell.textContent = '🌲';
        } else if (cellData.type === 'lamp') {
          cell.textContent = '💡';
        } else if (cellData.type === 'water') {
          cell.textContent = '≋';
          cell.style.color = '#60a5fa';
          cell.style.fontSize = '0.7em';
        }

        if (selectedBuilding && cellData.type === 'land' && !cellData.building) {
          cell.classList.add('cell-available');
        }

        cell.onclick = () => game.handleCellClick(x, y);
        grid.appendChild(cell);
      }
    }
  },

  getRoadNeighbors(x, y) {
    const h = (x > 0 && state.map[y][x-1].type === 'road') || (x < CONFIG.GRID_SIZE-1 && state.map[y][x+1].type === 'road');
    const v = (y > 0 && state.map[y-1][x].type === 'road') || (y < CONFIG.GRID_SIZE-1 && state.map[y+1][x].type === 'road');
    return { h, v };
  },

  updateStats() {
    document.getElementById('dayBadge').textContent = `📅 День ${state.day}/${CONFIG.MAX_DAYS}`;
    document.getElementById('statMoney').textContent = formatMoney(state.money);
    document.getElementById('statPop').textContent = formatNumber(state.population);
    document.getElementById('statHappy').textContent = Math.round(state.happiness) + '%';
    document.getElementById('statPower').textContent = Math.round(state.power) + '%';
    document.getElementById('statWater').textContent = Math.round(state.water) + '%';
    document.getElementById('statHealth').textContent = Math.round(state.health) + '%';
    document.getElementById('statSafety').textContent = Math.round(state.safety) + '%';
    document.getElementById('statBuildings').textContent = state.buildings.length;
  },

  showNotification(title, text) {
    const notif = document.getElementById('notification');
    document.getElementById('notificationTitle').textContent = title;
    document.getElementById('notificationText').textContent = text;
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 3000);
  },

  showAchievement(id) {
    const ach = ACHIEVEMENTS[id];
    const toast = document.getElementById('achievementToast');
    document.getElementById('achievementText').textContent = `🏆 ${ach.name}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
    this.showNotification('Достижение разблокировано!', ach.name);
  },

  showDayTransition(oldDay, newDay, callback) {
    const trans = document.getElementById('dayTransition');
    document.getElementById('transitionOld').textContent = `День ${oldDay}`;
    document.getElementById('transitionNew').textContent = `День ${newDay}`;
    trans.classList.add('active');

    setTimeout(() => {
      trans.classList.remove('active');
      if (callback) callback();
    }, 1200);
  },

  showEvent(event, callback) {
    this.showOverlay('eventOverlay');
    document.getElementById('eventIcon').textContent = event.icon;
    document.getElementById('eventTitle').textContent = event.title;
    document.getElementById('eventDesc').textContent = event.desc;

    const buttonsDiv = document.getElementById('eventButtons');
    buttonsDiv.innerHTML = '';

    event.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-secondary';
      btn.style.flex = '1';
      btn.textContent = opt.text;
      btn.onclick = () => {
        this.hideOverlay('eventOverlay');
        callback(opt);
      };
      buttonsDiv.appendChild(btn);
    });
  },

  showEconomyReport(report) {
    const reportDiv = document.getElementById('economyReport');
    reportDiv.innerHTML = `
      <div class="economy-row">
        <span>📈 Налоги</span>
        <span class="economy-income">+$${report.taxIncome.toLocaleString()}</span>
      </div>
      <div class="economy-row">
        <span>🏭 Прибыль заводов</span>
        <span class="economy-income">+$${report.factoryIncome.toLocaleString()}</span>
      </div>
      <div class="economy-row">
        <span>🏗️ Содержание зданий</span>
        <span class="economy-expense">-$${report.upkeep.toLocaleString()}</span>
      </div>
      <div class="economy-row">
        <span>⚡ Электричество</span>
        <span class="economy-expense">-$${report.powerCost.toLocaleString()}</span>
      </div>
      <div class="economy-row">
        <span>💧 Вода</span>
        <span class="economy-expense">-$${report.waterCost.toLocaleString()}</span>
      </div>
      <div class="economy-row">
        <span>📊 Итого</span>
        <span class="economy-balance">${report.total >= 0 ? '+' : ''}$${report.total.toLocaleString()}</span>
      </div>
    `;
    this.showOverlay('economyOverlay');
  },

  showEndGame() {
    const score = game.calculateScore();
    let rank, rankText, rankClass;

    if (score >= 90) { rank = 'S'; rankText = 'Легендарный мэр'; rankClass = 'rank-s'; }
    else if (score >= 75) { rank = 'A'; rankText = 'Отличный мэр'; rankClass = 'rank-a'; }
    else if (score >= 60) { rank = 'B'; rankText = 'Хороший мэр'; rankClass = 'rank-b'; }
    else if (score >= 45) { rank = 'C'; rankText = 'Город выжил'; rankClass = 'rank-c'; }
    else if (score >= 30) { rank = 'D'; rankText = 'Город в кризисе'; rankClass = 'rank-d'; }
    else { rank = 'F'; rankText = 'Катастрофа'; rankClass = 'rank-f'; }

    document.getElementById('endRank').textContent = rank;
    document.getElementById('endRank').className = 'end-rank ' + rankClass;
    document.getElementById('endRankText').textContent = rankText;

    document.getElementById('endStats').innerHTML = `
      <div class="end-stat"><div class="end-stat-value">${formatNumber(state.population)}</div><div class="end-stat-label">Население</div></div>
      <div class="end-stat"><div class="end-stat-value">$${formatMoney(state.money)}</div><div class="end-stat-label">Бюджет</div></div>
      <div class="end-stat"><div class="end-stat-value">${Math.round(state.happiness)}%</div><div class="end-stat-label">Счастье</div></div>
      <div class="end-stat"><div class="end-stat-value">${Math.round(state.health)}%</div><div class="end-stat-label">Здоровье</div></div>
      <div class="end-stat"><div class="end-stat-value">${Math.round(state.safety)}%</div><div class="end-stat-label">Безопасность</div></div>
      <div class="end-stat"><div class="end-stat-value">${state.buildings.length}</div><div class="end-stat-label">Здания</div></div>
    `;

    this.showOverlay('endGameOverlay');
  },

  generateCityBg() {
    const bg = document.getElementById('cityBg');
    bg.innerHTML = '';
    const widths = [8, 12, 6, 15, 10, 7, 13, 9, 11, 5, 14, 8];
    const heights = [40, 60, 30, 80, 50, 35, 70, 45, 55, 25, 75, 40];
    let left = 0;

    widths.forEach((w, i) => {
      const b = document.createElement('div');
      b.className = 'building';
      b.style.width = w + '%';
      b.style.height = heights[i] + '%';
      b.style.left = left + '%';
      b.style.animationDelay = (i * 0.3) + 's';

      for (let j = 0; j < 5; j++) {
        const win = document.createElement('div');
        win.className = 'window-light';
        win.style.left = (10 + Math.random() * 70) + '%';
        win.style.top = (10 + Math.random() * 60) + '%';
        win.style.animationDelay = (Math.random() * 2) + 's';
        b.appendChild(win);
      }

      bg.appendChild(b);
      left += w;
    });
  },

  generateStars() {
    const stars = document.getElementById('stars');
    stars.innerHTML = '';
    for (let i = 0; i < 60; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 3 + 's';
      star.style.opacity = 0.3 + Math.random() * 0.7;
      stars.appendChild(star);
    }
  }
};

// ===== GAME LOGIC =====
const game = {
  init() {
    settingsManager.load();
    ui.generateCityBg();
    ui.generateStars();
    ui.updateMainMenu();

    // Check for save on load
    if (localStorage.getItem('mayor_save')) {
      document.getElementById('btnContinue').disabled = false;
    }
  },

  createInitialState() {
    const map = [];
    for (let y = 0; y < CONFIG.GRID_SIZE; y++) {
      map[y] = [];
      for (let x = 0; x < CONFIG.GRID_SIZE; x++) {
        map[y][x] = { type: 'land', building: null };
      }
    }

    // Create river/lake
    for (let y = 2; y < 5; y++) {
      for (let x = 8; x < 11; x++) {
        map[y][x] = { type: 'water', building: null };
      }
    }
    map[1][9] = { type: 'water', building: null };
    map[5][9] = { type: 'water', building: null };

    // Create roads
    const roadY = 6;
    for (let x = 0; x < CONFIG.GRID_SIZE; x++) {
      if (map[roadY][x].type === 'land') {
        map[roadY][x] = { type: 'road', building: null };
      }
    }
    const roadX = 4;
    for (let y = 0; y < CONFIG.GRID_SIZE; y++) {
      if (map[y][roadX].type === 'land') {
        map[y][roadX] = { type: 'road', building: null };
      }
    }

    // Add trees
    const treePositions = [[0,0],[0,1],[1,0],[10,0],[11,0],[11,1],[0,10],[0,11],[1,11],[11,10],[11,11],[10,11],[3,1],[7,2],[2,7],[9,7],[5,10]];
    treePositions.forEach(([x,y]) => {
      if (map[y][x].type === 'land') map[y][x] = { type: 'tree', building: null };
    });

    // Add lamps
    const lampPositions = [[3,6],[7,6],[4,3],[4,9]];
    lampPositions.forEach(([x,y]) => {
      if (map[y][x].type === 'land') map[y][x] = { type: 'lamp', building: null };
    });

    return {
      day: 1,
      money: CONFIG.START_MONEY,
      population: CONFIG.START_POPULATION,
      happiness: CONFIG.START_HAPPINESS,
      health: CONFIG.START_HEALTH,
      safety: CONFIG.START_SAFETY,
      power: CONFIG.START_POWER,
      water: CONFIG.START_WATER,
      map: map,
      buildings: [],
      achievements: [],
      eventCooldown: 0,
      gameOver: false
    };
  },

  startNewGame() {
    state = this.createInitialState();
    ui.hideOverlay('confirmNewGame');
    ui.showScreen('gameScreen');
    ui.closeBuildPanel();
    ui.renderCity();
    ui.updateStats();
    this.saveGame();
    ui.showNotification('Новая игра начата!', 'Удачи, мэр!');
  },

  continueGame() {
    if (this.loadGame()) {
      ui.showScreen('gameScreen');
      ui.closeBuildPanel();
      ui.renderCity();
      ui.updateStats();
      ui.showNotification('Игра загружена', `День ${state.day}`);
    }
  },

  handleCellClick(x, y) {
    if (!selectedBuilding) return;
    if (state.gameOver) return;

    const cell = state.map[y][x];
    if (cell.type !== 'land' || cell.building) {
      vibrate(30);
      return;
    }

    const building = BUILDINGS[selectedBuilding];
    if (state.money < building.price) {
      ui.showNotification('Недостаточно средств', `Нужно $${building.price.toLocaleString()}`);
      return;
    }

    // Build
    state.money -= building.price;
    cell.building = selectedBuilding;
    state.buildings.push({ type: selectedBuilding, x, y });

    vibrate(50);
    ui.showNotification('Здание построено!', building.name);

    // Recalculate population immediately for houses
    if (selectedBuilding === 'house') {
      state.population += building.population;
    }

    selectedBuilding = null;
    ui.closeBuildPanel();
    ui.renderCity();
    ui.updateStats();
    this.checkAchievements();
    this.saveGame();
  },

  nextDay() {
    if (state.gameOver) return;
    if (state.day >= CONFIG.MAX_DAYS) {
      this.endGame();
      return;
    }

    const oldDay = state.day;
    state.day++;

    ui.showDayTransition(oldDay, state.day, () => {
      this.processDay();
    });
  },

  processDay() {
    // Calculate economy
    const report = this.calculateEconomy();
    state.money += report.total;

    // Calculate resources
    const powerData = this.calculatePower();
    const waterData = this.calculateWater();
    state.power = powerData.percent;
    state.water = waterData.percent;

    // Population growth/decline based on conditions
    let popChange = 0;
    if (state.happiness > 70 && state.health > 60 && state.power > 50 && state.water > 50) {
      popChange = Math.floor(state.population * 0.02);
    } else if (state.happiness < 40 || state.health < 40 || state.power < 20 || state.water < 20) {
      popChange = -Math.floor(state.population * 0.03);
    }
    state.population = Math.max(100, state.population + popChange);

    // Happiness changes
    let happyChange = 0;
    if (state.power < 30) happyChange -= 3;
    if (state.water < 30) happyChange -= 3;
    if (state.health < 50) happyChange -= 2;
    if (state.safety < 50) happyChange -= 2;
    if (state.money < 0) happyChange -= 5;

    // Building effects on happiness
    state.buildings.forEach(b => {
      const bd = BUILDINGS[b.type];
      happyChange += (bd.happiness || 0) * 0.05;
    });

    state.happiness = clamp(state.happiness + happyChange, 0, 100);

    // Health changes
    let healthChange = 0;
    if (state.water < 30) healthChange -= 2;
    if (state.power < 30) healthChange -= 1;
    state.buildings.forEach(b => {
      const bd = BUILDINGS[b.type];
      healthChange += (bd.health || 0) * 0.03;
    });
    state.health = clamp(state.health + healthChange, 0, 100);

    // Safety changes
    let safetyChange = 0;
    state.buildings.forEach(b => {
      const bd = BUILDINGS[b.type];
      safetyChange += (bd.safety || 0) * 0.03;
    });
    if (state.population > 10000 && state.buildings.filter(b => b.type === 'police').length < 2) {
      safetyChange -= 1;
    }
    state.safety = clamp(state.safety + safetyChange, 0, 100);

    // Random event
    if (state.eventCooldown > 0) state.eventCooldown--;

    const eventChance = 0.25;
    if (Math.random() < eventChance && state.eventCooldown === 0) {
      this.triggerEvent(() => {
        ui.showEconomyReport(report);
        ui.updateStats();
        this.checkAchievements();
        this.saveGame();

        if (state.day >= CONFIG.MAX_DAYS) {
          setTimeout(() => this.endGame(), 500);
        }
      });
    } else {
      ui.showEconomyReport(report);
      ui.updateStats();
      this.checkAchievements();
      this.saveGame();

      if (state.day >= CONFIG.MAX_DAYS) {
        setTimeout(() => this.endGame(), 500);
      }
    }
  },

  calculateEconomy() {
    const houses = state.buildings.filter(b => b.type === 'house').length;
    const factories = state.buildings.filter(b => b.type === 'factory').length;

    const taxIncome = Math.floor(state.population * 0.5);
    const factoryIncome = factories * 1500;

    let upkeep = 0;
    let powerCost = 0;
    let waterCost = 0;

    state.buildings.forEach(b => {
      const bd = BUILDINGS[b.type];
      upkeep += bd.upkeep || 0;
    });

    const powerUsed = this.calculatePower().used;
    const waterUsed = this.calculateWater().used;
    powerCost = Math.floor(powerUsed * 10);
    waterCost = Math.floor(waterUsed * 8);

    const total = taxIncome + factoryIncome - upkeep - powerCost - waterCost;

    return { taxIncome, factoryIncome, upkeep, powerCost, waterCost, total };
  },

  calculatePower() {
    let generated = 100; // Base
    let used = 0;

    state.buildings.forEach(b => {
      const bd = BUILDINGS[b.type];
      generated += bd.powerGen || 0;
      used += bd.powerUse || 0;
    });

    const percent = Math.min(100, Math.max(0, Math.round((generated / Math.max(used, 1)) * 100)));
    return { generated, used, percent: Math.min(100, percent) };
  },

  calculateWater() {
    let generated = 100; // Base
    let used = 0;

    state.buildings.forEach(b => {
      const bd = BUILDINGS[b.type];
      generated += bd.waterGen || 0;
      used += bd.waterUse || 0;
    });

    const percent = Math.min(100, Math.max(0, Math.round((generated / Math.max(used, 1)) * 100)));
    return { generated, used, percent: Math.min(100, percent) };
  },

  triggerEvent(callback) {
    const availableEvents = EVENTS.filter(e => !e.condition || e.condition(state));
    if (availableEvents.length === 0) {
      callback();
      return;
    }

    const event = availableEvents[randInt(0, availableEvents.length - 1)];
    state.eventCooldown = 2; // Cooldown for 2 days

    ui.showEvent(event, (option) => {
      if (option.money) state.money += option.money;
      if (option.happiness) state.happiness = clamp(state.happiness + option.happiness, 0, 100);
      if (option.health) state.health = clamp(state.health + option.health, 0, 100);
      if (option.safety) state.safety = clamp(state.safety + option.safety, 0, 100);
      if (option.power) state.power = clamp(state.power + option.power, 0, 100);
      if (option.water) state.water = clamp(state.water + option.water, 0, 100);
      if (option.population) state.population = Math.max(100, state.population + option.population);

      if (option.addBuilding) {
        // Find free spot
        for (let y = 0; y < CONFIG.GRID_SIZE; y++) {
          for (let x = 0; x < CONFIG.GRID_SIZE; x++) {
            if (state.map[y][x].type === 'land' && !state.map[y][x].building) {
              state.map[y][x].building = option.addBuilding;
              state.buildings.push({ type: option.addBuilding, x, y });
              y = CONFIG.GRID_SIZE;
              break;
            }
          }
        }
      }

      ui.renderCity();
      callback();
    });
  },

  checkAchievements() {
    Object.values(ACHIEVEMENTS).forEach(ach => {
      if (!state.achievements.includes(ach.id) && ach.condition(state)) {
        state.achievements.push(ach.id);
        ui.showAchievement(ach.id);
      }
    });
  },

  calculateScore() {
    let score = 0;
    score += Math.min(30, state.population / 1000);
    score += Math.min(20, state.money / 5000);
    score += state.happiness * 0.2;
    score += state.health * 0.1;
    score += state.safety * 0.1;
    score += Math.min(10, state.buildings.length);
    score = Math.min(100, Math.max(0, score));
    return Math.round(score);
  },

  endGame() {
    state.gameOver = true;
    this.checkAchievements();
    this.saveGame();
    ui.showEndGame();
  },

  saveGame() {
    try {
      localStorage.setItem('mayor_save', JSON.stringify(state));
      ui.updateMainMenu();
    } catch (e) {
      console.error('Save failed', e);
    }
  },

  loadGame() {
    try {
      const saved = localStorage.getItem('mayor_save');
      if (saved) {
        state = JSON.parse(saved);
        // Ensure map structure is valid
        if (!state.map || !state.buildings) return false;
        return true;
      }
    } catch (e) {
      console.error('Load failed', e);
    }
    return false;
  },

  deleteSave() {
    localStorage.removeItem('mayor_save');
    ui.hideOverlay('confirmDelete');
    ui.hideOverlay('settingsOverlay');
    ui.updateMainMenu();
    ui.showNotification('Сохранение удалено', 'Ваш прогресс был удалён');
  }
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  game.init();
});


// Alias for HTML onclick handlers
window.settings = settingsManager;
