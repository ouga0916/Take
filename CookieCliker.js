
(function(){
  "use strict";

  /* ---------- ゲームデータ定義 ---------- */
  const PRODUCERS = [
    {id:'grandma',  name:'おばあちゃん',       desc:'昔ながらの製法でコツコツ焼く',       emoji:'👵', baseCost:15,        cps:0.1},
    {id:'oven',     name:'小さなオーブン',     desc:'家庭用オーブンをフル稼働',           emoji:'🔥', baseCost:100,       cps:1},
    {id:'farm',     name:'クッキー農園',       desc:'畑でクッキーの木を育てる',           emoji:'🌾', baseCost:1100,      cps:8},
    {id:'factory',  name:'製菓工場',           desc:'ベルトコンベアで大量生産',           emoji:'🏭', baseCost:12000,     cps:47},
    {id:'mine',     name:'クッキー鉱山',       desc:'地中深くのクッキー鉱脈を採掘',       emoji:'⛏️', baseCost:130000,    cps:260},
    {id:'furnace',  name:'魔法のかまど',       desc:'魔法の炎で絶えず焼き上げる',         emoji:'🪄', baseCost:1400000,   cps:1400},
    {id:'timeoven', name:'時空オーブン',       desc:'時間を歪めて生産速度を加速',         emoji:'🌀', baseCost:20000000,  cps:7800},
    {id:'planet',   name:'クッキー惑星',       desc:'惑星まるごとクッキーに変える',       emoji:'🪐', baseCost:330000000, cps:44000},
  ];

  const UPGRADES = [
    {id:'fingers',    name:'太い指',             desc:'クリックの威力が上がる',           emoji:'👆', cost:50,      type:'add',  value:1},
    {id:'wrist',      name:'鉄の手首',           desc:'さらにクリック力アップ',           emoji:'💪', cost:500,     type:'add',  value:4},
    {id:'rollingpin', name:'黄金の麺棒',         desc:'クリックの威力が2倍になる',        emoji:'🥖', cost:5000,    type:'mult', value:2},
    {id:'gloves',     name:'クッキー手袋',       desc:'握力が大幅アップ',                 emoji:'🧤', cost:50000,   type:'add',  value:25},
    {id:'spatula',    name:'伝説のしゃもじ',     desc:'クリックの威力がさらに2倍になる',  emoji:'🍳', cost:500000,  type:'mult', value:2},
    {id:'gauntlet',   name:'職人のガントレット', desc:'クリック力が大きく上昇',           emoji:'🥊', cost:5000000, type:'add',  value:250},
  ];

  const ACHIEVEMENTS = [
    {id:'a1', name:'はじめの一歩',     desc:'クッキーを100個焼いた',        emoji:'🌱', cond: s => s.totalBaked >= 100},
    {id:'a9', name:'最初の従業員',     desc:'施設をひとつ購入した',         emoji:'🧑‍🍳', cond: s => Object.values(s.producers).some(v => v > 0)},
    {id:'a2', name:'クッキー見習い',   desc:'クッキーを1,000個焼いた',      emoji:'🍪', cond: s => s.totalBaked >= 1000},
    {id:'a7', name:'クリック魔',       desc:'100回クリックした',            emoji:'👆', cond: s => s.totalClicks >= 100},
    {id:'a3', name:'クッキー職人',     desc:'クッキーを1万個焼いた',        emoji:'🎖️', cond: s => s.totalBaked >= 10000},
    {id:'a10', name:'大企業',         desc:'施設を合計50個所有した',       emoji:'🏗️', cond: s => Object.values(s.producers).reduce((a,b)=>a+b,0) >= 50},
    {id:'a8', name:'指が痛い',         desc:'1万回クリックした',            emoji:'🩹', cond: s => s.totalClicks >= 10000},
    {id:'a4', name:'クッキーマスター', desc:'クッキーを100万個焼いた',      emoji:'👑', cond: s => s.totalBaked >= 1000000},
    {id:'a5', name:'クッキー帝国',     desc:'クッキーを1億個焼いた',        emoji:'🏰', cond: s => s.totalBaked >= 100000000},
    {id:'a6', name:'クッキーの神',     desc:'クッキーを1兆個焼いた',        emoji:'✨', cond: s => s.totalBaked >= 1000000000000},
  ];

  const SAVE_KEY = 'cookie-factory-save-v1';

  /* ---------- 状態 ---------- */
  function defaultState(){
    const producers = {}; PRODUCERS.forEach(p => producers[p.id] = 0);
    const upgrades = {}; UPGRADES.forEach(u => upgrades[u.id] = false);
    return {
      cookies: 0,
      totalBaked: 0,
      totalClicks: 0,
      producers,
      upgrades,
      achievements: []
    };
  }
  let state = defaultState();

  /* ---------- ユーティリティ ---------- */
  function formatNumber(n){
    n = Math.floor(n);
    if (n < 10000) return n.toLocaleString('ja-JP');
    const units = [
      {val:1e16, unit:'京'},
      {val:1e12, unit:'兆'},
      {val:1e8,  unit:'億'},
      {val:1e4,  unit:'万'},
    ];
    for (const u of units){
      if (n >= u.val){
        const v = n / u.val;
        return (v >= 100 ? v.toFixed(0) : v.toFixed(2)) + u.unit;
      }
    }
    return n.toLocaleString('ja-JP');
  }

  function producerCost(p){
    const owned = state.producers[p.id];
    return Math.round(p.baseCost * Math.pow(1.15, owned));
  }

  function totalCps(){
    let sum = 0;
    PRODUCERS.forEach(p => { sum += p.cps * state.producers[p.id]; });
    return sum;
  }

  function clickPower(){
    let add = 1, mult = 1;
    UPGRADES.forEach(u => {
      if (state.upgrades[u.id]){
        if (u.type === 'add') add += u.value;
        else mult *= u.value;
      }
    });
    return add * mult;
  }

  function toast(msg){
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('show'), 2200);
  }

  /* ---------- 保存/読み込み（window.storage、失敗時はメモリのみで継続） ---------- */
  let storageAvailable = true;

  async function loadGame(){
    try{
      const result = await window.storage.get(SAVE_KEY, false);
      if (result && result.value){
        const loaded = JSON.parse(result.value);
        const base = defaultState();
        state = Object.assign(base, loaded);
        state.producers = Object.assign(base.producers, loaded.producers || {});
        state.upgrades = Object.assign(base.upgrades, loaded.upgrades || {});
        state.achievements = loaded.achievements || [];
      }
    }catch(e){
      // セーブが存在しない、またはストレージ利用不可 → 新規開始
    }
  }

  async function saveGame(){
    if (!storageAvailable) return;
    try{
      const result = await window.storage.set(SAVE_KEY, JSON.stringify(state), false);
      if (!result) storageAvailable = false;
    }catch(e){
      storageAvailable = false;
    }
  }

  /* ---------- 描画 ---------- */
  function render(){
    document.getElementById('cookieCount').textContent = formatNumber(state.cookies);
    const cps = totalCps();
    document.getElementById('cpsLine').textContent = '毎秒 +' + formatNumber(cps) + ' 個';
    document.getElementById('headerCps').textContent = '毎秒 +' + formatNumber(cps);
    document.getElementById('clickPowerLine').textContent = '1クリックで +' + formatNumber(clickPower());

    renderProducers();
    renderUpgrades();
    renderAchievements();
  }

  function renderProducers(){
    const list = document.getElementById('producersList');
    list.innerHTML = '';
    PRODUCERS.forEach(p => {
      const cost = producerCost(p);
      const owned = state.producers[p.id];
      const can = state.cookies >= cost;
      const div = document.createElement('button');
      div.className = 'item' + (can ? '' : ' disabled') + (owned > 0 ? ' owned-glow' : '');
      div.innerHTML =
        '<div class="item-emoji">' + p.emoji + '</div>' +
        '<div class="item-info">' +
          '<div class="item-name">' + p.name + '</div>' +
          '<div class="item-desc">' + p.desc + '</div>' +
          '<div class="item-sub">1個あたり 毎秒 +' + formatNumber(p.cps) + '</div>' +
        '</div>' +
        '<div class="item-right">' +
          '<div class="item-cost">🍪 ' + formatNumber(cost) + '</div>' +
          '<div class="item-count">所持: ' + owned + '</div>' +
        '</div>';
      div.disabled = !can;
      div.addEventListener('click', () => buyProducer(p));
      list.appendChild(div);
    });
  }

  function renderUpgrades(){
    const list = document.getElementById('upgradesList');
    list.innerHTML = '';
    const remaining = UPGRADES.filter(u => !state.upgrades[u.id]);
    if (remaining.length === 0){
      list.innerHTML = '<div class="empty-note">すべてのクリック強化を購入しました！</div>';
    }
    remaining.forEach(u => {
      const can = state.cookies >= u.cost;
      const div = document.createElement('button');
      div.className = 'item' + (can ? '' : ' disabled');
      const effect = u.type === 'add' ? ('クリック力 +' + u.value) : ('クリック力 ×' + u.value);
      div.innerHTML =
        '<div class="item-emoji">' + u.emoji + '</div>' +
        '<div class="item-info">' +
          '<div class="item-name">' + u.name + '</div>' +
          '<div class="item-desc">' + u.desc + '</div>' +
          '<div class="item-sub">' + effect + '</div>' +
        '</div>' +
        '<div class="item-right">' +
          '<div class="item-cost">🍪 ' + formatNumber(u.cost) + '</div>' +
        '</div>';
      div.disabled = !can;
      div.addEventListener('click', () => buyUpgrade(u));
      list.appendChild(div);
    });
  }

  function renderAchievements(){
    const list = document.getElementById('achievementsList');
    list.innerHTML = '';
    ACHIEVEMENTS.forEach(a => {
      const unlocked = state.achievements.includes(a.id);
      const div = document.createElement('div');
      div.className = 'ach-item ' + (unlocked ? 'unlocked' : 'locked');
      div.innerHTML =
        '<div class="ach-emoji">' + (unlocked ? a.emoji : '❔') + '</div>' +
        '<div>' +
          '<div class="ach-name">' + (unlocked ? a.name : '？？？') + '</div>' +
          '<div class="ach-desc">' + (unlocked ? a.desc : '条件を満たすと解除') + '</div>' +
        '</div>';
      list.appendChild(div);
    });
  }

  /* ---------- 操作 ---------- */
  function addCookies(n){
    state.cookies += n;
    state.totalBaked += n;
  }

  function handleClick(evt){
    const power = clickPower();
    addCookies(power);
    state.totalClicks += 1;
    spawnFloatNum(power, evt);
    checkAchievements();
    render();
  }

  function spawnFloatNum(power, evt){
    const wrap = document.getElementById('cookieWrap');
    const rect = wrap.getBoundingClientRect();
    let x = rect.width / 2, y = 10;
    if (evt && evt.clientX !== undefined){
      x = evt.clientX - rect.left;
      y = evt.clientY - rect.top;
    } else if (evt && evt.changedTouches && evt.changedTouches[0]){
      x = evt.changedTouches[0].clientX - rect.left;
      y = evt.changedTouches[0].clientY - rect.top;
    }
    const span = document.createElement('span');
    span.className = 'float-num';
    span.style.left = x + 'px';
    span.style.top = y + 'px';
    span.textContent = '+' + formatNumber(power);
    wrap.appendChild(span);
    setTimeout(() => span.remove(), 950);
  }

  function buyProducer(p){
    const cost = producerCost(p);
    if (state.cookies < cost) return;
    state.cookies -= cost;
    state.producers[p.id] += 1;
    checkAchievements();
    render();
  }

  function buyUpgrade(u){
    if (state.cookies < u.cost || state.upgrades[u.id]) return;
    state.cookies -= u.cost;
    state.upgrades[u.id] = true;
    checkAchievements();
    render();
  }

  function checkAchievements(){
    ACHIEVEMENTS.forEach(a => {
      if (!state.achievements.includes(a.id) && a.cond(state)){
        state.achievements.push(a.id);
        toast('🏆 実績解除: ' + a.name);
      }
    });
  }

  /* ---------- タブ切り替え ---------- */
  function setupTabs(){
    const buttons = document.querySelectorAll('.tab-btn');
    const panels = {
      producers: document.getElementById('producersList'),
      upgrades: document.getElementById('upgradesList'),
      achievements: document.getElementById('achievementsList'),
    };
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Object.keys(panels).forEach(key => {
          panels[key].style.display = (key === btn.dataset.tab) ? 'flex' : 'none';
        });
      });
    });
  }

  /* ---------- リセット ---------- */
  function setupReset(){
    document.getElementById('resetBtn').addEventListener('click', async () => {
      if (!confirm('本当に最初からやり直しますか？この操作は取り消せません。')) return;
      state = defaultState();
      await saveGame();
      render();
      toast('工房をリセットしました');
    });
  }

  /* ---------- ゲームループ ---------- */
  function startLoop(){
    let last = performance.now();
    setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      const cps = totalCps();
      if (cps > 0){
        addCookies(cps * dt);
        checkAchievements();
        render();
      }
    }, 200);

    setInterval(saveGame, 8000);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') saveGame();
    });
  }

  /* ---------- 起動 ---------- */
  async function init(){
    await loadGame();
    render();
    document.getElementById('cookieBtn').addEventListener('click', handleClick);
    setupTabs();
    setupReset();
    startLoop();
  }

  init();
})();