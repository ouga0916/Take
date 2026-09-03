  "use strict";

  /* ---------- ゲームデータ定義 ---------- */
  const PRODUCERS = [
    {id:'cursor',   name:'カーソル',           desc:'自動でクッキーをクリックし続ける',   emoji:'🖱️', baseCost:10,        cps:0.1},
    {id:'grandma',  name:'おばあちゃん',       desc:'昔ながらの製法でコツコツ焼く',       emoji:'👵', baseCost:15,        cps:0.5},
    {id:'oven',     name:'小さなオーブン',     desc:'家庭用オーブンをフル稼働',           emoji:'🔥', baseCost:100,       cps:5},
    {id:'farm',     name:'クッキー農園',       desc:'畑でクッキーの木を育てる',           emoji:'🌾', baseCost:1100,      cps:50},
    {id:'factory',  name:'製菓工場',           desc:'ベルトコンベアで大量生産',           emoji:'🏭', baseCost:12000,     cps:650},
    {id:'mine',     name:'クッキー鉱山',       desc:'地中深くのクッキー鉱脈を採掘',       emoji:'⛏️', baseCost:130000,    cps:8500},
    {id:'furnace',  name:'魔法のかまど',       desc:'魔法の炎で絶えず焼き上げる',         emoji:'🪄', baseCost:1400000,   cps:110000},
    {id:'timeoven', name:'時空オーブン',       desc:'時間を歪めて生産速度を加速',         emoji:'🌀', baseCost:20000000,  cps:1400000},
    {id:'planet',   name:'クッキー惑星',       desc:'惑星まるごとクッキーに変える',       emoji:'🪐', baseCost:330000000,           cps:18000000},
    {id:'galaxy',   name:'クッキー銀河',       desc:'銀河系そのものを生地に変換する',     emoji:'🌌', baseCost:5100000000,          cps:230000000},
    {id:'blackhole',name:'ブラックホール炉',   desc:'重力でクッキー粒子を圧縮生成する',   emoji:'🕳️', baseCost:75000000000,         cps:3000000000},
    {id:'multiverse',name:'並行宇宙ベーカリー',desc:'無数の並行世界で同時に焼き上げる',   emoji:'🌀', baseCost:1000000000000,       cps:39000000000},
    {id:'godoven',  name:'創造神のかまど',     desc:'万物創造のエネルギーで生成する',     emoji:'🕊️', baseCost:14000000000000,      cps:500000000000},
    {id:'singularity',name:'クッキー特異点',   desc:'時空の彼方から無限に湧き出る',       emoji:'🌠', baseCost:170000000000000,     cps:6500000000000},
    {id:'infinity', name:'無限次元ファクトリー',desc:'あらゆる次元で並列生産する究極施設', emoji:'💫', baseCost:2100000000000000,    cps:85000000000000},
  ];

  const UPGRADES = [
    {id:'fingers',    name:'太い指',             desc:'クリックの威力が上がる',           emoji:'👆', cost:50,      type:'add',  value:1},
    {id:'wrist',      name:'鉄の手首',           desc:'さらにクリック力アップ',           emoji:'💪', cost:500,     type:'add',  value:4},
    {id:'rollingpin', name:'黄金の麺棒',         desc:'クリックの威力が2倍になる',        emoji:'🥖', cost:5000,    type:'mult', value:2},
    {id:'gloves',     name:'クッキー手袋',       desc:'握力が大幅アップ',                 emoji:'🧤', cost:50000,   type:'add',  value:25},
    {id:'spatula',    name:'伝説のしゃもじ',     desc:'クリックの威力がさらに2倍になる',  emoji:'🍳', cost:500000,  type:'mult', value:2},
    {id:'gauntlet',   name:'職人のガントレット', desc:'クリック力が大きく上昇',           emoji:'🥊', cost:5000000,        type:'add',  value:250},
    {id:'clickstorm', name:'クリック嵐',         desc:'クリックの威力がさらに2倍になる',  emoji:'🌪️', cost:50000000,       type:'mult', value:2},
    {id:'titanfinger',name:'巨人の指',           desc:'クリック力が大幅上昇',             emoji:'🦾', cost:500000000,      type:'add',  value:2500},
    {id:'cosmicclick',name:'宇宙のひとクリック', desc:'クリックの威力が2倍になる',        emoji:'🌟', cost:5000000000,     type:'mult', value:2},
    {id:'godhand',    name:'神の一手',           desc:'クリック力が大幅上昇',             emoji:'🤲', cost:50000000000,    type:'add',  value:25000},
    {id:'realityclick',name:'現実改変クリック',  desc:'クリックの威力が3倍になる',        emoji:'🔮', cost:500000000000,   type:'mult', value:3},
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
    {id:'a6', name:'クッキーの神',     desc:'クッキーを1T個焼いた',         emoji:'✨', cond: s => s.totalBaked >= 1000000000000},
    {id:'a11', name:'創造の化身',      desc:'クッキーを1Qa個焼いた',        emoji:'🌌', cond: s => s.totalBaked >= 1000000000000000},
    {id:'a12', name:'宇宙の支配者',    desc:'クッキーを1Qi個焼いた',        emoji:'👁️', cond: s => s.totalBaked >= 1000000000000000000},
    {id:'a13', name:'クリックの鬼',    desc:'10万回クリックした',           emoji:'🔥', cond: s => s.totalClicks >= 100000},
    {id:'a14', name:'施設王',         desc:'施設を合計100個所有した',      emoji:'🏯', cond: s => Object.values(s.producers).reduce((a,b)=>a+b,0) >= 100},
    {id:'a15', name:'施設帝国',       desc:'施設を合計200個所有した',      emoji:'🏛️', cond: s => Object.values(s.producers).reduce((a,b)=>a+b,0) >= 200},
    {id:'a16', name:'初めての転生',    desc:'初めて転生した',               emoji:'👼', cond: s => s.lifetimePrestigePoints >= 1},
    {id:'a17', name:'天使の軍団',      desc:'天使のクッキーを累計100個獲得', emoji:'😇', cond: s => s.lifetimePrestigePoints >= 100},
    {id:'a18', name:'転生の覇者',      desc:'天使のクッキーを累計1000個獲得',emoji:'🌟', cond: s => s.lifetimePrestigePoints >= 1000},
  ];

  const PRESTIGE_UPGRADES = [
    {id:'p1', name:'天使の祝福',     desc:'総生産量が永久に+5%',       emoji:'👼', cost:1,  effect:'production', mult:1.05},
    {id:'p2', name:'守護者の指先',   desc:'クリック力が永久に+25%',    emoji:'✨', cost:2,  effect:'click',      mult:1.25},
    {id:'p3', name:'黄金のレシピ',   desc:'総生産量が永久に+10%',      emoji:'📜', cost:5,  effect:'production', mult:1.10},
    {id:'p4', name:'天空の麦畑',     desc:'総生産量が永久に+15%',      emoji:'🌾', cost:15, effect:'production', mult:1.15},
    {id:'p5', name:'創造神の一撃',   desc:'クリック力が永久に+50%',    emoji:'⚡', cost:25, effect:'click',      mult:1.5},
    {id:'p6', name:'無限のかまど',   desc:'総生産量が永久に+25%',      emoji:'♾️', cost:60,   effect:'production', mult:1.25},
    {id:'p7', name:'次元の触媒',     desc:'総生産量が永久に+30%',      emoji:'🧪', cost:150,  effect:'production', mult:1.30},
    {id:'p8', name:'永劫の一撃',     desc:'クリック力が永久に+75%',    emoji:'💥', cost:300,  effect:'click',      mult:1.75},
    {id:'p9', name:'次元の炉心',     desc:'総生産量が永久に+50%',      emoji:'🔥', cost:700,  effect:'production', mult:1.50},
    {id:'p10', name:'万物のレシピ',  desc:'総生産量が永久に+75%',      emoji:'📖', cost:1500, effect:'production', mult:1.75},
    {id:'p11', name:'神域の一撃',    desc:'クリック力が永久に+150%',   emoji:'👑', cost:3000, effect:'click',      mult:2.5},
    {id:'p12', name:'究極の加護',    desc:'総生産量が永久に+100%',     emoji:'🌠', cost:6000, effect:'production', mult:2.0},
  ];

  const STOCKS = [
    {id:'wheat',    name:'小麦先物',         emoji:'🌾', basePrice:50,   volatility:0.12},
    {id:'choco',    name:'ミルクチョコ社',   emoji:'🍫', basePrice:200,  volatility:0.18},
    {id:'nut',      name:'ナッツ農園',       emoji:'🥜', basePrice:800,  volatility:0.22},
    {id:'holdings', name:'クッキー製菓HD',   emoji:'📈', basePrice:3000, volatility:0.28},
  ];

  const PET_STAGES = [
    {min:0,   emoji:'🥚', name:'クッキーの卵'},
    {min:5,   emoji:'🐣', name:'ふしぎな生き物'},
    {min:20,  emoji:'🐥', name:'クッキーひな'},
    {min:50,  emoji:'🐤', name:'クッキー鳥'},
    {min:100, emoji:'🦜', name:'伝説の使い魔'},
    {min:300, emoji:'🐉', name:'クッキードラゴン'},
  ];


  /* ---------- 状態 ---------- */
  function defaultState(){
    const producers = {}; PRODUCERS.forEach(p => producers[p.id] = 0);
    const upgrades = {}; UPGRADES.forEach(u => upgrades[u.id] = false);
    const prestigeUpgrades = {}; PRESTIGE_UPGRADES.forEach(u => prestigeUpgrades[u.id] = false);
    const stocks = {}; STOCKS.forEach(s => stocks[s.id] = {shares:0, price:s.basePrice});
    return {
      cookies: 0,
      totalBaked: 0,
      totalClicks: 0,
      producers,
      upgrades,
      achievements: [],
      prestigePoints: 0,
      lifetimePrestigePoints: 0,
      prestigeClaimed: 0,
      prestigeUpgrades,
      stocks,
      pet: {fed: 0}
    };
  }
  let state = defaultState();

  /* ---------- 転生（プレステージ）計算 ---------- */
  function prestigeFormulaValue(totalBaked){
    return Math.floor(Math.cbrt(totalBaked / 1000000));
  }
  function prestigeGainAvailable(){
    return Math.max(0, prestigeFormulaValue(state.totalBaked) - state.prestigeClaimed);
  }
  function prestigeProductionMult(){
    let mult = 1 + state.lifetimePrestigePoints * 0.01;
    PRESTIGE_UPGRADES.forEach(u => {
      if (state.prestigeUpgrades[u.id] && u.effect === 'production') mult *= u.mult;
    });
    return mult;
  }
  function prestigeClickMult(){
    let mult = 1;
    PRESTIGE_UPGRADES.forEach(u => {
      if (state.prestigeUpgrades[u.id] && u.effect === 'click') mult *= u.mult;
    });
    return mult;
  }

  /* ---------- 生物育成（ペット） ---------- */
  function petLevel(){
    return Math.floor(Math.sqrt((state.pet.fed || 0) / 100));
  }
  function petStage(){
    const level = petLevel();
    let stage = PET_STAGES[0];
    PET_STAGES.forEach(st => { if (level >= st.min) stage = st; });
    return stage;
  }
  function petBonusMult(){
    return 1 + petLevel() * 0.02;
  }

  /* ---------- ユーティリティ ---------- */
  function formatNumber(n){
    n = Math.floor(n);
    if (n < 1000) return n.toLocaleString('en-US');
    const units = [
      {val:1e33, unit:'Dc'},
      {val:1e30, unit:'No'},
      {val:1e27, unit:'Oc'},
      {val:1e24, unit:'Sp'},
      {val:1e21, unit:'Sx'},
      {val:1e18, unit:'Qi'},
      {val:1e15, unit:'Qa'},
      {val:1e12, unit:'T'},
      {val:1e9,  unit:'B'},
      {val:1e6,  unit:'M'},
      {val:1e3,  unit:'K'},
    ];
    for (const u of units){
      if (n >= u.val){
        const v = n / u.val;
        return (v >= 100 ? v.toFixed(0) : v.toFixed(2)) + u.unit;
      }
    }
    return n.toLocaleString('en-US');
  }

  function formatCps(n){
    if (n < 100){
      return n.toLocaleString('ja-JP', {minimumFractionDigits:1, maximumFractionDigits:2});
    }
    return formatNumber(n);
  }

  function producerCostAt(p, ownedCount){
    return Math.round(p.baseCost * Math.pow(1.15, ownedCount));
  }
  function producerCost(p){
    return producerCostAt(p, state.producers[p.id]);
  }
  function producerSellValue(p){
    const owned = state.producers[p.id];
    if (owned <= 0) return 0;
    return Math.floor(producerCostAt(p, owned - 1) * 0.5);
  }

  function totalCps(){
    let sum = 0;
    PRODUCERS.forEach(p => { sum += p.cps * state.producers[p.id]; });
    return sum * prestigeProductionMult() * petBonusMult();
  }

  function clickPower(){
    let add = 1, mult = 1;
    UPGRADES.forEach(u => {
      if (state.upgrades[u.id]){
        if (u.type === 'add') add += u.value;
        else mult *= u.value;
      }
    });
    return add * mult * prestigeClickMult();
  }

  function toast(msg){
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('show'), 2200);
  }

  /* ---------- 保存/読み込み ----------
     Claudeの環境内では window.storage（アカウント連携の保存領域）を使い、
     ファイルを直接ブラウザで開いた場合は localStorage（この端末への保存）にフォールバックする。 */

  //localStorage.removeItem("datesList");
  let dateList = JSON.parse(localStorage.getItem("dateList")  || "[]");
  console.log(dateList);
  //ボタン処理
  const slBtn = document.getElementById("slBtn");

  slBtn.addEventListener("click",() => {
    
    //オーバーレイ処理
    const overlay = document.getElementById("overLay");

    overlay.style.display = "flex";
  });

  document.getElementById("olCrose").addEventListener("click",() => {
    const overlay = document.getElementById("overLay");

    overlay.style.display = "none";
  })

  //セーブ・ロード処理
  const dataTxt = document.getElementById("dn");



  function mergeLoadedState(loaded){
    const base = defaultState();
    state = Object.assign(base, loaded, {
      producers: Object.assign({}, base.producers, loaded.producers || {}),
      upgrades: Object.assign({}, base.upgrades, loaded.upgrades || {}),
      prestigeUpgrades: Object.assign({}, base.prestigeUpgrades, loaded.prestigeUpgrades || {}),
      stocks: Object.assign({}, base.stocks, loaded.stocks || {}),
      pet: Object.assign({}, base.pet, loaded.pet || {}),
      achievements: loaded.achievements || []
    });
  }

  async function loadGame(name){
    try{
      let raw = null;

        raw = localStorage.getItem(name);

      if (raw){
        mergeLoadedState(JSON.parse(raw));
      }
    }catch(e){
      alert("データがありませんでした。");
    }
  }

  async function saveGame(name){
    const raw = JSON.stringify(state);
    try{
        localStorage.setItem(name, raw);
    }catch(e){
      // プライベートブラウジング等で端末保存できない場合は諦める
    }
  }

  /* ---------- 描画 ---------- */
  function render(){
    document.getElementById('cookieCount').textContent = formatNumber(state.cookies);
    const cps = totalCps();
    document.getElementById('cpsLine').textContent = '毎秒 +' + formatCps(cps) + ' 個';
    document.getElementById('headerCps').textContent = '毎秒 +' + formatCps(cps);
    document.getElementById('clickPowerLine').textContent = '1クリックで +' + formatNumber(clickPower());
    document.getElementById('headerPrestige').textContent = '👼 ' + formatNumber(state.prestigePoints);

    renderProducers();
    renderUpgrades();
    renderAchievements();
    renderPrestige();
    renderStocks();
    renderPet();
  }

  function renderProducers(){
    const list = document.getElementById('producersList');
    list.innerHTML = '';
    PRODUCERS.forEach(p => {
      const cost = producerCost(p);
      const owned = state.producers[p.id];
      const canBuy = state.cookies >= cost;
      const sellValue = producerSellValue(p);
      const canSell = owned > 0;

      const div = document.createElement('div');
      div.className = 'item' + (owned > 0 ? ' owned-glow' : '');
      div.style.cursor = 'default';
      div.innerHTML =
        '<div class="item-emoji">' + p.emoji + '</div>' +
        '<div class="item-info">' +
          '<div class="item-name">' + p.name + '</div>' +
          '<div class="item-desc">' + p.desc + '</div>' +
          '<div class="item-sub">1個あたり 毎秒 +' + formatCps(p.cps) + '　所持: ' + owned + '</div>' +
        '</div>' +
        '<div class="item-buttons">' +
          '<button class="buy-btn" ' + (canBuy ? '' : 'disabled') + '>🍪 ' + formatNumber(cost) + '</button>' +
          '<button class="sell-btn" ' + (canSell ? '' : 'disabled') + '>売却 +' + formatNumber(sellValue) + '</button>' +
        '</div>';
      div.querySelector('.buy-btn').addEventListener('click', () => buyProducer(p));
      div.querySelector('.sell-btn').addEventListener('click', () => sellProducer(p));
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

  function renderPrestige(){
    const gain = prestigeGainAvailable();
    const bonusPct = Math.round(state.lifetimePrestigePoints * 100) / 100;
    document.getElementById('prestigePointsLine').textContent = formatNumber(state.prestigePoints) + ' 天使のクッキー';
    document.getElementById('prestigeBonusLine').textContent = '総生産量 永久+' + bonusPct + '%';
    document.getElementById('prestigeGainLine').textContent =
      gain > 0
        ? '今転生すると +' + formatNumber(gain) + ' 個の天使のクッキーを獲得できます'
        : 'もっとクッキーを焼くと転生できるようになります（総生産量が目安）';
    const btn = document.getElementById('prestigeBtn');
    btn.disabled = gain <= 0;

    const list = document.getElementById('prestigeUpgradesList');
    list.innerHTML = '';
    const remaining = PRESTIGE_UPGRADES.filter(u => !state.prestigeUpgrades[u.id]);
    if (remaining.length === 0){
      list.innerHTML = '<div class="empty-note">すべての転生強化を購入しました！</div>';
    }
    remaining.forEach(u => {
      const can = state.prestigePoints >= u.cost;
      const div = document.createElement('button');
      div.className = 'item' + (can ? '' : ' disabled');
      const effect = u.effect === 'production' ? ('総生産量 +' + Math.round((u.mult - 1) * 100) + '%') : ('クリック力 +' + Math.round((u.mult - 1) * 100) + '%');
      div.innerHTML =
        '<div class="item-emoji">' + u.emoji + '</div>' +
        '<div class="item-info">' +
          '<div class="item-name">' + u.name + '</div>' +
          '<div class="item-desc">' + u.desc + '</div>' +
          '<div class="item-sub">' + effect + '</div>' +
        '</div>' +
        '<div class="item-right">' +
          '<div class="item-cost">👼 ' + formatNumber(u.cost) + '</div>' +
        '</div>';
      div.disabled = !can;
      div.addEventListener('click', () => buyPrestigeUpgrade(u));
      list.appendChild(div);
    });
  }

  function buyPrestigeUpgrade(u){
    if (state.prestigePoints < u.cost || state.prestigeUpgrades[u.id]) return;
    state.prestigePoints -= u.cost;
    state.prestigeUpgrades[u.id] = true;
    render();
    saveGame();
  }

  function renderStocks(){
    const list = document.getElementById('stockList');
    if (!list) return;
    list.innerHTML = '';
    STOCKS.forEach(s => {
      const st = state.stocks[s.id];
      const prevPrice = st.prevPrice || st.price;
      const dir = st.price > prevPrice ? 'up' : (st.price < prevPrice ? 'down' : '');
      const arrow = dir === 'up' ? '▲' : (dir === 'down' ? '▼' : '―');
      const canBuy1 = state.cookies >= st.price;
      const canBuy10 = state.cookies >= st.price * 10;
      const canSell1 = st.shares >= 1;
      const canSell10 = st.shares >= 10;

      const row = document.createElement('div');
      row.className = 'stock-row';
      row.innerHTML =
        '<div class="stock-emoji">' + s.emoji + '</div>' +
        '<div class="stock-info">' +
          '<div class="stock-name">' + s.name + '</div>' +
          '<div class="stock-price ' + dir + '">🍪 ' + formatNumber(st.price) + ' ' + arrow + '</div>' +
          '<div class="stock-shares">保有: ' + formatNumber(st.shares) + '株　評価額: 🍪 ' + formatNumber(st.shares * st.price) + '</div>' +
        '</div>' +
        '<div class="stock-actions">' +
          '<button class="stock-btn buy" data-qty="1" ' + (canBuy1 ? '' : 'disabled') + '>1株購入</button>' +
          '<button class="stock-btn buy" data-qty="10" ' + (canBuy10 ? '' : 'disabled') + '>10株購入</button>' +
          '<button class="stock-btn sell" data-qty="1" ' + (canSell1 ? '' : 'disabled') + '>1株売却</button>' +
          '<button class="stock-btn sell" data-qty="10" ' + (canSell10 ? '' : 'disabled') + '>10株売却</button>' +
        '</div>';
      row.querySelectorAll('.stock-btn.buy').forEach(btn => {
        btn.addEventListener('click', () => buyStock(s, parseInt(btn.dataset.qty, 10)));
      });
      row.querySelectorAll('.stock-btn.sell').forEach(btn => {
        btn.addEventListener('click', () => sellStock(s, parseInt(btn.dataset.qty, 10)));
      });
      list.appendChild(row);
    });
  }

  function renderPet(){
    const iconEl = document.getElementById('petIcon');
    if (!iconEl) return;
    const level = petLevel();
    const stage = petStage();
    const bonusPct = Math.round((petBonusMult() - 1) * 1000) / 10;
    iconEl.textContent = stage.emoji;
    document.getElementById('petNameLine').textContent = stage.name + '（Lv.' + level + '）';
    document.getElementById('petBonusLine').textContent = '総生産量 永久+' + bonusPct + '%';
    document.getElementById('petFedLine').textContent = '累計で 🍪 ' + formatNumber(state.pet.fed || 0) + ' 分の施設を捧げた';

    const list = document.getElementById('sacrificeList');
    list.innerHTML = '';
    const owned = PRODUCERS.filter(p => state.producers[p.id] > 0);
    if (owned.length === 0){
      list.innerHTML = '<div class="empty-note">捧げられる生産施設がありません。まずは施設を購入しましょう。</div>';
      return;
    }
    owned.forEach(p => {
      const count = state.producers[p.id];
      const value = producerCostAt(p, count - 1);
      const div = document.createElement('button');
      div.className = 'item';
      div.innerHTML =
        '<div class="item-emoji">' + p.emoji + '</div>' +
        '<div class="item-info">' +
          '<div class="item-name">' + p.name + '</div>' +
          '<div class="item-sub">所持: ' + count + '</div>' +
        '</div>' +
        '<div class="item-right">' +
          '<div class="item-cost">🐣 +' + formatNumber(value) + '</div>' +
          '<div class="item-count">捧げる</div>' +
        '</div>';
      div.addEventListener('click', () => sacrificeProducer(p));
      list.appendChild(div);
    });
  }

  async function doPrestige(){
    const gain = prestigeGainAvailable();
    if (gain <= 0){
      toast('まだ転生できません。もっとクッキーを焼きましょう');
      return;
    }
    const ok = confirm(
      '転生すると天使のクッキーを +' + formatNumber(gain) + ' 個獲得し、\n' +
      'クッキー・生産施設・クリック強化がリセットされます。\n' +
      '（実績と天使のクッキーは引き継がれます）\n\n転生しますか？'
    );
    if (!ok) return;

    state.prestigeClaimed += gain;
    state.prestigePoints += gain;
    state.lifetimePrestigePoints += gain;
    state.cookies = 0;
    PRODUCERS.forEach(p => { state.producers[p.id] = 0; });
    UPGRADES.forEach(u => { state.upgrades[u.id] = false; });

    render();
    await saveGame();
    toast('✨ 転生完了！ 天使のクッキー +' + formatNumber(gain));
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
    saveGame();
  }

  function sellProducer(p){
    const owned = state.producers[p.id];
    if (owned <= 0) return;
    const refund = producerSellValue(p);
    state.producers[p.id] -= 1;
    state.cookies += refund;
    render();
    saveGame();
  }

  function sacrificeProducer(p){
    const owned = state.producers[p.id];
    if (owned <= 0) return;
    const value = producerCostAt(p, owned - 1);
    state.producers[p.id] -= 1;
    state.pet.fed = (state.pet.fed || 0) + value;
    checkAchievements();
    render();
    saveGame();
    toast('🐣 ' + p.name + ' を生贄に捧げた');
  }

  function buyStock(s, qty){
    const st = state.stocks[s.id];
    const cost = st.price * qty;
    if (state.cookies < cost) return;
    state.cookies -= cost;
    st.shares += qty;
    render();
    saveGame();
  }

  function sellStock(s, qty){
    const st = state.stocks[s.id];
    const amount = Math.min(qty, st.shares);
    if (amount <= 0) return;
    st.shares -= amount;
    state.cookies += st.price * amount;
    render();
    saveGame();
  }

  function tickStocks(){
    STOCKS.forEach(s => {
      const st = state.stocks[s.id];
      const change = (Math.random() - 0.5) * s.volatility * 2;
      st.prevPrice = st.price;
      st.price = Math.max(1, st.price * (1 + change));
    });
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
      prestige: document.getElementById('prestigePanel'),
      other: document.getElementById('otherPanel'),
    };
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Object.keys(panels).forEach(key => {
          const isActive = key === btn.dataset.tab;
          panels[key].style.display = isActive ? (key === 'producers' || key === 'upgrades' || key === 'achievements' ? 'flex' : 'block') : 'none';
        });
      });
    });
  }

  function setupPrestige(){
    document.getElementById('prestigeBtn').addEventListener('click', doPrestige);
  }

  /* ---------- リセット ---------- */
  function setupReset(){
    document.getElementById('resetBtn').addEventListener('click', async () => {
      if (!confirm('天使のクッキーや実績も含め、すべてのデータを消去します。\n（生産施設のみリセットしたい場合は「転生」を使ってください）\n\n本当に完全リセットしますか？')) return;
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

    //setInterval(saveGame, 8000);
    setInterval(() => { tickStocks(); render(); }, 3000);
    //window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') saveGame();
    };//)
  //}

  /* ---------- 起動 ---------- */
  async function init(){
    render();
    document.getElementById('cookieBtn').addEventListener('click', handleClick);
    setupTabs();
    setupReset();
    setupPrestige();
    startLoop();
  }

  init();
