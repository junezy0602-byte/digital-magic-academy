const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const screens = {
  start: $("#screen-start"),
  name: $("#screen-name"),
  role: $("#screen-role"),
  pet: $("#screen-pet"),
  story: $("#screen-story"),
  game: $("#screen-game"),
};

const roles = [
  {
    id: "mage",
    name: "魔法师",
    icon: "🧙",
    desc: "擅长数字魔法，技能稳定，适合第一次冒险。",
    stats: ["魔力 ★★★", "速度 ★★", "守护 ★★"],
    colors: ["#ffd766", "#65c7f5"],
  },
  {
    id: "knight",
    name: "骑士",
    icon: "⚔️",
    desc: "勇敢可靠，答错时更能承受怪物攻击。",
    stats: ["力量 ★★★", "守护 ★★★", "魔力 ★"],
    colors: ["#ffb86b", "#79d17d"],
  },
  {
    id: "dragon-rider",
    name: "龙骑士",
    icon: "🐉",
    desc: "攻击感强，连续答对时会打出更高伤害。",
    stats: ["力量 ★★★", "速度 ★★", "Combo ★★★"],
    colors: ["#ff7d69", "#8e72ee"],
  },
  {
    id: "elf",
    name: "精灵法师",
    icon: "🧝",
    desc: "轻盈敏捷，更容易触发额外金币奖励。",
    stats: ["速度 ★★★", "幸运 ★★★", "魔力 ★★"],
    colors: ["#85e0a3", "#7cc8ff"],
  },
];

const pets = [
  {
    id: "fire-dragon",
    name: "火焰龙",
    icon: "🔥",
    skill: "烈焰冲击",
    evolutions: ["火焰龙", "烈焰龙", "圣龙王"],
    icons: ["🔥", "🐲", "🐉"],
    colors: ["#ff8a4d", "#ffd166"],
    burst: "#ff7a45",
  },
  {
    id: "crystal-fox",
    name: "水晶狐",
    icon: "💧",
    skill: "冰晶闪光",
    evolutions: ["水晶狐", "冰晶狐", "九尾圣狐"],
    icons: ["💧", "🦊", "❄️"],
    colors: ["#7ddfff", "#8e72ee"],
    burst: "#65d9ff",
  },
  {
    id: "thunder-bird",
    name: "雷电鸟",
    icon: "⚡",
    skill: "雷光飞羽",
    evolutions: ["雷电鸟", "雷鹰", "神圣雷皇鸟"],
    icons: ["⚡", "🦅", "🌩️"],
    colors: ["#ffe66d", "#4aa8ef"],
    burst: "#ffd84f",
  },
];

const monsters = [
  { name: "影子史莱姆", icon: "👾", hp: 80 },
  { name: "迷雾小怪", icon: "🌀", hp: 90 },
  { name: "偷数字的幽影", icon: "👻", hp: 100 },
  { name: "裂纹水晶兽", icon: "💠", hp: 115 },
];

const boss = {
  name: "暗影村长",
  icon: "☠️",
  hp: 360,
};

const rewards = [
  { type: "coins", icon: "🪙", label: "金币", min: 18, max: 38 },
  { type: "gems", icon: "💎", label: "宝石", min: 1, max: 3 },
  { type: "potion", icon: "🧪", label: "生命药水", min: 1, max: 1 },
  { type: "equipment", icon: "🪄", label: "魔法装备" },
  { type: "egg", icon: "🥚", label: "宠物蛋", min: 1, max: 1 },
];

const equipmentPool = [
  { name: "星光魔法杖", icon: "🪄" },
  { name: "勇气皇冠", icon: "👑" },
  { name: "数字护盾", icon: "🛡️" },
  { name: "月光魔法袍", icon: "🧥" },
];

