export const typecast = (value) => {
  const trim = value?.trim()

  if (!isNaN(trim) && trim) return +value
  if (!/^(true|false|null)$|^[[{]/.test(trim)) return value

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

export const nodeCallback = (nodes, selector, host, callback) => {
  if (!nodes) return

  nodes.forEach((node) => {
    if (node.matches(selector)) {
      host?.[callback]?.(node)
    }
  })
}

export const partsMutationCallback = (host, parts, { addedNodes, removedNodes }) => {
  for (let [name, selector] of Object.entries(parts)) {
    selector = partSelector(name, selector, host.tagName)

    nodeCallback(addedNodes, selector, host?.host ?? host, `${name}ConnectedCallback`)
    nodeCallback(removedNodes, selector, host?.host ?? host, `${name}DisconnectedCallback`)
  }
}
