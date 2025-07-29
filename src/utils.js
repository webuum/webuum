export const typecast = (value) => {
  try {
    return JSON.parse(value)
  }
  catch {
    return value
  }
}

export const partSelector = (name, selector, tagName) => (
  `[${tagName ? `data-${tagName}-` : ''}part~="${selector?.length > 0 ? selector : name.slice(1)}"]`
)

export const querySelector = (host, selector) =>
  [...host.querySelectorAll(selector)].filter(
    node => !host.tagName || node.closest(host.tagName) === host,
  )