const storyLines = [
  "五颗数字水晶守护着数字王国。可是今晚，暗影魔王闯入学院，偷走了所有水晶！",
  "数字村庄的十位魔法正在消失。村民们看不懂 25 里的 2 到底代表多少。",
  "你将成为见习魔法师，和宠物伙伴一起用数学魔法击败怪物。",
  "第一颗水晶就在数字村庄深处。准备好了吗？冒险开始！",
];

const specialEvents = [
  "🎁 宝箱事件：你发现路边有发光的宝箱。",
  "🧙 神秘商人：商人送你一张幸运优惠券，下一次奖励金币增加。",
  "🐉 稀有宠物出现：远处传来龙吟声，宠物获得额外经验。",
  "⚡ 精灵进化挑战：空气中充满能量，连续答对会更快进化。",
  "👹 Boss 技能破解：你看穿了暗影魔法的弱点，Boss 战伤害提升。",
];

const state = {
  studentName: "",
  role: null,
  pet: null,
  coins: 0,
  gems: 0,
  potions: 0,
  eggs: 0,
  combo: 0,
  player: { hp: 120, maxHp: 120 },
  petStats: { hp: 90, maxHp: 90, level: 1, xp: 0, stage: 0 },
  enemy: null,
  normalWins: 0,
  isBoss: false,
  completed: false,
  currentQuestion: null,
  questionStartedAt: 0,
  usedQuestions: new Set(),
  answersLocked: false,
  records: [],
  rewards: [],
  achievements: new Set(),
  equipment: [{ name: "新手魔杖", icon: "🪄" }],
  luckyReward: false,
  bossWeakness: false,
};

class QuestionGeneratorEngine {
  constructor() {
    this.recent = new Set();
  }

  createChapterOneQuestion() {
    for (let attempt = 0; attempt < 60; attempt += 1) {
      const number = rand(10, 99);
      const tens = Math.floor(number / 10);
      const ones = number % 10;
      const answer = tens * 10;
      const signature = `place-value-${number}-${tens}`;
      if (this.recent.has(signature)) continue;

      this.recent.add(signature);
      if (this.recent.size > 42) {
        this.recent = new Set([...this.recent].slice(-24));
      }

      const distractors = [
        tens,
        ones,
        number,
        Math.max(10, answer - 10),
        Math.min(90, answer + 10),
        tens + ones,
      ].filter((value) => value !== answer && value >= 0);
      const optionDistractors = unique(distractors);
      while (optionDistractors.length < 3) {
        const candidate = rand(1, 9) * 10;
        if (candidate !== answer && !optionDistractors.includes(candidate)) {
          optionDistractors.push(candidate);
        }
      }

      return {
        id: signature,
        chapter: 1,
        topic: "数位数值",
        text: `${number} 里面的 ${tens} 代表多少？`,
        answer,
        options: shuffle([answer, ...shuffle(optionDistractors).slice(0, 3)]),
      };
    }

    this.recent.clear();
    return this.createChapterOneQuestion();
  }
}

class DataStore {
  constructor() {
    this.db = null;
    this.ready = this.initFirestore();
  }

  async initFirestore() {
    const config = window.DMA_FIREBASE_CONFIG;
    if (!config || !config.projectId) return false;

    try {
      const firebaseApp = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
      const firestore = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
      const app = firebaseApp.initializeApp(config);
      this.db = firestore.getFirestore(app);
      this.firestore = firestore;
      return true;
    } catch (error) {
      console.warn("Firestore 初始化失败，使用 localStorage。", error);
      this.db = null;
      return false;
    }
  }

  async saveLearningRecord(record) {
    await this.save("dma_learning_records", "learningRecords", record);
  }

  async saveGameRecord(record) {
    await this.save("dma_game_records", "gameRecords", record);
  }

  async saveRewardRecord(record) {
    await this.save("dma_reward_records", "rewardRecords", record);
  }

  async saveChapterPerformance(record) {
    await this.save("dma_chapter_performance", "chapterPerformance", record);
  }

