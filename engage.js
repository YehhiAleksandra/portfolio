(function () {
  var statusTargets = [document.getElementById("live-status"), document.getElementById("status-page-grid")];
  var changelog = document.getElementById("changelog-list");
  var hoursInput = document.getElementById("routine-hours");
  var hoursValue = document.getElementById("routine-hours-value");
  var routineResult = document.getElementById("routine-result");
  var taskInput = document.getElementById("task-input");
  var taskLink = document.getElementById("task-telegram-link");
  var ownerTelegramUrl = "mailto:yehhialeksandra@gmail.com?subject=Задача с сайта";
  var currentLocale = document.documentElement.lang === "en" ? "en" : "ru";

  var updateTranslations = {
    "Подготовлен деплой": {
      title: "Deploy prepared",
      body: "Added systemd, Nginx, SQLite backup and DuckDNS instructions.",
    },
    "Добавлены WebP и preview": {
      title: "WebP and preview added",
      body: "Images were optimized and an Open Graph preview was added for Telegram/GitHub.",
    },
    "Запущена рабочая БД": {
      title: "Work DB launched",
      body: "FastAPI + SQLite now serve the public work board and local admin panel.",
    },
  };

  var tagLabels = {
    ru: { backend: "backend", frontend: "фронт", devops: "devops", site: "сайт" },
    en: { backend: "backend", frontend: "frontend", devops: "devops", site: "site" },
  };

  function tagLabel(tag) {
    var labels = tagLabels[currentLocale] || tagLabels.ru;
    return labels[tag] || tag;
  }

  function localizedUpdate(update) {
    if (currentLocale !== "en") {
      return update;
    }
    if (update.title_en) {
      return {
        tag: update.tag,
        title: update.title_en,
        body: update.body_en || update.body,
      };
    }
    if (updateTranslations[update.title]) {
      return {
        tag: update.tag,
        title: updateTranslations[update.title].title,
        body: updateTranslations[update.title].body,
      };
    }
    return update;
  }

  function formatUptime(seconds) {
    var minutes = Math.floor(seconds / 60);
    if (minutes < 1) {
      return seconds + (currentLocale === "en" ? " sec" : " сек");
    }
    if (minutes < 60) {
      return minutes + (currentLocale === "en" ? " min" : " мин");
    }
    return (
      Math.floor(minutes / 60) +
      (currentLocale === "en" ? " h " : " ч ") +
      (minutes % 60) +
      (currentLocale === "en" ? " min" : " мин")
    );
  }

  function renderStatus(target, data) {
    if (!target) {
      return;
    }

    var backupLabel = data.last_backup
      ? currentLocale === "en"
        ? "created"
        : "создан"
      : currentLocale === "en"
        ? "none yet"
        : "пока нет";

    target.innerHTML =
      '<div class="status-card"><span>API</span><strong>' +
      data.api +
      '</strong></div><div class="status-card"><span>SQLite</span><strong>' +
      data.database +
      '</strong></div><div class="status-card"><span>' +
      (currentLocale === "en" ? "DB records" : "Работ в БД") +
      "</span><strong>" +
      data.project_count +
      '</strong></div><div class="status-card"><span>Uptime</span><strong>' +
      formatUptime(data.uptime_seconds || 0) +
      '</strong></div><div class="status-card"><span>' +
      (currentLocale === "en" ? "New leads" : "Новые заявки") +
      "</span><strong>" +
      (data.leads_new || 0) +
      '</strong></div><div class="status-card"><span>Backup</span><strong>' +
      backupLabel +
      "</strong></div>";

    if (window.portfolioTypography) {
      window.portfolioTypography.apply(target);
    }
  }

  function loadStatus() {
    fetch("/api/status")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("status unavailable");
        }
        return response.json();
      })
      .then(function (data) {
        statusTargets.forEach(function (target) {
          renderStatus(target, data);
        });
      })
      .catch(function () {
        statusTargets.forEach(function (target) {
          if (target) {
            target.innerHTML =
              '<p class="work-db-loading">' +
              (currentLocale === "en"
                ? "Status API is unavailable. Start FastAPI."
                : "Status API недоступен. Запусти FastAPI.") +
              "</p>";
          }
        });
      });
  }

  function loadChangelog() {
    if (!changelog) {
      return;
    }

    fetch("/api/updates")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("updates unavailable");
        }
        return response.json();
      })
      .then(function (updates) {
        changelog.innerHTML = updates
          .map(function (update) {
            update = localizedUpdate(update);
            return (
              '<article><span>' +
              tagLabel(update.tag) +
              "</span><h4>" +
              update.title +
              "</h4><p>" +
              update.body +
              "</p></article>"
            );
          })
          .join("");

        if (window.portfolioTypography) {
          window.portfolioTypography.apply(changelog);
        }
      })
      .catch(function () {
        var fallback = [
          {
            tag: "portfolio",
            title: currentLocale === "en" ? "Scroll landing showcase" : "Витрина scroll-лендингов",
            body:
              currentLocale === "en"
                ? "AXIS NODE and NEXUS CORE repos linked; Work DB filled with live cases."
                : "Кейсы AXIS NODE и NEXUS CORE на GitHub; рабочая БД с живыми проектами.",
          },
          {
            tag: "deploy",
            title: currentLocale === "en" ? "New GitHub repos" : "Новые репозитории",
            body:
              currentLocale === "en"
                ? "axis-node-website and nexus-core-website published under YehhiAleksandra."
                : "axis-node-website и nexus-core-website в профиле GitHub.",
          },
        ];
        changelog.innerHTML = fallback
          .map(function (update) {
            return (
              '<article><span>' +
              tagLabel(update.tag) +
              "</span><h4>" +
              update.title +
              "</h4><p>" +
              update.body +
              "</p></article>"
            );
          })
          .join("");
        if (window.portfolioTypography) {
          window.portfolioTypography.apply(changelog);
        }
      });
  }

  function updateCalculator() {
    if (!hoursInput || !hoursValue || !routineResult) {
      return;
    }

    var hours = Number(hoursInput.value || 0);
    var monthly = Math.round(hours * 4.3);
    var yearly = Math.round(monthly * 12);
    hoursValue.textContent = hours;
    routineResult.textContent =
      currentLocale === "en"
        ? "≈ " + monthly + " hours per month and up to " + yearly + " hours per year can be returned with automation."
        : "≈ " + monthly + " часов в месяц и до " + yearly + " часов в год можно вернуть автоматизацией.";

    if (window.portfolioTypography) {
      window.portfolioTypography.apply(routineResult.parentElement || routineResult);
    }
  }

  function updateTaskLink() {
    if (!taskInput || !taskLink) {
      return;
    }

    var text =
      currentLocale === "en"
        ? "Hi! I want to discuss automation. Task: " +
          (taskInput.value || "I will describe the task in the message")
        : "Привет! Хочу обсудить автоматизацию. Задача: " +
          (taskInput.value || "опишу задачу в сообщении");
    taskLink.href = ownerTelegramUrl + "?text=" + encodeURIComponent(text);
  }

  if (hoursInput) {
    hoursInput.addEventListener("input", updateCalculator);
    updateCalculator();
  }

  if (taskInput) {
    taskInput.addEventListener("input", updateTaskLink);
    updateTaskLink();
  }

  fetch("/api/public-config")
    .then(function (response) {
      return response.ok ? response.json() : null;
    })
    .then(function (config) {
      if (config && config.ownerTelegramUrl) {
        ownerTelegramUrl = config.ownerTelegramUrl;
        updateTaskLink();
      }
    })
    .catch(function () {});

  loadStatus();
  loadChangelog();

  window.addEventListener("portfolio:locale", function (event) {
    currentLocale = event.detail && event.detail.locale === "en" ? "en" : "ru";
    updateCalculator();
    updateTaskLink();
    loadStatus();
    loadChangelog();
  });
})();
