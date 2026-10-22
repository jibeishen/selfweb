/* 个人主页 · 交互
   主题切换、移动端菜单、作品筛选、年份、复制邮箱。
   全部使用原生 API，无依赖。 */
(function () {
  "use strict";

  var root = document.documentElement;
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function storedTheme() {
    try {
      return localStorage.getItem("theme");
    } catch (err) {
      return null;
    }
  }

  /* ---------- 主题 ---------- */

  var toggle = document.getElementById("theme-toggle");

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function applyTheme(theme, persist) {
    root.setAttribute("data-theme", theme);

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#141310" : "#faf8f4");

    if (toggle) {
      toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      toggle.setAttribute("aria-label", theme === "dark" ? "切换到浅色模式" : "切换到深色模式");
    }
    if (persist) {
      try {
        localStorage.setItem("theme", theme);
      } catch (err) {
        /* 隐私模式下忽略 */
      }
    }
  }

  if (toggle) {
    applyTheme(currentTheme(), false);
    toggle.addEventListener("click", function () {
      applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
    });

    var onSystemChange = function (event) {
      if (!storedTheme()) applyTheme(event.matches ? "dark" : "light", false);
    };
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onSystemChange);
    } else if (typeof media.addListener === "function") {
      media.addListener(onSystemChange);
    }
  }

  /* ---------- 移动端菜单 ---------- */

  var menuBtn = document.getElementById("menu-toggle");
  var nav = document.getElementById("nav");

  if (menuBtn && nav) {
    var setMenu = function (open) {
      nav.setAttribute("data-open", open ? "true" : "false");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    };

    menuBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      setMenu(nav.getAttribute("data-open") !== "true");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("click", function (event) {
      if (!nav.contains(event.target) && !menuBtn.contains(event.target)) setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 680) setMenu(false);
    });
  }

  /* ---------- 作品筛选 ---------- */

  var filter = document.querySelector("[data-filter]");

  if (filter) {
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-tags]"));
    filter.addEventListener("click", function (event) {
      var btn = event.target.closest("button[data-filter-value]");
      if (!btn) return;

      var value = btn.getAttribute("data-filter-value");
      Array.prototype.forEach.call(
        filter.querySelectorAll("button"),
        function (item) {
          item.setAttribute("aria-pressed", item === btn ? "true" : "false");
        }
      );

      cards.forEach(function (card) {
        var match = value === "all" || (card.getAttribute("data-tags") || "").split(" ").indexOf(value) !== -1;
        card.hidden = !match;
      });
    });
  }

  /* ---------- 年份 ---------- */

  Array.prototype.forEach.call(document.querySelectorAll("[data-year]"), function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- 复制邮箱 ---------- */

  Array.prototype.forEach.call(document.querySelectorAll("[data-copy]"), function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var done = function () {
        var original = btn.textContent;
        btn.textContent = "已复制 ✓";
        window.setTimeout(function () {
          btn.textContent = original;
        }, 1600);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        try {
          document.execCommand("copy");
          done();
        } catch (err) {
          /* 复制失败时保持原样 */
        }
        document.body.removeChild(area);
      }
    });
  });
})();
