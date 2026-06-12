(function () {
  window.portfolioCinematicPending = true;

  var REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var PHASE_LABELS = [
    { until: 0.22, text: "\u041e\u0431\u0437\u043e\u0440" },
    { until: 0.48, text: "\u041f\u0430\u0439\u043f\u043b\u0430\u0439\u043d" },
    { until: 0.72, text: "\u0420\u0430\u0437\u0431\u043e\u0440\u043a\u0430" },
    { until: 1, text: "\u0414\u0435\u043f\u043b\u043e\u0439" },
  ];

  var loader;
  var loaderFill;
  var heroCinema;
  var hero;
  var heroPin;
  var terminalScene;
  var scrollHint;
  var cinemaHud;
  var cinemaHudPhase;
  var cinemaHudFill;
  var vignette;
  var glow;
  var layers = [];
  var ticking = false;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function getScrollTop() {
    if (window.portfolioLenis && typeof window.portfolioLenis.scroll === "number") {
      return window.portfolioLenis.scroll;
    }
    return window.scrollY || document.documentElement.scrollTop || 0;
  }

  function getHeroProgress() {
    if (!heroCinema) {
      return 0;
    }

    var rect = heroCinema.getBoundingClientRect();
    var scrollable = heroCinema.offsetHeight - window.innerHeight;
    if (scrollable <= 0) {
      return 0;
    }

    return clamp(-rect.top / scrollable, 0, 1);
  }

  function explodeCurve(film) {
    if (film < 0.12) {
      return Math.pow(film / 0.12, 1.8);
    }
    if (film < 0.58) {
      return 1;
    }
    if (film < 0.82) {
      return 1 - Math.pow((film - 0.58) / 0.24, 1.8);
    }
    return 0;
  }

  function applyCinemaProgress(progress) {
    var label = PHASE_LABELS[0].text;

    for (var i = 0; i < PHASE_LABELS.length; i += 1) {
      if (film <= PHASE_LABELS[i].until) {
        label = PHASE_LABELS[i].text;
        break;
      }
    }

    if (cinemaHudPhase) {
      cinemaHudPhase.textContent = label;
    }
  }

  function applyCinemaProgress(progress) {
    var e = explodeCurve(progress);
    document.body.classList.toggle("cinema-explode", e > 0.25);
    document.body.classList.toggle("cinema-active", progress > 0.02 && progress < 0.98);

    if (scrollHint) {
      scrollHint.classList.toggle("is-hidden", progress > 0.05);
    }

    if (cinemaHud) {
      var hudVisible = progress > 0.02 && progress < 0.98;
      cinemaHud.classList.toggle("is-visible", hudVisible);
      cinemaHud.setAttribute("aria-hidden", hudVisible ? "false" : "true");
    }

    if (cinemaHudFill) {
      cinemaHudFill.style.width = progress * 100 + "%";
    }

    layers.forEach(function (layer) {
      var tx = layer.x * e;
      var ty = layer.y * e;
      var rot = layer.r * e;
      var scale = 1 - layer.s * e;
      var opacity = layer.o0 + (layer.o1 - layer.o0) * e;
      layer.el.style.transform =
        "translate3d(" + tx + "px, " + ty + "px, 0) rotate(" + rot + "deg) scale(" + scale + ")";
      layer.el.style.opacity = String(opacity);
    });

    if (hero) {
      var copy = hero.querySelector(".hero-copy");
      if (copy) {
        copy.style.opacity = String(Math.max(0, 1 - progress * 2.2));
        copy.style.transform = "translate3d(0, " + progress * 72 + "px, 0) scale(" + (1 - progress * 0.06) + ")";
        copy.style.filter = "blur(" + progress * 4 + "px)";
      }
    }

    if (terminalScene) {
      terminalScene.style.filter = "blur(" + Math.max(0, (e - 0.65) * 8) + "px)";
    }

    if (vignette) {
      vignette.style.opacity = "";
    }

    if (glow) {
      glow.style.opacity = "";
    }

    updatePhaseLabels(progress);
  }

  function requestCinemaTick() {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      applyCinemaProgress(getHeroProgress());
    });
  }

  function hideLoader() {
    if (!loader) {
      return;
    }

    loader.classList.add("is-hidden");
    document.body.classList.remove("cinema-booting");
    window.setTimeout(function () {
      loader.setAttribute("aria-hidden", "true");
    }, 700);
  }

  function forceVisibleFallback() {
    hideLoader();
    if (hero) {
      hero.classList.add("is-entered", "is-ready");
    }
    if (terminalScene) {
      terminalScene.style.clipPath = "circle(92% at 50% 50%)";
      terminalScene.style.opacity = "1";
    }
    window.portfolioCinematicPending = false;
    window.portfolioCinematicActive = true;
    window.dispatchEvent(new CustomEvent("portfolio:cinematic-ready"));
  }

  function animateCounter(node, target, suffix) {
    var start = null;
    var duration = 1200;

    function step(ts) {
      if (!start) {
        start = ts;
      }
      var p = clamp((ts - start) / duration, 0, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      node.textContent = Math.round(target * eased) + suffix;
      if (p < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }

  function runLoader(done) {
    loader = document.getElementById("page-loader");
    loaderFill = document.getElementById("page-loader-fill");
    document.body.classList.add("cinema-booting");

    var safety = window.setTimeout(forceVisibleFallback, 5000);
    var started = Date.now();
    var minDuration = REDUCED_MOTION ? 0 : 1600;

    function finish() {
      window.clearTimeout(safety);
      var wait = Math.max(0, minDuration - (Date.now() - started));
      window.setTimeout(function () {
        hideLoader();
        done();
      }, wait);
    }

    if (!loader || REDUCED_MOTION) {
      if (loaderFill) {
        loaderFill.style.width = "100%";
      }
      finish();
      return;
    }

    var progress = 0;
    var timer = window.setInterval(function () {
      progress += 6 + Math.random() * 8;
      if (progress >= 100) {
        progress = 100;
        window.clearInterval(timer);
        if (loaderFill) {
          loaderFill.style.width = "100%";
        }
        finish();
        return;
      }
      if (loaderFill) {
        loaderFill.style.width = progress + "%";
      }
    }, 80);
  }

  function finishHeroEntrance() {
    if (!hero) {
      return;
    }

    hero.classList.add("is-entered");
    window.setTimeout(function () {
      hero.classList.add("is-ready");
    }, 1200);

    if (terminalScene) {
      terminalScene.style.clipPath = "circle(92% at 50% 50%)";
    }

    var metrics = hero.querySelectorAll(".hero-metrics strong");
    Array.prototype.forEach.call(metrics, function (node) {
      var raw = (node.textContent || "").trim();
      var match = raw.match(/^(\d+)/);
      if (!match || REDUCED_MOTION) {
        return;
      }
      animateCounter(node, parseInt(match[1], 10), raw.slice(match[1].length));
    });

    var bar = document.querySelector(".scroll-progress span");
    if (bar && !REDUCED_MOTION) {
      bar.classList.add("is-pulse");
      window.setTimeout(function () {
        bar.classList.remove("is-pulse");
      }, 1400);
    }
  }

  function collectLayers() {
    layers = [];
    var character = document.querySelector(".hero-character");
    var terminal = document.querySelector(".terminal-window");
    var badges = document.querySelectorAll(".hero-cinema .floating-badge");

    if (character) {
      character.classList.add("cinema-layer");
      layers.push({ el: character, x: -130, y: -150, r: -14, s: 0.22, o0: 1, o1: 0.35 });
    }
    if (terminal) {
      terminal.classList.add("cinema-layer");
      layers.push({ el: terminal, x: 120, y: 90, r: 10, s: 0.14, o0: 1, o1: 0.7 });
    }

    var badgeOffsets = [
      { x: -140, y: -150, r: -18 },
      { x: 130, y: -120, r: 16 },
      { x: -110, y: 130, r: 12 },
    ];

    Array.prototype.forEach.call(badges, function (badge, index) {
      var offset = badgeOffsets[index] || { x: 0, y: -80, r: 0 };
      badge.classList.add("cinema-layer");
      layers.push({
        el: badge,
        x: offset.x,
        y: offset.y,
        r: offset.r,
        s: 0.22,
        o0: 1,
        o1: 0.2,
      });
    });
  }

  function bindScrollCinema() {
    window.addEventListener("scroll", requestCinemaTick, { passive: true });
    window.addEventListener("portfolio:scroll", requestCinemaTick);
    window.addEventListener("resize", requestCinemaTick);
    requestCinemaTick();
  }

  function boot() {
    try {
      heroCinema = document.getElementById("hero-cinema");
      heroPin = document.querySelector(".hero-pin");
      hero = document.querySelector(".hero");
      terminalScene = document.querySelector(".hero-cinema .terminal-scene");
      scrollHint = document.getElementById("scroll-hint");
      cinemaHud = document.getElementById("cinema-hud");
      cinemaHudPhase = document.getElementById("cinema-hud-phase");
      cinemaHudFill = document.getElementById("cinema-hud-fill");
      vignette = document.getElementById("hero-vignette");
      glow = document.getElementById("hero-glow");

      collectLayers();
      bindScrollCinema();

      runLoader(function () {
        finishHeroEntrance();
        window.portfolioCinematicPending = false;
        window.portfolioCinematicActive = true;
        window.dispatchEvent(new CustomEvent("portfolio:cinematic-ready"));
        requestCinemaTick();
        if (window.portfolioRefreshMotion) {
          window.portfolioRefreshMotion();
        }
      });
    } catch (error) {
      forceVisibleFallback();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
