// Wargame Journal - 閲覧UI。window.JOURNAL_DATA (data.js) を読む。
(function () {
  "use strict";

  var DATA = window.JOURNAL_DATA || { sites: [], meta: {} };
  var state = { site: null, game: null, level: null, query: "" };

  var $ = function (id) { return document.getElementById(id); };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  var STATUS_LABEL = { done: "done", in_progress: "進行中", todo: "未着手" };

  function currentSite() {
    return DATA.sites.find(function (s) { return s.id === state.site; }) || DATA.sites[0];
  }
  function currentGame() {
    var s = currentSite();
    if (!s) return null;
    return (s.games || []).find(function (g) { return g.id === state.game; }) || s.games[0];
  }

  function matchesQuery(lv, q) {
    if (!q) return true;
    q = q.toLowerCase();
    var hay = [lv.id, lv.title, lv.goal, (lv.tags || []).join(" ")];
    (lv.steps || []).forEach(function (st) { hay.push(st.cmd, st.note); });
    (lv.takeaways || []).forEach(function (t) { hay.push(t); });
    return hay.join(" \n ").toLowerCase().indexOf(q) !== -1;
  }

  function initHeader() {
    $("appTitle").textContent = (DATA.meta && DATA.meta.title) || "Wargame Journal";
    $("appSubtitle").textContent = (DATA.meta && DATA.meta.subtitle) || "";
    $("updated").textContent = DATA.meta && DATA.meta.updated ? "updated " + DATA.meta.updated : "";

    var siteSel = $("siteSel");
    siteSel.innerHTML = "";
    DATA.sites.forEach(function (s) {
      var o = document.createElement("option");
      o.value = s.id; o.textContent = s.name; siteSel.appendChild(o);
    });
    siteSel.onchange = function () { state.site = this.value; state.game = null; state.level = null; renderGameSel(); renderAll(); };

    $("search").oninput = function () { state.query = this.value; renderList(); };
  }

  function renderGameSel() {
    var s = currentSite();
    state.site = s.id;
    var gameSel = $("gameSel");
    gameSel.innerHTML = "";
    (s.games || []).forEach(function (g) {
      var o = document.createElement("option");
      o.value = g.id; o.textContent = g.name; gameSel.appendChild(o);
    });
    gameSel.onchange = function () { state.game = this.value; state.level = null; renderAll(); };
  }

  function renderList() {
    var g = currentGame();
    var box = $("levelList");
    box.innerHTML = "";
    if (!g) { box.innerHTML = '<div class="empty">ゲームがありません</div>'; return; }
    state.game = g.id;

    var levels = (g.levels || []).filter(function (lv) { return matchesQuery(lv, state.query); });
    var done = (g.levels || []).filter(function (lv) { return lv.status === "done"; }).length;

    var head = document.createElement("div");
    head.className = "gamehead";
    head.textContent = g.name;
    box.appendChild(head);
    var prog = document.createElement("div");
    prog.className = "progress";
    prog.textContent = "進捗 " + done + " / " + (g.levels || []).length + " クリア";
    box.appendChild(prog);

    if (!levels.length) { box.insertAdjacentHTML("beforeend", '<div class="empty">該当なし</div>'); return; }

    levels.forEach(function (lv) {
      var btn = document.createElement("button");
      btn.className = "lvitem" + (lv.boss ? " boss" : "") + (lv.id === state.level ? " active" : "");
      var st = lv.status || "todo";
      btn.innerHTML =
        '<span class="lvid">' + esc(lv.id) + '</span>' +
        '<span class="lvtitle">' + esc(lv.title || "") + '</span>' +
        '<span class="st st-' + st + '">' + (STATUS_LABEL[st] || st) + '</span>';
      btn.onclick = function () { state.level = lv.id; renderList(); renderDetail(); };
      box.appendChild(btn);
    });
  }

  function stepHtml(st) {
    var note = st.note ? '<div class="note">' + esc(st.note) + "</div>" : "";
    return '<div class="step">' +
      '<div class="cmdline">' +
        '<span class="prompt">$</span>' +
        '<pre class="cmd">' + esc(st.cmd) + "</pre>" +
        '<button class="copybtn" data-cmd="' + esc(st.cmd) + '">copy</button>' +
      "</div>" + note + "</div>";
  }

  function renderDetail() {
    var g = currentGame();
    var box = $("detail");
    if (!g) { box.innerHTML = '<div class="empty">—</div>'; return; }
    var lv = (g.levels || []).find(function (x) { return x.id === state.level; });
    if (!lv) {
      box.innerHTML = '<div class="empty">左のレベルを選んでください。<br>' +
        esc(g.description || "") + "</div>";
      return;
    }
    var st = lv.status || "todo";
    var tags = (lv.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("");
    var steps = (lv.steps || []).map(stepHtml).join("");
    var takeaways = (lv.takeaways || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");

    box.innerHTML =
      '<h1>' + esc(lv.id) + (lv.boss ? ' <span class="boss">★BOSS</span>' : "") + " — " + esc(lv.title || "") + "</h1>" +
      '<div class="lvmeta">' +
        '<span class="badge ' + st + '">' + (STATUS_LABEL[st] || st) + "</span>" +
        (lv.date ? '<span class="badge">' + esc(lv.date) + "</span>" : "") +
        tags +
      "</div>" +
      (lv.goal ? '<div class="goal"><span class="label">GOAL</span>' + esc(lv.goal) + "</div>" : "") +
      (steps ? '<div class="section-label">手順 / コマンド</div>' + steps : "") +
      (takeaways ? '<div class="section-label">学び</div><ul class="takeaways">' + takeaways + "</ul>" : "");

    Array.prototype.forEach.call(box.querySelectorAll(".copybtn"), function (b) {
      b.onclick = function () {
        var t = this.getAttribute("data-cmd");
        if (navigator.clipboard) navigator.clipboard.writeText(t);
        var old = this.textContent; this.textContent = "copied"; var self = this;
        setTimeout(function () { self.textContent = old; }, 900);
      };
    });
  }

  function renderAll() { renderGameSel(); renderList(); renderDetail(); }

  function init() {
    if (!DATA.sites || !DATA.sites.length) {
      $("levelList").innerHTML = '<div class="empty">データがありません</div>';
      return;
    }
    initHeader();
    renderAll();
  }

  init();
})();
