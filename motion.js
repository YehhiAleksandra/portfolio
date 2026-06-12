(function () {
  var REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var siteHeader = document.querySelector(".site-header");
  var hero = document.querySelector(".hero");
  var lenis = null;

  function dispatchScroll() {
    window.dispatchEvent(new CustomEvent("portfolio:scroll"));
  }

  function updateHeader(scrollTop) {
    if (!siteHeader) {
      return;
    }

    siteHeader.classList.toggle("is-compact", scrollTop > 48);
  }

  function pulseProgressBar() {
    var bar = document.querySelector(".scroll-progress span");
    if (!bar || REDUCED_MOTION) {
      return;
    }

    bar.classList.add("is-pulse");
    window.setTimeout(function () {
      bar.classList.remove("is-pulse");
    }, 1400);
  }

  function initHeroEntrance() {
    if (!hero) {
      return;
    }

    if (REDUCED_MOTION) {
      hero.classList.add("is-entered", "is-ready");
      return;
    }

    window.requestAnimationFrame(function () {
      window.setTimeout(function () {
        hero.classList.add("is-entered");
        pulseProgressBar();
        window.setTimeout(function () {
          hero.classList.add("is-ready");
        }, 1200);
      }, 120);
    });
  }

  function initAnchorScroll() {
    document.addEventListener("click", function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (!link || !lenis) {
        return;
      }

      var id = link.getAttribute("href");
      if (!id || id === "#") {
        return;
      }

      var target = document.querySelector(id);
      if (!target) {
        return;
      }

      event.preventDefault();
      lenis.scrollTo(target, {
        offset: -72,
        duration: REDUCED_MOTION ? 0.35 : 1.15,
      });
    });
  }

  function initLenis() {
    if (REDUCED_MOTION || typeof window.Lenis !== "function") {
      document.documentElement.classList.add("motion-fallback");
      updateHeader(window.scrollY || 0);
      window.addEventListener(
        "scroll",
        function () {
          updateHeader(window.scrollY || 0);
        },
        { passive: true }
      );
      return;
    }

    lenis = new Lenis({
      duration: 1.35,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smoothWheel: true,
      touchMultiplier: 1.5,
      wheelMultiplier: 1.05,
    });

    document.documentElement.classList.add("motion-ready");

    window.portfolioLenis = lenis;

    lenis.on("scroll", function (e) {
      updateHeader(e.scroll);
      dispatchScroll();
    });

    function raf(time) {
      lenis.raf(time);
      window.requestAnimationFrame(raf);
    }

    window.requestAnimationFrame(raf);
    initAnchorScroll();
  }

  function initHeroParallax() {
    var scene = document.querySelector(".hero .terminal-scene");
    if (!scene || REDUCED_MOTION) {
      return;
    }

    function onParallax() {
      var scrollTop =
        window.portfolioLenis && typeof window.portfolioLenis.scroll === "number"
          ? window.portfolioLenis.scroll
          : window.scrollY || 0;
      var offset = Math.min(scrollTop * 0.045, 36);
      scene.style.setProperty("--hero-parallax", offset + "px");
    }

    window.addEventListener("scroll", onParallax, { passive: true });
    window.addEventListener("portfolio:scroll", onParallax);
    onParallax();
  }

  window.addEventListener("load", function () {
    initHeroEntrance();
    initHeroParallax();
  });
  initLenis();
})();
