/**
 * Utility for injecting the Tailwind CSS CDN script into HTML.
 */

const { TAILWIND_CDN_URL } = require("../config");

const TW_SCRIPT = `<script src="${TAILWIND_CDN_URL}"></script>`;

/**
 * Injects the Tailwind CSS CDN `<script>` tag into an HTML string.
 */
const injectTailwind = (html) => {
  if (/<head[\s>]/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, `<head$1>\n${TW_SCRIPT}`);
  }

  if (/<html[\s>]/i.test(html)) {
    return html.replace(
      /<html([^>]*)>/i,
      `<html$1><head>${TW_SCRIPT}</head>`
    );
  }

  return `${TW_SCRIPT}\n${html}`;
};

module.exports = { injectTailwind };
