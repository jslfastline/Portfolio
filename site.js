/* FastLine Technologies — site interactions (2026) */
(function () {
  'use strict';

  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MOBILE_WIDTH = 640;

  /* ---------- Brand media source ---------- */
  var BRAND_FILM =
    'https://res.cloudinary.com/dlv2esvfc/video/upload/v1790956219/Technology_brand_film_loop_20261002184452_ytncv8.mp4';
  var BRAND_POSTER = 'assets/images/brand-poster-1920.jpg';

  /* ---------- Lucide ---------- */
  if (window.lucide) lucide.createIcons();

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

  /* ---------- Cursor glow ---------- */
  var glow = document.getElementById('cursor-glow');
  if (glow && !REDUCED && window.matchMedia('(pointer:fine)').matches) {
    var raf = null;
    window.addEventListener('mousemove', function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        glow.style.transform = 'translate(' + (e.clientX - 260) + 'px,' + (e.clientY - 260) + 'px)';
        raf = null;
      });
    });
    var over = false;
    document.addEventListener('mouseover', function (e) {
      var tag = e.target.tagName;
      var interact = tag === 'A' || tag === 'BUTTON' || (e.target.closest && e.target.closest('.media-item,.project__media'));
      glow.style.opacity = interact ? 0.35 : 0;
    });
  } else if (glow) {
    glow.style.display = 'none';
  }

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
    burger.addEventListener('click', function () {
      var open = mNav.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      mNav.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (navbar) navbar.classList.toggle('menu-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mNav.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        mNav.setAttribute('aria-hidden', 'true');
        if (navbar) navbar.classList.remove('menu-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObs.observe(el);
  });

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

  /* ---------- Universe network ---------- */
  var map = document.getElementById('universe-map');
  var nodesWrap = document.getElementById('universe-nodes');
  var linesSvg = document.getElementById('universe-lines');
  var pop = document.getElementById('node-pop');

  var UNIVERSE_NODES = {
    'FEMOS': { x: 50, y: 7, product: 'femos', desc: 'Smart attendance & identification for entire campuses.', statusClass: 'in-dev', st: 'In Development' },
    'NEOSMARTCORE': { x: 89, y: 18, product: 'neo-smartcore', desc: 'Business operations intelligence.', statusClass: 'prototype', st: 'Prototype' },
    'FIT': { x: 8, y: 32, product: 'fit', desc: 'Digital identity, device interaction & QR workflows.', statusClass: 'concept', st: 'Concept' },
    'JSLLINE': { x: 50, y: 93, product: 'jsl-fastline', desc: 'Low-connectivity social & growth platform.', statusClass: 'concept', st: 'Concept' },
    'INNOVATION': { x: 92, y: 44, product: null, desc: 'Research & experiments becoming possibilities.', statusClass: 'idea', st: 'Lab' },
    'AI': { x: 83, y: 72, product: null, desc: 'Intelligence with a real job to do.', statusClass: 'idea', st: 'Research' },
    'CONNECTIVITY': { x: 12, y: 58, product: null, desc: 'Networks that work with or without the internet.', statusClass: 'idea', st: 'Lab' },
    'AUTOMATION': { x: 27, y: 97, product: null, desc: 'Routine handled by systems, judgement kept by people.', statusClass: 'idea', st: 'Research' },
    'DIGITALID': { x: 15, y: 82, product: null, desc: 'Portable identity reused across the ecosystem.', statusClass: 'idea', st: 'Lab' }
  };
  var CENTER = { x: 50, y: 50 };

  if (map && nodesWrap && pop) {
    var isCompact = function () { return window.innerWidth <= MOBILE_WIDTH; };
    var NODE_LABELS = {
      'NEOSMARTCORE': 'Neo SmartCore', 'DIGITALID': 'Digital Identity', 'JSLLINE': 'JSL FastLine'
    };
    var PROJ_BY_SLUG = {};
    PROJECTS.forEach(function (p) { PROJ_BY_SLUG[p.slug] = p; });
    var nodeEls = [];

    Object.keys(UNIVERSE_NODES).forEach(function (key) {
      var n = UNIVERSE_NODES[key];
      var label = n.product ? PROJ_BY_SLUG[n.product].title : (NODE_LABELS[key] || key);
      var cls = 'node' + (n.product ? ' is-product' : '') + ' node--pulse';
      var el = document.createElement('div');
      el.className = cls;
      el.setAttribute('data-key', key);
      if (!isCompact()) {
        el.style.left = n.x + '%';
        el.style.top = n.y + '%';
      } else {
        el.style.cssText = '';
      }
      el.innerHTML = '<span class="node__core">' + label + '</span><span class="node__label">' + key + '</span><span class="node__halo" aria-hidden="true"></span>';
      if (n.product) {
        el.setAttribute('role', 'link');
        el.setAttribute('tabindex', '0');
        el.addEventListener('click', function (e) {
          if (isCompact()) { window.location.href = 'projects/' + n.product + '.html'; return; }
          e.stopPropagation();
          showPop(n, el);
        });
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (isCompact()) window.location.href = 'projects/' + n.product + '.html';
            else showPop(n, el);
          }
        });
        el.addEventListener('mouseenter', function () { if (!isCompact()) showPop(n, el); });
      } else {
        el.addEventListener('click', function (e) {
          e.stopPropagation();
          if (!isCompact()) showPop(n, el);
        });
        el.addEventListener('mouseenter', function () { if (!isCompact()) showPop(n, el); });
      }
      nodesWrap.appendChild(el);
      nodeEls.push({ el: el, key: key, n: n });
    });

    // Connecting lines
    function drawLines() {
      if (!linesSvg || isCompact()) return;
      var W = map.clientWidth;
      var H = map.clientHeight;
      var cx = (CENTER.x / 100) * W;
      var cy = (CENTER.y / 100) * H;
      var paths = nodeEls.map(function (node) {
        var nx = (node.n.x / 100) * W;
        var ny = (node.n.y / 100) * H;
        var mx = cx + (nx - cx) * 0.5;
        var my = cy + (ny - cy) * 0.5;
        return '<path d="M' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' C' + mx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + mx.toFixed(1) + ' ' + ny.toFixed(1) + ' ' + nx.toFixed(1) + ' ' + ny.toFixed(1) + '"/>';
      }).join('');
      linesSvg.innerHTML = paths;
    }

    function showPop(n, el) {
      if (!pop) return;
      var statusKey = n.statusClass;
      var title = n.product ? PROJ_BY_SLUG[n.product].title : (NODE_LABELS[el.getAttribute('data-key')] || el.getAttribute('data-key'));
      var explore = n.product
        ? '<a class="explore" href="projects/' + n.product + '.html">Explore <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>'
        : '';
      var stHtml = n.st ? '<span class="st ' + (statusKey === 'in-dev' ? 'in-dev' : statusKey === 'concept' ? 'concept' : 'idea') + '">' + n.st + '</span>' : '';
      pop.innerHTML = '<div class="h6">' + title + stHtml + '</div><p>' + n.desc + '</p>' + explore;
      pop.classList.add('visible');

      // Position near the node (clamp inside map)
      var W = map.clientWidth;
      var H = map.clientHeight;
      var pw = 300;
      var px = (n.x / 100) * W;
      var py = (n.y / 100) * H;
      var left = px;
      var top = py - 90;
      if (n.x > 55) left = px - pw - 20; // left side of node
      else left = px + 60;               // right side of node
      if (left < 14) left = 14;
      if (left + pw > W - 14) left = W - pw - 14;
      if (top < 14) top = 14;
      if (top + 180 > H - 14) top = H - 194;
      pop.style.left = left + 'px';
      pop.style.top = top + 'px';
      pop.style.right = 'auto';
      pop.style.transform = 'none';
    }
    map.addEventListener('mouseleave', function () {
      if (pop) pop.classList.remove('visible');
    });

    var drawLinesTimed = null;
    window.addEventListener('resize', function () {
      clearTimeout(drawLinesTimed);
      drawLinesTimed = setTimeout(drawLines, 200);
    });
    drawLines();
  }

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
        it.img.style.transform = 'scale(1.12) translateY(' + shift.toFixed(1) + 'px)';
      });
    }
    window.addEventListener('scroll', function () {
      if (!pxPending) { pxPending = true; requestAnimationFrame(parallaxTick); }
    }, { passive: true });
    parallaxTick();
  }

  /* ---------- Vision particles ---------- */
  var canvas = document.getElementById('vision-canvas');
  if (canvas) {
    var ctx = canvas.getContext && canvas.getContext('2d');
    if (ctx && !REDUCED) {
      var DPR = Math.min(window.devicePixelRatio || 1, 2);
      var particles = [];
      var running = false;

      function sizeCanvas() {
        var w = canvas.parentElement.clientWidth;
        var h = canvas.parentElement.clientHeight;
        canvas.width = w * DPR;
        canvas.height = h * DPR;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        var density = w < 640 ? 26 : 60;
        particles = [];
        for (var i = 0; i < density; i++) {
          particles.push({
            x: Math.random() * w, y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.25, vy: -Math.random() * 0.3 - 0.05,
            r: Math.random() * 1.6 + 0.5
          });
        }
      }
      function frame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(DPR, DPR);
        var w = canvas.width / DPR;
        var h = canvas.height / DPR;
        var lineDist = 110;
        for (var i = 0; i < particles.length; i++) {
          var p = particles[i];
          p.x += p.vx; p.y += p.vy;
          if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56,189,248,0.5)';
          ctx.fill();
          for (var j = i + 1; j < particles.length; j++) {
            var q = particles[j];
            var dx = p.x - q.x, dy = p.y - q.y;
            var d2 = dx * dx + dy * dy;
            if (d2 < lineDist * lineDist) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = 'rgba(56,189,248,' + (0.18 * (1 - Math.sqrt(d2) / lineDist)).toFixed(3) + ')';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
        ctx.restore();
        if (running) requestAnimationFrame(frame);
      }
      var visionObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !running) { running = true; sizeCanvas(); requestAnimationFrame(frame); }
          else if (!e.isIntersecting && running) { running = false; }
        });
      }, { threshold: 0.05 });
      visionObs.observe(canvas);
      window.addEventListener('resize', function () { if (running) sizeCanvas(); });
      sizeCanvas();
    } else if (ctx) {
      canvas.style.display = 'none';
    }
  }

  /* ---------- Rhythm (Sonic Identity) ---------- */
  var rhythmPlay = document.getElementById('rhythm-play');
  var waveform = document.getElementById('waveform');
  var rhythmFill = document.getElementById('rhythm-fill');
  var rhythmNote = document.getElementById('rhythm-note');
  var rhythmStatus = document.getElementById('rhythm-status');
  var rhythmCur = document.getElementById('rhythm-cur');

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
  var rhythmTicker = null;
  var rhythmT = 0;

  function shieldId() {
    // A crafted touch: the sonic identity track is published through the
    // brand reel. Keep this minimal until the standalone track is released.
    if (rhythmNote) rhythmNote.textContent = 'Sonic identity — preview animating · final track to be released.';
    if (rhythmStatus) {
      rhythmStatus.textContent = 'Previewing';
      rhythmStatus.classList.add('live');
    }
  }

  if (rhythmPlay) {
    rhythmPlay.addEventListener('click', function () {
      playingRhythm = !playingRhythm;
      rhythmPlay.classList.toggle('playing', playingRhythm);
      waveform.classList.toggle('is-playing', playingRhythm);
      if (playingRhythm) {
        shieldId();
        rhythmT = 0;
        var start = null;
        function tStep(now) {
          if (start === null) start = now;
          var p = Math.min((now - start) / 3600, 0.62); // cap ~62% (in progress)
          rhythmT = p;
          if (rhythmFill) rhythmFill.style.width = (p * 100).toFixed(1) + '%';
          if (rhythmCur) rhythmCur.textContent = '0:' + String(Math.floor(p * 90)).padStart(2, '0');
          if (playingRhythm) rhythmTicker = requestAnimationFrame(tStep);
        }
        rhythmTicker = requestAnimationFrame(tStep);
      } else {
        if (rhythmTicker) cancelAnimationFrame(rhythmTicker);
        if (rhythmStatus) {
          rhythmStatus.textContent = 'Prep';
          rhythmStatus.classList.remove('live');
        }
      }
    });
  }

  /* ---------- Signal overlay ---------- */
  var signalOverlay = document.getElementById('signal-overlay');
  if (signalOverlay) {
    function openSignal() {
      signalOverlay.classList.remove('hidden', 'closing');
      var msg = document.createElement('button');
      msg.className = 'signal-msg';
      msg.textContent = 'FastLine — tap to close';
      msg.addEventListener('click', closeSignal);
      if (!signalOverlay.querySelector('.signal-msg')) signalOverlay.querySelector('.signal-stage').appendChild(msg);
      clearTimeout(signalOverlay._t);
      signalOverlay._t = setTimeout(closeSignal, 6000);
    }
    function closeSignal() {
      if (!signalOverlay.classList.contains('hidden')) {
        signalOverlay.classList.add('closing');
        setTimeout(function () { signalOverlay.classList.add('hidden'); }, 900);
      }
    }
    document.querySelectorAll('.js-signal').forEach(function (btn) {
      btn.addEventListener('click', openSignal);
    });
    signalOverlay.addEventListener('click', function (e) {
      if (e.target === signalOverlay) closeSignal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !signalOverlay.classList.contains('hidden')) closeSignal();
    });
  }
})();