  async save(localKey, collectionName, record) {
    const payload = {
      ...record,
      savedAt: new Date().toISOString(),
    };

    try {
      await this.ready;
      if (!this.db) throw new Error("Firestore unavailable");
      await this.firestore.addDoc(this.firestore.collection(this.db, collectionName), payload);
    } catch (error) {
      const current = JSON.parse(localStorage.getItem(localKey) || "[]");
      current.push(payload);
      localStorage.setItem(localKey, JSON.stringify(current.slice(-500)));
    }
  }

  getLocalLearningRecords() {
    return JSON.parse(localStorage.getItem("dma_learning_records") || "[]");
  }
}

const questionEngine = new QuestionGeneratorEngine();
const dataStore = new DataStore();
let timerId = null;
let storyIndex = 0;

function showScreen(screenId) {
  Object.values(screens).forEach((screen) => screen.classList.remove("screen-active"));
  $(`#${screenId}`).classList.add("screen-active");
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function unique(values) {
  return [...new Set(values)];
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function setCssVars(element, pairs) {
  Object.entries(pairs).forEach(([key, value]) => element.style.setProperty(key, value));
}

function createRoleSprite(role) {
  return `
    <div class="animated-sprite role-sprite role-${role.id}" aria-hidden="true">
      <span class="sprite-shadow"></span>
      <span class="magic-ring"></span>
      <span class="sprite-cape"></span>
      <span class="sprite-body"></span>
      <span class="sprite-head">
        <i class="sprite-eye eye-left"></i>
        <i class="sprite-eye eye-right"></i>
        <i class="sprite-smile"></i>
      </span>
      <span class="sprite-hat"></span>
      <span class="sprite-arm arm-left"></span>
      <span class="sprite-arm arm-right"></span>
      <span class="sprite-wand"></span>
      <span class="wand-star">✦</span>
    </div>
  `;
}

function createPetSprite(pet, stage = 0) {
  const stageClass = ["baby", "evolved", "legend"][stage] || "baby";
  return `
    <div class="animated-sprite pet-sprite pet-${pet.id} pet-${stageClass}" aria-hidden="true">
      <span class="pet-shadow"></span>
      <span class="pet-aura"></span>
      <span class="pet-tail"></span>
      <span class="pet-wing wing-left"></span>
      <span class="pet-wing wing-right"></span>
      <span class="pet-body"></span>
      <span class="pet-head">
        <i class="pet-eye eye-left"></i>
        <i class="pet-eye eye-right"></i>
      </span>
      <span class="pet-mark">${pet.icons[stage]}</span>
      <span class="pet-spark spark-a"></span>
      <span class="pet-spark spark-b"></span>
      <span class="pet-spark spark-c"></span>
    </div>
  `;
}

function createMonsterSprite(isBoss) {
  return `
    <div class="animated-sprite monster-sprite ${isBoss ? "boss-sprite" : ""}" aria-hidden="true">
      <span class="monster-shadow"></span>
      <span class="monster-flame flame-a"></span>
      <span class="monster-flame flame-b"></span>
      <span class="monster-body"></span>
      <span class="monster-horn horn-left"></span>
      <span class="monster-horn horn-right"></span>
      <span class="monster-eye eye-left"></span>
      <span class="monster-eye eye-right"></span>
      <span class="monster-mouth"></span>
      <span class="monster-orb orb-a"></span>
      <span class="monster-orb orb-b"></span>
    </div>
  `;
}

function renderSelections() {
  $("#role-grid").innerHTML = roles.map((role) => `
    <button class="choice-card" data-role="${role.id}" style="--card-a:${role.colors[0]};--card-b:${role.colors[1]}">
      <div class="choice-portrait">${createRoleSprite(role)}</div>
      <h3>${role.icon} ${role.name}</h3>
      <p>${role.desc}</p>
      <div class="stat-pills">${role.stats.map((stat) => `<span>${stat}</span>`).join("")}</div>
    </button>
  `).join("");

  $("#pet-grid").innerHTML = pets.map((pet) => `
    <button class="choice-card" data-pet="${pet.id}" style="--card-a:${pet.colors[0]};--card-b:${pet.colors[1]}">
      <div class="choice-portrait">${createPetSprite(pet)}</div>
      <h3>${pet.icon} ${pet.name}</h3>
      <p>技能：${pet.skill}。可进化为 ${pet.evolutions[1]}、${pet.evolutions[2]}。</p>
      <div class="stat-pills"><span>攻击动画</span><span>跟随伙伴</span><span>可进化</span></div>
    </button>
  `).join("");
}

function applyCharacterArt() {
  const role = state.role;
  const pet = state.pet;

  [$("#profile-avatar"), $("#battle-hero")].forEach((element) => {
    element.innerHTML = createRoleSprite(role);
    element.dataset.role = role.id;
    setCssVars(element, { "--card-a": role.colors[0], "--card-b": role.colors[1] });
  });

  [$("#profile-pet"), $("#battle-pet")].forEach((element) => {
    element.innerHTML = createPetSprite(pet, state.petStats.stage);
    element.dataset.pet = pet.id;
    element.dataset.stage = state.petStats.stage;
    setCssVars(element, { "--pet-a": pet.colors[0], "--pet-b": pet.colors[1] });
  });

  $("#player-display").textContent = state.studentName;
  $("#role-display").textContent = role.name;
  $("#pet-display").textContent = pet.evolutions[state.petStats.stage];
  $("#pet-level").textContent = state.petStats.level;
  $("#pet-xp").textContent = state.petStats.xp;
  $("#pet-evolution").textContent = `形态：${pet.evolutions[state.petStats.stage]}`;
  $("#equipment-display").textContent = `装备：${state.equipment.map((item) => `${item.icon}${item.name}`).join("、")}`;
}

function startGame() {
  showScreen("screen-game");
  state.records = dataStore.getLocalLearningRecords();
  state.normalWins = 0;
  state.isBoss = false;
  state.player.hp = state.player.maxHp;
  state.petStats.hp = state.petStats.maxHp;
  applyCharacterArt();
  updateHud();
  spawnEnemy(false);
}

function spawnEnemy(isBoss) {
  state.isBoss = isBoss;
  const template = isBoss ? boss : monsters[state.normalWins % monsters.length];
  const hp = isBoss ? template.hp : template.hp + state.normalWins * 10;
  state.enemy = {
    name: template.name,
    icon: template.icon,
    hp,
    maxHp: hp,
  };

  $("#enemy-name").textContent = template.name;
  $("#enemy-type").textContent = isBoss ? "第一章 Boss" : "怪物";
  $("#enemy-sprite").innerHTML = createMonsterSprite(isBoss);
  $("#stage-label").textContent = isBoss ? "Boss 战：夺回数字水晶" : `普通战斗 ${state.normalWins + 1} / 4`;
  updateMapNodes();
  updateHud();
  nextQuestion();
}

function updateMapNodes() {
  $$(".map-node").forEach((node, index) => {
    node.classList.toggle("active", state.isBoss ? index === 4 : index === state.normalWins);
  });
}

function nextQuestion() {
  if (state.completed) return;
  state.currentQuestion = questionEngine.createChapterOneQuestion();
  state.questionStartedAt = performance.now();
  state.answersLocked = false;
  $("#question-tag").textContent = state.currentQuestion.topic;
  $("#question-text").textContent = state.currentQuestion.text;
  $("#feedback").textContent = state.isBoss
    ? "Boss 战开始！连续答对可以快速削弱暗影魔法。"
    : "选择正确答案，让宠物释放技能。";
  $("#answer-grid").innerHTML = state.currentQuestion.options.map((option) => `
    <button class="answer-btn" data-answer="${option}">${option}</button>
  `).join("");
  startTimer();
}

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    const elapsed = Math.floor((performance.now() - state.questionStartedAt) / 1000);
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const seconds = String(elapsed % 60).padStart(2, "0");
    $("#timer").textContent = `${minutes}:${seconds}`;
  }, 250);
}

