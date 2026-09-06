(function () {
  var currentLocale = "ru";
  var switches = document.querySelectorAll("[data-locale-switch]");

  var dictionary = {
    en: {
      brand: "Yehhi Aleksandra",
      brandHome: "Home",
      menu: "Menu",
      navAria: "Main navigation",
      navWhy: "Why Me",
      navThings: "What I Do",
      navProcess: "Process",
      navFaq: "FAQ",
      availabilityOpen: "Accepting projects",
      availabilityBusy: "Limited availability",
      navServices: "Services",
      navWorkDb: "Work DB",
      navValue: "Value",
      navProjects: "Projects",
      navContacts: "Contact",
      themeAria: "Toggle theme",
      themeLight: "Light",
      themeDark: "Dark",
      heroEyebrow: "media automation • B2B content • channel grid",
      heroTitle: "Content and publishing on schedule — without manual routine.",
      heroText:
        "I help B2B teams build a channel grid: from ideas and scripts to scheduled publishing on Telegram, social networks and short video.",
      heroWork: "See Work",
      heroCv: "Resume / CV",
      heroPdf: "Download PDF",
      metricWorkstations: "channels in the grid",
      metricRegistry: "planned posts per month",
      metricDevops: "content pipelines",
      metricDeploy: "TEXT+IMAGE and VIDEO",
      terminalAria: "Animated terminal",
      altHero: "Illustration of yehhi Aleksandra with a Python laptop",
      techMarquee: "Technologies",
      statementKicker: "Short Version",
      statementTitle:
        "I work on B2B media automation and a channel grid. I like tasks where content also has to publish every day without manual control.",
      whyKicker: "Why Work With Me",
      whyTitle: "Not just writing code, but delivering a running service.",
      whyIntro:
        "Clients need the task understood, an MVP built, deployment on a server and someone who does not disappear after handoff. That is the path I cover end to end.",
      whyItem1Title: "I understand the task on my own",
      whyItem1Text: "Process and pain first, then code. No endless calls just to restate the obvious.",
      whyItem2Title: "Code and server without a second contractor",
      whyItem2Text: "Python, bots, APIs, Ubuntu, Docker, systemd, monitoring — no second contractor for deploy.",
      whyItem3Title: "I ship to production",
      whyItem3Text: "Not a zip archive, but a service that survives reboot and writes readable logs.",
      whyItem4Title: "Clear handoff structure",
      whyItem4Text: "README, configs, backup, short runbook — so tomorrow you are not tied to my memory.",
      certKicker: "Certificate",
      certTitle: "DevOps Engineer — TeachMeSkills",
      certText: "228 academic hours: Linux, Docker, Terraform, Ansible, CI/CD, Prometheus, Grafana.",
      demoKicker: "Live demo",
      demoTitle: "",
      demoText: "Production Telegram bot: four-envelope budgeting, Notion, SQLite, server deploy.",
      yehhiTagline: "Runs while you sleep.",
      yehhiSignature: "— V. Alexandrovich",
      demoOpen: "",
      demoInlineLink: "Demo in Telegram",
      reviewsKicker: "Reviews",
      navReviews: "Reviews",
      navNotes: "Notes",
      reviewsTitle: "What people say after the work, not before.",
      reviewsIntro:
        "Short feedback from typical engagements — internal automation, bots and infrastructure. Names shortened on request.",
      review1Text:
        "\u201CWe needed more than a script \u2014 the service had to survive reboot. Aleksandra figured it out herself, set up systemd and left clear logs.\u201D",
      review1Author: "IT department, internal automation",
      review2Text:
        "\u201CTelegram bot with inline menu and alerts \u2014 no endless calls. We got a working MVP fast, then tuned it to our process.\u201D",
      review2Author: "Client, tracking and notifications",
      review3Text:
        "\u201CGreat that she understands both code and Linux \u2014 no separate deploy contractor. Deploy, backup and monitoring in one cycle.\u201D",
      review3Author: "Client, B2B content",
      demoBannerKicker: "Try in Telegram",
      demoBannerTitle: "Live expense bot \u2014 not a mockup",
      demoBannerText:
        "\u2014",
      demoBannerCta: "Open demo bot",
      notesKicker: "Notes",
      notesTitle: "Short posts on tasks, deploy and bots.",
      notesIntro:
        "I write short notes on what I build, what broke on the server and what worked. Leave a request if you need the same automation.",
      note1Tag: "Bot",
      note1Title: "Expense Tracker: idea to LXC",
      note1Text: "How I built the four-envelope bot, Notion API, SQLite and systemd on Ubuntu LXC \u2014 and why clients care.",
      note2Tag: "DevOps",
      note2Title: "228 hours DevOps: what actually helped",
      note2Text: "Docker, Ansible, Prometheus and CI/CD \u2014 for the portfolio and a home server with DuckDNS.",
      note3Tag: "Portfolio",
      note3Title: "Site + Work DB + bots",
      note3Text: "Why a live portfolio on FastAPI, SQLite and two Telegram bots instead of a one-off PDF.",
      notesChannel: "Email me",
      notesVisitorBot: "Portfolio visitor bot",
      note1Date: "May 2026",
      note2Date: "January 2026",
      note3Date: "June 2026",
      faqKicker: "FAQ",
      faqTitle: "Common questions before we start.",
      faqQ0: "What are the real numbers \u2014 not a slogan?",
      faqA0:
        "5+ channels in one grid, 30+ planned posts per month, two separate pipelines: TEXT+IMAGE and VIDEO. Based in Minsk, UTC+3. Observable practice, not a KPI wall.",
      faqQ1: "How long does a typical project take?",
      faqA1:
        "Scoping \u2014 1 day, working bot or automation MVP \u2014 from one week, full service with deploy \u2014 from one month. Exact estimate after a short brief via the request form or email.",
      faqQ2: "Payment and engagement model?",
      faqA2:
        "In stages: brief \u2192 estimate \u2192 MVP \u2192 polish \u2192 support. Payment by agreement (milestone / fixed MVP). Small tasks can start with an audit and plan.",
      faqQ3: "Remote work? Time zone?",
      faqA3:
        "Yes, remote. Based in Minsk (UTC+3), fine with EU and CIS teams. Calls when needed, not for show.",
      faqQ4: "NDA and server access?",
      faqA4:
        "Confidentiality is standard. Access via SSH/VPN, least privilege, separate staging when possible.",
      faqQ5: "What happens after delivery?",
      faqA5:
        "I can stay for support: monitoring, small changes, backups. Or hand over docs so your team takes over.",
      faqQ6: "What do you not do?",
      faqA6:
        "Pure design sites, heavy front-end \u201Cturnkey\u201D. Focus: media automation.",
      faqPricing:
        "Ballpark: a simple Telegram bot starts as a small MVP; automation + deploy is scoped after the brief. Exact numbers after scope is clear.",
      thingsKicker: "What I Do",
      thingsTitle: "Not just code, but the full path from task to service.",
      thingProcessKicker: "How I Work",
      thingProcessTitle: "One simple approach for a bot, a server or an automation task.",
      thingProcessAsk: "Understand",
      thingProcessAskText: "Why the task matters, where the pain is and what a done result looks like.",
      thingProcessBuild: "Build",
      thingProcessBuildText: "A working prototype fast: code, scenario, bot, integration \u2014 something you can try.",
      thingProcessDeploy: "Deploy",
      thingProcessDeployText: "Package the service, configure systemd or containers, check logs, access and recovery.",
      thingProcessObserve: "Observe",
      thingProcessObserveText: "Add notifications, metrics and control points so the service does not run on luck.",
      servicesKicker: "Services",
      servicesTitle: "When you need a working tool, not a presentation.",
      serviceBotTitle: "Telegram bot for a task",
      serviceBotText: "From scenario and inline menus to database, API integrations, deploy and notifications.",
      serviceBotLink: "Discuss a bot",
      serviceAutomationTitle: "Python automation",
      serviceAutomationText: "Scripts for routine operations, parsing, reports, synchronization and internal workflows.",
      serviceAutomationLink: "Automate it",
      serviceDeployTitle: "Deploy and servers",
      serviceDeployText: "Ubuntu, systemd, Docker, Podman, LXC, Proxmox, WireGuard and clear operation.",
      serviceDeployLink: "Launch a service",
      serviceMonitoringTitle: "Monitoring and alerts",
      serviceMonitoringText: "Website checks, disks, processes, Telegram notifications, Prometheus and Grafana.",
      serviceMonitoringLink: "Set up control",
      workDbKicker: "Work DB",
      workDbTitle: "Orders, projects and progress \u2014 not in my head, in SQLite.",
      workDbLoading: "Loading records from DB...",
      valueKicker: "Value",
      valueTitle: "Calculate the benefit and submit a request in one place.",
      valueStatusTitle: "Live status",
      valueStatusText: "Checking API and DB...",
      valueStatusLink: "Open status page",
      valueCalcTitle: "Routine calculator",
      valueCalcLabel: "Hours of routine per week",
      valueCalcResult: "\u2248 20 hours per month can be reclaimed by automation.",
      taskKicker: "$ automate --task",
      taskLabel: "Describe your task in one or two lines:",
      taskInputPh: "Telegram bot with requests and status notifications...",
      taskButton: "Send task by email",
      notesKicker: "Notes",
      notesTitle: "Short posts on tasks, deploy and bots.",
      notesIntro:
        "I write short notes on what I build, what broke on the server and what worked. Leave a request if you need the same automation.",
      note1Tag: "Bot",
      note1Title: "Expense Tracker: idea to LXC",
      note1Text: "How I built the four-envelope bot, Notion API, SQLite and systemd on Ubuntu LXC \u2014 and why clients care.",
      note2Tag: "DevOps",
      note2Title: "228 hours DevOps: what actually helped",
      note2Text: "Docker, Ansible, Prometheus and CI/CD \u2014 for the portfolio and a home server with DuckDNS.",
      note3Tag: "Portfolio",
      note3Title: "Site + Work DB + bots",
      note3Text: "Why a live portfolio on FastAPI, SQLite and two Telegram bots instead of a one-off PDF.",
      notesChannel: "Email me",
      notesVisitorBot: "Portfolio visitor bot",
      note1Date: "May 2026",
      note2Date: "January 2026",
      note3Date: "June 2026",
    },
  };

  var russianDefaults = {};

  function collectRussianDefaults() {
    var ru = document.querySelector("[data-locale-switch=\"ru\"]");
    if (!ru) {
      return;
    }
    var strings = dictionary.ru;
    if (!strings) {
      strings = {};
      dictionary.ru = strings;
    }
    var els = document.querySelectorAll("[data-i18n]");
    Array.prototype.forEach.call(els, function (el) {
      var key = el.getAttribute("data-i18n");
      if (key && !strings[key]) {
        strings[key] = el.textContent || el.innerText || "";
      }
    });
    var summaries = document.querySelectorAll("summary[data-i18n]");
    Array.prototype.forEach.call(summaries, function (s) {
      var key = s.getAttribute("data-i18n");
      if (key && !strings[key]) {
        strings[key] = s.textContent || s.innerText || "";
      }
    });
  }

  function setText(selector, locale) {
    var strings = dictionary[locale] || dictionary.ru;
    var els = document.querySelectorAll(selector);
    Array.prototype.forEach.call(els, function (el) {
      var key = el.getAttribute("data-i18n");
      if (key && strings[key] !== undefined) {
        if (el.tagName === "SUMMARY" || el.tagName === "BUTTON" || el.tagName === "A" || el.tagName === "SPAN" || el.tagName === "H1" || el.tagName === "H2" || el.tagName === "H3" || el.tagName === "P" || el.tagName === "LI" || el.tagName === "LABEL" || el.tagName === "MARK" || el.tagName === "STRONG" || el.tagName === "SMALL" || el.tagName === "OUTPUT") {
          el.textContent = strings[key];
        } else {
          el.innerHTML = strings[key];
        }
      }
    });
  }

  function setPlaceholders(locale) {
    var strings = dictionary[locale] || dictionary.ru;
    var els = document.querySelectorAll("[data-i18n-placeholder]");
    Array.prototype.forEach.call(els, function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      if (key && strings[key]) {
        el.setAttribute("placeholder", strings[key]);
      }
    });
  }

  function setAriaLabels(locale) {
    var strings = dictionary[locale] || dictionary.ru;
    var els = document.querySelectorAll("[data-i18n-aria]");
    Array.prototype.forEach.call(els, function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (key && strings[key]) {
        el.setAttribute("aria-label", strings[key]);
      }
    });
  }

  function setAlts(locale) {
    var strings = dictionary[locale] || dictionary.ru;
    var els = document.querySelectorAll("[data-i18n-alt]");
    Array.prototype.forEach.call(els, function (el) {
      var key = el.getAttribute("data-i18n-alt");
      if (key && strings[key]) {
        el.setAttribute("alt", strings[key]);
      }
    });
  }

  function setMailtoSubjects(locale) {
    var strings = dictionary[locale] || dictionary.ru;
    var map = {
      "owner-telegram-link": "contactTelegram",
      "task-link": "taskButton",
    };
    Object.keys(map).forEach(function (linkKey) {
      var subjectKey = map[linkKey];
      if (!strings[subjectKey]) {
        return;
      }
      var node = document.querySelector("[data-i18n=\"" + linkKey + "\"]");
      if (!node || node.tagName !== "A") {
        return;
      }
      var href = node.getAttribute("href") || "";
      if (href.indexOf("mailto:") !== 0) {
        return;
      }
      var parts = href.split("?");
      var params = new URLSearchParams(parts[1] || "");
      params.set("subject", strings[subjectKey]);
      node.setAttribute("href", parts[0] + "?" + params.toString());
    });
  }

  function setJsonLd(locale) {
    var strings = dictionary[locale] || dictionary.ru;
    var jsonLd = document.getElementById("person-jsonld");
    if (!jsonLd || !strings.jsonLdName) {
      return;
    }
    try {
      var data = JSON.parse(jsonLd.textContent);
      data.name = strings.jsonLdName;
      if (strings.jsonLdDescription) {
        data.description = strings.jsonLdDescription;
      }
      jsonLd.textContent = JSON.stringify(data, null, 2);
    } catch (error) {}
  }

  function setDocumentMeta(locale) {
    var strings = dictionary[locale] || dictionary.ru;
    if (strings.pageTitle) {
      document.title = strings.pageTitle;
    }
    var description = document.querySelector('meta[name="description"]');
    if (description && strings.pageDescription) {
      description.setAttribute("content", strings.pageDescription);
    }
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && strings.ogTitle) {
      ogTitle.setAttribute("content", strings.ogTitle);
    }
    var ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && strings.ogDescription) {
      ogDescription.setAttribute("content", strings.ogDescription);
    }
    var ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) {
      ogLocale.setAttribute("content", locale === "en" ? "en_US" : "ru_RU");
    }
  }

  function setHreflang(locale) {
    var canonical = document.getElementById("canonical-link");
    var base = canonical ? canonical.getAttribute("href") || "/" : "/";
    ["hreflang-ru", "hreflang-en", "hreflang-default"].forEach(function (id) {
      var node = document.getElementById(id);
      if (node) {
        node.setAttribute("href", base);
      }
    });
  }

  function applyLocale(locale, save) {
    currentLocale = locale === "en" ? "en" : "ru";
    document.documentElement.lang = currentLocale;
    setText("[data-i18n]", currentLocale);
    setPlaceholders(currentLocale);
    setAriaLabels(currentLocale);
    setAlts(currentLocale);
    setMailtoSubjects(currentLocale);
    setJsonLd(currentLocale);
    setDocumentMeta(currentLocale);
    setHreflang(currentLocale);

    Array.prototype.forEach.call(switches, function (button) {
      var isActive = button.getAttribute("data-locale-switch") === currentLocale;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (save) {
      try {
        localStorage.setItem("locale", currentLocale);
      } catch (error) {}
    }

    window.dispatchEvent(new CustomEvent("portfolio:locale", { detail: { locale: currentLocale } }));

    if (window.portfolioTypography) {
      window.portfolioTypography.apply(document.body);
    }
  }

  function readSavedLocale() {
    try {
      var saved = localStorage.getItem("locale");
      if (saved === "ru" || saved === "en") {
        return saved;
      }
    } catch (error) {}
    return null;
  }

  function initLocale() {
    applyLocale(readSavedLocale() || "ru", false);
  }

  collectRussianDefaults();

  Array.prototype.forEach.call(switches, function (button) {
    button.addEventListener("click", function () {
      applyLocale(button.getAttribute("data-locale-switch"), true);
    });
  });

  initLocale();
})();