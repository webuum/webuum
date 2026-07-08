declare module 'webuum' {
	export function defineCommand(host: HTMLElement | ShadowRoot, replacer?: (match: string) => string): void;
	export function defineParts(host: HTMLElement | ShadowRoot, parts?: Record<string, string | null>): Record<string, string | null>;
	export function defineObserver(host: HTMLElement | ShadowRoot, parts?: Record<string, string | null>): void;
	export function defineProps(host: HTMLElement, props?: Record<string, unknown>): Record<string, unknown>;
	export function defineSignal(host: HTMLElement): void;
	export function defineElement(host: HTMLElement): void;
	export class WebuumElement extends HTMLElement {
		disconnectedCallback(): void;
	}

	export {};
}

declare module 'webuum/elements' {
	export function WebuumLazyElement<T extends CustomElementConstructor>(Element: T): T;

	export {};
}

declare module 'webuum/observers' {
	export function defineIntersectionObserver(host: HTMLElement, options?: IntersectionObserverInit): IntersectionObserver;

	export {};
}

declare module 'webuum/supports' {
	export const supportsCommand: boolean;

	export const supportsInterest: boolean;
	export function supportsIs(name?: string): boolean;

	export {};
}

declare module 'webuum/utils' {
	export function typecast(value: string): unknown;
	export function getLocalName(host: HTMLElement): string;
	export function getPartSelector(name: string, selector: string, localName: string): string;
	export function findSelectors(node: HTMLElement | ShadowRoot, selector: string, host?: HTMLElement | ShadowRoot): Element[];
	export function partsMutationCallback(host: HTMLElement | ShadowRoot, parts: Record<string, string | null>, { addedNodes, removedNodes }?: {
		addedNodes?: Element[];
		removedNodes?: Element[];
	}): void;
	export function commandMutationCallback(host: HTMLElement | ShadowRoot, { addedNodes }?: {
		addedNodes?: Element[];
	}): void;

	export {};
}

declare module 'webuum' {
	export interface WebuumElement {
		/** Lifecycle-bound `AbortController`, aborted on disconnect. */
		$controller: AbortController | undefined;
		/** Lifecycle-bound `AbortSignal` for `addEventListener`, recreated after abort. */
		$signal: AbortSignal;
		/** Called when a matching part is added to the host. */
		partConnectedCallback?(name: string, element: Element): void;
		/** Called when a matching part is removed from the host. */
		partDisconnectedCallback?(name: string, element: Element): void;
	}
}

declare module 'webuum' {
	export interface WebuumElement {
		/** Called by `defineIntersectionObserver` on each observed change. */
		intersectCallback?(entry: IntersectionObserverEntry): void;
	}
}

//# sourceMappingURL=index.d.ts.map