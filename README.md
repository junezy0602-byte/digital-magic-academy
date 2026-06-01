# 数字魔法学院：暗影入侵

适合马来西亚小学一年级学生的华文数学 RPG 冒险游戏 V1。

## V1 内容

- 开始页面
- 输入学生姓名
- 角色选择：魔法师、骑士、龙骑士、精灵法师
- 宠物选择：火焰龙、水晶狐、雷电鸟
- 剧情动画
- 分层动画角色、宠物与怪物，不再只是静态图标
- 第一章：数字村庄，主题为数位数值
- 自动随机题目生成器，避免短期重复
- RPG 战斗系统：玩家 HP、宠物 HP、怪物 HP、答对攻击、答错反击
- 技能弹道、受击动画、伤害数字、宠物攻击动作
- 奖励系统：金币、宝石、药水、装备、宠物蛋
- 宠物升级和进化动画
- 第一章 Boss 战
- 学习记录、游戏记录、章节表现、奖励记录
- Firestore 可选保存，失败时自动使用 localStorage

## 项目结构

```text
rpg-pok-mon-harry-potter-rpg/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── game.js
└── README.md
```

## 运行方式

直接用本地服务器打开：

```bash
python3 -m http.server 5173
```

然后访问：

```text
http://localhost:5173
```

## Firestore 配置

游戏会优先尝试读取 `window.DMA_FIREBASE_CONFIG`。如果没有配置，或 Firestore 初始化失败，会自动保存到 `localStorage`。

如需启用 Firestore，可在 `index.html` 的 `js/game.js` 前加入：

```html
<script>
  window.DMA_FIREBASE_CONFIG = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
</script>
```

Firestore collections:

- `learningRecords`
- `gameRecords`
- `chapterPerformance`
- `rewardRecords`

## 题目生成器 V1

第一章会随机生成两位数的数位数值题，例如：

- `25 里面的 2 代表多少？`
- `47 里面的 4 代表多少？`
- `81 里面的 8 代表多少？`

正确答案是十位数字所代表的数值，例如 `25` 里的 `2` 代表 `20`。
