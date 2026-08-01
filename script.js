/* ============================================================
   FOR SMILEY — interaction layer
   Sections: loader, gate, reveals, museum modal, letter,
   particles, starfield, parallax, cursor aura.
   ============================================================ */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Loading sequence ---------- */
  const loader = $("#loader");
  const loaderWord = $("#loaderWord");
  const loaderFill = $("#loaderFill");
  const loaderCount = $("#loaderCount");
  const words = ["Assembling something rare", "Polishing the light", "Almost ready"];

  let progress = 0;
  let wordIndex = 0;
  loaderWord.textContent = words[0];

  const tick = window.setInterval(() => {
    progress = Math.min(100, progress + Math.random() * 14 + 6);
    loaderFill.style.width = progress + "%";
    loaderCount.textContent = String(Math.round(progress)).padStart(3, "0");

    const nextWord = Math.floor((progress / 100) * words.length);
    if (nextWord !== wordIndex && words[nextWord]) {
      wordIndex = nextWord;
      loaderWord.textContent = words[wordIndex];
    }

    if (progress >= 100) {
      window.clearInterval(tick);
      window.setTimeout(() => {
        loader.classList.add("is-done");
        typeGateLine();
      }, 520);
    }
  }, reduced ? 60 : 260);

  /* ---------- 2. Gate: typewriter + entry ---------- */
  const gate = $("#gate");
  const gateLine = $("#gateLine");
  const gateBtn = $("#gateBtn");
  const gateText = "This website was created for exactly one person.";

  function typeGateLine() {
    if (reduced) {
      gateLine.textContent = gateText;
      gateBtn.hidden = false;
      return;
    }
    let i = 0;
    const t = window.setInterval(() => {
      gateLine.textContent = gateText.slice(0, ++i);
      if (i >= gateText.length) {
        window.clearInterval(t);
        window.setTimeout(() => { gateBtn.hidden = false; }, 350);
      }
    }, 42);
  }

  gateBtn.addEventListener("click", () => {
    gate.classList.add("is-open");
    document.body.classList.remove("is-locked");
    window.setTimeout(() => {
      gate.setAttribute("aria-hidden", "true");
      $("#search").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    }, 420);
  });
  document.body.classList.add("is-locked");

  /* ---------- 3. Scroll-triggered reveals ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );
  $$(".reveal").forEach((el) => io.observe(el));

  /* Staggered lists (abilities, future moments) */
  const staggerIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        $$("li", entry.target).forEach((li, i) => {
          window.setTimeout(() => li.classList.add("is-in"), reduced ? 0 : i * 220);
        });
        staggerIO.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );
  $$("[data-stagger]").forEach((el) => staggerIO.observe(el));

  /* ---------- 4. Museum: build 12 placeholders + modal ---------- */
  const gallery = $("#gallery");
  const captions = [
    ["This is one of my favorite photos of you.", "Not because it's perfect.", "Because it's you."],
    ["I keep coming back to this one.", "It's the smile that gave you your name.", "Smiley."],
    ["Nothing staged. Nothing planned.", "Just a good day, kept.", "Exactly how I remember it."],
    ["You weren't trying to look beautiful here.", "That's precisely why you do.", "Effortless, as always."],
    ["Ordinary light, extraordinary person.", "Somehow that's always the formula.", "You."],
    ["I remember what you said right after this.", "It made me laugh for a week.", "Still does."],
    ["Framed because of the feeling, not the focus.", "Some moments don't need sharpness.", "They just need you in them."],
    ["This is the version of you I'd keep forever.", "Unguarded. Warm. Real.", "Mine to admire."],
    ["A quiet moment worth more than a loud one.", "You make quiet feel full.", "Thank you for that."],
    ["If I could bottle a day, it would be this one.", "Nothing special happened.", "You were there. That was enough."],
    ["Proof that my favorite view isn't a place.", "It's a person.", "It's you."],
    ["The last one in the gallery, on purpose.", "Because there are still empty frames after it.", "We'll fill them together."],
  ];

  captions.forEach((_, i) => {
  const btn = document.createElement("button");
  btn.className = "art reveal";
  btn.type = "button";
  btn.dataset.index = String(i);
  btn.setAttribute("aria-label", "Open artwork " + (i + 1));

  btn.innerHTML = `
    <img
      src="images/photo${i + 1}.jpg"
      alt="Smiley ${i + 1}"
      class="gallery-img"
    />
    <span class="art__no">No. ${String(i + 1).padStart(2, "0")}</span>
  `;

  gallery.appendChild(btn);
  io.observe(btn);
});

  const artModal = $("#artModal");
  const artMedia = $("#artMedia");
  const artCaption = $("#artCaption");
  let lastFocused = null;

  function openModal(modal) {
    lastFocused = document.activeElement;
    modal.classList.add("is-open");
    document.body.classList.add("is-locked");
    const close = $(".close", modal);
    if (close) close.focus();
  }
  function closeModal(modal) {
    modal.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    if (lastFocused) lastFocused.focus();
  }

  gallery.addEventListener("click", (event) => {
    const card = event.target.closest(".art");
    if (!card) return;
    const i = Number(card.dataset.index);
    artMedia.innerHTML = card.querySelector("img")
      ? card.querySelector("img").outerHTML
      : '<span class="ph"><strong>Photo ' + (i + 1) + "</strong><span>replace me</span></span>";
    artCaption.innerHTML = captions[i].map((line) => "<p>" + line + "</p>").join("");
    openModal(artModal);
  });

  /* ---------- 5. Secret letter ---------- */
  const letterModal = $("#letterModal");
  $("#heart").addEventListener("click", () => openModal(letterModal));

  /* ---------- 6. Modal dismissal (backdrop, close, Escape) ---------- */
  $$(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.closest(".close")) closeModal(modal);
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    $$(".modal.is-open").forEach(closeModal);
  });

  /* ---------- 7. Floating particles (canvas) ---------- */
  const pCanvas = $("#particles");
  const pCtx = pCanvas.getContext("2d");
  let particles = [];
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function sizeCanvas(canvas) {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  }

  function seedParticles() {
    const count = window.innerWidth < 700 ? 34 : 70;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.6 + 0.4,
      vy: -(Math.random() * 0.25 + 0.06),
      vx: (Math.random() - 0.5) * 0.14,
      a: Math.random() * 0.5 + 0.15,
      gold: Math.random() > 0.5,
    }));
  }

  /* ---------- 8. Starfield (future room) ---------- */
  const sCanvas = $("#starfield");
  const sCtx = sCanvas.getContext("2d");
  let stars = [];

  function seedStars() {
    const count = window.innerWidth < 700 ? 90 : 190;
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.3 + 0.2,
      p: Math.random() * Math.PI * 2,
      s: Math.random() * 0.02 + 0.005,
    }));
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    sizeCanvas(pCanvas);
    sizeCanvas(sCanvas);
    seedParticles();
    seedStars();
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  /* ---------- 9. Animation loop ---------- */
  function frame() {
    pCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) { p.y = window.innerHeight + 10; p.x = Math.random() * window.innerWidth; }
      if (p.x < -10) p.x = window.innerWidth + 10;
      if (p.x > window.innerWidth + 10) p.x = -10;
      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pCtx.fillStyle = p.gold
        ? "rgba(227,200,139," + p.a + ")"
        : "rgba(243,183,205," + p.a + ")";
      pCtx.fill();
    });

    if (sCanvas.classList.contains("is-live")) {
      sCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      stars.forEach((s) => {
        s.p += s.s;
        const alpha = 0.25 + Math.abs(Math.sin(s.p)) * 0.7;
        sCtx.beginPath();
        sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        sCtx.fillStyle = "rgba(255,255,255," + alpha + ")";
        sCtx.fill();
      });
    }
    window.requestAnimationFrame(frame);
  }
  if (!reduced) window.requestAnimationFrame(frame);

  /* Starfield fades in only while the future room is on screen */
  const starIO = new IntersectionObserver(
    (entries) => entries.forEach((e) => sCanvas.classList.toggle("is-live", e.isIntersecting)),
    { threshold: 0.15 }
  );
  starIO.observe($("#future"));

  /* ---------- 10. Parallax + cursor aura ---------- */
  const parallaxEls = $$("[data-parallax]");
  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (ticking || reduced) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        parallaxEls.forEach((el) => {
          const depth = Number(el.dataset.parallax) || 0.08;
          el.style.transform = "translate3d(0," + (-y * depth).toFixed(2) + "px,0)";
        });
        ticking = false;
      });
    },
    { passive: true }
  );

  const aura = $("#aura");
  if (window.matchMedia("(hover: hover)").matches && !reduced) {
    let ax = -400, ay = -400, tx = -400, ty = -400;
    window.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function follow() {
      ax += (tx - ax) * 0.08;
      ay += (ty - ay) * 0.08;
      aura.style.transform = "translate3d(" + ax + "px," + ay + "px,0)";
      window.requestAnimationFrame(follow);
    })();
  }
})();
