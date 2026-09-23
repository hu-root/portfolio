/* =========================================================
   小峰 · 个人作品集 — 交互脚本
   1. 项目数据表 + 杂志版式渲染（新增项目只需追加一条数据）
   2. 导航：滚动描边 / 当前区块高亮 / 移动端汉堡菜单
   3. 滚动进入视口的淡入动画
   ========================================================= */

"use strict";

/* ---------------------------------------------------------
   项目数据表
   字段：title 名称 | desc 简介 | stack 技术栈 | date 完成时间
        category 类别 | tag 类别标签 | image 本地配图路径（放在 images/ 目录）
   --------------------------------------------------------- */
const PROJECTS = [
  {
    title: "课语通",
    desc: "一个基于大语言模型的课程问答助手。用户上传课程资料后，系统能够建立知识索引，根据课程内容回答问题，并提供引用出处和知识点小测，帮助学生快速复习和整理课程重点。",
    stack: ["Python", "FastAPI", "RAG", "向量检索", "大语言模型 API", "Streamlit"],
    date: "2026.07",
    category: "AI 应用",
    tag: "AI应用",
    image: "images/work-keyutong.jpg"
  },
  {
    title: "城市脉搏",
    desc: "一个城市实时交通与天气数据可视化大屏，用于集中展示交通、天气和城市运行信息。项目通过多数据源轮询聚合数据，并结合 SVG 图表、Canvas 粒子地图和响应式布局实现大屏可视化展示。",
    stack: ["TypeScript", "HTML/CSS", "Canvas", "SVG", "ECharts"],
    date: "2026.03",
    category: "数据可视化",
    tag: "数据可视化",
    image: "images/work-chengshimaibo.jpg"
  },
  {
    title: "拾光集市",
    desc: "一个面向校园场景的二手交易平台，提供商品发布、关键词检索、站内私信和信用评分等功能。从需求梳理、界面设计到主要接口开发均独立完成，上线测试后累计注册用户超过 300 人。",
    stack: ["Java", "Spring Boot", "MySQL", "TypeScript", "Vue"],
    date: "2025.09",
    category: "全栈开发",
    tag: "Web应用",
    image: "images/work-shiguangjishi.jpg"
  },
  {
    title: "轻记账",
    desc: "一款面向日常生活场景的极简记账微信小程序，重点解决快速记录和查看个人收支的问题。项目支持语音快捷记账、月度收支统计和预算提醒，并使用微信云开发完成数据存储与后端能力。",
    stack: ["TypeScript", "微信小程序", "微信云开发", "ECharts"],
    date: "2025.04",
    category: "小程序",
    tag: "移动应用",
    image: "images/work-qingjizhang.jpg"
  }
];

/* 三种版式变体循环使用：a 左图右文 / b 深色色块错位 / c 通栏大图分栏 */
const VARIANTS = ["a", "b", "c"];

/* ---------------------------------------------------------
   渲染项目区块
   --------------------------------------------------------- */
function renderWorks() {
  const host = document.getElementById("worksStack");
  if (!host) return;

  const html = PROJECTS.map(function (p, i) {
    const variant = VARIANTS[i % VARIANTS.length];
    const no = String(i + 1).padStart(2, "0");
    const img = p.image;

    const stackList =
      '<ul class="work-stack-list">' +
        p.stack.map(function (s) { return "<li>" + s + "</li>"; }).join("") +
      "</ul>";
    const dateLine = '<span class="work-date">COMPLETED · ' + p.date + "</span>";
    const tagLine = '<span class="work-cat">' + p.tag + "</span>";
    const altText = p.title + " — 项目配图";

    const figure =
      '<figure class="work-figure">' +
        '<img src="' + img + '" alt="' + altText + '" loading="lazy">' +
      "</figure>";

    let block;
    if (variant === "a") {
      /* 左图 + 右完整文字栏 */
      block = figure +
        '<div class="work-text">' +
          '<span class="work-no">' + no + "</span>" +
          '<p class="work-kicker">' + p.category + " / " + p.date + "</p>" +
          '<h3 class="work-title">' + p.title + "</h3>" +
          tagLine +
          '<p class="work-desc">' + p.desc + "</p>" +
          stackList + dateLine +
        "</div>";
    } else if (variant === "b") {
      /* 深色色块文字 + 右图错位 */
      block =
        '<div class="work-text">' +
          '<span class="work-no">' + no + "</span>" +
          '<p class="work-kicker">' + p.category + " / " + p.date + "</p>" +
          '<h3 class="work-title">' + p.title + "</h3>" +
          tagLine +
          '<p class="work-desc">' + p.desc + "</p>" +
          stackList + dateLine +
        "</div>" + figure;
    } else {
      /* 通栏大图 + 下方：左标题栏 / 右说明栏 */
      block = figure +
        '<div class="work-cols">' +
          '<div class="work-text work-lead">' +
            '<span class="work-no">' + no + "</span>" +
            '<h3 class="work-title">' + p.title + "</h3>" +
            tagLine +
            '<p class="work-kicker">' + p.category + "</p>" +
          "</div>" +
          '<div class="work-aside">' +
            '<p class="work-desc">' + p.desc + "</p>" +
            stackList + dateLine +
          "</div>" +
        "</div>";
    }

    return '<article class="work work--' + variant + ' reveal">' + block + "</article>";
  }).join("");

  host.innerHTML = html;
}

/* ---------------------------------------------------------
   导航交互
   --------------------------------------------------------- */
function initNav() {
  const nav = document.getElementById("siteNav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const navItems = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));

  /* 滚动后导航加分割线 */
  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 移动端汉堡菜单 */
  toggle.addEventListener("click", function () {
    const open = links.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", function (e) {
    if (e.target.closest(".nav-link")) {
      links.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  /* 当前区块高亮 */
  const sections = navItems
    .map(function (a) { return document.getElementById(a.dataset.section); })
    .filter(Boolean);

  const spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      navItems.forEach(function (a) {
        a.classList.toggle("is-active", a.dataset.section === entry.target.id);
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  sections.forEach(function (s) { spy.observe(s); });
}

/* ---------------------------------------------------------
   滚动淡入（一次性）
   --------------------------------------------------------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-in"); });
    return;
  }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(function (el) { io.observe(el); });
}

/* ---------------------------------------------------------
   深浅色主题切换
   优先读取 localStorage 记忆，其次跟随系统偏好，默认浅色。
   --------------------------------------------------------- */
const THEME_KEY = "theme";

function getStoredTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    if (t === "light" || t === "dark") return t;
  } catch (e) { /* 隐私模式下忽略 */ }
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.setAttribute("aria-pressed", String(theme === "dark"));
    btn.setAttribute("title", theme === "dark" ? "切换到浅色主题" : "切换到深色主题");
  }
}

/* 脚本位于 body 末尾，立即应用可避免主题闪烁 */
const currentTheme = getStoredTheme();
applyTheme(currentTheme);

function initThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  btn.addEventListener("click", function () {
    const next =
      document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) { /* 忽略存储失败 */ }
  });
}

/* ---------------------------------------------------------
   启动
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  renderWorks();
  initNav();
  initReveal();
  initThemeToggle();
});
