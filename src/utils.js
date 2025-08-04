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

export const getLocalName = (host) => {
  return host?.getAttribute?.('is') || host?.localName
}

export const getPartSelector = (name, selector, localName) => (
  `[${localName ? `data-${localName}-` : ''}part~="${selector?.length > 0 ? selector : name.slice(1)}"]`
)

export const querySelector = (host, selector, localName) =>
  [...host.querySelectorAll(selector)].filter(
    node => !host.localName || node.closest(`${localName}, [is=${localName}]`) === host,
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
  const localName = getLocalName(host)

  for (let [name, selector] of Object.entries(parts)) {
    selector = getPartSelector(name, selector, localName)

    nodeCallback(addedNodes, selector, host?.host ?? host, `${name}ConnectedCallback`)
    nodeCallback(removedNodes, selector, host?.host ?? host, `${name}DisconnectedCallback`)
  }
}