function updateHud() {
  $("#coins").textContent = state.coins;
  $("#gems").textContent = state.gems;
  $("#combo").textContent = state.combo;
  $("#player-hp").textContent = state.player.hp;
  $("#pet-hp").textContent = state.petStats.hp;
  $("#enemy-hp").textContent = Math.max(0, state.enemy?.hp || 0);
  $("#player-hp-bar").style.width = `${(state.player.hp / state.player.maxHp) * 100}%`;
  $("#pet-hp-bar").style.width = `${(state.petStats.hp / state.petStats.maxHp) * 100}%`;
  $("#enemy-hp-bar").style.width = `${((state.enemy?.hp || 0) / (state.enemy?.maxHp || 1)) * 100}%`;
  applyCharacterArt();
}

async function answerQuestion(selected, button) {
  if (state.answersLocked) return;
  state.answersLocked = true;
  clearInterval(timerId);
  $$(".answer-btn").forEach((btn) => (btn.disabled = true));

  const question = state.currentQuestion;
  const isCorrect = Number(selected) === question.answer;
  const elapsedMs = Math.round(performance.now() - state.questionStartedAt);

  button.classList.add(isCorrect ? "correct" : "wrong");
  const correctButton = $(`.answer-btn[data-answer="${question.answer}"]`);
  correctButton?.classList.add("correct");

  const record = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    studentName: state.studentName,
    chapter: "第一章：数字村庄",
    topic: question.topic,
    question: question.text,
    correctAnswer: question.answer,
    selectedAnswer: Number(selected),
    isCorrect,
    elapsedMs,
    comboBeforeAnswer: state.combo,
  };

  state.records.push(record);
  dataStore.saveLearningRecord(record);

  if (isCorrect) {
    await handleCorrectAnswer();
  } else {
    await handleWrongAnswer();
  }
}

