(function () {
  var SKIP_SELECTOR =
    "script, style, code, pre, input, textarea, option, .nav, .locale-switch, .terminal-body, .terminal-bar, .mockup, .code-row, .chat-bubble, .work-progress, .hero-metrics strong, .floating-badge, .scroll-progress, .grain";

  var RU_BOUNDARY =
    /(^|[^\u0410-\u042F\u0430-\u044F\u0401\u0451A-Za-z0-9])((?:[\u0410-\u042F\u0430-\u044F\u0401\u0451]{1,2}))\s+(?=\S)/g;
  var RU_NUMBER_WORD = /(\d+)\s+(?=[\u0410-\u042F\u0430-\u044F\u0401\u0451\u00AB])/g;
  var RU_EM_DASH = /\s+\u2014\s+/g;
  var RU_EN_DASH = /\s+\u2013\s+/g;
  var RU_OPEN_QUOTE = /\u00AB\s+/g;
  var RU_CLOSE_QUOTE = /\s+\u00BB/g;

  function getLocale() {
    var lang = (document.documentElement.lang || "ru").toLowerCase();
    return lang.indexOf("en") === 0 ? "en" : "ru";
  }

  function shouldSkipNode(node) {
    if (!node || !node.parentElement) {
      return true;
    }
    if (node.parentElement.closest(SKIP_SELECTOR)) {
      return true;
    }
    if (node.parentElement.closest("[data-typography='off']")) {
      return true;
    }
    return false;
  }

  function fixTypographyText(text, locale) {
    if (!text || typeof text !== "string") {
      return text;
    }

    var result = text.replace(/\u00A0/g, " ");

    if (locale === "en") {
      result = result.replace(
        /\b(A|An|As|At|Be|By|He|I|If|In|Is|It|Of|On|Or|To|We|a|an|as|at|be|by|he|if|in|is|it|of|on|or|to|we)\s+(?=\S)/g,
        function (_, word) {
          return word + "\u00A0";
        }
      );
    } else {
      result = result.replace(RU_BOUNDARY, function (_, before, word) {
        return before + word + "\u00A0";
      });
      result = result.replace(RU_NUMBER_WORD, "$1\u00A0");
      result = result.replace(RU_EM_DASH, "\u00A0\u2014 ");
      result = result.replace(RU_EN_DASH, "\u00A0\u2013 ");
      result = result.replace(RU_OPEN_QUOTE, "\u00AB");
      result = result.replace(RU_CLOSE_QUOTE, "\u00A0\u00BB");
    }

    return result;
  }

  function apply(root) {
    var scope = root || document.body;
    if (!scope || !scope.querySelectorAll) {
      return;
    }

    var locale = getLocale();
    var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    var nodes = [];

    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach(function (node) {
      if (shouldSkipNode(node)) {
        return;
      }

      var original = node.textContent;
      if (!original || !original.trim()) {
        return;
      }

      var fixed = fixTypographyText(original, locale);
      if (fixed !== original) {
        node.textContent = fixed;
      }
    });
  }

  window.portfolioTypography = {
    apply: apply,
    fixText: fixTypographyText,
  };

  window.addEventListener("portfolio:locale", function () {
    apply(document.body);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      apply(document.body);
    });
  } else {
    apply(document.body);
  }
})();
