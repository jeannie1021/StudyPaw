import { useState, useEffect, useRef, useCallback } from "react";

// ── Language Strings ──────────────────────────────────────────────────────────
const LANG = {
  en: {
    appName: "StudyPaw🐾",
    tabs: ["Timer", "Notes", "Tasks", "Sleep", "Pets"],
    timer: {
      stopwatch: "Stopwatch",
      timer: "Timer",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      companion: "Companion",
      blocked: "Social media blocked during study! 🚫",
      socialApps: "Blocked Apps",
      customize: "Customize",
      sessionPoints: "Session Points",
      totalPoints: "Total Points",
      blockedApps: ["Instagram","Facebook","Rednote","YouTube","Weibo","TikTok"],
      setTimer: "Set Timer (minutes)",
      timerDone: "Time's up! 🎉",
      earnedPoints: "You earned",
      points: "pts!",
      selectAnimal: "Select Companion",
    },
    notes: {
      title: "Notes",
      newNote: "+ New Note",
      type: "Type",
      mindmap: "Mind Map",
      drawing: "Drawing",
      placeholder: "Start writing...",
      noteTitle: "Note title...",
      addNode: "Add Node",
      centerNode: "Center Topic",
    },
    tasks: {
      title: "Tasks",
      add: "Add Task",
      placeholder: "New task...",
      dueDate: "Due date",
      overdue: "Overdue",
      done: "Done",
      pending: "Pending",
      complete: "+10 pts",
    },
    sleep: {
      title: "Sleep Tracker",
      bedtime: "Bedtime",
      wakeup: "Wake Up",
      logSleep: "Log Sleep",
      history: "Sleep History",
      avg: "Average",
      hours: "hrs",
      goal: "Goal: 8 hrs",
      duration: "Duration",
      quality: "Quality",
      poor: "Poor", fair: "Fair", good: "Good", great: "Great",
    },
    pets: {
      title: "My Pets",
      home: "Home",
      shop: "Shop",
      wardrobe: "Wardrobe",
      food: "Food",
      upgrade: "Upgrade Home",
      buy: "Buy",
      feed: "Feed",
      locked: "Locked",
      unlock: "Unlock",
      pts: "pts",
      hunger: "Hunger",
      happy: "Happy",
      level: "Lv",
      shopTitle: "Pet Shop",
      outfits: "Outfits",
      foods: "Food",
      homes: "Homes",
    },
    unlock: "Unlock for",
    settings: "Settings",
    language: "Language",
    yourPoints: "Your Points",
  },
  zh: {
    appName: "学习小窝",
    tabs: ["计时器", "笔记", "任务", "睡眠", "宠物"],
    timer: {
      stopwatch: "秒表",
      timer: "倒计时",
      start: "开始",
      pause: "暂停",
      reset: "重置",
      companion: "陪伴",
      blocked: "学习期间社交媒体已被屏蔽！🚫",
      socialApps: "屏蔽应用",
      customize: "自定义",
      sessionPoints: "本次积分",
      totalPoints: "总积分",
      blockedApps: ["Instagram","Facebook","小红书","YouTube","微博","TikTok"],
      setTimer: "设置时间（分钟）",
      timerDone: "时间到！🎉",
      earnedPoints: "你获得了",
      points: "分！",
      selectAnimal: "选择伙伴",
    },
    notes: {
      title: "笔记",
      newNote: "+ 新笔记",
      type: "打字",
      mindmap: "思维导图",
      drawing: "手写",
      placeholder: "开始写作...",
      noteTitle: "笔记标题...",
      addNode: "添加节点",
      centerNode: "中心主题",
    },
    tasks: {
      title: "任务清单",
      add: "添加任务",
      placeholder: "新任务...",
      dueDate: "截止日期",
      overdue: "已逾期",
      done: "已完成",
      pending: "进行中",
      complete: "+10分",
    },
    sleep: {
      title: "睡眠记录",
      bedtime: "入睡时间",
      wakeup: "起床时间",
      logSleep: "记录睡眠",
      history: "睡眠历史",
      avg: "平均",
      hours: "小时",
      goal: "目标：8小时",
      duration: "时长",
      quality: "质量",
      poor: "较差", fair: "一般", good: "良好", great: "很好",
    },
    pets: {
      title: "我的宠物",
      home: "家园",
      shop: "商店",
      wardrobe: "衣橱",
      food: "食物",
      upgrade: "升级家园",
      buy: "购买",
      feed: "喂食",
      locked: "未解锁",
      unlock: "解锁",
      pts: "分",
      hunger: "饱腹",
      happy: "快乐",
      level: "等级",
      shopTitle: "宠物商店",
      outfits: "服装",
      foods: "食物",
      homes: "家园",
    },
    unlock: "解锁需要",
    settings: "设置",
    language: "语言",
    yourPoints: "我的积分",
  }
};

// ── Animal Data ───────────────────────────────────────────────────────────────
const ANIMALS = [
  { id:"cat", name:{en:"Cat",zh:"猫咪"}, emoji:"🐱", unlocked:true, cost:0,
    frames:["(=^･ω･^=)","(=^･ᆺ･^=)","(^･o･^)","(=①ω①=)"] },
  { id:"dog", name:{en:"Dog",zh:"小狗"}, emoji:"🐶", unlocked:true, cost:0,
    frames:["(^・ω・^ )","( ^•ω•^ )","(U・ᴥ・U)","ʕ•ᴥ•ʔ"] },
  { id:"husky", name:{en:"Husky",zh:"哈士奇"}, emoji:"🐺", unlocked:false, cost:100,
    frames:["(ʘᗩʘ')","(⊙_☉)","(눈_눈)","ᕦ(ò_óˇ)ᕤ"] },
  { id:"panda", name:{en:"Panda",zh:"熊猫"}, emoji:"🐼", unlocked:false, cost:150,
    frames:["(̿▀̿ ̿Ĺ̯̿̿▀̿ ̿)̄","ʕ•ᴥ•ʔ","(｡◕‿◕｡)","(⌒‿⌒)"] },
  { id:"parrot", name:{en:"Parrot",zh:"鹦鹉"}, emoji:"🦜", unlocked:false, cost:200,
    frames:["(｡•̀ᴗ-)✧","(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧","＼(^o^)／","(≧∇≦)/"] },
  { id:"rabbit", name:{en:"Rabbit",zh:"兔子"}, emoji:"🐰", unlocked:false, cost:80,
    frames:["(\\(\\","(^_^;)","(｡•ᴗ•｡)","ʕ•ᴥ•ʔ"] },
  { id:"fox", name:{en:"Fox",zh:"狐狸"}, emoji:"🦊", unlocked:false, cost:120,
    frames:["(•ᴥ•)","(^ᴥ^)","ʕ•ᴥ•ʔ","(=^ᆺ^=)"] },
  { id:"sheep", name:{en:"Sheep",zh:"绵羊"}, emoji:"🐑", unlocked:false, cost:90,
    frames:["(˘ᵕ˘)","ʕ•ᴥ•ʔ","(⌒‿⌒)","(^•ω•^)"] },
  { id:"swan", name:{en:"Swan",zh:"天鹅"}, emoji:"🦢", unlocked:false, cost:130,
    frames:["(✿◠‿◠)","(⌒‿⌒)","(◕‿◕)","(｡♥‿♥｡)"] },
  { id:"duck", name:{en:"Duck",zh:"鸭子"}, emoji:"🦆", unlocked:false, cost:70,
    frames:["(≧◡≦)","(^‿^)","(•ᴗ•)","( ´ ▽ ` )"] },
  { id:"penguin", name:{en:"Penguin",zh:"企鹅"}, emoji:"🐧", unlocked:false, cost:110,
    frames:["(•_•)","( •_•)>⌐■-■","(⌐■_■)","(ᵔᴥᵔ)"] },
  { id:"polarbear", name:{en:"Polar Bear",zh:"北极熊"}, emoji:"🐻‍❄️", unlocked:false, cost:180,
    frames:["ʕ•ᴥ•ʔ","ʕ •ᴥ• ʔ","ʕง•ᴥ•ʔง","ʕ≧ᴥ≦ʔ"] },
  { id:"owl", name:{en:"Owl",zh:"猫头鹰"}, emoji:"🦉", unlocked:false, cost:160,
    frames:["(◉_◉)","(OvO)","(⊙_⊙)","(ʘ‿ʘ)"] },
];

const OUTFITS = [
  { id:"none", name:{en:"None",zh:"无"}, emoji:"👕", cost:0, free:true },
  { id:"bow", name:{en:"Bow Tie",zh:"蝴蝶结"}, emoji:"🎀", cost:30 },
  { id:"crown", name:{en:"Crown",zh:"皇冠"}, emoji:"👑", cost:50 },
  { id:"glasses", name:{en:"Glasses",zh:"眼镜"}, emoji:"👓", cost:40 },
  { id:"hat", name:{en:"Witch Hat",zh:"魔法帽"}, emoji:"🧙", cost:60 },
  { id:"scarf", name:{en:"Scarf",zh:"围巾"}, emoji:"🧣", cost:35 },
  { id:"cape", name:{en:"Superhero",zh:"超级英雄"}, emoji:"🦸", cost:80 },
];
const FOODS = [
  { id:"kibble", name:{en:"Kibble",zh:"猫粮"}, emoji:"🍖", cost:10, hunger:20, happy:5 },
  { id:"fish", name:{en:"Fish",zh:"小鱼"}, emoji:"🐟", cost:15, hunger:30, happy:15 },
  { id:"cake", name:{en:"Cake",zh:"蛋糕"}, emoji:"🎂", cost:25, hunger:40, happy:30 },
  { id:"berry", name:{en:"Berries",zh:"浆果"}, emoji:"🫐", cost:12, hunger:25, happy:10 },
  { id:"milk", name:{en:"Milk",zh:"牛奶"}, emoji:"🥛", cost:8, hunger:15, happy:20 },
];
const HOMES = [
  { id:"basic", name:{en:"Sunny Garden",zh:"阳光花园"}, emoji:"🏡", cost:0, free:true,
    bg:"linear-gradient(180deg,#87CEEB 0%,#b0e0f7 35%,#c8f0a0 60%,#a8e060 100%)",
    ground:"#a8e060", flowers:["🌸","🌼","🌷","🌻"] },
  { id:"cottage", name:{en:"Flower Meadow",zh:"花海草地"}, emoji:"🌺", cost:100,
    bg:"linear-gradient(180deg,#ffd6e8 0%,#ffb3d1 30%,#d4f5a0 60%,#b8e870 100%)",
    ground:"#b8e870", flowers:["🌸","🌺","🌹","💐","🌼"] },
  { id:"castle", name:{en:"Tiny Castle",zh:"小城堡"}, emoji:"🏰", cost:300,
    bg:"linear-gradient(180deg,#c9e8ff 0%,#e8d5f5 40%,#d0f0e0 70%,#9ed8b0 100%)",
    ground:"#9ed8b0", flowers:["⭐","✨","🌟","🌿"] },
  { id:"space", name:{en:"Space Pod",zh:"太空舱"}, emoji:"🚀", cost:500,
    bg:"linear-gradient(180deg,#0d0d2b 0%,#1a1a4e 40%,#2d1b6e 70%,#1a0a3e 100%)",
    ground:"#2d1b6e", flowers:["⭐","🌟","✨","💫","🪐"] },
];

