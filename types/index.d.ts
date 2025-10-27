declare module 'webuum' {
	export function defineCommand(host: HTMLElement | ShadowRoot, replacer?: (match: string) => string): void;
	export function defineParts(host: HTMLElement | ShadowRoot, parts?: Record<string, string | null>): Record<string, string | null>;
	export function defineHostObserver<T extends any[]>(host: HTMLElement | ShadowRoot, callback: (...args: [...T, MutationRecord?]) => void, arg: T): void;
	export function definePartsObserver(host: HTMLElement | ShadowRoot, parts?: Record<string, string | null>): void;
	export function defineCommandObserver(host: HTMLElement | ShadowRoot): void;
	export function defineProps(host: HTMLElement, props?: Record<string, unknown>): Record<string, unknown>;
	export function initializeController(host: HTMLElement): void;
	export class WebuumElement extends HTMLElement {
		
		partConnectedCallback(name: string, element: HTMLElement): void;
		
		partDisconnectedCallback(name: string, element: HTMLElement): void;
	}

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

//# sourceMappingURL=index.d.ts.map