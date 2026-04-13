/**
 * Scheduled cleanup of expired pastes.
 */

const { deleteExpired } = require("../services/paste");
const { CLEANUP_INTERVAL_MS } = require("../config");

/**
 * Maximum consecutive failures before the cleanup job stops itself.
 */
const MAX_CONSECUTIVE_FAILURES = 5;

/**
 * Upper bound for the backoff delay (30 minutes).
 */
const MAX_BACKOFF_MS = 30 * 60 * 1000;

/**
 * Creates an independent cleanup job with its own timer and failure state.
 */
const createCleanupJob = () => {
  let timer = null;
  let consecutiveFailures = 0;

  const scheduleNext = () => {
    const delay =
      consecutiveFailures === 0
        ? CLEANUP_INTERVAL_MS
        : Math.min(
            CLEANUP_INTERVAL_MS * Math.pow(2, consecutiveFailures),
            MAX_BACKOFF_MS
          );

    timer = setTimeout(async () => {
      try {
        const count = await deleteExpired();
        if (count > 0) {
          console.log(`Cleanup: removed ${count} expired pastes`);
        }
        consecutiveFailures = 0;
      } catch (err) {
        consecutiveFailures++;
        console.error(
          `Cleanup failed (${consecutiveFailures}/${MAX_CONSECUTIVE_FAILURES}):`,
          err.message
        );

        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          console.error(
            "CRITICAL: Cleanup job stopped after " +
              `${MAX_CONSECUTIVE_FAILURES} consecutive failures. ` +
              "Manual intervention required."
          );
          timer = null;
          return;
        }
      }

      if (timer !== null) {
        scheduleNext();
      }
    }, delay);

    timer.unref();
  };

  /**
   * Starts the periodic cleanup job.
   */
  const start = () => {
    if (timer) return;
    consecutiveFailures = 0;
    scheduleNext();
  };

  /**
   * Stops the cleanup job and releases the timer.
   */
  const stop = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    consecutiveFailures = 0;
  };

  return { start, stop };
};

module.exports = { createCleanupJob };
