/**
 * Keeps .cs-stat-eyebrow / .cs-stat-eyebrow-dark on one line by shrinking font-size
 * within a row; uses one size per row so columns stay aligned.
 */
(function () {
  var MIN_PX = 5.5;
  var MAX_PX = 9;

  function colCount(grid) {
    var tmpl = getComputedStyle(grid).gridTemplateColumns;
    var n = tmpl.split(' ').filter(Boolean).length;
    if (n > 0) return n;
    if (grid.classList.contains('cs-stats-4')) return 4;
    if (grid.classList.contains('cs-stats-3')) return 3;
    return 3;
  }

  function maxFontForEl(el, maxW) {
    var lo = MIN_PX;
    var hi = MAX_PX;
    var best = MIN_PX;
    var i;
    el.style.whiteSpace = 'nowrap';
    for (i = 0; i < 22; i++) {
      var mid = (lo + hi) / 2;
      el.style.fontSize = mid + 'px';
      if (el.scrollWidth <= maxW + 0.5) {
        best = mid;
        lo = mid;
      } else {
        hi = mid;
      }
    }
    return best;
  }

  function fitRow(eyebrows) {
    if (!eyebrows.length) return;
    var rowFont = MAX_PX;
    var i;
    for (i = 0; i < eyebrows.length; i++) {
      var el = eyebrows[i];
      var cell = el.closest('.cs-stat-cell');
      if (!cell) continue;
      var cs = getComputedStyle(cell);
      var pad =
        parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      var maxW = cell.clientWidth - pad;
      if (maxW <= 0) continue;
      el.style.fontSize = MAX_PX + 'px';
      rowFont = Math.min(rowFont, maxFontForEl(el, maxW));
    }
    for (i = 0; i < eyebrows.length; i++) {
      eyebrows[i].style.fontSize = rowFont + 'px';
    }
  }

  function run() {
    document.querySelectorAll('.cs-stats').forEach(function (grid) {
      var cols = colCount(grid);
      var cells = Array.prototype.slice.call(
        grid.querySelectorAll(':scope > .cs-stat-cell')
      );
      var r;
      for (r = 0; r < cells.length; r += cols) {
        var rowCells = cells.slice(r, r + cols);
        var eyebrows = rowCells
          .map(function (c) {
            return c.querySelector('.cs-stat-eyebrow, .cs-stat-eyebrow-dark');
          })
          .filter(Boolean);
        fitRow(eyebrows);
      }
    });
  }

  function schedule() {
    clearTimeout(schedule._t);
    schedule._t = setTimeout(function () {
      requestAnimationFrame(run);
    }, 50);
  }

  window.csStatEyebrowFit = run;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }

  window.addEventListener('resize', schedule);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(schedule);
  }
})();
