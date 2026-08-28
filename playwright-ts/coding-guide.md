## Coding guide

### Formatting

- Always use braces `{ }` for `if` / `else` / `else if` / loop bodies, even single-statement ones. No brace-omission shortcuts (`if (x) return;`, `if (x) doThing();` on one line).
- Separate logical blocks inside a method body with a single blank line — group related statements together, blank-line between groups (e.g. setup → guard clause → action → assertion).
- Prefix boolean variables and boolean-returning fields with `is` / `has` / `should` / `can`. Examples: `isShown`, `isVisible`, `hasError`, `shouldRetry`. Avoid bare names like `shown`, `loaded`, `error` for booleans.

```ts
// bad
const shown = await this.input.isVisible();
if (!shown) return;
if (firstName) await this.input.fill(firstName);
await this.continueButton.click();

// good
const isShown = await this.input.isVisible();

if (!isShown) {
  return;
}

if (firstName !== undefined) {
  await this.input.fill(firstName);
}

await this.continueButton.click();
```

### Page objects and components

- Reuse existing page objects, fixtures, and helpers whenever the repo already models the page.
- Do not freeze raw selectors into specs if an existing page object should own them.
- When a UI area is complex, reusable, or likely to grow, create or extend a dedicated page object or component object for it.
- Prefer composition over expanding one page class indefinitely. Match repo patterns where a main page exposes composed sub-objects for tabs, drawers, modals, and similar sections.
- Prefer Playwright locators over XPath or fragile CSS selectors unless there is no stable user-facing alternative.
- Prefer user-facing locators first:
  - `getByRole`
  - `getByLabel`
  - `getByPlaceholder`
  - `getByText`
  - `getByTestId` — use whenever a stable test id exists, even on a parent/wrapper element. Chain down to the target with `.locator(...)`.
- When choosing between a long, easily-changed user-facing string (placeholder copy, button labels written in product copy) and a stable parent test id, prefer the parent test id. Walk up the DOM until you find a unique, stable test id and chain down.

```ts
// fragile — placeholder text may change with any copy edit
page.getByPlaceholder('Search by name or ID');

// resilient — parent test id is stable, .locator('input') reaches the target
page.getByTestId('search-field').locator('input');
```

- Use locator chaining and filtering to narrow scope instead of building brittle selectors.
- Avoid deprecated and discouraged playwright methods

```ts
const product = page.getByRole('listitem').filter({ hasText: 'Product 2' });

await page
  .getByRole('listitem')
  .filter({ hasText: 'Product 2' })
  .getByRole('button', { name: 'Add to cart' })
  .click();
```

- For new page-object or component methods that perform user actions, prefer wrapping the action with `test.step`.

```ts
async clickSubmit() {
  await test.step('user clicks "Submit"', async () => {
    await this.submitBtn.click();
  });
}
```

### Specs

- Avoid row locators in spec, get elements from page objects
- Keep the spec body concise and self-documenting.
- Prefer moving repeated UI interactions into page-object or helper methods.
- Avoid comments unless they add information the code cannot express clearly.
- Keep helper functions below the spec body when possible.
- Avoid unnecessary variables in the spec body. Create a variable when it improves readability or is reused.
- Prefer straightforward spec flow. Avoid loops, `if/else`, and `try/catch` in the spec body unless they clearly improve readability or are required by the scenario.
- Prefer not to add new `test.step` blocks in the spec body when page objects or helpers can carry that reporting.

### Assertions and matchers

- Use web-first assertions such as `await expect(locator).toBeVisible()` and `await expect(page).toHaveURL(...)`.

```ts
await expect(page.getByText('welcome'), 'should be shown welcome message').toBeVisible();
```

- If you need to assert the number of elements on the page, prefer `expect(locator).toHaveCount() ` to avoid flakiness
- Use custom expect messages when they clarify business intent.
- Use soft assertions when validating multiple related fields and collecting all failures from the section is useful.
- Mirror the nearest neighboring spec file's import and alias conventions for any shared matcher or assertion utilities, once such utilities exist in this repo.

### Documentation (JSDoc / TSDoc)

Standard for new code: any non-trivial public surface gets a short JSDoc block. Document **why, contract, side-effects** — not what (the name and signature already say what). Existing files don't need retroactive doc unless touched by an in-scope change.

- **Drop redundant type annotations.** TypeScript already encodes the type. Use `@param name description` (no `{type}`) and `@returns description` (no `{type}`). Type annotations in JSDoc go stale.
- **When to document:**
  - Public class / function / method that other files consume — IDE hover-doc earns its keep.
  - Method has a non-obvious side effect (network request, navigation, state mutation).
  - Method throws under specific conditions a caller should anticipate.
  - Return shape has a non-obvious contract (e.g. page-capped, only-current-tab, lossy-by-design).
- **When to skip:**
  - Constructors with no side effects.
  - Trivial getters / setters where the name speaks (`getValue`, `clear`).
  - Pure delegates (a `@see` reference is enough if anything).
  - Private helpers, unless they enforce a non-obvious invariant. Even then, an inline `// Why: …` next to the load-bearing line is often clearer than a block doc.