async function handleCorrectAnswer() {
  state.combo += 1;
  const comboBonus = Math.max(0, state.combo - 1);
  const coinGain = 5 + comboBonus * 2 + (state.role.id === "elf" && Math.random() < 0.25 ? 5 : 0);
  state.coins += coinGain;

  let damage = 30 + state.petStats.level * 4 + comboBonus * 5;
  if (state.role.id === "dragon-rider") damage += comboBonus * 2;
  if (state.bossWeakness && state.isBoss) damage += 10;

  $("#feedback").textContent = `答对了！${state.pet.evolutions[state.petStats.stage]} 使用「${state.pet.skill}」，造成 ${damage} 点伤害。+${coinGain} 金币`;
  playTone(660, 0.12, "triangle");
  animatePetAttack(damage);
  state.enemy.hp = clamp(state.enemy.hp - damage, 0, state.enemy.maxHp);
  addPetXp(12);
  updateAchievements();
  updateHud();

  await delay(780);
  if (state.enemy.hp <= 0) {
    await defeatEnemy();
  } else {
    maybeTriggerSpecialEvent();
    nextQuestion();
  }
}

async function handleWrongAnswer() {
  state.combo = 0;
  const baseDamage = state.isBoss ? 26 : 14;
  const guard = state.role.id === "knight" ? 5 : 0;
  const playerDamage = Math.max(6, baseDamage - guard);
  const petDamage = state.isBoss ? 8 : 4;

  state.player.hp = clamp(state.player.hp - playerDamage, 0, state.player.maxHp);
  state.petStats.hp = clamp(state.petStats.hp - petDamage, 0, state.petStats.maxHp);
  $("#feedback").textContent = `差一点！正确答案是 ${state.currentQuestion.answer}。怪物反击，玩家 -${playerDamage} HP，宠物 -${petDamage} HP。`;
  playTone(160, 0.16, "sawtooth");
  $("#battlefield").classList.add("shake");
  $("#enemy-sprite").classList.add("attack");
  updateHud();

  await delay(480);
  $("#battlefield").classList.remove("shake");
  $("#enemy-sprite").classList.remove("attack");

  if (state.player.hp <= 0) {
    recoverPlayer();
  }

  await delay(650);
  nextQuestion();
}

