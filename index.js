import {
  commandMutationCallback,
  getLocalName,
  getPartSelector,
  partsMutationCallback,
  querySelector,
  typecast,
} from './src/utils.js'

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

export const definePartsObserver = (host, parts = {}) => {
  defineHostObserver(host, partsMutationCallback, [host, parts])
}

export const defineCommandObserver = (host) => {
  defineHostObserver(host, commandMutationCallback, [host])
}

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

export const initializeController = (host) => {
  defineCommand(host)
  defineCommandObserver(host)

  defineParts(host, host.constructor.parts)
  definePartsObserver(host, host.constructor.parts)

  defineProps(host, host.constructor.props)
}

export class WebuumElement extends HTMLElement {
  constructor() {
    super()

    initializeController(this)
  }
}
