const DONE_KEY = "lcstudy.done.v2"; // { itemId: "YYYY-MM-DD" }
const PACE_KEY = "lcstudy.pace";    // items per day: 5 | 6 | 7
const VAULT = "study";              // Obsidian vault name = this folder's name

const LC_URL = (slug) => `https://leetcode.com/problems/${slug}/`;
const NEW_NOTE = (title) =>
  `obsidian://new?vault=${VAULT}&file=${encodeURIComponent(`LeetCode/${title}-${dateStr()}`)}`;
const OPEN_NOTE = (file) => `obsidian://open?vault=${VAULT}&file=${encodeURIComponent(file)}`;

const dateStr = (d = new Date()) => d.toLocaleDateString("sv-SE"); // local YYYY-MM-DD
const fmtDay = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};
const chunk = (arr, n) => {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
};

// Migrate v1 storage (array of slugs) into the dated v2 map.
{
  const old = localStorage.getItem("lcstudy.done.v1");
  if (old) {
    const cur = JSON.parse(localStorage.getItem(DONE_KEY) || "{}");
    for (const slug of JSON.parse(old)) cur[slug] ??= dateStr();
    localStorage.setItem(DONE_KEY, JSON.stringify(cur));
    localStorage.removeItem("lcstudy.done.v1");
  }
}

const done = JSON.parse(localStorage.getItem(DONE_KEY) || "{}");
let pace = +localStorage.getItem(PACE_KEY) || PACE_DEFAULT;
const openDays = new Set([0]);

const saveDone = () => localStorage.setItem(DONE_KEY, JSON.stringify(done));
const byId = Object.fromEntries(QUEUE.map((i) => [i.id, i]));
const total = QUEUE.length;

let toastTimer;
function showToast(msg) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
}

// Wires up an ✎ link: pop animation + toast, then lets the obsidian:// href fire.
function wireNoteLink(note, msg) {
  note.addEventListener("click", (e) => {
    e.stopPropagation();
    note.classList.remove("clicked");
    void note.offsetWidth; // restart animation on rapid clicks
    note.classList.add("clicked");
    setTimeout(() => note.classList.remove("clicked"), 400);
    showToast(msg);
  });
}

