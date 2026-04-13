/**
 * Model representing a paste.
 */

const { DAY_IN_SECONDS, YEAR_IN_SECONDS } = require("../config");

/**
 * Domain model for a paste.
 */
class Paste {
  /**
   * Creates a new Paste instance from a database row.
   */
  constructor({ id, key, content, expires_at, created_at }) {
    this.id = id;
    this.key = key;
    this.content = content;
    this.expires_at = expires_at;
    this.created_at = created_at;
  }

  /**
   * Seconds remaining until expiry. Negative if already expired.
   */
  get ttl() {
    return (this.expires_at - Date.now()) / 1000;
  }

  /**
   * Human-readable TTL string (e.g. "3 hours", "12 days", "expired").
   */
  get ttlText() {
    const s = this.ttl;
    if (s < 0) return "expired";
    if (s < 60) return `${Math.round(s)} seconds`;
    if (s < 3600) return `${Math.round(s / 60)} minutes`;
    if (s < DAY_IN_SECONDS) return `${Math.round(s / 3600)} hours`;
    if (s < YEAR_IN_SECONDS) return `${Math.round(s / DAY_IN_SECONDS)} days`;
    return `${(s / YEAR_IN_SECONDS).toFixed(1)} years`;
  }

  /**
   * Content size in kilobytes.
   */
  get kbSize() {
    return Buffer.byteLength(this.content, "utf8") / 1000;
  }

  /**
   * Number of lines in the paste content.
   */
  get lineCount() {
    return this.content.replace(/\n+$/, "").split("\n").length;
  }

  /**
   * Whether this paste has expired.
   */
  get isExpired() {
    return this.ttl < 0;
  }

  /**
   * Human-readable size string (e.g. "4.2 KB", "380 B").
   */
  get sizeText() {
    const kb = this.kbSize;
    return kb >= 1 ? `${kb.toFixed(1)} KB` : `${Math.round(kb * 1000)} B`;
  }

  /**
   * Human-readable creation timestamp in UTC (e.g. "01/01/2026, 12:00:00").
   */
  get createdAtText() {
    if (!this.created_at) return "—";
    return new Date(this.created_at).toLocaleString("en-US", { timeZone: "America/Toronto" });
  }
}

module.exports = Paste;
