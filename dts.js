import { readFileSync, writeFileSync } from 'node:fs'
import { createBundle } from 'dts-buddy'

const output = 'types/index.d.ts'

await createBundle({
  project: 'tsconfig.json',
  output,
  modules: {
    'webuum': 'index.js',
    'webuum/observers': 'src/observers/index.js',
    'webuum/supports': 'src/supports.js',
    'webuum/utils': 'src/utils.js',
  },
})

// `$controller`/`$signal` are installed at runtime by `defineSignal`, so they are
// declared here as a type-only augmentation — keeping them out of the bundle.
// Appended after the last module to leave existing source-map offsets intact.
const augmentation = `declare module 'webuum' {
\texport interface WebuumElement {
\t\t/** Lifecycle-bound \`AbortController\`, aborted on disconnect. */
\t\t$controller: AbortController | undefined;
\t\t/** Lifecycle-bound \`AbortSignal\` for \`addEventListener\`, recreated after abort. */
\t\t$signal: AbortSignal;
\t\t/** Called when a matching part is added to the host. */
\t\tpartConnectedCallback?(name: string, element: Element): void;
\t\t/** Called when a matching part is removed from the host. */
\t\tpartDisconnectedCallback?(name: string, element: Element): void;
\t}
}

declare module 'webuum' {
\texport interface WebuumElement {
\t\t/** Called by \`defineIntersectionObserver\` on each observed change. */
\t\tintersect?(entry: IntersectionObserverEntry): void;
\t}
}

`

const dts = readFileSync(output, 'utf8')
writeFileSync(output, dts.replace('//# sourceMappingURL', `${augmentation}//# sourceMappingURL`))
