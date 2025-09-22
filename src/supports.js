/**
 * @type {boolean}
 */
export const supportsCommand = 'command' in HTMLButtonElement.prototype
  && 'source' in ((globalThis.CommandEvent || {}).prototype || {})

/**
 * @type {boolean}
 */
export const supportsInterest = Object.prototype.hasOwnProperty.call(HTMLButtonElement.prototype,
  'interestForElement',
)

/**
 * @param {string} [name='is-supports']
 * @returns {boolean}
 */
export const supportsIs = (name = 'is-supports') => {
  class Element extends HTMLBRElement {}
  customElements.define(name, Element, { extends: 'br' })

  return document.createElement('br', { is: name }) instanceof Element
}