- **Tags worth using:**
  - `@param name description`
  - `@returns description`
  - `@throws description` — when the throw is part of the contract callers must handle/anticipate
  - `@remarks description` — elaboration after the summary
  - `@example` — for non-obvious usage only
  - `@deprecated` — with the recommended replacement
- **Style:**
  - Single declarative summary line first ("Opens the settings page", not "This function opens…").
  - Blank line, then `@tags` or elaboration.
  - Length proportionate to surface — a 5-line pure delegate gets one line, not ten.

```ts
/**
 * Fills the search input and waits for the results list to update.
 *
 * @returns rows currently rendered on the page (capped by page size). For the
 *   full match count, read the table's total-results indicator separately.
 * @throws if the search request's response contains an error payload.
 */
async search(query: string): Promise<Row[]> { /* ... */ }
```

## Flow Model Pattern (steps layer)

Standard for new e2e workflows that span more than one page or sequence several business actions. Three-layer architecture: **spec → steps (flow) → page object**. We use the name `steps` rather than `flow`, and `*.steps.ts` as the file suffix for new files following this pattern; the pattern itself is the same as the [Cloudflight Flow Model Pattern](https://engineering.cloudflight.io/choosing-the-right-test-automation-design-pattern-page-object-model-flow-model-pattern-or-screenplay-pattern).

This layer is for genuine cross-page or multi-step business workflows — not a mandatory layer for every spec. A spec that probes single-field, UI-mechanic-level behavior (one field filled with an interesting value, one inline error or one absent request asserted) talks to the page object directly; routing it through a steps class would obscure exactly what it's testing. Use the table below to tell which a given scenario needs.

### Layer responsibilities

| Layer | Purpose | Vocabulary | Returns |
|---|---|---|---|
| Spec | Describes one scenario | Business intent | Asserts |
| Steps | Orchestrates a workflow | Business actions | Domain data / component objects |
| POM | Wraps UI mechanics | Click / fill / read | Locators / primitive values |

If the method's natural docstring uses business words ("complete checkout", "search the overview"), it's a **step**. If it uses UI words ("click submit", "fill credit card"), it's a **POM method**.

### Step class shape

```ts
import { Page, test } from '@playwright/test';
import { SomePage } from '../pages/some-page';

export class SomeFeatureSteps {
  private readonly page: Page;
  private readonly somePage: SomePage;

  constructor(page: Page) {
    this.page = page;
    this.somePage = new SomePage(page);
  }

  async doBusinessThing(input: BusinessInput): Promise<BusinessOutput> {
    return await test.step(`do business thing for "${input.label}"`, async () => {
      // orchestrate POMs and helpers; return business-meaningful data
    });
  }
}
```

Rules:

- Constructor takes `Page`. Instantiates POMs as private fields.
- One public method per workflow. Wrap the body in `test.step(<business-language label>)`.
- Methods speak the domain. Return data the spec needs (a row, a status, a price). `Promise<void>` only when truly nothing to return.
- Stateless. Steps orchestrate; they do not own state.

### Common patterns

**Wait for backend, not for time.** Match by URL + method + a distinguishing field in the request body so concurrent calls don't false-match:

```ts
const responsePromise = this.page.waitForResponse((res) => {
  const req = res.request();
  if (!req.url().includes('/api/v2/auth/signup') || req.method() !== 'POST') return false;
  try {
    const body = JSON.parse(req.postData() ?? '');
    return body.email === expectedEmail;
  } catch {
    return false;
  }
}, { timeout: 60_000 });
await pom.submit();
const response = await responsePromise;
if (!response.ok()) throw new Error(`signup request failed: ${response.status()}`);
```

**Converge UI to backend response.** The network response resolves before the UI commits — reading the DOM the next tick can be stale. After awaiting the response, wait for a UI signal to settle:

```ts
await expect.poll(() => pom.getTotalResults(), { timeout: 10_000 }).toBe(expectedTotal);
```

**Return component objects, not raw data.** Lets specs call accessors as needed:

```ts
async search(query: string): Promise<TableRow[]> { /* ... */ }
// spec:
const [row] = await steps.search(query);
expect(await row.getStatus()).toBe('Approved');
```

### Anti-patterns

- ❌ `waitForResponse` / orchestration in the POM. POMs are reusable across workflows; steps own the sequencing. Exception: a shared `waitForOperation`-style helper may live on a POM when many sibling step methods need it — keep it narrowly scoped to waiting, not full orchestration.
- ❌ Business `expect(...)` inside step methods. Step-internal assertions cover workflow invariants only (response has no errors, table converged). Business assertions live in specs.
- ❌ Timer-based waits (`waitForTimeout`) when a real signal exists (response, locator state, event).
- ❌ Returning `Locator` or `Page` from steps. Return data, row/component objects, or domain enums.
- ❌ UI mechanics in step method names. `clickSearchButtonAndReadFirstRow` ✗. `search` ✓.
