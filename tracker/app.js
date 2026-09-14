const DONE_KEY = "lcstudy.done.v2"; // { itemId: "YYYY-MM-DD" } — completion date
const PACE_KEY = "lcstudy.pace";    // items per day: 5 | 6 | 7
const PLAN_KEY = "lcstudy.plan";    // { date, ids } — today's presented set, for rollover
const MISS_KEY = "lcstudy.missed";  // { date: [ids] } — planned-but-unfinished per past date
const VAULT = "study";              // Obsidian vault name = this folder's name

const LC_URL = (slug) => `https://leetcode.com/problems/${slug}/`;
const NEW_NOTE = (title) =>
  `obsidian://new?vault=${VAULT}&file=${encodeURIComponent(`LeetCode/${title}-${dateStr()}`)}`;
const OPEN_NOTE = (file) => `obsidian://open?vault=${VAULT}&file=${encodeURIComponent(file)}`;

const dateStr = (d = new Date()) => d.toLocaleDateString("sv-SE"); // local YYYY-MM-DD
const fmtDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });
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
let missed = JSON.parse(localStorage.getItem(MISS_KEY) || "{}");
let pace = +localStorage.getItem(PACE_KEY) || PACE_DEFAULT;
const openState = new Map(); // section key -> bool (user toggles)

const saveDone = () => localStorage.setItem(DONE_KEY, JSON.stringify(done));
const byId = Object.fromEntries(QUEUE.map((i) => [i.id, i]));
const total = QUEUE.length;

// On a new day, record yesterday's planned-but-unfinished items as missed.
// Idempotent — safe to call on every render.
function rollover(today) {
  const plan = JSON.parse(localStorage.getItem(PLAN_KEY) || "null");
  if (plan && plan.date < today) {
    const unfinished = plan.ids.filter((id) => !done[id]);
    if (unfinished.length) {
      missed[plan.date] = [...new Set([...(missed[plan.date] || []), ...unfinished])];
      localStorage.setItem(MISS_KEY, JSON.stringify(missed));
    }
  }
}

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

function recount(el, items, date, missedCount) {
  const doneN = items.filter((x) => (date ? done[x.id] === date : done[x.id])).length;
  el.querySelector(".day-count").textContent = missedCount
    ? `${doneN} done · ${missedCount} missed`
    : doneN === items.length
    ? `${doneN} done`
    : doneN > 0
    ? `${doneN}/${items.length} done`
    : `${items.length} items`;
}