async function defeatEnemy() {
  playTone(880, 0.16, "square");

  if (state.isBoss) {
    state.gems += 8;
    state.coins += 120;
    addPetXp(80);
    $("#feedback").textContent = "你打败了暗影村长！第一颗数字水晶回到学院。";
    showToast("🏆 第一章完成：获得数字学徒徽章、120 金币、8 宝石！");
    state.achievements.add("数字学徒");
    dataStore.saveChapterPerformance(createChapterPerformance(true));
    dataStore.saveGameRecord(createGameSnapshot("chapter-one-complete"));
    updateHud();
    await delay(1200);
    openChest(true);
    return;
  }

  state.normalWins += 1;
  addPetXp(30);
  dataStore.saveGameRecord(createGameSnapshot("enemy-defeated"));
  updateHud();
  openChest(false);
}

function openChest(finalChest) {
  const reward = createReward(finalChest);
  applyReward(reward);
  state.rewards.push(reward);
  dataStore.saveRewardRecord({
    studentName: state.studentName,
    chapter: "第一章：数字村庄",
    reward,
    coins: state.coins,
    gems: state.gems,
  });

  $("#reward-text").textContent = `${reward.icon} 你获得了 ${reward.text}`;
  $("#claim-reward-btn").dataset.finalChest = finalChest ? "true" : "false";
  $("#chest-dialog").showModal();
  updateHud();
}

function createReward(finalChest) {
  if (finalChest) {
    return {
      type: "equipment",
      icon: "💎",
      text: "第一颗数字水晶、60 金币和星光魔法杖",
      equipment: { name: "星光魔法杖", icon: "🪄" },
      coins: 60,
      gems: 1,
    };
  }

  const pool = state.luckyReward
    ? [rewards[0], rewards[0], rewards[1], rewards[2], rewards[3], rewards[4]]
    : rewards;
  state.luckyReward = false;
  const template = pool[rand(0, pool.length - 1)];

  if (template.type === "equipment") {
    const equipment = equipmentPool[rand(0, equipmentPool.length - 1)];
    return {
      type: "equipment",
      icon: template.icon,
      text: `${equipment.icon}${equipment.name}`,
      equipment,
    };
  }

  const amount = rand(template.min, template.max);
  return {
    type: template.type,
    icon: template.icon,
    text: `${amount} 个${template.label}`,
    amount,
  };
}

function applyReward(reward) {
  if (reward.type === "coins") state.coins += reward.amount;
  if (reward.type === "gems") state.gems += reward.amount;
  if (reward.type === "potion") state.potions += reward.amount;
  if (reward.type === "egg") state.eggs += reward.amount;
  if (reward.coins) state.coins += reward.coins;
  if (reward.gems) state.gems += reward.gems;
  if (reward.equipment && !state.equipment.some((item) => item.name === reward.equipment.name)) {
    state.equipment.push(reward.equipment);
  }
}

function claimReward() {
  $("#chest-dialog").close();
  const finalChest = $("#claim-reward-btn").dataset.finalChest === "true";

  if (finalChest) {
    state.completed = true;
    $("#feedback").textContent = "V1 完成！你已夺回第一颗数字水晶。可以继续查看学习记录。";
    $("#question-text").textContent = "第一章完成：数字村庄恢复光芒！";
    $("#answer-grid").innerHTML = "";
    clearInterval(timerId);
    return;
  }

  if (state.normalWins >= 4) {
    showToast("⚠️ Boss 出现！暗影村长守着数字水晶。");
    spawnEnemy(true);
  } else {
    spawnEnemy(false);
  }
}

