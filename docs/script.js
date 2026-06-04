/* ============================================================
 * 漫藏 · MIRU INDEX — interactivity
 * ============================================================ */
(function () {
  "use strict";

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Stats ---------- */
  function paintStats() {
    const s = window.STATS;
    if (!s) return;
    animateNumber($("#stat-projects"), 0, s.projects, 1100, "项");
    animateNumber($("#stat-sites"),    0, s.sites,    1300, "个");
    animateNumber($("#stat-categories"), 0, s.categories, 900, "类");
    $("#stat-updated").textContent = s.updated;
  }
  function animateNumber(el, from, to, ms, suffix = "") {
    if (!el) return;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(from + (to - from) * eased);
      el.textContent = val + (suffix ? " " + suffix : "");
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- State ---------- */
  const state = {
    tab: "projects",          // "projects" | "sites"
    cat: "all",
    q:   "",
  };

  /* ---------- Helpers ---------- */
  function catList() {
    return window.CATEGORIES.filter(c => c.section === state.tab);
  }
  function dataList() {
    return state.tab === "projects" ? window.PROJECTS : window.SITES;
  }
  function categoryName(id) {
    const c = window.CATEGORIES.find(c => c.id === id);
    return c ? c.name : id;
  }
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  }
  function tagPill(t) { return `<span class="tag">${escapeHTML(t)}</span>`; }

  /* ---------- Render chips ---------- */
  function renderChips() {
    const root = $("#filters");
    const cats = catList();
    root.innerHTML = `
      <button class="chip ${state.cat === "all" ? "is-active" : ""}" data-cat="all">
        <span class="chip-mark">All</span>全部
      </button>
      ${cats.map(c => `
        <button class="chip ${state.cat === c.id ? "is-active" : ""}" data-cat="${c.id}">
          <span class="chip-mark">${escapeHTML(c.emoji)}</span>${escapeHTML(c.name)}
        </button>
      `).join("")}
    `;
    root.dataset.section = state.tab;
  }

  /* ---------- Render grid ---------- */
  function renderGrid() {
    const grid  = $("#grid");
    const empty = $("#empty");
    const q     = state.q.trim().toLowerCase();
    const items = dataList().filter(it => {
      if (state.cat !== "all" && it.cat !== state.cat) return false;
      if (!q) return true;
      const hay = [it.name, it.desc, categoryName(it.cat), ...(it.tags || [])]
        .join(" ").toLowerCase();
      return hay.includes(q);
    });

    if (items.length === 0) {
      grid.innerHTML = "";
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    grid.innerHTML = items.map((it, i) => {
      const isSite = state.tab === "sites";
      const badge = isSite
        ? (it.proxy ? `<span class="card-badge proxy">◎ PROXY</span>` : `<span class="card-badge">OPEN</span>`)
        : (it.badge ? `<span class="card-badge">${escapeHTML(it.badge)}</span>` : "");
      const tags = (it.tags || []).slice(0, 4).map(tagPill).join("");
      return `
        <a class="card in" href="${escapeHTML(it.url)}" target="_blank" rel="noopener"
           style="animation-delay:${Math.min(i, 24) * 35}ms">
          <div class="card-head">
            <span class="card-cat">${escapeHTML(categoryName(it.cat))}</span>
            ${badge}
          </div>
          <div class="card-title">${escapeHTML(it.name)}<span class="card-arrow">→</span></div>
          <p class="card-desc">${escapeHTML(it.desc)}</p>
          <div class="card-tags">${tags}</div>
        </a>
      `;
    }).join("");
  }

  /* ---------- Events ---------- */
  function bindTabs() {
    $$(".tab").forEach(btn => {
      btn.addEventListener("click", () => {
        const t = btn.dataset.tab;
        if (t === state.tab) return;
        state.tab = t;
        state.cat = "all";
        $$(".tab").forEach(b => b.classList.toggle("is-active", b === btn));
        renderChips();
        renderGrid();
      });
    });
  }
  function bindFilters(e) {
    $("#filters").addEventListener("click", e => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      state.cat = btn.dataset.cat;
      $$("#filters .chip").forEach(c => c.classList.toggle("is-active", c === btn));
      renderGrid();
    });
  }
  function bindSearch() {
    const input = $("#search");
    input.addEventListener("input", () => {
      state.q = input.value;
      renderGrid();
    });
    // "/" hotkey
    document.addEventListener("keydown", e => {
      if (e.key === "/" && document.activeElement !== input) {
        e.preventDefault();
        input.focus();
        input.select();
      } else if (e.key === "Escape" && document.activeElement === input) {
        input.blur();
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function bindReveal() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.1 });
    $$(".reveal").forEach(el => obs.observe(el));
  }

  /* ---------- Init ---------- */
  function init() {
    paintStats();
    renderChips();
    renderGrid();
    bindTabs();
    bindFilters();
    bindSearch();
    bindReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
