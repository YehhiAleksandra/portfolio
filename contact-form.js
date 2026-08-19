(function () {
  var form = document.getElementById("contact-form");
  var statusBox = document.getElementById("contact-form-status");
  if (!form || !statusBox) {
    return;
  }

  var DEFAULT_EMAIL = "yehhialeksandra@gmail.com";
  var MIN_FILL_MS = 1400;
  var COOLDOWN_MS = 60000;
  var STORAGE_KEY = "yehhi.lead.sentAt";
  var armedAt = Date.now();
  var configPromise = null;

  function locale() {
    return document.documentElement.lang === "en" ? "en" : "ru";
  }

  function message(key) {
    var messages = {
      ru: {
        sending: "Отправляю заявку...",
        success: "Спасибо! Заявка отправлена. Отвечу на почту или в Telegram.",
        error: "Не удалось отправить автоматически. Открою письмо в почте — или напишите напрямую.",
        rateLimit: "Подождите минуту перед повторной отправкой.",
        tooFast: "Подождите секунду и отправьте ещё раз.",
        need: "Заполните имя, контакт (Telegram, email или телефон) и коротко опишите задачу.",
        mailtoOpened: "Открыл черновик письма. Если почта не открылась — напишите на yehhialeksandra@gmail.com.",
      },
      en: {
        sending: "Sending your request...",
        success: "Thank you! Request sent. I will reply by email or Telegram.",
        error: "Could not send automatically. Opening your email client — or message me directly.",
        rateLimit: "Please wait a minute before sending again.",
        tooFast: "Wait a second and send again.",
        need: "Fill in your name, a contact (Telegram, email or phone), and a short task description.",
        mailtoOpened: "Opened an email draft. If nothing opened, write to yehhialeksandra@gmail.com.",
      },
    };
    return (messages[locale()] || messages.ru)[key];
  }

  function setStatus(text, isError) {
    statusBox.textContent = text;
    statusBox.classList.toggle("is-error", Boolean(isError));
    statusBox.classList.toggle("is-success", !isError && Boolean(text));
  }

  function isRepeating(value) {
    var compact = String(value || "").replace(/\s/g, "");
    if (compact.length < 2) return false;
    var first = compact.charAt(0);
    for (var i = 1; i < compact.length; i++) {
      if (compact.charAt(i) !== first) return false;
    }
    return true;
  }

  function looksLikeName(value) {
    var v = String(value || "").trim();
    if (v.length < 2 || v.length > 80) return false;
    if (!/[a-zа-яё]/i.test(v)) return false;
    if (isRepeating(v)) return false;
    return true;
  }

  function looksLikeContact(value) {
    var v = String(value || "").trim();
    if (v.length < 3 || v.length > 120) return false;
    if (/@/.test(v) || /t\.me\//i.test(v)) return true;
    var digits = v.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  }

  function looksLikeTask(value) {
    var v = String(value || "").trim();
    if (v.length < 10 || v.length > 2000) return false;
    if (isRepeating(v)) return false;
    return true;
  }

  function cooling() {
    try {
      var last = Number(localStorage.getItem(STORAGE_KEY) || 0);
      return Boolean(last) && Date.now() - last < COOLDOWN_MS;
    } catch (error) {
      return false;
    }
  }

  function markSent() {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch (error) {}
  }

  function loadConfig() {
    if (!configPromise) {
      configPromise = fetch("./site-config.json", { cache: "no-store" })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("config");
          }
          return response.json();
        })
        .catch(function () {
          return {};
        });
    }
    return configPromise;
  }

  function trackGoal(name, params) {
    try {
      if (typeof window.ym === "function" && window.__metrikaId) {
        window.ym(window.__metrikaId, "reachGoal", name, params || {});
      }
    } catch (error) {}
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", name, params || {});
      }
    } catch (error) {}
  }

  function payloadFromForm() {
    var utm = typeof window.siteUtm === "function" ? window.siteUtm() : {};
    var utmLine = Object.keys(utm)
      .map(function (key) {
        return key + "=" + utm[key];
      })
      .join(" ");
    var honey = form.querySelector('[name="website"]');
    var body = form.querySelector('[name="message"]').value.trim();
    return {
      name: form.querySelector('[name="name"]').value.trim(),
      contact: form.querySelector('[name="contact"]').value.trim(),
      message: utmLine ? body + "\n\nисточник: " + utmLine : body,
      task: body,
      website: honey ? honey.value.trim() : "",
    };
  }

  function openMailto(payload, email) {
    var subject =
      locale() === "en"
        ? "Portfolio request from " + (payload.name || "site")
        : "Заявка с портфолио: " + (payload.name || "сайт");
    var body = [
      "Name: " + payload.name,
      "Contact: " + payload.contact,
      "",
      payload.message,
      "",
      "— yehhialeksandra.github.io/portfolio",
    ].join("\n");
    var href =
      "mailto:" +
      encodeURIComponent(email || DEFAULT_EMAIL).replace(/%40/g, "@") +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);
    window.location.href = href;
  }

  function submitViaFormSubmit(payload, email) {
    return fetch("https://formsubmit.co/ajax/" + encodeURIComponent(email), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        contact: payload.contact,
        message: payload.message,
        _honey: "",
        _subject:
          locale() === "en"
            ? "Portfolio lead: " + payload.name
            : "Заявка с портфолио: " + payload.name,
        _template: "table",
        _captcha: "false",
        locale: locale(),
        source: "yehhialeksandra.github.io/portfolio",
      }),
    }).then(function (response) {
      if (!response.ok) {
        throw new Error("fail");
      }
      return response.json().catch(function () {
        return {};
      });
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var payload = payloadFromForm();
    if (payload.website) {
      setStatus(message("success"), false);
      form.reset();
      return;
    }
    if (Date.now() - armedAt < MIN_FILL_MS) {
      setStatus(message("tooFast"), true);
      return;
    }
    if (cooling()) {
      setStatus(message("rateLimit"), true);
      return;
    }
    if (!looksLikeName(payload.name) || !looksLikeContact(payload.contact) || !looksLikeTask(payload.task)) {
      setStatus(message("need"), true);
      return;
    }

    setStatus(message("sending"), false);
    trackGoal("lead_submit_attempt", { locale: locale() });

    loadConfig().then(function (config) {
      var email = (config && config.leadsEmail) || DEFAULT_EMAIL;
      submitViaFormSubmit(payload, email)
        .then(function () {
          markSent();
          setStatus(message("success"), false);
          form.reset();
          armedAt = Date.now();
          trackGoal("lead_submit", { locale: locale(), method: "formsubmit" });
        })
        .catch(function () {
          setStatus(message("error"), true);
          openMailto(payload, email);
          setTimeout(function () {
            setStatus(message("mailtoOpened"), false);
          }, 400);
          trackGoal("lead_submit_mailto_fallback", { locale: locale() });
        });
    });
  });

  window.addEventListener("portfolio:locale", function () {
    if (statusBox.textContent) {
      statusBox.textContent = "";
      statusBox.classList.remove("is-error", "is-success");
    }
  });
})();