function addPetXp(amount) {
  state.petStats.xp += amount;
  while (state.petStats.xp >= 100) {
    state.petStats.xp -= 100;
    state.petStats.level += 1;
    state.petStats.maxHp += 10;
    state.petStats.hp = state.petStats.maxHp;
    playTone(920, 0.18, "triangle");
    showToast(`✨ 宠物升级到 ${state.petStats.level} 级！`);
  }

  const nextStage = state.petStats.level >= 5 ? 2 : state.petStats.level >= 3 ? 1 : 0;
  if (nextStage > state.petStats.stage) {
    state.petStats.stage = nextStage;
    showEvolution();
  }
}

function showEvolution() {
  const petName = state.pet.evolutions[state.petStats.stage];
  $("#evo-pet").innerHTML = createPetSprite(state.pet, state.petStats.stage);
  $("#evo-text").textContent = `${state.pet.name} 进化成 ${petName}！`;
  $("#evolution-overlay").classList.add("show");
  playTone(1040, 0.2, "sine");
  setTimeout(() => {
    $("#evolution-overlay").classList.remove("show");
    applyCharacterArt();
  }, 2600);
}

function maybeTriggerSpecialEvent() {
  if (Math.random() > 0.18) return;
  const event = specialEvents[rand(0, specialEvents.length - 1)];
  showToast(event);

  if (event.includes("神秘商人")) state.luckyReward = true;
  if (event.includes("稀有宠物")) addPetXp(18);
  if (event.includes("Boss 技能破解")) state.bossWeakness = true;
}

function updateAchievements() {
  const correct = state.records.filter((record) => record.isCorrect).length;
  if (correct >= 5) state.achievements.add("数字勇者");
  if (correct >= 12) state.achievements.add("数字大师");
  if (state.combo >= 6) state.achievements.add("数字传奇");
}

function recoverPlayer() {
  if (state.potions > 0) {
    state.potions -= 1;
    state.player.hp = Math.ceil(state.player.maxHp * 0.65);
    showToast("🧪 生命药水自动使用，玩家恢复 HP！");
  } else {
    state.player.hp = Math.ceil(state.player.maxHp * 0.55);
    state.coins = Math.max(0, state.coins - 10);
    showToast("学院护盾保护了你，扣除 10 金币后继续挑战。");
  }
  updateHud();
}

function animatePetAttack(damage) {
  const petElement = $("#battle-pet");
  const enemyElement = $("#enemy-sprite");
  petElement.classList.remove("attack");
  enemyElement.classList.remove("enemy-hit");
  void petElement.offsetWidth;
  petElement.classList.add("attack");

  const burst = document.createElement("div");
  burst.className = "skill-burst";
  burst.textContent = state.pet.icons[state.petStats.stage];
  burst.style.setProperty("--burst-a", state.pet.burst);
  $("#effect-layer").appendChild(burst);

  const damageNumber = document.createElement("div");
  damageNumber.className = "damage-number";
  damageNumber.textContent = `-${damage}`;
  $("#effect-layer").appendChild(damageNumber);

  setTimeout(() => enemyElement.classList.add("enemy-hit"), 300);
  setTimeout(() => {
    burst.remove();
    damageNumber.remove();
    petElement.classList.remove("attack");
    enemyElement.classList.remove("enemy-hit");
  }, 900);
}