// ── SVG Animal Illustrations ──────────────────────────────────────────────────
const AnimalSVG = ({ id, size = 80 }) => {
  const s = size;
  const animals = {
    dog: (<svg width={s} height={s} viewBox="0 0 160 180" fill="none">
        <ellipse cx="32" cy="72" rx="18" ry="28" fill="#E8B87A" stroke="#8B5E3C" strokeWidth="4" strokeLinejoin="round" transform="rotate(-12 32 72)"/>
        <ellipse cx="32" cy="72" rx="10" ry="18" fill="#F5C8A0" transform="rotate(-12 32 72)"/>
        <ellipse cx="128" cy="72" rx="18" ry="28" fill="#E8B87A" stroke="#8B5E3C" strokeWidth="4" strokeLinejoin="round" transform="rotate(12 128 72)"/>
        <ellipse cx="128" cy="72" rx="10" ry="18" fill="#F5C8A0" transform="rotate(12 128 72)"/>
        <rect x="44" y="118" width="72" height="52" rx="28" fill="#F0C880" stroke="#8B5E3C" strokeWidth="4"/>
        <ellipse cx="38" cy="162" rx="14" ry="10" fill="#F0C880" stroke="#8B5E3C" strokeWidth="3.5"/>
        <ellipse cx="33" cy="165" rx="5" ry="4" fill="#F5C890" stroke="#8B5E3C" strokeWidth="2.5"/>
        <ellipse cx="43" cy="167" rx="5" ry="4" fill="#F5C890" stroke="#8B5E3C" strokeWidth="2.5"/>
        <ellipse cx="122" cy="158" rx="14" ry="10" fill="#F0C880" stroke="#8B5E3C" strokeWidth="3.5"/>
        <rect x="108" y="138" width="36" height="28" rx="4" fill="#C8E8F8" stroke="#8B5E3C" strokeWidth="3"/>
        <rect x="108" y="138" width="8" height="28" rx="3" fill="#A0C8E8" stroke="#8B5E3C" strokeWidth="2"/>
        <line x1="120" y1="146" x2="138" y2="146" stroke="#8B5E3C" strokeWidth="1.5" opacity="0.5"/>
        <line x1="120" y1="152" x2="138" y2="152" stroke="#8B5E3C" strokeWidth="1.5" opacity="0.5"/>
        <line x1="120" y1="158" x2="138" y2="158" stroke="#8B5E3C" strokeWidth="1.5" opacity="0.5"/>
        <ellipse cx="80" cy="75" rx="46" ry="44" fill="#F5CF85" stroke="#8B5E3C" strokeWidth="4"/>
        <ellipse cx="80" cy="90" rx="22" ry="16" fill="#EDB860" stroke="#8B5E3C" strokeWidth="3"/>
        <ellipse cx="46" cy="87" rx="12" ry="8" fill="#FFB3B3" opacity="0.65"/>
        <ellipse cx="114" cy="87" rx="12" ry="8" fill="#FFB3B3" opacity="0.65"/>
        <circle cx="60" cy="70" r="12" fill="white" stroke="#8B5E3C" strokeWidth="3"/>
        <circle cx="100" cy="70" r="12" fill="white" stroke="#8B5E3C" strokeWidth="3"/>
        <circle cx="60" cy="71" r="8" fill="#3D2010"/>
        <circle cx="100" cy="71" r="8" fill="#3D2010"/>
        <circle cx="63" cy="67" r="3" fill="white"/>
        <circle cx="103" cy="67" r="3" fill="white"/>
        <ellipse cx="80" cy="85" rx="9" ry="6.5" fill="#2D1808" stroke="#8B5E3C" strokeWidth="2"/>
        <ellipse cx="76" cy="85.5" rx="2.5" ry="1.8" fill="#1A0A04"/>
        <ellipse cx="84" cy="85.5" rx="2.5" ry="1.8" fill="#1A0A04"/>
        <path d="M72 93 Q80 100 88 93" stroke="#8B5E3C" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <ellipse cx="80" cy="99" rx="7" ry="5" fill="#FF9090" stroke="#8B5E3C" strokeWidth="2"/>
      </svg>),
    cat: (<svg width={s} height={s} viewBox="0 0 160 180" fill="none">
        <path d="M108 160 Q148 148 145 118 Q142 100 126 108" fill="#FFCF98" stroke="#8B5E3C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="44" y="118" width="72" height="52" rx="28" fill="#FFCF98" stroke="#8B5E3C" strokeWidth="4"/>
        <ellipse cx="40" cy="162" rx="14" ry="10" fill="#FFCF98" stroke="#8B5E3C" strokeWidth="3.5"/>
        <ellipse cx="35" cy="165" rx="5" ry="4" fill="#FFD8B0" stroke="#8B5E3C" strokeWidth="2.5"/>
        <ellipse cx="45" cy="167" rx="5" ry="4" fill="#FFD8B0" stroke="#8B5E3C" strokeWidth="2.5"/>
        <ellipse cx="120" cy="155" rx="13" ry="10" fill="#FFCF98" stroke="#8B5E3C" strokeWidth="3.5"/>
        <rect x="110" y="126" width="10" height="36" rx="3" fill="#FFE87A" stroke="#8B5E3C" strokeWidth="2.5" transform="rotate(15 115 144)"/>
        <polygon points="108,158 118,158 113,172" fill="#F5C040" stroke="#8B5E3C" strokeWidth="2" transform="rotate(15 113 165)"/>
        <rect x="110" y="126" width="10" height="8" rx="2" fill="#F0A0A0" stroke="#8B5E3C" strokeWidth="2" transform="rotate(15 115 130)"/>
        <path d="M38 52 Q30 20 58 40" fill="#FFCF98" stroke="#8B5E3C" strokeWidth="4" strokeLinejoin="round"/>
        <path d="M41 50 Q35 26 56 42" fill="#FFB0C8"/>
        <path d="M122 52 Q130 20 102 40" fill="#FFCF98" stroke="#8B5E3C" strokeWidth="4" strokeLinejoin="round"/>
        <path d="M119 50 Q125 26 104 42" fill="#FFB0C8"/>
        <ellipse cx="80" cy="72" rx="46" ry="43" fill="#FFE4C0" stroke="#8B5E3C" strokeWidth="4"/>
        <ellipse cx="46" cy="85" rx="12" ry="8" fill="#FFB3C6" opacity="0.65"/>
        <ellipse cx="114" cy="85" rx="12" ry="8" fill="#FFB3C6" opacity="0.65"/>
        <circle cx="60" cy="68" r="12" fill="white" stroke="#8B5E3C" strokeWidth="3"/>
        <circle cx="100" cy="68" r="12" fill="white" stroke="#8B5E3C" strokeWidth="3"/>
        <circle cx="60" cy="69" r="8" fill="#2A4A20"/>
        <circle cx="100" cy="69" r="8" fill="#2A4A20"/>
        <circle cx="63" cy="65" r="3" fill="white"/>
        <circle cx="103" cy="65" r="3" fill="white"/>
        <path d="M76 82 L80 86 L84 82" fill="#FF9EB5" stroke="#8B5E3C" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M74 88 Q80 94 86 88" stroke="#8B5E3C" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <line x1="14" y1="82" x2="64" y2="85" stroke="#8B5E3C" strokeWidth="1.8" strokeLinecap="round" opacity="0.55"/>
        <line x1="14" y1="89" x2="64" y2="89" stroke="#8B5E3C" strokeWidth="1.8" strokeLinecap="round" opacity="0.55"/>
        <line x1="96" y1="85" x2="146" y2="82" stroke="#8B5E3C" strokeWidth="1.8" strokeLinecap="round" opacity="0.55"/>
        <line x1="96" y1="89" x2="146" y2="89" stroke="#8B5E3C" strokeWidth="1.8" strokeLinecap="round" opacity="0.55"/>
      </svg>),
    fox: (<svg width={s} height={s} viewBox="0 0 160 180" fill="none">
        <ellipse cx="128" cy="148" rx="28" ry="20" fill="#F0A060" stroke="#8B5E3C" strokeWidth="4" transform="rotate(-30 128 148)"/>
        <ellipse cx="128" cy="148" rx="16" ry="11" fill="#FFF0E0" stroke="#8B5E3C" strokeWidth="2.5" transform="rotate(-30 128 148)"/>
        <rect x="44" y="118" width="72" height="52" rx="28" fill="#F0A868" stroke="#8B5E3C" strokeWidth="4"/>
        <ellipse cx="40" cy="160" rx="14" ry="10" fill="#F0A868" stroke="#8B5E3C" strokeWidth="3.5"/>
        <ellipse cx="118" cy="148" rx="13" ry="10" fill="#F0A868" stroke="#8B5E3C" strokeWidth="3.5"/>
        <ellipse cx="130" cy="140" rx="12" ry="14" fill="#F8F0FF" stroke="#8B5E3C" strokeWidth="2.5"/>
        <ellipse cx="126" cy="126" rx="5" ry="9" fill="#F8F0FF" stroke="#8B5E3C" strokeWidth="2.5" transform="rotate(-8 126 126)"/>
        <ellipse cx="134" cy="126" rx="5" ry="9" fill="#F8F0FF" stroke="#8B5E3C" strokeWidth="2.5" transform="rotate(8 134 126)"/>
        <ellipse cx="126" cy="127" rx="2.5" ry="6" fill="#FFCCE0" transform="rotate(-8 126 127)"/>
        <ellipse cx="134" cy="127" rx="2.5" ry="6" fill="#FFCCE0" transform="rotate(8 134 127)"/>
        <circle cx="127" cy="137" r="2.5" fill="#FFB0C8" opacity="0.8"/>
        <circle cx="133" cy="137" r="2.5" fill="#FFB0C8" opacity="0.8"/>
        <ellipse cx="130" cy="142" rx="2" ry="1.5" fill="#FFB0C8"/>
        <path d="M36 50 Q26 16 56 34" fill="#D86030" stroke="#8B5E3C" strokeWidth="4" strokeLinejoin="round"/>
        <path d="M39 48 Q31 22 54 36" fill="#FFD4B0"/>
        <path d="M124 50 Q134 16 104 34" fill="#D86030" stroke="#8B5E3C" strokeWidth="4" strokeLinejoin="round"/>
        <path d="M121 48 Q129 22 106 36" fill="#FFD4B0"/>
        <ellipse cx="80" cy="72" rx="46" ry="44" fill="#F5A870" stroke="#8B5E3C" strokeWidth="4"/>
        <ellipse cx="80" cy="82" rx="30" ry="28" fill="#FFF0E0" stroke="#8B5E3C" strokeWidth="2.5"/>
        <ellipse cx="44" cy="84" rx="12" ry="8" fill="#FF9888" opacity="0.6"/>
        <ellipse cx="116" cy="84" rx="12" ry="8" fill="#FF9888" opacity="0.6"/>
        <circle cx="60" cy="68" r="12" fill="white" stroke="#8B5E3C" strokeWidth="3"/>
        <circle cx="100" cy="68" r="12" fill="white" stroke="#8B5E3C" strokeWidth="3"/>
        <circle cx="60" cy="69" r="8" fill="#2A1600"/>
        <circle cx="100" cy="69" r="8" fill="#2A1600"/>
        <circle cx="63" cy="65" r="3" fill="white"/>
        <circle cx="103" cy="65" r="3" fill="white"/>
        <circle cx="80" cy="83" r="5.5" fill="#2A1600" stroke="#8B5E3C" strokeWidth="2"/>
        <path d="M72 89 Q80 96 88 89" stroke="#8B5E3C" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <line x1="14" y1="84" x2="66" y2="85" stroke="#8B5E3C" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
        <line x1="14" y1="90" x2="66" y2="90" stroke="#8B5E3C" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
        <line x1="94" y1="85" x2="146" y2="84" stroke="#8B5E3C" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
        <line x1="94" y1="90" x2="146" y2="90" stroke="#8B5E3C" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
      </svg>),
    rabbit: (<svg width={s} height={s} viewBox="0 0 160 180" fill="none">
        <circle cx="114" cy="158" r="13" fill="white" stroke="#9A78C0" strokeWidth="3.5"/>
        <rect x="44" y="116" width="72" height="54" rx="30" fill="#F0E6FF" stroke="#9A78C0" strokeWidth="4"/>
        <ellipse cx="40" cy="160" rx="14" ry="10" fill="#F0E6FF" stroke="#9A78C0" strokeWidth="3.5"/>
        <ellipse cx="35" cy="163" rx="5" ry="4" fill="#F8F0FF" stroke="#9A78C0" strokeWidth="2.5"/>
        <ellipse cx="45" cy="165" rx="5" ry="4" fill="#F8F0FF" stroke="#9A78C0" strokeWidth="2.5"/>
        <ellipse cx="120" cy="154" rx="13" ry="10" fill="#F0E6FF" stroke="#9A78C0" strokeWidth="3.5"/>
        <rect x="114" y="126" width="10" height="34" rx="4" fill="#FF9A50" stroke="#8B5E3C" strokeWidth="2.5" transform="rotate(12 119 143)"/>
        <polygon points="112,156 122,156 117,170" fill="#FF7A30" stroke="#8B5E3C" strokeWidth="2" transform="rotate(12 117 163)"/>
        <path d="M116 128 Q119 124 122 128" fill="#78C860" stroke="#5A9A40" strokeWidth="2"/>
        <path d="M119 124 Q122 118 118 122" fill="#78C860" stroke="#5A9A40" strokeWidth="1.5"/>
        <ellipse cx="52" cy="28" rx="14" ry="30" fill="#F0E6FF" stroke="#9A78C0" strokeWidth="4" transform="rotate(-8 52 28)"/>
        <ellipse cx="52" cy="28" rx="7.5" ry="22" fill="#FFB8D4" transform="rotate(-8 52 28)"/>
        <ellipse cx="108" cy="28" rx="14" ry="30" fill="#F0E6FF" stroke="#9A78C0" strokeWidth="4" transform="rotate(8 108 28)"/>
        <ellipse cx="108" cy="28" rx="7.5" ry="22" fill="#FFB8D4" transform="rotate(8 108 28)"/>
        <ellipse cx="80" cy="76" rx="44" ry="42" fill="#F8F0FF" stroke="#9A78C0" strokeWidth="4"/>
        <ellipse cx="46" cy="88" rx="12" ry="8" fill="#FFB0C8" opacity="0.65"/>
        <ellipse cx="114" cy="88" rx="12" ry="8" fill="#FFB0C8" opacity="0.65"/>
        <circle cx="60" cy="70" r="12" fill="white" stroke="#9A78C0" strokeWidth="3"/>
        <circle cx="100" cy="70" r="12" fill="white" stroke="#9A78C0" strokeWidth="3"/>
        <circle cx="60" cy="71" r="8" fill="#7030A0"/>
        <circle cx="100" cy="71" r="8" fill="#7030A0"/>
        <circle cx="63" cy="67" r="3" fill="white"/>
        <circle cx="103" cy="67" r="3" fill="white"/>
        <path d="M76 84 L80 88 L84 84" fill="#FFB0C8" stroke="#9A78C0" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M74 90 Q80 96 86 90" stroke="#9A78C0" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <line x1="14" y1="86" x2="64" y2="87" stroke="#9A78C0" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
        <line x1="14" y1="92" x2="64" y2="92" stroke="#9A78C0" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
        <line x1="96" y1="87" x2="146" y2="86" stroke="#9A78C0" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
        <line x1="96" y1="92" x2="146" y2="92" stroke="#9A78C0" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
      </svg>),
    sheep: (<svg width={s} height={s} viewBox="0 0 160 180" fill="none">
        <rect x="50" y="160" width="16" height="20" rx="8" fill="#EAD0B0" stroke="#8B6A50" strokeWidth="3.5"/>
        <rect x="94" y="160" width="16" height="20" rx="8" fill="#EAD0B0" stroke="#8B6A50" strokeWidth="3.5"/>
        <circle cx="52" cy="148" r="24" fill="#F5F0E8" stroke="#8B6A50" strokeWidth="3.5"/>
        <circle cx="80" cy="142" r="26" fill="#FAF7F2" stroke="#8B6A50" strokeWidth="3.5"/>
        <circle cx="108" cy="148" r="24" fill="#F5F0E8" stroke="#8B6A50" strokeWidth="3.5"/>
        <circle cx="60" cy="132" r="22" fill="#F0EDE6" stroke="#8B6A50" strokeWidth="3"/>
        <circle cx="100" cy="132" r="22" fill="#F0EDE6" stroke="#8B6A50" strokeWidth="3"/>
        <circle cx="80" cy="124" r="20" fill="#F5F2EE" stroke="#8B6A50" strokeWidth="3"/>
        <ellipse cx="32" cy="76" rx="12" ry="9" fill="#EAD0B0" stroke="#8B6A50" strokeWidth="3.5" transform="rotate(-25 32 76)"/>
        <ellipse cx="128" cy="76" rx="12" ry="9" fill="#EAD0B0" stroke="#8B6A50" strokeWidth="3.5" transform="rotate(25 128 76)"/>
        <ellipse cx="80" cy="70" rx="44" ry="42" fill="#EED8B8" stroke="#8B6A50" strokeWidth="4"/>
        <ellipse cx="46" cy="82" rx="12" ry="8" fill="#FFB8B8" opacity="0.6"/>
        <ellipse cx="114" cy="82" rx="12" ry="8" fill="#FFB8B8" opacity="0.6"/>
        <circle cx="60" cy="64" r="12" fill="white" stroke="#8B6A50" strokeWidth="3"/>
        <circle cx="100" cy="64" r="12" fill="white" stroke="#8B6A50" strokeWidth="3"/>
        <circle cx="60" cy="65" r="8" fill="#2A3820"/>
        <circle cx="100" cy="65" r="8" fill="#2A3820"/>
        <circle cx="63" cy="61" r="3" fill="white"/>
        <circle cx="103" cy="61" r="3" fill="white"/>
        <path d="M76 80 L80 84 L84 80" fill="#C8A8A0" stroke="#8B6A50" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M74 86 Q80 92 86 86" stroke="#8B6A50" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <circle cx="80" cy="38" r="11" fill="#F5F2EE" stroke="#8B6A50" strokeWidth="3"/>
        <circle cx="68" cy="42" r="9" fill="#F0EDE6" stroke="#8B6A50" strokeWidth="2.5"/>
        <circle cx="92" cy="42" r="9" fill="#F0EDE6" stroke="#8B6A50" strokeWidth="2.5"/>
      </svg>),
    panda: (<svg width={s} height={s} viewBox="0 0 160 180" fill="none">
        <rect x="44" y="118" width="72" height="54" rx="30" fill="#F0F0EC" stroke="#3A3A3A" strokeWidth="4"/>
        <ellipse cx="40" cy="162" rx="14" ry="10" fill="#3A3A3A" stroke="#3A3A3A" strokeWidth="3"/>
        <ellipse cx="120" cy="152" rx="13" ry="10" fill="#3A3A3A" stroke="#3A3A3A" strokeWidth="3"/>
        <rect x="108" y="132" width="34" height="28" rx="5" fill="#D4F0B0" stroke="#3A3A3A" strokeWidth="3"/>
        <rect x="108" y="132" width="9" height="28" rx="4" fill="#88C860" stroke="#3A3A3A" strokeWidth="2.5"/>
        <ellipse cx="112.5" cy="140" rx="2" ry="2" fill="#5A9A30"/>
        <ellipse cx="112.5" cy="148" rx="2" ry="2" fill="#5A9A30"/>
        <ellipse cx="112.5" cy="156" rx="2" ry="2" fill="#5A9A30"/>
        <line x1="121" y1="140" x2="136" y2="140" stroke="#3A3A3A" strokeWidth="1.5" opacity="0.4"/>
        <line x1="121" y1="147" x2="136" y2="147" stroke="#3A3A3A" strokeWidth="1.5" opacity="0.4"/>
        <line x1="121" y1="154" x2="136" y2="154" stroke="#3A3A3A" strokeWidth="1.5" opacity="0.4"/>
        <circle cx="34" cy="38" r="20" fill="#3A3A3A" stroke="#3A3A3A" strokeWidth="3"/>
        <circle cx="126" cy="38" r="20" fill="#3A3A3A" stroke="#3A3A3A" strokeWidth="3"/>
        <circle cx="80" cy="74" r="46" fill="white" stroke="#3A3A3A" strokeWidth="4"/>
        <ellipse cx="54" cy="65" rx="16" ry="16" fill="#3A3A3A"/>
        <ellipse cx="106" cy="65" rx="16" ry="16" fill="#3A3A3A"/>
        <ellipse cx="80" cy="88" rx="20" ry="14" fill="#F5F0EA" stroke="#3A3A3A" strokeWidth="2.5"/>
        <ellipse cx="38" cy="90" rx="12" ry="8" fill="#FFB3C0" opacity="0.65"/>
        <ellipse cx="122" cy="90" rx="12" ry="8" fill="#FFB3C0" opacity="0.65"/>
        <circle cx="54" cy="65" r="10" fill="white"/>
        <circle cx="106" cy="65" r="10" fill="white"/>
        <circle cx="54" cy="66" r="7" fill="#1A1A1A"/>
        <circle cx="106" cy="66" r="7" fill="#1A1A1A"/>
        <circle cx="57" cy="63" r="2.8" fill="white"/>
        <circle cx="109" cy="63" r="2.8" fill="white"/>
        <path d="M76 83 L80 87 L84 83" fill="#3A3A3A" stroke="#3A3A3A" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M73 90 Q80 97 87 90" stroke="#3A3A3A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </svg>),
    parrot: (<svg width={s} height={s} viewBox="0 0 160 180" fill="none">
        <ellipse cx="80" cy="138" rx="40" ry="36" fill="#A8EEB8" stroke="#4A9A5A" strokeWidth="4"/>
        <ellipse cx="36" cy="140" rx="18" ry="28" fill="#80D890" stroke="#4A9A5A" strokeWidth="3.5" transform="rotate(15 36 140)"/>
        <ellipse cx="36" cy="140" rx="10" ry="18" fill="#C0F4C8" transform="rotate(15 36 140)"/>
        <ellipse cx="124" cy="140" rx="18" ry="28" fill="#80D890" stroke="#4A9A5A" strokeWidth="3.5" transform="rotate(-15 124 140)"/>
        <ellipse cx="124" cy="140" rx="10" ry="18" fill="#C0F4C8" transform="rotate(-15 124 140)"/>
        <path d="M64 172 Q58 178 52 174 M64 172 Q64 180 58 180 M64 172 Q70 178 66 182" stroke="#4A9A5A" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M96 172 Q90 178 84 174 M96 172 Q96 180 90 180 M96 172 Q102 178 98 182" stroke="#4A9A5A" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <ellipse cx="62" cy="28" rx="8" ry="16" fill="#80D890" stroke="#4A9A5A" strokeWidth="3.5" transform="rotate(-18 62 28)"/>
        <ellipse cx="80" cy="22" rx="8" ry="17" fill="#A8EEB8" stroke="#4A9A5A" strokeWidth="3.5"/>
        <ellipse cx="98" cy="28" rx="8" ry="16" fill="#B8F4C0" stroke="#4A9A5A" strokeWidth="3.5" transform="rotate(18 98 28)"/>
        <circle cx="80" cy="72" r="44" fill="#B8F0C0" stroke="#4A9A5A" strokeWidth="4"/>
        <ellipse cx="44" cy="84" rx="14" ry="10" fill="#FFE87A" opacity="0.88"/>
        <ellipse cx="116" cy="84" rx="14" ry="10" fill="#FFE87A" opacity="0.88"/>
        <circle cx="60" cy="66" r="12" fill="white" stroke="#4A9A5A" strokeWidth="3"/>
        <circle cx="100" cy="66" r="12" fill="white" stroke="#4A9A5A" strokeWidth="3"/>
        <circle cx="60" cy="67" r="8" fill="#1A1A1A"/>
        <circle cx="100" cy="67" r="8" fill="#1A1A1A"/>
        <circle cx="63" cy="63" r="3" fill="white"/>
        <circle cx="103" cy="63" r="3" fill="white"/>
        <path d="M66 82 Q80 96 94 82 Q80 90 66 82Z" fill="#F5C040" stroke="#4A9A5A" strokeWidth="2.5" strokeLinejoin="round"/>
      </svg>),
    husky: (<svg width={s} height={s} viewBox="0 0 160 180" fill="none">
        <ellipse cx="122" cy="152" rx="26" ry="18" fill="#D0DCE8" stroke="#7A90A8" strokeWidth="4" transform="rotate(-20 122 152)"/>
        <ellipse cx="122" cy="152" rx="15" ry="10" fill="white" stroke="#7A90A8" strokeWidth="2.5" transform="rotate(-20 122 152)"/>
        <rect x="44" y="118" width="72" height="52" rx="28" fill="#D8E4EE" stroke="#7A90A8" strokeWidth="4"/>
        <ellipse cx="40" cy="160" rx="14" ry="10" fill="#D8E4EE" stroke="#7A90A8" strokeWidth="3.5"/>
        <ellipse cx="35" cy="163" rx="5" ry="4" fill="#E8F0F8" stroke="#7A90A8" strokeWidth="2.5"/>
        <ellipse cx="45" cy="165" rx="5" ry="4" fill="#E8F0F8" stroke="#7A90A8" strokeWidth="2.5"/>
        <ellipse cx="110" cy="160" rx="14" ry="10" fill="#D8E4EE" stroke="#7A90A8" strokeWidth="3.5"/>
        <ellipse cx="105" cy="163" rx="5" ry="4" fill="#E8F0F8" stroke="#7A90A8" strokeWidth="2.5"/>
        <ellipse cx="115" cy="165" rx="5" ry="4" fill="#E8F0F8" stroke="#7A90A8" strokeWidth="2.5"/>
        <path d="M36 50 Q26 18 54 34" fill="#9AB0C4" stroke="#7A90A8" strokeWidth="4" strokeLinejoin="round"/>
        <path d="M39 48 Q31 24 52 36" fill="#F0F4F8"/>
        <path d="M124 50 Q134 18 106 34" fill="#9AB0C4" stroke="#7A90A8" strokeWidth="4" strokeLinejoin="round"/>
        <path d="M121 48 Q129 24 108 36" fill="#F0F4F8"/>
        <ellipse cx="80" cy="72" rx="46" ry="44" fill="#EEF2F6" stroke="#7A90A8" strokeWidth="4"/>
        <ellipse cx="80" cy="54" rx="34" ry="22" fill="#B8CAD8" opacity="0.7"/>
        <ellipse cx="56" cy="70" rx="18" ry="16" fill="white"/>
        <ellipse cx="104" cy="70" rx="18" ry="16" fill="white"/>
        <ellipse cx="80" cy="88" rx="22" ry="15" fill="white" stroke="#7A90A8" strokeWidth="2.5"/>
        <ellipse cx="38" cy="84" rx="12" ry="8" fill="#FFB8C8" opacity="0.5"/>
        <ellipse cx="122" cy="84" rx="12" ry="8" fill="#FFB8C8" opacity="0.5"/>
        <circle cx="56" cy="68" r="12" fill="white" stroke="#7A90A8" strokeWidth="3"/>
        <circle cx="104" cy="68" r="12" fill="white" stroke="#7A90A8" strokeWidth="3"/>
        <circle cx="56" cy="69" r="8" fill="#70C0E8"/>
        <circle cx="104" cy="69" r="8" fill="#70C0E8"/>
        <circle cx="56" cy="69" r="4.5" fill="#182838"/>
        <circle cx="104" cy="69" r="4.5" fill="#182838"/>
        <circle cx="58.5" cy="66.5" r="2.5" fill="white"/>
        <circle cx="106.5" cy="66.5" r="2.5" fill="white"/>
        <ellipse cx="80" cy="84" rx="8" ry="5.5" fill="#2A2A2A" stroke="#7A90A8" strokeWidth="2"/>
        <path d="M72 91 Q80 97 88 91" stroke="#7A90A8" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </svg>),
  };
  return animals[id] ? <>{animals[id]}</> : <>{animals.cat}</>;
};

// ── Drawing Canvas Component ───────────────────────────────────────────────────
function DrawingCanvas({ lang, palette, notes, setNotes, activeNote, setActiveNote }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#c47a5a");
  const [size, setSize] = useState(4);
  const [history, setHistory] = useState([]);
  const lastPos = useRef(null);

  const COLORS = ["#c47a5a","#e91e8c","#3b82f6","#22c55e","#f59e0b","#8b5cf6","#000000","#ffffff"];
  const SIZES = [2,4,8,14];

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: (src.clientX - rect.left) * (canvas.width / rect.width), y: (src.clientY - rect.top) * (canvas.height / rect.height) };
  };

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setHistory(h => [...h.slice(-19), canvas.toDataURL()]);
  };

  const startDraw = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    saveHistory();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    lastPos.current = pos;
    setIsDrawing(true);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.lineWidth = tool === "eraser" ? size * 4 : size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = tool === "eraser" ? "#fffdf8" : color;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    lastPos.current = pos;
  };

  const stopDraw = (e) => {
    e?.preventDefault();
    setIsDrawing(false);
    lastPos.current = null;
    // Save drawing to note
    const canvas = canvasRef.current;
    if (canvas && activeNote) {
      setNotes(prev => prev.map(n => n.id === activeNote ? {...n, drawing: canvas.toDataURL()} : n));
    }
  };

  const undo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const prev = history[history.length - 1];
    const img = new Image();
    img.onload = () => { ctx.clearRect(0,0,canvas.width,canvas.height); ctx.drawImage(img,0,0); };
    img.src = prev;
    setHistory(h => h.slice(0,-1));
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    saveHistory();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (activeNote) setNotes(prev => prev.map(n => n.id === activeNote ? {...n, drawing: null} : n));
  };

  // Load saved drawing when note changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const note = notes.find(n => n.id === activeNote);
    if (note?.drawing) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = note.drawing;
    }
  }, [activeNote]);

  // If no active note, show list of drawing notes + new button
  if (!activeNote) {
    const drawingNotes = notes.filter(n => n.type === "drawing");
    return (
      <div>
        <button onClick={() => {
          const n = {id:Date.now(), title:"", content:"", type:"drawing", drawing:null, date:new Date().toLocaleDateString()};
          setNotes(prev => [...prev, n]);
          setActiveNote(n.id);
        }} style={{
          width:"100%", background:`linear-gradient(135deg,${palette.accent},${palette.accentBlue})`,
          color:"white", border:"none", borderRadius:14, padding:"12px", cursor:"pointer",
          fontSize:14, fontWeight:700, marginBottom:12,
        }}>✏️ {lang==="zh"?"新建手写笔记":"New Drawing Note"}</button>
        {drawingNotes.length === 0 && (
          <div style={{textAlign:"center",color:palette.textLight,padding:"32px 0",fontSize:14}}>
            {lang==="zh"?"还没有手写笔记":"No drawing notes yet"}
          </div>
        )}
        {drawingNotes.map(n => (
          <div key={n.id} onClick={() => setActiveNote(n.id)} style={{
            background:palette.white, borderRadius:16, marginBottom:10, cursor:"pointer",
            boxShadow:`0 2px 8px ${palette.shadow}`, overflow:"hidden",
          }}>
            {n.drawing
              ? <img src={n.drawing} alt="" style={{width:"100%",height:100,objectFit:"cover",display:"block"}}/>
              : <div style={{height:100,background:"#fdf6f0",display:"flex",alignItems:"center",justifyContent:"center",color:palette.textLight,fontSize:13}}>✏️ {lang==="zh"?"空白画布":"Empty canvas"}</div>
            }
            <div style={{padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontWeight:600,color:palette.text,fontSize:14}}>{n.title || (lang==="zh"?"无标题":"Untitled")}</span>
              <span style={{fontSize:11,color:palette.textLight}}>{n.date}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{background:palette.white, borderRadius:20, padding:14, boxShadow:`0 4px 16px ${palette.shadow}`}}>
      {/* Title */}
      <input
        value={notes.find(n=>n.id===activeNote)?.title||""}
        onChange={e => setNotes(prev=>prev.map(n=>n.id===activeNote?{...n,title:e.target.value}:n))}
        placeholder={lang==="zh"?"笔记标题...":"Note title..."}
        style={{width:"100%",border:"none",outline:"none",fontSize:16,fontWeight:700,color:palette.text,background:"transparent",marginBottom:10,boxSizing:"border-box"}}
      />

      {/* Toolbar */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginBottom:10,padding:"8px 10px",background:palette.khaki,borderRadius:12}}>
        {/* Tool toggle */}
        <button onClick={() => setTool("pen")} style={{
          padding:"5px 10px", borderRadius:8, border:`2px solid ${tool==="pen"?palette.accent:"transparent"}`,
          background:tool==="pen"?palette.pink:"transparent", cursor:"pointer", fontSize:14,
        }}>🖊️</button>
        <button onClick={() => setTool("eraser")} style={{
          padding:"5px 10px", borderRadius:8, border:`2px solid ${tool==="eraser"?palette.accent:"transparent"}`,
          background:tool==="eraser"?palette.pink:"transparent", cursor:"pointer", fontSize:14,
        }}>🧹</button>

        {/* Divider */}
        <div style={{width:1,height:24,background:palette.pinkMid,margin:"0 2px"}}/>

        {/* Colors */}
        {COLORS.map(c => (
          <button key={c} onClick={() => { setColor(c); setTool("pen"); }} style={{
            width:20, height:20, borderRadius:"50%", background:c, border:`2.5px solid ${color===c?"#333":"#ddd"}`,
            cursor:"pointer", padding:0, flexShrink:0,
          }}/>
        ))}

        {/* Divider */}
        <div style={{width:1,height:24,background:palette.pinkMid,margin:"0 2px"}}/>

        {/* Sizes */}
        {SIZES.map(sz => (
          <button key={sz} onClick={() => setSize(sz)} style={{
            width:sz+12, height:sz+12, borderRadius:"50%", background:color,
            border:`2px solid ${size===sz?"#333":"transparent"}`, cursor:"pointer", padding:0, flexShrink:0,
          }}/>
        ))}

        {/* Divider */}
        <div style={{width:1,height:24,background:palette.pinkMid,margin:"0 2px"}}/>

        {/* Undo & Clear */}
        <button onClick={undo} title="Undo" style={{padding:"5px 8px",borderRadius:8,border:"none",background:"transparent",cursor:"pointer",fontSize:14}}>↩️</button>
        <button onClick={clearCanvas} title="Clear" style={{padding:"5px 8px",borderRadius:8,border:"none",background:"transparent",cursor:"pointer",fontSize:14}}>🗑️</button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={800} height={500}
        onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
        onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
        style={{
          width:"100%", height:280, borderRadius:12, display:"block",
          background:"#fffdf8", border:`1.5px solid ${palette.pinkMid}`,
          cursor: tool==="eraser"?"cell":"crosshair", touchAction:"none",
        }}
      />

      {/* Back */}
      <button onClick={() => setActiveNote(null)} style={{
        marginTop:10, background:palette.pink, border:"none", borderRadius:10,
        padding:"8px 16px", cursor:"pointer", fontSize:13, color:palette.text,
      }}>← {lang==="zh"?"返回":"Back"}</button>
    </div>
  );
}

export default function StudyApp() {
  const [lang, setLang] = useState("en");
  const T = LANG[lang];
  const [tab, setTab] = useState(0);
  const [totalPoints, setTotalPoints] = useState(500);
  const [showSettings, setShowSettings] = useState(false);

  // Timer state
  const [timerMode, setTimerMode] = useState("stopwatch");
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [countdownTarget, setCountdownTarget] = useState(25);
  const [countdown, setCountdown] = useState(25 * 60);
  const [selectedAnimal, setSelectedAnimal] = useState("cat");
  const [animalFrame, setAnimalFrame] = useState(0);
  const [sessionPoints, setSessionPoints] = useState(0);
  const [blockedApps, setBlockedApps] = useState(T.timer.blockedApps);
  const [newBlockedApp, setNewBlockedApp] = useState("");
  const [showBlockWarning, setShowBlockWarning] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [showAnimalSelect, setShowAnimalSelect] = useState(false);
  const [unlockedAnimals, setUnlockedAnimals] = useState(
    ANIMALS.reduce((acc,a) => ({...acc,[a.id]:a.unlocked}),{})
  );

  // Notes state
  const [notes, setNotes] = useState([
    {id:1, title:"My First Note", content:"Welcome to StudyPaw🐾! 📚", type:"text", date: new Date().toLocaleDateString()}
  ]);
  const [activeNote, setActiveNote] = useState(null);
  const [noteMode, setNoteMode] = useState("text");
  const [mindmapNodes, setMindmapNodes] = useState([
    {id:1,text:"Center",x:50,y:50,parent:null,color:"#f9a8d4"},
    {id:2,text:"Idea 1",x:25,y:25,parent:1,color:"#bfdbfe"},
    {id:3,text:"Idea 2",x:75,y:25,parent:1,color:"#bbf7d0"},
  ]);
  const [newNodeText, setNewNodeText] = useState("");
  const [selectedNode, setSelectedNode] = useState(1);

  // Drawing canvas state — handled inside DrawingCanvas component


  const [tasks, setTasks] = useState([
    {id:1,text:"Review Chapter 3",done:false,due:"",createdAt:new Date()},
    {id:2,text:"Practice problems",done:false,due:"",createdAt:new Date()},
  ]);
  const [newTask, setNewTask] = useState("");
  const [newDue, setNewDue] = useState("");

  // Sleep state
  const [sleepLogs, setSleepLogs] = useState([
    {id:1,date:"Mon",dateStr:"3/1",duration:7.5,quality:"good"},
    {id:2,date:"Tue",dateStr:"3/2",duration:6,quality:"fair"},
    {id:3,date:"Wed",dateStr:"3/3",duration:8.5,quality:"great"},
    {id:4,date:"Thu",dateStr:"3/4",duration:5,quality:"poor"},
    {id:5,date:"Fri",dateStr:"3/5",duration:8,quality:"good"},
  ]);
  const [bedtime, setBedtime] = useState("22:00");
  const [wakeup, setWakeup] = useState("06:30");
  const [sleepQuality, setSleepQuality] = useState("good");

  // Pets state
  const [activePet, setActivePet] = useState("cat");
  const [petOutfit, setPetOutfit] = useState({cat:"none",dog:"none"});
  const [petHunger, setPetHunger] = useState({cat:70,dog:80});
  const [petHappy, setPetHappy] = useState({cat:85,dog:90});
  const [petLevel, setPetLevel] = useState({cat:3,dog:2});
  const [currentHome, setCurrentHome] = useState("basic");
  const [petShopTab, setPetShopTab] = useState("outfits");
  const [petsTab, setPetsTab] = useState("home");
  const [ownedOutfits, setOwnedOutfits] = useState(["none"]);
  const [ownedFoods, setOwnedFoods] = useState([]);
  const [ownedHomes, setOwnedHomes] = useState(["basic"]);
  const [petAnim, setPetAnim] = useState(false);

  const timerRef = useRef(null);
  const animalRef = useRef(null);
  const prevElapsedRef = useRef(0);

  // Animal animation
  useEffect(() => {
    animalRef.current = setInterval(() => {
      setAnimalFrame(f => (f+1) % 4);
    }, running ? 600 : 2000);
    return () => clearInterval(animalRef.current);
  }, [running]);

  // Timer tick
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        if (timerMode === "stopwatch") {
          setElapsed(e => {
            const ne = e + 1;
            const prev = prevElapsedRef.current;
            // Award points: 5 per 30min, 10 per 60min (additive)
            if (ne % 3600 === 0) {
              setSessionPoints(p => p + 10);
              setTotalPoints(p => p + 10);
            } else if (ne % 1800 === 0) {
              setSessionPoints(p => p + 5);
              setTotalPoints(p => p + 5);
            }
            prevElapsedRef.current = ne;
            return ne;
          });
        } else {
          setCountdown(c => {
            if (c <= 1) {
              clearInterval(timerRef.current);
              setRunning(false);
              setTimerDone(true);
              const mins = countdownTarget;
              const pts = Math.floor(mins / 30) * 5 + Math.floor(mins / 60) * 5;
              setSessionPoints(p => p + pts);
              setTotalPoints(p => p + pts);
              return 0;
            }
            return c - 1;
          });
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running, timerMode]);

  // Update blocked apps when lang changes
  useEffect(() => {
    setBlockedApps(T.timer.blockedApps);
  }, [lang]);

  const formatTime = (s) => {
    const h = Math.floor(s/3600);
    const m = Math.floor((s%3600)/60);
    const sec = s % 60;
    return h > 0
      ? `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`
      : `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  const handleStart = () => {
    if (!running) {
      setShowBlockWarning(true);
      setTimeout(() => setShowBlockWarning(false), 3000);
    }
    setRunning(r => !r);
    setTimerDone(false);
  };

  const handleReset = () => {
    setRunning(false);
    setElapsed(0);
    setCountdown(countdownTarget * 60);
    setSessionPoints(0);
    prevElapsedRef.current = 0;
    setTimerDone(false);
  };

  const animal = ANIMALS.find(a => a.id === selectedAnimal) || ANIMALS[0];

  // ── Task helpers ─────────────────────────────────────────────────────────
  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(t => [...t, {id:Date.now(),text:newTask,done:false,due:newDue,createdAt:new Date()}]);
    setNewTask(""); setNewDue("");
  };
  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      if (!t.done) {
        const now = new Date();
        const due = t.due ? new Date(t.due+"T23:59") : null;
        const onTime = !due || now <= due;
        if (onTime) { setTotalPoints(p => p+10); }
        return {...t, done:true};
      }
      return {...t, done:false};
    }));
  };

  // ── Sleep helpers ─────────────────────────────────────────────────────────
  const logSleep = () => {
    const [bh,bm] = bedtime.split(":").map(Number);
    const [wh,wm] = wakeup.split(":").map(Number);
    let dur = (wh*60+wm) - (bh*60+bm);
    if (dur < 0) dur += 24*60;
    const hours = +(dur/60).toFixed(1);
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const now = new Date();
    const dateStr = `${now.getMonth()+1}/${now.getDate()}`;
    setSleepLogs(l => [...l.slice(-6), {id:Date.now(),date:days[now.getDay()],dateStr,duration:hours,quality:sleepQuality}]);
  };

  // ── Pet helpers ───────────────────────────────────────────────────────────
  const buyItem = (type, item) => {
    if (totalPoints < item.cost) return;
    setTotalPoints(p => p - item.cost);
    if (type === "outfit") setOwnedOutfits(o => [...o, item.id]);
    if (type === "food") setOwnedFoods(o => [...o, item.id]);
    if (type === "home") { setOwnedHomes(o => [...o, item.id]); }
  };
  const wearOutfit = (outfitId) => {
    setPetOutfit(o => ({...o,[activePet]:outfitId}));
  };
  const feedPet = (food) => {
    if (!ownedFoods.includes(food.id)) return;
    setOwnedFoods(f => { const i = f.indexOf(food.id); if(i===-1) return f; return [...f.slice(0,i),...f.slice(i+1)]; });
    setPetHunger(h => ({...h,[activePet]:Math.min(100,(h[activePet]||70)+food.hunger)}));
    setPetHappy(h => ({...h,[activePet]:Math.min(100,(h[activePet]||80)+food.happy)}));
    setPetAnim(true); setTimeout(() => setPetAnim(false), 800);
  };
  const unlockAnimal = (animal) => {
    if (totalPoints < animal.cost) return;
    setTotalPoints(p => p - animal.cost);
    setUnlockedAnimals(u => ({...u,[animal.id]:true}));
    setPetHunger(h => ({...h,[animal.id]:70}));
    setPetHappy(h => ({...h,[animal.id]:80}));
    setPetLevel(l => ({...l,[animal.id]:1}));
    setPetOutfit(o => ({...o,[animal.id]:"none"}));
  };

  const homeData = HOMES.find(h => h.id === currentHome) || HOMES[0];
  const petEmoji = ANIMALS.find(a => a.id === activePet)?.emoji || "🐱";
  const outfitEmoji = OUTFITS.find(o => o.id === (petOutfit[activePet]||"none"))?.emoji || "";
  const outfitLabel = outfitEmoji === "👕" ? "" : outfitEmoji;

  const qualColors = {poor:"#fca5a5",fair:"#fde68a",good:"#86efac",great:"#6ee7b7"};

  // ── Pastel palette ────────────────────────────────────────────────────────
  const palette = {
    khaki: "#e8dfc8",
    khakiLight: "#f5f0e8",
    pink: "#fce4ec",
    pinkMid: "#f8bbd0",
    blue: "#e3f2fd",
    blueMid: "#bbdefb",
    accent: "#f48fb1",
    accentBlue: "#90caf9",
    text: "#5d4037",
    textLight: "#8d6e63",
    white: "#fffdf8",
    shadow: "rgba(180,140,120,0.15)",
  };

  const tabIcons = ["⏱","📝","✅","🌙","🐾"];

  return (
    <div style={{
      minHeight:"100vh", background:`linear-gradient(135deg, ${palette.khaki} 0%, ${palette.pink} 50%, ${palette.blue} 100%)`,
      fontFamily:"'Nunito', 'Varela Round', sans-serif", display:"flex", flexDirection:"column", alignItems:"center",
      padding:"0 0 120px 0",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Varela+Round&display=swap');`}</style>
      {/* Header */}
      <div style={{
        width:"100%", maxWidth:480, padding:"20px 20px 0",
        display:"flex", justifyContent:"space-between", alignItems:"center",
      }}>
        <div>
          <h1 style={{margin:0,fontSize:26,color:palette.text,fontWeight:700,letterSpacing:1}}>
            {T.appName}
          </h1>
          <p style={{margin:"2px 0 0",fontSize:12,color:palette.textLight}}>
            {T.yourPoints}: <b style={{color:"#e91e8c"}}>{totalPoints}</b> {lang==="zh"?"分":"pts"}
          </p>
        </div>
        <button onClick={() => setShowSettings(s => !s)} style={{
          background:palette.white, border:"none", borderRadius:12, padding:"8px 12px",
          cursor:"pointer", fontSize:18, boxShadow:`0 2px 8px ${palette.shadow}`,
        }}>⚙️</button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div style={{
          position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:100,
          display:"flex",alignItems:"center",justifyContent:"center",
        }} onClick={() => setShowSettings(false)}>
          <div style={{
            background:palette.white,borderRadius:20,padding:28,minWidth:260,
            boxShadow:"0 8px 32px rgba(0,0,0,0.15)",
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{margin:"0 0 16px",color:palette.text}}>{T.settings}</h3>
            <p style={{color:palette.textLight,margin:"0 0 8px",fontSize:14}}>{T.language}</p>
            <div style={{display:"flex",gap:8}}>
              {["en","zh"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{
                  flex:1,padding:"10px",borderRadius:12,border:`2px solid ${lang===l?palette.accent:palette.pinkMid}`,
                  background:lang===l?palette.pink:palette.white,cursor:"pointer",
                  fontWeight:lang===l?700:400,color:palette.text,fontSize:14,
                }}>{l==="en"?"EN English":"CN 中文"}</button>
              ))}
            </div>
            <p style={{color:palette.textLight,margin:"16px 0 8px",fontSize:14}}>{T.timer.socialApps}</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
              {blockedApps.map((app,i) => (
                <span key={i} style={{
                  background:palette.pink,borderRadius:20,padding:"4px 10px",fontSize:12,color:"#c2185b",
                  display:"flex",alignItems:"center",gap:5,
                }}>
                  {app}
                  <button onClick={() => setBlockedApps(prev => prev.filter((_,j) => j!==i))} style={{
                    background:"none",border:"none",cursor:"pointer",color:"#c2185b",fontSize:13,
                    lineHeight:1,padding:0,fontWeight:700,
                  }}>×</button>
                </span>
              ))}
            </div>
            <div style={{display:"flex",gap:6}}>
              <input
                value={newBlockedApp}
                onChange={e => setNewBlockedApp(e.target.value)}
                onKeyDown={e => {
                  if (e.key==="Enter" && newBlockedApp.trim()) {
                    setBlockedApps(prev => [...prev, newBlockedApp.trim()]);
                    setNewBlockedApp("");
                  }
                }}
                placeholder={lang==="zh"?"添加应用...":"Add app..."}
                style={{flex:1,padding:"7px 12px",borderRadius:10,border:`1.5px solid ${palette.pinkMid}`,outline:"none",fontSize:13,color:palette.text,background:palette.white}}
              />
              <button onClick={() => {
                if (newBlockedApp.trim()) {
                  setBlockedApps(prev => [...prev, newBlockedApp.trim()]);
                  setNewBlockedApp("");
                }
              }} style={{
                background:palette.accent,color:"white",border:"none",borderRadius:10,
                padding:"7px 14px",cursor:"pointer",fontSize:13,fontWeight:700,
              }}>+</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{width:"100%",maxWidth:480,padding:"16px 16px 0",flex:1}}>

        {/* ── TIMER TAB ── */}
        {tab === 0 && (
          <div>
            {/* Mode Switch */}
            <div style={{display:"flex",background:palette.white,borderRadius:16,padding:4,marginBottom:16,boxShadow:`0 2px 8px ${palette.shadow}`}}>
              {[T.timer.stopwatch,T.timer.timer].map((m,i) => (
                <button key={i} onClick={() => {setTimerMode(i===0?"stopwatch":"countdown");handleReset();}} style={{
                  flex:1,padding:"10px",borderRadius:12,border:"none",cursor:"pointer",
                  background:((i===0&&timerMode==="stopwatch")||(i===1&&timerMode==="countdown"))?palette.pinkMid:"transparent",
                  fontWeight:600,color:palette.text,fontSize:14,transition:"all .2s",
                }}>{m}</button>
              ))}
            </div>

            {/* Clock Display */}
            <div style={{
              display:"flex", justifyContent:"center", marginBottom:16,
            }}>
              <div style={{
                background:palette.white,
                borderRadius:"50%",
                width:260, height:260,
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                boxShadow:`0 6px 24px ${palette.shadow}, 0 0 0 8px ${palette.pink}, 0 0 0 10px ${palette.pinkMid}`,
                position:"relative", overflow:"hidden",
                textAlign:"center",
              }}>
              {/* Decorative circles */}
              <div style={{position:"absolute",top:-16,right:-16,width:70,height:70,borderRadius:"50%",background:palette.pink,opacity:.35}}/>
              <div style={{position:"absolute",bottom:-12,left:-12,width:55,height:55,borderRadius:"50%",background:palette.blue,opacity:.45}}/>

              {/* Animal companion */}
              <div style={{
                fontSize:64, lineHeight:1, marginBottom:4,
                animation:running?"bounce 0.6s infinite alternate":"float 3s ease-in-out infinite",
                display:"inline-block",
                filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
                position:"relative", zIndex:1,
              }}>
                {animal.emoji}
              </div>
              <div style={{fontSize:11,color:palette.textLight,marginBottom:6,fontFamily:"monospace",position:"relative",zIndex:1}}>
                {animal.frames[animalFrame]}
              </div>

              {/* Time display */}
              <div style={{
                fontSize:42, fontWeight:700, letterSpacing:2,
                color:palette.text, fontFamily:"'Courier New',monospace",
                textShadow:"2px 2px 4px rgba(0,0,0,0.05)",
                position:"relative", zIndex:1,
              }}>
                {timerMode==="stopwatch" ? formatTime(elapsed) : formatTime(countdown)}
              </div>

              {timerDone && (
                <div style={{fontSize:14,marginTop:6,color:"#e91e8c",fontWeight:700,position:"relative",zIndex:1}}>
                  {T.timer.timerDone}
                </div>
              )}
              </div>
            </div>

            {/* Points display */}
            <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:16}}>
              <div style={{fontSize:12,color:palette.textLight,background:palette.white,borderRadius:20,padding:"6px 14px",boxShadow:`0 2px 8px ${palette.shadow}`}}>
                {T.timer.sessionPoints}: <b style={{color:"#e91e8c"}}>{sessionPoints}</b>
              </div>
              <div style={{fontSize:12,color:palette.textLight,background:palette.white,borderRadius:20,padding:"6px 14px",boxShadow:`0 2px 8px ${palette.shadow}`}}>
                {T.timer.totalPoints}: <b style={{color:"#e91e8c"}}>{totalPoints}</b>
              </div>
            </div>

            {/* Countdown setter */}
            {timerMode==="countdown" && !running && (
              <div style={{background:palette.white,borderRadius:16,padding:16,marginBottom:12,boxShadow:`0 2px 8px ${palette.shadow}`}}>
                <label style={{fontSize:13,color:palette.textLight,display:"block",marginBottom:8}}>{T.timer.setTimer}</label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {[5,10,15,25,30,45,60].map(m => (
                    <button key={m} onClick={() => {setCountdownTarget(m);setCountdown(m*60);}} style={{
                      padding:"6px 12px",borderRadius:10,border:`2px solid ${countdownTarget===m?palette.accent:palette.pinkMid}`,
                      background:countdownTarget===m?palette.pink:"transparent",cursor:"pointer",
                      fontSize:13,color:palette.text,fontWeight:countdownTarget===m?700:400,
                    }}>{m}m</button>
                  ))}
                </div>
              </div>
            )}

            {/* Controls */}
            <div style={{display:"flex",gap:10,marginBottom:12}}>
              <button onClick={handleStart} style={{
                flex:2,padding:"14px",borderRadius:16,border:"none",cursor:"pointer",
                background:running?`linear-gradient(135deg,${palette.pinkMid},${palette.blueMid})`:`linear-gradient(135deg,${palette.accent},${palette.accentBlue})`,
                color:"white",fontWeight:700,fontSize:16,boxShadow:`0 4px 12px ${palette.shadow}`,
                transition:"all .2s",
              }}>{running ? T.timer.pause : T.timer.start}</button>
              <button onClick={handleReset} style={{
                flex:1,padding:"14px",borderRadius:16,border:"none",cursor:"pointer",
                background:palette.white,color:palette.text,fontWeight:600,fontSize:15,
                boxShadow:`0 2px 8px ${palette.shadow}`,
              }}>↺ {T.timer.reset}</button>
            </div>

            {/* Block warning */}
            {showBlockWarning && (
              <div style={{
                background:"#fce4ec",borderRadius:14,padding:"12px 16px",marginBottom:12,
                border:"2px solid #f48fb1",fontSize:13,color:"#c2185b",textAlign:"center",
                animation:"slideIn 0.3s ease",
              }}>🚫 {T.timer.blocked}</div>
            )}

            {/* Blocked apps */}
            <div style={{background:palette.white,borderRadius:16,padding:16,boxShadow:`0 2px 8px ${palette.shadow}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontSize:13,fontWeight:600,color:palette.text}}>🚫 {T.timer.socialApps}</div>
                <button onClick={() => setShowSettings(true)} style={{
                  fontSize:11,color:palette.accent,background:"none",border:"none",cursor:"pointer",fontWeight:700,
                }}>✏️ {lang==="zh"?"自定义":"Customize"}</button>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {blockedApps.map((app,i) => (
                  <span key={i} style={{background:palette.pink,borderRadius:20,padding:"5px 11px",fontSize:12,color:"#c2185b",fontWeight:500}}>
                    {app}
                  </span>
                ))}
              </div>
            </div>

            {/* Animal selector */}
            <div style={{background:palette.white,borderRadius:16,padding:16,marginTop:12,boxShadow:`0 2px 8px ${palette.shadow}`}}>
              <div style={{fontSize:13,fontWeight:600,color:palette.text,marginBottom:10}}>🐾 {T.timer.selectAnimal}</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {ANIMALS.map(a => {
                  const unlocked = unlockedAnimals[a.id];
                  return (
                    <button key={a.id} onClick={() => unlocked && setSelectedAnimal(a.id)} style={{
                      position:"relative",padding:"8px 12px",borderRadius:12,border:`2px solid ${selectedAnimal===a.id?palette.accent:palette.pinkMid}`,
                      background:selectedAnimal===a.id?palette.pink:unlocked?palette.white:"#f5f5f5",
                      cursor:unlocked?"pointer":"default",opacity:unlocked?1:0.6,
                      fontSize:12,color:palette.text,fontWeight:selectedAnimal===a.id?700:400,
                    }}>
                      {a.emoji} {a.name[lang]}
                      {!unlocked && <span style={{display:"block",fontSize:10,color:"#aaa"}}>🔒 {a.cost}pts</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── NOTES TAB ── */}
        {tab === 1 && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h2 style={{margin:0,fontSize:20,color:palette.text}}>{T.notes.title}</h2>
              <button onClick={() => {
                const n={id:Date.now(),title:"",content:"",type:noteMode,date:new Date().toLocaleDateString()};
                setNotes(prev=>[...prev,n]);setActiveNote(n.id);
              }} style={{
                background:`linear-gradient(135deg,${palette.accent},${palette.accentBlue})`,
                color:"white",border:"none",borderRadius:12,padding:"8px 14px",cursor:"pointer",fontSize:13,fontWeight:600,
              }}>{T.notes.newNote}</button>
            </div>

            {/* Mode switch */}
            <div style={{display:"flex",background:palette.white,borderRadius:14,padding:3,marginBottom:14,boxShadow:`0 2px 8px ${palette.shadow}`}}>
              {[{label:T.notes.type,mode:"text"},{label:T.notes.mindmap,mode:"mindmap"},{label:T.notes.drawing,mode:"drawing"}].map(({label,mode}) => (
                <button key={mode} onClick={() => setNoteMode(mode)} style={{
                  flex:1,padding:"8px",borderRadius:11,border:"none",cursor:"pointer",
                  background:noteMode===mode?palette.pinkMid:"transparent",
                  fontWeight:600,color:palette.text,fontSize:12,
                }}>{label}</button>
              ))}
            </div>

            {activeNote && noteMode==="text" ? (
              <div style={{background:palette.white,borderRadius:20,padding:20,boxShadow:`0 4px 16px ${palette.shadow}`}}>
                <input
                  value={notes.find(n=>n.id===activeNote)?.title||""}
                  onChange={e => setNotes(prev=>prev.map(n=>n.id===activeNote?{...n,title:e.target.value}:n))}
                  placeholder={T.notes.noteTitle}
                  style={{width:"100%",border:"none",outline:"none",fontSize:18,fontWeight:700,color:palette.text,background:"transparent",marginBottom:12,boxSizing:"border-box"}}
                />
                <textarea
                  value={notes.find(n=>n.id===activeNote)?.content||""}
                  onChange={e => setNotes(prev=>prev.map(n=>n.id===activeNote?{...n,content:e.target.value}:n))}
                  placeholder={T.notes.placeholder}
                  style={{width:"100%",minHeight:200,border:"none",outline:"none",resize:"vertical",fontSize:15,color:palette.text,background:"transparent",lineHeight:1.7,boxSizing:"border-box",fontFamily:"'Nunito',sans-serif"}}
                />
                <button onClick={() => setActiveNote(null)} style={{
                  marginTop:8,background:palette.pink,border:"none",borderRadius:10,padding:"8px 16px",cursor:"pointer",fontSize:13,color:palette.text,
                }}>← {lang==="zh"?"返回":"Back"}</button>
              </div>

            ) : noteMode==="drawing" ? (
              <DrawingCanvas lang={lang} palette={palette} notes={notes} setNotes={setNotes} activeNote={activeNote} setActiveNote={setActiveNote} />

            ) : activeNote && noteMode==="mindmap" ? (
              <div>
                <div style={{background:palette.white,borderRadius:20,padding:16,marginBottom:12,boxShadow:`0 4px 16px ${palette.shadow}`}}>
                  <svg width="100%" height="260" style={{display:"block"}}>
                    {mindmapNodes.filter(n=>n.parent).map(n => {
                      const p = mindmapNodes.find(p=>p.id===n.parent);
                      if (!p) return null;
                      return <line key={n.id+"l"} x1={`${p.x}%`} y1={`${p.y}%`} x2={`${n.x}%`} y2={`${n.y}%`} stroke="#e0cfe8" strokeWidth="2" strokeDasharray="4"/>;
                    })}
                    {mindmapNodes.map(n => (
                      <g key={n.id} onClick={() => setSelectedNode(n.id)} style={{cursor:"pointer"}}>
                        <ellipse cx={`${n.x}%`} cy={`${n.y}%`} rx="11%" ry="8%" fill={n.color} opacity={selectedNode===n.id?1:0.85} stroke={selectedNode===n.id?"#e91e8c":"transparent"} strokeWidth="2"/>
                        <text x={`${n.x}%`} y={`${n.y}%`} textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="#5d4037" fontFamily="Nunito, sans-serif">{n.text}</text>
                      </g>
                    ))}
                  </svg>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <input value={newNodeText} onChange={e=>setNewNodeText(e.target.value)} placeholder={T.notes.addNode}
                    style={{flex:1,padding:"10px 14px",borderRadius:12,border:`1.5px solid ${palette.pinkMid}`,outline:"none",fontSize:14,background:palette.white,color:palette.text}}/>
                  <button onClick={() => {
                    if (!newNodeText.trim()) return;
                    const colors=["#fce4ec","#e3f2fd","#f3e5f5","#e8f5e9","#fff9c4"];
                    setMindmapNodes(prev=>[...prev,{id:Date.now(),text:newNodeText,x:20+Math.random()*60,y:20+Math.random()*60,parent:selectedNode,color:colors[prev.length%colors.length]}]);
                    setNewNodeText("");
                  }} style={{
                    background:palette.accent,color:"white",border:"none",borderRadius:12,padding:"10px 16px",cursor:"pointer",fontSize:14,fontWeight:600,
                  }}>+</button>
                </div>
                <button onClick={() => setActiveNote(null)} style={{
                  marginTop:10,background:palette.pink,border:"none",borderRadius:10,padding:"8px 16px",cursor:"pointer",fontSize:13,color:palette.text,
                }}>← {lang==="zh"?"返回":"Back"}</button>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {notes.map(n => (
                  <div key={n.id} onClick={() => {setActiveNote(n.id);setNoteMode(n.type||"text");}} style={{
                    background:palette.white,borderRadius:16,padding:"14px 16px",cursor:"pointer",
                    boxShadow:`0 2px 8px ${palette.shadow}`,display:"flex",justifyContent:"space-between",alignItems:"center",
                    transition:"transform .15s",
                  }}>
                    <div>
                      <div style={{fontWeight:600,color:palette.text,fontSize:15}}>{n.title||`(${lang==="zh"?"无标题":"Untitled"})`}</div>
                      <div style={{fontSize:11,color:palette.textLight,marginTop:2}}>{n.date} · {n.type==="mindmap"?"🗺 Mind Map":n.type==="drawing"?"✏️ Drawing":"📝 Text"}</div>
                    </div>
                    <div style={{fontSize:20}}>→</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TASKS TAB ── */}
        {tab === 2 && (
          <div>
            <h2 style={{margin:"0 0 14px",fontSize:20,color:palette.text}}>{T.tasks.title}</h2>
            {/* Add task */}
            <div style={{background:palette.white,borderRadius:16,padding:16,marginBottom:14,boxShadow:`0 2px 8px ${palette.shadow}`}}>
              <input value={newTask} onChange={e=>setNewTask(e.target.value)} placeholder={T.tasks.placeholder}
                onKeyDown={e => e.key==="Enter" && addTask()}
                style={{width:"100%",border:"none",outline:"none",fontSize:15,color:palette.text,background:"transparent",marginBottom:10,boxSizing:"border-box"}}/>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input type="date" value={newDue} onChange={e=>setNewDue(e.target.value)}
                  style={{flex:1,border:`1.5px solid ${palette.pinkMid}`,borderRadius:10,padding:"6px 10px",fontSize:13,outline:"none",color:palette.text,background:palette.white}}/>
                <button onClick={addTask} style={{
                  background:`linear-gradient(135deg,${palette.accent},${palette.accentBlue})`,
                  color:"white",border:"none",borderRadius:10,padding:"8px 18px",cursor:"pointer",fontSize:14,fontWeight:600,
                }}>+ {T.tasks.add}</button>
              </div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {tasks.sort((a,b) => a.done-b.done).map(t => {
                const now = new Date();
                const due = t.due ? new Date(t.due+"T23:59") : null;
                const overdue = due && now > due && !t.done;
                return (
                  <div key={t.id} style={{
                    background:t.done?"#f0fdf4":overdue?"#fff1f2":palette.white,
                    borderRadius:14,padding:"14px 16px",display:"flex",gap:12,alignItems:"center",
                    boxShadow:`0 2px 8px ${palette.shadow}`,
                    borderLeft:`4px solid ${t.done?"#86efac":overdue?"#fca5a5":palette.pinkMid}`,
                    opacity:t.done?0.75:1,
                  }}>
                    <button onClick={() => toggleTask(t.id)} style={{
                      width:26,height:26,borderRadius:"50%",border:`2px solid ${t.done?"#86efac":palette.pinkMid}`,
                      background:t.done?"#86efac":"transparent",cursor:"pointer",fontSize:14,
                      display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                    }}>{t.done?"✓":""}</button>
                    <div style={{flex:1}}>
                      <div style={{fontSize:15,color:palette.text,textDecoration:t.done?"line-through":"none",fontWeight:t.done?400:500}}>{t.text}</div>
                      {t.due && <div style={{fontSize:11,color:overdue?"#e53e3e":palette.textLight,marginTop:2}}>
                        📅 {t.due} {overdue?`· ${T.tasks.overdue}`:t.done?`· ${T.tasks.done}`:`· ${T.tasks.pending}`}
                      </div>}
                    </div>
                    {!t.done && !overdue && <span style={{fontSize:11,color:"#e91e8c",fontWeight:600,background:palette.pink,padding:"3px 8px",borderRadius:8}}>{T.tasks.complete}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SLEEP TAB ── */}
        {tab === 3 && (
          <div>
            <h2 style={{margin:"0 0 14px",fontSize:20,color:palette.text}}>{T.sleep.title}</h2>

            {/* Log sleep */}
            <div style={{background:palette.white,borderRadius:20,padding:20,marginBottom:16,boxShadow:`0 4px 16px ${palette.shadow}`}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                <div>
                  <label style={{fontSize:12,color:palette.textLight,display:"block",marginBottom:4}}>🌙 {T.sleep.bedtime}</label>
                  <input type="time" value={bedtime} onChange={e=>setBedtime(e.target.value)}
                    style={{width:"100%",border:`1.5px solid ${palette.blueMid}`,borderRadius:10,padding:"8px",fontSize:15,outline:"none",color:palette.text,background:palette.blue,boxSizing:"border-box"}}/>
                </div>
                <div>
                  <label style={{fontSize:12,color:palette.textLight,display:"block",marginBottom:4}}>☀️ {T.sleep.wakeup}</label>
                  <input type="time" value={wakeup} onChange={e=>setWakeup(e.target.value)}
                    style={{width:"100%",border:`1.5px solid ${palette.blueMid}`,borderRadius:10,padding:"8px",fontSize:15,outline:"none",color:palette.text,background:palette.blue,boxSizing:"border-box"}}/>
                </div>
              </div>
              <div style={{marginBottom:12}}>
                <label style={{fontSize:12,color:palette.textLight,display:"block",marginBottom:6}}>{T.sleep.quality}</label>
                <div style={{display:"flex",gap:6}}>
                  {["poor","fair","good","great"].map(q => (
                    <button key={q} onClick={() => setSleepQuality(q)} style={{
                      flex:1,padding:"7px 4px",borderRadius:10,border:`2px solid ${sleepQuality===q?qualColors[q]:"transparent"}`,
                      background:sleepQuality===q?qualColors[q]:palette.khakiLight,cursor:"pointer",fontSize:11,color:palette.text,fontWeight:sleepQuality===q?700:400,
                    }}>{T.sleep[q]}</button>
                  ))}
                </div>
              </div>
              <button onClick={logSleep} style={{
                width:"100%",padding:"12px",borderRadius:14,border:"none",cursor:"pointer",
                background:`linear-gradient(135deg,${palette.accentBlue},#a78bfa)`,
                color:"white",fontWeight:700,fontSize:15,
              }}>+ {T.sleep.logSleep}</button>
            </div>

            {/* Sleep chart */}
            <div style={{background:palette.white,borderRadius:20,padding:20,boxShadow:`0 4px 16px ${palette.shadow}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <span style={{fontWeight:600,color:palette.text}}>{T.sleep.history}</span>
                <span style={{fontSize:12,color:palette.textLight}}>{T.sleep.goal}</span>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"flex-end",height:130,position:"relative"}}>
                {sleepLogs.slice(-7).map((log,i) => {
                  const maxH = 110;
                  const barH = Math.max(8, Math.round((Math.min(log.duration,10)/10)*maxH));
                  return (
                    <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,justifyContent:"flex-end",height:"100%"}}>
                      <div style={{fontSize:9,color:palette.textLight,fontWeight:600}}>{log.duration}h</div>
                      <div style={{
                        width:"100%", height:barH, borderRadius:"6px 6px 2px 2px",
                        background:qualColors[log.quality]||palette.blueMid,
                        transition:"height .4s ease",
                        boxShadow:`0 2px 6px rgba(0,0,0,0.08)`,
                      }}/>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
                        <div style={{fontSize:9,color:palette.text,fontWeight:600}}>{log.date}</div>
                        <div style={{fontSize:8,color:palette.textLight}}>{log.dateStr||""}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{fontSize:11,color:palette.textLight,marginTop:10,textAlign:"center"}}>
                {T.sleep.avg}: {sleepLogs.length ? (sleepLogs.reduce((s,l)=>s+l.duration,0)/sleepLogs.length).toFixed(1) : "–"} {T.sleep.hours}
              </div>
            </div>
          </div>
        )}

        {/* ── PETS TAB ── */}
        {tab === 4 && (
          <div>
            <h2 style={{margin:"0 0 14px",fontSize:20,color:palette.text}}>{T.pets.title}</h2>

            {/* Sub-tabs */}
            <div style={{display:"flex",background:palette.white,borderRadius:14,padding:3,marginBottom:14,boxShadow:`0 2px 8px ${palette.shadow}`,gap:2}}>
              {[T.pets.home,T.pets.shop].map((t,i) => (
                <button key={i} onClick={() => setPetsTab(["home","shop"][i])} style={{
                  flex:1,padding:"8px 4px",borderRadius:11,border:"none",cursor:"pointer",
                  background:petsTab===["home","shop"][i]?palette.pinkMid:"transparent",
                  fontWeight:600,color:palette.text,fontSize:12,
                }}>{t}</button>
              ))}
            </div>

            {/* Pet selector */}
            <div style={{display:"flex",gap:8,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
              {ANIMALS.filter(a => unlockedAnimals[a.id]).map(a => (
                <button key={a.id} onClick={() => setActivePet(a.id)} style={{
                  padding:"8px 12px",borderRadius:12,border:`2px solid ${activePet===a.id?palette.accent:palette.pinkMid}`,
                  background:activePet===a.id?palette.pink:palette.white,cursor:"pointer",
                  fontSize:11,color:palette.text,fontWeight:activePet===a.id?700:400,flexShrink:0,
                }}>{a.emoji} {a.name[lang]}</button>
              ))}
            </div>

            {/* Home view */}
            {petsTab === "home" && (
              <div>
                <div style={{
                  background:homeData.bg, borderRadius:24,
                  boxShadow:`0 4px 16px ${palette.shadow}`, marginBottom:14, minHeight:240,
                  position:"relative", overflow:"hidden",
                }}>
                  {/* Sky decorations */}
                  <div style={{position:"absolute",top:10,left:16,fontSize:22,opacity:0.7}}>☁️</div>
                  <div style={{position:"absolute",top:18,right:24,fontSize:16,opacity:0.6}}>☁️</div>
                  {homeData.id==="space" && <>
                    <div style={{position:"absolute",top:12,left:"30%",fontSize:14}}>⭐</div>
                    <div style={{position:"absolute",top:8,right:"35%",fontSize:10}}>✨</div>
                    <div style={{position:"absolute",top:30,left:"60%",fontSize:12}}>💫</div>
                  </>}

                  {/* Home emoji top-right */}
                  <div style={{position:"absolute",top:12,right:14,fontSize:28,opacity:0.85}}>{homeData.emoji}</div>

                  {/* Pet scene — centered column */}
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",paddingTop:30,paddingBottom:0}}>

                    {/* Hat / head accessory ON TOP */}
                    {outfitLabel && ["👑","🧙","👓","🎩"].some(h => outfitLabel.includes(h.replace(/\uFE0F/g,""))) ? (
                      <div style={{fontSize:32,lineHeight:1,marginBottom:-6,zIndex:3,position:"relative",filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.15))"}}>{outfitLabel}</div>
                    ) : null}

                    {/* Pet */}
                    <div style={{
                      fontSize:80,lineHeight:1,
                      animation:petAnim?"wiggle 0.4s ease":"float 3s ease-in-out infinite",
                      display:"inline-block",
                      filter:"drop-shadow(0 6px 16px rgba(0,0,0,0.12))",
                      zIndex:2, position:"relative",
                    }}>{petEmoji}</div>

                    {/* Body/neck accessory BELOW pet but above ground */}
                    {outfitLabel && !["👑","🧙","👓","🎩"].some(h => outfitLabel.includes(h.replace(/\uFE0F/g,""))) ? (
                      <div style={{fontSize:28,marginTop:-12,zIndex:3,position:"relative"}}>{outfitLabel}</div>
                    ) : null}

                    {/* Pet bowl */}
                    <div style={{fontSize:28,marginTop:4,zIndex:2,position:"relative"}}>🥣</div>

                    {/* Name tag */}
                    <div style={{
                      fontSize:12,fontWeight:700,
                      color:homeData.id==="space"?"#e0d0ff":"#5d4037",
                      background:homeData.id==="space"?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.55)",
                      borderRadius:20,padding:"3px 12px",marginTop:4,marginBottom:0,
                      backdropFilter:"blur(4px)",
                    }}>
                      {ANIMALS.find(a=>a.id===activePet)?.name[lang]} {T.pets.level} {petLevel[activePet]||1}
                    </div>
                  </div>

                  {/* Ground with flowers */}
                  <div style={{
                    background:homeData.ground,
                    padding:"6px 16px 10px",
                    display:"flex",justifyContent:"center",gap:8,
                    marginTop:8,
                  }}>
                    {(homeData.flowers||[]).map((f,i) => (
                      <span key={i} style={{fontSize:18,animation:`float ${2+i*0.3}s ease-in-out infinite`,display:"inline-block"}}>{f}</span>
                    ))}
                  </div>
                </div>

                {/* Stats + Food + Wardrobe — consistent spacing */}
                <div style={{display:"flex",flexDirection:"column",gap:10}}>

                {/* Stats */}
                <div style={{background:palette.white,borderRadius:16,padding:16,boxShadow:`0 2px 8px ${palette.shadow}`}}>
                  {[
                    {label:T.pets.hunger,val:petHunger[activePet]||70,color:"#fca5a5"},
                    {label:T.pets.happy,val:petHappy[activePet]||80,color:"#86efac"},
                  ].map(stat => (
                    <div key={stat.label} style={{marginBottom:12}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:palette.textLight,marginBottom:4}}>
                        <span>{stat.label}</span><span>{stat.val}%</span>
                      </div>
                      <div style={{height:10,borderRadius:5,background:"#f0ede8",overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${stat.val}%`,background:stat.color,borderRadius:5,transition:"width .4s"}}/>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Food section */}
                <div style={{background:palette.white,borderRadius:16,padding:16,boxShadow:`0 2px 8px ${palette.shadow}`}}>
                  <div style={{fontSize:13,fontWeight:600,color:palette.text,marginBottom:10}}>🍽 {T.pets.food}</div>
                  {ownedFoods.length === 0
                    ? <div style={{textAlign:"center",padding:"16px 0",color:palette.textLight,fontSize:13}}>
                        {lang==="zh"?"去商店购买食物！🛒":"Buy food from the shop first! 🛒"}
                      </div>
                    : <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                        {[...new Set(ownedFoods)].map(fid => {
                          const food = FOODS.find(f=>f.id===fid);
                          const count = ownedFoods.filter(f=>f===fid).length;
                          if (!food) return null;
                          return (
                            <div key={fid} onClick={() => feedPet(food)} style={{
                              background:palette.khakiLight,borderRadius:14,padding:"10px 14px",
                              textAlign:"center",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,
                              border:`1.5px solid ${palette.pinkMid}`,minWidth:70,
                            }}>
                              <div style={{fontSize:32}}>{food.emoji}</div>
                              <div style={{fontSize:11,fontWeight:600,color:palette.text}}>{food.name[lang]}</div>
                              <div style={{fontSize:10,color:palette.textLight}}>×{count}</div>
                            </div>
                          );
                        })}
                      </div>
                  }
                </div>

                {/* Wardrobe section */}
                <div style={{background:palette.white,borderRadius:16,padding:16,boxShadow:`0 2px 8px ${palette.shadow}`}}>
                  <div style={{fontSize:13,fontWeight:600,color:palette.text,marginBottom:10}}>👗 {T.pets.wardrobe}</div>
                  {ownedOutfits.filter(id => id !== "none").length === 0
                    ? <div style={{textAlign:"center",padding:"16px 0",color:palette.textLight,fontSize:13}}>
                        {lang==="zh"?"去商店购买服装！🛒":"Buy outfits from the shop first! 🛒"}
                      </div>
                    : <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                        {OUTFITS.filter(o => ownedOutfits.includes(o.id) && o.id !== "none").map(o => (
                          <div key={o.id} onClick={() => wearOutfit(o.id)} style={{
                            background:(petOutfit[activePet]||"none")===o.id?palette.pink:palette.khakiLight,
                            borderRadius:14,padding:"10px 14px",textAlign:"center",cursor:"pointer",
                            border:`2px solid ${(petOutfit[activePet]||"none")===o.id?palette.accent:palette.pinkMid}`,
                            minWidth:70,display:"flex",flexDirection:"column",alignItems:"center",gap:4,
                          }}>
                            <div style={{fontSize:32}}>{o.emoji}</div>
                            <div style={{fontSize:11,fontWeight:600,color:palette.text}}>{o.name[lang]}</div>
                            {(petOutfit[activePet]||"none")===o.id && <div style={{fontSize:10,color:"#e91e8c"}}>✓ {lang==="zh"?"穿着中":"On"}</div>}
                          </div>
                        ))}
                      </div>
                  }
                </div>

                </div>{/* end gap wrapper */}
              </div>
            )}

            {/* Shop view */}
            {petsTab === "shop" && (
              <div>
                <div style={{display:"flex",background:palette.white,borderRadius:14,padding:3,marginBottom:12,boxShadow:`0 2px 8px ${palette.shadow}`}}>
                  {[T.pets.outfits,T.pets.foods,T.pets.homes,lang==="zh"?"动物":"Animals"].map((t,i) => (
                    <button key={i} onClick={() => setPetShopTab(["outfits","foods","homes","animals"][i])} style={{
                      flex:1,padding:"6px 3px",borderRadius:11,border:"none",cursor:"pointer",
                      background:petShopTab===["outfits","foods","homes","animals"][i]?palette.pinkMid:"transparent",
                      fontWeight:600,color:palette.text,fontSize:11,
                    }}>{t}</button>
                  ))}
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {petShopTab==="outfits" && OUTFITS.filter(o=>!o.free).map(item => (
                    <div key={item.id} style={{background:palette.white,borderRadius:14,padding:14,textAlign:"center",boxShadow:`0 2px 8px ${palette.shadow}`}}>
                      <div style={{fontSize:36}}>{item.emoji}</div>
                      <div style={{fontSize:13,fontWeight:600,color:palette.text,margin:"6px 0 2px"}}>{item.name[lang]}</div>
                      <div style={{fontSize:12,color:"#e91e8c",marginBottom:8}}>💎 {item.cost} {T.pets.pts}</div>
                      {ownedOutfits.includes(item.id)
                        ? <span style={{fontSize:12,color:"#86efac",fontWeight:600}}>✓ {lang==="zh"?"已拥有":"Owned"}</span>
                        : <button onClick={() => buyItem("outfit",item)} disabled={totalPoints<item.cost} style={{
                            background:totalPoints>=item.cost?`linear-gradient(135deg,${palette.accent},${palette.accentBlue})`:"#e0e0e0",
                            color:"white",border:"none",borderRadius:8,padding:"6px 12px",cursor:totalPoints>=item.cost?"pointer":"default",fontSize:12,fontWeight:600,
                          }}>{T.pets.buy}</button>
                      }
                    </div>
                  ))}
                  {petShopTab==="foods" && FOODS.map(item => (
                    <div key={item.id} style={{background:palette.white,borderRadius:14,padding:14,textAlign:"center",boxShadow:`0 2px 8px ${palette.shadow}`}}>
                      <div style={{fontSize:36}}>{item.emoji}</div>
                      <div style={{fontSize:13,fontWeight:600,color:palette.text,margin:"6px 0 2px"}}>{item.name[lang]}</div>
                      <div style={{fontSize:11,color:palette.textLight,marginBottom:4}}>🍴+{item.hunger} 😊+{item.happy}</div>
                      <div style={{fontSize:12,color:"#e91e8c",marginBottom:8}}>💎 {item.cost} {T.pets.pts}</div>
                      <button onClick={() => buyItem("food",item)} disabled={totalPoints<item.cost} style={{
                        background:totalPoints>=item.cost?`linear-gradient(135deg,${palette.accent},${palette.accentBlue})`:"#e0e0e0",
                        color:"white",border:"none",borderRadius:8,padding:"6px 12px",cursor:totalPoints>=item.cost?"pointer":"default",fontSize:12,fontWeight:600,
                      }}>{T.pets.buy}</button>
                    </div>
                  ))}
                  {petShopTab==="homes" && HOMES.filter(h=>!h.free).map(item => (
                    <div key={item.id} style={{borderRadius:14,overflow:"hidden",boxShadow:`0 2px 8px ${palette.shadow}`}}>
                      <div style={{background:item.bg,height:60,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>{item.emoji}</div>
                      <div style={{background:palette.white,padding:"10px 14px",textAlign:"center"}}>
                      <div style={{fontSize:13,fontWeight:600,color:palette.text,marginBottom:2}}>{item.name[lang]}</div>
                      <div style={{fontSize:12,color:"#e91e8c",marginBottom:8}}>💎 {item.cost} {T.pets.pts}</div>
                      {ownedHomes.includes(item.id)
                        ? <button onClick={() => setCurrentHome(item.id)} style={{
                            background:currentHome===item.id?"#86efac":palette.blue,border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:palette.text,
                          }}>{currentHome===item.id?(lang==="zh"?"当前":"Current"):(lang==="zh"?"使用":"Use")}</button>
                        : <button onClick={() => buyItem("home",item)} disabled={totalPoints<item.cost} style={{
                            background:totalPoints>=item.cost?`linear-gradient(135deg,${palette.accent},${palette.accentBlue})`:"#e0e0e0",
                            color:"white",border:"none",borderRadius:8,padding:"6px 12px",cursor:totalPoints>=item.cost?"pointer":"default",fontSize:12,fontWeight:600,
                          }}>{T.pets.buy}</button>
                      }
                      </div>
                    </div>
                  ))}
                  {petShopTab==="animals" && ANIMALS.filter(a=>!a.unlocked||!unlockedAnimals[a.id]).map(a => (
                    <div key={a.id} style={{background:palette.white,borderRadius:14,padding:14,textAlign:"center",boxShadow:`0 2px 8px ${palette.shadow}`}}>
                      <div style={{fontSize:40,textAlign:"center",marginBottom:4}}>{unlockedAnimals[a.id] ? a.emoji : <span style={{opacity:0.4}}>{a.emoji}</span>}</div>
                      <div style={{fontSize:13,fontWeight:600,color:palette.text,margin:"6px 0 2px"}}>{a.name[lang]}</div>
                      <div style={{fontSize:12,color:"#e91e8c",marginBottom:8}}>💎 {a.cost} {T.pets.pts}</div>
                      {unlockedAnimals[a.id]
                        ? <span style={{fontSize:12,color:"#86efac",fontWeight:600}}>✓ {lang==="zh"?"已解锁":"Unlocked"}</span>
                        : <button onClick={() => unlockAnimal(a)} disabled={totalPoints<a.cost} style={{
                            background:totalPoints>=a.cost?`linear-gradient(135deg,#fbbf24,#f97316)`:"#e0e0e0",
                            color:"white",border:"none",borderRadius:8,padding:"6px 12px",cursor:totalPoints>=a.cost?"pointer":"default",fontSize:12,fontWeight:600,
                          }}>{T.unlock} {a.cost}pts</button>
                      }
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position:"fixed",bottom:0,left:0,right:0,
        display:"flex",justifyContent:"center",
        padding:"0 0 8px",
      }}>
        <div style={{
          background:"rgba(255,253,248,0.95)",backdropFilter:"blur(12px)",
          borderRadius:"20px 20px 16px 16px",padding:"8px 8px 4px",
          display:"flex",gap:0,boxShadow:"0 -4px 20px rgba(180,140,120,0.15)",
          border:"1px solid rgba(244,143,177,0.2)",
          maxWidth:440,width:"calc(100% - 32px)",
        }}>
          {T.tabs.map((t,i) => (
            <button key={i} onClick={() => setTab(i)} style={{
              flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,
              padding:"8px 4px 6px",borderRadius:14,border:"none",cursor:"pointer",
              background:tab===i?palette.pink:"transparent",
              transition:"all .2s",
            }}>
              <span style={{fontSize:20}}>{tabIcons[i]}</span>
              <span style={{fontSize:10,color:tab===i?palette.accent:palette.textLight,fontWeight:tab===i?700:400}}>
                {t}
              </span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)}
        }
        @keyframes bounce {
          0%{transform:translateY(0) rotate(-5deg)} 100%{transform:translateY(-10px) rotate(5deg)}
        }
        @keyframes wiggle {
          0%,100%{transform:rotate(0)} 25%{transform:rotate(-10deg)} 75%{transform:rotate(10deg)}
        }
        @keyframes slideIn {
          from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)}
        }
      `}</style>
    </div>
  );
}
