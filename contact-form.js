(function () {
  var form = document.getElementById("contact-form");
  var statusBox = document.getElementById("contact-form-status");
  if (!form || !statusBox) {
    return;
  }

  var DEFAULT_EMAIL = "yehhialeksandra@gmail.com";
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
        mailtoOpened: "Открыл черновик письма. Если почта не открылась — напишите на yehhialeksandra@gmail.com.",
      },
      en: {
        sending: "Sending your request...",
        success: "Thank you! Request sent. I will reply by email or Telegram.",
        error: "Could not send automatically. Opening your email client — or message me directly.",
        rateLimit: "Please wait a minute before sending again.",
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
    var body = form.querySelector('[name="message"]').value.trim();
    return {
      name: form.querySelector('[name="name"]').value.trim(),
      contact: form.querySelector('[name="contact"]').value.trim(),
      message: utmLine ? body + "\n\nисточник: " + utmLine : body,
      website: form.querySelector('[name="website"]').value.trim(),
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

    setStatus(message("sending"), false);
    trackGoal("lead_submit_attempt", { locale: locale() });

    loadConfig().then(function (config) {
      var email = (config && config.leadsEmail) || DEFAULT_EMAIL;
      submitViaFormSubmit(payload, email)
        .then(function () {
          setStatus(message("success"), false);
          form.reset();
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
