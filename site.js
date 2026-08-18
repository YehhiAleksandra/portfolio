(function () {
  var UTM_KEY = "aleks.utm.v1";
  var UTM_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "yclid",
    "ysclid",
    "gclid",
  ];

  function captureUtm() {
    var params = new URLSearchParams(window.location.search);
    var found = {};
    var any = false;
    UTM_KEYS.forEach(function (key) {
      var value = params.get(key);
      if (value) {
        found[key] = value;
        any = true;
      }
    });
    if (any) {
      try {
        sessionStorage.setItem(UTM_KEY, JSON.stringify(found));
      } catch (error) {}
    }
  }

  function readUtm() {
    try {
      return JSON.parse(sessionStorage.getItem(UTM_KEY) || "{}");
    } catch (error) {
      return {};
    }
  }

  window.siteUtm = readUtm;
  captureUtm();

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

  function injectMetrika(id) {
    if (!id || window.__metrikaId) {
      return;
    }
    window.__metrikaId = Number(id) || id;
    (function (m, e, t, r, i, k, a) {
      m[i] =
        m[i] ||
        function () {
          (m[i].a = m[i].a || []).push(arguments);
        };
      m[i].l = 1 * new Date();
      for (var j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) {
          return;
        }
      }
      k = e.createElement(t);
      a = e.getElementsByTagName(t)[0];
      k.async = 1;
      k.src = r;
      a.parentNode.insertBefore(k, a);
    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
    window.ym(window.__metrikaId, "init", {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
      ecommerce: "dataLayer",
    });
  }

  function injectGa4(id) {
    if (!id || document.querySelector('script[data-ga4="1"]')) {
      return;
    }
    var loader = document.createElement("script");
    loader.async = true;
    loader.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    loader.setAttribute("data-ga4", "1");
    document.head.appendChild(loader);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", id);
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
        if (!Array.isArray(data.sameAs)) {
          data.sameAs = [];
        }
        if (data.sameAs.indexOf(base + "/") === -1) {
          data.sameAs.push(base + "/");
        }
        jsonLd.textContent = JSON.stringify(data);
      } catch (error) {}
    }

    injectAnalytics(config && config.analyticsUrl);
    if (config && config.metrikaId) {
      injectMetrika(config.metrikaId);
    }
    if (config && config.ga4Id) {
      injectGa4(config.ga4Id);
    }

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

  var defaults = {
    siteUrl: "https://yehhialeksandra.github.io/portfolio",
    analyticsUrl: "",
    metrikaId: "",
    ga4Id: "",
  };

  fetch("./site-config.json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("config unavailable");
      }
      return response.json();
    })
    .then(function (config) {
      applySiteConfig(Object.assign({}, defaults, config || {}));
    })
    .catch(function () {
      applySiteConfig(defaults);
    });
})();
