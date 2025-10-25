export function defineCommand(host: HTMLElement | ShadowRoot, replacer?: (match: string) => string): void;
export function defineParts(host: HTMLElement | ShadowRoot, parts?: Record<string, string | null>): Record<string, string | null>;
export function defineHostObserver<T extends any[]>(host: HTMLElement | ShadowRoot, callback: (...args: [...T, MutationRecord?]) => void, arg: T): void;
export function definePartsObserver(host: HTMLElement | ShadowRoot, parts?: Record<string, string | null>): void;
export function defineCommandObserver(host: HTMLElement | ShadowRoot): void;
export function defineProps(host: HTMLElement, props?: Record<string, unknown>): Record<string, unknown>;
export function initializeController(host: HTMLElement): void;
export class WebuumElement extends HTMLElement {
    /**
     * @param {string} name
     * @param {HTMLElement} [addedElement]
     * @param {HTMLElement} [removedElement]
     * @returns {void}
     */
    partMutationCallback(name: string, addedElement?: HTMLElement, removedElement?: HTMLElement): void;
}
//# sourceMappingURL=index.d.ts.map