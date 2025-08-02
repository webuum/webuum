import { localName, partSelector, partsMutationCallback, querySelector, typecast } from './src/utils.js'

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

export const defineParts = (host, parts = {}) => {
  for (let [name, selector] of Object.entries(parts)) {
    selector = partSelector(name, selector, localName(host))

    Object.defineProperty(host?.host ?? host, name, {
      get: () => {
        const queryPart = querySelector(host, selector, localName(host))

        return queryPart?.length > 1 ? queryPart : queryPart?.[0] || null
      },
    })
  }

  return parts
}

export const definePartsObserver = (host, parts = {}) => {
  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      if (mutation.type !== 'childList') return

      partsMutationCallback(host, parts, mutation)
    }
  })

  partsMutationCallback(host, parts, {
    addedNodes: host.querySelectorAll(`[${host.localName ? `data-${localName(host?.host ?? host)}-` : ''}part]`),
  })

  observer.observe(host, {
    childList: true,
    subtree: true,
  })
}

export const defineProps = (host, props = {}) => {
  for (let [name, value] of Object.entries(props)) {
    Object.defineProperty(host, name, {
      get: () => {
        const attribute = host.dataset[name.slice(1)]

        return attribute ? typecast(attribute) : value
      },
      set: (value) => {
        host.dataset[name.slice(1)] = value
      },
    })
  }

  return props
}

export const initializeController = (host) => {
  defineCommand(host)

  defineParts(host, host.constructor.parts)
  defineProps(host, host.constructor.props)

  definePartsObserver(host, host.constructor.parts)
}

export class WebuumElement extends HTMLElement {
  constructor() {
    super()

    initializeController(this)
  }
}
