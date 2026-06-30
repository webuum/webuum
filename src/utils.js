/**
 * @param {string} value
 * @returns {unknown}
 */
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

/**
 * @param {HTMLElement} host
 * @returns {string}
 */
export const getLocalName = (host) => {
  return host?.getAttribute?.('is') || host?.localName
}

/**
 * @param {string} name
 * @param {string} selector
 * @param {string} localName
 * @returns {string}
 */
export const getPartSelector = (name, selector, localName) => (
  `[${localName ? `data-${localName}-` : ''}part${name ? `~="${selector || name.slice(1)}"` : ''}]`
)

/**
 * @param {HTMLElement | ShadowRoot} node
 * @param {string} selector
 * @param {HTMLElement | ShadowRoot} host
 * @returns {Element[]}
 */
export const findSelectors = (node, selector, host = node) => {
  if (!node.querySelectorAll) return []

  const hostElement = host?.host ?? host
  const localName = getLocalName(hostElement)

  return [...node.querySelectorAll(selector)].filter((element) => {
    // owner is the closest same-name component, none when the scope root cuts the tree above it
    const owner = element.closest(`${localName}, [is=${localName}]`)

    return !owner || owner === hostElement
  })
}

/**
 * @param {NodeList} nodes
 * @param {HTMLElement | ShadowRoot} host
 * @param {string} selector
 * @param {(element: Element) => void} callback
 */
const nodeCallback = (nodes, host, selector, callback) => {
  nodes?.forEach((node) => {
    if (node?.matches?.(selector)) callback(node)
    findSelectors(node, selector, host?.host ?? host).forEach(callback)
  })
}

/**
 * @param {HTMLElement | ShadowRoot} host
 * @param {Record<string, string | null>} parts
 * @param {{addedNodes?: Element[], removedNodes?: Element[]}} nodes
 */
export const partsMutationCallback = (host, parts, { addedNodes, removedNodes } = {}) => {
  const localName = getLocalName(host)
  const hostElement = host?.host ?? host

  addedNodes ??= findSelectors(host, getPartSelector('', '', localName))

  for (let [name, selector] of Object.entries(parts)) {
    selector = getPartSelector(name, selector, localName)

    nodeCallback(addedNodes, host, selector, element =>
      hostElement?.partConnectedCallback?.(name, element),
    )

    nodeCallback(removedNodes, host, selector, element =>
      hostElement?.partDisconnectedCallback?.(name, element),
    )
  }
}

/**
 * @param {HTMLElement | ShadowRoot} host
 * @param {{addedNodes?: Element[]}} param1
 */
export const commandMutationCallback = (host, { addedNodes } = {}) => {
  const selector = '[command]'

  addedNodes ??= findSelectors(host, selector)

  nodeCallback(addedNodes, host, selector, /** @param {HTMLButtonElement} element */ (element) => {
    if (!element.command) return
    if (!element.commandForElement) element.commandForElement = host?.host ?? host
  })
}
