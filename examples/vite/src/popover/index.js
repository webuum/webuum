import { supportsAnchor } from '../utils.js'

/**
 * @param {HTMLElement | Element} referenceElement
 * @param {HTMLElement | Element} floatingElement
 * @param {import("@floating-ui/utils").Placement | string} placement
 * @param {import("@floating-ui/dom").ComputePositionConfig} options
 * @returns Promise<void>
 */
export const computePositionPopover = async (referenceElement, floatingElement, placement, options = {}) => {
  const { computePosition, flip } = await import('@floating-ui/dom')

  const middleware = options === true ? [flip()] : []

  floatingElement.classList.remove(floatingElement.$currentPlacement ?? placement)
  floatingElement.style.setProperty('--anchor-size', !supportsAnchor ? `${referenceElement.offsetWidth}px` : '')

  await computePosition(referenceElement, floatingElement, {
    middleware,
    placement,
    ...options,
  }).then(({ x, y, placement }) => {
    floatingElement.style.inset = !supportsAnchor && `${y}px auto auto ${x}px`
    floatingElement.classList.add(placement)
    floatingElement.$currentPlacement = placement
  })
}

/**
 * @param {HTMLElement | Element} referenceElement
 * @param {HTMLElement | Element} floatingElement
 * @param {import("@floating-ui/utils").Placement | string} [placement]
 * @param {import("@floating-ui/dom").ComputePositionConfig} [options={}]
 * @returns Promise<() => void>
 */
export const autoUpdatePopover = async (referenceElement, floatingElement, placement, options) => {
  const { autoUpdate } = await import('@floating-ui/dom')

  return autoUpdate(referenceElement, floatingElement, () =>
    computePositionPopover(referenceElement, floatingElement, placement, options),
  )
}
