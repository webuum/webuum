import { supportsAnchor } from '../utils.ts'
import type { ComputePositionConfig } from '@floating-ui/dom'
import type { Placement } from '@floating-ui/utils'

export const computePositionPopover = async (
  referenceElement: HTMLElement,
  floatingElement: HTMLElement & { $currentPlacement?: string },
  placement: Placement,
  options: ComputePositionConfig | boolean = {},
): Promise<void> => {
  const { computePosition, flip } = await import('@floating-ui/dom')

  const autoUpdate = options === true
  const middleware = autoUpdate ? [flip()] : []

  floatingElement.classList.remove(floatingElement.$currentPlacement ?? placement)
  floatingElement.style.setProperty('--anchor-size', !supportsAnchor ? `${referenceElement.offsetWidth}px` : '')

  await computePosition(referenceElement, floatingElement, {
    middleware,
    placement,
    ...(autoUpdate ? {} : options),
  }).then(({ x, y, placement }) => {
    floatingElement.style.inset = !supportsAnchor ? `${y}px auto auto ${x}px` : ''
    floatingElement.classList.add(placement)
    floatingElement.$currentPlacement = placement
  })
}

export const autoUpdatePopover = async (
  referenceElement: HTMLElement,
  floatingElement: HTMLElement,
  placement: Placement,
  options: ComputePositionConfig | boolean = {},
): Promise<() => void> => {
  const { autoUpdate } = await import('@floating-ui/dom')

  return autoUpdate(referenceElement, floatingElement, () =>
    computePositionPopover(referenceElement, floatingElement, placement, options),
  )
}
