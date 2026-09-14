const STORAGE_KEY = "lcstudy.done.v1";
const VAULT = "study"; // Obsidian vault name = this folder's name
const LC_URL = (slug) => `https://leetcode.com/problems/${slug}/`;
// Matches the vault's existing note convention: LeetCode/<Title>-YYYY-MM-DD.md
const NOTE_URL = (title) =>
  `obsidian://new?vault=${VAULT}&file=${encodeURIComponent(`LeetCode/${title}-${new Date().toISOString().slice(0, 10)}`)}`;

const loadDone = () => new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
const saveDone = (done) => localStorage.setItem(STORAGE_KEY, JSON.stringify([...done]));

const total = PLAN.reduce((n, d) => n + d.problems.length, 0);
const done = loadDone();

function updateStats() {
  document.getElementById("progress-fill").style.width = `${(done.size / total) * 100}%`;
  document.getElementById("progress-text").textContent = `${done.size} / ${total}`;
  document.getElementById("stat-days").textContent =
    `${PLAN.filter((d) => d.problems.every((p) => done.has(p.slug))).length} days complete`;
  const tally = { E: 0, M: 0, H: 0 };
  for (const d of PLAN) for (const p of d.problems) if (done.has(p.slug)) tally[p.diff]++;
  document.getElementById("stat-diff").textContent = `${tally.E} E · ${tally.M} M · ${tally.H} H`;
}

function updateDayEl(el, day) {
  const dayDone = day.problems.filter((p) => done.has(p.slug)).length;
  el.querySelector(".day-count").textContent = `${dayDone}/${day.problems.length}`;
  el.classList.toggle("complete", dayDone === day.problems.length);
}

function render() {
  const main = document.getElementById("plan");
  main.innerHTML = "";
  const firstOpen = PLAN.find((d) => d.problems.some((p) => !done.has(p.slug)))?.day;

  for (const day of PLAN) {
    const el = document.createElement("section");
    el.className = `day${day.day === firstOpen ? " open" : ""}`;

    const header = document.createElement("div");
    header.className = "day-header";
    header.innerHTML = `
      <span class="day-num">DAY ${day.day}</span>
      <span class="day-topic">${day.topic}</span>
      <span class="day-count"></span>
      <span class="chevron">&#9654;</span>`;
    header.addEventListener("click", () => el.classList.toggle("open"));

    const list = document.createElement("div");
    list.className = "problems";

    for (const p of day.problems) {
      const row = document.createElement("label");
      row.className = `problem${done.has(p.slug) ? " done" : ""}`;

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = done.has(p.slug);
      cb.addEventListener("change", () => {
        cb.checked ? done.add(p.slug) : done.delete(p.slug);
        saveDone(done);
        row.classList.toggle("done", cb.checked);
        updateDayEl(el, day);
        updateStats();
        if (day.problems.every((q) => done.has(q.slug))) {
          const next = PLAN.find((d) => d.problems.some((q) => !done.has(q.slug)));
          if (next) {
            const nextEl = main.children[next.day - 1];
            el.classList.remove("open");
            nextEl.classList.add("open");
            nextEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }
      });

      const link = document.createElement("a");
      link.className = "title";
      link.href = LC_URL(p.slug);
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = p.title;
      link.addEventListener("click", (e) => e.stopPropagation());

      const note = document.createElement("a");
      note.className = "note";
      note.href = NOTE_URL(p.title);
      note.title = "Log note in Obsidian";
      note.textContent = "✎";
      note.addEventListener("click", (e) => e.stopPropagation());

      const diff = document.createElement("span");
      diff.className = `diff ${p.diff}`;
      diff.textContent = { E: "Easy", M: "Med", H: "Hard" }[p.diff];

      row.append(cb, link, note, diff);
      list.appendChild(row);
    }

    el.append(header, list);
    updateDayEl(el, day);
    main.appendChild(el);
  }

  updateStats();
}

document.getElementById("reset-btn").addEventListener("click", () => {
  if (confirm("Clear all progress?")) {
    done.clear();
    saveDone(done);
    render();
  }
});

render();
