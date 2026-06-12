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
      heroEyebrow: "media automation • B2B content • devops",
      heroTitle: "Content and infrastructure automation — without manual routine.",
      heroText:
        "Channel grids, bots, pipelines and server deploy. I make processes run every day — with a premium site feel: smooth scroll, cinematic presentation, fast load.",
      heroWork: "See Work",
      scrollHint: "Scroll",
      heroCv: "Resume / CV",
      heroPdf: "Download PDF",
      metricWorkstations: "channels in the grid",
      metricRegistry: "registry records in one project",
      metricDevops: "workstations administered",
      metricDeploy: "systemd services",
      terminalAria: "Animated terminal",
      altHero: "Illustration of yehhi Aleksandra with a Python laptop",
      techMarquee: "Technologies",
      statementKicker: "Short Version",
      statementTitle:
        "I maintain 120+ workstations, write Python automation and run services on Ubuntu. I like tasks where code also needs to live calmly on a server.",
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
        "“We needed more than a script — the service had to survive reboot. Aleksandra figured it out herself, set up systemd and left clear logs.”",
      review1Author: "IT department, internal automation",
      review2Text:
        "“Telegram bot with inline menu and alerts — no endless calls. We got a working MVP fast, then tuned it to our process.”",
      review2Author: "Client, tracking and notifications",
      review3Text:
        "“Great that she understands both code and Linux — no separate deploy contractor. Deploy, backup and monitoring in one cycle.”",
      review3Author: "Client, B2B content",
      demoBannerKicker: "Try in Telegram",
      demoBannerTitle: "Live expense bot — not a mockup",
      demoBannerText:
        "—",
      demoBannerCta: "Open demo bot",
      notesKicker: "Notes",
      notesTitle: "Short posts on tasks, deploy and bots.",
      notesIntro:
        "I post on Telegram: what I build, what broke on the server and what worked. Subscribe — you can also ask about automation there.",
      note1Tag: "Bot",
      note1Title: "Expense Tracker: idea to LXC",
      note1Text: "How I built the four-envelope bot, Notion API, SQLite and systemd on Ubuntu LXC — and why clients care.",
      note2Tag: "DevOps",
      note2Title: "228 hours DevOps: what actually helped",
      note2Text: "Docker, Ansible, Prometheus and CI/CD — for the portfolio and a home server with DuckDNS.",
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
      faqQ1: "How long does a typical project take?",
      faqA1:
        "Scoping — 1 day, working bot or automation MVP — from one week, full service with deploy — from one month. Exact estimate after a short brief on Telegram or email.",
      faqQ2: "Payment and engagement model?",
      faqA2:
        "In stages: brief → estimate → MVP → polish → support. Payment by agreement (milestone / fixed MVP). Small tasks can start with an audit and plan.",
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
        "Heavy enterprise front-end, greenfield 1C, shady growth hacks. Focus: B2B content, automation, scroll landings and Telegram.",
      faqPricing:
        "Ballpark: a simple Telegram bot starts as a small MVP; automation + deploy is scoped after the brief. Exact numbers after scope is clear.",
      thingsKicker: "What I Do",
      thingsTitle: "Not just code, but the full path from task to service.",
      thingBotTitle: "Telegram bots",
      thingBotText: "Inline menus, background checks, notifications, API integrations and clear user flows.",
      thingAutomationTitle: "Automation",
      thingAutomationText: "Python scripts for routine operations, parsing, reports, sync and internal workflows.",
      thingDeployTitle: "Servers and deploy",
      thingDeployText: "Ubuntu, systemd, LXC, Docker, Podman, WireGuard and predictable service operation.",
      thingMonitoringTitle: "Scroll landings",
      thingMonitoringText: "Premium product reveal: AI visuals, video pipeline, GSAP + Lenis, Pages deploy.",
      stackGrafanaText: "Video for scroll-scrub, section animation and cinematic landing choreography.",
      serviceScrollTitle: "Product scroll landing",
      serviceScrollText: "Royal Pop style: disassembly on scroll, callouts, marquee — from API images to GitHub Pages.",
      serviceScrollLink: "Discuss a landing",
      experienceItem5: "Scroll landings: AI → video → GSAP/Lenis (AXIS NODE, NEXUS CORE).",
      stackKicker: "Stack In Action",
      stackTitle: "Not just technologies, but a clear role in the result.",
      stackPythonText: "Scripts, bots, parsing, API integrations and routine automation.",
      stackSystemdText: "The service starts after reboot and does not run on luck alone.",
      stackSqliteText: "A lightweight DB for MVPs, admin panels, work history and local tools.",
      stackGrafanaText: "Metrics, dashboards and a clear picture of what happens with the service.",
      pipelineKicker: "Skills as Pipeline",
      pipelineTitle: "Every wagon carries part of the result.",
      skillsAria: "Skills chain",
      altTrain: "Illustration of yehhi Aleksandra next to a technology train",
      processKicker: "How I Work",
      processTitle: "One simple approach for a bot, server or automation.",
      processUnderstand: "Understand",
      processUnderstandText: "Clarify why the task matters, where the pain is and what done should mean.",
      processBuild: "Build",
      processBuildText: "Quickly assemble a working prototype: code, flow, integrations, data and first launch.",
      processDeploy: "Deploy",
      processDeployText: "Package the service, configure systemd or containers, check logs, access and recovery.",
      processObserve: "Observe",
      processObserveText: "Add notifications, metrics and control points so the service does not run on luck.",
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
      clientKicker: "For Clients",
      clientTitle: "What you can get in a day, a week and a month.",
      clientDay: "1 day",
      clientDayTitle: "Understand the task",
      clientDayText: "Map the process, find manual routine, suggest a short plan and estimate an MVP.",
      clientWeek: "1 week",
      clientWeekTitle: "Build a working prototype",
      clientWeekText: "A bot, script, API integration or monitoring flow that can already be tested.",
      clientMonth: "1 month",
      clientMonthTitle: "Turn it into a service",
      clientMonthText: "Deploy, database, logs, backup, documentation and clear support after launch.",
      workDbKicker: "Work DB",
      workDbTitle: "Orders, projects and progress — not in my head, but in SQLite.",
      workDbText:
        "Live cases: scroll landings, bots and automation — status and stack in the cards below.",
      filterAll: "All",
      filterProgress: "In progress",
      filterDone: "Done",
      filterSupport: "On support",
      workDbAdmin: "Open local admin",
      workDbOps: "Ops: bots and services",
      workDbPassword: "On GitHub Pages, demo records load from fallback — no backend required.",
      loadingWorkDb: "Loading records from the database...",
      loadingChangelog: "Loading recent updates...",
      loadingStatus: "Checking API and database...",
      changelogTitle: "What's new on the site",
      changelogIntro: "A short history of what was added to the portfolio, backend and deploy setup.",
      automationKicker: "Interactive",
      automationTitle: "Let's estimate value and prepare a request.",
      statusTitle: "Live status",
      calculatorTitle: "Routine calculator",
      calculatorLabel: "Hours of routine per week",
      routineUnit: "h/week",
      routineResult: "≈ 20 hours per month can be returned with automation.",
      taskTitle: "$ automate --task",
      taskPlaceholder: "Example: I need a bot that checks websites and writes to Telegram",
      taskButton: "Send task by email",
      projectsKicker: "Projects",
      projectsTitle: "Projects coming soon.",
      statusOpen: "Open status page",
      workspaceCaption:
        "Automation for me is not only writing code. It is connecting APIs, deploying the service, checking logs and making sure it will still run tomorrow.",
      altWorkspace: "Workspace illustration with Python, Telegram bot, Docker and server",
      openGithub: "Open GitHub",
      viewProfile: "View profile",
      caseTaskLabel: "Task",
      caseSolutionLabel: "Solution",
      caseResultLabel: "Result",
      projectStopTask:
        "Automatically check Telegram subscriptions against a large registry of prohibited materials.",
      projectStopSolution:
        "DOC/DOCX parsing, Flask registration, background worker, SQLite and an inline bot on Ubuntu.",
      projectStopResult:
        "4000+ records, checks every 10 minutes, service under systemd after reboot.",
      projectExpenseTask:
        "Track expenses quickly with the four-envelope method and keep data across devices.",
      projectExpenseSolution:
        "Telegram bot with setup wizard, SQLite, Notion sync, inline menus and deploy in Ubuntu LXC.",
      projectExpenseResult:
        "—",
      expenseBubbleSetup: "Salary, loans, deposit, utilities?",
      expenseBubbleAdd: "Add expense: 42 BYN",
      projectAlertTask:
        "Get alerted when a site goes down, disk fills up or an important process stops.",
      projectAlertSolution:
        "Modular checks, plugin API, Telegram notifications and a systemd service on Linux.",
      projectAlertResult:
        "Basic alerts already in production; architecture ready for more checks and a dashboard.",
      experienceKicker: "Experience",
      experienceTitle: "In real infrastructure, details matter.",
      experienceJob: "VIA Vayar — IT department programmer",
      experienceItem1: "Administration of 120+ Windows and Linux workstations.",
      experienceItem2: "Python scripts for internal task automation.",
      experienceItem3: "Networks: TCP/IP, DNS, OSPF, ISDN, Ethernet.",
      experienceItem4: "Ubuntu servers, systemd and service maintenance.",
      contactKicker: "Minsk • remote • freelance / long-term",
      contactTitle: "Have a task that should be automated?",
      contactText:
        "Message me on Telegram or email: what exists now, what should happen and where the pain is. I will quickly understand the context and suggest the shortest path to a working result.",
      contactTelegram: "Email me",
      contactBotHint: "Or use the portfolio visitor bot: menu, services and /task requests.",
      contactVisitorLink: "Open bot",
      formName: "Name",
      formNamePh: "How should I address you",
      formContact: "Telegram or email",
      formContactPh: "@username or email",
      formMessage: "Task",
      formMessagePh: "What exists now, desired outcome, where the routine hurts most",
      formSubmit: "Send request",
      cvBack: "← Back to site",
      cvDownload: "Download PDF",
      cvProfile: "Profile",
      cvProfileText:
        "Python developer and system administrator with hands-on automation, Telegram bots, Linux servers, systemd, Docker/Podman, Proxmox and monitoring experience. I maintain 120+ Windows/Linux workstations and build my own bot and DevOps projects.",
      cvExperience: "Experience",
      cvJob1: "VIA Vayar — IT department programmer",
      cvJob1Meta: "present",
      cvJob1Item1: "Administration of 120+ Windows and Linux workstations.",
      cvJob1Item2: "Internal Python scripts for routine automation.",
      cvJob1Item3: "Network support: TCP/IP, DNS, OSPF, ISDN, Ethernet.",
      cvJob1Item4: "Ubuntu servers, systemd and service maintenance.",
      cvJob2: "Military unit 25886 — radio squad commander R-137",
      cvJob2Text: "Conscript service, experience leading people, discipline and technical processes.",
      cvJob3: "558 Aircraft Repair Plant — aircraft electrical equipment fitter",
      cvJob3Text: "Engineering practice, attention to detail and technical documentation.",
      cvProjects: "Key projects",
      cvSkills: "Technical skills",
      cvSkillsText1:
        "Python, PHP, HTML, CSS, Flask, Telegram Bot API, Telethon, Notion API, Anthropic Claude API, MySQL, SQLite, Git/GitHub.",
      cvSkillsText2:
        "Linux Ubuntu, Docker, Podman, Proxmox, LXC, systemd, WireGuard VPN, Terraform, Ansible, CI/CD, Prometheus, Grafana.",
      cvEducation: "Education",
      cvEducation1: "Higher education: engineer, management specialist.",
      cvEducation2: "TeachMeSkills — DevOps Engineer, 228 academic hours, May–December 2025.",
      cvEducation3: "Self-study: Proxmox, ZStack Cloud Platform, Python automation.",
      backTop: "Top",
      backTopAria: "Back to top",
      footerCopy: "© 2026 Yehhi Aleksandra",
      modalClose: "Close",
      modalCloseAria: "Close",
      pageTitle: "Yehhi Aleksandra | media automation, B2B",
      pageDescription:
        "Portfolio of Yehhi Aleksandra: media automation, B2B content, Royal Pop scroll landings, channel grid.",
      ogTitle: "Yehhi Aleksandra | media automation",
      ogDescription:
        "Python developer, DevOps engineer and system administrator from Minsk. Bots, automation, servers and monitoring.",
      jsonLdName: "Yehhi Aleksandra",
      jsonLdDescription:
        "Media automation, B2B content and premium scroll landings. Channel grid, AI pipelines, GitHub Pages.",
      serviceBotMailSubject: "Telegram bot",
      serviceAutomationMailSubject: "Python automation",
      serviceDeployMailSubject: "Deploy and servers",
      serviceMonitoringMailSubject: "Monitoring",
      metricsAria: "Key metrics",
      workFilterAria: "Work filter",
    },
    ru: {},
  };

  function nodeText(node) {
    return (node.innerText || node.textContent || "").replace(/\s+/g, " ").trim();
  }

  function collectRussianDefaults() {
    var nodes = document.querySelectorAll("[data-i18n]");
    Array.prototype.forEach.call(nodes, function (node) {
      var key = node.getAttribute("data-i18n");
      if (!dictionary.ru[key]) {
        dictionary.ru[key] = nodeText(node);
      }
    });

    var placeholders = document.querySelectorAll("[data-i18n-placeholder]");
    Array.prototype.forEach.call(placeholders, function (node) {
      var key = node.getAttribute("data-i18n-placeholder");
      if (!dictionary.ru[key]) {
        dictionary.ru[key] = node.getAttribute("placeholder") || "";
      }
    });

    var ariaNodes = document.querySelectorAll("[data-i18n-aria]");
    Array.prototype.forEach.call(ariaNodes, function (node) {
      var key = node.getAttribute("data-i18n-aria");
      if (!dictionary.ru[key]) {
        dictionary.ru[key] = node.getAttribute("aria-label") || "";
      }
    });

    var altNodes = document.querySelectorAll("[data-i18n-alt]");
    Array.prototype.forEach.call(altNodes, function (node) {
      var key = node.getAttribute("data-i18n-alt");
      if (!dictionary.ru[key]) {
        dictionary.ru[key] = node.getAttribute("alt") || "";
      }
    });

    var jsonLd = document.getElementById("person-jsonld");
    if (jsonLd) {
      try {
        var data = JSON.parse(jsonLd.textContent);
        if (!dictionary.ru.jsonLdName && data.name) {
          dictionary.ru.jsonLdName = data.name;
        }
        if (!dictionary.ru.jsonLdDescription && data.description) {
          dictionary.ru.jsonLdDescription = data.description;
        }
      } catch (error) {}
    }

    if (!dictionary.ru.serviceBotMailSubject) {
      dictionary.ru.serviceBotMailSubject = "Telegram-бот";
      dictionary.ru.serviceAutomationMailSubject = "Python-автоматизация";
      dictionary.ru.serviceDeployMailSubject = "Деплой и серверы";
      dictionary.ru.serviceMonitoringMailSubject = "Мониторинг";
    }
  }

  function setText(selector, locale) {
    var strings = dictionary[locale] || dictionary.ru;
    var nodes = document.querySelectorAll(selector);
    Array.prototype.forEach.call(nodes, function (node) {
      var key = node.getAttribute("data-i18n");
      if (!key || !strings[key]) {
        return;
      }
      var value = strings[key];
      if (node.tagName === "TIME") {
        node.textContent = value;
        return;
      }
      node.textContent = value;
    });
  }

  function setPlaceholders(locale) {
    var strings = dictionary[locale] || dictionary.ru;
    var nodes = document.querySelectorAll("[data-i18n-placeholder]");
    Array.prototype.forEach.call(nodes, function (node) {
      var key = node.getAttribute("data-i18n-placeholder");
      if (strings[key]) {
        node.setAttribute("placeholder", strings[key]);
      }
    });
  }

  function setAriaLabels(locale) {
    var strings = dictionary[locale] || dictionary.ru;
    var nodes = document.querySelectorAll("[data-i18n-aria]");
    Array.prototype.forEach.call(nodes, function (node) {
      var key = node.getAttribute("data-i18n-aria");
      if (strings[key]) {
        node.setAttribute("aria-label", strings[key]);
      }
    });
  }

  function setAlts(locale) {
    var strings = dictionary[locale] || dictionary.ru;
    var nodes = document.querySelectorAll("[data-i18n-alt]");
    Array.prototype.forEach.call(nodes, function (node) {
      var key = node.getAttribute("data-i18n-alt");
      if (strings[key]) {
        node.setAttribute("alt", strings[key]);
      }
    });
  }

  function setMailtoSubjects(locale) {
    var strings = dictionary[locale] || dictionary.ru;
    var map = {
      serviceBotLink: "serviceBotMailSubject",
      serviceAutomationLink: "serviceAutomationMailSubject",
      serviceDeployLink: "serviceDeployMailSubject",
      serviceMonitoringLink: "serviceMonitoringMailSubject",
    };
    Object.keys(map).forEach(function (linkKey) {
      var subjectKey = map[linkKey];
      if (!strings[subjectKey]) {
        return;
      }
      var node = document.querySelector('[data-i18n="' + linkKey + '"]');
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
