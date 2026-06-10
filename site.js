(function () {
  function absoluteUrl(base, path) {
    if (!path) {
      return base;
    }
    if (/^https?:\/\//i.test(path)) {
      return path;
    }
    return base + (path.charAt(0) === "/" ? path : "/" + path);
  }

  function setMeta(selector, value) {
    if (!value) {
      return;
    }
    var node = document.querySelector(selector);
    if (node) {
      node.setAttribute("content", value);
    }
  }

  function injectAnalytics(url) {
    if (!url || document.querySelector('script[data-analytics="1"]')) {
      return;
    }
    var script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = url;
    script.setAttribute("data-analytics", "1");
    document.head.appendChild(script);
  }

  function siteBaseUrl(config) {
    if (config && config.siteUrl) {
      return String(config.siteUrl).replace(/\/$/, "");
    }
    var path = window.location.pathname || "/";
    if (/\.html$/i.test(path)) {
      path = path.slice(0, path.lastIndexOf("/") + 1);
    } else if (!path.endsWith("/")) {
      path += "/";
    }
    return window.location.origin + path.replace(/\/$/, "");
  }

  function applySiteConfig(config) {
    var base = siteBaseUrl(config);
    var canonical = document.getElementById("canonical-link");
    if (canonical) {
      canonical.setAttribute("href", base + "/");
    }
    ["hreflang-ru", "hreflang-en", "hreflang-default"].forEach(function (id) {
      var node = document.getElementById(id);
      if (node) {
        node.setAttribute("href", base + "/");
      }
    });
    setMeta('meta[property="og:url"]', base + "/");
    setMeta('meta[property="og:image"]', base + "/assets/og-preview.png");
    setMeta('meta[name="twitter:image"]', base + "/assets/og-preview.png");

    var jsonLd = document.getElementById("person-jsonld");
    if (jsonLd) {
      try {
        var data = JSON.parse(jsonLd.textContent);
        data.url = base + "/";
        if (data.image) {
          data.image = absoluteUrl(base, data.image);
        }
        jsonLd.textContent = JSON.stringify(data);
      } catch (error) {}
    }

    injectAnalytics(config && config.analyticsUrl);

    var linkMap = {
      "demo-bot-link": config && config.demoBotUrl,
      "demo-banner-link": config && config.demoBotUrl,
      "channel-link": config && config.channelUrl,
      "visitor-bot-link": config && config.visitorBotUrl,
      "contact-visitor-bot-link": config && config.visitorBotUrl,
      "owner-telegram-link": config && config.ownerTelegramUrl,
      "task-telegram-link": config && config.ownerTelegramUrl,
    };
    Object.keys(linkMap).forEach(function (id) {
      var url = linkMap[id];
      if (!url) {
        return;
      }
      var node = document.getElementById(id);
      if (node) {
        node.setAttribute("href", url);
      }
    });
    document.querySelectorAll("a.demo-inline-link").forEach(function (node) {
      if (config && config.demoBotUrl) {
        node.setAttribute("href", config.demoBotUrl);
      }
    });
  }

  fetch("/api/public-config")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("config unavailable");
      }
      return response.json();
    })
    .then(applySiteConfig)
    .catch(function () {
      applySiteConfig({ siteUrl: "", analyticsUrl: "" });
    });
})();
