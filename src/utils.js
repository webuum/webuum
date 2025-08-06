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
  `[${localName ? `data-${localName}-` : ''}part~="${selector ? selector : name.slice(1)}"]`
)

export const querySelector = (node, selector, host = node) => {
  const localName = getLocalName(host)

  return [...node.querySelectorAll(selector)].filter(
    element => !host.host || element.closest(`${localName}, [is=${localName}]`) === host,
  )
}

const nodeCallback = (nodes, host, selector, callback) => {
  nodes?.forEach((node) => {
    [node, ...querySelector(node, selector, host?.host ?? host)]
      .filter(element => element.matches(selector))
      .forEach(callback)
  })
}

export const partsMutationCallback = (host, parts, { addedNodes, removedNodes } = {}) => {
  const localName = getLocalName(host)
  const methods = ['Connected', 'Disconnected']

  addedNodes ??= querySelector(host, `[${localName ? `data-${localName}-` : ''}part]`)

  for (let [name, selector] of Object.entries(parts)) {
    selector = getPartSelector(name, selector, localName)

    methods.forEach((state, index) =>
      nodeCallback(index ? removedNodes : addedNodes, host, selector, element =>
        (host?.host ?? host)?.[`${name}${state}Callback`]?.(element),
      ),
    )
  }
}

export const commandMutationCallback = (host, { addedNodes } = {}) => {
  const selector = '[command]'

  addedNodes ??= querySelector(host, selector)

  nodeCallback(addedNodes, host, selector, (element) => {
    if (!element.command) return
    if (!element.commandForElement) element.commandForElement = host?.host ?? host
  })
}
