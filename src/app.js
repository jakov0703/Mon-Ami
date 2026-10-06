/* ═══════════════════════════════════════════════════════════════════════
   MON AMI — behaviour
   No scroll event handlers anywhere: every scroll-derived state uses
   IntersectionObserver so the page stays responsive under the thumb.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var HOURS = window.__MA_HOURS;
  var I18N  = window.__MA_I18N;
  var DAYS  = window.__MA_DAYS;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');

  /* ── Language ──────────────────────────────────────────────────────── */
  var lang = 'hr';
  try {
    var q = new URLSearchParams(location.search).get('lang');
    var saved = localStorage.getItem('ma-lang');
    if (q === 'en' || q === 'hr') lang = q;
    else if (saved === 'en' || saved === 'hr') lang = saved;
  } catch (e) {}

  function t(key) {
    var e = I18N[key];
    return e ? (e[lang] || e.hr) : '';
  }

  function applyLang() {
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.dataset.i18n);
      if (v) el.textContent = v;
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      // format: "aria-label:key, placeholder:key"
      el.dataset.i18nAttr.split(',').forEach(function (pair) {
        var bits = pair.split(':');
        var attr = bits[0] && bits[0].trim();
        var key = bits[1] && bits[1].trim();
        if (!attr || !key) return;
        var v = t(key);
        if (v) el.setAttribute(attr, v);
      });
    });

    // Dish names and other paired strings: swap which line leads.
    document.querySelectorAll('[data-hr]').forEach(function (el) {
      var other = el.dataset[lang === 'hr' ? 'hr' : 'en'];
      if (other != null) el.textContent = other;
    });

    document.querySelectorAll('.lang-seg button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });

    try { localStorage.setItem('ma-lang', lang); } catch (e) {}

    var url = new URL(location.href);
    if (lang === 'en') url.searchParams.set('lang', 'en');
    else url.searchParams.delete('lang');
    history.replaceState(null, '', url);

    renderStatus();
    renderHoursTable();
    buildTimeSlots();
  }

  function setLang(next) {
    if (next === lang) return;
    lang = next;
    if (document.startViewTransition && !reduce.matches) {
      document.startViewTransition(applyLang);
    } else {
      applyLang();
    }
  }

  document.querySelectorAll('.lang-seg button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.lang); });
  });

  /* ── Theme ─────────────────────────────────────────────────────────── */
  function setTheme(mode) {
    var html = document.documentElement;
    if (mode === 'auto') {
      html.removeAttribute('data-theme');
      html.style.colorScheme = '';
      try { localStorage.removeItem('ma-theme'); } catch (e) {}
    } else {
      html.dataset.theme = mode;
      html.style.colorScheme = 'only ' + mode;
      try { localStorage.setItem('ma-theme', mode); } catch (e) {}
    }
    var meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (meta) meta.content = effectiveDark() ? '#171310' : '#F9F6F0';
  }

  function effectiveDark() {
    var set = document.documentElement.dataset.theme;
    if (set === 'dark') return true;
    if (set === 'light') return false;
    return matchMedia('(prefers-color-scheme: dark)').matches;
  }

  (function initTheme() {
    var current = 'auto';
    try {
      var s = localStorage.getItem('ma-theme');
      if (s === 'light' || s === 'dark') current = s;
    } catch (e) {}
    document.querySelectorAll('input[name="theme"]').forEach(function (r) {
      r.checked = r.value === current;
      r.addEventListener('change', function () {
        if (r.checked) setTheme(r.value);
      });
    });
  })();

  /* ── Opening hours ─────────────────────────────────────────────────────
     Always read the clock in the restaurant's own timezone. A guest sitting
     in the departure lounge may be on a completely different one, and
     "are you open right now" has to answer for Velika Gorica, not for them.
     ──────────────────────────────────────────────────────────────────── */
  function zagreb() {
    var parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: HOURS.tz,
      weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date());

    var get = function (type) {
      var p = parts.find(function (x) { return x.type === type; });
      return p ? p.value : '';
    };
    var wdMap = { Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 };
    return {
      dow: wdMap[get('weekday')],
      minutes: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10),
      iso: get('year') + '-' + get('month') + '-' + get('day'),
    };
  }

  function toMin(hhmm) {
    var b = hhmm.split(':');
    return parseInt(b[0], 10) * 60 + parseInt(b[1], 10);
  }

  function slotFor(dow, iso) {
    if (iso && HOURS.holidays.indexOf(iso) !== -1) return null;
    return HOURS.week[dow];
  }

  /* Returns {state:'open'|'soon'|'shut', text:string} */
  function status() {
    var now = zagreb();
    var today = slotFor(now.dow, now.iso);

    if (today) {
      var open = toMin(today[0]);
      var close = toMin(today[1]);
      if (now.minutes >= open && now.minutes < close) {
        var left = close - now.minutes;
        if (left <= 60) {
          return { state: 'soon', text: t('st_soon').replace('{n}', String(left)) };
        }
        return { state: 'open', text: t('st_open').replace('{t}', today[1]) };
      }
      if (now.minutes < open) {
        return { state: 'shut', text: t('st_today').replace('{t}', today[0]) };
      }
    }

    // Find the next day that has hours. Never guesses more than a week out.
    for (var i = 1; i <= 7; i++) {
      var d = (now.dow + i) % 7;
      var s = slotFor(d, null);
      if (!s) continue;
      if (i === 1) return { state: 'shut', text: t('st_tmrw').replace('{t}', s[0]) };
      var acc = lang === 'hr' ? DAYS[d].acc : DAYS[d].en;
      return { state: 'shut', text: t('st_day').replace('{d}', acc).replace('{t}', s[0]) };
    }
    return { state: 'shut', text: t('st_closed') };
  }

  function renderStatus() {
    var s = status();
    document.querySelectorAll('[data-chip]').forEach(function (chip) {
      chip.dataset.state = s.state;
      var txt = chip.querySelector('.chip__txt');
      if (txt) txt.textContent = s.text;
      chip.setAttribute('aria-label', s.text);
    });
  }

  function renderHoursTable() {
    var now = zagreb();
    document.querySelectorAll('[data-hours-table] tr[data-dow]').forEach(function (tr) {
      var isToday = Number(tr.dataset.dow) === now.dow;
      if (isToday) tr.setAttribute('aria-current', 'date');
      else tr.removeAttribute('aria-current');
      var tag = tr.querySelector('.tag');
      if (tag) tag.textContent = isToday ? t('today') : '';
    });
  }

  /* ── Reservation time slots ──────────────────────────────────────────
     Generated from the same hours object as the chip and the table, so the
     form can never offer a time the restaurant is shut. Last seating is
     90 minutes before close.
     ─────────────────────────────────────────────────────────────────── */
  function buildTimeSlots() {
    var dateInput = document.getElementById('r-date');
    var timeSelect = document.getElementById('r-time');
    var warn = document.getElementById('r-closed');
    if (!dateInput || !timeSelect) return;

    var iso = dateInput.value;
    if (!iso) { timeSelect.innerHTML = ''; return; }

    // Parse as a plain calendar date; no timezone maths needed for a weekday.
    var p = iso.split('-').map(Number);
    var dow = new Date(Date.UTC(p[0], p[1] - 1, p[2])).getUTCDay();
    var slot = slotFor(dow, iso);

    timeSelect.innerHTML = '';
    if (!slot) {
      timeSelect.disabled = true;
      if (warn) { warn.textContent = t('closed_day'); warn.hidden = false; }
      return;
    }
    timeSelect.disabled = false;
    if (warn) warn.hidden = true;

    var start = toMin(slot[0]);
    var last = toMin(slot[1]) - 90;
    for (var m = start; m <= last; m += 30) {
      var hh = String(Math.floor(m / 60)).padStart(2, '0');
      var mm = String(m % 60).padStart(2, '0');
      var o = document.createElement('option');
      o.value = o.textContent = hh + ':' + mm;
      timeSelect.appendChild(o);
    }
  }

  (function initDate() {
    var d = document.getElementById('r-date');
    if (!d) return;
    var iso = zagreb().iso;
    d.min = iso;
    if (!d.value) d.value = iso;
    d.addEventListener('change', buildTimeSlots);
  })();

  /* ── Header hairline. A 1px sentinel, not a scroll listener. ───────── */
  (function stickyHeader() {
    var sentinel = document.getElementById('top-sentinel');
    var hdr = document.querySelector('.hdr');
    if (!sentinel || !hdr || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (entries) {
      hdr.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }).observe(sentinel);
  })();

  /* How much vertical space the sticky header plus the sticky menu toolbar
     occupy right now. Measured rather than hard-coded: the header is
     3.5rem on a phone and 4.5rem on a wide screen, and the toolbar is only
     sticky while the menu is on screen. */
  function stickyHeight() {
    var h = 0;
    var hdr = document.querySelector('.hdr');
    if (hdr) h += hdr.getBoundingClientRect().height;
    var tools = document.querySelector('.menu__tools');
    if (tools) {
      var r = tools.getBoundingClientRect();
      // Only counts while it is actually pinned under the header.
      if (r.top <= h + 2) h += r.height;
    }
    return Math.round(h);
  }

  /* The menu's category toolbar on its own. An anchored category heading
     comes to rest below it, so the rail's detection line has to account
     for it separately from the page header. */
  function toolbarHeight() {
    var tools = document.querySelector('.menu__tools');
    return tools ? Math.round(tools.getBoundingClientRect().height) : 0;
  }

  /* ── Menu category rail ────────────────────────────────────────────── */
  (function rail() {
    var track = document.querySelector('.rail__track');
    if (!track) return;
    var links = Array.prototype.slice.call(track.querySelectorAll('a'));

    document.querySelectorAll('.rail__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dir = btn.dataset.dir === 'next' ? 1 : -1;
        track.scrollBy({ left: dir * 180, behavior: reduce.matches ? 'auto' : 'smooth' });
      });
    });

    /* Centre a chip inside the rail WITHOUT touching the page scroll.
       scrollIntoView() is wrong here: even with block:'nearest' it walks
       every scrollable ancestor, so following the menu with the wheel made
       the document jump backwards. Setting scrollLeft moves only the rail. */
    function centreChip(a) {
      var target = a.offsetLeft - (track.clientWidth - a.offsetWidth) / 2;
      var max = track.scrollWidth - track.clientWidth;
      target = Math.max(0, Math.min(target, max));
      if (Math.abs(track.scrollLeft - target) < 2) return;
      if (reduce.matches || typeof track.scrollTo !== 'function') {
        track.scrollLeft = target;
      } else {
        track.scrollTo({ left: target, behavior: 'smooth' });
      }
    }

    if (!('IntersectionObserver' in window)) return;

    /* Mark the category nearest the top of the readable area. Tracking the
       single closest section is steadier than reacting to each crossing,
       which used to flicker between two chips at a boundary. */
    var cats = Array.prototype.slice.call(document.querySelectorAll('.menu__cat'));
    var current = null;

    /* While a chip jump is animating, the guest's intent is known and the
       geometry is still moving. Measuring mid-flight picks whichever section
       happens to be under the line and overrides the correct chip, so
       tracking is suspended until the scroll lands. */
    var jumpingTo = null;

    function sync() {
      if (jumpingTo) return;

      /* The line that decides "which category am I reading".
         A category counts as current once its top has passed this line.

         Getting this value right is the whole bug. An anchored heading comes
         to rest at roughly (scroll-margin + sticky toolbar height), because
         the browser honours scroll-padding on the root AND the element's own
         scroll-margin. Measuring only the sticky chrome put the line ~96px
         too high, so a freshly-jumped-to category never registered as
         crossed and the chip for the section above it stayed lit.
         Deriving the line from the same quantities the browser uses keeps
         the two in agreement. */
      var probe = cats[0];
      var margin = probe ? parseFloat(getComputedStyle(probe).scrollMarginTop) || 0 : 0;
      var rest = margin + toolbarHeight();
      var top = Math.max(stickyHeight(), rest) + 20;
      var best = null, firstAhead = null;

      /* The category you are reading is the LAST one whose heading has
         already crossed the line — not the nearest one. Distance alone
         picks the wrong chip: the previous category is often still
         straddling the line when the next heading is already on screen,
         and it scores zero distance. Categories are in document order,
         so the last match wins. */
      for (var i = 0; i < cats.length; i++) {
        var el = cats[i];
        if (el.offsetParent === null) continue;      // hidden by a diet filter
        var r = el.getBoundingClientRect();
        if (r.top <= top) { best = el.id; continue; }
        if (firstAhead === null) firstAhead = el.id;
      }
      // Above the first category: highlight the one we are heading into.
      if (best === null) best = firstAhead;
      if (!best || best === current) return;
      current = best;
      for (var k = 0; k < links.length; k++) {
        var on = links[k].getAttribute('href') === '#' + best;
        links[k].classList.toggle('is-active', on);
        if (on) centreChip(links[k]);
      }
    }

    /* The observer tells us *when* the set of on-screen categories changes;
       it cannot tell us which one is nearest the top, so sync() works that
       out by measuring. One rAF-throttled read per change keeps it cheap —
       there is still no scroll handler on the page. */
    var queued = false;
    function schedule() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; sync(); });
    }

    var io = new IntersectionObserver(schedule, {
      threshold: [0, 0.02, 0.5, 0.98, 1],
    });
    cats.forEach(function (s) { io.observe(s); });

    /* A thin sentinel at the top of each category, positioned exactly on the
       detection line, so the chip changes as the boundary is crossed rather
       than only when a whole section enters or leaves the viewport. The
       observer still does the work — there is no scroll handler. */
    var lineIo = new IntersectionObserver(schedule, {
      rootMargin: '-' + (Math.max(stickyHeight(), 200)) + 'px 0px -55% 0px',
      threshold: 0,
    });
    cats.forEach(function (s) {
      var h = s.querySelector('h3');
      if (h) lineIo.observe(h);
    });

    /* Filtering changes which categories are on the page, so the active
       chip has to be recomputed — and the rail scrolled back to the start,
       since the chips it was showing may no longer exist. */
    document.querySelectorAll('.filters input').forEach(function (cb) {
      cb.addEventListener('change', function () {
        current = null;
        track.scrollLeft = 0;
        sync();
      });
    });

    /* Tapping a chip may not cross any observer threshold — the target
       section can already be on screen — so mark it active immediately and
       re-measure once the smooth scroll has settled. */
    links.forEach(function (a) {
      a.addEventListener('click', function () {
        var id = a.getAttribute('href').slice(1);
        current = id;
        jumpingTo = id;
        links.forEach(function (x) { x.classList.toggle('is-active', x === a); });
        centreChip(a);

        /* Release tracking once the page has actually stopped moving, rather
           than after a fixed delay — a long jump takes longer than a short
           one, and a guest who starts scrolling again should take over. */
        var still = 0, lastY = window.scrollY, waited = 0;
        (function settle() {
          if (jumpingTo !== id) return;             // superseded by a newer tap
          if (window.scrollY === lastY) still++; else { still = 0; lastY = window.scrollY; }
          waited += 50;
          if (still >= 4 || waited > 2000) {
            jumpingTo = null;
            current = null;
            sync();
            return;
          }
          setTimeout(settle, 50);
        })();
      });
    });

    sync();
  })();

  /* ── Reservation dialog ────────────────────────────────────────────── */
  (function reservation() {
    var dlg = document.getElementById('rezervacija');
    if (!dlg) return;

    document.querySelectorAll('[data-open-booking]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var occasion = btn.dataset.openBooking === 'prigoda';
        if (occasion) {
          var r = document.getElementById('r-kind-prigoda');
          if (r) r.checked = true;
          var p10 = document.querySelector('.pax input[value="9+"]');
          if (p10) p10.checked = true;
        }
        dlg.removeAttribute('data-sent');
        buildTimeSlots();
        dlg.showModal();
      });
    });

    dlg.querySelectorAll('[data-close]').forEach(function (b) {
      b.addEventListener('click', function () { dlg.close(); });
    });

    var form = dlg.querySelector('form');
    if (form) {
      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (!form.reportValidity()) return;

        // No backend is wired up yet, so hand the request to the mail client
        // rather than pretending it was sent. Swap this for a real endpoint
        // when one exists — see the handover note in HANDOVER.md.
        var d = new FormData(form);
        var lines = [
          t('m_name') + ': ' + (d.get('ime') || ''),
          t('m_phone') + ': ' + (d.get('telefon') || ''),
          t('m_email') + ': ' + (d.get('email') || ''),
          t('m_date') + ': ' + (d.get('datum') || ''),
          t('m_time') + ': ' + (d.get('vrijeme') || ''),
          t('m_pax') + ': ' + (d.get('osobe') || ''),
          t('m_kind') + ': ' + (d.get('prilika') || ''),
          t('m_note') + ': ' + (d.get('napomena') || ''),
        ].join('\n');

        var href = 'mailto:' + window.__MA_EMAIL
          + '?subject=' + encodeURIComponent(t('m_subject'))
          + '&body=' + encodeURIComponent(lines);
        window.location.href = href;
        dlg.setAttribute('data-sent', '');
      });
    }
  })();

  /* ── Lightbox ──────────────────────────────────────────────────────── */
  (function lightbox() {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    var img = lb.querySelector('img');
    var cap = lb.querySelector('.lb__cap');
    var triggers = Array.prototype.slice.call(document.querySelectorAll('.frame__btn'));
    var idx = 0;

    function show(i) {
      idx = (i + triggers.length) % triggers.length;
      var src = triggers[idx];
      var full = src.dataset.full;
      var srcImg = src.querySelector('img');
      img.src = full;
      img.alt = srcImg ? srcImg.alt : '';
      if (cap) cap.textContent = src.dataset.cap || '';
    }

    triggers.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        show(i);
        lb.showModal();
      });
    });

    lb.querySelectorAll('[data-lb]').forEach(function (b) {
      b.addEventListener('click', function () {
        show(idx + (b.dataset.lb === 'next' ? 1 : -1));
      });
    });
    lb.querySelectorAll('[data-close]').forEach(function (b) {
      b.addEventListener('click', function () { lb.close(); });
    });

    lb.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowRight') { ev.preventDefault(); show(idx + 1); }
      if (ev.key === 'ArrowLeft')  { ev.preventDefault(); show(idx - 1); }
    });
  })();

  /* ── Image failure: show the designed panel instead of a broken icon ─ */
  document.querySelectorAll('.frame__box img, .panel img, .person img').forEach(function (im) {
    im.addEventListener('error', function () { im.dataset.failed = ''; }, { once: true });
    if (im.complete && im.naturalWidth === 0) im.dataset.failed = '';
  });

  /* ── Footer year ───────────────────────────────────────────────────── */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* ── Boot ──────────────────────────────────────────────────────────── */
  applyLang();
  setInterval(renderStatus, 60000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) { renderStatus(); renderHoursTable(); }
  });
})();
