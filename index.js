import { partSelector, querySelector, typecast } from './src/utils.js'

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
    const isArray = Array.isArray(selector)

    selector = partSelector(name, isArray ? selector[0] : selector, host.nodeName)

    Object.defineProperty(host, name, {
      get: () => {
        const queryPart = querySelector(host, selector)

        return isArray ? queryPart : queryPart[0] || null
      },
    })
  }
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
}

export const initializeController = (host) => {
  defineCommand(host)

  defineParts(host, host.constructor.parts)
  defineProps(host, host.constructor.props)
}

export class WebuumElement extends HTMLElement {
  constructor() {
    super()

    initializeController(this)
  }
}