function updateStats() {
  const n = Object.keys(done).length;
  document.getElementById("progress-fill").style.width = `${(n / total) * 100}%`;
  document.getElementById("progress-text").textContent = `${n} / ${total}`;

  const tally = { E: 0, M: 0, H: 0 };
  for (const id in done) if (byId[id]?.diff) tally[byId[id].diff]++;
  document.getElementById("stat-diff").textContent = `${tally.E} E · ${tally.M} M · ${tally.H} H`;

  const dates = new Set(Object.values(done));
  let streak = 0;
  const d = new Date();
  if (!dates.has(dateStr(d))) d.setDate(d.getDate() - 1); // today may still be in progress
  while (dates.has(dateStr(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  document.getElementById("stat-streak").textContent = `streak ${streak}d`;

  const left = total - n;
  document.getElementById("stat-eta").textContent =
    left === 0 ? "plan complete" : `est. finish ${fmtDay(Math.ceil(left / pace) - 1)}`;

  document.querySelectorAll(".pace-btn").forEach((b) =>
    b.classList.toggle("active", +b.dataset.pace === pace)
  );
}

function renderHistory() {
  const box = document.getElementById("history");
  box.innerHTML = "";
  const byDate = {};
  for (const [id, date] of Object.entries(done)) (byDate[date] ||= []).push(byId[id]);
  const dates = Object.keys(byDate).sort().reverse();
  if (!dates.length) return;

  const det = document.createElement("details");
  det.className = "history";
  det.innerHTML = `<summary>Completed — ${Object.keys(done).length} items</summary>`;
  for (const date of dates) {
    const g = document.createElement("div");
    g.className = "hist-group";
    g.innerHTML =
      `<div class="hist-date">${date} · ${byDate[date].length} done</div>` +
      byDate[date].map((i) => `<div class="hist-item">${i.title}</div>`).join("");
    det.appendChild(g);
  }
  box.appendChild(det);
}

function render() {
  const main = document.getElementById("plan");
  main.innerHTML = "";
  const schedule = chunk(QUEUE.filter((i) => !done[i.id]), pace);
  const sections = [];

  schedule.forEach((items, i) => {
    const el = document.createElement("section");
    el.className = `day${openDays.has(i) ? " open" : ""}`;
    sections.push(el);

    const topics = [...new Set(items.map((x) => x.topic))];
    const header = document.createElement("div");
    header.className = "day-header";
    header.innerHTML = `
      <span class="day-num">${i === 0 ? "TODAY" : "DAY " + (i + 1)}</span>
      <span class="day-topic">${topics.join(" · ")}<span class="day-date">${fmtDay(i)}</span></span>
      <span class="day-count">${items.length} left</span>
      <span class="chevron">&#9654;</span>`;
    header.addEventListener("click", () => {
      el.classList.toggle("open");
      el.classList.contains("open") ? openDays.add(i) : openDays.delete(i);
    });

    const list = document.createElement("div");
    list.className = "problems";

    for (const item of items) {
      const row = document.createElement("label");
      row.className = "problem";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.addEventListener("change", () => {
        cb.checked ? (done[item.id] = dateStr()) : delete done[item.id];
        saveDone();
        row.classList.toggle("done", cb.checked);
        updateStats();
        renderHistory();
        const left = items.filter((x) => !done[x.id]).length;
        el.querySelector(".day-count").textContent = left ? `${left} left` : "done";
        if (left === 0) {
          const next = sections.findIndex((s) => s.querySelector("input:not(:checked)"));
          if (next > -1) {
            openDays.add(next);
            sections[next].classList.add("open");
            sections[next].scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }
      });

      if (item.type === "lc") {
        const link = document.createElement("a");
        link.className = "title";
        link.href = LC_URL(item.slug);
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = item.title;
        link.addEventListener("click", (e) => e.stopPropagation());

        const note = document.createElement("a");
        note.className = "note";
        note.href = NEW_NOTE(item.title);
        note.title = "Log note in Obsidian";
        note.textContent = "✎ note";
        wireNoteLink(note, `Opening Obsidian — LeetCode/${item.title}-${dateStr()}.md`);

        const diff = document.createElement("span");
        diff.className = `diff ${item.diff}`;
        diff.textContent = { E: "Easy", M: "Med", H: "Hard" }[item.diff];

        row.append(cb, link, note);
        if (topics.length > 1) {
          const tag = document.createElement("span");
          tag.className = "topic-tag";
          tag.textContent = item.topic;
          row.appendChild(tag);
        }
        row.appendChild(diff);
      } else {
        const body = document.createElement("span");
        body.className = "title";
        body.innerHTML = `${item.title}<span class="desc">${item.desc}</span>`;

        const badge = document.createElement("span");
        badge.className = "task-badge";
        badge.textContent = item.topic;

        row.append(cb, body);
        if (item.file) {
          const note = document.createElement("a");
          note.className = "note";
          note.href = OPEN_NOTE(item.file);
          note.title = "Open in Obsidian";
          note.textContent = "✎ note";
          wireNoteLink(note, `Opening Obsidian — ${item.file}`);
          row.appendChild(note);
        }
        row.appendChild(badge);
      }

      list.appendChild(row);
    }

    el.append(header, list);
    main.appendChild(el);
  });

  updateStats();
  renderHistory();
}

document.querySelectorAll(".pace-btn").forEach((b) =>
  b.addEventListener("click", () => {
    pace = +b.dataset.pace;
    localStorage.setItem(PACE_KEY, pace);
    render();
  })
);

document.getElementById("reset-btn").addEventListener("click", () => {
  if (confirm("Clear all progress?")) {
    for (const k in done) delete done[k];
    saveDone();
    openDays.clear();
    openDays.add(0);
    render();
  }
});

render();
