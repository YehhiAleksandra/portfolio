(function () {
  var grid = document.getElementById("work-db-grid");
  var stats = document.getElementById("work-db-stats");
  var filters = document.querySelectorAll("[data-work-filter]");
  var activeFilter = "all";
  var currentLocale = document.documentElement.lang === "en" ? "en" : "ru";
  var projects = [];
  var modal = document.getElementById("project-modal");
  var modalContent = document.getElementById("project-modal-content");
  var modalClose = document.querySelector(".project-modal-close");

  var fallbackProjects = [
    {
      id: 1,
      title: "AXIS NODE",
      client: "Портфолио-проект",
      type: "Scroll landing",
      status: "done",
      progress: 100,
      description:
        "Premium scroll-лендинг: киношная разборка edge AI-узла. AI PNG → FFmpeg → native video scrub, GSAP + Lenis.",
      stack: ["GSAP", "Lenis", "FFmpeg", "Python", "GitHub Pages"],
      milestones: [
        "Royal Pop video pipeline (free_cinematic.sh)",
        "H.264 scrub MP4 с keyframe every frame",
        "Production UI: callouts, marquee, mobile nav",
      ],
      result: "Открытый репозиторий — шаблон для новых product-лендингов.",
      link: "https://github.com/YehhiAleksandra/axis-node-website",
      linkLabel: "GitHub",
    },
    {
      id: 2,
      title: "NEXUS CORE X1",
      client: "Портфолио-проект",
      type: "Scroll landing",
      status: "done",
      progress: 100,
      description:
        "Scroll-driven лендинг без видео: procedural Canvas 2D explode/reassemble, 192 кадра на лету.",
      stack: ["Canvas 2D", "GSAP", "Lenis", "Vanilla JS"],
      milestones: [
        "Procedural 3D-style renderer",
        "Scroll-bound camera orbit",
        "Stats + CTA без backend",
      ],
      result: "Лёгкая альтернатива video-scrub для fictional hardware.",
      link: "https://github.com/YehhiAleksandra/nexus-core-website",
      linkLabel: "GitHub",
    },
    {
      id: 3,
      title: "Portfolio + Work DB",
      client: "Личный продукт",
      type: "Web",
      status: "support",
      progress: 92,
      description:
        "Сайт-портфолио на GitHub Pages: i18n RU/EN, SQLite fallback, калькулятор рутины, live status.",
      stack: ["HTML", "CSS", "JS", "GitHub Pages", "FastAPI"],
      milestones: ["Hero + pipeline scroll", "Work DB cards", "Dark mode"],
      result: "yehhialeksandra.github.io/portfolio",
      link: "https://github.com/YehhiAleksandra/portfolio",
      linkLabel: "GitHub",
    },
    {
      id: 4,
      title: "Зинаида · Telegram",
      client: "Личный продукт",
      type: "Bot + Mini App",
      status: "support",
      progress: 88,
      description: "AI-бот: гороскопы, нумерология, mini-app на Vercel, Stars/YooKassa.",
      stack: ["Python", "aiogram", "React", "Vercel"],
      milestones: ["Bot live", "Mini-app deploy", "Premium vision"],
      result: "@Zinaidadigitaloracle_bot",
      link: "https://github.com/YehhiAleksandra/digital-oracle",
      linkLabel: "GitHub",
    },
  ];

  var clientTranslations = {
    "Портфолио-проект": "Portfolio project",
    "Личный продукт": "Personal product",
    "Домашняя инфраструктура": "Home infrastructure",
  };

  var projectTranslations = {
    "AXIS NODE": {
      description:
        "Premium scroll landing: cinematic edge AI node disassembly. AI PNG → FFmpeg → native video scrub, GSAP + Lenis.",
      result: "Open repo — template for new product landings.",
      milestones: [
        "Royal Pop video pipeline (free_cinematic.sh)",
        "H.264 scrub MP4 with per-frame keyframes",
        "Production UI: callouts, marquee, mobile nav",
      ],
    },
    "NEXUS CORE X1": {
      description:
        "Scroll landing without video: procedural Canvas 2D explode/reassemble, 192 frames at runtime.",
      result: "Lightweight alternative to video-scrub for fictional hardware.",
      milestones: [
        "Procedural 3D-style renderer",
        "Scroll-bound camera orbit",
        "Stats + CTA without backend",
      ],
    },
    "Portfolio + Work DB": {
      description:
        "Portfolio on GitHub Pages: i18n RU/EN, SQLite fallback, routine calculator, live status.",
      result: "yehhialeksandra.github.io/portfolio",
      milestones: ["Hero + pipeline scroll", "Work DB cards", "Dark mode"],
    },
    "Зинаида · Telegram": {
      title: "Zinaida · Telegram",
      description: "AI bot: horoscopes, numerology, Vercel mini-app, Stars/YooKassa.",
      result: "@Zinaidadigitaloracle_bot",
      milestones: ["Bot live", "Mini-app deploy", "Premium vision"],
    },
  };

  function localizedProject(project) {
    if (currentLocale !== "en") {
      return project;
    }
    var copy = {};
    Object.keys(project).forEach(function (key) {
      copy[key] = project[key];
    });
    var translation = projectTranslations[project.title];
    if (translation) {
      Object.keys(translation).forEach(function (key) {
        copy[key] = translation[key];
      });
    }
    if (clientTranslations[project.client]) {
      copy.client = clientTranslations[project.client];
    }
    return copy;
  }

  function statusLabel(status) {
    var labels = {
      ru: {
        planned: "Планируется",
        in_progress: "В работе",
        support: "На поддержке",
        done: "Готово",
      },
      en: {
        planned: "Planned",
        in_progress: "In progress",
        support: "On support",
        done: "Done",
      },
    };
    return (labels[currentLocale] && labels[currentLocale][status]) || status;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderStats(items) {
    var total = items.length;
    var done = items.filter(function (item) {
      return item.status === "done";
    }).length;
    var progress = items.filter(function (item) {
      return item.status === "in_progress";
    }).length;
    var support = items.filter(function (item) {
      return item.status === "support";
    }).length;

    stats.innerHTML =
      "<span><strong>" +
      total +
      "</strong> " +
      (currentLocale === "en" ? "total" : "всего") +
      "</span><span><strong>" +
      done +
      "</strong> " +
      (currentLocale === "en" ? "done" : "готово") +
      "</span><span><strong>" +
      progress +
      "</strong> " +
      (currentLocale === "en" ? "in progress" : "в работе") +
      "</span><span><strong>" +
      support +
      "</strong> " +
      (currentLocale === "en" ? "on support" : "на поддержке") +
      "</span>";
  }

  function render() {
    var visible = projects.filter(function (project) {
      return activeFilter === "all" || project.status === activeFilter;
    });

    renderStats(projects);

    if (!visible.length) {
      grid.innerHTML =
        '<p class="work-db-loading">' +
        (projects.length === 0
          ? (currentLocale === "en" ? "Projects will appear here soon." : "Проекты скоро появятся здесь.")
          : (currentLocale === "en" ? "No records for this filter." : "Нет записей под этот фильтр.")) +
        "</p>";
      return;
    }

    grid.innerHTML = visible
      .map(function (project) {
        project = localizedProject(project);
        var stack = (project.stack || [])
          .map(function (item) {
            return "<span>" + escapeHtml(item) + "</span>";
          })
          .join("");
        var milestones = (project.milestones || [])
          .map(function (item) {
            return "<li>" + escapeHtml(item) + "</li>";
          })
          .join("");
        var link = project.link
          ? '<a href="' +
            escapeHtml(project.link) +
            '" target="_blank" rel="noreferrer">' +
            escapeHtml(project.linkLabel || (currentLocale === "en" ? "Link" : "Ссылка")) +
            "</a>"
          : "";

        return (
          '<article class="work-card" data-project-id="' +
          project.id +
          '">' +
          '<div class="work-card-top"><div><p>' +
          escapeHtml(
        project.client ||
          project.type ||
          (currentLocale === "en" ? "Project" : "Проект")
      ) +
          "</p><h3>" +
          escapeHtml(project.title) +
          "</h3></div>" +
          '<span class="work-status status-' +
          escapeHtml(project.status) +
          '">' +
          statusLabel(project.status) +
          "</span></div>" +
          '<p class="work-description">' +
          escapeHtml(project.description) +
          "</p>" +
          '<div class="work-progress" aria-label="Прогресс ' +
          Number(project.progress || 0) +
          '%"><span style="width:' +
          Number(project.progress || 0) +
          '%"></span></div>' +
          '<div class="work-card-meta"><span>' +
          Number(project.progress || 0) +
          "%</span><span>" +
          escapeHtml(project.type || "Work") +
          "</span></div>" +
          '<div class="work-stack">' +
          stack +
          "</div>" +
          '<ul class="work-milestones">' +
          milestones +
          "</ul>" +
          '<p class="work-result">' +
          escapeHtml(project.result || "") +
          "</p>" +
          '<button type="button" class="work-details" data-project-id="' +
          project.id +
          '">' +
          (currentLocale === "en" ? "Details" : "Подробнее") +
          "</button>" +
          link +
          "</article>"
        );
      })
      .join("");

    bindDetails();

    if (window.portfolioTypography) {
      window.portfolioTypography.apply(grid);
      if (stats) {
        window.portfolioTypography.apply(stats);
      }
    }
  }

  function openProject(project) {
    if (!modal || !modalContent) {
      return;
    }

    project = localizedProject(project);
    var stack = (project.stack || []).join(" / ");
    var milestones = (project.milestones || [])
      .map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      })
      .join("");
    var link = project.link
      ? '<a href="' +
        escapeHtml(project.link) +
        '" target="_blank" rel="noreferrer">' +
        (currentLocale === "en" ? "Open link" : "Открыть ссылку") +
        "</a>"
      : "";

    modalContent.innerHTML =
      '<p class="section-kicker">' +
      escapeHtml(
        project.client ||
          project.type ||
          (currentLocale === "en" ? "Project" : "Проект")
      ) +
      "</p>" +
      '<h2 id="project-modal-title">' +
      escapeHtml(project.title) +
      "</h2>" +
      '<span class="work-status status-' +
      escapeHtml(project.status) +
      '">' +
      statusLabel(project.status) +
      "</span>" +
      "<p>" +
      escapeHtml(project.description || "") +
      "</p>" +
      '<div class="work-progress"><span style="width:' +
      Number(project.progress || 0) +
      '%"></span></div>' +
      '<p class="work-card-meta"><span>' +
      Number(project.progress || 0) +
      "%</span><span>" +
      escapeHtml(project.type || "Work") +
      "</span></p>" +
      "<h3>" +
      (currentLocale === "en" ? "Stack" : "Стек") +
      "</h3><p>" +
      escapeHtml(stack) +
      "</p><h3>" +
      (currentLocale === "en" ? "Milestones" : "Этапы") +
      "</h3><ul>" +
      milestones +
      "</ul><h3>" +
      (currentLocale === "en" ? "Result" : "Результат") +
      "</h3><p>" +
      escapeHtml(project.result || "") +
      "</p>" +
      link;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    if (window.portfolioTypography) {
      window.portfolioTypography.apply(modalContent);
    }
  }

  function closeProject() {
    if (!modal) {
      return;
    }
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  function bindDetails() {
    var buttons = grid.querySelectorAll("[data-project-id]");
    Array.prototype.forEach.call(buttons, function (button) {
      button.addEventListener("click", function () {
        var id = Number(button.getAttribute("data-project-id"));
        var project = projects.find(function (item) {
          return Number(item.id) === id;
        });
        if (project) {
          openProject(project);
        }
      });
    });
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeProject);
  }

  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeProject();
      }
    });
  }

  function setFilter(nextFilter) {
    activeFilter = nextFilter;
    Array.prototype.forEach.call(filters, function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-work-filter") === nextFilter);
    });
    render();
  }

  Array.prototype.forEach.call(filters, function (button) {
    button.addEventListener("click", function () {
      setFilter(button.getAttribute("data-work-filter"));
    });
  });

  fetch("/api/projects")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("API unavailable");
      }
      return response.json();
    })
    .then(function (data) {
      projects = data;
      render();
    })
    .catch(function () {
      projects = fallbackProjects;
      render();
    });

  window.addEventListener("portfolio:locale", function (event) {
    currentLocale = event.detail && event.detail.locale === "en" ? "en" : "ru";
    if (modalClose) {
      modalClose.textContent = currentLocale === "en" ? "Close" : "Закрыть";
      modalClose.setAttribute("aria-label", currentLocale === "en" ? "Close" : "Закрыть");
    }
    render();
  });
})();
