import {
  commandMutationCallback,
  getLocalName,
  getPartSelector,
  partsMutationCallback,
  findSelectors,
  typecast,
} from './src/utils.js'

/**
 * @param {HTMLElement | ShadowRoot} host
 * @param {(match: string) => string} [replacer]
 * @returns {void}
 */
export const defineCommand = (host, replacer = c => c[1].toUpperCase()) => {
  host.addEventListener('command', /** @param {{source: HTMLButtonElement} & CommandEvent} e */ (e) => {
    e.preventDefault()

    e.source.$value = typecast(e.source?.value)

    const method = e.command
      .replace(/^--/, '')
      .replace(/-\w/g, replacer)

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
        const queryPart = findSelectors(host, selector)

        return queryPart[1] ? queryPart : queryPart[0] || null
      },
    })
  }

  return parts
}

/**
 * @param {HTMLElement | ShadowRoot} host
 * @param {Record<string, string | null>} [parts={}]
 * @returns {void}
 */
export const defineObserver = (host, parts = {}) => {
  /** @param {MutationRecord} [mutation] */
  const callback = (mutation) => {
    partsMutationCallback(host, parts, mutation)
    commandMutationCallback(host, mutation)
  }

  new MutationObserver(mutationList => mutationList.forEach(callback)).observe(host, {
    childList: true,
    subtree: true,
  })

  callback()
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
export const defineSignal = (host) => {
  Object.defineProperty(host, '$signal', {
    get: () => {
      if (host.$controller?.signal.aborted ?? true) host.$controller = new AbortController()

      return host.$controller.signal
    },
  })
}

/**
 * @param {HTMLElement} host
 * @returns {void}
 */
export const defineElement = (host) => {
  const { parts, props } = /** @type {{parts?: Record<string, string | null>, props?: Record<string, unknown>}} */host.constructor

  defineCommand(host)
  defineParts(host, parts)
  defineProps(host, props)
  defineObserver(host, parts)
  defineSignal(host)
}

export class WebuumElement extends HTMLElement {
  constructor() {
    super()

    defineElement(this)
  }

  disconnectedCallback() {
    this.$controller?.abort()
  }
}
