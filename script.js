(function () {
  var themeToggle = document.querySelector(".theme-toggle");
  var themeColor = document.querySelector('meta[name="theme-color"]');
  var typingLine = document.querySelector(".typing-line");
  var revealItems = document.querySelectorAll(".reveal");
  var pipelineSection = document.querySelector(".pipeline-section");
  var pipelineViewport = document.querySelector(".pipeline-viewport");
  var pipeline = document.querySelector(".pipeline");
  var progressBar = document.querySelector(".scroll-progress span");
  var backToTop = document.querySelector(".back-to-top");
  var siteHeader = document.querySelector(".site-header");
  var menuToggle = document.querySelector(".menu-toggle");
  var menuLinks = document.querySelectorAll(".nav a");
  var requestFrame =
    window.requestAnimationFrame ||
    function (callback) {
      return window.setTimeout(callback, 16);
    };

  var commands = [
    "./scripts/free_cinematic.sh",
    "ffmpeg -i axis-node-scrub.mp4",
    "python3 scripts/write_html.py",
    "systemctl status telegram-worker",
    "git push origin main",
  ];

  var commandIndex = 0;
  var charIndex = 0;
  var deleting = false;
  var trainFrame = null;
  var revealStates = [];

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function syncThemeLabel() {
    if (!themeToggle || !themeColor) {
      return;
    }

    if (!document.documentElement.classList) {
      return;
    }

    var isDark = document.documentElement.classList.contains("dark");
    var locale = document.documentElement.lang === "en" ? "en" : "ru";
    themeToggle.textContent = isDark
      ? locale === "en"
        ? "Light"
        : "Светлая"
      : locale === "en"
        ? "Dark"
        : "Темная";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeColor.setAttribute("content", isDark ? "#171715" : "#f7f7ef");
  }

  function typeCommand() {
    if (!typingLine) {
      return;
    }

    var command = commands[commandIndex];

    if (!deleting) {
      typingLine.textContent = command.slice(0, charIndex + 1);
      charIndex += 1;

      if (charIndex === command.length) {
        deleting = true;
        window.setTimeout(typeCommand, 1400);
        return;
      }
    } else {
      typingLine.textContent = command.slice(0, charIndex - 1);
      charIndex -= 1;

      if (charIndex === 0) {
        deleting = false;
        commandIndex = (commandIndex + 1) % commands.length;
      }
    }

    window.setTimeout(typeCommand, deleting ? 38 : 72);
  }

  function shouldAnimatePipeline() {
    return window.matchMedia("(min-width: 681px)").matches;
  }

  function updatePipelinePosition() {
    if (!pipelineSection || !pipelineViewport || !pipeline) {
      return;
    }

    if (!shouldAnimatePipeline()) {
      pipeline.style.transform = "";
      trainFrame = null;
      return;
    }

    var sectionRect = pipelineSection.getBoundingClientRect();
    var scrollableDistance = pipelineSection.offsetHeight - window.innerHeight;
    var viewportStyles = window.getComputedStyle(pipelineViewport);
    var viewportPadding =
      parseFloat(viewportStyles.paddingLeft) + parseFloat(viewportStyles.paddingRight);
    var maxTravel = Math.max(0, pipeline.scrollWidth - pipelineViewport.clientWidth + viewportPadding);
    var progress = scrollableDistance > 0 ? clamp(-sectionRect.top / scrollableDistance, 0, 1) : 0;

    pipeline.style.transform = "translate3d(" + -maxTravel * progress + "px, 0, 0)";
    trainFrame = null;
  }

  function requestPipelineUpdate() {
    if (trainFrame) {
      return;
    }

    trainFrame = requestFrame(updatePipelinePosition);
  }

  function updateScrollUI() {
    if (!progressBar || !backToTop) {
      return;
    }

    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var scrollTop =
      window.portfolioLenis && typeof window.portfolioLenis.scroll === "number"
        ? window.portfolioLenis.scroll
        : window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    var progress = scrollable > 0 ? clamp(scrollTop / scrollable, 0, 1) : 0;

    progressBar.style.width = progress * 100 + "%";
    if (scrollTop > window.innerHeight * 0.8) {
      backToTop.classList.add("is-visible");
    } else {
      backToTop.classList.remove("is-visible");
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      if (!document.documentElement.classList) {
        return;
      }

      var isDark = !document.documentElement.classList.contains("dark");

      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      try {
        localStorage.setItem("theme", isDark ? "dark" : "light");
      } catch (error) {
        // Private browsing or locked-down browsers can block localStorage.
      }

      syncThemeLabel();
    });
  }

  if (menuToggle && siteHeader) {
    function setMenuOpen(isOpen) {
      if (isOpen) {
        siteHeader.classList.add("is-open");
        document.body.classList.add("site-menu-open");
      } else {
        siteHeader.classList.remove("is-open");
        document.body.classList.remove("site-menu-open");
      }

      menuToggle.setAttribute("aria-expanded", String(isOpen));
    }

    menuToggle.addEventListener("click", function () {
      setMenuOpen(!siteHeader.classList.contains("is-open"));
    });

    Array.prototype.forEach.call(menuLinks, function (link) {
      link.addEventListener("click", function () {
        setMenuOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    });

    document.addEventListener("click", function (event) {
      if (!siteHeader.classList.contains("is-open")) {
        return;
      }

      if (siteHeader.contains(event.target)) {
        return;
      }

      setMenuOpen(false);
    });
  }

  function updateRevealItems() {
    if (!revealItems.length) {
      return;
    }

    Array.prototype.forEach.call(revealItems, function (item, index) {
      var rect = item.getBoundingClientRect();
      var enterLine = window.innerHeight * 0.86;
      var leaveTop = -window.innerHeight * 0.45;
      var leaveBottom = window.innerHeight * 1.35;
      var isVisible = revealStates[index];

      if (!isVisible && rect.top < enterLine && rect.bottom > 0) {
        revealStates[index] = true;
        item.classList.add("is-visible");
      } else if (isVisible && (rect.bottom < leaveTop || rect.top > leaveBottom)) {
        revealStates[index] = false;
        item.classList.remove("is-visible");
      }
    });
  }

  if (!("getBoundingClientRect" in document.documentElement)) {
    Array.prototype.forEach.call(revealItems, function (item) {
      item.classList.add("is-visible");
    });
  } else {
    Array.prototype.forEach.call(revealItems, function () {
      revealStates.push(false);
    });
  }

  function onScrollTick() {
    requestPipelineUpdate();
    updateScrollUI();
    updateRevealItems();
  }

  window.addEventListener("scroll", onScrollTick, { passive: true });
  window.addEventListener("portfolio:scroll", onScrollTick);

  window.addEventListener("resize", function () {
    requestPipelineUpdate();
    updateScrollUI();
    updateRevealItems();
  });

  window.addEventListener("portfolio:locale", syncThemeLabel);

  window.addEventListener("load", function () {
    updatePipelinePosition();
    updateScrollUI();
    updateRevealItems();
  });

  if (document.fonts) {
    document.fonts.ready.then(updatePipelinePosition);
  }

  syncThemeLabel();
  typeCommand();
  updatePipelinePosition();
  updateScrollUI();
  updateRevealItems();
})();
