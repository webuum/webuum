export const typecast = (value) => {
  try {
    return JSON.parse(value)
  }
  catch {
    return value
  }
}

export const partSelector = (name, selector, nodeName) => (
  `[data-${nodeName}-part~="${selector?.length > 0 ? selector : name.slice(1)}"]`
)

export const querySelector = (host, selector) =>
  [...host.querySelectorAll(selector)].filter(
    node => node.closest(host.nodeName) === host,
  )
