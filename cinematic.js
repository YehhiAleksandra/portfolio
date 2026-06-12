(function () {
  window.portfolioCinematicPending = true;

  var REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var CAN_PIN = window.matchMedia("(min-width: 901px)").matches;
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
  var terminalScene;
  var scrollHint;
  var filmPhase;
  var filmPhaseLabel;
  var vignette;
  var glow;
  var callouts = [];
  var layers = [];
  var cinemaTrigger = null;

  function explodeCurve(film) {
    if (film < 0.16) {
      return Math.pow(film / 0.16, 2.4);
    }
    if (film < 0.54) {
      return 1;
    }
    if (film < 0.74) {
      return 1 - Math.pow((film - 0.54) / 0.2, 2.2);
    }
    return 0;
  }

  function updateCallouts(film) {
    var fade = 0.05;

    callouts.forEach(function (el) {
      var from = parseFloat(el.getAttribute("data-show-from") || "0");
      var to = parseFloat(el.getAttribute("data-show-to") || "1");
      var opacity = 0;

      if (film >= from - fade && film < from) {
        opacity = (film - (from - fade)) / fade;
      } else if (film >= from && film <= to) {
        opacity = 1;
      } else if (film > to && film <= to + fade) {
        opacity = 1 - (film - to) / fade;
      }

      opacity = Math.max(0, Math.min(1, opacity));
      el.style.opacity = String(opacity);
      el.classList.toggle("is-on", opacity > 0.45);
    });
  }

  function updateFilmPhase(film) {
    if (!filmPhase || !filmPhaseLabel) {
      return;
    }

    var show = film > 0.05 && film < 0.92;
    filmPhase.classList.toggle("is-visible", show);
    if (!show) {
      return;
    }

    for (var i = 0; i < PHASE_LABELS.length; i += 1) {
      if (film <= PHASE_LABELS[i].until) {
        if (filmPhaseLabel.textContent !== PHASE_LABELS[i].text) {
          filmPhaseLabel.textContent = PHASE_LABELS[i].text;
        }
        break;
      }
    }
  }

  function applyCinemaProgress(progress) {
    var e = explodeCurve(progress);
    document.body.classList.toggle("cinema-explode", e > 0.3);

    if (scrollHint) {
      scrollHint.classList.toggle("is-hidden", progress > 0.06);
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
        copy.style.opacity = String(Math.max(0, 1 - progress * 1.8));
        copy.style.transform = "translate3d(0, " + progress * 48 + "px, 0)";
      }
    }

    if (vignette) {
      vignette.style.opacity = String(0.08 + e * 0.35);
    }

    if (glow) {
      glow.style.opacity = String(e * 0.95);
    }

    updateCallouts(progress);
    updateFilmPhase(progress);
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
      terminalScene.style.clipPath = "none";
      terminalScene.style.opacity = "1";
      terminalScene.style.transform = "none";
    }
    window.portfolioCinematicPending = false;
    window.dispatchEvent(new CustomEvent("portfolio:cinematic-ready"));
  }

  function runLoader(done) {
    loader = document.getElementById("page-loader");
    loaderFill = document.getElementById("page-loader-fill");
    document.body.classList.add("cinema-booting");

    var safety = window.setTimeout(function () {
      safety = null;
      forceVisibleFallback();
    }, 4500);

    function finish() {
      if (safety) {
        window.clearTimeout(safety);
        safety = null;
      }
      hideLoader();
      done();
    }

    if (!loader || REDUCED_MOTION) {
      finish();
      return;
    }

    var progress = 0;
    var timer = window.setInterval(function () {
      progress += 8 + Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        window.clearInterval(timer);
        if (loaderFill) {
          loaderFill.style.width = "100%";
        }
        window.setTimeout(finish, 280);
        return;
      }
      if (loaderFill) {
        loaderFill.style.width = progress + "%";
      }
    }, 70);
  }

  function finishHeroEntrance() {
    if (!hero) {
      return;
    }

    hero.classList.add("is-entered");
    window.setTimeout(function () {
      hero.classList.add("is-ready");
    }, 1100);

    if (terminalScene && window.gsap && !REDUCED_MOTION) {
      window.gsap.fromTo(
        terminalScene,
        { clipPath: "circle(0% at 50% 50%)", opacity: 0.2 },
        {
          clipPath: "circle(92% at 50% 50%)",
          opacity: 1,
          duration: 1.15,
          ease: "power3.out",
          delay: 0.12,
          clearProps: "opacity",
        }
      );
    } else if (terminalScene) {
      terminalScene.style.clipPath = "circle(92% at 50% 50%)";
      terminalScene.style.opacity = "1";
    }

    var metrics = hero.querySelectorAll(".hero-metrics strong");
    if (window.gsap && metrics.length && !REDUCED_MOTION) {
      metrics.forEach(function (node) {
        var raw = (node.textContent || "").trim();
        var match = raw.match(/^(\d+)/);
        if (!match) {
          return;
        }
        var target = parseInt(match[1], 10);
        var suffix = raw.slice(match[1].length);
        var counter = { value: 0 };
        window.gsap.to(counter, {
          value: target,
          duration: 1.4,
          ease: "power2.out",
          delay: 0.35,
          onUpdate: function () {
            node.textContent = Math.round(counter.value) + suffix;
          },
        });
      });
    }

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
      layers.push({ el: character, x: -42, y: -68, r: -7, s: 0.12, o0: 1, o1: 0.55 });
    }
    if (terminal) {
      terminal.classList.add("cinema-layer");
      layers.push({ el: terminal, x: 56, y: 38, r: 5, s: 0.08, o0: 1, o1: 0.85 });
    }

    var badgeOffsets = [
      { x: -88, y: -96, r: -12 },
      { x: 72, y: -72, r: 10 },
      { x: -64, y: 84, r: 8 },
    ];

    Array.prototype.forEach.call(badges, function (badge, index) {
      var offset = badgeOffsets[index] || { x: 0, y: -60, r: 0 };
      badge.classList.add("cinema-layer");
      layers.push({
        el: badge,
        x: offset.x,
        y: offset.y,
        r: offset.r,
        s: 0.15,
        o0: 1,
        o1: 0.35,
      });
    });
  }

  function setupLenisScrollTrigger() {
    if (!window.gsap || !window.ScrollTrigger || !window.portfolioLenis) {
      return;
    }

    var lenis = window.portfolioLenis;
    var root = document.documentElement;

    window.gsap.registerPlugin(window.ScrollTrigger);

    if (!window.portfolioLenisScrollTriggerLinked) {
      lenis.on("scroll", window.ScrollTrigger.update);
      window.portfolioLenisScrollTriggerLinked = true;
    }

    window.ScrollTrigger.scrollerProxy(root, {
      scrollTop: function (value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect: function () {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: root.style.transform ? "transform" : "fixed",
    });

    window.ScrollTrigger.addEventListener("refresh", function () {
      lenis.resize();
    });

    window.ScrollTrigger.defaults({ scroller: root });
  }

  function initScrollCinema() {
    if (!window.gsap || !window.ScrollTrigger || !heroCinema || REDUCED_MOTION) {
      applyCinemaProgress(0);
      return;
    }

    setupLenisScrollTrigger();

    var config = {
      trigger: heroCinema,
      start: "top top",
      end: CAN_PIN ? "+=155%" : "+=90%",
      scrub: 0.55,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        applyCinemaProgress(self.progress);
      },
    };

    if (CAN_PIN) {
      config.pin = ".hero-pin";
      config.pinSpacing = true;
    }

    cinemaTrigger = window.ScrollTrigger.create(config);

    window.addEventListener("resize", function () {
      window.ScrollTrigger.refresh();
    });

    window.setTimeout(function () {
      window.ScrollTrigger.refresh();
    }, 400);
  }

  function boot() {
    try {
      heroCinema = document.getElementById("hero-cinema");
      hero = document.querySelector(".hero");
      terminalScene = document.querySelector(".hero-cinema .terminal-scene");
      scrollHint = document.getElementById("scroll-hint");
      filmPhase = document.getElementById("film-phase");
      filmPhaseLabel = document.getElementById("film-phase-label");
      vignette = document.getElementById("hero-vignette");
      glow = document.getElementById("hero-glow");
      callouts = Array.prototype.slice.call(document.querySelectorAll(".hero-callout"));

      collectLayers();

      runLoader(function () {
        finishHeroEntrance();
        initScrollCinema();
        window.portfolioCinematicPending = false;
        window.portfolioCinematicActive = true;
        window.dispatchEvent(new CustomEvent("portfolio:cinematic-ready"));
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