function showRecords() {
  const allRecords = [...dataStore.getLocalLearningRecords(), ...state.records]
    .filter((record, index, array) => array.findIndex((item) => item.id === record.id) === index)
    .slice(-60)
    .reverse();
  const attempts = allRecords.length;
  const correct = allRecords.filter((record) => record.isCorrect).length;
  const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;
  const avgMs = attempts ? Math.round(allRecords.reduce((sum, record) => sum + record.elapsedMs, 0) / attempts) : 0;

  $("#records-summary").innerHTML = [
    ["答题数", attempts],
    ["答对", correct],
    ["正确率", `${accuracy}%`],
    ["平均时间", `${(avgMs / 1000).toFixed(1)} 秒`],
  ].map(([label, value]) => `
    <div class="summary-card"><strong>${value}</strong><span>${label}</span></div>
  `).join("");

  $("#records-list").innerHTML = allRecords.length
    ? allRecords.map((record) => `
      <div class="record-row">
        <div>
          <p>${record.question}</p>
          <small>作答：${record.selectedAnswer} · 正确：${record.correctAnswer} · ${(record.elapsedMs / 1000).toFixed(1)} 秒</small>
        </div>
        <span class="result-pill ${record.isCorrect ? "ok" : "no"}">${record.isCorrect ? "正确" : "再试"}</span>
      </div>
    `).join("")
    : "<p>还没有记录。开始战斗后，这里会自动记录每一次答题。</p>";

  $("#records-dialog").showModal();
}

function createGameSnapshot(eventName) {
  return {
    eventName,
    studentName: state.studentName,
    role: state.role.name,
    pet: state.pet.evolutions[state.petStats.stage],
    chapter: "第一章：数字村庄",
    coins: state.coins,
    gems: state.gems,
    combo: state.combo,
    petLevel: state.petStats.level,
    petXp: state.petStats.xp,
    normalWins: state.normalWins,
    isBoss: state.isBoss,
  };
}

function createChapterPerformance(completed) {
  const chapterRecords = state.records.filter((record) => record.chapter === "第一章：数字村庄");
  const correct = chapterRecords.filter((record) => record.isCorrect).length;
  return {
    studentName: state.studentName,
    chapter: "第一章：数字村庄",
    topic: "数位数值",
    completed,
    attempts: chapterRecords.length,
    correct,
    accuracy: chapterRecords.length ? correct / chapterRecords.length : 0,
    coins: state.coins,
    gems: state.gems,
    achievements: [...state.achievements],
  };
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3200);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let audioContext;
function playTone(frequency, duration, type = "sine") {
  try {
    audioContext ||= new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.045, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch {
    // Browsers may block audio until the first user interaction; the game still works silently.
  }
}

function bindEvents() {
  $$("[data-next]").forEach((button) => {
    button.addEventListener("click", () => showScreen(button.dataset.next));
  });

  $("#save-name-btn").addEventListener("click", () => {
    const name = $("#student-name").value.trim();
    if (!name) {
      showToast("请输入学生姓名。");
      $("#student-name").focus();
      return;
    }
    state.studentName = name;
    showScreen("screen-role");
  });

  $("#student-name").addEventListener("keydown", (event) => {
    if (event.key === "Enter") $("#save-name-btn").click();
  });

  $("#role-grid").addEventListener("click", (event) => {
    const card = event.target.closest("[data-role]");
    if (!card) return;
    state.role = roles.find((role) => role.id === card.dataset.role);
    showScreen("screen-pet");
  });

  $("#pet-grid").addEventListener("click", (event) => {
    const card = event.target.closest("[data-pet]");
    if (!card) return;
    state.pet = pets.find((pet) => pet.id === card.dataset.pet);
    showScreen("screen-story");
  });

  $("#story-next-btn").addEventListener("click", () => {
    storyIndex += 1;
    if (storyIndex >= storyLines.length) {
      startGame();
      return;
    }
    $("#story-text").textContent = storyLines[storyIndex];
  });

  $("#answer-grid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-answer]");
    if (!button) return;
    answerQuestion(button.dataset.answer, button);
  });

  $("#claim-reward-btn").addEventListener("click", claimReward);
  $("#records-btn").addEventListener("click", showRecords);
  $("#close-records-btn").addEventListener("click", () => $("#records-dialog").close());
}

renderSelections();
bindEvents();
