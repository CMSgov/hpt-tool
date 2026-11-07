import { afterEach, expect, test } from "vitest"
import React from "react"
import { createRoot } from "react-dom/client"
import { act } from "react-dom/test-utils"

import OnlineValidator from "../../src/pages/online-validator.jsx"

// jsdom does not implement object URLs, and the results panel builds one
window.URL.createObjectURL = () => "blob:test"
// jsdom does not implement scrollIntoView, which the results panel calls once it renders
window.Element.prototype.scrollIntoView = () => {}

let container

afterEach(() => {
  if (container) {
    document.body.removeChild(container)
    container = null
  }
  window.sessionStorage.clear()
})

const selectFile = async (name) => {
  container = document.createElement("div")
  document.body.appendChild(container)
  const root = createRoot(container)
  await act(async () => {
    root.render(<OnlineValidator />)
  })

  const input = container.querySelector('input[type="file"]')
  const file = new File(["hospital,price\n"], name, { type: "text/plain" })
  Object.defineProperty(input, "files", { value: [file] })

  await act(async () => {
    input.dispatchEvent(new Event("change", { bubbles: true }))
  })
  // the csv path validates asynchronously, so let it settle before reading the page
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 200))
  })

  return container.textContent
}

test("a file the validator cannot dispatch on does not leave the page processing", async () => {
  const text = await selectFile("123456789_test_standardcharges.csv.txt")
  expect(text).not.toContain("Your file is processing")
  expect(text).toContain("something preventing your file from being machine")
})

test("a csv the validator can dispatch on still gets validated", async () => {
  const text = await selectFile("123456789_test_standardcharges.csv")
  expect(text).not.toContain("Your file is processing")
  expect(text).not.toContain("something preventing your file from being machine")
})
