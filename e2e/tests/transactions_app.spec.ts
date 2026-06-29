import { test, expect } from "@playwright/test";
import { resetDb } from "../helpers/resetDb";

test.describe("Transactions app", () => {
  test.beforeEach(async ({ page }) => {
    await resetDb()
    await page.goto("http://localhost:5173");
  });

  test("user can create income category", async ({ page }) => {
    await page.getByRole("button", { name: "Add Transaction" }).click();

    await page
      .getByRole("combobox", { name: "Select a category or create" })
      .click();

    await page
      .getByRole("combobox", { name: "Select a category or create" })
      .fill("New");

    await page.getByRole("option", { name: 'Create "new"' }).click();

    await page.getByRole("button", { name: "Save changes" }).click();

    await expect(page.getByText("Category new created successfully!")).toBeVisible();
  });

  test("user can create expense category", async ({ page }) => {
    await page.getByRole("button", { name: "Add Transaction" }).click();

    await page
      .getByRole("combobox", { name: "Select a category or create" })
      .click();

    await page
      .getByRole("combobox", { name: "Select a category or create" })
      .fill("New");

    await page.getByRole("option", { name: 'Create "new"' }).click();

    await page.getByRole('radio', { name: 'Expense' }).click();

    await page.getByRole("button", { name: "Save changes" }).click();

    await expect(page.getByText("Category new created successfully!")).toBeVisible();
  });

  test("user can create an expense transaction", async ({ page }) => {
    await page.getByRole("button", { name: "Add Transaction" }).click();

    await page.getByRole("spinbutton", { name: "Amount" }).fill("100");
    await page.getByRole("textbox", { name: "Description" }).fill("Test expense");

    await page
      .getByRole("combobox", { name: "Select a category or create" })
      .click();

    await page
      .getByRole("combobox", { name: "Select a category or create" })
      .fill("new");

    await page.getByRole("option", { name: "new" }).click();

    await page.getByRole("radio", { name: "Expense" }).click();

    await page.getByRole("button", { name: "Save changes" }).click();

    await expect(page.getByText("New category" )).toBeHidden();

    await page.getByRole("button", { name: "Save changes" }).click();

    await expect(page.getByText("Saving...")).toBeVisible();

    await expect(page.getByText("Create new transaction")).toBeHidden();
  });

    test("user can edit a transaction", async ({ page }) => {});

    test("user can delete a transaction", async ({ page }) => {});

    test.afterAll(async () => {
      await resetDb()
    });
});
