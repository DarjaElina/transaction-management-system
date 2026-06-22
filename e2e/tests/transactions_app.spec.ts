import { test, expect } from "@playwright/test";

test.describe("Transactions app", () => {
  test.beforeEach(async ({ page }) => {
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


  });

  test("user can create expense category", async ({ page }) => {});

  //   test("user can create an expense transaction", async ({ page }) => {});

  //   test("new transaction appears in the list", async ({ page }) => {});

  //   test("user can edit a transaction", async ({ page }) => {});

  //   test("user can delete a transaction", async ({ page }) => {});
});
