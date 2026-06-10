(function () {
  var form = document.getElementById("contact-form");
  var statusBox = document.getElementById("contact-form-status");
  if (!form || !statusBox) {
    return;
  }

  function locale() {
    return document.documentElement.lang === "en" ? "en" : "ru";
  }

  function message(key) {
    var messages = {
      ru: {
        sending: "Отправляю заявку...",
        success: "Спасибо! Заявка сохранена. Отвечу в Telegram или на почте.",
        error: "Не удалось отправить. Напишите напрямую в Telegram или на почту.",
        rateLimit: "Подождите минуту перед повторной отправкой.",
      },
      en: {
        sending: "Sending your request...",
        success: "Thank you! Request saved. I will reply on Telegram or email.",
        error: "Could not send. Please message me on Telegram or email directly.",
        rateLimit: "Please wait a minute before sending again.",
      },
    };
    return (messages[locale()] || messages.ru)[key];
  }

  function setStatus(text, isError) {
    statusBox.textContent = text;
    statusBox.classList.toggle("is-error", Boolean(isError));
    statusBox.classList.toggle("is-success", !isError && Boolean(text));
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    setStatus(message("sending"), false);

    var payload = {
      name: form.querySelector('[name="name"]').value.trim(),
      contact: form.querySelector('[name="contact"]').value.trim(),
      message: form.querySelector('[name="message"]').value.trim(),
      website: form.querySelector('[name="website"]').value.trim(),
    };

    fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Locale": locale(),
      },
      body: JSON.stringify(payload),
    })
      .then(function (response) {
        if (response.status === 429) {
          throw new Error("rate");
        }
        if (!response.ok) {
          throw new Error("fail");
        }
        return response.json();
      })
      .then(function () {
        setStatus(message("success"), false);
        form.reset();
      })
      .catch(function (error) {
        if (error && error.message === "rate") {
          setStatus(message("rateLimit"), true);
          return;
        }
        setStatus(message("error"), true);
      });
  });

  window.addEventListener("portfolio:locale", function () {
    if (statusBox.textContent) {
      statusBox.textContent = "";
      statusBox.classList.remove("is-error", "is-success");
    }
  });
})();
