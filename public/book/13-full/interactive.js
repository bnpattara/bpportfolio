(function () {
  "use strict";

  var sections = Array.prototype.slice.call(
    document.querySelectorAll(".template-section")
  );
  if (!sections.length) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var spreadNaturalWidth = 1536;
  var spreadNaturalHeight = 768;

  var root = document.documentElement;
  root.classList.add("book-flip");

  function setSpreadScale(scale) {
    root.style.setProperty("--spread-scale", String(scale));
  }

  /** Scale spreads so the full two-page width fits the viewport (no UI chrome). */
  function applyFitScale() {
    var padX = 24;
    var padY = 24;
    var w = window.innerWidth - padX * 2;
    var h = window.innerHeight - padY * 2;
    var scaleW = w / spreadNaturalWidth;
    var scaleH = h / spreadNaturalHeight;
    var s = Math.min(1, scaleW, scaleH);
    s = Math.max(0.18, s);
    setSpreadScale(s);
    document.querySelectorAll(".spread").forEach(function (el) {
      el.setAttribute("data-zoom", "fit");
    });
  }

  function isInteractiveTarget(el) {
    return el && el.closest && el.closest("a, button, input, select, textarea, label");
  }

  function scrollToAdjacent(section, delta) {
    var i = sections.indexOf(section);
    if (i < 0) return;
    scrollToSection(i + delta);
  }

  function addFlipZones(section) {
    if (section.querySelector(".book-flip-zones")) return;
    var z = document.createElement("div");
    z.className = "book-flip-zones";
    z.setAttribute("aria-hidden", "true");

    var prev = document.createElement("button");
    prev.type = "button";
    prev.className = "book-flip-zones__half book-flip-zones__half--prev";
    prev.setAttribute("aria-label", "Previous page");

    var next = document.createElement("button");
    next.type = "button";
    next.className = "book-flip-zones__half book-flip-zones__half--next";
    next.setAttribute("aria-label", "Next page");

    prev.addEventListener("click", function (e) {
      e.preventDefault();
      scrollToAdjacent(section, -1);
    });
    next.addEventListener("click", function (e) {
      e.preventDefault();
      scrollToAdjacent(section, 1);
    });

    z.appendChild(prev);
    z.appendChild(next);
    section.appendChild(z);
  }

  function spreadPanels(spread) {
    var bp = spread.querySelectorAll(":scope > .book-page");
    if (bp.length) return Array.prototype.slice.call(bp);
    var pg = spread.querySelectorAll(":scope > .page");
    return Array.prototype.slice.call(pg);
  }

  sections.forEach(function (section) {
    var spread = section.querySelector(".spread");
    if (spread) {
      var panels = spreadPanels(spread);
      if (panels.length >= 2) {
        panels[0].classList.add("book-flip--prev");
        panels[1].classList.add("book-flip--next");
        panels[0].addEventListener("click", function (e) {
          if (isInteractiveTarget(e.target)) return;
          e.preventDefault();
          scrollToAdjacent(section, -1);
        });
        panels[1].addEventListener("click", function (e) {
          if (isInteractiveTarget(e.target)) return;
          e.preventDefault();
          scrollToAdjacent(section, 1);
        });
      } else {
        addFlipZones(section);
      }
    } else {
      addFlipZones(section);
    }
  });

  sections.forEach(function (sec, i) {
    sec.id = sec.id || "section-" + (i + 1);
    sec.tabIndex = -1;
  });

  var currentIndex = 0;

  function scrollToSection(index) {
    if (index < 0 || index >= sections.length) return;
    currentIndex = index;
    var el = sections[index];
    var behavior = reduceMotion ? "auto" : "smooth";
    el.scrollIntoView({ behavior: behavior, block: "start" });
    if (history.replaceState) {
      history.replaceState(null, "", "#" + el.id);
    } else {
      location.hash = el.id;
    }
    el.focus({ preventScroll: true });
  }

  function sectionIndexFromHash() {
    var hash = (location.hash || "").slice(1);
    if (!hash) return 0;
    var i = sections.findIndex(function (s) {
      return s.id === hash;
    });
    return i >= 0 ? i : 0;
  }

  function syncCurrentFromScroll() {
    var scrollY = window.scrollY || document.documentElement.scrollTop;
    var viewH = window.innerHeight;
    var mid = scrollY + viewH * 0.25;
    var idx = 0;
    for (var i = 0; i < sections.length; i++) {
      var top = sections[i].getBoundingClientRect().top + scrollY;
      if (top <= mid + 80) idx = i;
    }
    currentIndex = idx;
  }

  window.addEventListener("keydown", function (e) {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    if (e.key === "j" || e.key === "J" || e.key === "ArrowRight" || e.key === "ArrowDown") {
      scrollToSection(currentIndex + 1);
      e.preventDefault();
    } else if (e.key === "k" || e.key === "K" || e.key === "ArrowLeft" || e.key === "ArrowUp") {
      scrollToSection(currentIndex - 1);
      e.preventDefault();
    }
  });

  window.addEventListener(
    "scroll",
    function () {
      syncCurrentFromScroll();
    },
    { passive: true }
  );

  window.addEventListener("resize", function () {
    applyFitScale();
  });

  window.addEventListener("hashchange", function () {
    var i = sectionIndexFromHash();
    currentIndex = i;
  });

  if (!reduceMotion) {
    sections.forEach(function (sec) {
      sec.classList.add("book-reveal");
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) en.target.classList.add("is-inview");
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    sections.forEach(function (sec) {
      io.observe(sec);
    });
  }

  applyFitScale();
  currentIndex = sectionIndexFromHash();
  syncCurrentFromScroll();

  if (location.hash) {
    requestAnimationFrame(function () {
      scrollToSection(sectionIndexFromHash());
    });
  }
})();
