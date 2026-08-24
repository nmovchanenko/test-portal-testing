## Coding guide

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
  - `getByTestId` only when a stable test id already exists
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
