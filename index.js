import {
  commandMutationCallback,
  getLocalName,
  getPartSelector,
  partsMutationCallback,
  querySelector,
  typecast,
} from './src/utils.js'

/**
 * @param {HTMLElement | ShadowRoot} host
 * @param {(match: string) => string} [replacer]
 * @returns {void}
 */
export const defineCommand = (host, replacer = c => c[1].toUpperCase()) => {
  host.addEventListener('command', (e) => {
    e.preventDefault()

    e.source.$value = typecast(e.source?.value)

    const method = e.command
      .replace(/^--/, '')
      .replace(/(-\w)/g, replacer)

    if (method in host) host[method](e)
  })
}

/**
 * @param {HTMLElement | ShadowRoot} host
 * @param {Record<string, string | null>} [parts={}]
 * @returns {Record<string, string | null>}
 */
export const defineParts = (host, parts = {}) => {
  const localName = getLocalName(host)

  for (let [name, selector] of Object.entries(parts)) {
    selector = getPartSelector(name, selector, localName)

    Object.defineProperty(host?.host ?? host, name, {
      get: () => {
        const queryPart = querySelector(host, selector)

        return queryPart?.[1] ? queryPart : queryPart?.[0] || null
      },
    })
  }

  return parts
}

/**
 * @template {any[]} T
 * @param {HTMLElement | ShadowRoot} host
 * @param {(...args: [...T, MutationRecord?]) => void} callback
 * @param {T} arg
 * @returns {void}
 */
export const defineHostObserver = (host, callback, arg) => {
  new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList') callback(...arg, mutation)
    }
  }).observe(host, {
    childList: true,
    subtree: true,
  })

  callback(...arg)
}

/**
 * @param {HTMLElement | ShadowRoot} host
 * @param {Record<string, string | null>} [parts={}]
 * @returns {void}
 */
export const definePartsObserver = (host, parts = {}) => {
  defineHostObserver(host, partsMutationCallback, [host, parts])
}

/**
 * @param {HTMLElement | ShadowRoot} host
 * @returns {void}
 */
export const defineCommandObserver = (host) => {
  defineHostObserver(host, commandMutationCallback, [host])
}

/**
 * @param {HTMLElement} host
 * @param {Record<string, unknown>} [props={}]
 * @returns {Record<string, unknown>}
 */
export const defineProps = (host, props = {}) => {
  for (let [name, value] of Object.entries(props)) {
    const key = name.slice(1)

    Object.defineProperty(host, name, {
      get: () => {
        const attribute = host.dataset[key]

        return attribute ? typecast(attribute) : value
      },
      set: (value) => {
        host.dataset[key] = value
      },
    })
  }

  return props
}

/**
 * @param {HTMLElement} host
 * @returns {void}
 */
export const initializeController = (host) => {
  const parts = /** @type {{parts?: Record<string, string | null>}} */host.constructor?.parts
  const props = /** @type {{props?: Record<string, unknown>}} */host.constructor.props

  defineCommand(host)
  defineCommandObserver(host)

  defineParts(host, parts)
  definePartsObserver(host, parts)

  defineProps(host, props)
}

/**
 * @augments {HTMLElement}
 */
export class WebuumElement extends HTMLElement {
  constructor() {
    super()

    initializeController(this)
  }
}
