// Teach TypeScript about the jest-dom matchers that `setup.ts` installs.
//
// @testing-library/jest-dom (7.0.1) declares them for vitest in two ways, and vitest 5 fits neither:
// its `declare module 'vitest' { interface Assertion<T = any> }` no longer merges with vitest's own
// `Assertion<R, T>` (two type parameters now), and the global `jest.Matchers` interface it also
// augments is no longer what vitest's assertions extend. `skipLibCheck` hides both mismatches, so
// the matchers simply vanish from the types while the tests keep passing at runtime.
//
// `Matchers` is vitest's documented extension point (https://vitest.dev/guide/extending-matchers);
// `Assertion`, `ExpectStatic`, and `AsymmetricMatchersContaining` all extend it. The type parameters
// have to repeat vitest's declaration exactly, or the augmentation is dropped again - which is why
// this is a .ts file and not a .d.ts: `skipLibCheck` would silence that mistake in a .d.ts.
//
// Drop this file once jest-dom ships types for vitest 5.
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module 'vitest' {
  // The first parameter of TestingLibraryMatchers only widens `text?: string | RegExp | E` on five
  // matchers, so that an asymmetric matcher can be passed there. `never` keeps those arguments at
  // `string | RegExp`, which is what we use; jest-dom itself passes `any` there.
  interface Matchers<R extends void | Promise<void> = void | Promise<void>, T = unknown>
    extends TestingLibraryMatchers<never, R> {}
}
