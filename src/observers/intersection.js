/**
 * Observe `host` with an `IntersectionObserver` and forward each change to an
 * `intersectCallback(entry)` method on the host (branch on `entry.isIntersecting`).
 * Disconnects on `$signal` abort.
 *
 * @param {HTMLElement} host
 * @param {IntersectionObserverInit} [options]
 * @returns {IntersectionObserver}
 */
export const defineIntersectionObserver = (host, options = {}) => {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) host.intersectCallback?.(entry)
  }, options)

  observer.observe(host)
  host.$signal?.addEventListener('abort', () => observer.disconnect())

  return observer
}