function render() {
  const main = document.getElementById("plan");
  main.innerHTML = "";

  const today = dateStr();
  rollover(today);
  const missedSet = new Set(Object.values(missed).flat());

  const remaining = QUEUE.filter((i) => !done[i.id]);
  const doneToday = QUEUE.filter((i) => done[i.id] === today);
  const pastDates = [...new Set([...Object.values(done), ...Object.keys(missed)])]
    .filter((d) => d < today)
    .sort();

  const sections = [];
  let dayNum = 0;

  // date: ISO string for real days, null for projected future days.
  const addSection = (items, chipText, dateLabel, key, date) => {
    if (!items.length) return;
    dayNum++;
    const el = document.createElement("section");
    const open = openState.get(key) ?? date === today;
    el.className = `day${open ? " open" : ""}`;
    sections.push({ el, items, key });

    const topics = [...new Set(items.map((x) => x.topic))];
    const header = document.createElement("div");
    header.className = "day-header";
    header.innerHTML = `
      <span class="day-num">${chipText}</span>
      <span class="day-topic">${topics.join(" · ")}<span class="day-date">${dateLabel}</span></span>
      <span class="day-count"></span>
      <span class="chevron">&#9654;</span>`;
    header.addEventListener("click", () => {
      const isOpen = el.classList.toggle("open");
      openState.set(key, isOpen);
    });

    const list = document.createElement("div");
    list.className = "problems";

    for (const item of items) {
      // In a past section, an item recorded as missed that day renders as a
      // non-actionable record — the actionable copy lives in its new day.
      const isMissedRecord = date && date !== today && missed[date]?.includes(item.id);

      const row = document.createElement("label");
      row.className = `problem${done[item.id] ? " done" : ""}${isMissedRecord ? " missed" : ""}`;

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !!done[item.id];
      cb.disabled = isMissedRecord;
      cb.addEventListener("change", () => {
        cb.checked ? (done[item.id] = today) : delete done[item.id];
        saveDone();
        row.classList.toggle("done", cb.checked);
        recount(el, items, date, date && date !== today ? missed[date]?.length || 0 : 0);
        updateStats();
        const next = sections.find((s) => s.el.querySelector("input:not(:checked):not(:disabled)"));
        if (next && !next.el.classList.contains("open")) {
          next.el.classList.add("open");
          openState.set(next.key, true);
          next.el.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
        wireNoteLink(note, `Opening Obsidian — LeetCode/${item.title}-${today}.md`);

        const diff = document.createElement("span");
        diff.className = `diff ${item.diff}`;
        diff.textContent = { E: "Easy", M: "Med", H: "Hard" }[item.diff];

        row.append(cb, link, note);
        if (isMissedRecord) {
          const tag = document.createElement("span");
          tag.className = "topic-tag missed-tag";
          tag.textContent = "missed →";
          row.appendChild(tag);
        } else if (missedSet.has(item.id)) {
          const tag = document.createElement("span");
          tag.className = "topic-tag";
          tag.textContent = "carried";
          row.appendChild(tag);
        } else if (topics.length > 1) {
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
    recount(el, items, date, date && date !== today ? missed[date]?.length || 0 : 0);
    main.appendChild(el);
  };

  // Past days: completions stay pinned to their date; unfinished items show as missed.
  for (const date of pastDates) {
    addSection(
      QUEUE.filter((i) => done[i.id] === date || missed[date]?.includes(i.id)),
      `DAY ${dayNum + 1}`,
      fmtDate(date),
      `d${date}`,
      date
    );
  }

  // Today: what you already did + enough upcoming items to fill your pace.
  const slots = Math.max(0, pace - doneToday.length);
  const todayItems = [...doneToday, ...remaining.slice(0, slots)];
  addSection(todayItems, "TODAY", fmtDay(0), `d${today}`, today);

  // Record today's presented set so tomorrow's rollover can tell what was missed.
  localStorage.setItem(PLAN_KEY, JSON.stringify({ date: today, ids: todayItems.map((i) => i.id) }));

  // Upcoming days: the rest of the queue chunked by pace, starting tomorrow.
  chunk(remaining.slice(slots), pace).forEach((items, j) =>
    addSection(items, `DAY ${dayNum + 1}`, fmtDay(j + 1), `f${j}`, null)
  );

  updateStats();
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
    missed = {};
    saveDone();
    localStorage.removeItem(PLAN_KEY);
    localStorage.removeItem(MISS_KEY);
    openState.clear();
    render();
  }
});

// Keep multiple open tabs in sync: `storage` fires in every tab except the one
// that made the change; the focus re-sync covers anything that slips through.
function syncFromStorage() {
  const latest = JSON.parse(localStorage.getItem(DONE_KEY) || "{}");
  const latestMissed = JSON.parse(localStorage.getItem(MISS_KEY) || "{}");
  let dirty = false;
  if (JSON.stringify(latest) !== JSON.stringify(done)) {
    for (const k in done) delete done[k];
    Object.assign(done, latest);
    dirty = true;
  }
  if (JSON.stringify(latestMissed) !== JSON.stringify(missed)) {
    missed = latestMissed;
    dirty = true;
  }
  const latestPace = +localStorage.getItem(PACE_KEY) || PACE_DEFAULT;
  if (latestPace !== pace) {
    pace = latestPace;
    dirty = true;
  }
  if (dirty) render();
}
window.addEventListener("storage", syncFromStorage);
window.addEventListener("focus", syncFromStorage);

render();
