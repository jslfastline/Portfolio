/* FastLine Technologies — site interactions (2026) */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Failsafe: if motion setup ever fails, never leave content hidden. */
  var revealFailSafe = window.setTimeout(function () {
    document.querySelectorAll('.reveal, .reveal-image').forEach(function (el) {
      el.classList.add('in');
    });
  }, 2600);

  /* ---------- Theme ---------- */
  var THEME_KEY = 'fastline-theme';
  var root = document.documentElement;

  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function syncThemeControls(theme) {
    var nextLabel = theme === 'dark' ? 'Light' : 'Dark';
    var nextName = theme === 'dark' ? 'light' : 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      var label = btn.querySelector('[data-theme-label]');
      if (label) label.textContent = nextLabel;
      btn.setAttribute('aria-label', 'Switch to ' + nextName + ' theme');
      btn.setAttribute('title', 'Switch to ' + nextName + ' theme');
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#080F1D' : '#F8FAFC');
  }

  function applyTheme(theme, animate, persist) {
    var next = theme === 'dark' ? 'dark' : 'light';
    if (animate && !REDUCED) {
      root.classList.add('theme-changing');
      void root.offsetWidth;
    }
    root.setAttribute('data-theme', next);
    root.style.colorScheme = next;
    syncThemeControls(next);
    if (persist !== false) {
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    }
    if (animate && !REDUCED) {
      window.setTimeout(function () { root.classList.remove('theme-changing'); }, 380);
    }
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-theme-toggle]') : null;
    if (!btn) return;
    e.preventDefault();
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    var toggles = document.querySelectorAll('[data-theme-toggle]');
    toggles.forEach(function (b) { b.classList.add('is-changing'); });
    window.setTimeout(function () {
      applyTheme(next, true);
      toggles.forEach(function (b) { b.classList.remove('is-changing'); });
    }, REDUCED ? 0 : 130);
  });

  window.addEventListener('storage', function (e) {
    if (e.key === THEME_KEY && (e.newValue === 'dark' || e.newValue === 'light')) {
      applyTheme(e.newValue, true, false);
    }
  });

  syncThemeControls(currentTheme());

  /* ---------- FastLine Universe ---------- */
  var universeCore = document.querySelector('#universe .uni-core');
  var productsCounter = document.querySelector('[data-products-counter]');
  var exploreLabButton = document.querySelector('.uni-core__cta[aria-controls="uni-products"]');
  var productsPanel = document.getElementById('uni-products');

  if (productsCounter) {
    var counterStarted = false;

    function animateProductsCounter() {
      if (counterStarted) return;
      counterStarted = true;

      var riseDuration = 780;
      var peakDuration = 140;
      var fallDuration = 1500;
      var startTime = null;

      function renderCount(value) {
        var count = Math.round(value);
        productsCounter.textContent = count >= 100
          ? '100+'
          : count === 0 ? '0' : String(count).padStart(2, '0');
      }

      function tick(timestamp) {
        if (startTime === null) startTime = timestamp;
        var elapsed = timestamp - startTime;

        if (elapsed < riseDuration) {
          var rise = elapsed / riseDuration;
          renderCount(100 * (1 - Math.pow(1 - rise, 3)));
          requestAnimationFrame(tick);
          return;
        }

        if (elapsed < riseDuration + peakDuration) {
          renderCount(100);
          requestAnimationFrame(tick);
          return;
        }

        var fallElapsed = elapsed - riseDuration - peakDuration;
        if (fallElapsed < fallDuration) {
          renderCount(100 - 96 * (fallElapsed / fallDuration));
          requestAnimationFrame(tick);
          return;
        }

        productsCounter.textContent = '04';
      }

      productsCounter.textContent = '0';
      requestAnimationFrame(tick);
    }

    if (REDUCED) {
      productsCounter.textContent = '04';
      counterStarted = true;
    } else if (universeCore && 'IntersectionObserver' in window) {
      var productsCounterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          productsCounterObserver.unobserve(entry.target);
          animateProductsCounter();
        });
      }, { threshold: 0.18 });
      productsCounterObserver.observe(universeCore);
    } else {
      animateProductsCounter();
    }
  }

  if (exploreLabButton && productsPanel) {
    exploreLabButton.addEventListener('click', function () {
      var expanded = exploreLabButton.getAttribute('aria-expanded') !== 'true';
      exploreLabButton.setAttribute('aria-expanded', String(expanded));
      productsPanel.setAttribute('aria-hidden', String(!expanded));
      if (expanded) productsPanel.removeAttribute('inert');
      else productsPanel.setAttribute('inert', '');
      productsPanel.classList.toggle('is-open', expanded);

      var label = exploreLabButton.querySelector('span');
      if (label) label.textContent = expanded ? 'Close Innovation Lab' : 'Explore Innovation Lab';
    });
  }

  /* ---------- Brand media source ---------- */
  var BRAND_FILM =
    'https://res.cloudinary.com/dlv2esvfc/video/upload/v1790956219/Technology_brand_film_loop_20261002184452_ytncv8.mp4';
  var BRAND_POSTER = 'assets/images/brand-poster-1920.jpg';

  /* ---------- Progress bar ---------- */
  var progressBar = document.getElementById('progress');
  function onScroll() {
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) {
      progressBar.style.width = (scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Navbar ---------- */
  var navbar = document.getElementById('navbar');
  var burger = document.getElementById('nav-burger');
  var mNav = document.getElementById('m-nav');

  function syncNav() {
    if (!navbar) return;
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', syncNav, { passive: true });
  syncNav();

  if (burger && mNav) {
    var lastFocus = null;
    function closeMenu(restoreFocus) {
      mNav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      mNav.setAttribute('aria-hidden', 'true');
      if (navbar) navbar.classList.remove('menu-open');
      document.body.style.overflow = '';
      if (restoreFocus !== false && lastFocus) lastFocus.focus();
    }
    function openMenu() {
      lastFocus = document.activeElement;
      mNav.classList.add('open');
      burger.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      mNav.setAttribute('aria-hidden', 'false');
      if (navbar) navbar.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
      var first = mNav.querySelector('a');
      if (first) {
        mNav.offsetHeight;
        first.focus();
        if (document.activeElement !== first) setTimeout(function () { first.focus(); }, 60);
      }
    }
    burger.addEventListener('click', function () {
      if (mNav.classList.contains('open')) closeMenu();
      else openMenu();
    });
    mNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { closeMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (!mNav.classList.contains('open')) return;
      if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
      if (e.key !== 'Tab') return;
      var focusables = mNav.querySelectorAll('a, button');
      if (!focusables.length) return;
      var firstEl = focusables[0];
      var lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1060 && mNav.classList.contains('open')) closeMenu(false);
    });
  }

  /* ---------- Premium card motion ---------- */
  var FINE_POINTER = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var MOBILE_MOTION = window.matchMedia && window.matchMedia('(max-width: 820px)').matches;
  var revealObs = null;

  function setupStaggerGroups() {
    document.querySelectorAll('[data-stagger]').forEach(function (group) {
      var step = parseInt(group.getAttribute('data-stagger-step'), 10);
      if (isNaN(step)) step = 90;
      if (MOBILE_MOTION) step = Math.min(step, 80);
      var maxDelay = MOBILE_MOTION ? 360 : 620;
      var children = Array.prototype.slice.call(group.children);
      var items = children.filter(function (el) {
        return el.nodeType === 1 && (el.classList.contains('reveal') || el.classList.contains('reveal-image'));
      });
      if (!items.length) {
        items = children.filter(function (el) { return el.nodeType === 1; });
        items.forEach(function (el) { el.classList.add('reveal'); });
      }
      items.forEach(function (el, i) {
        el.style.setProperty('--reveal-delay', Math.min(i * step, maxDelay) + 'ms');
      });
    });
  }

  function addSpotlight(el) {
    if (el.querySelector(':scope > .fx-spot')) return;
    var spot = document.createElement('span');
    spot.className = 'fx-spot';
    spot.setAttribute('aria-hidden', 'true');
    el.insertBefore(spot, el.firstChild);
    el.setAttribute('data-spotlight', '');
  }

  function enhanceCards() {
    document.querySelectorAll(
      '.service, .uni-product, .lab-item, .next-item, .media-item, .p-card, .p-step, .c-card, .office-card, .legal__item, .project__media'
    ).forEach(addSpotlight);

    document.querySelectorAll('.project__media, .p-visual').forEach(function (el) {
      if (el.querySelector('video')) return;
      if (!el.querySelector(':scope > .fx-sheen')) {
        var sheen = document.createElement('span');
        sheen.className = 'fx-sheen';
        sheen.setAttribute('aria-hidden', 'true');
        el.appendChild(sheen);
      }
      el.setAttribute('data-image-reveal', '');
    });

    document.querySelectorAll('.project__media').forEach(function (el) {
      el.setAttribute('data-tilt', '');
    });
  }

  function setupReveals() {
    if (revealObs) revealObs.disconnect();
    var items = document.querySelectorAll('.reveal, .reveal-image');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    revealObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          revealObs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    items.forEach(function (el) {
      if (el.classList.contains('in')) return;
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.94 && r.bottom > 0) {
        el.classList.add('in');
      } else {
        revealObs.observe(el);
      }
    });
  }

  function setupPointerFx() {
    if (!FINE_POINTER || REDUCED) return;

    var spotRaf = null;
    var spotEvent = null;
    document.addEventListener('pointermove', function (e) {
      spotEvent = e;
      if (spotRaf) return;
      spotRaf = requestAnimationFrame(function () {
        spotRaf = null;
        var ev = spotEvent;
        if (!ev) return;
        var card = ev.target.closest ? ev.target.closest('[data-spotlight]') : null;
        if (!card) return;
        var rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        card.style.setProperty('--spot-x', ((ev.clientX - rect.left) / rect.width * 100).toFixed(2) + '%');
        card.style.setProperty('--spot-y', ((ev.clientY - rect.top) / rect.height * 100).toFixed(2) + '%');
      });
    }, { passive: true });

    var tiltActive = null;
    var tiltRaf = null;
    var tiltEvent = null;
    var MAX_TILT = 3.2;

    function resetTilt(el) {
      if (!el) return;
      el.classList.remove('is-tilting');
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    }

    document.addEventListener('pointermove', function (e) {
      tiltEvent = e;
      if (tiltRaf) return;
      tiltRaf = requestAnimationFrame(function () {
        tiltRaf = null;
        var ev = tiltEvent;
        var card = ev.target.closest ? ev.target.closest('[data-tilt]') : null;
        if (card !== tiltActive) {
          resetTilt(tiltActive);
          tiltActive = card;
          if (card) card.classList.add('is-tilting');
        }
        if (!card) return;
        var rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        var px = (ev.clientX - rect.left) / rect.width - 0.5;
        var py = (ev.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--tilt-y', (px * MAX_TILT * 2).toFixed(2) + 'deg');
        card.style.setProperty('--tilt-x', (-py * MAX_TILT * 2).toFixed(2) + 'deg');
      });
    }, { passive: true });

    function clearTilt() {
      resetTilt(tiltActive);
      tiltActive = null;
    }
    document.addEventListener('pointerleave', clearTilt);
    window.addEventListener('blur', clearTilt);
    window.addEventListener('scroll', function () {
      if (tiltActive) {
        resetTilt(tiltActive);
        tiltActive = null;
      }
    }, { passive: true });
  }

  function initCardMotion() {
    setupStaggerGroups();
    enhanceCards();
    setupReveals();
    setupPointerFx();
    if (revealFailSafe) {
      clearTimeout(revealFailSafe);
      revealFailSafe = null;
    }
  }

  /* ---------- Hero video ---------- */
  var heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    var started = false;
    function startHero() {
      if (started) return;
      started = true;
      heroVideo.style.opacity = '1';
      var p = heroVideo.play();
      if (p && p.catch) p.catch(function () {});
    }
    heroVideo.addEventListener('loadeddata', startHero);
    heroVideo.addEventListener('canplay', startHero);
    // For slow 3G: fade in poster layer too late is fine; keep poster behind always.
    setTimeout(function () {
      if (!started) heroVideo.style.opacity = '1'; // metadata may only be available
    }, 3200);
  }

  /* ---------- Sound toggle ---------- */
  var soundBtn = document.getElementById('sound-toggle');
  if (soundBtn && heroVideo) {
    soundBtn.addEventListener('click', function () {
      var wasMuted = heroVideo.muted;
      heroVideo.muted = !wasMuted;
      var audible = !heroVideo.muted; // true right after we unmute
      if (audible) {
        var p = heroVideo.play();
        if (p && p.catch) p.catch(function () {});
      } else {
        heroVideo.pause();
      }
      soundBtn.classList.toggle('on', audible);
      var lbl = soundBtn.querySelector('.st-label');
      if (lbl) lbl.textContent = audible ? 'Sound On' : 'Sound Off';
    });
  }

  /* ---------- Video modal ---------- */
  var videoModal = document.getElementById('video-modal');
  var modalVideo = document.getElementById('modal-video');
  var videoClose = document.getElementById('video-close');

  function openVideo(src) {
    if (!videoModal || !modalVideo) return;
    modalVideo.src = src;
    videoModal.classList.remove('hidden');
    requestAnimationFrame(function () { videoModal.classList.add('open'); });
    var p = modalVideo.play();
    if (p && p.catch) p.catch(function () {});
    document.body.style.overflow = 'hidden';
  }
  function closeVideo(force) {
    if (!videoModal) return;
    if (!force) videoModal.classList.remove('open');
    if (modalVideo) { modalVideo.pause(); modalVideo.removeAttribute('src'); modalVideo.load(); }
    videoModal.classList.add('hidden');
    document.body.style.overflow = '';
  }
  if (videoClose) videoClose.addEventListener('click', function () { closeVideo(); });
  if (videoModal) {
    videoModal.addEventListener('click', function (e) {
      if (e.target === videoModal || e.target.classList.contains('modal-back')) closeVideo();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeVideo();
    });
  }

  function resolveVideo(v) {
    return v === 'brand' ? BRAND_FILM : v;
  }

  function bindVideoTriggers() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-video]') : null;
      if (!t) return;
      var v = t.getAttribute('data-video');
      if (v) openVideo(resolveVideo(v));
    });
  }
  bindVideoTriggers();

  /* ---------- Media section ---------- */
  var PROJECTS = window.FASTLINE_PROJECTS || [];
  var MEDIA_ITEMS = [
    { title: 'FastLine Technologies — Brand Film', tag: 'Brand', cat: ['brand', 'vision'], thumb: BRAND_POSTER, videoUrl: BRAND_FILM },
    { title: 'FeMOS — Staff Attendance & Identification', tag: 'Product', cat: ['product'], thumb: PROJECTS[0] ? PROJECTS[0].thumbnail : null, videoUrl: null },
    { title: 'Neo SmartCore — Operations Intelligence', tag: 'Product', cat: ['product'], thumb: PROJECTS[1] ? PROJECTS[1].thumbnail : null, videoUrl: PROJECTS[1] ? PROJECTS[1].videoUrl : null },
    { title: 'FIT — Identifying Technology', tag: 'Product', cat: ['product', 'demo'], thumb: null, videoUrl: null },
    { title: 'JSL FastLine — Low-Connectivity Ecosystem', tag: 'Vision', cat: ['vision'], thumb: PROJECTS[3] ? PROJECTS[3].thumbnail : null, videoUrl: null }
  ];
  var FILTERS = ['ALL', 'BRAND', 'PRODUCT', 'DEMO', 'VISION', 'EXPERIMENT'];
  var filtersWrap = document.getElementById('media-filters');
  var grid = document.getElementById('media-grid');

  function renderMedia(list) {
    if (!grid) return;
    grid.innerHTML = list
      .map(function (item) {
        var thumb = item.thumb
          ? '<img src="' + item.thumb + '" alt="" loading="lazy" />'
          : '';
        var playClass = item.videoUrl ? '' : ' is-soon';
        return (
          '<div class="media-item' + playClass + '" data-cats="' + item.cat.join(' ') + '"' +
          (item.videoUrl ? ' data-video="' + item.videoUrl + '"' : '') + '>' +
          '<div style="position:absolute;inset:0;overflow:hidden;border-radius:20px;">' + thumb + '</div>' +
          '<div class="media-item__shade"></div>' +
          '<span class="media-item__tag">' + item.tag + '</span>' +
          '<div class="media-item__body">' +
          '<div><h4>' + item.title + '</h4><p>' + (item.videoUrl ? 'Play in-page' : 'Film coming soon') + '</p></div>' +
          (item.videoUrl
            ? '<span class="play-orb"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72c0 .8.87 1.3 1.56.9l10.4-6.86a1.05 1.05 0 0 0 0-1.8L9.56 4.24A1.04 1.04 0 0 0 8 5.14Z"/></svg></span>'
            : '<span class="soonsoon">Soon</span>') +
          '</div></div>'
        );
      })
      .join('');
  }

  function renderFilters() {
    if (!filtersWrap) return;
    filtersWrap.innerHTML = FILTERS.map(function (f) {
      return '<button class="filter' + (f === 'ALL' ? ' active' : '') + '" data-filter="' + f + '">' + f + '</button>';
    }).join('');
    filtersWrap.querySelectorAll('.filter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        filtersWrap.querySelectorAll('.filter').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var f = btn.getAttribute('data-filter');
        grid.querySelectorAll('.media-item').forEach(function (el) {
          var cats = (el.getAttribute('data-cats') || '').split(' ');
          var show = f === 'ALL' || cats.indexOf(f.toLowerCase()) !== -1;
          el.style.display = show ? '' : 'none';
        });
      });
    });
  }

  if (grid) renderMedia(MEDIA_ITEMS);
  renderFilters();

  /* ---------- Project media parallax ---------- */
  if (!REDUCED) {
    var parallaxItems = [];
    document.querySelectorAll('[data-parallax]').forEach(function (box) {
      var img = box.querySelector('img');
      if (!img) return;
      parallaxItems.push({ box: box, img: img, speed: parseFloat(box.getAttribute('data-parallax')) || 0.06 });
    });
    var pxPending = false;
    function parallaxTick() {
      pxPending = false;
      parallaxItems.forEach(function (it) {
        var r = it.box.getBoundingClientRect();
        var vh = window.innerHeight;
        if (r.bottom < -80 || r.top > vh + 80) return;
        var progress = (r.top + r.height / 2 - vh / 2) / vh; // -0.5..0.5
        var shift = progress * 70 * it.speed * 10;
        it.img.style.setProperty('--parallax-y', shift.toFixed(1) + 'px');
      });
    }
    window.addEventListener('scroll', function () {
      if (!pxPending) { pxPending = true; requestAnimationFrame(parallaxTick); }
    }, { passive: true });
    parallaxTick();
  }

  /* ---------- Rhythm (Sonic Identity) ---------- */
  var rhythmPlay = document.getElementById('rhythm-play');
  var rhythmAudio = document.getElementById('rhythm-audio');
  var waveform = document.getElementById('waveform');
  var rhythmFill = document.getElementById('rhythm-fill');
  var rhythmNote = document.getElementById('rhythm-note');
  var rhythmStatus = document.getElementById('rhythm-status');
  var rhythmCur = document.getElementById('rhythm-cur');
  var rhythmTotal = document.getElementById('rhythm-total');

  if (waveform) {
    var bars = 44;
    var frag = document.createDocumentFragment();
    for (var b = 0; b < bars; b++) {
      var bar = document.createElement('i');
      bar.style.height = (12 + Math.abs(Math.sin(b * 0.8)) * 88).toFixed(0) + 'px';
      bar.style.animationDelay = (b * 0.045) + 's';
      frag.appendChild(bar);
    }
    waveform.appendChild(frag);
  }

  var playingRhythm = false;

  function rhythmFmt(s) {
    if (isNaN(s) || s < 0) s = 0;
    var m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  if (rhythmPlay && rhythmAudio) {
    rhythmAudio.addEventListener('loadedmetadata', function () {
      if (rhythmTotal) rhythmTotal.textContent = rhythmFmt(rhythmAudio.duration);
      if (rhythmNote) rhythmNote.textContent = 'Fast Connections — FastLine Sonic Identity';
    });
    rhythmAudio.addEventListener('timeupdate', function () {
      var d = rhythmAudio.duration || 0, t = rhythmAudio.currentTime || 0;
      if (rhythmFill) rhythmFill.style.width = (d ? (t / d) * 100 : 0).toFixed(1) + '%';
      if (rhythmCur) rhythmCur.textContent = rhythmFmt(t);
    });
    rhythmAudio.addEventListener('ended', function () {
      playingRhythm = false;
      rhythmPlay.classList.remove('playing');
      waveform.classList.remove('is-playing');
      if (rhythmStatus) { rhythmStatus.textContent = 'Ended'; rhythmStatus.classList.remove('live'); }
    });

    rhythmPlay.addEventListener('click', function () {
      if (playingRhythm) {
        rhythmAudio.pause();
        playingRhythm = false;
        rhythmPlay.classList.remove('playing');
        waveform.classList.remove('is-playing');
        if (rhythmStatus) { rhythmStatus.textContent = 'Prep'; rhythmStatus.classList.remove('live'); }
      } else {
        playingRhythm = true;
        rhythmPlay.classList.add('playing');
        waveform.classList.add('is-playing');
        if (rhythmStatus) { rhythmStatus.textContent = 'Playing'; rhythmStatus.classList.add('live'); }
        var pr = rhythmAudio.play();
        if (pr && pr.catch) pr.catch(function () {});
      }
    });
  }

  /* ---------- Initialise card motion after dynamic content ---------- */
  initCardMotion();

})();
